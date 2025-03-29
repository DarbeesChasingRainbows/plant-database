import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { db } from "../../../../utils/db.ts";
import { cropRotations, gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface CropRotation {
  rotationId: number;
  bedId: number;
  season: string | null;
  year: number;
  plantFamilies: string[] | null;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  bedCode?: string;
}

interface CropRotationsPageData {
  cropRotations: CropRotation[];
}

export const handler: Handlers<CropRotationsPageData> = {
  async GET(_, ctx) {
    // Get all crop rotations with bed information
    const rotationsList = await db.select({
      rotationId: cropRotations.rotationId,
      bedId: cropRotations.bedId,
      season: cropRotations.season,
      year: cropRotations.year,
      plantFamilies: cropRotations.plantFamilies,
      notes: cropRotations.notes,
      createdAt: cropRotations.createdAt,
      updatedAt: cropRotations.updatedAt,
      bedCode: gardenBeds.bedCode,
    })
    .from(cropRotations)
    .leftJoin(gardenBeds, eq(cropRotations.bedId, gardenBeds.bedId))
    .orderBy(cropRotations.year, cropRotations.season);
    
    return ctx.render({ cropRotations: rotationsList });
  }
};

export default function CropRotationsPage({ data }: PageProps<CropRotationsPageData>) {
  const { cropRotations } = data;
  
  // Format plant families for display
  const formatPlantFamilies = (families: string[] | null) => {
    if (!families || families.length === 0) return 'None';
    return families.join(', ');
  };
  
  return (
    <AdminLayout title="Crop Rotations" currentPath="/admin/garden/crop-rotations">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Crop Rotations</h1>
        <Button href="/admin/garden/crop-rotations/new">Add Crop Rotation</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Season
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Garden Bed
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant Families
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {cropRotations.map((rotation) => (
              <tr key={rotation.rotationId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {rotation.year}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rotation.season || 'Not specified'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rotation.bedCode || `Bed ID: ${rotation.bedId}`}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {formatPlantFamilies(rotation.plantFamilies)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/garden/crop-rotations/${rotation.rotationId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/garden/crop-rotations/edit/${rotation.rotationId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {cropRotations.length === 0 && (
              <tr>
                <td colSpan={5} class="px-6 py-4 text-center text-sm text-gray-500">
                  No crop rotations found. Click "Add Crop Rotation" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
