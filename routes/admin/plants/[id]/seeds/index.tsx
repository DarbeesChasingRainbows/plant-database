// routes/admin/plants/[id]/seeds/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

// Mock seed information interface until the actual table is created
interface SeedInfo {
  pollinationType?: string;
  lifeCycle?: string;
  isolationDistanceM?: number;
  seedViabilityYears?: number;
  seedCollectionMethod?: string;
  seedCleaningMethod?: string;
  seedStorageConditions?: string;
  seedsPerGram?: number;
  germinationTestMethod?: string;
  seedTreatmentBeforeStorage?: string;
  minimumPopulationSize?: number;
  timeToSeedMaturityDays?: number;
  seedSavingNotes?: string;
}

interface SeedsPageData {
  plant: Plant;
  seedInfo: SeedInfo | null;
}

export const handler: Handlers<SeedsPageData> = {
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
        // Use optional chaining and nullish coalescing to handle potential missing properties
        is_medicinal: Boolean(plant[0]?.isMedicinal ?? 0),
        is_food_crop: Boolean(plant[0]?.isFoodCrop ?? 0),
        created_at: plant[0].createdAt,
        updated_at: plant[0].updatedAt
      };

      // For now, return null for seedInfo since the table doesn't exist yet
      // This will be replaced with actual database queries once the table is created
      return ctx.render({
        plant: plantData,
        seedInfo: null,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return new Response("Error fetching plant data", { status: 500 });
    }
  },
};

export default function SeedsPage({ data }: PageProps<SeedsPageData>) {
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
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Seed Saving Information</h1>
          <a
            href={`/admin/plants/${plant.id}/seeds/add`}
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Seed Information
          </a>
        </div>

        {seedInfo ? (
          <div class="bg-white shadow rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
                <div class="space-y-3">
                  <div>
                    <span class="font-medium">Pollination Type:</span>{" "}
                    {seedInfo.pollinationType || "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Life Cycle:</span>{" "}
                    {seedInfo.lifeCycle || "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Isolation Distance:</span>{" "}
                    {seedInfo.isolationDistanceM ? `${seedInfo.isolationDistanceM} meters` : "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Seed Viability:</span>{" "}
                    {seedInfo.seedViabilityYears ? `${seedInfo.seedViabilityYears} years` : "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Seeds Per Gram:</span>{" "}
                    {seedInfo.seedsPerGram || "Not specified"}
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-lg font-semibold mb-4">Collection & Storage</h2>
                <div class="space-y-3">
                  <div>
                    <span class="font-medium">Collection Method:</span>{" "}
                    {seedInfo.seedCollectionMethod || "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Cleaning Method:</span>{" "}
                    {seedInfo.seedCleaningMethod || "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Storage Conditions:</span>{" "}
                    {seedInfo.seedStorageConditions || "Not specified"}
                  </div>
                  <div>
                    <span class="font-medium">Treatment Before Storage:</span>{" "}
                    {seedInfo.seedTreatmentBeforeStorage || "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h2 class="text-lg font-semibold mb-4">Additional Information</h2>
              <div class="space-y-3">
                <div>
                  <span class="font-medium">Germination Test Method:</span>{" "}
                  {seedInfo.germinationTestMethod || "Not specified"}
                </div>
                <div>
                  <span class="font-medium">Minimum Population Size:</span>{" "}
                  {seedInfo.minimumPopulationSize || "Not specified"}
                </div>
                <div>
                  <span class="font-medium">Time to Seed Maturity:</span>{" "}
                  {seedInfo.timeToSeedMaturityDays ? `${seedInfo.timeToSeedMaturityDays} days` : "Not specified"}
                </div>
              </div>
            </div>

            {seedInfo.seedSavingNotes && (
              <div class="mt-6">
                <h2 class="text-lg font-semibold mb-2">Notes</h2>
                <p class="whitespace-pre-wrap">{seedInfo.seedSavingNotes}</p>
              </div>
            )}
          </div>
        ) : (
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <p class="text-gray-600 mb-4">No seed saving information has been added for this plant yet.</p>
            <p class="text-sm text-gray-500">
              Click the "Add Seed Information" button to add details about seed saving for this plant.
            </p>
          </div>
        )}
      </div>
    </PlantAdminLayout>
  );
}
