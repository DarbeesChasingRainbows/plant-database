import { Button } from "../../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, medicinalProperties } from "../../../../../utils/schema.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface MedicinalProperty {
  medPropId?: number;
  plantId: number;
  drugInteractions: string | null;
  traditionalUses: string | null;
  safetyNotes: string | null;
  preparationMethods: string | null;
  dosageGuidelines: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Data {
  plant: Plant | null;
  error?: string;
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
      // Get plant using Drizzle ORM
      const plantResult = await db
        .select()
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;

      if (!plant) {
        return ctx.render({ 
          plant: null, 
          error: "Plant not found" 
        });
      }

      return ctx.render({
        plant,
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
      
      // Extract form data
      const traditionalUses = form.get("traditionalUses")?.toString() || null;
      const safetyNotes = form.get("safetyNotes")?.toString() || null;
      const preparationMethods = form.get("preparationMethods")?.toString() || null;
      const dosageGuidelines = form.get("dosageGuidelines")?.toString() || null;
      const drugInteractions = form.get("drugInteractions")?.toString() || null;

      console.log("Form data:", {
        plantId: id,
        traditionalUses,
        safetyNotes,
        preparationMethods,
        dosageGuidelines,
        drugInteractions
      });

      // Check if plant exists
      const plantResult = await db
        .select()
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0];
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          error: "Plant not found" 
        });
      }

      // Check if medicinal properties already exist for this plant
      const existingProps = await db
        .select()
        .from(medicinalProperties)
        .where(eq(medicinalProperties.plantId, id))
        .limit(1);
      
      if (existingProps.length > 0) {
        return ctx.render({
          plant,
          error: "Medicinal properties already exist for this plant. Please use the edit page instead."
        });
      }

      // Insert medicinal properties
      const now = new Date();
      const result = await db.insert(medicinalProperties).values({
        plantId: id,
        traditionalUses,
        safetyNotes,
        preparationMethods,
        dosageGuidelines,
        drugInteractions,
        createdAt: now,
        updatedAt: now,
      });

      console.log("Insert result:", result);

      // Redirect to medicinal properties page
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/admin/plants/medicinal/${id}`,
        },
      });
    } catch (error) {
      console.error("Error creating medicinal properties:", error);
      
      // Get plant for re-rendering the form
      const plantResult = await db
        .select()
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      return ctx.render({
        plant,
        error: `Error creating medicinal properties: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function NewMedicinalProperties({ data }: PageProps<Data>) {
  const { plant, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="medicinal">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="medicinal">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="medicinal">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Medicinal Properties</h1>
        <div class="flex space-x-2">
          <Button href={`/admin/plants/medicinal/${plant.id}`}>Cancel</Button>
        </div>
      </div>

      <form 
        method="post" 
        action={`/admin/plants/medicinal/new/${plant.id}`} 
        encType="application/x-www-form-urlencoded"
        class="space-y-6 bg-white shadow-sm rounded-lg p-6"
      >
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="traditionalUses" class="block text-sm font-medium text-gray-700">
              Traditional Uses
            </label>
            <textarea
              id="traditionalUses"
              name="traditionalUses"
              rows={4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label for="drugInteractions" class="block text-sm font-medium text-gray-700">
              Drug Interactions
            </label>
            <textarea
              id="drugInteractions"
              name="drugInteractions"
              rows={4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label for="safetyNotes" class="block text-sm font-medium text-gray-700">
              Safety Notes
            </label>
            <textarea
              id="safetyNotes"
              name="safetyNotes"
              rows={4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label for="preparationMethods" class="block text-sm font-medium text-gray-700">
              Preparation Methods
            </label>
            <textarea
              id="preparationMethods"
              name="preparationMethods"
              rows={4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label for="dosageGuidelines" class="block text-sm font-medium text-gray-700">
              Dosage Guidelines
            </label>
            <textarea
              id="dosageGuidelines"
              name="dosageGuidelines"
              rows={4}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Medicinal Properties
          </button>
        </div>
      </form>
    </PlantAdminLayout>
  );
}
