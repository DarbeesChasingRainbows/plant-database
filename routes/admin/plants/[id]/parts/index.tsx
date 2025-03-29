// routes/admin/plants/[id]/parts/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantParts } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface PlantPart {
  partId: number;
  plantId: number;
  partName: string;
  description: string | null;
  medicalUses: string | null;
  culinaryUses: string | null;
  otherUses: string | null;
  harvesting: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PartsPageData {
  plant: Plant;
  parts: PlantPart[];
}

export const handler: Handlers<PartsPageData> = {
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

      // Fetch plant parts
      const parts = await db.select().from(plantParts).where(
        eq(plantParts.plantId, plantId),
      ).execute();

      return ctx.render({
        plant: plantData,
        parts: parts,
      });
    } catch (error) {
      console.error("Error fetching plant parts data:", error);
      return new Response("Error fetching plant parts data", { status: 500 });
    }
  },
};

export default function PartsPage({ data }: PageProps<PartsPageData>) {
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

  const { plant, parts } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="parts"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Plant Parts</h1>
          <a
            href={`/admin/plants/${plant.id}/parts/add`}
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Plant Part
          </a>
        </div>

        {parts.length > 0 ? (
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uses
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {parts.map((part) => (
                  <tr key={part.partId}>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{part.partName}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500 line-clamp-2">
                        {part.description || "No description"}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500">
                        {(part.medicalUses || part.culinaryUses || part.otherUses) ? (
                          <ul class="list-disc list-inside">
                            {part.medicalUses && <li>Medical</li>}
                            {part.culinaryUses && <li>Culinary</li>}
                            {part.otherUses && <li>Other</li>}
                          </ul>
                        ) : (
                          "No uses specified"
                        )}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/plants/${plant.id}/parts/${part.partId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                        View
                      </a>
                      <a href={`/admin/plants/${plant.id}/parts/edit/${part.partId}`} class="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <p class="text-gray-600 mb-4">No plant parts have been added for this plant yet.</p>
            <p class="text-sm text-gray-500">
              Click the "Add Plant Part" button to add information about different parts of this plant.
            </p>
          </div>
        )}
      </div>
    </PlantAdminLayout>
  );
}
