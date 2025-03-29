import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../../../utils/client.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

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

interface FormData {
  partName: string;
  description: string;
  edible: boolean;
  harvestGuidelines: string;
  storageRequirements: string;
  processingNotes: string;
}

interface Data {
  plant: Plant | null;
  plantPart: PlantPart | null;
  formData?: FormData;
  error?: string;
  success?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const plantId = Number(ctx.params.plantId);
    const partId = Number(ctx.params.partId);
    
    if (isNaN(plantId) || isNaN(partId)) {
      return ctx.render({ 
        plant: null,
        plantPart: null,
        error: "Invalid IDs" 
      });
    }

    try {
      // Get plant details
      const plantQuery = `
        SELECT
          id,
          common_name as "commonName",
          botanical_name as "botanicalName"
        FROM plants
        WHERE id = $1
      `;
      
      const plantResult = await db.pool.query(plantQuery, [plantId]);
      const plant = plantResult.rows[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null,
          plantPart: null,
          error: "Plant not found" 
        });
      }

      // Get plant part details
      const partQuery = `
        SELECT
          part_id as "partId",
          plant_id as "plantId",
          part_name as "partName",
          description,
          edible,
          harvest_guidelines as "harvestGuidelines",
          storage_requirements as "storageRequirements",
          processing_notes as "processingNotes"
        FROM plant_part
        WHERE part_id = $1 AND plant_id = $2
      `;
      
      const partResult = await db.pool.query(partQuery, [partId, plantId]);
      const plantPart = partResult.rows[0] || null;

      if (!plantPart) {
        return ctx.render({ 
          plant,
          plantPart: null,
          error: "Plant part not found" 
        });
      }

      return ctx.render({
        plant,
        plantPart,
        formData: {
          partName: plantPart.partName,
          description: plantPart.description || "",
          edible: plantPart.edible,
          harvestGuidelines: plantPart.harvestGuidelines || "",
          storageRequirements: plantPart.storageRequirements || "",
          processingNotes: plantPart.processingNotes || "",
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return ctx.render({
        plant: null,
        plantPart: null,
        error: `Error fetching data: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },

  async POST(req, ctx) {
    const plantId = Number(ctx.params.plantId);
    const partId = Number(ctx.params.partId);
    
    if (isNaN(plantId) || isNaN(partId)) {
      return ctx.render({ 
        plant: null,
        plantPart: null,
        error: "Invalid IDs" 
      });
    }

    try {
      const form = await req.formData();
      
      const formData: FormData = {
        partName: form.get("partName")?.toString() || "",
        description: form.get("description")?.toString() || "",
        edible: form.get("edible") === "on",
        harvestGuidelines: form.get("harvestGuidelines")?.toString() || "",
        storageRequirements: form.get("storageRequirements")?.toString() || "",
        processingNotes: form.get("processingNotes")?.toString() || "",
      };

      // Validate form data
      if (!formData.partName) {
        throw new Error("Part name is required");
      }

      // Get plant details
      const plantQuery = `
        SELECT
          id,
          common_name as "commonName",
          botanical_name as "botanicalName"
        FROM plants
        WHERE id = $1
      `;
      
      const plantResult = await db.pool.query(plantQuery, [plantId]);
      const plant = plantResult.rows[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null,
          plantPart: null,
          formData,
          error: "Plant not found" 
        });
      }

      // Get plant part to verify it exists
      const partQuery = `
        SELECT
          part_id as "partId",
          plant_id as "plantId"
        FROM plant_part
        WHERE part_id = $1 AND plant_id = $2
      `;
      
      const partResult = await db.pool.query(partQuery, [partId, plantId]);
      const plantPart = partResult.rows[0] || null;

      if (!plantPart) {
        return ctx.render({ 
          plant,
          plantPart: null,
          formData,
          error: "Plant part not found" 
        });
      }

      // Update the plant part
      const updateQuery = `
        UPDATE plant_part
        SET
          part_name = $1,
          description = $2,
          edible = $3,
          harvest_guidelines = $4,
          storage_requirements = $5,
          processing_notes = $6,
          updated_at = NOW()
        WHERE part_id = $7 AND plant_id = $8
      `;

      await db.pool.query(updateQuery, [
        formData.partName,
        formData.description || null,
        formData.edible,
        formData.harvestGuidelines || null,
        formData.storageRequirements || null,
        formData.processingNotes || null,
        partId,
        plantId
      ]);

      // Redirect to the plant parts page
      return new Response("", {
        status: 303,
        headers: { Location: `/admin/plants/parts/${plantId}` },
      });
    } catch (error) {
      console.error("Error updating plant part:", error);
      
      // Get plant details for re-rendering
      const plantQuery = `
        SELECT
          id,
          common_name as "commonName",
          botanical_name as "botanicalName"
        FROM plants
        WHERE id = $1
      `;
      
      const plantResult = await db.pool.query(plantQuery, [plantId]);
      const plant = plantResult.rows[0] || null;

      // Get plant part for re-rendering
      const partQuery = `
        SELECT
          part_id as "partId",
          plant_id as "plantId",
          part_name as "partName",
          description,
          edible,
          harvest_guidelines as "harvestGuidelines",
          storage_requirements as "storageRequirements",
          processing_notes as "processingNotes"
        FROM plant_part
        WHERE part_id = $1 AND plant_id = $2
      `;
      
      const partResult = await db.pool.query(partQuery, [partId, plantId]);
      const plantPart = partResult.rows[0] || null;

      // Re-render the form with the error
      const form = await req.formData();
      const formData: FormData = {
        partName: form.get("partName")?.toString() || "",
        description: form.get("description")?.toString() || "",
        edible: form.get("edible") === "on",
        harvestGuidelines: form.get("harvestGuidelines")?.toString() || "",
        storageRequirements: form.get("storageRequirements")?.toString() || "",
        processingNotes: form.get("processingNotes")?.toString() || "",
      };

      return ctx.render({
        plant,
        plantPart,
        formData,
        error: `Error updating plant part: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
};

export default function EditPlantPart({ data }: PageProps<Data>) {
  const { plant, plantPart, formData, error, success } = data;

  if (error && (!plant || !plantPart)) {
    return (
      <PlantAdminLayout plantId={plant?.id || 0} plantName={plant?.commonName || "Error"} activeTab="parts">
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
          {plant ? (
            <Button href={`/admin/plants/parts/${plant.id}`}>Back to Plant Parts</Button>
          ) : (
            <Button href="/admin/plants">Back to Plants</Button>
          )}
        </div>
      </PlantAdminLayout>
    );
  }

  if (!plant || !plantPart) {
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
              <p class="text-sm text-yellow-700">Resource not found</p>
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
        <h1 class="text-2xl font-bold">Edit Plant Part: {plantPart.partName}</h1>
        <Button href={`/admin/plants/parts/${plant.id}`}>Back to Parts</Button>
      </div>
      
      {error && (
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
      )}

      {success && (
        <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form method="POST" class="space-y-6">
        <div>
          <label for="partName" class="block text-sm font-medium text-gray-700">
            Part Name *
          </label>
          <input
            type="text"
            name="partName"
            id="partName"
            required
            value={formData?.partName || plantPart.partName}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData?.description || plantPart.description || ""}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="edible"
              name="edible"
              type="checkbox"
              checked={formData?.edible || plantPart.edible}
              class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="edible" class="font-medium text-gray-700">Edible</label>
            <p class="text-gray-500">Check if this plant part is edible</p>
          </div>
        </div>

        <div>
          <label for="harvestGuidelines" class="block text-sm font-medium text-gray-700">
            Harvest Guidelines
          </label>
          <textarea
            name="harvestGuidelines"
            id="harvestGuidelines"
            rows={3}
            value={formData?.harvestGuidelines || plantPart.harvestGuidelines || ""}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label for="storageRequirements" class="block text-sm font-medium text-gray-700">
            Storage Requirements
          </label>
          <textarea
            name="storageRequirements"
            id="storageRequirements"
            rows={3}
            value={formData?.storageRequirements || plantPart.storageRequirements || ""}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label for="processingNotes" class="block text-sm font-medium text-gray-700">
            Processing Notes
          </label>
          <textarea
            name="processingNotes"
            id="processingNotes"
            rows={3}
            value={formData?.processingNotes || plantPart.processingNotes || ""}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <Button href={`/admin/plants/parts/${plant.id}`} type="button" color="gray">
            Cancel
          </Button>
          <Button type="submit" color="blue">
            Update Plant Part
          </Button>
        </div>
      </form>
    </PlantAdminLayout>
  );
}
