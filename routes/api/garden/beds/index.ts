import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  // GET all garden beds
  async GET(req) {
    try {
      const beds = await db.select().from(gardenBeds);
      return new Response(JSON.stringify(beds), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  // POST to create a new garden bed
  async POST(req) {
    try {
      const body = await req.json();
      const result = await db.insert(gardenBeds).values(body).returning();
      return new Response(JSON.stringify(result[0]), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
