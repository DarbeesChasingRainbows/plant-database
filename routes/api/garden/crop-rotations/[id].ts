import { Handlers } from "$fresh/server.ts";
import { db } from "../../../../utils/db.ts";
import { cropRotations } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const id = ctx.params.id;
      
      const rotation = await db
        .select()
        .from(cropRotations)
        .where(eq(cropRotations.rotationId, parseInt(id)))
        .limit(1);
      
      if (rotation.length === 0) {
        return new Response(JSON.stringify({ error: "Crop rotation not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(rotation[0]), {
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
      
      // Update timestamp
      body.updatedAt = new Date();
      
      // Remove createdAt if present to avoid overwriting it
      delete body.createdAt;
      
      // Update the crop rotation
      await db
        .update(cropRotations)
        .set(body)
        .where(eq(cropRotations.rotationId, parseInt(id)));
      
      // Get the updated crop rotation
      const updatedRotation = await db
        .select()
        .from(cropRotations)
        .where(eq(cropRotations.rotationId, parseInt(id)))
        .limit(1);
      
      return new Response(JSON.stringify(updatedRotation[0]), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: unknown) {
      console.error("Error updating crop rotation:", error);
      
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
      
      // Delete the crop rotation
      await db
        .delete(cropRotations)
        .where(eq(cropRotations.rotationId, parseInt(id)));
      
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
