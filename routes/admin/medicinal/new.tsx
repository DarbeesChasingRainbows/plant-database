import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { db } from "../../../utils/db.ts";
import { medicinalProperties, plants } from "../../../utils/schema.ts";

interface NewMedicinalPropertyData {
  error?: string;
  plants?: Array<{
    id: number;
    botanicalName: string;
  }>;
}

export const handler: Handlers<NewMedicinalPropertyData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const plantId = parseInt(form.get("plantId")?.toString() || "0");
      const traditionalUses = form.get("traditionalUses")?.toString() || null;
      const drugInteractions = form.get("drugInteractions")?.toString() || null;
      const safetyNotes = form.get("safetyNotes")?.toString() || null;
      const preparationMethods = form.get("preparationMethods")?.toString() || null;
      const dosageGuidelines = form.get("dosageGuidelines")?.toString() || null;

      if (!plantId) {
        return ctx.render({ error: "Plant is required" });
      }

      // Use Drizzle ORM to insert the new medicinal property
      const [newProperty] = await db.insert(medicinalProperties).values({
        plantId,
        traditionalUses,
        drugInteractions,
        safetyNotes,
        preparationMethods,
        dosageGuidelines,
      }).returning();

      // Redirect to the medicinal property details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/medicinal/${newProperty.medPropId}` }
      });
    } catch (error) {
      console.error("Error creating medicinal property:", error);
      return ctx.render({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  },

  async GET(_, ctx) {
    try {
      // Fetch all plants for the dropdown
      const plantsList = await db.select({
        id: plants.id,
        botanicalName: plants.botanicalName,
      }).from(plants).orderBy(plants.botanicalName);

      return ctx.render({ plants: plantsList });
    } catch (error) {
      console.error("Error fetching plants:", error);
      return ctx.render({ error: "Failed to load plants", plants: [] });
    }
  },
};

export default function NewMedicinalPropertyPage({ data }: PageProps<NewMedicinalPropertyData>) {
  const { error, plants = [] } = data;

  return (
    <AdminLayout title="Add Medicinal Property" currentPath="/admin/medicinal">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Medicinal Property</h1>
        <a href="/admin/medicinal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Back to Medicinal Properties
        </a>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" action="/admin/medicinal/new" class="p-6 space-y-6">
          <div>
            <label for="plantId" class="block text-sm font-medium text-gray-700">
              Plant *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a plant</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.botanicalName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label for="traditionalUses" class="block text-sm font-medium text-gray-700">
              Traditional Uses
            </label>
            <textarea
              name="traditionalUses"
              id="traditionalUses"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="drugInteractions" class="block text-sm font-medium text-gray-700">
              Drug Interactions
            </label>
            <textarea
              name="drugInteractions"
              id="drugInteractions"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="safetyNotes" class="block text-sm font-medium text-gray-700">
              Safety Notes
            </label>
            <textarea
              name="safetyNotes"
              id="safetyNotes"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="preparationMethods" class="block text-sm font-medium text-gray-700">
              Preparation Methods
            </label>
            <textarea
              name="preparationMethods"
              id="preparationMethods"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="dosageGuidelines" class="block text-sm font-medium text-gray-700">
              Dosage Guidelines
            </label>
            <textarea
              name="dosageGuidelines"
              id="dosageGuidelines"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Save Medicinal Property
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
