import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import db from "../../../../../utils/db.ts";
import { eq } from "drizzle-orm";
import { plants, plantAyurvedicProperties } from "../../../../../utils/schema.ts";
import AyurvedicPropertiesForm from "../../../../../islands/AyurvedicPropertiesForm.tsx";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface Data {
  plant: Plant | null;
  error?: string;
  formData?: Record<string, string>;
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
      const plantResult = await db.drizzle
        .select({
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
      // Get plant details
      const plantResult = await db.drizzle
        .select({
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

      // Process form data
      const form = await req.formData();
      const formData: Record<string, string> = {};
      
      for (const [key, value] of form.entries()) {
        formData[key] = value.toString();
      }

      // Check for required fields (customize as needed)
      if (!formData.sanskritName && !formData.traditionalUsage) {
        return ctx.render({
          plant,
          error: "Please provide either a Sanskrit name or traditional usage details",
          formData,
        });
      }

      // Parse array fields
      const rasa = formData.rasa ? formData.rasa.split(',').filter(Boolean) : null;
      const gunas = formData.gunas ? formData.gunas.split(',').filter(Boolean) : null;
      const dhatus = formData.dhatus ? formData.dhatus.split(',').filter(Boolean) : null;
      const srotas = formData.srotas ? formData.srotas.split(',').filter(Boolean) : null;

      // Create dosha effect object
      const doshaEffect = {
        vata: formData.doshaVata || null,
        pitta: formData.doshaPitta || null,
        kapha: formData.doshaKapha || null
      };

      // Insert new ayurvedic properties using Drizzle ORM
      await db.drizzle.insert(plantAyurvedicProperties).values({
        plantId: id,
        sanskritName: formData.sanskritName || null,
        rasa: rasa,
        virya: formData.virya || null,
        vipaka: formData.vipaka || null,
        doshaEffect: doshaEffect,
        gunas: gunas,
        dhatus: dhatus,
        srotas: srotas,
        traditionalUsage: formData.traditionalUsage || null,
        preparations: formData.preparations || null,
        dosage: formData.dosage || null,
        contraindications: formData.contraindications || null,
        interactions: formData.interactions || null,
        notes: formData.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Redirect to the ayurvedic properties page
      return new Response("", {
        status: 303,
        headers: { Location: `/admin/plants/ayurvedic/${id}` },
      });
    } catch (error) {
      console.error("Error creating ayurvedic properties:", error);
      
      // Get plant for re-rendering
      const plantResult = await db.drizzle
        .select({
          id: plants.id,
          commonName: plants.commonName,
          botanicalName: plants.botanicalName,
        })
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      // Re-render the form with the error
      const form = await req.formData();
      const formData: Record<string, string> = {};
      
      for (const [key, value] of form.entries()) {
        formData[key] = value.toString();
      }

      return ctx.render({
        plant,
        error: `Error creating ayurvedic properties: ${error instanceof Error ? error.message : String(error)}`,
        formData,
      });
    }
  }
};

export default function NewAyurvedicProperties({ data }: PageProps<Data>) {
  const { plant, error, formData } = data;

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="ayurvedic">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">Plant not found or an error occurred.</p>
              {error && <p class="text-sm text-yellow-700 mt-1">{error}</p>}
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="ayurvedic">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Ayurvedic Properties</h1>
        <Button href={`/admin/plants/ayurvedic/${plant.id}`}>Cancel</Button>
      </div>
      
      <AyurvedicPropertiesForm 
        initialData={formData} 
        actionUrl={`/admin/plants/ayurvedic/new/${plant.id}`} 
        error={error} 
      />
    </PlantAdminLayout>
  );
}
