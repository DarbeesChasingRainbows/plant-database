import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { db } from "../../../../utils/db.ts";
import { gardenBeds, plots, GardenBed } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface GardenBedsPageData {
  beds: (GardenBed & { plotCode: string })[];
}

export const handler: Handlers<GardenBedsPageData> = {
  async GET(_, ctx) {
    const bedsWithPlots = await db
      .select({
        ...gardenBeds,
        plotCode: plots.plotCode
      })
      .from(gardenBeds)
      .leftJoin(plots, eq(gardenBeds.plotId, plots.plotId));
    
    return ctx.render({ beds: bedsWithPlots as any });
  }
};

export default function GardenBedsPage({ data }: PageProps<GardenBedsPageData>) {
  const { beds } = data;
  
  return (
    <AdminLayout title="Garden Beds">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Garden Beds</h1>
        <Button href="/admin/garden/beds/new">Add Garden Bed</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bed Code
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plot
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
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
            {beds.map((bed) => (
              <tr key={bed.bedId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bed.bedCode}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bed.bedName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bed.plotCode}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bed.lengthCm && bed.widthCm ? 
                    `${bed.lengthCm} × ${bed.widthCm} cm` : 
                    bed.areaSqm ? `${bed.areaSqm} m²` : 'N/A'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bed.status === 'active' ? 'bg-green-100 text-green-800' :
                    bed.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bed.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/garden/beds/${bed.bedId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/garden/beds/edit/${bed.bedId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {beds.length === 0 && (
              <tr>
                <td colSpan={6} class="px-6 py-4 text-center text-sm text-gray-500">
                  No garden beds found. Click "Add Garden Bed" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
