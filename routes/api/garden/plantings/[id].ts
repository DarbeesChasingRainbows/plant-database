import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { plantings, plantingPlants } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const id = ctx.params.id;
      
      // Get the planting
      const planting = await db
        .select()
        .from(plantings)
        .where(eq(plantings.plantingId, parseInt(id)))
        .limit(1);
      
      if (planting.length === 0) {
        return new Response(JSON.stringify({ error: "Planting not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Get companion plants if any
      const companions = await db
        .select()
        .from(plantingPlants)
        .where(eq(plantingPlants.plantingId, parseInt(id)));
      
      // Combine the data
      const result = {
        ...planting[0],
        companionPlants: companions
      };
      
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  async PUT(req, ctx) {
    try {
      const id = ctx.params.id;
      const body = await req.json();
      
      // Extract companion plants if present
      const companionPlants = body.companionPlants || [];
      delete body.companionPlants;
      
      // Update timestamp
      body.updatedAt = new Date();
      
      // Remove createdAt if present to avoid overwriting it
      delete body.createdAt;
      
      // Begin transaction
      const result = await db.transaction(async (tx) => {
        // Update the planting
        await tx
          .update(plantings)
          .set(body)
          .where(eq(plantings.plantingId, parseInt(id)));
        
        // Handle companion plants
        if (companionPlants.length > 0) {
          // First delete existing companion plants
          await tx
            .delete(plantingPlants)
            .where(eq(plantingPlants.plantingId, parseInt(id)));
          
          // Then insert the new ones
          const now = new Date();
          const companionPlantsData = companionPlants.map((plant: {
            plantId: number;
            quantity: number;
            xPosition: number;
            yPosition: number;
            notes: string;
          }) => ({
            plantingId: parseInt(id),
            plantId: plant.plantId,
            quantity: plant.quantity,
            xPosition: plant.xPosition,
            yPosition: plant.yPosition,
            notes: plant.notes,
            createdAt: now,
            updatedAt: now
          }));
          
          if (companionPlantsData.length > 0) {
            await tx.insert(plantingPlants).values(companionPlantsData);
          }
        }
        
        // Get the updated planting
        const updatedPlanting = await tx
          .select()
          .from(plantings)
          .where(eq(plantings.plantingId, parseInt(id)))
          .limit(1);
        
        // Get the updated companion plants
        const updatedCompanions = await tx
          .select()
          .from(plantingPlants)
          .where(eq(plantingPlants.plantingId, parseInt(id)));
        
        return {
          ...updatedPlanting[0],
          companionPlants: updatedCompanions
        };
      });
      
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: unknown) {
      console.error("Error updating planting:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  async DELETE(_req, ctx) {
    try {
      const id = ctx.params.id;
      
      // Begin transaction
      await db.transaction(async (tx) => {
        // Delete companion plants first (due to foreign key constraint)
        await tx
          .delete(plantingPlants)
          .where(eq(plantingPlants.plantingId, parseInt(id)));
        
        // Then delete the planting
        await tx
          .delete(plantings)
          .where(eq(plantings.plantingId, parseInt(id)));
      });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
