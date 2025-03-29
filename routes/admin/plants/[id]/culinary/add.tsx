// routes/admin/plants/[id]/culinary/add.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, culinaryUses } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface AddCulinaryPageData {
  plant: Plant;
}

export const handler: Handlers<AddCulinaryPageData> = {
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
      const edibleParts = formData.get("edibleParts")?.toString().split(',').map(part => part.trim()) || [];
      const flavorProfile = formData.get("flavorProfile")?.toString() || null;
      const culinaryCategory = formData.get("culinaryCategory")?.toString() || null;
      const preparationMethods = formData.get("preparationMethods")?.toString() || null;
      const commonDishes = formData.get("commonDishes")?.toString() || null;
      const cuisines = formData.get("cuisines")?.toString().split(',').map(cuisine => cuisine.trim()) || [];
      const harvestingSeason = formData.get("harvestingSeason")?.toString() || null;
      const nutritionalInfo = formData.get("nutritionalInfo")?.toString() || null;
      const substitutions = formData.get("substitutions")?.toString() || null;
      const pairsWith = formData.get("pairsWith")?.toString().split(',').map(item => item.trim()) || [];
      const storageMethod = formData.get("storageMethod")?.toString() || null;
      const preservationMethods = formData.get("preservationMethods")?.toString() || null;
      const specialConsiderations = formData.get("specialConsiderations")?.toString() || null;
      const notes = formData.get("notes")?.toString() || null;

      // Insert culinary uses into database
      await db.insert(culinaryUses).values({
        plantId,
        edibleParts,
        flavorProfile,
        culinaryCategory,
        preparationMethods,
        commonDishes,
        cuisines,
        harvestingSeason,
        nutritionalInfo,
        substitutions,
        pairsWith,
        storageMethod,
        preservationMethods,
        specialConsiderations,
        notes
      }).execute();

      // Redirect to the culinary information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/culinary`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error adding culinary information:", error);
      return new Response("Error adding culinary information", { status: 500 });
    }
  },
};

export default function AddCulinaryPage({ data }: PageProps<AddCulinaryPageData>) {
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
      activeTab="culinary"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Add Culinary Information</h1>
          <p class="text-gray-600">
            Add culinary information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="edibleParts">
                  Edible Parts
                </label>
                <input
                  type="text"
                  id="edibleParts"
                  name="edibleParts"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Leaves, Flowers, Seeds (comma-separated)"
                />
                <p class="mt-1 text-sm text-gray-500">Comma-separated list of edible parts</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="flavorProfile">
                  Flavor Profile
                </label>
                <input
                  type="text"
                  id="flavorProfile"
                  name="flavorProfile"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Sweet, Bitter, Pungent"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="culinaryCategory">
                  Culinary Category
                </label>
                <input
                  type="text"
                  id="culinaryCategory"
                  name="culinaryCategory"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Herb, Spice, Vegetable, Fruit"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="preparationMethods">
                  Preparation Methods
                </label>
                <textarea
                  id="preparationMethods"
                  name="preparationMethods"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe how this plant is typically prepared..."
                ></textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="commonDishes">
                  Common Dishes
                </label>
                <textarea
                  id="commonDishes"
                  name="commonDishes"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="List common dishes that use this plant..."
                ></textarea>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="cuisines">
                  Common in Cuisines
                </label>
                <input
                  type="text"
                  id="cuisines"
                  name="cuisines"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Italian, French, Thai (comma-separated)"
                />
                <p class="mt-1 text-sm text-gray-500">Comma-separated list of cuisines</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="harvestingSeason">
                  Harvesting Season
                </label>
                <input
                  type="text"
                  id="harvestingSeason"
                  name="harvestingSeason"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Summer, Year-round"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="nutritionalInfo">
                  Nutritional Information
                </label>
                <textarea
                  id="nutritionalInfo"
                  name="nutritionalInfo"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe nutritional content..."
                ></textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="pairsWith">
                  Pairs Well With
                </label>
                <input
                  type="text"
                  id="pairsWith"
                  name="pairsWith"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Garlic, Olive Oil, Tomatoes (comma-separated)"
                />
                <p class="mt-1 text-sm text-gray-500">Comma-separated list of complementary foods</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="storageMethod">
                  Storage Method
                </label>
                <input
                  type="text"
                  id="storageMethod"
                  name="storageMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Refrigerated, Dried"
                />
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="preservationMethods">
              Preservation Methods
            </label>
            <textarea
              id="preservationMethods"
              name="preservationMethods"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe methods for preserving this plant..."
            ></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="substitutions">
              Substitutions
            </label>
            <textarea
              id="substitutions"
              name="substitutions"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="List possible substitutes for this plant in recipes..."
            ></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="specialConsiderations">
              Special Considerations
            </label>
            <textarea
              id="specialConsiderations"
              name="specialConsiderations"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any special preparation considerations, warnings, or tips..."
            ></textarea>
          </div>

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
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/culinary`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Culinary Information
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
