import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { db } from "../../../../utils/db.ts";
import { plots, Plot } from "../../../../utils/schema.ts";

interface PlotsPageData {
  plots: Plot[];
}

export const handler: Handlers<PlotsPageData> = {
  async GET(_, ctx) {
    const plotsList = await db.select().from(plots);
    return ctx.render({ plots: plotsList });
  }
};

export default function PlotsPage({ data }: PageProps<PlotsPageData>) {
  const { plots } = data;
  
  // Convert square meters to square feet
  const toSquareFeet = (sqm?: number | null) => {
    if (!sqm) return 'Not specified';
    // 1 square meter = 10.764 square feet
    const sqft = Math.round(sqm * 10.764 * 100) / 100;
    return `${sqft} sq ft`;
  };
  
  return (
    <AdminLayout title="Garden Plots" currentPath="/admin/garden/plots">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Garden Plots</h1>
        <Button href="/admin/garden/plots/new">Add Plot</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plot Code
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size (sq ft)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orientation
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sun Exposure
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {plots.map((plot) => (
              <tr key={plot.plotId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plot.plotCode}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {toSquareFeet(plot.sizeSqm)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {plot.orientation}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {plot.sunExposure}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    plot.status === 'active' ? 'bg-green-100 text-green-800' :
                    plot.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plot.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/garden/plots/${plot.plotId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/garden/plots/edit/${plot.plotId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {plots.length === 0 && (
              <tr>
                <td colSpan={6} class="px-6 py-4 text-center text-sm text-gray-500">
                  No plots found. Click "Add Plot" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
