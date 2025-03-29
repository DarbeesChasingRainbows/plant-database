import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { cropRotations } from "../../../../utils/schema.ts";
import { eq as _eq } from "drizzle-orm";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const allRotations = await db.select().from(cropRotations).orderBy(cropRotations.year, cropRotations.season);
      
      return new Response(JSON.stringify(allRotations), {
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
      
      // Set timestamps
      const now = new Date();
      body.createdAt = now;
      body.updatedAt = now;
      
      // Insert the new crop rotation
      const [result] = await db.insert(cropRotations).values(body).returning();
      
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: unknown) {
      console.error("Error creating crop rotation:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Check for specific error types
      if (error instanceof Error && error.message.includes("duplicate key value")) {
        return new Response(JSON.stringify({ 
          error: "A crop rotation with these details already exists." 
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
