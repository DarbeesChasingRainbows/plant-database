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
          error: "Plant not found" 
        });
      }

      return ctx.render({ plant });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return ctx.render({ 
        plant: null, 
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
      
      // Create pharmacological action using Drizzle ORM
      await db.insert(pharmacologicalActions).values({
        plantId: id,
        summary: form.get('summary')?.toString() || null,
        clinicalEvidence: form.get('clinicalEvidence')?.toString() || null,
        preclinicalEvidence: form.get('preclinicalEvidence')?.toString() || null,
        safetyNotes: form.get('safetyNotes')?.toString() || null,
        mechanismOfAction: form.get('mechanismOfAction')?.toString() || null,
        pharmacokinetics: form.get('pharmacokinetics')?.toString() || null,
        researchStatus: form.get('researchStatus')?.toString() || null,
        evidenceLevel: form.get('evidenceLevel')?.toString() || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Redirect to the western medicine properties page
      const headers = new Headers();
      headers.set("location", `/admin/plants/western-medicine/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error creating western medicine properties:", error);
      return new Response(`Error creating western medicine properties: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
  },
};

export default function NewWesternMedicineProperties({ data }: PageProps<Data>) {
  const { plant, error } = data;

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
              <p class="text-sm text-yellow-700">{error || "Plant not found"}</p>
            </div>
          </div>
        </div>
        <a href="/admin/plants" class="text-blue-600 hover:text-blue-800">
          &larr; Back to Plants
        </a>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="western-medicine">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Add Western Medicine Properties</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <WesternMedicineForm
        actionUrl={`/admin/plants/western-medicine/new/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
