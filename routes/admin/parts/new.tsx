import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { db } from "../../../utils/db.ts";
import { plantParts, plants } from "../../../utils/schema.ts";

interface NewPlantPartData {
  error?: string;
  plants?: Array<{
    id: number;
    botanicalName: string;
  }>;
}

export const handler: Handlers<NewPlantPartData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const plantId = parseInt(form.get("plantId")?.toString() || "0");
      const partName = form.get("partName")?.toString() || "";
      const description = form.get("description")?.toString() || null;
      const edible = form.get("edible") === "true";
      const harvestGuidelines = form.get("harvestGuidelines")?.toString() || null;
      const storageRequirements = form.get("storageRequirements")?.toString() || null;
      const processingNotes = form.get("processingNotes")?.toString() || null;

      if (!plantId) {
        return ctx.render({ error: "Plant is required" });
      }

      if (!partName) {
        return ctx.render({ error: "Part name is required" });
      }

      // Use Drizzle ORM to insert the new plant part
      const [newPart] = await db.insert(plantParts).values({
        plantId,
        partName,
        description,
        edible,
        harvestGuidelines,
        storageRequirements,
        processingNotes,
      }).returning();

      // Redirect to the plant part details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/parts/${newPart.partId}` }
      });
    } catch (error) {
      console.error("Error creating plant part:", error);
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

export default function NewPlantPartPage({ data }: PageProps<NewPlantPartData>) {
  const { error, plants = [] } = data;

  return (
    <AdminLayout title="Add Plant Part" currentPath="/admin/parts">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Plant Part</h1>
        <a href="/admin/parts" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Back to Plant Parts
        </a>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" action="/admin/parts/new" class="p-6 space-y-6">
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
            <label for="partName" class="block text-sm font-medium text-gray-700">
              Part Name *
            </label>
            <input
              type="text"
              name="partName"
              id="partName"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="edible"
                name="edible"
                type="checkbox"
                value="true"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="edible" class="font-medium text-gray-700">Edible</label>
              <p class="text-gray-500">Check if this plant part is edible</p>
            </div>
          </div>

          <div>
            <label for="harvestGuidelines" class="block text-sm font-medium text-gray-700">
              Harvest Guidelines
            </label>
            <textarea
              name="harvestGuidelines"
              id="harvestGuidelines"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="storageRequirements" class="block text-sm font-medium text-gray-700">
              Storage Requirements
            </label>
            <textarea
              name="storageRequirements"
              id="storageRequirements"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="processingNotes" class="block text-sm font-medium text-gray-700">
              Processing Notes
            </label>
            <textarea
              name="processingNotes"
              id="processingNotes"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Save Plant Part
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
