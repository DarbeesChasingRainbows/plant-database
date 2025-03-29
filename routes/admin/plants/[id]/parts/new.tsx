import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../../components/AdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import dbConfig from "../../../../../utils/db.ts";
const { pool } = dbConfig; // D

interface PlantPartsPageData {
  plant: Plant;
}

export const handler: Handlers<PlantPartsPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const conn = await pool.connect();
    try {
      const result = await conn.queryObject<Plant>`
        SELECT * FROM plants WHERE plant_id = ${id}
      `;

      if (result.rows.length === 0) {
        return ctx.render(undefined);
      }

      return ctx.render({ plant: result.rows[0] });
    } finally {
      conn.release();
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const form = await req.formData();

    const conn = await pool.connect();
    try {
      await conn.queryObject`
        INSERT INTO plant_parts (
          plant_id,
          part_name,
          description,
          edible,
          harvest_guidelines,
          storage_requirements,
          processing_notes
        ) VALUES (
          ${id},
          ${form.get("part_name")},
          ${form.get("description")},
          ${form.get("edible") === "true"},
          ${form.get("harvest_guidelines")},
          ${form.get("storage_requirements")},
          ${form.get("processing_notes")}
        )
      `;

      return new Response("", {
        status: 303,
        headers: { Location: `/admin/plants/${id}` },
      });
    } finally {
      conn.release();
    }
  },
};

export default function NewPlantPart({ data }: PageProps<PlantPartsPageData>) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <AdminLayout currentPath="/admin/plants">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">
          Add Plant Part - {data.plant.common_name}
        </h1>

        <form method="POST" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Part Name
              <input
                type="text"
                name="part_name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Description
              <textarea
                name="description"
                rows={3}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </label>
          </div>

          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                name="edible"
                value="true"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span class="ml-2">Edible</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Harvest Guidelines
              <textarea
                name="harvest_guidelines"
                rows={3}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Storage Requirements
              <textarea
                name="storage_requirements"
                rows={3}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Processing Notes
              <textarea
                name="processing_notes"
                rows={3}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </label>
          </div>

          <div class="flex justify-end space-x-4">
            <a
              href={`/admin/plants/${data.plant.plant_id}`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Part
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
