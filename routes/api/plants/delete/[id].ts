import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/client.ts";
import { plants } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  async DELETE(_req, ctx) {
    try {
      const id = Number(ctx.params.id);
      
      if (isNaN(id)) {
        return new Response(JSON.stringify({ error: "Invalid plant ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Check if the plant exists
      const plantExists = await db.query.plants.findFirst({
        where: eq(plants.id, id)
      });

      if (!plantExists) {
        return new Response(JSON.stringify({ error: "Plant not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Delete the plant
      await db.delete(plants).where(eq(plants.id, id));

      return new Response(JSON.stringify({ success: true, message: "Plant deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error deleting plant:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to delete plant", 
        details: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
