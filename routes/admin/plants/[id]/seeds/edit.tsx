// routes/admin/plants/[id]/seeds/edit.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, seedSavingInfo } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditSeedInfoPageData {
  plant: Plant;
  seedInfo: any;
}

export const handler: Handlers<EditSeedInfoPageData> = {
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

      // Fetch seed information
      const seedData = await db.select().from(seedSavingInfo).where(
        eq(seedSavingInfo.plantId, plantId),
      ).execute();

      if (seedData.length === 0) {
        // Redirect to the add page if no seed info exists
        const headers = new Headers();
        headers.set("location", `/admin/plants/${plantId}/seeds/add`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return ctx.render({
        plant: plantData,
        seedInfo: seedData[0],
      });
    } catch (error) {
      console.error("Error fetching seed data:", error);
      return new Response("Error fetching seed data", { status: 500 });
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
      const infoId = formData.get("infoId")?.toString();
      if (!infoId) {
        return new Response("Missing seed information ID", { status: 400 });
      }

      const pollinationType = formData.get("pollinationType")?.toString() || null;
      const lifeCycle = formData.get("lifeCycle")?.toString() || null;
      
      // Parse numeric values, handling empty strings
      const isolationDistanceM = formData.get("isolationDistanceM")?.toString();
      const isolationDistanceMValue = isolationDistanceM ? parseInt(isolationDistanceM) : null;
      
      const seedViabilityYears = formData.get("seedViabilityYears")?.toString();
      const seedViabilityYearsValue = seedViabilityYears ? parseInt(seedViabilityYears) : null;
      
      const seedsPerGram = formData.get("seedsPerGram")?.toString();
      const seedsPerGramValue = seedsPerGram ? parseInt(seedsPerGram) : null;
      
      const minimumPopulationSize = formData.get("minimumPopulationSize")?.toString();
      const minimumPopulationSizeValue = minimumPopulationSize ? parseInt(minimumPopulationSize) : null;
      
      const timeToSeedMaturityDays = formData.get("timeToSeedMaturityDays")?.toString();
      const timeToSeedMaturityDaysValue = timeToSeedMaturityDays ? parseInt(timeToSeedMaturityDays) : null;
      
      // Text fields
      const seedCollectionMethod = formData.get("seedCollectionMethod")?.toString() || null;
      const seedCleaningMethod = formData.get("seedCleaningMethod")?.toString() || null;
      const seedStorageConditions = formData.get("seedStorageConditions")?.toString() || null;
      const germinationTestMethod = formData.get("germinationTestMethod")?.toString() || null;
      const seedTreatmentBeforeStorage = formData.get("seedTreatmentBeforeStorage")?.toString() || null;
      const seedSavingNotes = formData.get("seedSavingNotes")?.toString() || null;

      // Update seed saving information in database
      await db.update(seedSavingInfo)
        .set({
          pollinationType,
          lifeCycle,
          isolationDistanceM: isolationDistanceMValue,
          seedViabilityYears: seedViabilityYearsValue,
          seedCollectionMethod,
          seedCleaningMethod,
          seedStorageConditions,
          seedsPerGram: seedsPerGramValue,
          germinationTestMethod,
          seedTreatmentBeforeStorage,
          minimumPopulationSize: minimumPopulationSizeValue,
          timeToSeedMaturityDays: timeToSeedMaturityDaysValue,
          seedSavingNotes,
          updatedAt: new Date(),
        })
        .where(eq(seedSavingInfo.infoId, parseInt(infoId)))
        .execute();

      // Redirect to the seed information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/seeds`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating seed information:", error);
      return new Response("Error updating seed information", { status: 500 });
    }
  },
};

export default function EditSeedInfoPage({ data }: PageProps<EditSeedInfoPageData>) {
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

  const { plant, seedInfo } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="seeds"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Edit Seed Saving Information</h1>
          <p class="text-gray-600">
            Modify seed saving information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
          <input type="hidden" name="infoId" value={seedInfo.infoId} />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="pollinationType">
                  Pollination Type
                </label>
                <select
                  id="pollinationType"
                  name="pollinationType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select pollination type...</option>
                  <option value="Self-pollinating" selected={seedInfo.pollinationType === "Self-pollinating"}>Self-pollinating</option>
                  <option value="Cross-pollinating" selected={seedInfo.pollinationType === "Cross-pollinating"}>Cross-pollinating</option>
                  <option value="Insect-pollinated" selected={seedInfo.pollinationType === "Insect-pollinated"}>Insect-pollinated</option>
                  <option value="Wind-pollinated" selected={seedInfo.pollinationType === "Wind-pollinated"}>Wind-pollinated</option>
                  <option value="Hand-pollinated" selected={seedInfo.pollinationType === "Hand-pollinated"}>Hand-pollinated</option>
                </select>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="lifeCycle">
                  Life Cycle
                </label>
                <select
                  id="lifeCycle"
                  name="lifeCycle"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select life cycle...</option>
                  <option value="Annual" selected={seedInfo.lifeCycle === "Annual"}>Annual</option>
                  <option value="Biennial" selected={seedInfo.lifeCycle === "Biennial"}>Biennial</option>
                  <option value="Perennial" selected={seedInfo.lifeCycle === "Perennial"}>Perennial</option>
                </select>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="isolationDistanceM">
                  Isolation Distance (meters)
                </label>
                <input
                  type="number"
                  id="isolationDistanceM"
                  name="isolationDistanceM"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 100"
                  value={seedInfo.isolationDistanceM || ""}
                />
                <p class="mt-1 text-sm text-gray-500">Minimum distance to prevent cross-pollination</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedViabilityYears">
                  Seed Viability (years)
                </label>
                <input
                  type="number"
                  id="seedViabilityYears"
                  name="seedViabilityYears"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 3"
                  value={seedInfo.seedViabilityYears || ""}
                />
                <p class="mt-1 text-sm text-gray-500">How long seeds remain viable for planting</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedCollectionMethod">
                  Seed Collection Method
                </label>
                <textarea
                  id="seedCollectionMethod"
                  name="seedCollectionMethod"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe how seeds should be collected..."
                >{seedInfo.seedCollectionMethod || ""}</textarea>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedCleaningMethod">
                  Seed Cleaning Method
                </label>
                <textarea
                  id="seedCleaningMethod"
                  name="seedCleaningMethod"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe how seeds should be cleaned..."
                >{seedInfo.seedCleaningMethod || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedStorageConditions">
                  Seed Storage Conditions
                </label>
                <textarea
                  id="seedStorageConditions"
                  name="seedStorageConditions"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe optimal storage conditions..."
                >{seedInfo.seedStorageConditions || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="seedsPerGram">
                  Seeds Per Gram
                </label>
                <input
                  type="number"
                  id="seedsPerGram"
                  name="seedsPerGram"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 100"
                  value={seedInfo.seedsPerGram || ""}
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="minimumPopulationSize">
                  Minimum Population Size
                </label>
                <input
                  type="number"
                  id="minimumPopulationSize"
                  name="minimumPopulationSize"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 20"
                  value={seedInfo.minimumPopulationSize || ""}
                />
                <p class="mt-1 text-sm text-gray-500">Recommended number of plants for genetic diversity</p>
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="germinationTestMethod">
              Germination Test Method
            </label>
            <textarea
              id="germinationTestMethod"
              name="germinationTestMethod"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe how to test seed viability..."
            >{seedInfo.germinationTestMethod || ""}</textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="seedTreatmentBeforeStorage">
              Seed Treatment Before Storage
            </label>
            <textarea
              id="seedTreatmentBeforeStorage"
              name="seedTreatmentBeforeStorage"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe any treatments needed before storage..."
            >{seedInfo.seedTreatmentBeforeStorage || ""}</textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="timeToSeedMaturityDays">
              Time to Seed Maturity (days)
            </label>
            <input
              type="number"
              id="timeToSeedMaturityDays"
              name="timeToSeedMaturityDays"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. 120"
              value={seedInfo.timeToSeedMaturityDays || ""}
            />
            <p class="mt-1 text-sm text-gray-500">Days from flowering to seed maturity</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="seedSavingNotes">
              Additional Notes
            </label>
            <textarea
              id="seedSavingNotes"
              name="seedSavingNotes"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any other relevant information..."
            >{seedInfo.seedSavingNotes || ""}</textarea>
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
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Seed Information
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
