import { Handlers, PageProps } from "$fresh/server.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import SeedSavingForm from "../../../../../islands/SeedSavingForm.tsx";
import { db } from "../../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, seedSavingInfo } from "../../../../../utils/schema.ts";

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
      
      // Create seed saving info using Drizzle ORM
      await db.insert(seedSavingInfo).values({
        plantId: id,
        seedType: form.get('seedType')?.toString() || null,
        seedSize: form.get('seedSize')?.toString() || null,
        seedColor: form.get('seedColor')?.toString() || null,
        daysToMaturity: form.get('daysToMaturity')?.toString() || null,
        harvestSeason: form.get('harvestSeason')?.toString() || null,
        harvestingInstructions: form.get('harvestingInstructions')?.toString() || null,
        cleaningInstructions: form.get('cleaningInstructions')?.toString() || null,
        dryingInstructions: form.get('dryingInstructions')?.toString() || null,
        storageInstructions: form.get('storageInstructions')?.toString() || null,
        storageLifespan: form.get('storageLifespan')?.toString() || null,
        germinationRequirements: form.get('germinationRequirements')?.toString() || null,
        stratificationNeeds: form.get('stratificationNeeds')?.toString() || null,
        scarificationNeeds: form.get('scarificationNeeds')?.toString() || null,
        seedViabilityTest: form.get('seedViabilityTest')?.toString() || null,
        seedSavingDifficulty: form.get('seedSavingDifficulty')?.toString() || null,
        crossPollinationConcerns: form.get('crossPollinationConcerns')?.toString() || null,
        isolationDistance: form.get('isolationDistance')?.toString() || null,
        seedYield: form.get('seedYield')?.toString() || null,
        notes: form.get('notes')?.toString() || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Redirect to the seed saving info page
      const headers = new Headers();
      headers.set("location", `/admin/plants/seeds/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error creating seed saving info:", error);
      
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
        error: `Error creating seed saving info: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function NewSeedSavingInfo({ data }: PageProps<Data>) {
  const { plant, error } = data;

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="seeds">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="seeds">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Add Seed Saving Information</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <SeedSavingForm
        actionUrl={`/admin/plants/seeds/new/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
