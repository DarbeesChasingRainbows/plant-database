// routes/admin/plants/[id]/ayurvedic/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantAyurvedicProperties, plantAyurvedicActions } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface AyurvedicData {
  properties: any[];
  actions: any[];
}

interface AyurvedicPageData {
  plant: Plant;
  ayurvedicData: AyurvedicData;
}

export const handler: Handlers<AyurvedicPageData> = {
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

      // Fetch Ayurvedic data
      const properties = await db.select().from(plantAyurvedicProperties).where(
        eq(plantAyurvedicProperties.plantId, plantId),
      ).execute();

      const actions = await db.select().from(plantAyurvedicActions).where(
        eq(plantAyurvedicActions.plantId, plantId),
      ).execute();

      return ctx.render({
        plant: plantData,
        ayurvedicData: {
          properties,
          actions
        }
      });
    } catch (error) {
      console.error("Error fetching Ayurvedic data:", error);
      return new Response("Error fetching Ayurvedic data", { status: 500 });
    }
  },
};

export default function AyurvedicPage({ data }: PageProps<AyurvedicPageData>) {
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

  const { plant, ayurvedicData } = data;
  const { properties, actions } = ayurvedicData;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="ayurvedic"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Ayurvedic Medicine</h1>
          <p class="text-gray-600">
            Ayurvedic information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Properties Section */}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Ayurvedic Properties</h2>
              <a
                href={`/admin/plants/${plant.id}/ayurvedic/properties/add`}
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add Property
              </a>
            </div>
            <div class="px-4 py-5">
              {properties.length > 0 ? (
                <ul class="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <li key={property.propertyId} class="py-4">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="text-sm font-medium">
                            {property.dosha && <span>Dosha: {property.dosha.join(', ')}</span>}
                          </h3>
                          {property.rasa && (
                            <p class="mt-1 text-sm text-gray-600">Rasa (Taste): {property.rasa.join(', ')}</p>
                          )}
                          {property.guna && (
                            <p class="mt-1 text-sm text-gray-600">Guna (Quality): {property.guna.join(', ')}</p>
                          )}
                          {property.virya && (
                            <p class="mt-1 text-sm text-gray-600">Virya (Potency): {property.virya}</p>
                          )}
                          {property.vipaka && (
                            <p class="mt-1 text-sm text-gray-600">Vipaka (Post-digestive effect): {property.vipaka}</p>
                          )}
                          {property.notes && (
                            <p class="mt-1 text-sm text-gray-600">Notes: {property.notes}</p>
                          )}
                        </div>
                        <a
                          href={`/admin/plants/${plant.id}/ayurvedic/properties/edit/${property.propertyId}`}
                          class="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-gray-500 text-center py-4">No Ayurvedic properties have been added yet.</p>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Ayurvedic Actions</h2>
              <a
                href={`/admin/plants/${plant.id}/ayurvedic/actions/add`}
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add Action
              </a>
            </div>
            <div class="px-4 py-5">
              {actions.length > 0 ? (
                <ul class="divide-y divide-gray-200">
                  {actions.map((action) => (
                    <li key={action.actionId} class="py-4">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="text-sm font-medium">{action.action}</h3>
                          {action.description && (
                            <p class="mt-1 text-sm text-gray-600">{action.description}</p>
                          )}
                          {action.sanskritName && (
                            <p class="mt-1 text-sm text-gray-600">Sanskrit: {action.sanskritName}</p>
                          )}
                        </div>
                        <a
                          href={`/admin/plants/${plant.id}/ayurvedic/actions/edit/${action.actionId}`}
                          class="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-gray-500 text-center py-4">No Ayurvedic actions have been added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PlantAdminLayout>
  );
}
