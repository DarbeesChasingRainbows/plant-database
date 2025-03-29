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

interface SeedInfo {
  infoId: number;
  plantId: number;
  seedType: string | null;
  seedSize: string | null;
  seedColor: string | null;
  daysToMaturity: string | null;
  harvestSeason: string | null;
  harvestingInstructions: string | null;
  cleaningInstructions: string | null;
  dryingInstructions: string | null;
  storageInstructions: string | null;
  storageLifespan: string | null;
  germinationRequirements: string | null;
  stratificationNeeds: string | null;
  scarificationNeeds: string | null;
  seedViabilityTest: string | null;
  seedSavingDifficulty: string | null;
  crossPollinationConcerns: string | null;
  isolationDistance: string | null;
  seedYield: string | null;
  notes: string | null;
}

interface Data {
  plant: Plant | null;
  seedInfo: SeedInfo | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        seedInfo: null,
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
          seedInfo: null,
          error: "Plant not found" 
        });
      }

      // Get seed saving info using Drizzle ORM
      const seedInfoResult = await db.select()
        .from(seedSavingInfo)
        .where(eq(seedSavingInfo.plantId, id))
        .limit(1);
      
      const seedInfo = seedInfoResult[0] || null;

      if (!seedInfo) {
        return ctx.render({
          plant,
          seedInfo: null,
          error: "Seed saving information not found for this plant"
        });
      }

      return ctx.render({
        plant,
        seedInfo,
      });
    } catch (error) {
      console.error("Error fetching seed saving info:", error);
      return ctx.render({
        plant: null,
        seedInfo: null,
        error: `Error fetching seed saving info: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        seedInfo: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      const form = await req.formData();
      
      // Get the existing seed info to ensure it exists
      const existingSeedInfoResult = await db.select({ infoId: seedSavingInfo.infoId })
        .from(seedSavingInfo)
        .where(eq(seedSavingInfo.plantId, id))
        .limit(1);
      
      if (existingSeedInfoResult.length === 0) {
        throw new Error("Seed saving information not found for this plant");
      }

      // Update seed saving info using Drizzle ORM
      await db.update(seedSavingInfo)
        .set({
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
          updatedAt: new Date(),
        })
        .where(eq(seedSavingInfo.plantId, id));

      // Redirect to the seed saving info page
      const headers = new Headers();
      headers.set("location", `/admin/plants/seeds/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating seed saving info:", error);
      
      // Get plant and seed info details for re-rendering the form
      const plantResult = await db.select({
          id: plants.id,
          commonName: plants.commonName,
          botanicalName: plants.botanicalName,
        })
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      const seedInfoResult = await db.select()
        .from(seedSavingInfo)
        .where(eq(seedSavingInfo.plantId, id))
        .limit(1);
      
      const seedInfo = seedInfoResult[0] || null;
      
      return ctx.render({
        plant,
        seedInfo,
        error: `Error updating seed saving info: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function EditSeedSavingInfo({ data }: PageProps<Data>) {
  const { plant, seedInfo, error } = data;

  if (!plant || !seedInfo) {
    return (
      <PlantAdminLayout plantId={plant?.id || 0} plantName={plant?.commonName || "Not Found"} activeTab="seeds">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">{error || (plant ? "Seed saving information not found" : "Plant not found")}</p>
            </div>
          </div>
        </div>
        <a href={plant ? `/admin/plants/seeds/${plant.id}` : "/admin/plants"} class="text-blue-600 hover:text-blue-800">
          &larr; {plant ? "Back to Seed Saving Information" : "Back to Plants"}
        </a>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="seeds">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Edit Seed Saving Information</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <SeedSavingForm
        initialData={{
          seedType: seedInfo.seedType || "",
          seedSize: seedInfo.seedSize || "",
          seedColor: seedInfo.seedColor || "",
          daysToMaturity: seedInfo.daysToMaturity || "",
          harvestSeason: seedInfo.harvestSeason || "",
          harvestingInstructions: seedInfo.harvestingInstructions || "",
          cleaningInstructions: seedInfo.cleaningInstructions || "",
          dryingInstructions: seedInfo.dryingInstructions || "",
          storageInstructions: seedInfo.storageInstructions || "",
          storageLifespan: seedInfo.storageLifespan || "",
          germinationRequirements: seedInfo.germinationRequirements || "",
          stratificationNeeds: seedInfo.stratificationNeeds || "",
          scarificationNeeds: seedInfo.scarificationNeeds || "",
          seedViabilityTest: seedInfo.seedViabilityTest || "",
          seedSavingDifficulty: seedInfo.seedSavingDifficulty || "",
          crossPollinationConcerns: seedInfo.crossPollinationConcerns || "",
          isolationDistance: seedInfo.isolationDistance || "",
          seedYield: seedInfo.seedYield || "",
          notes: seedInfo.notes || ""
        }}
        actionUrl={`/admin/plants/seeds/edit/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
