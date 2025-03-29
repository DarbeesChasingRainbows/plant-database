// routes/admin/plants/[id]/medicinal/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, medicinalProperties } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface MedicinalProperty {
  propertyId: number;
  propertyName: string;
  value: string;
  source?: string;
  notes?: string;
}

interface MedicinalPageData {
  plant: Plant;
  properties: MedicinalProperty[];
}

export const handler: Handlers<MedicinalPageData> = {
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

    // Fetch medicinal properties for this plant
    const properties = await db
      .select()
      .from(medicinalProperties)
      .where(eq(medicinalProperties.plantId, plantId))
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
      properties: properties,
    });
  },
};

export default function PlantMedicinalProperties({ data }: PageProps<MedicinalPageData>) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <PlantAdminLayout 
      plantId={data.plant.id} 
      plantName={data.plant.common_name} 
      activeTab="medicinal"
    >
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            Medicinal Properties - {data.plant.common_name}
          </h1>
          <a
            href={`/admin/plants/${data.plant.id}/medicinal/add`}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Property
          </a>
        </div>

        {!data.plant.is_medicinal && (
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700">
                  This plant is not marked as medicinal. <a href={`/admin/plants/edit/${data.plant.id}`} class="font-medium underline text-yellow-700 hover:text-yellow-600">Edit plant details</a> to mark it as medicinal.
                </p>
              </div>
            </div>
          </div>
        )}

        {data.properties.length === 0 ? (
          <div class="bg-white shadow overflow-hidden rounded-md p-6 text-center">
            <p class="text-gray-500">No medicinal properties have been added for this plant yet.</p>
            <a
              href={`/admin/plants/${data.plant.id}/medicinal/add`}
              class="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add First Property
            </a>
          </div>
        ) : (
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {data.properties.map((property) => (
                  <tr key={property.propertyId}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.propertyName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.value}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.source || "-"}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {property.notes || "-"}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/plants/${data.plant.id}/medicinal/edit/${property.propertyId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </a>
                      <a 
                        href={`/admin/plants/${data.plant.id}/medicinal/delete/${property.propertyId}`}
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PlantAdminLayout>
  );
}
