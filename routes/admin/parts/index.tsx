import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { db } from "../../../utils/db.ts";
import { plantParts, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface PlantPartsPageData {
  parts: Array<{
    partId: number;
    plantId: number;
    plantName: string | null;
    partName: string;
    edible: boolean | null;
    description: string | null;
  }>;
}

export const handler: Handlers<PlantPartsPageData> = {
  async GET(_, ctx) {
    try {
      // Use Drizzle ORM to fetch plant parts
      const parts = await db.select({
        partId: plantParts.partId,
        plantId: plantParts.plantId,
        plantName: plants.botanicalName,
        partName: plantParts.partName,
        edible: plantParts.edible,
        description: plantParts.description,
      })
      .from(plantParts)
      .leftJoin(plants, eq(plantParts.plantId, plants.id));
      
      return ctx.render({ parts });
    } catch (error) {
      console.error("Error fetching plant parts:", error);
      return ctx.render({ parts: [] });
    }
  }
};

export default function PlantPartsPage({ data }: PageProps<PlantPartsPageData>) {
  const { parts } = data;
  
  return (
    <AdminLayout title="Plant Parts" currentPath="/admin/parts">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Plant Parts</h1>
        <Button href="/admin/parts/new">Add Plant Part</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edible
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {parts.map((part) => (
              <tr key={part.partId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {part.plantName || "Unknown Plant"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {part.partName}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {part.description || "No description"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    part.edible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {part.edible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/parts/${part.partId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/parts/edit/${part.partId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {parts.length === 0 && (
              <tr>
                <td colSpan={5} class="px-6 py-4 text-center text-sm text-gray-500">
                  No plant parts found. Click "Add Plant Part" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
