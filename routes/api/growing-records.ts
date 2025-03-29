// routes/api/growing-records.ts
import { Router } from "https://deno.land/x/oak/mod.ts";
import { GrowingRecord } from "../../types/index.ts";
import pool from "../..//utils/db.ts"; // Assume you have a DB pool setup

const router = new Router();

router.post("/api/growing-records", async (context) => {
  const body = await context.request.body({ type: "json" }).value;
  const record: GrowingRecord = body;

  try {
    const conn = await pool.connect();
    try {
      const result = await conn.queryObject(
        `INSERT INTO growing_records
          (plant_id, planting_method, quantity_planted, spacing_cm, depth_cm, area_sqm, notes, layout, planting_area, row_lines)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        record.plant_id,
        record.planting_method,
        record.quantity_planted,
        record.spacing_cm,
        record.depth_cm,
        record.area_sqm,
        record.notes,
        record.layout,
        record.planting_area,
        record.row_lines,
      );

      context.response.status = 201;
      context.response.body = result.rows[0];
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error(error);
    context.response.status = 500;
    context.response.body = { message: "Internal Server Error" };
  }
});

export default router;
