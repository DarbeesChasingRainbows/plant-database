// routes/admin/plants/[id]/actions/add.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, herbalActions, plantActions } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface Action {
  actionId: number;
  actionName: string;
}

interface ActionPageData {
  plant: Plant;
  actions: Action[];
}

export const handler: Handlers<ActionPageData> = {
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

    // Fetch all actions ordered by actionName
    const actions = await db
      .select()
      .from(herbalActions)
      .orderBy(herbalActions.actionName)
      .execute();

    if (plant.length === 0) {
      return ctx.render(undefined);
    }

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
      actions: actions.map((action) => ({
        actionId: action.actionId,
        actionName: action.actionName,
      })),
    });
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    
    // Validate that id is a valid number
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }
    
    const form = await req.formData();

    // Extract form data
    const actionId = Number(form.get("action_id"));
    const specificNotes = form.get("specific_notes") as string;
    const strengthRating = Number(form.get("strength_rating"));
    const researchReferences = form.get("research_references") as
      | string
      | null;

    // Insert the new plant action
    await db.insert(plantActions).values({
      plantId: plantId,
      actionId: actionId,
      specificNotes: specificNotes,
      strengthRating: strengthRating,
      researchReferences: researchReferences || undefined,
    }).execute();

    return new Response("", {
      status: 303,
      headers: { Location: `/admin/plants/${id}/actions` },
    });
  },
};

export default function AddPlantAction({ data }: PageProps<ActionPageData>) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <PlantAdminLayout 
      plantId={data.plant.id} 
      plantName={data.plant.common_name} 
      activeTab="actions"
    >
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">
          Add Herbal Action - {data.plant.common_name}
        </h1>

        <form method="POST" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Select Action
              <select
                name="action_id"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Choose an action...</option>
                {data.actions.map((action) => (
                  <option key={action.actionId} value={action.actionId}>
                    {action.actionName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Strength Rating (1-10)
              <input
                type="number"
                name="strength_rating"
                min="1"
                max="10"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Specific Notes
              <textarea
                name="specific_notes"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Describe how this plant demonstrates this action..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Research References
              <textarea
                name="research_references"
                rows={4}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Add any research references supporting this action..."
              />
            </label>
          </div>

          <div class="flex justify-end space-x-4">
            <a
              href={`/admin/plants/${data.plant.id}`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Action
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
