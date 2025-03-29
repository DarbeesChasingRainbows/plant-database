import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, pharmacologicalActions } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface PharmacologicalAction {
  actionId: number;
  plantId: number;
  typeId: number | null;
  summary: string | null;
  clinicalEvidence: string | null;
  preclinicalEvidence: string | null;
  safetyNotes: string | null;
  mechanismOfAction: string | null;
  pharmacokinetics: string | null;
  researchStatus: string | null;
  evidenceLevel: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Data {
  plant: Plant | null;
  pharmacologicalActions: PharmacologicalAction[] | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        pharmacologicalActions: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      // Get plant details using Drizzle ORM
      const plantResult = await db.select({
          id: plants.id,
          commonName: plants.commonName,
          botanicalName: plants.botanicalName,
        })
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          pharmacologicalActions: null,
          error: "Plant not found" 
        });
      }

      // Get pharmacological actions using Drizzle ORM
      const actionsResult = await db.select()
        .from(pharmacologicalActions)
        .where(eq(pharmacologicalActions.plantId, id));
      
      return ctx.render({
        plant,
        pharmacologicalActions: actionsResult,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return ctx.render({ 
        plant: null, 
        pharmacologicalActions: null,
        error: `Error fetching plant data: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  },
};

export default function PlantWesternMedicine({ data }: PageProps<Data>) {
  const { plant, pharmacologicalActions, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="western-medicine">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="western-medicine">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="western-medicine">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Western Medicine Properties</h1>
        <div class="flex space-x-2">
          {pharmacologicalActions && pharmacologicalActions.length > 0 ? (
            <Button href={`/admin/plants/western-medicine/edit/${plant.id}`}>Edit Properties</Button>
          ) : (
            <Button href={`/admin/plants/western-medicine/new/${plant.id}`}>Add Properties</Button>
          )}
        </div>
      </div>
      
      {!pharmacologicalActions || pharmacologicalActions.length === 0 ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No western medicine properties have been added for this plant.</p>
          <Button href={`/admin/plants/western-medicine/new/${plant.id}`} class="mt-2">Add Western Medicine Properties</Button>
        </div>
      ) : (
        <div class="space-y-6">
          {pharmacologicalActions.map((action) => (
            <div key={action.actionId} class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6 bg-blue-50">
                <h3 class="text-lg leading-6 font-medium text-blue-900">{action.summary}</h3>
                <p class="mt-1 max-w-2xl text-sm text-blue-700">{action.clinicalEvidence}</p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-1">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Preclinical Evidence</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{action.preclinicalEvidence}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Safety Notes</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{action.safetyNotes}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mechanism of Action</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{action.mechanismOfAction}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Pharmacokinetics</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{action.pharmacokinetics}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Research Status</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{action.researchStatus}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Evidence Level</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{action.evidenceLevel}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </PlantAdminLayout>
  );
}
