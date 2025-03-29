import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { plantings, plants } from "../../../utils/schema.ts";
import { db } from "../../../utils/db.ts";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

interface GrowingRecordsPageData {
  records: Array<{
    plantingId: number;
    plantName: string;
    plantingDate: Date | null;
    plantingMethod: string | null;
    quantityPlanted: number | null;
    status: string;
  }>;
}

export const handler: Handlers<GrowingRecordsPageData> = {
  async GET(_, ctx) {
    try {
      // Use Drizzle ORM to fetch growing records
      const records = await db.select({
        plantingId: plantings.plantingId,
        plantName: plants.botanicalName,
        plantingDate: plantings.plantingDate,
        plantingMethod: plantings.plantingMethod,
        quantityPlanted: plantings.quantityPlanted,
        // Since there's no status field in the schema, we'll default to 'active'
        status: sql<string>`'active'`.as('status'),
      })
      .from(plantings)
      .leftJoin(plants, eq(plantings.plantId, plants.id));
      
      return ctx.render({ records });
    } catch (error) {
      console.error("Error fetching growing records:", error);
      return ctx.render({ records: [] });
    }
  }
};

export default function GrowingRecordsPage({ data }: PageProps<GrowingRecordsPageData>) {
  const { records } = data;
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <AdminLayout title="Growing Records" currentPath="/admin/growing">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Growing Records</h1>
        <Button href="/admin/growing/new">Add Growing Record</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Planting Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
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
            {records.map((record) => (
              <tr key={record.plantingId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.plantName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.plantingDate)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.plantingMethod || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.quantityPlanted || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'active' ? 'bg-green-100 text-green-800' :
                    record.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/growing/${record.plantingId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/growing/edit/${record.plantingId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} class="px-6 py-4 text-center text-sm text-gray-500">
                  No growing records found. Click "Add Growing Record" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
