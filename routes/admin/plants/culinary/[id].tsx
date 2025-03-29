import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, culinaryUses } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface CulinaryUse {
  useId: number;
  plantId: number;
  edibleParts: string[] | null;
  flavorProfile: string | null;
  culinaryCategory: string | null;
  preparationMethods: string | null;
  commonDishes: string | null;
  cuisines: string[] | null;
  harvestingSeason: string | null;
  nutritionalInfo: string | null;
  substitutions: string | null;
  pairsWith: string[] | null;
  storageMethod: string | null;
  preservationMethods: string | null;
  specialConsiderations: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Data {
  plant: Plant | null;
  culinaryUse: CulinaryUse | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        culinaryUse: null,
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
          culinaryUse: null,
          error: "Plant not found" 
        });
      }

      // Get culinary uses using Drizzle ORM
      const culinaryResult = await db.select()
        .from(culinaryUses)
        .where(eq(culinaryUses.plantId, id))
        .limit(1);
      
      const culinaryUse = culinaryResult[0] || null;

      return ctx.render({
        plant,
        culinaryUse,
      });
    } catch (error) {
      console.error("Error fetching culinary uses:", error);
      return ctx.render({
        plant: null,
        culinaryUse: null,
        error: `Error fetching culinary uses: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function PlantCulinaryUses({ data }: PageProps<Data>) {
  const { plant, culinaryUse, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="culinary">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="culinary">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="culinary">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Culinary Uses</h1>
        <div class="flex space-x-2">
          {culinaryUse ? (
            <Button href={`/admin/plants/culinary/edit/${plant.id}`}>Edit Culinary Uses</Button>
          ) : (
            <Button href={`/admin/plants/culinary/new/${plant.id}`}>Add Culinary Uses</Button>
          )}
        </div>
      </div>
      
      {!culinaryUse ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No culinary uses have been added for this plant.</p>
          <Button href={`/admin/plants/culinary/new/${plant.id}`} class="mt-2">Add Culinary Uses</Button>
        </div>
      ) : (
        <div class="space-y-6">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-orange-50">
              <h3 class="text-lg leading-6 font-medium text-orange-900">Basic Culinary Information</h3>
              <p class="mt-1 max-w-2xl text-sm text-orange-700">Essential information for culinary use.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Edible Parts</dt>
                  {culinaryUse.edibleParts && culinaryUse.edibleParts.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {culinaryUse.edibleParts.map((part) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {part}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Flavor Profile</dt>
                  <dd class="mt-1 text-sm text-gray-900">{culinaryUse.flavorProfile || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Culinary Category</dt>
                  <dd class="mt-1 text-sm text-gray-900">{culinaryUse.culinaryCategory || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Harvesting Season</dt>
                  <dd class="mt-1 text-sm text-gray-900">{culinaryUse.harvestingSeason || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-yellow-50">
              <h3 class="text-lg leading-6 font-medium text-yellow-900">Preparation & Uses</h3>
              <p class="mt-1 max-w-2xl text-sm text-yellow-700">How to prepare and use in cooking.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Preparation Methods</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.preparationMethods || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Common Dishes</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.commonDishes || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Cuisines</dt>
                  {culinaryUse.cuisines && culinaryUse.cuisines.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {culinaryUse.cuisines.map((cuisine) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </dd>
                  ) : (
                    <dd class="mt-1 text-sm text-gray-500 italic">Not specified</dd>
                  )}
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Pairs Well With</dt>
                  {culinaryUse.pairsWith && culinaryUse.pairsWith.length > 0 ? (
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-2">
                        {culinaryUse.pairsWith.map((item) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {item}
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
              <h3 class="text-lg leading-6 font-medium text-blue-900">Storage & Preservation</h3>
              <p class="mt-1 max-w-2xl text-sm text-blue-700">How to store and preserve.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Storage Method</dt>
                  <dd class="mt-1 text-sm text-gray-900">{culinaryUse.storageMethod || "Not specified"}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Preservation Methods</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.preservationMethods || "Not specified"}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-green-50">
              <h3 class="text-lg leading-6 font-medium text-green-900">Nutritional & Additional Information</h3>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-1">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Nutritional Information</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.nutritionalInfo || "Not specified"}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Substitutions</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.substitutions || "Not specified"}</dd>
                </div>
                {culinaryUse.specialConsiderations && (
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Special Considerations</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.specialConsiderations}</dd>
                  </div>
                )}
                {culinaryUse.notes && (
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Additional Notes</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{culinaryUse.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Culinary Tips</h3>
            <div class="bg-gray-50 p-4 rounded-md">
              <ul class="text-sm text-gray-600 space-y-2 ml-4 list-disc">
                <li>Always wash herbs and edible plants thoroughly before use.</li>
                <li>For most herbs, add them toward the end of cooking to preserve flavor.</li>
                <li>Dried herbs are generally more potent than fresh - use about 1/3 the amount.</li>
                <li>Store fresh herbs with stems in water like a bouquet of flowers for longer shelf life.</li>
                <li>Freeze herbs in ice cube trays with olive oil for convenient cooking portions.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </PlantAdminLayout>
  );
}
