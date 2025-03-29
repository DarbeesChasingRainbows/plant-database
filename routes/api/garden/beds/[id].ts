import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  // GET a specific garden bed
  async GET(_, ctx) {
    const { id } = ctx.params;
    try {
      const bed = await db
        .select()
        .from(gardenBeds)
        .where(eq(gardenBeds.bedId, parseInt(id)));
        
      if (bed.length === 0) {
        return new Response(JSON.stringify({ error: "Bed not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(bed[0]), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  // PUT to update a garden bed
  async PUT(req, ctx) {
    const { id } = ctx.params;
    try {
      const body = await req.json();
      const result = await db
        .update(gardenBeds)
        .set(body)
        .where(eq(gardenBeds.bedId, parseInt(id)))
        .returning();
        
      if (result.length === 0) {
        return new Response(JSON.stringify({ error: "Bed not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(result[0]), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
  
  // DELETE a garden bed
  async DELETE(_, ctx) {
    const { id } = ctx.params;
    try {
      const result = await db
        .delete(gardenBeds)
        .where(eq(gardenBeds.bedId, parseInt(id)))
        .returning();
        
      if (result.length === 0) {
        return new Response(JSON.stringify({ error: "Bed not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
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
