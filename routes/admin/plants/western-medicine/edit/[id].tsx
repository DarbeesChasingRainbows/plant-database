import { Handlers, PageProps } from "$fresh/server.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import WesternMedicineForm from "../../../../../islands/WesternMedicineForm.tsx";
import { db } from "../../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, pharmacologicalActions } from "../../../../../utils/schema.ts";

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
  pharmacologicalAction: PharmacologicalAction | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        pharmacologicalAction: null,
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
          pharmacologicalAction: null,
          error: "Plant not found" 
        });
      }
      
      // Get pharmacological actions using Drizzle ORM
      const actionsResult = await db.select()
        .from(pharmacologicalActions)
        .where(eq(pharmacologicalActions.plantId, id))
        .limit(1);
      
      const action = actionsResult[0] || null;
      
      if (!action) {
        // Redirect to the new properties page if no properties exist
        const headers = new Headers();
        headers.set("location", `/admin/plants/western-medicine/new/${id}`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return ctx.render({
        plant,
        pharmacologicalAction: action,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return ctx.render({ 
        plant: null, 
        pharmacologicalAction: null,
        error: `Error fetching plant data: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return new Response("Invalid plant ID", { status: 400 });
    }

    try {
      const form = await req.formData();
      
      // Get the existing action to ensure it exists
      const existingActionResult = await db.select({ actionId: pharmacologicalActions.actionId })
        .from(pharmacologicalActions)
        .where(eq(pharmacologicalActions.plantId, id))
        .limit(1);
      
      if (existingActionResult.length === 0) {
        return new Response("Pharmacological action not found", { status: 404 });
      }

      // Update pharmacological action using Drizzle ORM
      await db.update(pharmacologicalActions)
        .set({
          summary: form.get('summary')?.toString() || '',
          clinicalEvidence: form.get('clinicalEvidence')?.toString() || null,
          preclinicalEvidence: form.get('preclinicalEvidence')?.toString() || null,
          safetyNotes: form.get('safetyNotes')?.toString() || null,
          mechanismOfAction: form.get('mechanismOfAction')?.toString() || null,
          pharmacokinetics: form.get('pharmacokinetics')?.toString() || null,
          researchStatus: form.get('researchStatus')?.toString() || null,
          evidenceLevel: form.get('evidenceLevel')?.toString() || null,
          updatedAt: new Date(),
        })
        .where(eq(pharmacologicalActions.plantId, id));

      // Redirect to the western medicine properties page
      const headers = new Headers();
      headers.set("location", `/admin/plants/western-medicine/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating pharmacological action:", error);
      return new Response(`Error updating pharmacological action: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
  },
};

export default function EditWesternMedicineProperties({ data }: PageProps<Data>) {
  const { plant, pharmacologicalAction, error } = data;

  if (!plant || !pharmacologicalAction) {
    return (
      <PlantAdminLayout plantId={plant?.id || 0} plantName={plant?.commonName || "Not Found"} activeTab="western-medicine">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">{error || (plant ? "Pharmacological action not found" : "Plant not found")}</p>
            </div>
          </div>
        </div>
        <a href={plant ? `/admin/plants/western-medicine/${plant.id}` : "/admin/plants"} class="text-blue-600 hover:text-blue-800">
          &larr; {plant ? "Back to Western Medicine Properties" : "Back to Plants"}
        </a>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="western-medicine">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Edit Western Medicine Properties</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <WesternMedicineForm
        initialData={{
          summary: pharmacologicalAction.summary || "",
          clinicalEvidence: pharmacologicalAction.clinicalEvidence || "",
          preclinicalEvidence: pharmacologicalAction.preclinicalEvidence || "",
          safetyNotes: pharmacologicalAction.safetyNotes || "",
          mechanismOfAction: pharmacologicalAction.mechanismOfAction || "",
          pharmacokinetics: pharmacologicalAction.pharmacokinetics || "",
          researchStatus: pharmacologicalAction.researchStatus || "",
          evidenceLevel: pharmacologicalAction.evidenceLevel || "",
        }}
        actionUrl={`/admin/plants/western-medicine/edit/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
