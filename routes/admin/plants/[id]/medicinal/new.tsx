import { Handlers, PageProps } from "$fresh/server.ts";
import dbConfig from "../../../../../utils/db.ts"; // Import default export
import AdminLayout from "../../../../../components/AdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";

const { pool } = dbConfig; // Destructure pool from default export

interface MedicinalPageData {
  plant: Plant;
  error?: string;
}

export const handler: Handlers<MedicinalPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const conn = await pool.connect();
    try {
      const result = await conn.queryObject<Plant>`
        SELECT * FROM plants WHERE plant_id = ${id}
      `;

      if (result.rows.length === 0) {
        return ctx.render({ error: "Plant not found" });
      }

      return ctx.render({ plant: result.rows[0] });
    } catch (error) {
      console.error("Error fetching plant:", error);
      return ctx.render({ error: "Failed to fetch plant data" });
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
        INSERT INTO medicinal_properties (
          plant_id,
          contraindications,
          drug_interactions,
          traditional_uses,
          safety_notes,
          preparation_methods,
          dosage_guidelines
        ) VALUES (
          ${id},
          ${form.get("contraindications")},
          ${form.get("drug_interactions")},
          ${form.get("traditional_uses")},
          ${form.get("safety_notes")},
          ${form.get("preparation_methods")},
          ${form.get("dosage_guidelines")}
        )
      `;

      return new Response("", {
        status: 303,
        headers: { Location: `/admin/plants/${id}` },
      });
    } catch (error) {
      console.error("Error saving medicinal properties:", error);
      const plant = await conn.queryObject<Plant>`
        SELECT * FROM plants WHERE plant_id = ${id}
      `;
      
      return ctx.render({ 
        plant: plant.rows[0], 
        error: "Failed to save medicinal properties" 
      });
    } finally {
      conn.release();
    }
  },
};

export default function NewMedicinalProperties(
  { data }: PageProps<MedicinalPageData>,
) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <AdminLayout currentPath="/admin/plants">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">
          Add Medicinal Properties - {data.plant.common_name}
        </h1>

        {data.error && (
          <div class="rounded-md bg-red-50 p-4 mb-6">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <div class="mt-2 text-sm text-red-700"><p>{data.error}</p></div>
              </div>
            </div>
          </div>
        )}

        <form method="POST" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Traditional Uses
              <textarea
                name="traditional_uses"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="List historical and traditional medicinal uses..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Contraindications
              <textarea
                name="contraindications"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="List any conditions or situations where this plant should not be used..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Drug Interactions
              <textarea
                name="drug_interactions"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="List known interactions with medications..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Safety Notes
              <textarea
                name="safety_notes"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="General safety information and precautions..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Preparation Methods
              <textarea
                name="preparation_methods"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Methods of preparation (teas, tinctures, poultices, etc.)..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Dosage Guidelines
              <textarea
                name="dosage_guidelines"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Specific dosage information for different preparations..."
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
              Save Medicinal Properties
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
