import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, plantParts as plantPartsTable } from "../../../../utils/schema.ts";

interface PlantPart {
  partId: number;
  plantId: number;
  partName: string;
  description: string | null;
  edible: boolean;
  harvestGuidelines: string | null;
  storageRequirements: string | null;
  processingNotes: string | null;
}

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface Data {
  plant: Plant | null;
  plantParts: PlantPart[];
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    try {
      const { id } = ctx.params;
      const plantId = parseInt(id);
      
      if (isNaN(plantId)) {
        return ctx.render({ 
          plant: null, 
          plantParts: [],
          error: "Invalid plant ID" 
        });
      }

      // Get plant data using Drizzle ORM
      const plantResult = await db.select({
        id: plants.id,
        commonName: plants.commonName,
        botanicalName: plants.botanicalName
      }).from(plants).where(eq(plants.id, plantId));
      
      const plant = plantResult[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          plantParts: [],
          error: "Plant not found" 
        });
      }

      // Get plant parts using Drizzle ORM
      const plantPartsResult = await db.select({
        partId: plantPartsTable.partId,
        plantId: plantPartsTable.plantId,
        partName: plantPartsTable.partName,
        description: plantPartsTable.description,
        edible: plantPartsTable.edible,
        harvestGuidelines: plantPartsTable.harvestGuidelines,
        storageRequirements: plantPartsTable.storageRequirements,
        processingNotes: plantPartsTable.processingNotes
      }).from(plantPartsTable).where(eq(plantPartsTable.plantId, plantId));
      
      return ctx.render({
        plant,
        plantParts: plantPartsResult,
      });
    } catch (error) {
      console.error("Error fetching plant parts:", error);
      return ctx.render({
        plant: null,
        plantParts: [],
        error: `Error fetching plant parts: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return ctx.render({ 
        plant: null, 
        plantParts: [],
        error: "Invalid plant ID" 
      });
    }

    try {
      const form = await req.formData();
      const action = form.get("action")?.toString();
      
      if (action === "delete") {
        const partId = Number(form.get("partId"));
        if (isNaN(partId)) {
          throw new Error("Invalid part ID");
        }

        // Delete the plant part using Drizzle ORM
        await db.delete(plantPartsTable).where(eq(plantPartsTable.partId, partId), eq(plantPartsTable.plantId, plantId));
      }

      // Redirect to the same page to refresh
      return new Response("", {
        status: 303,
        headers: { Location: `/admin/plants/parts/${id}` },
      });
    } catch (error) {
      console.error("Error processing form:", error);
      
      // Get plant details for re-rendering
      const plantResult = await db.select({
        id: plants.id,
        commonName: plants.commonName,
        botanicalName: plants.botanicalName
      }).from(plants).where(eq(plants.id, plantId));
      
      const plant = plantResult[0] || null;
      
      // Get plant parts for re-rendering
      const plantPartsResult = await db.select({
        partId: plantPartsTable.partId,
        plantId: plantPartsTable.plantId,
        partName: plantPartsTable.partName,
        description: plantPartsTable.description,
        edible: plantPartsTable.edible,
        harvestGuidelines: plantPartsTable.harvestGuidelines,
        storageRequirements: plantPartsTable.storageRequirements,
        processingNotes: plantPartsTable.processingNotes
      }).from(plantPartsTable).where(eq(plantPartsTable.plantId, plantId));
      
      const plantParts = plantPartsResult;

      return ctx.render({
        plant,
        plantParts,
        error: `Error processing form: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
};

export default function PlantParts({ data }: PageProps<Data>) {
  const { plant, plantParts, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="parts">
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <Button href="/admin/plants">Back to Plants</Button>
        </div>
      </PlantAdminLayout>
    );
  }

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="parts">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">Plant not found</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <Button href="/admin/plants">Back to Plants</Button>
        </div>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="parts">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Plant Parts</h1>
        <div class="flex space-x-2">
          <Button href={`/admin/plants/parts/new/${plant.id}`}>Add Plant Part</Button>
        </div>
      </div>
      
      {plantParts.length === 0 ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No plant parts have been added yet.</p>
          <Button href={`/admin/plants/parts/new/${plant.id}`} class="mt-2">Add First Plant Part</Button>
        </div>
      ) : (
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edible
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {plantParts.map((part) => (
                <tr key={part.partId}>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {part.partName}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {part.edible ? (
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        No
                      </span>
                    )}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {part.description || "-"}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <a href={`/admin/plants/parts/edit/${plant.id}/${part.partId}`} class="text-blue-600 hover:text-blue-900">
                        Edit
                      </a>
                      <form method="POST" class="inline">
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="partId" value={part.partId} />
                        <button 
                          type="submit" 
                          class="text-red-600 hover:text-red-900"
                          onClick={(e) => {
                            if (!confirm(`Are you sure you want to delete ${part.partName}?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PlantAdminLayout>
  );
}
