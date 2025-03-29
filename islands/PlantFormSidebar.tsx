import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { type Plant, type PlantPart } from "../utils/schema.ts";
import { CreatePlantInput } from "../repositories/PlantRepository.ts";
import BasicInfoForm from "../components/forms/BasicInfoForm.tsx";
import DetailsForm from "../components/forms/DetailsForm.tsx";
import GerminationGuideForm from "../components/forms/GerminationGuideForm.tsx";
import PlantPropertiesForm from "../components/forms/PlantPropertiesForm.tsx";
import PlantingGuideForm from "../components/forms/PlantingGuideForm.tsx";
import TCMPropertiesForm from "../components/forms/TCMPropertiesForm.tsx";
import AyurvedicPropertiesForm from "../components/forms/AyurvedicPropertiesForm.tsx";
import WesternPropertiesForm from "../components/forms/WesternPropertiesForm.tsx";
import HorticultureForm from "../components/forms/HorticultureForm.tsx";
import SeedSavingForm from "../components/forms/SeedSavingForm.tsx";
import DosageGuidelinesForm from "../components/forms/DosageGuidelinesForm.tsx";
import RecipeKeeperForm from "../components/forms/RecipeKeeperForm.tsx";
import CulinaryUsesForm from "../components/forms/CulinaryUsesForm.tsx";
import PlantPartsForm, { PlantPartInput } from "../components/forms/PlantPartsForm.tsx";

// Extended interface for all related plant data
interface ExtendedCreatePlantInput extends CreatePlantInput {
  properties?: {
    zoneRange?: string;
    soilPhRange?: string;
    lightRequirements?: string;
    waterRequirements?: string;
    daysToMaturity?: number;
    heightMatureCm?: number;
    spreadMatureCm?: number;
    soilTypePreferences?: string;
    cultivationNotes?: string;
    pestSusceptibility?: string;
    diseaseSusceptibility?: string;
  };
  germinationGuide?: {
    zoneRange?: string;
    soilTempMinC?: number;
    soilTempMaxC?: number;
    daysToGerminationMin?: number;
    daysToGerminationMax?: number;
    plantingDepthCm?: number;
    lightRequirement?: string;
    springStartWeek?: number;
    springEndWeek?: number;
    fallStartWeek?: number;
    fallEndWeek?: number;
    indoorSowingWeeksBeforeFrost?: number;
    stratificationRequired?: boolean;
    stratificationInstructions?: string;
    scarificationRequired?: boolean;
    scarificationInstructions?: string;
    specialRequirements?: string;
    germinationNotes?: string;
  };
  plantingGuide?: {
    springPlantingStart?: string;
    springPlantingEnd?: string;
    fallPlantingStart?: string;
    fallPlantingEnd?: string;
    indoorSowingStart?: string;
    transplantReadyWeeks?: number;
    directSowAfterFrost?: boolean;
    frostTolerance?: string;
    heatTolerance?: string;
    successionPlantingInterval?: number;
    companionPlants?: string; // Comma-separated string for array
    incompatiblePlants?: string; // Comma-separated string for array
    rotationGroup?: string;
    rotationInterval?: number;
  };
  westernProperties?: {
    herbalCategory?: string;
    effectivenessRating?: number;
    primaryHerbalActions?: string;
    constituentCompounds?: string;
    safetyConsiderations?: string;
    clinicalResearch?: string;
    historicalUse?: string;
  };
  horticultureInfo?: {
    propagationMethods?: string;
    optimalGrowingConditions?: string;
    seasonalCareTips?: string;
    pruningRequirements?: string;
    pestManagement?: string;
    diseaseManagement?: string;
    growthRate?: string;
    maintenanceLevel?: string;
    specialConsiderations?: string;
  };
  seedSaving?: {
    pollinationType?: string;
    isolationDistance?: number;
    daysToSeedMaturity?: number;
    minimumPopulationSize?: number;
    seedExtractionMethod?: string;
    cleaningInstructions?: string;
    storageConditions?: string;
    seedViability?: number;
    germinationTestMethod?: string;
    harvestIndicators?: string;
    specialConsiderations?: string;
  };
  dosageGuidelines?: {
    preparationForms?: string;
    administrationRoutes?: string;
    adultTinctureDosage?: string;
    childTinctureDosage?: string;
    teaDosage?: string;
    recommendedDuration?: string;
    ageRestrictions?: string;
    contraindications?: string;
    drugInteractions?: string;
    safetyNotes?: string;
  };
  recipeKeeper?: {
    recipeType?: string;
    recipeName?: string;
    targetCondition?: string;
    ingredients?: string;
    preparationMethod?: string;
    menstruumDetails?: string;
    macerationTime?: string;
    processingSteps?: string;
    storageInstructions?: string;
    shelfLife?: string;
    dosageInstructions?: string;
    additionalNotes?: string;
    effectivenessRating?: number;
    dateCreated?: string;
    sourceAttribution?: string;
  };
  culinaryUses?: {
    edibleParts?: string;
    flavorProfile?: string;
    culinaryCategories?: string;
    preparationMethods?: string;
    traditionalUses?: string;
    modernUses?: string;
    companionIngredients?: string;
    culturalSignificance?: string;
    seasonalAvailability?: string;
    culinaryRecipes?: string;
    nutritionalInfo?: string;
  };
  tcmProperties?: {
    chineseName?: string;
    pinyinName?: string;
    temperatureId?: number;
    dosageRange?: string;
    preparationMethods?: string;
    contraindications?: string;
    tasteIds?: string; // Comma-separated string for array
    meridianIds?: string; // Comma-separated string for array
    toxicityLevel?: string;
    categoryClassification?: string;
    tcmActions?: string;
    indications?: string;
    classicalFormulas?: string;
    commonCombinations?: string;
    processingMethods?: string;
  };
  ayurvedicProperties?: {
    sanskritName?: string;
    commonAyurvedicName?: string;
    dosageForm?: string;
    dosageRange?: string;
    anupana?: string;
    prabhava?: string;
    contraindications?: string;
    rasaIds?: string; // Comma-separated string for array
    viryaId?: number;
    vipakaId?: number;
    gunaIds?: string; // Comma-separated string for array
    doshaEffects?: string; // JSON string
    dhatuEffects?: string; // JSON string
    srotaEffects?: string; // JSON string
  };
  plantParts?: PlantPartInput[];
}

interface PlantFormSidebarProps {
  plant?: Plant;
  plantParts?: PlantPart[];
  onSubmit?: (plantData: ExtendedCreatePlantInput) => Promise<void>;
  onCancel?: () => void;
  _isNew?: boolean;
  submitUrl?: string;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function PlantFormSidebar({
  plant,
  plantParts = [],
  onSubmit,
  onCancel,
  _isNew = false,
  submitUrl = "/admin/plants/submit",
}: PlantFormSidebarProps) {
  const activeSection = useSignal("basic");
  const saveStatus = useSignal<SaveStatus>("idle");
  const errorMessage = useSignal<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const formData = useSignal<ExtendedCreatePlantInput | null>(null);

  const [plantPartsData, setPlantPartsData] = useState<PlantPartInput[]>(
    plantParts.map(part => ({
      id: part.partId,
      partName: part.partName,
      description: part.description || "",
      edible: part.edible === null ? false : part.edible,
      harvestGuidelines: part.harvestGuidelines || "",
      storageRequirements: part.storageRequirements || "",
      processingNotes: part.processingNotes || "",
      isNew: false,
      isDeleted: false
    }))
  );

  // Navigation sections with icons and labels
  const sections = [
    { id: "basic", label: "Basic Information", icon: "📋" },
    { id: "details", label: "Plant Details", icon: "🔍" },
    { id: "properties", label: "Plant Properties", icon: "🌱" },
    { id: "parts", label: "Plant Parts", icon: "🌿" },
    { id: "germination", label: "Germination Guide", icon: "🌱" },
    { id: "planting", label: "Planting Guide", icon: "🌾" },
    { id: "western", label: "Western Properties", icon: "🌡️" },
    { id: "horticulture", label: "Horticulture Information", icon: "🧑‍🌾" },
    { id: "seedsaving", label: "Seed Saving", icon: "🌰" },
    { id: "dosage", label: "Dosage Guidelines", icon: "💊" },
    { id: "recipe", label: "Recipe Keeper", icon: "🧪" },
    { id: "culinary", label: "Culinary Uses", icon: "🍽️" },
    { id: "tcm", label: "TCM Properties", icon: "☯️" },
    { id: "ayurvedic", label: "Ayurvedic Properties", icon: "🧘" },
  ];

  useEffect(() => {
    const submitData = async () => {
      if (formData.value && typeof onSubmit === 'function') {
        try {
          saveStatus.value = "saving";
          await onSubmit(formData.value);
          saveStatus.value = "success";
          setTimeout(() => (saveStatus.value = "idle"), 2000);
        } catch (error) {
          saveStatus.value = "error";
          errorMessage.value = error instanceof Error ? error.message : "Failed to save plant";
          console.error("Error submitting form:", error);
        }
      }
    };

    if (formData.value) {
      submitData();
    }
  }, [formData.value]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fData = new FormData(form);

    const plantData: ExtendedCreatePlantInput = {
      botanicalName: fData.get("botanicalName") as string,
      commonName: fData.get("commonName") as string,
      family: fData.get("family") as string || undefined,
      genus: fData.get("genus") as string || undefined,
      species: fData.get("species") as string || undefined,
      description: fData.get("description") as string || undefined,
      nativeRange: fData.get("nativeRange") as string || undefined,
      growthHabit: fData.get("growthHabit") as string || undefined,
      lifespan: fData.get("lifespan") as string || undefined,
      hardinessZones: fData.get("hardinessZones") as string || undefined,
      properties: {
        zoneRange: fData.get("zoneRange") as string || undefined,
        soilPhRange: fData.get("soilPhRange") as string || undefined,
        lightRequirements: fData.get("lightRequirements") as string || undefined,
        waterRequirements: fData.get("waterRequirements") as string || undefined,
        daysToMaturity: fData.get("daysToMaturity") ? Number(fData.get("daysToMaturity")) : undefined,
        heightMatureCm: fData.get("heightMatureCm") ? Number(fData.get("heightMatureCm")) : undefined,
        spreadMatureCm: fData.get("spreadMatureCm") ? Number(fData.get("spreadMatureCm")) : undefined,
        soilTypePreferences: fData.get("soilTypePreferences") as string || undefined,
        cultivationNotes: fData.get("cultivationNotes") as string || undefined,
        pestSusceptibility: fData.get("pestSusceptibility") as string || undefined,
        diseaseSusceptibility: fData.get("diseaseSusceptibility") as string || undefined,
      },
      germinationGuide: {
        zoneRange: fData.get("zoneRange") as string || undefined,
        soilTempMinC: fData.get("soilTempMinC") ? Number(fData.get("soilTempMinC")) : undefined,
        soilTempMaxC: fData.get("soilTempMaxC") ? Number(fData.get("soilTempMaxC")) : undefined,
        daysToGerminationMin: fData.get("daysToGerminationMin") ? Number(fData.get("daysToGerminationMin")) : undefined,
        daysToGerminationMax: fData.get("daysToGerminationMax") ? Number(fData.get("daysToGerminationMax")) : undefined,
        plantingDepthCm: fData.get("plantingDepthCm") ? Number(fData.get("plantingDepthCm")) : undefined,
        lightRequirement: fData.get("lightRequirement") as string || undefined,
        springStartWeek: fData.get("springStartWeek") ? Number(fData.get("springStartWeek")) : undefined,
        springEndWeek: fData.get("springEndWeek") ? Number(fData.get("springEndWeek")) : undefined,
        fallStartWeek: fData.get("fallStartWeek") ? Number(fData.get("fallStartWeek")) : undefined,
        fallEndWeek: fData.get("fallEndWeek") ? Number(fData.get("fallEndWeek")) : undefined,
        indoorSowingWeeksBeforeFrost: fData.get("indoorSowingWeeksBeforeFrost") ? Number(fData.get("indoorSowingWeeksBeforeFrost")) : undefined,
        stratificationRequired: fData.get("stratificationRequired") === "on" || undefined,
        stratificationInstructions: fData.get("stratificationInstructions") as string || undefined,
        scarificationRequired: fData.get("scarificationRequired") === "on" || undefined,
        scarificationInstructions: fData.get("scarificationInstructions") as string || undefined,
        specialRequirements: fData.get("specialRequirements") as string || undefined,
        germinationNotes: fData.get("germinationNotes") as string || undefined,
      },
      plantingGuide: {
        springPlantingStart: fData.get("springPlantingStart") as string || undefined,
        springPlantingEnd: fData.get("springPlantingEnd") as string || undefined,
        fallPlantingStart: fData.get("fallPlantingStart") as string || undefined,
        fallPlantingEnd: fData.get("fallPlantingEnd") as string || undefined,
        indoorSowingStart: fData.get("indoorSowingStart") as string || undefined,
        transplantReadyWeeks: fData.get("transplantReadyWeeks") ? Number(fData.get("transplantReadyWeeks")) : undefined,
        directSowAfterFrost: fData.get("directSowAfterFrost") === "on" || undefined,
        frostTolerance: fData.get("frostTolerance") as string || undefined,
        heatTolerance: fData.get("heatTolerance") as string || undefined,
        successionPlantingInterval: fData.get("successionPlantingInterval") ? Number(fData.get("successionPlantingInterval")) : undefined,
        companionPlants: fData.get("companionPlants") as string || undefined, // Comma-separated string
        incompatiblePlants: fData.get("incompatiblePlants") as string || undefined, // Comma-separated string
        rotationGroup: fData.get("rotationGroup") as string || undefined,
        rotationInterval: fData.get("rotationInterval") ? Number(fData.get("rotationInterval")) : undefined,
      },
      westernProperties: {
        herbalCategory: fData.get("herbalCategory") as string || undefined,
        effectivenessRating: fData.get("effectivenessRating") ? Number(fData.get("effectivenessRating")) : undefined,
        primaryHerbalActions: fData.get("primaryHerbalActions") as string || undefined,
        constituentCompounds: fData.get("constituentCompounds") as string || undefined,
        safetyConsiderations: fData.get("safetyConsiderations") as string || undefined,
        clinicalResearch: fData.get("clinicalResearch") as string || undefined,
        historicalUse: fData.get("historicalUse") as string || undefined,
      },
      horticultureInfo: {
        propagationMethods: fData.get("propagationMethods") as string || undefined,
        optimalGrowingConditions: fData.get("optimalGrowingConditions") as string || undefined,
        seasonalCareTips: fData.get("seasonalCareTips") as string || undefined,
        pruningRequirements: fData.get("pruningRequirements") as string || undefined,
        pestManagement: fData.get("pestManagement") as string || undefined,
        diseaseManagement: fData.get("diseaseManagement") as string || undefined,
        growthRate: fData.get("growthRate") as string || undefined,
        maintenanceLevel: fData.get("maintenanceLevel") as string || undefined,
        specialConsiderations: fData.get("hortSpecialConsiderations") as string || undefined,
      },
      seedSaving: {
        pollinationType: fData.get("pollinationType") as string || undefined,
        isolationDistance: fData.get("isolationDistance") ? Number(fData.get("isolationDistance")) : undefined,
        daysToSeedMaturity: fData.get("daysToSeedMaturity") ? Number(fData.get("daysToSeedMaturity")) : undefined,
        minimumPopulationSize: fData.get("minimumPopulationSize") ? Number(fData.get("minimumPopulationSize")) : undefined,
        seedExtractionMethod: fData.get("seedExtractionMethod") as string || undefined,
        cleaningInstructions: fData.get("cleaningInstructions") as string || undefined,
        storageConditions: fData.get("storageConditions") as string || undefined,
        seedViability: fData.get("seedViability") ? Number(fData.get("seedViability")) : undefined,
        germinationTestMethod: fData.get("germinationTestMethod") as string || undefined,
        harvestIndicators: fData.get("harvestIndicators") as string || undefined,
        specialConsiderations: fData.get("seedSpecialConsiderations") as string || undefined,
      },
      dosageGuidelines: {
        preparationForms: fData.get("preparationForms") as string || undefined,
        administrationRoutes: fData.get("administrationRoutes") as string || undefined,
        adultTinctureDosage: fData.get("adultTinctureDosage") as string || undefined,
        childTinctureDosage: fData.get("childTinctureDosage") as string || undefined,
        teaDosage: fData.get("teaDosage") as string || undefined,
        recommendedDuration: fData.get("recommendedDuration") as string || undefined,
        ageRestrictions: fData.get("ageRestrictions") as string || undefined,
        contraindications: fData.get("doseContraindications") as string || undefined,
        drugInteractions: fData.get("drugInteractions") as string || undefined,
        safetyNotes: fData.get("safetyNotes") as string || undefined,
      },
      recipeKeeper: {
        recipeType: fData.get("recipeType") as string || undefined,
        recipeName: fData.get("recipeName") as string || undefined,
        targetCondition: fData.get("targetCondition") as string || undefined,
        ingredients: fData.get("ingredients") as string || undefined,
        preparationMethod: fData.get("preparationMethod") as string || undefined,
        menstruumDetails: fData.get("menstruumDetails") as string || undefined,
        macerationTime: fData.get("macerationTime") as string || undefined,
        processingSteps: fData.get("processingSteps") as string || undefined,
        storageInstructions: fData.get("storageInstructions") as string || undefined,
        shelfLife: fData.get("shelfLife") as string || undefined,
        dosageInstructions: fData.get("dosageInstructions") as string || undefined,
        additionalNotes: fData.get("additionalNotes") as string || undefined,
        effectivenessRating: fData.get("recipeEffectivenessRating") ? Number(fData.get("recipeEffectivenessRating")) : undefined,
        dateCreated: fData.get("dateCreated") as string || undefined,
        sourceAttribution: fData.get("sourceAttribution") as string || undefined,
      },
      culinaryUses: {
        edibleParts: fData.get("edibleParts") as string || undefined,
        flavorProfile: fData.get("flavorProfile") as string || undefined,
        culinaryCategories: fData.get("culinaryCategories") as string || undefined,
        preparationMethods: fData.get("culinaryPreparationMethods") as string || undefined,
        traditionalUses: fData.get("traditionalUses") as string || undefined,
        modernUses: fData.get("modernUses") as string || undefined,
        companionIngredients: fData.get("companionIngredients") as string || undefined,
        culturalSignificance: fData.get("culturalSignificance") as string || undefined,
        seasonalAvailability: fData.get("seasonalAvailability") as string || undefined,
        culinaryRecipes: fData.get("culinaryRecipes") as string || undefined,
        nutritionalInfo: fData.get("nutritionalInfo") as string || undefined,
      },
      tcmProperties: {
        chineseName: fData.get("chineseName") as string || undefined,
        pinyinName: fData.get("pinyinName") as string || undefined,
        temperatureId: fData.get("temperatureId") ? Number(fData.get("temperatureId")) : undefined,
        dosageRange: fData.get("dosageRange") as string || undefined,
        preparationMethods: fData.get("preparationMethods") as string || undefined,
        contraindications: fData.get("contraindications") as string || undefined,
        tasteIds: fData.get("tasteIds") as string || undefined, // Comma-separated string
        meridianIds: fData.get("meridianIds") as string || undefined, // Comma-separated string
        toxicityLevel: fData.get("toxicityLevel") as string || undefined,
        categoryClassification: fData.get("categoryClassification") as string || undefined,
        tcmActions: fData.get("tcmActions") as string || undefined,
        indications: fData.get("indications") as string || undefined,
        classicalFormulas: fData.get("classicalFormulas") as string || undefined,
        commonCombinations: fData.get("commonCombinations") as string || undefined,
        processingMethods: fData.get("processingMethods") as string || undefined,
      },
      ayurvedicProperties: {
        sanskritName: fData.get("sanskritName") as string || undefined,
        commonAyurvedicName: fData.get("commonAyurvedicName") as string || undefined,
        dosageForm: fData.get("dosageForm") as string || undefined,
        dosageRange: fData.get("dosageRange") as string || undefined,
        anupana: fData.get("anupana") as string || undefined,
        prabhava: fData.get("prabhava") as string || undefined,
        contraindications: fData.get("contraindications") as string || undefined,
        rasaIds: fData.get("rasaIds") as string || undefined, // Comma-separated string
        viryaId: fData.get("viryaId") ? Number(fData.get("viryaId")) : undefined,
        vipakaId: fData.get("vipakaId") ? Number(fData.get("vipakaId")) : undefined,
        gunaIds: fData.get("gunaIds") as string || undefined, // Comma-separated string
        doshaEffects: fData.get("doshaEffects") as string || undefined, // JSON string
        dhatuEffects: fData.get("dhatuEffects") as string || undefined, // JSON string
        srotaEffects: fData.get("srotaEffects") as string || undefined, // JSON string
      },
      plantParts: plantPartsData.filter(part => !part.isDeleted),
    };

    // If using direct form submission
    if (submitUrl && !onSubmit) {
      const formElement = formRef.current;
      if (formElement) {
        // Create a hidden input for the JSON data
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "plantData";
        hiddenInput.value = JSON.stringify(plantData);
        formElement.appendChild(hiddenInput);
        
        // Submit the form
        formElement.submit();
        return;
      }
    }

    // If using client-side submission
    formData.value = plantData;
  };

  const renderActiveSection = () => {
    switch (activeSection.value) {
      case "basic":
        return <BasicInfoForm plant={plant} />;
      case "details":
        return <DetailsForm plant={plant} />;
      case "properties":
        return <PlantPropertiesForm plant={plant} />;
      case "parts":
        return <PlantPartsForm plantParts={plantParts} onChange={setPlantPartsData} />;
      case "germination":
        return <GerminationGuideForm plant={plant} />;
      case "planting":
        return <PlantingGuideForm plant={plant} />;
      case "western":
        return <WesternPropertiesForm plant={plant} />;
      case "horticulture":
        return <HorticultureForm plant={plant} />;
      case "seedsaving":
        return <SeedSavingForm plant={plant} />;
      case "dosage":
        return <DosageGuidelinesForm plant={plant} />;
      case "recipe":
        return <RecipeKeeperForm plant={plant} />;
      case "culinary":
        return <CulinaryUsesForm plant={plant} />;
      case "tcm":
        return <TCMPropertiesForm tcmProperties={plant?.tcmProperties || undefined} />;
      case "ayurvedic":
        return <AyurvedicPropertiesForm plant={plant} />;
      default:
        return <BasicInfoForm plant={plant} />;
    }
  };

  return (
    <div class="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div class="md:w-64 flex-shrink-0">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 bg-green-700 text-white">
            <h3 class="text-lg font-medium">Plant Information</h3>
            <p class="text-sm opacity-80">Complete all sections</p>
          </div>
          <nav class="flex flex-col">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => (activeSection.value = section.id)}
                class={`flex items-center px-4 py-3 text-left ${
                  activeSection.value === section.id
                    ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <span class="mr-3 text-xl">{section.icon}</span>
                <span class="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
          <div class="px-4 py-4 bg-gray-50">
            <div class="flex flex-col gap-2">
              <button 
                type="submit" 
                form="plant-form"
                class="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={saveStatus.value === "saving"}
              >
                {saveStatus.value === "saving" ? "Saving..." : "Save Plant"}
              </button>
              {onCancel && (
                <button 
                  type="button" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onCancel}
                  disabled={saveStatus.value === "saving"}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div class="flex-1">
        <div class="bg-white shadow rounded-lg p-6">
          {/* Status Messages */}
          {saveStatus.value === "saving" && (
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    <span class="animate-pulse mr-2">⏳</span>
                    Saving plant data...
                  </p>
                </div>
              </div>
            </div>
          )}
          {saveStatus.value === "success" && (
            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">
                    Plant data saved successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
          {saveStatus.value === "error" && (
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    {errorMessage.value || "An error occurred"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div class="mb-4">
            <h2 class="text-xl font-medium text-gray-900">{sections.find(s => s.id === activeSection.value)?.label}</h2>
            <p class="text-sm text-gray-500 mt-1">Enter the plant information for this section</p>
          </div>
          
          <form
            id="plant-form"
            ref={formRef}
            method="POST"
            action={submitUrl}
            onSubmit={handleSubmit}
            class="space-y-6"
          >
            {renderActiveSection()}
          </form>
        </div>
      </div>
    </div>
  );
}
