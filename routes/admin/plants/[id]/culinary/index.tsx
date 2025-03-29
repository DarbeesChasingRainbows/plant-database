// routes/admin/plants/[id]/culinary/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, culinaryUses } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface CulinaryPageData {
  plant: Plant;
  culinaryInfo: any | null;
}

export const handler: Handlers<CulinaryPageData> = {
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

      // Fetch culinary information
      const culinaryInfo = await db.select().from(culinaryUses).where(
        eq(culinaryUses.plantId, plantId),
      ).execute();

      return ctx.render({
        plant: plantData,
        culinaryInfo: culinaryInfo.length > 0 ? culinaryInfo[0] : null,
      });
    } catch (error) {
      console.error("Error fetching culinary data:", error);
      return new Response("Error fetching culinary data", { status: 500 });
    }
  },
};

export default function CulinaryPage({ data }: PageProps<CulinaryPageData>) {
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

  const { plant, culinaryInfo } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="culinary"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold">Culinary Uses</h1>
            <p class="text-gray-600">
              Culinary information for {plant.common_name} ({plant.botanical_name})
            </p>
          </div>
          {!culinaryInfo ? (
            <a
              href={`/admin/plants/${plant.id}/culinary/add`}
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Add Culinary Information
            </a>
          ) : (
            <a
              href={`/admin/plants/${plant.id}/culinary/edit`}
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Edit Culinary Information
            </a>
          )}
        </div>

        {culinaryInfo ? (
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Left Column */}
              <div>
                {culinaryInfo.edibleParts && culinaryInfo.edibleParts.length > 0 && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Edible Parts</h3>
                    <ul class="list-disc list-inside text-gray-700">
                      {culinaryInfo.edibleParts.map((part: string, index: number) => (
                        <li key={index}>{part}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {culinaryInfo.flavorProfile && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Flavor Profile</h3>
                    <p class="text-gray-700">{culinaryInfo.flavorProfile}</p>
                  </div>
                )}

                {culinaryInfo.culinaryCategory && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Culinary Category</h3>
                    <p class="text-gray-700">{culinaryInfo.culinaryCategory}</p>
                  </div>
                )}

                {culinaryInfo.preparationMethods && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Preparation Methods</h3>
                    <p class="text-gray-700">{culinaryInfo.preparationMethods}</p>
                  </div>
                )}

                {culinaryInfo.commonDishes && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Common Dishes</h3>
                    <p class="text-gray-700">{culinaryInfo.commonDishes}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                {culinaryInfo.cuisines && culinaryInfo.cuisines.length > 0 && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Common in Cuisines</h3>
                    <ul class="list-disc list-inside text-gray-700">
                      {culinaryInfo.cuisines.map((cuisine: string, index: number) => (
                        <li key={index}>{cuisine}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {culinaryInfo.harvestingSeason && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Harvesting Season</h3>
                    <p class="text-gray-700">{culinaryInfo.harvestingSeason}</p>
                  </div>
                )}

                {culinaryInfo.nutritionalInfo && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nutritional Information</h3>
                    <p class="text-gray-700">{culinaryInfo.nutritionalInfo}</p>
                  </div>
                )}

                {culinaryInfo.pairsWith && culinaryInfo.pairsWith.length > 0 && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Pairs Well With</h3>
                    <ul class="list-disc list-inside text-gray-700">
                      {culinaryInfo.pairsWith.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {culinaryInfo.storageMethod && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Storage Method</h3>
                    <p class="text-gray-700">{culinaryInfo.storageMethod}</p>
                  </div>
                )}
              </div>

              {/* Full Width Items */}
              <div class="col-span-1 md:col-span-2">
                {culinaryInfo.preservationMethods && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Preservation Methods</h3>
                    <p class="text-gray-700">{culinaryInfo.preservationMethods}</p>
                  </div>
                )}

                {culinaryInfo.specialConsiderations && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Special Considerations</h3>
                    <p class="text-gray-700">{culinaryInfo.specialConsiderations}</p>
                  </div>
                )}

                {culinaryInfo.notes && (
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
                    <p class="text-gray-700">{culinaryInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <p class="text-gray-600 mb-4">No culinary information has been added for this plant yet.</p>
            <p class="text-sm text-gray-500">
              Click the "Add Culinary Information" button to add details about how this plant is used in cooking.
            </p>
          </div>
        )}
      </div>
    </PlantAdminLayout>
  );
}
