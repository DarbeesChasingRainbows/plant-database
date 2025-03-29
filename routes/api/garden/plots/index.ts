import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { plots } from "../../../../utils/schema.ts";

export const handler: Handlers = {
  // POST to create a new garden plot
  async POST(req, _ctx) {
    try {
      const body = await req.json();
      
      // Clean up date fields before inserting
      const cleanBody = { ...body };
      
      // Set createdAt and updatedAt to current timestamp
      cleanBody.createdAt = new Date();
      cleanBody.updatedAt = new Date();
      
      const result = await db.insert(plots).values(cleanBody).returning();
      
      return new Response(JSON.stringify(result[0]), {
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
