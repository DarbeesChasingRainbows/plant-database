import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { db } from "../../../../utils/db.ts";
import { plantParts, plants } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditPlantPartData {
  part?: {
    partId: number;
    plantId: number;
    plantName: string;
    partName: string;
    description: string | null;
    edible: boolean;
    harvestGuidelines: string | null;
    storageRequirements: string | null;
    processingNotes: string | null;
  };
  plants?: Array<{
    id: number;
    botanicalName: string;
  }>;
  error?: string;
}

export const handler: Handlers<EditPlantPartData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const partId = parseInt(id);

    if (isNaN(partId)) {
      return ctx.render({ error: "Invalid plant part ID" });
    }

    try {
      // Fetch the plant part with plant details
      const results = await db.select({
        partId: plantParts.partId,
        plantId: plantParts.plantId,
        plantName: plants.botanicalName,
        partName: plantParts.partName,
        description: plantParts.description,
        edible: plantParts.edible,
        harvestGuidelines: plantParts.harvestGuidelines,
        storageRequirements: plantParts.storageRequirements,
        processingNotes: plantParts.processingNotes,
      })
      .from(plantParts)
      .leftJoin(plants, eq(plantParts.plantId, plants.id))
      .where(eq(plantParts.partId, partId))
      .limit(1);

      if (results.length === 0) {
        return ctx.render({ error: "Plant part not found" });
      }

      // Fetch all plants for the dropdown
      const plantsList = await db.select({
        id: plants.id,
        botanicalName: plants.botanicalName,
      }).from(plants).orderBy(plants.botanicalName);

      return ctx.render({ 
        part: results[0],
        plants: plantsList
      });
    } catch (error) {
      console.error("Error fetching plant part:", error);
      return ctx.render({ error: "Failed to fetch plant part details" });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const partId = parseInt(id);

    if (isNaN(partId)) {
      return ctx.render({ error: "Invalid plant part ID" });
    }

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

      // Update the plant part
      await db.update(plantParts)
        .set({
          plantId,
          partName,
          description,
          edible,
          harvestGuidelines,
          storageRequirements,
          processingNotes,
          updatedAt: new Date(),
        })
        .where(eq(plantParts.partId, partId));

      // Redirect to the plant part details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/parts/${partId}` }
      });
    } catch (error) {
      console.error("Error updating plant part:", error);
      return ctx.render({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  }
};

export default function EditPlantPartPage({ data }: PageProps<EditPlantPartData>) {
  const { part, plants = [], error } = data;

  if (error) {
    return (
      <AdminLayout title="Error" currentPath="/admin/parts">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
        <a href="/admin/parts" class="text-indigo-600 hover:text-indigo-900">
          &larr; Back to Plant Parts
        </a>
      </AdminLayout>
    );
  }

  if (!part) {
    return (
      <AdminLayout title="Loading..." currentPath="/admin/parts">
        <div>Loading plant part details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit ${part.partName}`} currentPath="/admin/parts">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Plant Part</h1>
        <div class="space-x-2">
          <a 
            href={`/admin/parts/${part.partId}`} 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            View Details
          </a>
          <a 
            href="/admin/parts" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to Parts
          </a>
        </div>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" action={`/admin/parts/edit/${part.partId}`} class="p-6 space-y-6">
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
                <option key={plant.id} value={plant.id} selected={plant.id === part.plantId}>
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
              value={part.partName}
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
            >{part.description || ""}</textarea>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="edible"
                name="edible"
                type="checkbox"
                value="true"
                checked={part.edible}
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
            >{part.harvestGuidelines || ""}</textarea>
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
            >{part.storageRequirements || ""}</textarea>
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
            >{part.processingNotes || ""}</textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Update Plant Part
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
