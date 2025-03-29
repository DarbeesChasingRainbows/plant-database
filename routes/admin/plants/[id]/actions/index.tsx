// routes/admin/plants/[id]/actions/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantActions, herbalActions, plantParts } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface PlantAction {
  plantActionId: number;
  actionName: string;
  partName?: string;
  specificNotes: string;
  strengthRating: number;
  researchReferences?: string;
}

interface ActionsPageData {
  plant: Plant;
  actions: PlantAction[];
}

export const handler: Handlers<ActionsPageData> = {
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

    // Fetch all actions for this plant with join to get action names and part names
    const actions = await db
      .select({
        plantActionId: plantActions.plantActionId,
        actionName: herbalActions.actionName,
        partName: plantParts.partName,
        specificNotes: plantActions.specificNotes,
        strengthRating: plantActions.strengthRating,
        researchReferences: plantActions.researchReferences,
      })
      .from(plantActions)
      .leftJoin(herbalActions, eq(plantActions.actionId, herbalActions.actionId))
      .leftJoin(plantParts, eq(plantActions.partId, plantParts.partId))
      .where(eq(plantActions.plantId, plantId))
      .orderBy(herbalActions.actionName)
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
      is_medicinal: false, // Add default value if not in the database
      is_food_crop: false, // Add default value if not in the database
      created_at: plant[0].createdAt,
      updated_at: plant[0].updatedAt
    };

    return ctx.render({
      plant: plantData,
      actions: actions,
    });
  },
};

export default function PlantActions({ data }: PageProps<ActionsPageData>) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <PlantAdminLayout 
      plantId={data.plant.id} 
      plantName={data.plant.common_name} 
      activeTab="actions"
    >
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            Herbal Actions - {data.plant.common_name}
          </h1>
          <a
            href={`/admin/plants/${data.plant.id}/actions/add`}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Action
          </a>
        </div>

        {data.actions.length === 0 ? (
          <div class="bg-white shadow overflow-hidden rounded-md p-6 text-center">
            <p class="text-gray-500">No herbal actions have been added for this plant yet.</p>
            <a
              href={`/admin/plants/${data.plant.id}/actions/add`}
              class="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add First Action
            </a>
          </div>
        ) : (
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plant Part
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Strength
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
                {data.actions.map((action) => (
                  <tr key={action.plantActionId}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {action.actionName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {action.partName || "All parts"}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="flex items-center">
                        <span class="text-sm font-medium mr-2">{action.strengthRating}/10</span>
                        <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            class="h-full bg-green-500" 
                            style={{ width: `${action.strengthRating * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {action.specificNotes}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/plants/${data.plant.id}/actions/edit/${action.plantActionId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </a>
                      <a 
                        href={`/admin/plants/${data.plant.id}/actions/delete/${action.plantActionId}`}
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
