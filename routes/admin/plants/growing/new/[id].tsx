import { Handlers, PageProps } from "$fresh/server.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import GrowingGuideForm from "../../../../../islands/GrowingGuideForm.tsx";
import { db } from "../../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, plantingGuide } from "../../../../../utils/schema.ts";

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

      // Check if a growing guide already exists
      const existingGuideResult = await db.select({ guideId: plantingGuide.guideId })
        .from(plantingGuide)
        .where(eq(plantingGuide.plantId, id))
        .limit(1);
      
      if (existingGuideResult.length > 0) {
        // Redirect to edit page if guide already exists
        return new Response(null, {
          status: 303,
          headers: {
            "Location": `/admin/plants/growing/edit/${id}`
          }
        });
      }

      return ctx.render({
        plant,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return ctx.render({ 
        plant: null, 
        error: "Failed to fetch plant data" 
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
      
      // Helper function to process array fields from comma-separated strings
      function processArrayField(fieldName: string): string[] | null {
        const value = form.get(fieldName)?.toString() || "";
        const array = value ? value.split(',').map((item: string) => item.trim()).filter(Boolean) : [];
        return array.length > 0 ? array : null;
      }
      
      // Create growing guide using Drizzle ORM
      await db.insert(plantingGuide).values({
        plantId: id,
        springPlantingStart: form.get('springPlantingStart')?.toString() || null,
        springPlantingEnd: form.get('springPlantingEnd')?.toString() || null,
        fallPlantingStart: form.get('fallPlantingStart')?.toString() || null,
        fallPlantingEnd: form.get('fallPlantingEnd')?.toString() || null,
        indoorSowingStart: form.get('indoorSowingStart')?.toString() || null,
        transplantReadyWeeks: form.get('transplantReadyWeeks')?.toString() ? Number(form.get('transplantReadyWeeks')) : null,
        directSowAfterFrost: form.get('directSowAfterFrost')?.toString() === 'true',
        frostTolerance: form.get('frostTolerance')?.toString() || null,
        heatTolerance: form.get('heatTolerance')?.toString() || null,
        successionPlantingInterval: form.get('successionPlantingInterval')?.toString() ? Number(form.get('successionPlantingInterval')) : null,
        companionPlants: processArrayField('companionPlants'),
        incompatiblePlants: processArrayField('incompatiblePlants'),
        rotationGroup: form.get('rotationGroup')?.toString() || null,
        rotationInterval: form.get('rotationInterval')?.toString() ? Number(form.get('rotationInterval')) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Redirect to the growing guide page
      const headers = new Headers();
      headers.set("location", `/admin/plants/growing/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error: unknown) {
      console.error("Error creating growing guide:", error);
      
      // Get plant details for re-rendering the form
      const plantResult = await db.select({
        id: plants.id,
        commonName: plants.commonName,
        botanicalName: plants.botanicalName,
      })
      .from(plants)
      .where(eq(plants.id, id))
      .limit(1);
      
      const plant = plantResult[0] || null;
      
      return ctx.render({
        plant,
        error: `Failed to create growing guide: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }
};

export default function NewGrowingGuide({ data }: PageProps<Data>) {
  const { plant, error } = data;

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="growing">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="growing">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Add Growing Guide</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <GrowingGuideForm
        actionUrl={`/admin/plants/growing/new/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
