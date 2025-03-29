import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, plantingGuide } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface GrowingGuide {
  guideId: number;
  plantId: number;
  springPlantingStart: string | null;
  springPlantingEnd: string | null;
  fallPlantingStart: string | null;
  fallPlantingEnd: string | null;
  indoorSowingStart: string | null;
  transplantReadyWeeks: number | null;
  directSowAfterFrost: boolean | null;
  frostTolerance: string | null;
  heatTolerance: string | null;
  successionPlantingInterval: number | null;
  companionPlants: string[] | null;
  incompatiblePlants: string[] | null;
  rotationGroup: string | null;
  rotationInterval: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Data {
  plant: Plant | null;
  growingGuide: GrowingGuide | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        growingGuide: null,
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
          growingGuide: null,
          error: "Plant not found" 
        });
      }

      // Get growing guide using Drizzle ORM
      const guideResult = await db.select()
        .from(plantingGuide)
        .where(eq(plantingGuide.plantId, id))
        .limit(1);
      
      const growingGuide = guideResult[0] || null;

      return ctx.render({
        plant,
        growingGuide,
      });
    } catch (error) {
      console.error("Error fetching growing guide:", error);
      return ctx.render({
        plant: null,
        growingGuide: null,
        error: `Error fetching growing guide: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function PlantGrowingGuide({ data }: PageProps<Data>) {
  const { plant, growingGuide, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="growing">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="growing">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="growing">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Growing Guide</h1>
        <div class="flex space-x-2">
          {growingGuide ? (
            <Button href={`/admin/plants/growing/edit/${plant.id}`}>Edit Growing Guide</Button>
          ) : (
            <Button href={`/admin/plants/growing/new/${plant.id}`}>Add Growing Guide</Button>
          )}
        </div>
      </div>
      
      {!growingGuide ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No growing guide has been added for this plant.</p>
          <Button href={`/admin/plants/growing/new/${plant.id}`} class="mt-2">Add Growing Guide</Button>
        </div>
      ) : (
        <div class="space-y-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-green-50">
              <h3 class="text-lg leading-6 font-medium text-green-900">Basic Growing Requirements</h3>
              <p class="mt-1 max-w-2xl text-sm text-green-700">Essential information for growing this plant.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Sun Requirements</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.springPlantingStart || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Soil Requirements</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.springPlantingEnd || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Watering Needs</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.fallPlantingStart || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Fertilization Needs</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.fallPlantingEnd || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-amber-50">
              <h3 class="text-lg leading-6 font-medium text-amber-900">Planting Information</h3>
              <p class="mt-1 max-w-2xl text-sm text-amber-700">How and when to plant.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Planting Time</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.indoorSowingStart || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Planting Depth</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.transplantReadyWeeks || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Spacing</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.directSowAfterFrost ? "Yes" : "No"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Growth Habit</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.frostTolerance || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Propagation Methods</dt>
                  {growingGuide.companionPlants && growingGuide.companionPlants.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {growingGuide.companionPlants.map((method) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {method}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-blue-50">
              <h3 class="text-lg leading-6 font-medium text-blue-900">Harvesting</h3>
              <p class="mt-1 max-w-2xl text-sm text-blue-700">When and how to harvest.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Harvest Time</dt>
                  <dd class="mt-1 text-sm text-gray-900">{growingGuide.heatTolerance || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Harvest Method</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{growingGuide.successionPlantingInterval || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-red-50">
              <h3 class="text-lg leading-6 font-medium text-red-900">Pests & Diseases</h3>
              <p class="mt-1 max-w-2xl text-sm text-red-700">Common problems and how to manage them.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Common Pests</dt>
                  {growingGuide.incompatiblePlants && growingGuide.incompatiblePlants.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {growingGuide.incompatiblePlants.map((pest) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {pest}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Common Diseases</dt>
                  {growingGuide.rotationGroup && growingGuide.rotationGroup.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {growingGuide.rotationGroup.map((disease) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {disease}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-purple-50">
              <h3 class="text-lg leading-6 font-medium text-purple-900">Companion Planting</h3>
              <p class="mt-1 max-w-2xl text-sm text-purple-700">Plants that grow well together or should be avoided.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Good Companions</dt>
                  {growingGuide.companionPlants && growingGuide.companionPlants.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {growingGuide.companionPlants.map((plant) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {plant}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Avoid Planting With</dt>
                  {growingGuide.incompatiblePlants && growingGuide.incompatiblePlants.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {growingGuide.incompatiblePlants.map((plant) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {plant}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
              </dl>
            </div>
          </div>

          {(growingGuide.rotationInterval || growingGuide.createdAt || growingGuide.updatedAt) && (
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Additional Information</h3>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-1">
                  {growingGuide.rotationInterval && (
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Rotation Interval</dt>
                      <dd class="mt-1 text-sm text-gray-900">{growingGuide.rotationInterval}</dd>
                    </div>
                  )}
                  {growingGuide.createdAt && (
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Created At</dt>
                      <dd class="mt-1 text-sm text-gray-900">{growingGuide.createdAt}</dd>
                    </div>
                  )}
                  {growingGuide.updatedAt && (
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                      <dd class="mt-1 text-sm text-gray-900">{growingGuide.updatedAt}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}

          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Growing Tips</h3>
            <div class="bg-gray-50 p-4 rounded-md">
              <ul class="text-sm text-gray-600 space-y-2 ml-4 list-disc">
                <li>Consider using companion planting to naturally deter pests and improve plant health.</li>
                <li>Mulching can help retain soil moisture and reduce weed competition.</li>
                <li>Observe your plants regularly to catch pest or disease issues early.</li>
                <li>Consider crop rotation to prevent soil depletion and reduce pest/disease buildup.</li>
                <li>Many herbs and medicinal plants prefer well-drained soil to prevent root rot.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </PlantAdminLayout>
  );
}
