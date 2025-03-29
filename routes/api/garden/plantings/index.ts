import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { plantings, plantingPlants } from "../../../../utils/schema.ts";
import { eq as _eq } from "drizzle-orm";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const allPlantings = await db.select().from(plantings).orderBy(plantings.plantingDate);
      
      return new Response(JSON.stringify(allPlantings), {
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
  
  async POST(req, _ctx) {
    try {
      const body = await req.json();
      
      // Extract companion plants if present
      const companionPlants = body.companionPlants || [];
      delete body.companionPlants;
      
      // Set timestamps
      const now = new Date();
      body.createdAt = now;
      body.updatedAt = now;
      
      // Begin transaction to ensure all operations succeed or fail together
      const result = await db.transaction(async (tx) => {
        // Insert the new planting
        const [newPlanting] = await tx.insert(plantings).values(body).returning();
        
        // Insert companion plants if any
        if (companionPlants.length > 0) {
          const plantingId = newPlanting.plantingId;
          
          // Prepare companion plants data with timestamps
          const companionPlantsData = companionPlants.map((plant: {
            plantId: number;
            quantity: number;
            xPosition: number;
            yPosition: number;
            notes: string;
          }) => ({
            plantingId,
            plantId: plant.plantId,
            quantity: plant.quantity,
            xPosition: plant.xPosition,
            yPosition: plant.yPosition,
            notes: plant.notes,
            createdAt: now,
            updatedAt: now
          }));
          
          // Insert all companion plants
          await tx.insert(plantingPlants).values(companionPlantsData);
        }
        
        return newPlanting;
      });
      
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: unknown) {
      console.error("Error creating planting:", error);
      
      // Check for specific error types
      if (error instanceof Error && error.message.includes("duplicate key value")) {
        return new Response(JSON.stringify({ 
          error: "A planting with these details already exists." 
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
