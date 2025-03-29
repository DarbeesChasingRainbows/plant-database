import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { db } from "../../../utils/db.ts";
import { medicinalProperties, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface MedicinalPropertiesPageData {
  properties: Array<{
    medPropId: number;
    plantId: number;
    plantName: string | null;
    traditionalUses: string | null;
    dosageGuidelines: string | null;
    safetyNotes: string | null;
  }>;
}

export const handler: Handlers<MedicinalPropertiesPageData> = {
  async GET(_, ctx) {
    try {
      // Use Drizzle ORM to fetch medicinal properties
      const properties = await db.select({
        medPropId: medicinalProperties.medPropId,
        plantId: medicinalProperties.plantId,
        plantName: plants.botanicalName,
        traditionalUses: medicinalProperties.traditionalUses,
        dosageGuidelines: medicinalProperties.dosageGuidelines,
        safetyNotes: medicinalProperties.safetyNotes,
      })
      .from(medicinalProperties)
      .leftJoin(plants, eq(medicinalProperties.plantId, plants.id));
      
      return ctx.render({ properties });
    } catch (error) {
      console.error("Error fetching medicinal properties:", error);
      return ctx.render({ properties: [] });
    }
  }
};

export default function MedicinalPropertiesPage({ data }: PageProps<MedicinalPropertiesPageData>) {
  const { properties } = data;
  
  return (
    <AdminLayout title="Medicinal Properties" currentPath="/admin/medicinal">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Medicinal Properties</h1>
        <Button href="/admin/medicinal/new">Add Medicinal Property</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Traditional Uses
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage Guidelines
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Safety Notes
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.medPropId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {property.plantName || "Unknown Plant"}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {property.traditionalUses || "Not specified"}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {property.dosageGuidelines || "Not specified"}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {property.safetyNotes || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/medicinal/${property.medPropId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/medicinal/edit/${property.medPropId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} class="px-6 py-4 text-center text-sm text-gray-500">
                  No medicinal properties found. Click "Add Medicinal Property" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
