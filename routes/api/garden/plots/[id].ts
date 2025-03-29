import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { plots, gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  // GET a specific garden plot
  async GET(_, ctx) {
    const { id } = ctx.params;
    try {
      const plot = await db
        .select()
        .from(plots)
        .where(eq(plots.plotId, parseInt(id)));
        
      if (plot.length === 0) {
        return new Response(JSON.stringify({ error: "Plot not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(plot[0]), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  // PUT to update a garden plot
  async PUT(req, ctx) {
    const { id } = ctx.params;
    try {
      const body = await req.json();
      
      // Clean up date fields before updating
      const cleanBody = { ...body };
      
      // Remove or format date fields properly
      delete cleanBody.createdAt;
      delete cleanBody.updatedAt;
      
      // Set updatedAt to current timestamp
      cleanBody.updatedAt = new Date();
      
      const result = await db
        .update(plots)
        .set(cleanBody)
        .where(eq(plots.plotId, parseInt(id)))
        .returning();
        
      if (result.length === 0) {
        return new Response(JSON.stringify({ error: "Plot not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(result[0]), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  // DELETE a garden plot
  async DELETE(_, ctx) {
    const { id } = ctx.params;
    const plotId = parseInt(id);
    
    try {
      // First check if there are any garden beds associated with this plot
      const associatedBeds = await db
        .select()
        .from(gardenBeds)
        .where(eq(gardenBeds.plotId, plotId));
      
      if (associatedBeds.length > 0) {
        return new Response(JSON.stringify({ 
          error: "Cannot delete plot with associated garden beds. Please remove the garden beds first." 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // If no associated beds, proceed with deletion
      const result = await db
        .delete(plots)
        .where(eq(plots.plotId, plotId))
        .returning();
        
      if (result.length === 0) {
        return new Response(JSON.stringify({ error: "Plot not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
