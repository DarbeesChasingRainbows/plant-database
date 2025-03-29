import { Handlers, PageProps } from "$fresh/server.ts";
import dbConfig from "../../utils/db.ts";
const { pool } = dbConfig; //

import { MedicinalProperty, Plant, PlantPart } from "../../types/index.ts";

interface PlantDetails extends Plant {
  parts: PlantPart[];
  medicinal_properties: MedicinalProperty[];
}

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const conn = await pool.connect();
    try {
      const result = await conn.queryObject`
        SELECT
          p.*,
          json_agg(DISTINCT pp.*) AS parts,
          json_agg(DISTINCT mp.*) AS medicinal_properties
        FROM plants p
        LEFT JOIN plant_parts pp ON p.plant_id = pp.plant_id
        LEFT JOIN medicinal_properties mp ON p.plant_id = mp.plant_id
        WHERE p.plant_id = ${id}
        GROUP BY p.plant_id
      `;

      if (result.rows.length === 0) {
        return ctx.render(null);
      }

      return ctx.render(result.rows[0] as PlantDetails);
    } finally {
      conn.release();
    }
  },
};

export default function PlantDetail(
  { data: plant }: PageProps<PlantDetails | null>,
) {
  if (!plant) {
    return <div>Plant not found</div>;
  }

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-3xl font-bold mb-2">{plant.common_name}</h1>
      <p class="text-xl text-gray-600 italic mb-4">{plant.botanical_name}</p>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Description</h2>
        <p>{plant.description}</p>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Plant Parts</h2>
        <div class="grid gap-4">
          {plant.parts.map((part) => (
            <div key={part.part_id} class="border p-4 rounded-lg">
              <h3 class="text-xl font-semibold mb-2">{part.part_name}</h3>
              <p class="mb-2">{part.description}</p>
              <h4 class="font-semibold">Harvest Guidelines</h4>
              <p class="mb-2">{part.harvest_guidelines}</p>
              <h4 class="font-semibold">Storage</h4>
              <p>{part.storage_requirements}</p>
            </div>
          ))}
        </div>
      </section>

      {plant.is_medicinal && plant.medicinal_properties && (
        <section class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Medicinal Properties</h2>
          <div class="border p-4 rounded-lg">
            <h3 class="font-semibold">Traditional Uses</h3>
            <p class="mb-2">{plant.medicinal_properties[0].traditional_uses}</p>
            <h3 class="font-semibold">Safety Notes</h3>
            <p class="mb-2">{plant.medicinal_properties[0].safety_notes}</p>
            <h3 class="font-semibold">Preparation Methods</h3>
            <p>{plant.medicinal_properties[0].preparation_methods}</p>
          </div>
        </section>
      )}
    </div>
  );
}
