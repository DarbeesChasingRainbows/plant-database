import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { herbalActions } from "../../../utils/schema.ts";
import { db } from "../../../utils/db.ts";

interface HerbalActionsPageData {
  actions: Array<{
    actionId: number;
    actionName: string;
    description: string | null;
    scientificBasis: string | null;
    historicalContext: string | null;
  }>;
}

export const handler: Handlers<HerbalActionsPageData> = {
  async GET(_, ctx) {
    try {
      // Use Drizzle ORM to fetch herbal actions
      const actions = await db.select({
        actionId: herbalActions.actionId,
        actionName: herbalActions.actionName,
        description: herbalActions.description,
        scientificBasis: herbalActions.scientificBasis,
        historicalContext: herbalActions.historicalContext,
      }).from(herbalActions);
      
      return ctx.render({ actions });
    } catch (error) {
      console.error("Error fetching herbal actions:", error);
      return ctx.render({ actions: [] });
    }
  }
};

export default function HerbalActionsPage({ data }: PageProps<HerbalActionsPageData>) {
  const { actions } = data;
  
  return (
    <AdminLayout title="Herbal Actions" currentPath="/admin/actions">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Herbal Actions</h1>
        <Button href="/admin/actions/new">Add Herbal Action</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scientific Basis
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Historical Context
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {actions.map((action) => (
              <tr key={action.actionId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {action.actionName}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {action.description || "No description"}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {action.scientificBasis || "Not specified"}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {action.historicalContext || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/actions/${action.actionId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/actions/edit/${action.actionId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {actions.length === 0 && (
              <tr>
                <td colSpan={5} class="px-6 py-4 text-center text-sm text-gray-500">
                  No herbal actions found. Click "Add Herbal Action" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
