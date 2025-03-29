import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { db } from "../../../utils/db.ts";
import { plantParts, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface PlantPartDetailData {
  part?: {
    partId: number;
    plantId: number;
    plantName: string;
    partName: string;
    description: string | null;
    edible: boolean;
    harvestGuidelines: string | null;
    storageRequirements: string | null;
    processingNotes: string | null;
  };
  error?: string;
}

export const handler: Handlers<PlantPartDetailData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const partId = parseInt(id);

    if (isNaN(partId)) {
      return ctx.render({ error: "Invalid plant part ID" });
    }

    try {
      // Use Drizzle ORM to fetch the plant part with plant details
      const results = await db.select({
        partId: plantParts.partId,
        plantId: plantParts.plantId,
        plantName: plants.botanicalName,
        partName: plantParts.partName,
        description: plantParts.description,
        edible: plantParts.edible,
        harvestGuidelines: plantParts.harvestGuidelines,
        storageRequirements: plantParts.storageRequirements,
        processingNotes: plantParts.processingNotes,
      })
      .from(plantParts)
      .leftJoin(plants, eq(plantParts.plantId, plants.id))
      .where(eq(plantParts.partId, partId))
      .limit(1);

      if (results.length === 0) {
        return ctx.render({ error: "Plant part not found" });
      }

      return ctx.render({ part: results[0] });
    } catch (error) {
      console.error("Error fetching plant part:", error);
      return ctx.render({ error: "Failed to fetch plant part details" });
    }
  }
};

export default function PlantPartDetailPage({ data }: PageProps<PlantPartDetailData>) {
  const { part, error } = data;

  if (error) {
    return (
      <AdminLayout title="Error" currentPath="/admin/parts">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
        <a href="/admin/parts" class="text-indigo-600 hover:text-indigo-900">
          &larr; Back to Plant Parts
        </a>
      </AdminLayout>
    );
  }

  if (!part) {
    return (
      <AdminLayout title="Loading..." currentPath="/admin/parts">
        <div>Loading plant part details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${part.partName} - ${part.plantName}`} currentPath="/admin/parts">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{part.partName} - {part.plantName}</h1>
        <div class="space-x-2">
          <a 
            href={`/admin/parts/edit/${part.partId}`} 
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Edit Part
          </a>
          <a 
            href="/admin/parts" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to Parts
          </a>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Plant Part Details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this plant part.</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Plant</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a href={`/admin/plants/${part.plantId}`} class="text-indigo-600 hover:text-indigo-900">
                  {part.plantName}
                </a>
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Part Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {part.partName}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {part.description || "No description available"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Edible</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  part.edible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {part.edible ? 'Yes' : 'No'}
                </span>
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Harvest Guidelines</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {part.harvestGuidelines || "No harvest guidelines available"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Storage Requirements</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {part.storageRequirements || "No storage requirements specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Processing Notes</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {part.processingNotes || "No processing notes available"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}
