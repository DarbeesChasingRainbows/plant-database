import { Handlers, PageProps } from "$fresh/server.ts";
import { eq } from "drizzle-orm";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import PlantFormSidebar from "../../../../islands/PlantFormSidebar.tsx";
import { 
  plantRepository, 
  PlantId, 
  BotanicalName, 
  CommonName, 
  Taxonomy, 
  GrowthCharacteristics 
} from "../../../../src/plant-management/index.ts";
import { db } from "../../../../utils/client.ts";
import { plants, plantProperties, plantGerminationGuide, plantingGuide, plantTcmProperties, plantAyurvedicProperties, plantParts } from "../../../../utils/schema.ts";
import { ExtendedCreatePlantInput } from "../../../../types/index.ts";

interface Plant {
  id: number;
  common_name: string;
  botanical_name: string;
  family: string;
  genus: string;
  species: string;
  description: string;
  native_range: string;
  taxonomy: string;
  is_medicinal: boolean;
  is_food_crop: boolean;
}

interface PlantPart {
  id: number;
  plant_id: number;
  part_name: string;
  description: string;
  edible: boolean;
}

interface PlantProperties {
  id: number;
  plant_id: number;
  zone_range: string;
  soil_ph_range: string;
  light_requirements: string;
  water_requirements: string;
  days_to_maturity: number | null;
  height_mature_cm: number | null;
  spread_mature_cm: number | null;
  soil_type_preferences: string;
  cultivation_notes: string;
  pest_susceptibility: string;
  disease_susceptibility: string;
}

interface Data {
  plant: Plant | null;
  _plantParts: PlantPart[];
  _plantProperties: PlantProperties | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        _plantParts: [],
        _plantProperties: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      // Using Drizzle ORM to fetch the plant
      const plantResults = await db.select().from(plants).where(eq(plants.id, id));
      if (plantResults.length === 0) {
        return ctx.render({ 
          plant: null, 
          _plantParts: [],
          _plantProperties: null,
          error: "Plant not found" 
        });
      }

      const plant = plantResults[0];
      
      // Get plant properties
      const propertiesResults = await db.select().from(plantProperties).where(eq(plantProperties.plantId, id));
      const properties = propertiesResults.length > 0 ? propertiesResults[0] : null;

      return ctx.render({ 
        plant, 
        _plantParts: [], 
        _plantProperties: properties,
        error: undefined
      });
    } catch (error) {
      console.error("Error fetching plant:", error);
      return ctx.render({ 
        plant: null, 
        _plantParts: [],
        _plantProperties: null,
        error: (error as Error).message 
      });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        _plantParts: [],
        _plantProperties: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      const formData: FormData = await req.formData();
      
      // Get the JSON string from the plantData field
      const plantDataJson = formData.get("plantData");
      
      if (!plantDataJson || typeof plantDataJson !== "string") {
        return ctx.render({ 
          plant: null, 
          _plantParts: [],
          _plantProperties: null,
          error: "Invalid plant data received" 
        });
      }
      
      console.log("Form data received:");
      console.log("plantData:", plantDataJson);
      
      // Parse the JSON data
      const plantData = JSON.parse(plantDataJson) as ExtendedCreatePlantInput;
      
      // Log the raw plant data
      console.log("Raw plant data:", JSON.stringify(plantData, null, 2));
      
      // Use the repository pattern to update the plant
      const plantRepo = plantRepository;
      
      // First check if the plant exists
      const existingPlant = await plantRepo.findById(new PlantId(id));
      if (!existingPlant) {
        return ctx.render({ 
          plant: null, 
          _plantParts: [],
          _plantProperties: null,
          error: "Plant not found" 
        });
      }
      
      // Update the plant entity with new values
      // Create new value objects for the updated fields
      const botanicalName = plantData.botanicalName ? 
        BotanicalName.create(plantData.botanicalName) : 
        existingPlant.botanicalName;
      
      const commonName = plantData.commonName ? 
        CommonName.create(plantData.commonName) : 
        existingPlant.commonName;
      
      // Update the plant entity - ensure we're always setting values even if null
      existingPlant.updateBotanicalName(botanicalName);
      existingPlant.updateCommonName(commonName);
      
      // Always provide a value for description and nativeRange
      const description = plantData.description !== undefined ? plantData.description : existingPlant.description;
      const nativeRange = plantData.nativeRange !== undefined ? plantData.nativeRange : existingPlant.nativeRange;
      
      existingPlant.updateDescription(description || "");
      existingPlant.updateNativeRange(nativeRange || "");
      
      // If taxonomy fields are provided, update taxonomy
      if (plantData.family || plantData.genus || plantData.species) {
        const taxonomy = Taxonomy.create({
          family: plantData.family || existingPlant.taxonomy.family,
          genus: plantData.genus || existingPlant.taxonomy.genus,
          species: plantData.species || existingPlant.taxonomy.species,
          variety: existingPlant.taxonomy.variety,
          cultivar: existingPlant.taxonomy.cultivar
        });
        existingPlant.updateTaxonomy(taxonomy);
      }
      
      // If growth characteristic fields are provided, update them
      if (plantData.growthHabit || plantData.lifespan || plantData.hardinessZones || 
          (plantData.properties && (plantData.properties.heightMatureCm || plantData.properties.spreadMatureCm))) {
        const growthCharacteristics = GrowthCharacteristics.create({
          growthHabit: plantData.growthHabit || existingPlant.growthCharacteristics.growthHabit,
          lifespan: plantData.lifespan || existingPlant.growthCharacteristics.lifespan,
          hardinessZones: plantData.hardinessZones || existingPlant.growthCharacteristics.hardinessZones,
          heightMatureCm: plantData.properties?.heightMatureCm || existingPlant.growthCharacteristics.heightMatureCm,
          spreadMatureCm: plantData.properties?.spreadMatureCm || existingPlant.growthCharacteristics.spreadMatureCm
        });
        existingPlant.updateGrowthCharacteristics(growthCharacteristics);
      }
      
      // Save the updated plant using the repository
      await plantRepo.save(existingPlant);

      // Handle plant properties through Drizzle
      if (plantData.properties && Object.keys(plantData.properties).length > 0) {
        // Check if properties exist
        const propertiesResults = await db.select().from(plantProperties).where(eq(plantProperties.plantId, id));
        
        if (propertiesResults.length > 0) {
          // Create an object with only the properties that have values
          const propertyUpdateData: Record<string, unknown> = {};
          
          if (plantData.properties.waterRequirements !== undefined) propertyUpdateData.waterRequirements = plantData.properties.waterRequirements;
          if (plantData.properties.zoneRange !== undefined) propertyUpdateData.zoneRange = plantData.properties.zoneRange;
          if (plantData.properties.soilPhRange !== undefined) propertyUpdateData.soilPhRange = plantData.properties.soilPhRange;
          if (plantData.properties.lightRequirements !== undefined) propertyUpdateData.lightRequirements = plantData.properties.lightRequirements;
          if (plantData.properties.daysToMaturity !== undefined) propertyUpdateData.daysToMaturity = plantData.properties.daysToMaturity;
          if (plantData.properties.heightMatureCm !== undefined) propertyUpdateData.heightMatureCm = plantData.properties.heightMatureCm;
          if (plantData.properties.spreadMatureCm !== undefined) propertyUpdateData.spreadMatureCm = plantData.properties.spreadMatureCm;
          if (plantData.properties.soilTypePreferences !== undefined) propertyUpdateData.soilTypePreferences = plantData.properties.soilTypePreferences;
          if (plantData.properties.cultivationNotes !== undefined) propertyUpdateData.cultivationNotes = plantData.properties.cultivationNotes;
          if (plantData.properties.pestSusceptibility !== undefined) propertyUpdateData.pestSusceptibility = plantData.properties.pestSusceptibility;
          if (plantData.properties.diseaseSusceptibility !== undefined) propertyUpdateData.diseaseSusceptibility = plantData.properties.diseaseSusceptibility;
          
          // Only update if there are properties to update
          if (Object.keys(propertyUpdateData).length > 0) {
            await db.update(plantProperties)
              .set(propertyUpdateData)
              .where(eq(plantProperties.plantId, id));
          }
        } else if (Object.values(plantData.properties).some(value => value !== undefined && value !== null && value !== '')) {
          // Only insert if at least one property has a non-empty value
          await db.insert(plantProperties).values({
            plantId: id,
            waterRequirements: plantData.properties.waterRequirements,
            zoneRange: plantData.properties.zoneRange,
            soilPhRange: plantData.properties.soilPhRange,
            lightRequirements: plantData.properties.lightRequirements,
            daysToMaturity: plantData.properties.daysToMaturity,
            heightMatureCm: plantData.properties.heightMatureCm,
            spreadMatureCm: plantData.properties.spreadMatureCm,
            soilTypePreferences: plantData.properties.soilTypePreferences,
            cultivationNotes: plantData.properties.cultivationNotes,
            pestSusceptibility: plantData.properties.pestSusceptibility,
            diseaseSusceptibility: plantData.properties.diseaseSusceptibility,
          });
        }
      }

      // Handle germination guide data
      if (plantData.germinationGuide && Object.keys(plantData.germinationGuide).length > 0) {
        const germResults = await db.select().from(plantGerminationGuide).where(eq(plantGerminationGuide.plantId, id));
        
        if (germResults.length > 0) {
          // Create an object with only the properties that have values
          const germUpdateData: Record<string, unknown> = {};
          
          if (plantData.germinationGuide.zoneRange !== undefined) germUpdateData.zoneRange = plantData.germinationGuide.zoneRange;
          if (plantData.germinationGuide.soilTempMinC !== undefined) germUpdateData.soilTempMinC = plantData.germinationGuide.soilTempMinC;
          if (plantData.germinationGuide.soilTempMaxC !== undefined) germUpdateData.soilTempMaxC = plantData.germinationGuide.soilTempMaxC;
          if (plantData.germinationGuide.daysToGerminationMin !== undefined) germUpdateData.daysToGerminationMin = plantData.germinationGuide.daysToGerminationMin;
          if (plantData.germinationGuide.daysToGerminationMax !== undefined) germUpdateData.daysToGerminationMax = plantData.germinationGuide.daysToGerminationMax;
          if (plantData.germinationGuide.plantingDepthCm !== undefined) germUpdateData.plantingDepthCm = plantData.germinationGuide.plantingDepthCm;
          if (plantData.germinationGuide.lightRequirement !== undefined) germUpdateData.lightRequirement = plantData.germinationGuide.lightRequirement;
          if (plantData.germinationGuide.springStartWeek !== undefined) germUpdateData.springStartWeek = plantData.germinationGuide.springStartWeek;
          if (plantData.germinationGuide.springEndWeek !== undefined) germUpdateData.springEndWeek = plantData.germinationGuide.springEndWeek;
          if (plantData.germinationGuide.fallStartWeek !== undefined) germUpdateData.fallStartWeek = plantData.germinationGuide.fallStartWeek;
          if (plantData.germinationGuide.fallEndWeek !== undefined) germUpdateData.fallEndWeek = plantData.germinationGuide.fallEndWeek;
          if (plantData.germinationGuide.indoorSowingWeeksBeforeFrost !== undefined) germUpdateData.indoorSowingWeeksBeforeFrost = plantData.germinationGuide.indoorSowingWeeksBeforeFrost;
          if (plantData.germinationGuide.stratificationRequired !== undefined) germUpdateData.stratificationRequired = plantData.germinationGuide.stratificationRequired;
          if (plantData.germinationGuide.stratificationInstructions !== undefined) germUpdateData.stratificationInstructions = plantData.germinationGuide.stratificationInstructions;
          if (plantData.germinationGuide.scarificationRequired !== undefined) germUpdateData.scarificationRequired = plantData.germinationGuide.scarificationRequired;
          if (plantData.germinationGuide.scarificationInstructions !== undefined) germUpdateData.scarificationInstructions = plantData.germinationGuide.scarificationInstructions;
          if (plantData.germinationGuide.specialRequirements !== undefined) germUpdateData.specialRequirements = plantData.germinationGuide.specialRequirements;
          if (plantData.germinationGuide.germinationNotes !== undefined) germUpdateData.germinationNotes = plantData.germinationGuide.germinationNotes;
          
          // Only update if there are properties to update
          if (Object.keys(germUpdateData).length > 0) {
            await db.update(plantGerminationGuide)
              .set(germUpdateData)
              .where(eq(plantGerminationGuide.plantId, id));
          }
        } else if (Object.values(plantData.germinationGuide).some(value => value !== undefined && value !== null && value !== '')) {
          // Only insert if at least one property has a non-empty value
          await db.insert(plantGerminationGuide).values({
            plantId: id,
            zoneRange: plantData.germinationGuide.zoneRange,
            soilTempMinC: plantData.germinationGuide.soilTempMinC,
            soilTempMaxC: plantData.germinationGuide.soilTempMaxC,
            daysToGerminationMin: plantData.germinationGuide.daysToGerminationMin,
            daysToGerminationMax: plantData.germinationGuide.daysToGerminationMax,
            plantingDepthCm: plantData.germinationGuide.plantingDepthCm,
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
      }

      // Handle planting guide data
      if (plantData.plantingGuide && Object.keys(plantData.plantingGuide).length > 0) {
        const guideResults = await db.select().from(plantingGuide).where(eq(plantingGuide.plantId, id));
        
        if (guideResults.length > 0) {
          // Create an object with only the properties that have values
          const guideUpdateData: Record<string, unknown> = {};
          
          if (plantData.plantingGuide.springPlantingStart !== undefined) guideUpdateData.springPlantingStart = plantData.plantingGuide.springPlantingStart;
          if (plantData.plantingGuide.springPlantingEnd !== undefined) guideUpdateData.springPlantingEnd = plantData.plantingGuide.springPlantingEnd;
          if (plantData.plantingGuide.fallPlantingStart !== undefined) guideUpdateData.fallPlantingStart = plantData.plantingGuide.fallPlantingStart;
          if (plantData.plantingGuide.fallPlantingEnd !== undefined) guideUpdateData.fallPlantingEnd = plantData.plantingGuide.fallPlantingEnd;
          if (plantData.plantingGuide.indoorSowingStart !== undefined) guideUpdateData.indoorSowingStart = plantData.plantingGuide.indoorSowingStart;
          if (plantData.plantingGuide.transplantReadyWeeks !== undefined) guideUpdateData.transplantReadyWeeks = plantData.plantingGuide.transplantReadyWeeks;
          if (plantData.plantingGuide.directSowAfterFrost !== undefined) guideUpdateData.directSowAfterFrost = plantData.plantingGuide.directSowAfterFrost;
          if (plantData.plantingGuide.frostTolerance !== undefined) guideUpdateData.frostTolerance = plantData.plantingGuide.frostTolerance;
          if (plantData.plantingGuide.heatTolerance !== undefined) guideUpdateData.heatTolerance = plantData.plantingGuide.heatTolerance;
          if (plantData.plantingGuide.successionPlantingInterval !== undefined) guideUpdateData.successionPlantingInterval = plantData.plantingGuide.successionPlantingInterval;
          if (plantData.plantingGuide.companionPlants !== undefined) guideUpdateData.companionPlants = plantData.plantingGuide.companionPlants;
          if (plantData.plantingGuide.incompatiblePlants !== undefined) guideUpdateData.incompatiblePlants = plantData.plantingGuide.incompatiblePlants;
          if (plantData.plantingGuide.rotationGroup !== undefined) guideUpdateData.rotationGroup = plantData.plantingGuide.rotationGroup;
          if (plantData.plantingGuide.rotationInterval !== undefined) guideUpdateData.rotationInterval = plantData.plantingGuide.rotationInterval;
          
          // Only update if there are properties to update
          if (Object.keys(guideUpdateData).length > 0) {
            await db.update(plantingGuide)
              .set(guideUpdateData)
              .where(eq(plantingGuide.plantId, id));
          }
        } else if (Object.values(plantData.plantingGuide).some(value => value !== undefined && value !== null && value !== '')) {
          // Only insert if at least one property has a non-empty value
          await db.insert(plantingGuide).values({
            plantId: id,
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
            companionPlants: plantData.plantingGuide.companionPlants,
            incompatiblePlants: plantData.plantingGuide.incompatiblePlants,
            rotationGroup: plantData.plantingGuide.rotationGroup,
            rotationInterval: plantData.plantingGuide.rotationInterval,
          });
        }
      }

      // Handle plant parts data
      if (plantData.plantParts) {
        // Ensure plantParts is an array, even if empty
        const plantPartsArray = Array.isArray(plantData.plantParts) ? plantData.plantParts : [];
        
        // Get existing plant parts for this plant
        const existingParts = await db.select().from(plantParts).where(eq(plantParts.plantId, id));
        
        // Process each plant part from the form data
        for (const partData of plantPartsArray) {
          if (partData.isDeleted) {
            // Delete part if it exists and is marked for deletion
            if (partData.id) {
              await db.delete(plantParts).where(eq(plantParts.partId, partData.id));
            }
          } else if (partData.isNew) {
            // Check if a part with the same name already exists for this plant
            const existingPart = existingParts.find(p => p.partName.toLowerCase() === partData.partName.toLowerCase());
            
            if (!existingPart) {
              // Insert new part only if it doesn't already exist
              await db.insert(plantParts).values({
                plantId: id,
                partName: partData.partName,
                description: partData.description || null,
                edible: partData.edible || false,
                harvestGuidelines: partData.harvestGuidelines || null,
                storageRequirements: partData.storageRequirements || null,
                processingNotes: partData.processingNotes || null,
              });
            }
          } else if (partData.id) {
            // Update existing part
            const updateData: Record<string, unknown> = {};
            
            if (partData.partName !== undefined) updateData.partName = partData.partName;
            if (partData.description !== undefined) updateData.description = partData.description;
            if (partData.edible !== undefined) updateData.edible = partData.edible;
            if (partData.harvestGuidelines !== undefined) updateData.harvestGuidelines = partData.harvestGuidelines;
            if (partData.storageRequirements !== undefined) updateData.storageRequirements = partData.storageRequirements;
            if (partData.processingNotes !== undefined) updateData.processingNotes = partData.processingNotes;
            
            // Only update if there are properties to update
            if (Object.keys(updateData).length > 0) {
              await db.update(plantParts)
                .set(updateData)
                .where(eq(plantParts.partId, partData.id));
            }
          }
        }
      }

      // Handle TCM properties data
      if (plantData.tcmProperties && Object.keys(plantData.tcmProperties).length > 0) {
        const tcmResults = await db.select().from(plantTcmProperties).where(eq(plantTcmProperties.plantId, id));
        
        if (tcmResults.length > 0) {
          // Create an object with only the properties that have values
          const tcmUpdateData: Record<string, unknown> = {};
          
          if (plantData.tcmProperties.chineseName !== undefined) tcmUpdateData.chineseName = plantData.tcmProperties.chineseName;
          if (plantData.tcmProperties.pinyinName !== undefined) tcmUpdateData.pinyinName = plantData.tcmProperties.pinyinName;
          if (plantData.tcmProperties.temperatureId !== undefined) tcmUpdateData.temperatureId = plantData.tcmProperties.temperatureId;
          if (plantData.tcmProperties.dosageRange !== undefined) tcmUpdateData.dosageRange = plantData.tcmProperties.dosageRange;
          if (plantData.tcmProperties.preparationMethods !== undefined) tcmUpdateData.preparationMethods = plantData.tcmProperties.preparationMethods;
          if (plantData.tcmProperties.contraindications !== undefined) tcmUpdateData.contraindications = plantData.tcmProperties.contraindications;
          if (plantData.tcmProperties.tasteIds !== undefined) tcmUpdateData.tasteIds = plantData.tcmProperties.tasteIds;
          if (plantData.tcmProperties.meridianIds !== undefined) tcmUpdateData.meridianIds = plantData.tcmProperties.meridianIds;
          
          // Only update if there are properties to update
          if (Object.keys(tcmUpdateData).length > 0) {
            await db.update(plantTcmProperties)
              .set(tcmUpdateData)
              .where(eq(plantTcmProperties.plantId, id));
          }
        } else if (Object.values(plantData.tcmProperties).some(value => value !== undefined && value !== null && value !== '')) {
          // Only insert if at least one property has a non-empty value
          await db.insert(plantTcmProperties).values({
            plantId: id,
            chineseName: plantData.tcmProperties.chineseName,
            pinyinName: plantData.tcmProperties.pinyinName,
            temperatureId: plantData.tcmProperties.temperatureId,
            dosageRange: plantData.tcmProperties.dosageRange,
            preparationMethods: plantData.tcmProperties.preparationMethods,
            contraindications: plantData.tcmProperties.contraindications,
            tasteIds: plantData.tcmProperties.tasteIds || [],
            meridianIds: plantData.tcmProperties.meridianIds || [],
          });
        }
      }

      // Handle Ayurvedic properties data
      if (plantData.ayurvedicProperties) {
        const ayurResults = await db.select().from(plantAyurvedicProperties).where(eq(plantAyurvedicProperties.plantId, id));
        
        if (ayurResults.length > 0) {
          // Create an object with only the properties that have values
          const ayurUpdateData: Record<string, unknown> = {};
          
          if (plantData.ayurvedicProperties.sanskritName !== undefined) ayurUpdateData.sanskritName = plantData.ayurvedicProperties.sanskritName;
          if (plantData.ayurvedicProperties.commonAyurvedicName !== undefined) ayurUpdateData.commonAyurvedicName = plantData.ayurvedicProperties.commonAyurvedicName;
          if (plantData.ayurvedicProperties.dosageForm !== undefined) ayurUpdateData.dosageForm = plantData.ayurvedicProperties.dosageForm;
          if (plantData.ayurvedicProperties.dosageRange !== undefined) ayurUpdateData.dosageRange = plantData.ayurvedicProperties.dosageRange;
          if (plantData.ayurvedicProperties.anupana !== undefined) ayurUpdateData.anupana = plantData.ayurvedicProperties.anupana;
          if (plantData.ayurvedicProperties.prabhava !== undefined) ayurUpdateData.prabhava = plantData.ayurvedicProperties.prabhava;
          if (plantData.ayurvedicProperties.contraindications !== undefined) ayurUpdateData.contraindications = plantData.ayurvedicProperties.contraindications;
          if (plantData.ayurvedicProperties.rasaIds !== undefined) ayurUpdateData.rasaIds = plantData.ayurvedicProperties.rasaIds;
          if (plantData.ayurvedicProperties.viryaId !== undefined) ayurUpdateData.viryaId = plantData.ayurvedicProperties.viryaId;
          if (plantData.ayurvedicProperties.vipakaId !== undefined) ayurUpdateData.vipakaId = plantData.ayurvedicProperties.vipakaId;
          if (plantData.ayurvedicProperties.gunaIds !== undefined) ayurUpdateData.gunaIds = plantData.ayurvedicProperties.gunaIds;
          if (plantData.ayurvedicProperties.doshaEffects !== undefined) ayurUpdateData.doshaEffects = plantData.ayurvedicProperties.doshaEffects;
          if (plantData.ayurvedicProperties.dhatuEffects !== undefined) ayurUpdateData.dhatuEffects = plantData.ayurvedicProperties.dhatuEffects;
          if (plantData.ayurvedicProperties.srotaEffects !== undefined) ayurUpdateData.srotaEffects = plantData.ayurvedicProperties.srotaEffects;
          
          // Only update if there are properties to update
          if (Object.keys(ayurUpdateData).length > 0) {
            await db.update(plantAyurvedicProperties)
              .set(ayurUpdateData)
              .where(eq(plantAyurvedicProperties.plantId, id));
          }
        } else if (Object.values(plantData.ayurvedicProperties).some(value => value !== undefined && value !== null && value !== '')) {
          // Only insert if at least one property has a non-empty value
          await db.insert(plantAyurvedicProperties).values({
            plantId: id,
            sanskritName: plantData.ayurvedicProperties.sanskritName,
            commonAyurvedicName: plantData.ayurvedicProperties.commonAyurvedicName,
            dosageForm: plantData.ayurvedicProperties.dosageForm,
            dosageRange: plantData.ayurvedicProperties.dosageRange,
            anupana: plantData.ayurvedicProperties.anupana,
            prabhava: plantData.ayurvedicProperties.prabhava,
            contraindications: plantData.ayurvedicProperties.contraindications,
            rasaIds: plantData.ayurvedicProperties.rasaIds,
            viryaId: plantData.ayurvedicProperties.viryaId,
            vipakaId: plantData.ayurvedicProperties.vipakaId,
            gunaIds: plantData.ayurvedicProperties.gunaIds,
            doshaEffects: plantData.ayurvedicProperties.doshaEffects,
            dhatuEffects: plantData.ayurvedicProperties.dhatuEffects,
            srotaEffects: plantData.ayurvedicProperties.srotaEffects,
          });
        }
      }

      // Redirect to the plant detail page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
      
    } catch (error) {
      console.error("Error updating plant:", error);
      return ctx.render({ 
        plant: null, 
        _plantParts: [],
        _plantProperties: null,
        error: `Error updating plant: ${(error as Error).message}` 
      });
    }
  }
};

export default function EditPlant({ data }: PageProps<Data>) {
  const { plant, _plantParts, _plantProperties, error } = data;

  return (
    <AdminLayout currentPath="/admin/plants">
      <div class="space-y-6 p-6">
        <div class="sm:flex sm:items-center sm:justify-between">
          <h1 class="text-2xl font-semibold text-gray-900">
            Edit Plant: {plant?.common_name}
          </h1>
          <div>
            <a
              href="/admin/plants"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Plants
            </a>
          </div>
        </div>

        {error && (
          <div class="rounded-md bg-red-50 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {plant && (
          <PlantFormSidebar
            plant={{
              id: plant.id,
              common_name: plant.common_name,
              botanical_name: plant.botanical_name,
              family: plant.family,
              genus: plant.genus,
              species: plant.species,
              description: plant.description,
              native_range: plant.native_range,
              taxonomy: plant.taxonomy,
              is_medicinal: plant.is_medicinal,
              is_food_crop: plant.is_food_crop,
            }}
            _plantParts={_plantParts}
            submitUrl={`/admin/plants/edit/${plant.id}`}
          />
        )}
      </div>
    </AdminLayout>
  );
}