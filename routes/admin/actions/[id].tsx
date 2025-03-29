import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { herbalActions, plantActions, plants, plantParts } from "../../../utils/schema.ts";
import { db } from "../../../utils/db.ts";
import { eq } from "drizzle-orm";

interface HerbalActionDetailData {
  action: {
    actionId: number;
    actionName: string;
    description: string | null;
    scientificBasis: string | null;
    historicalContext: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  plantsWithAction: Array<{
    plantId: number;
    botanicalName: string;
    commonName: string;
    partName: string | null;
    specificNotes: string | null;
    strengthRating: number | null;
  }>;
}

export const handler: Handlers<HerbalActionDetailData> = {
  async GET(_, ctx) {
    try {
      const id = parseInt(ctx.params.id);
      if (isNaN(id)) {
        return ctx.renderNotFound();
      }

      // Use Drizzle ORM to fetch the herbal action
      const action = await db.query.herbalActions.findFirst({
        where: eq(herbalActions.actionId, id)
      });

      if (!action) {
        return ctx.renderNotFound();
      }

      // Use Drizzle ORM to fetch plants that have this action
      const plantsWithAction = await db
        .select({
          plantId: plants.id,
          botanicalName: plants.botanicalName,
          commonName: plants.commonName,
          partName: plantParts.partName,
          specificNotes: plantActions.specificNotes,
          strengthRating: plantActions.strengthRating,
        })
        .from(plantActions)
        .innerJoin(plants, eq(plantActions.plantId, plants.id))
        .leftJoin(plantParts, eq(plantActions.partId, plantParts.partId))
        .where(eq(plantActions.actionId, id));

      return ctx.render({ action, plantsWithAction });
    } catch (error) {
      console.error("Error fetching herbal action details:", error);
      return ctx.renderNotFound();
    }
  }
};

export default function HerbalActionDetailPage({ data }: PageProps<HerbalActionDetailData>) {
  const { action, plantsWithAction } = data;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <AdminLayout title={`Herbal Action: ${action.actionName}`} currentPath="/admin/actions">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{action.actionName}</h1>
        <div class="space-x-2">
          <Button href={`/admin/actions/edit/${action.actionId}`} primary>Edit Action</Button>
          <Button href="/admin/actions">Back to Actions</Button>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">Action Details</h2>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Action Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{action.actionName}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {action.description || "No description provided"}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Scientific Basis</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {action.scientificBasis || "No scientific basis provided"}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Historical Context</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {action.historicalContext || "No historical context provided"}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Created</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(action.createdAt)}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(action.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 class="text-xl font-semibold mb-4">Plants with this Action</h2>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strength
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {plantsWithAction.map((plant) => (
              <tr key={`${plant.plantId}-${plant.partName || 'general'}`}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plant.botanicalName} ({plant.commonName})
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {plant.partName || "Whole plant"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {plant.strengthRating ? `${plant.strengthRating}/10` : "Not rated"}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {plant.specificNotes || "No specific notes"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/plants/details/${plant.plantId}`} class="text-indigo-600 hover:text-indigo-900">
                    View Plant
                  </a>
                </td>
              </tr>
            ))}
            {plantsWithAction.length === 0 && (
              <tr>
                <td colSpan={5} class="px-6 py-4 text-center text-sm text-gray-500">
                  No plants found with this herbal action.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
