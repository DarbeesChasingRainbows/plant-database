import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, seedSavingInfo } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface SeedInfo {
  infoId: number;
  plantId: number;
  seedType: string | null;
  seedSize: string | null;
  seedColor: string | null;
  daysToMaturity: string | null;
  harvestSeason: string | null;
  harvestingInstructions: string | null;
  cleaningInstructions: string | null;
  dryingInstructions: string | null;
  storageInstructions: string | null;
  storageLifespan: string | null;
  germinationRequirements: string | null;
  stratificationNeeds: string | null;
  scarificationNeeds: string | null;
  seedViabilityTest: string | null;
  seedSavingDifficulty: string | null;
  crossPollinationConcerns: string | null;
  isolationDistance: string | null;
  seedYield: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Data {
  plant: Plant | null;
  seedInfo: SeedInfo | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        seedInfo: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      // Get plant details using Drizzle ORM
      const plantResult = await db.select({
          id: plants.id,
          commonName: plants.commonName,
          botanicalName: plants.botanicalName,
        })
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          seedInfo: null,
          error: "Plant not found" 
        });
      }

      // Get seed saving info using Drizzle ORM
      const seedInfoResult = await db.select()
        .from(seedSavingInfo)
        .where(eq(seedSavingInfo.plantId, id))
        .limit(1);
      
      const seedInfo = seedInfoResult[0] || null;

      return ctx.render({
        plant,
        seedInfo,
      });
    } catch (error) {
      console.error("Error fetching seed saving info:", error);
      return ctx.render({
        plant: null,
        seedInfo: null,
        error: `Error fetching seed saving info: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function PlantSeedSaving({ data }: PageProps<Data>) {
  const { plant, seedInfo, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="seeds">
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <Button href="/admin/plants">Back to Plants</Button>
        </div>
      </PlantAdminLayout>
    );
  }

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="seeds">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">Plant not found</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <Button href="/admin/plants">Back to Plants</Button>
        </div>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="seeds">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Seed Saving Information</h1>
        <div class="flex space-x-2">
          {seedInfo ? (
            <Button href={`/admin/plants/seeds/edit/${plant.id}`}>Edit Seed Information</Button>
          ) : (
            <Button href={`/admin/plants/seeds/new/${plant.id}`}>Add Seed Information</Button>
          )}
        </div>
      </div>
      
      {!seedInfo ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No seed saving information has been added for this plant.</p>
          <Button href={`/admin/plants/seeds/new/${plant.id}`} class="mt-2">Add Seed Information</Button>
        </div>
      ) : (
        <div class="space-y-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-green-50">
              <h3 class="text-lg leading-6 font-medium text-green-900">Seed Characteristics</h3>
              <p class="mt-1 max-w-2xl text-sm text-green-700">Basic information about seed type and characteristics.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Seed Type</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.seedType || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Seed Size</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.seedSize || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Seed Color</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.seedColor || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Days to Maturity</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.daysToMaturity || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-amber-50">
              <h3 class="text-lg leading-6 font-medium text-amber-900">Harvesting & Processing</h3>
              <p class="mt-1 max-w-2xl text-sm text-amber-700">When and how to harvest and process seeds.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Harvest Season</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.harvestSeason || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Seed Yield</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.seedYield || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Harvesting Instructions</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{seedInfo.harvestingInstructions || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Cleaning Instructions</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{seedInfo.cleaningInstructions || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Drying Instructions</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{seedInfo.dryingInstructions || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-blue-50">
              <h3 class="text-lg leading-6 font-medium text-blue-900">Storage & Germination</h3>
              <p class="mt-1 max-w-2xl text-sm text-blue-700">How to store seeds and their germination requirements.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Storage Instructions</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{seedInfo.storageInstructions || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Storage Lifespan</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.storageLifespan || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Seed Viability Test</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.seedViabilityTest || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Germination Requirements</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{seedInfo.germinationRequirements || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Stratification Needs</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.stratificationNeeds || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Scarification Needs</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.scarificationNeeds || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-purple-50">
              <h3 class="text-lg leading-6 font-medium text-purple-900">Seed Saving Considerations</h3>
              <p class="mt-1 max-w-2xl text-sm text-purple-700">Additional information for successful seed saving.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Seed Saving Difficulty</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.seedSavingDifficulty || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Isolation Distance</dt>
                  <dd class="mt-1 text-sm text-gray-900">{seedInfo.isolationDistance || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Cross-Pollination Concerns</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{seedInfo.crossPollinationConcerns || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          {seedInfo.notes && (
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Additional Notes</h3>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p class="text-sm text-gray-900 whitespace-pre-line">{seedInfo.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </PlantAdminLayout>
  );
}
