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

interface GrowingGuide {
  guideId: number;
  plantId: number;
  springPlantingStart: string | null;
  springPlantingEnd: string | null;
  fallPlantingStart: string | null;
  fallPlantingEnd: string | null;
  indoorSowingStart: string | null;
  transplantReadyWeeks: number | null;
  directSowAfterFrost: boolean | null;
  frostTolerance: string | null;
  heatTolerance: string | null;
  successionPlantingInterval: number | null;
  companionPlants: string[] | null;
  incompatiblePlants: string[] | null;
  rotationGroup: string | null;
  rotationInterval: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Data {
  plant: Plant | null;
  growingGuide: GrowingGuide | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        growingGuide: null,
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
          growingGuide: null,
          error: "Plant not found" 
        });
      }

      // Get growing guide using Drizzle ORM
      const guideResult = await db.select()
        .from(plantingGuide)
        .where(eq(plantingGuide.plantId, id))
        .limit(1);
      
      const growingGuide = guideResult[0] || null;

      if (!growingGuide) {
        return ctx.render({
          plant,
          growingGuide: null,
          error: "Growing guide not found for this plant"
        });
      }

      return ctx.render({
        plant,
        growingGuide,
      });
    } catch (error) {
      console.error("Error fetching growing guide:", error);
      return ctx.render({
        plant: null,
        growingGuide: null,
        error: `Error fetching growing guide: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        growingGuide: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      const form = await req.formData();
      
      // Helper function to process array fields from comma-separated strings
      function processArrayField(fieldName: string): string[] | null {
        const value = form.get(fieldName)?.toString() || "";
        const array = value ? value.split(',').map(item => item.trim()).filter(Boolean) : [];
        return array.length > 0 ? array : null;
      }

      // Get the existing guide to ensure it exists
      const existingGuideResult = await db.select({ guideId: plantingGuide.guideId })
        .from(plantingGuide)
        .where(eq(plantingGuide.plantId, id))
        .limit(1);
      
      if (existingGuideResult.length === 0) {
        throw new Error("Growing guide not found for this plant");
      }

      // Update growing guide using Drizzle ORM
      await db.update(plantingGuide)
        .set({
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
          updatedAt: new Date(),
        })
        .where(eq(plantingGuide.plantId, id));

      // Redirect to the growing guide page
      const headers = new Headers();
      headers.set("location", `/admin/plants/growing/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating growing guide:", error);
      
      // Get plant and guide details for re-rendering the form
      const plantResult = await db.select({
        id: plants.id,
        commonName: plants.commonName,
        botanicalName: plants.botanicalName,
      })
      .from(plants)
      .where(eq(plants.id, id))
      .limit(1);
      
      const plant = plantResult[0] || null;
      
      const guideResult = await db.select()
        .from(plantingGuide)
        .where(eq(plantingGuide.plantId, id))
        .limit(1);
      
      const growingGuide = guideResult[0] || null;
      
      return ctx.render({
        plant,
        growingGuide,
        error: `Error updating growing guide: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function EditGrowingGuide({ data }: PageProps<Data>) {
  const { plant, growingGuide, error } = data;

  if (!plant || !growingGuide) {
    return (
      <PlantAdminLayout plantId={plant?.id || 0} plantName={plant?.commonName || "Not Found"} activeTab="growing">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">{error || (plant ? "Growing guide not found" : "Plant not found")}</p>
            </div>
          </div>
        </div>
        <a href={plant ? `/admin/plants/growing/${plant.id}` : "/admin/plants"} class="text-blue-600 hover:text-blue-800">
          &larr; {plant ? "Back to Growing Guide" : "Back to Plants"}
        </a>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="growing">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Edit Growing Guide</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <GrowingGuideForm
        initialData={{
          springPlantingStart: growingGuide.springPlantingStart || "",
          springPlantingEnd: growingGuide.springPlantingEnd || "",
          fallPlantingStart: growingGuide.fallPlantingStart || "",
          fallPlantingEnd: growingGuide.fallPlantingEnd || "",
          indoorSowingStart: growingGuide.indoorSowingStart || "",
          transplantReadyWeeks: growingGuide.transplantReadyWeeks !== null ? String(growingGuide.transplantReadyWeeks) : "",
          directSowAfterFrost: growingGuide.directSowAfterFrost ? "true" : "false",
          frostTolerance: growingGuide.frostTolerance || "",
          heatTolerance: growingGuide.heatTolerance || "",
          successionPlantingInterval: growingGuide.successionPlantingInterval !== null ? String(growingGuide.successionPlantingInterval) : "",
          companionPlants: growingGuide.companionPlants || [],
          incompatiblePlants: growingGuide.incompatiblePlants || [],
          rotationGroup: growingGuide.rotationGroup || "",
          rotationInterval: growingGuide.rotationInterval !== null ? String(growingGuide.rotationInterval) : "",
        }}
        actionUrl={`/admin/plants/growing/edit/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
