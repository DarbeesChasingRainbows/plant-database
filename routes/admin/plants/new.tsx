import { Handlers, PageProps } from "$fresh/server.ts";
import PlantListingLayout from "../../../components/PlantListingLayout.tsx";
import PlantFormSidebar from "../../../islands/PlantFormSidebar.tsx";
import { PlantRepository } from "../../../repositories/PlantRepository.ts";
import { plantProperties, plantGerminationGuide, plantingGuide, plantTcmProperties, plantAyurvedicProperties } from "../../../utils/schema.ts";
import { ExtendedCreatePlantInput } from "../../../types/index.ts";
import { db } from "../../../utils/client.ts";

interface Data {
  error?: string;
}

// Add handler for direct form submissions
export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    // Initialize with empty data for GET requests
    return ctx.render({});
  },
  
  async POST(req, ctx) {
    try {
      const formData = await req.formData();
      const plantDataJson = formData.get("plantData");
      
      if (!plantDataJson || typeof plantDataJson !== "string") {
        return ctx.render({ error: "Invalid plant data received" });
      }
      
      const plantData = JSON.parse(plantDataJson) as ExtendedCreatePlantInput;
      const plantRepo = new PlantRepository();
      
      await db.transaction(async (tx) => {
        const newPlant = await plantRepo.create({
          botanicalName: plantData.botanicalName,
          commonName: plantData.commonName,
          family: plantData.family,
          genus: plantData.genus,
          species: plantData.species,
          description: plantData.description,
          nativeRange: plantData.nativeRange,
          growthHabit: plantData.growthHabit,
          lifespan: plantData.lifespan,
          hardinessZones: plantData.hardinessZones,
        });

        if (plantData.properties) {
          await tx.insert(plantProperties).values({ plantId: newPlant.id, ...plantData.properties });
        }
        if (plantData.germinationGuide) {
          await tx.insert(plantGerminationGuide).values({
            plantId: newPlant.id,
            zoneRange: plantData.germinationGuide.zoneRange,
            soilTempMinC: plantData.germinationGuide.soilTempMinC?.toString(),
            soilTempMaxC: plantData.germinationGuide.soilTempMaxC?.toString(),
            daysToGerminationMin: plantData.germinationGuide.daysToGerminationMin,
            daysToGerminationMax: plantData.germinationGuide.daysToGerminationMax,
            plantingDepthCm: plantData.germinationGuide.plantingDepthCm?.toString(),
            lightRequirement: plantData.germinationGuide.lightRequirement,
            springStartWeek: plantData.germinationGuide.springStartWeek,
            springEndWeek: plantData.germinationGuide.springEndWeek,
            fallStartWeek: plantData.germinationGuide.fallStartWeek,
            fallEndWeek: plantData.germinationGuide.fallEndWeek,
            indoorSowingWeeksBeforeFrost: plantData.germinationGuide.indoorSowingWeeksBeforeFrost,
            stratificationRequired: plantData.germinationGuide.stratificationRequired,
            stratificationInstructions: plantData.germinationGuide.stratificationInstructions,
            scarificationRequired: plantData.germinationGuide.scarificationRequired,
            scarificationInstructions: plantData.germinationGuide.scarificationInstructions,
            specialRequirements: plantData.germinationGuide.specialRequirements,
            germinationNotes: plantData.germinationGuide.germinationNotes,
          });
        }
        if (plantData.plantingGuide) {
          await tx.insert(plantingGuide).values({
            plantId: newPlant.id,
            springPlantingStart: plantData.plantingGuide.springPlantingStart,
            springPlantingEnd: plantData.plantingGuide.springPlantingEnd,
            fallPlantingStart: plantData.plantingGuide.fallPlantingStart,
            fallPlantingEnd: plantData.plantingGuide.fallPlantingEnd,
            indoorSowingStart: plantData.plantingGuide.indoorSowingStart,
            transplantReadyWeeks: plantData.plantingGuide.transplantReadyWeeks,
            directSowAfterFrost: plantData.plantingGuide.directSowAfterFrost,
            frostTolerance: plantData.plantingGuide.frostTolerance,
            heatTolerance: plantData.plantingGuide.heatTolerance,
            successionPlantingInterval: plantData.plantingGuide.successionPlantingInterval,
            companionPlants: plantData.plantingGuide.companionPlants?.split(",").map(s => s.trim()),
            incompatiblePlants: plantData.plantingGuide.incompatiblePlants?.split(",").map(s => s.trim()),
            rotationGroup: plantData.plantingGuide.rotationGroup,
            rotationInterval: plantData.plantingGuide.rotationInterval,
          });
        }
        if (plantData.tcmProperties) {
          await tx.insert(plantTcmProperties).values({
            plantId: newPlant.id,
            ...plantData.tcmProperties,
            tasteIds: plantData.tcmProperties.tasteIds?.split(",").map(Number),
            meridianIds: plantData.tcmProperties.meridianIds?.split(",").map(Number),
          });
        }
        if (plantData.ayurvedicProperties) {
          await tx.insert(plantAyurvedicProperties).values({
            plantId: newPlant.id,
            ...plantData.ayurvedicProperties,
            rasaIds: plantData.ayurvedicProperties.rasaIds?.split(",").map(Number),
            gunaIds: plantData.ayurvedicProperties.gunaIds?.split(",").map(Number),
            doshaEffects: plantData.ayurvedicProperties.doshaEffects ? JSON.parse(plantData.ayurvedicProperties.doshaEffects) : undefined,
            dhatuEffects: plantData.ayurvedicProperties.dhatuEffects ? JSON.parse(plantData.ayurvedicProperties.dhatuEffects) : undefined,
            srotaEffects: plantData.ayurvedicProperties.srotaEffects ? JSON.parse(plantData.ayurvedicProperties.srotaEffects) : undefined,
          });
        }
      });
      
      // Redirect to plants list after successful creation
      return new Response("", {
        status: 303,
        headers: { Location: "/admin/plants?success=Plant+created+successfully" },
      });
    } catch (error) {
      console.error("Failed to create plant:", error);
      return ctx.render({ 
        error: error instanceof Error ? error.message : "Failed to create plant" 
      });
    }
  }
};

export default function NewPlant({ data }: PageProps<Data>) {
  const handleCancel = () => {
    // Use globalThis.location instead of window.location
    globalThis.location.href = "/admin/plants";
  };

  return (
    <PlantListingLayout title="Add New Plant" activeSection="new">
      {data?.error && (
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{data.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <PlantFormSidebar
        isNew
        submitUrl="/admin/plants/new"
        onCancel={handleCancel}
      />
    </PlantListingLayout>
  );
}