// routes/admin/plants/[id]/seeds/add.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, seedSavingInfo } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface AddSeedInfoPageData {
  plant: Plant;
}

export const handler: Handlers<AddSeedInfoPageData> = {
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
      const pollinationType = formData.get("pollinationType")?.toString() || null;
      const lifeCycle = formData.get("lifeCycle")?.toString() || null;
      const isolationDistanceM = formData.get("isolationDistanceM") ? 
        parseInt(formData.get("isolationDistanceM")?.toString() || "0") : null;
      const seedViabilityYears = formData.get("seedViabilityYears") ? 
        parseInt(formData.get("seedViabilityYears")?.toString() || "0") : null;
      const seedCollectionMethod = formData.get("seedCollectionMethod")?.toString() || null;
      const seedCleaningMethod = formData.get("seedCleaningMethod")?.toString() || null;
      const seedStorageConditions = formData.get("seedStorageConditions")?.toString() || null;
      const seedsPerGram = formData.get("seedsPerGram") ? 
        parseInt(formData.get("seedsPerGram")?.toString() || "0") : null;
      const germinationTestMethod = formData.get("germinationTestMethod")?.toString() || null;
      const seedTreatmentBeforeStorage = formData.get("seedTreatmentBeforeStorage")?.toString() || null;
      const minimumPopulationSize = formData.get("minimumPopulationSize") ? 
        parseInt(formData.get("minimumPopulationSize")?.toString() || "0") : null;
      const timeToSeedMaturityDays = formData.get("timeToSeedMaturityDays") ? 
        parseInt(formData.get("timeToSeedMaturityDays")?.toString() || "0") : null;
      const seedSavingNotes = formData.get("seedSavingNotes")?.toString() || null;

      // Insert seed information into database
      await db.insert(seedSavingInfo).values({
        plantId,
        pollinationType,
        lifeCycle,
        isolationDistanceM,
        seedViabilityYears,
        seedCollectionMethod,
        seedCleaningMethod,
        seedStorageConditions,
        seedsPerGram,
        germinationTestMethod,
        seedTreatmentBeforeStorage,
        minimumPopulationSize,
        timeToSeedMaturityDays,
        seedSavingNotes,
      }).execute();

      // Redirect to the seed information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/seeds`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error adding seed information:", error);
      return new Response("Error adding seed information", { status: 500 });
    }
  },
};

export default function AddSeedInfoPage({ data }: PageProps<AddSeedInfoPageData>) {
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
      activeTab="seeds"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Add Seed Saving Information</h1>
          <p class="text-gray-600">
            Add seed saving details for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="pollinationType">
                  Pollination Type
                </label>
                <select
                  id="pollinationType"
                  name="pollinationType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a pollination type</option>
                  <option value="Self-pollinating">Self-pollinating</option>
                  <option value="Cross-pollinating">Cross-pollinating</option>
                  <option value="Insect-pollinated">Insect-pollinated</option>
                  <option value="Wind-pollinated">Wind-pollinated</option>
                  <option value="Bird-pollinated">Bird-pollinated</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="lifeCycle">
                  Life Cycle
                </label>
                <select
                  id="lifeCycle"
                  name="lifeCycle"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a life cycle</option>
                  <option value="Annual">Annual</option>
                  <option value="Biennial">Biennial</option>
                  <option value="Perennial">Perennial</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="isolationDistanceM">
                  Isolation Distance (meters)
                </label>
                <input
                  type="number"
                  id="isolationDistanceM"
                  name="isolationDistanceM"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedViabilityYears">
                  Seed Viability (years)
                </label>
                <input
                  type="number"
                  id="seedViabilityYears"
                  name="seedViabilityYears"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedsPerGram">
                  Seeds Per Gram
                </label>
                <input
                  type="number"
                  id="seedsPerGram"
                  name="seedsPerGram"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <h2 class="text-lg font-semibold mb-4">Collection & Storage</h2>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedCollectionMethod">
                  Seed Collection Method
                </label>
                <textarea
                  id="seedCollectionMethod"
                  name="seedCollectionMethod"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedCleaningMethod">
                  Seed Cleaning Method
                </label>
                <textarea
                  id="seedCleaningMethod"
                  name="seedCleaningMethod"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedStorageConditions">
                  Storage Conditions
                </label>
                <textarea
                  id="seedStorageConditions"
                  name="seedStorageConditions"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedTreatmentBeforeStorage">
                  Treatment Before Storage
                </label>
                <textarea
                  id="seedTreatmentBeforeStorage"
                  name="seedTreatmentBeforeStorage"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-4">Additional Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="germinationTestMethod">
                  Germination Test Method
                </label>
                <textarea
                  id="germinationTestMethod"
                  name="germinationTestMethod"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="minimumPopulationSize">
                  Minimum Population Size
                </label>
                <input
                  type="number"
                  id="minimumPopulationSize"
                  name="minimumPopulationSize"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="timeToSeedMaturityDays">
                  Time to Seed Maturity (days)
                </label>
                <input
                  type="number"
                  id="timeToSeedMaturityDays"
                  name="timeToSeedMaturityDays"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="seedSavingNotes">
              Notes
            </label>
            <textarea
              id="seedSavingNotes"
              name="seedSavingNotes"
              rows={4}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add any additional notes about seed saving for this plant..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/seeds`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Seed Information
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
