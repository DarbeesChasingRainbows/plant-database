// routes/admin/plants/[id]/parts/edit.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantParts } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditPlantPartPageData {
  plant: Plant;
  partInfo: any;
}

export const handler: Handlers<EditPlantPartPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const partId = new URL(ctx.req.url).searchParams.get("partId");
    
    if (!partId) {
      return new Response("Plant part ID is required", { status: 400 });
    }
    
    // Validate that ids are valid numbers
    const plantId = parseInt(id);
    const plantPartId = parseInt(partId);
    
    if (isNaN(plantId) || isNaN(plantPartId)) {
      return new Response("Invalid plant ID or part ID", { status: 400 });
    }

    try {
      // Fetch the plant by ID
      const plant = await db.select().from(plants).where(
        eq(plants.id, plantId),
      ).execute();

      if (plant.length === 0) {
        return ctx.render(undefined);
      }

      // Map the database result to match the Plant interface
      const plantData: Plant = {
        id: plant[0].id,
        common_name: plant[0].commonName,
        botanical_name: plant[0].botanicalName,
        family: plant[0].family || "",
        genus: plant[0].genus || "",
        species: plant[0].species || "",
        description: plant[0].description || "",
        taxonomy: null,
        is_medicinal: Boolean(plant[0]?.isMedicinal ?? 0),
        is_food_crop: Boolean(plant[0]?.isFoodCrop ?? 0),
        created_at: plant[0].createdAt,
        updated_at: plant[0].updatedAt
      };

      // Fetch plant part information
      const partData = await db.select().from(plantParts).where(
        eq(plantParts.partId, plantPartId),
      ).execute();

      if (partData.length === 0) {
        // Redirect to the parts list if the part doesn't exist
        const headers = new Headers();
        headers.set("location", `/admin/plants/${plantId}/parts`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return ctx.render({
        plant: plantData,
        partInfo: partData[0],
      });
    } catch (error) {
      console.error("Error fetching plant part data:", error);
      return new Response("Error fetching plant part data", { status: 500 });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const plantId = parseInt(id);
    
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }

    try {
      const formData = await req.formData();
      
      // Extract form data
      const partId = formData.get("partId")?.toString();
      if (!partId) {
        return new Response("Missing plant part ID", { status: 400 });
      }

      const partName = formData.get("partName")?.toString() || "";
      const description = formData.get("description")?.toString() || null;
      const harvesting = formData.get("harvesting")?.toString() || null;
      const properties = formData.get("properties")?.toString() || null;
      const uses = formData.get("uses")?.toString() || null;
      const safety = formData.get("safety")?.toString() || null;
      const notes = formData.get("notes")?.toString() || null;

      // Update plant part in database
      await db.update(plantParts)
        .set({
          partName,
          description,
          harvesting,
          properties,
          uses,
          safety,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(plantParts.partId, parseInt(partId)))
        .execute();

      // Redirect to the plant parts page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/parts`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating plant part:", error);
      return new Response("Error updating plant part", { status: 500 });
    }
  },
};

export default function EditPlantPartPage({ data }: PageProps<EditPlantPartPageData>) {
  // Handle case where data is undefined (plant not found)
  if (!data) {
    return (
      <div class="p-4">
        <h1 class="text-2xl font-bold">Plant not found</h1>
        <p class="mt-2">The requested plant could not be found.</p>
        <a href="/admin/plants" class="text-blue-500 hover:underline mt-4 inline-block">
          Back to Plants
        </a>
      </div>
    );
  }

  const { plant, partInfo } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="parts"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Edit Plant Part</h1>
          <p class="text-gray-600">
            Modify information for {partInfo.partName} of {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
          <input type="hidden" name="partId" value={partInfo.partId} />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="partName">
                  Part Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="partName"
                  name="partName"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Leaves, Flowers, Roots"
                  value={partInfo.partName}
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Description of this plant part..."
                >{partInfo.description || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="harvesting">
                  Harvesting Information
                </label>
                <textarea
                  id="harvesting"
                  name="harvesting"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="When and how to harvest this plant part..."
                >{partInfo.harvesting || ""}</textarea>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="properties">
                  Properties
                </label>
                <textarea
                  id="properties"
                  name="properties"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Properties of this plant part..."
                >{partInfo.properties || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="uses">
                  Uses
                </label>
                <textarea
                  id="uses"
                  name="uses"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Common uses for this plant part..."
                >{partInfo.uses || ""}</textarea>
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="safety">
                  Safety Information
                </label>
                <textarea
                  id="safety"
                  name="safety"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Safety considerations, contraindications, etc..."
                >{partInfo.safety || ""}</textarea>
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any other relevant information..."
            >{partInfo.notes || ""}</textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/parts`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Plant Part
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
