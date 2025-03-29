import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { type Plant, type PlantPart } from "../utils/schema.ts";
import { CreatePlantInput } from "../repositories/PlantRepository.ts";
import BasicInfoForm from "../components/forms/BasicInfoForm.tsx";
import DetailsForm from "../components/forms/DetailsForm.tsx";
import GerminationGuideForm from "../components/forms/GerminationGuideForm.tsx";
import PlantPropertiesForm from "../components/forms/PlantPropertiesForm.tsx";
import PlantingGuideForm from "../components/forms/PlantingGuideForm.tsx";
import TCMPropertiesForm from "../components/forms/TCMPropertiesForm.tsx";
import AyurvedicPropertiesForm from "../components/forms/AyurvedicPropertiesForm.tsx";
import BaseFormIsland from "./BaseFormIsland.tsx";

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
  tcmProperties?: {
    chineseName?: string;
    pinyinName?: string;
    temperatureId?: number;
    dosageRange?: string;
    preparationMethods?: string;
    contraindications?: string;
    tasteIds?: string; // Comma-separated string for array
    meridianIds?: string; // Comma-separated string for array
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
}

interface PlantFormProps {
  plant?: Plant;
  plantParts?: PlantPart[];
  onSubmit?: (plantData: ExtendedCreatePlantInput) => Promise<void>;
  onCancel?: () => void;
  isNew?: boolean;
  submitUrl?: string;
  successRedirectUrl?: string;
}

export default function PlantForm({
  plant,
  _plantParts: plantParts = [],
  onSubmit,
  onCancel,
  _isNew: isNew = false,
  submitUrl = "/admin/plants/submit",
  successRedirectUrl = "/admin/plants",
}: PlantFormProps) {
  const activeTab = useSignal("basic");
  const formRef = useRef<HTMLFormElement>(null);

  // Transform form data for submission
  const transformForSubmit = (formData: Record<string, unknown>): ExtendedCreatePlantInput => {
    return {
      botanicalName: formData.botanicalName as string,
      commonName: formData.commonName as string,
      family: formData.family as string || undefined,
      genus: formData.genus as string || undefined,
      species: formData.species as string || undefined,
      description: formData.description as string || undefined,
      nativeRange: formData.nativeRange as string || undefined,
      growthHabit: formData.growthHabit as string || undefined,
      lifespan: formData.lifespan as string || undefined,
      hardinessZones: formData.hardinessZones as string || undefined,
      properties: {
        zoneRange: formData.zoneRange as string || undefined,
        soilPhRange: formData.soilPhRange as string || undefined,
        lightRequirements: formData.lightRequirements as string || undefined,
        waterRequirements: formData.waterRequirements as string || undefined,
        daysToMaturity: formData.daysToMaturity ? Number(formData.daysToMaturity) : undefined,
        heightMatureCm: formData.heightMatureCm ? Number(formData.heightMatureCm) : undefined,
        spreadMatureCm: formData.spreadMatureCm ? Number(formData.spreadMatureCm) : undefined,
        soilTypePreferences: formData.soilTypePreferences as string || undefined,
        cultivationNotes: formData.cultivationNotes as string || undefined,
        pestSusceptibility: formData.pestSusceptibility as string || undefined,
        diseaseSusceptibility: formData.diseaseSusceptibility as string || undefined,
      },
      germinationGuide: {
        zoneRange: formData.zoneRange as string || undefined,
        soilTempMinC: formData.soilTempMinC ? Number(formData.soilTempMinC) : undefined,
        soilTempMaxC: formData.soilTempMaxC ? Number(formData.soilTempMaxC) : undefined,
        daysToGerminationMin: formData.daysToGerminationMin ? Number(formData.daysToGerminationMin) : undefined,
        daysToGerminationMax: formData.daysToGerminationMax ? Number(formData.daysToGerminationMax) : undefined,
        plantingDepthCm: formData.plantingDepthCm ? Number(formData.plantingDepthCm) : undefined,
        lightRequirement: formData.lightRequirement as string || undefined,
        springStartWeek: formData.springStartWeek ? Number(formData.springStartWeek) : undefined,
        springEndWeek: formData.springEndWeek ? Number(formData.springEndWeek) : undefined,
        fallStartWeek: formData.fallStartWeek ? Number(formData.fallStartWeek) : undefined,
        fallEndWeek: formData.fallEndWeek ? Number(formData.fallEndWeek) : undefined,
        indoorSowingWeeksBeforeFrost: formData.indoorSowingWeeksBeforeFrost ? Number(formData.indoorSowingWeeksBeforeFrost) : undefined,
        stratificationRequired: formData.stratificationRequired === true || undefined,
        stratificationInstructions: formData.stratificationInstructions as string || undefined,
        scarificationRequired: formData.scarificationRequired === true || undefined,
        scarificationInstructions: formData.scarificationInstructions as string || undefined,
        specialRequirements: formData.specialRequirements as string || undefined,
        germinationNotes: formData.germinationNotes as string || undefined,
      },
      plantingGuide: {
        springPlantingStart: formData.springPlantingStart as string || undefined,
        springPlantingEnd: formData.springPlantingEnd as string || undefined,
        fallPlantingStart: formData.fallPlantingStart as string || undefined,
        fallPlantingEnd: formData.fallPlantingEnd as string || undefined,
        indoorSowingStart: formData.indoorSowingStart as string || undefined,
        transplantReadyWeeks: formData.transplantReadyWeeks ? Number(formData.transplantReadyWeeks) : undefined,
        directSowAfterFrost: formData.directSowAfterFrost === true || undefined,
        frostTolerance: formData.frostTolerance as string || undefined,
        heatTolerance: formData.heatTolerance as string || undefined,
        successionPlantingInterval: formData.successionPlantingInterval ? Number(formData.successionPlantingInterval) : undefined,
        companionPlants: formData.companionPlants as string || undefined,
        incompatiblePlants: formData.incompatiblePlants as string || undefined,
        rotationGroup: formData.rotationGroup as string || undefined,
        rotationInterval: formData.rotationInterval ? Number(formData.rotationInterval) : undefined,
      },
      tcmProperties: {
        chineseName: formData.chineseName as string || undefined,
        pinyinName: formData.pinyinName as string || undefined,
        temperatureId: formData.temperatureId ? Number(formData.temperatureId) : undefined,
        dosageRange: formData.dosageRange as string || undefined,
        preparationMethods: formData.preparationMethods as string || undefined,
        contraindications: formData.contraindications as string || undefined,
        tasteIds: formData.tasteIds as string || undefined,
        meridianIds: formData.meridianIds as string || undefined,
      },
      ayurvedicProperties: {
        sanskritName: formData.sanskritName as string || undefined,
        commonAyurvedicName: formData.commonAyurvedicName as string || undefined,
        dosageForm: formData.dosageForm as string || undefined,
        dosageRange: formData.dosageRange as string || undefined,
        anupana: formData.anupana as string || undefined,
        prabhava: formData.prabhava as string || undefined,
        contraindications: formData.contraindications as string || undefined,
        rasaIds: formData.rasaIds as string || undefined,
        viryaId: formData.viryaId ? Number(formData.viryaId) : undefined,
        vipakaId: formData.vipakaId ? Number(formData.vipakaId) : undefined,
        gunaIds: formData.gunaIds as string || undefined,
        doshaEffects: formData.doshaEffects as string || undefined,
        dhatuEffects: formData.dhatuEffects as string || undefined,
        srotaEffects: formData.srotaEffects as string || undefined,
      },
    };
  };

  // Create initial data object from plant if it exists
  const initialData = plant ? {
    botanicalName: plant.botanicalName || "",
    commonName: plant.commonName || "",
    family: plant.family || "",
    genus: plant.genus || "",
    species: plant.species || "",
    description: plant.description || "",
    nativeRange: plant.nativeRange || "",
    growthHabit: plant.growthHabit || "",
    lifespan: plant.lifespan || "",
    hardinessZones: plant.hardinessZones || "",
    // Add other properties as needed
  } : {};

  return (
    <BaseFormIsland
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitUrl={submitUrl}
      successRedirectUrl={successRedirectUrl}
      transformForSubmit={transformForSubmit}
    >
      {({ _formData, _setFormData, _handleChange, handleSubmit, saveStatus, errorMessage }) => (
        <form ref={formRef} onSubmit={handleSubmit} class="space-y-8">
          {/* Tab Navigation */}
          <div class="tabs tabs-boxed">
            <a
              class={`tab ${activeTab.value === "basic" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "basic")}
            >
              Basic Info
            </a>
            <a
              class={`tab ${activeTab.value === "details" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "details")}
            >
              Details
            </a>
            <a
              class={`tab ${activeTab.value === "properties" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "properties")}
            >
              Properties
            </a>
            <a
              class={`tab ${activeTab.value === "germination" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "germination")}
            >
              Germination
            </a>
            <a
              class={`tab ${activeTab.value === "planting" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "planting")}
            >
              Planting
            </a>
            <a
              class={`tab ${activeTab.value === "tcm" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "tcm")}
            >
              TCM
            </a>
            <a
              class={`tab ${activeTab.value === "ayurveda" ? "tab-active" : ""}`}
              onClick={() => (activeTab.value = "ayurveda")}
            >
              Ayurveda
            </a>
          </div>

          {/* Tab Content */}
          <div class="space-y-6">
            {activeTab.value === "basic" && <BasicInfoForm plant={plant} />}
            {activeTab.value === "details" && <DetailsForm plant={plant} />}
            {activeTab.value === "properties" && <PlantPropertiesForm plant={plant} />}
            {activeTab.value === "germination" && <GerminationGuideForm plant={plant} />}
            {activeTab.value === "planting" && <PlantingGuideForm plant={plant} />}
            {activeTab.value === "tcm" && <TCMPropertiesForm plant={plant} />}
            {activeTab.value === "ayurveda" && <AyurvedicPropertiesForm plant={plant} />}
          </div>

          {/* Form Actions */}
          <div class="flex justify-between items-center">
            <div>
              {errorMessage && (
                <div class="alert alert-error">
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
            <div class="flex space-x-4">
              <button
                type="button"
                class="btn btn-outline"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                class={`btn btn-primary ${saveStatus === "saving" ? "loading" : ""}`}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "success" ? "Saved!" : "Save Plant"}
              </button>
            </div>
          </div>
        </form>
      )}
    </BaseFormIsland>
  );
}