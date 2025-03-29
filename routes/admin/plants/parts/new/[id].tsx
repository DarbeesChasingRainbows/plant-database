import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../../utils/client.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
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
  formData?: FormData;
  error?: string;
  success?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null,
        error: "Invalid plant ID" 
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
      
      const plantResult = await db.pool.query(plantQuery, [id]);
      const plant = plantResult.rows[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null,
          error: "Plant not found" 
        });
      }

      return ctx.render({
        plant,
        formData: {
          partName: "",
          description: "",
          edible: false,
          harvestGuidelines: "",
          storageRequirements: "",
          processingNotes: "",
        }
      });
    } catch (error) {
      console.error("Error fetching plant:", error);
      return ctx.render({
        plant: null,
        error: `Error fetching plant: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null,
        error: "Invalid plant ID" 
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
      
      const plantResult = await db.pool.query(plantQuery, [id]);
      const plant = plantResult.rows[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null,
          formData,
          error: "Plant not found" 
        });
      }

      // Insert the new plant part
      const insertQuery = `
        INSERT INTO plant_part (
          plant_id,
          part_name,
          description,
          edible,
          harvest_guidelines,
          storage_requirements,
          processing_notes,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
        )
        RETURNING part_id
      `;

      const insertResult = await db.pool.query(insertQuery, [
        id,
        formData.partName,
        formData.description || null,
        formData.edible,
        formData.harvestGuidelines || null,
        formData.storageRequirements || null,
        formData.processingNotes || null,
      ]);

      const partId = insertResult.rows[0].part_id;

      // Redirect to the plant parts page
      return new Response("", {
        status: 303,
        headers: { Location: `/admin/plants/parts/${id}` },
      });
    } catch (error) {
      console.error("Error creating plant part:", error);
      
      // Get plant details for re-rendering
      const plantQuery = `
        SELECT
          id,
          common_name as "commonName",
          botanical_name as "botanicalName"
        FROM plants
        WHERE id = $1
      `;
      
      const plantResult = await db.pool.query(plantQuery, [id]);
      const plant = plantResult.rows[0] || null;

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
        formData,
        error: `Error creating plant part: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
};

export default function NewPlantPart({ data }: PageProps<Data>) {
  const { plant, formData, error, success } = data;

  if (error && !plant) {
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
        <h1 class="text-2xl font-bold">Add Plant Part</h1>
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
            value={formData?.partName || ""}
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
            value={formData?.description || ""}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="edible"
              name="edible"
              type="checkbox"
              checked={formData?.edible || false}
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
            value={formData?.harvestGuidelines || ""}
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
            value={formData?.storageRequirements || ""}
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
            value={formData?.processingNotes || ""}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <Button href={`/admin/plants/parts/${plant.id}`} type="button" color="gray">
            Cancel
          </Button>
          <Button type="submit" color="blue">
            Save Plant Part
          </Button>
        </div>
      </form>
    </PlantAdminLayout>
  );
}
