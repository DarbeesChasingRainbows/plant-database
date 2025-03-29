// routes/admin/plants/[id]/growing/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantProperties, plantGerminationGuide } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface GrowingPageData {
  plant: Plant;
  properties: any;
  germinationGuide: any;
}

export const handler: Handlers<GrowingPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    
    // Validate that id is a valid number
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }

    // Fetch the plant by ID
    const plant = await db.select().from(plants).where(
      eq(plants.id, plantId),
    ).execute();

    if (plant.length === 0) {
      return ctx.render(undefined);
    }

    // Fetch growing properties for this plant
    const properties = await db
      .select()
      .from(plantProperties)
      .where(eq(plantProperties.plantId, plantId))
      .execute();

    // Fetch germination guide for this plant
    const germinationGuide = await db
      .select()
      .from(plantGerminationGuide)
      .where(eq(plantGerminationGuide.plantId, plantId))
      .execute();

    // Map the database result to match the Plant interface
    const plantData: Plant = {
      id: plant[0].id,
      common_name: plant[0].commonName,
      botanical_name: plant[0].botanicalName,
      family: plant[0].family,
      genus: plant[0].genus,
      species: plant[0].species,
      description: plant[0].description,
      taxonomy: null, // Add default value if not in the database
      is_medicinal: Boolean(plant[0].isMedicinal), // Convert to boolean
      is_food_crop: Boolean(plant[0].isFoodCrop), // Convert to boolean
      created_at: plant[0].createdAt,
      updated_at: plant[0].updatedAt
    };

    return ctx.render({
      plant: plantData,
      properties: properties.length > 0 ? properties[0] : null,
      germinationGuide: germinationGuide.length > 0 ? germinationGuide[0] : null,
    });
  },
};

export default function PlantGrowing({ data }: PageProps<GrowingPageData>) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <PlantAdminLayout 
      plantId={data.plant.id} 
      plantName={data.plant.common_name} 
      activeTab="growing"
    >
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            Growing Information - {data.plant.common_name}
          </h1>
          {!data.properties && (
            <a
              href={`/admin/plants/${data.plant.id}/growing/add`}
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Growing Information
            </a>
          )}
          {data.properties && (
            <a
              href={`/admin/plants/${data.plant.id}/growing/edit`}
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Growing Information
            </a>
          )}
        </div>

        {!data.properties && !data.germinationGuide ? (
          <div class="bg-white shadow overflow-hidden rounded-md p-6 text-center">
            <p class="text-gray-500">No growing information has been added for this plant yet.</p>
            <a
              href={`/admin/plants/${data.plant.id}/growing/add`}
              class="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Growing Information
            </a>
          </div>
        ) : (
          <div class="space-y-8">
            {/* Growing Properties Section */}
            {data.properties && (
              <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Growing Properties</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Details about how to grow this plant.</p>
                  </div>
                  <a
                    href={`/admin/plants/${data.plant.id}/growing/edit`}
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </a>
                </div>
                <div class="border-t border-gray-200">
                  <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Zone Range</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.zoneRange || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Soil pH Range</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.soilPhRange || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Light Requirements</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.lightRequirements || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Water Requirements</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.waterRequirements || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Days to Maturity</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.daysToMaturity ? `${data.properties.daysToMaturity} days` : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Mature Height</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.heightMatureCm ? `${data.properties.heightMatureCm} cm` : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Mature Spread</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.spreadMatureCm ? `${data.properties.spreadMatureCm} cm` : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Soil Type Preferences</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.soilTypePreferences || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Cultivation Notes</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.cultivationNotes || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Pest Susceptibility</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.pestSusceptibility || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Disease Susceptibility</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.properties.diseaseSusceptibility || "Not specified"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Germination Guide Section */}
            {data.germinationGuide && (
              <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Germination Guide</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Information about germinating seeds of this plant.</p>
                  </div>
                  <a
                    href={`/admin/plants/${data.plant.id}/germination/edit`}
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </a>
                </div>
                <div class="border-t border-gray-200">
                  <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Zone Range</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.zoneRange || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Soil Temperature Range</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.soilTempMinC && data.germinationGuide.soilTempMaxC 
                          ? `${data.germinationGuide.soilTempMinC}°C - ${data.germinationGuide.soilTempMaxC}°C` 
                          : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Days to Germination</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.daysToGerminationMin && data.germinationGuide.daysToGerminationMax 
                          ? `${data.germinationGuide.daysToGerminationMin} - ${data.germinationGuide.daysToGerminationMax} days` 
                          : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Planting Depth</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.plantingDepthCm 
                          ? `${data.germinationGuide.plantingDepthCm} cm` 
                          : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Light Requirement</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.lightRequirement || "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Spring Planting Window</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.springStartWeek && data.germinationGuide.springEndWeek 
                          ? `Week ${data.germinationGuide.springStartWeek} - Week ${data.germinationGuide.springEndWeek}` 
                          : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Fall Planting Window</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.fallStartWeek && data.germinationGuide.fallEndWeek 
                          ? `Week ${data.germinationGuide.fallStartWeek} - Week ${data.germinationGuide.fallEndWeek}` 
                          : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Indoor Sowing</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.indoorSowingWeeksBeforeFrost 
                          ? `${data.germinationGuide.indoorSowingWeeksBeforeFrost} weeks before last frost` 
                          : "Not specified"}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Stratification Required</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.stratificationRequired ? "Yes" : "No"}
                        {data.germinationGuide.stratificationRequired && data.germinationGuide.stratificationInstructions && (
                          <p class="mt-1 text-sm text-gray-600">{data.germinationGuide.stratificationInstructions}</p>
                        )}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Scarification Required</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.scarificationRequired ? "Yes" : "No"}
                        {data.germinationGuide.scarificationRequired && data.germinationGuide.scarificationInstructions && (
                          <p class="mt-1 text-sm text-gray-600">{data.germinationGuide.scarificationInstructions}</p>
                        )}
                      </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Special Requirements</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.specialRequirements || "None"}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Germination Notes</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {data.germinationGuide.germinationNotes || "None"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Add Germination Guide button if it doesn't exist */}
            {!data.germinationGuide && (
              <div class="mt-6 text-center">
                <a
                  href={`/admin/plants/${data.plant.id}/germination/add`}
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Germination Guide
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </PlantAdminLayout>
  );
}
