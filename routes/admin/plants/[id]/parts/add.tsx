// routes/admin/plants/[id]/parts/add.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantParts } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface AddPartPageData {
  plant: Plant;
}

export const handler: Handlers<AddPartPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    
    // Validate that id is a valid number
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
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

      return ctx.render({
        plant: plantData,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return new Response("Error fetching plant data", { status: 500 });
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
      const partName = formData.get("partName")?.toString() || "";
      const description = formData.get("description")?.toString() || null;
      const medicalUses = formData.get("medicalUses")?.toString() || null;
      const culinaryUses = formData.get("culinaryUses")?.toString() || null;
      const otherUses = formData.get("otherUses")?.toString() || null;
      const harvesting = formData.get("harvesting")?.toString() || null;

      // Validate required fields
      if (!partName) {
        return new Response("Part name is required", { status: 400 });
      }

      // Insert plant part into database
      await db.insert(plantParts).values({
        plantId,
        partName,
        description,
        medicalUses,
        culinaryUses,
        otherUses,
        harvesting
      }).execute();

      // Redirect to the plant parts listing page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/parts`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error adding plant part:", error);
      return new Response("Error adding plant part", { status: 500 });
    }
  },
};

export default function AddPartPage({ data }: PageProps<AddPartPageData>) {
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

  const { plant } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="parts"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Add Plant Part</h1>
          <p class="text-gray-600">
            Add a new plant part for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
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
              placeholder="e.g., Leaf, Root, Flower, Stem, Bark, etc."
            />
            <p class="mt-1 text-sm text-gray-500">The specific part of the plant.</p>
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
              placeholder="Describe the physical characteristics of this plant part..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="medicalUses">
                Medical Uses
              </label>
              <textarea
                id="medicalUses"
                name="medicalUses"
                rows={4}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe any medicinal applications of this plant part..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="culinaryUses">
                Culinary Uses
              </label>
              <textarea
                id="culinaryUses"
                name="culinaryUses"
                rows={4}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe any culinary applications of this plant part..."
              ></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="otherUses">
                Other Uses
              </label>
              <textarea
                id="otherUses"
                name="otherUses"
                rows={4}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe any other uses such as crafts, dyes, etc..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="harvesting">
                Harvesting Information
              </label>
              <textarea
                id="harvesting"
                name="harvesting"
                rows={4}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe when and how to harvest this plant part..."
              ></textarea>
            </div>
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
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Plant Part
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
