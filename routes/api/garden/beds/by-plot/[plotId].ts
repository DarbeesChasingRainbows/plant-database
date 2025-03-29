import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../../utils/db.ts";
import { gardenBeds } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { plotId } = ctx.params;
    try {
      const beds = await db
        .select()
        .from(gardenBeds)
        .where(eq(gardenBeds.plotId, parseInt(plotId)));
        
      return new Response(JSON.stringify(beds), {
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
