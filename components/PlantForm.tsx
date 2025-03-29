import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "https://esm.sh/v128/preact@10.22.0/hooks";
import { type Plant, type PlantPart } from "../utils/schema.ts";
import { CreatePlantInput } from "../repositories/PlantRepository.ts";
import BasicInfoForm from "./forms/BasicInfoForm.tsx";
import DetailsForm from "./forms/DetailsForm.tsx";
import GerminationGuideForm from "./forms/GerminationGuideForm.tsx";
import PlantPropertiesForm from "./forms/PlantPropertiesForm.tsx";
import PlantingGuideForm from "./forms/PlantingGuideForm.tsx";
import TCMPropertiesForm from "./forms/TCMPropertiesForm.tsx";
import AyurvedicPropertiesForm from "./forms/AyurvedicPropertiesForm.tsx";

type SaveStatus = "idle" | "saving" | "success" | "error";

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
  onSubmit: (plantData: ExtendedCreatePlantInput) => Promise<void>;
  onCancel: () => void;
  isNew?: boolean;
}

export default function PlantForm({
  plant,
  plantParts = [],
  onSubmit,
  onCancel,
  isNew = false,
}: PlantFormProps) {
  const activeTab = useSignal("basic");
  const saveStatus = useSignal<SaveStatus>("idle");
  const errorMessage = useSignal<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (form) {
      const handleFormSubmit = (e: Event) => handleSubmit(e);
      form.addEventListener("submit", handleFormSubmit);
      return () => form.removeEventListener("submit", handleFormSubmit);
    }
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const plantData: ExtendedCreatePlantInput = {
      botanicalName: formData.get("botanicalName") as string,
      commonName: formData.get("commonName") as string,
      family: formData.get("family") as string || undefined,
      genus: formData.get("genus") as string || undefined,
      species: formData.get("species") as string || undefined,
      description: formData.get("description") as string || undefined,
      nativeRange: formData.get("nativeRange") as string || undefined,
      growthHabit: formData.get("growthHabit") as string || undefined,
      lifespan: formData.get("lifespan") as string || undefined,
      hardinessZones: formData.get("hardinessZones") as string || undefined,
      properties: {
        zoneRange: formData.get("zoneRange") as string || undefined,
        soilPhRange: formData.get("soilPhRange") as string || undefined,
        lightRequirements: formData.get("lightRequirements") as string || undefined,
        waterRequirements: formData.get("waterRequirements") as string || undefined,
        daysToMaturity: formData.get("daysToMaturity") ? Number(formData.get("daysToMaturity")) : undefined,
        heightMatureCm: formData.get("heightMatureCm") ? Number(formData.get("heightMatureCm")) : undefined,
        spreadMatureCm: formData.get("spreadMatureCm") ? Number(formData.get("spreadMatureCm")) : undefined,
        soilTypePreferences: formData.get("soilTypePreferences") as string || undefined,
        cultivationNotes: formData.get("cultivationNotes") as string || undefined,
        pestSusceptibility: formData.get("pestSusceptibility") as string || undefined,
        diseaseSusceptibility: formData.get("diseaseSusceptibility") as string || undefined,
      },
      germinationGuide: {
        zoneRange: formData.get("zoneRange") as string || undefined,
        soilTempMinC: formData.get("soilTempMinC") ? Number(formData.get("soilTempMinC")) : undefined,
        soilTempMaxC: formData.get("soilTempMaxC") ? Number(formData.get("soilTempMaxC")) : undefined,
        daysToGerminationMin: formData.get("daysToGerminationMin") ? Number(formData.get("daysToGerminationMin")) : undefined,
        daysToGerminationMax: formData.get("daysToGerminationMax") ? Number(formData.get("daysToGerminationMax")) : undefined,
        plantingDepthCm: formData.get("plantingDepthCm") ? Number(formData.get("plantingDepthCm")) : undefined,
        lightRequirement: formData.get("lightRequirement") as string || undefined,
        springStartWeek: formData.get("springStartWeek") ? Number(formData.get("springStartWeek")) : undefined,
        springEndWeek: formData.get("springEndWeek") ? Number(formData.get("springEndWeek")) : undefined,
        fallStartWeek: formData.get("fallStartWeek") ? Number(formData.get("fallStartWeek")) : undefined,
        fallEndWeek: formData.get("fallEndWeek") ? Number(formData.get("fallEndWeek")) : undefined,
        indoorSowingWeeksBeforeFrost: formData.get("indoorSowingWeeksBeforeFrost") ? Number(formData.get("indoorSowingWeeksBeforeFrost")) : undefined,
        stratificationRequired: formData.get("stratificationRequired") === "on" || undefined,
        stratificationInstructions: formData.get("stratificationInstructions") as string || undefined,
        scarificationRequired: formData.get("scarificationRequired") === "on" || undefined,
        scarificationInstructions: formData.get("scarificationInstructions") as string || undefined,
        specialRequirements: formData.get("specialRequirements") as string || undefined,
        germinationNotes: formData.get("germinationNotes") as string || undefined,
      },
      plantingGuide: {
        springPlantingStart: formData.get("springPlantingStart") as string || undefined,
        springPlantingEnd: formData.get("springPlantingEnd") as string || undefined,
        fallPlantingStart: formData.get("fallPlantingStart") as string || undefined,
        fallPlantingEnd: formData.get("fallPlantingEnd") as string || undefined,
        indoorSowingStart: formData.get("indoorSowingStart") as string || undefined,
        transplantReadyWeeks: formData.get("transplantReadyWeeks") ? Number(formData.get("transplantReadyWeeks")) : undefined,
        directSowAfterFrost: formData.get("directSowAfterFrost") === "on" || undefined,
        frostTolerance: formData.get("frostTolerance") as string || undefined,
        heatTolerance: formData.get("heatTolerance") as string || undefined,
        successionPlantingInterval: formData.get("successionPlantingInterval") ? Number(formData.get("successionPlantingInterval")) : undefined,
        companionPlants: formData.get("companionPlants") as string || undefined,
        incompatiblePlants: formData.get("incompatiblePlants") as string || undefined,
        rotationGroup: formData.get("rotationGroup") as string || undefined,
        rotationInterval: formData.get("rotationInterval") ? Number(formData.get("rotationInterval")) : undefined,
      },
      tcmProperties: {
        chineseName: formData.get("chineseName") as string || undefined,
        pinyinName: formData.get("pinyinName") as string || undefined,
        temperatureId: formData.get("temperatureId") ? Number(formData.get("temperatureId")) : undefined,
        dosageRange: formData.get("dosageRange") as string || undefined,
        preparationMethods: formData.get("preparationMethods") as string || undefined,
        contraindications: formData.get("contraindications") as string || undefined,
        tasteIds: formData.get("tasteIds") as string || undefined, // Comma-separated string
        meridianIds: formData.get("meridianIds") as string || undefined, // Comma-separated string
      },
      ayurvedicProperties: {
        sanskritName: formData.get("sanskritName") as string || undefined,
        commonAyurvedicName: formData.get("commonAyurvedicName") as string || undefined,
        dosageForm: formData.get("dosageForm") as string || undefined,
        dosageRange: formData.get("dosageRange") as string || undefined,
        anupana: formData.get("anupana") as string || undefined,
        prabhava: formData.get("prabhava") as string || undefined,
        contraindications: formData.get("contraindications") as string || undefined,
        rasaIds: formData.get("rasaIds") as string || undefined, // Comma-separated string
        viryaId: formData.get("viryaId") ? Number(formData.get("viryaId")) : undefined,
        vipakaId: formData.get("vipakaId") ? Number(formData.get("vipakaId")) : undefined,
        gunaIds: formData.get("gunaIds") as string || undefined, // Comma-separated string
        doshaEffects: formData.get("doshaEffects") as string || undefined, // JSON string
        dhatuEffects: formData.get("dhatuEffects") as string || undefined, // JSON string
        srotaEffects: formData.get("srotaEffects") as string || undefined, // JSON string
      },
    };

    const requiredFields = ["botanicalName", "commonName"];
    for (const field of requiredFields) {
      if (!plantData[field as keyof ExtendedCreatePlantInput]) {
        errorMessage.value = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
        return;
      }
    }

    try {
      saveStatus.value = "saving";
      errorMessage.value = null;
      await onSubmit(plantData);
      saveStatus.value = "success";
      setTimeout(() => (saveStatus.value = "idle"), 2000);
    } catch (error) {
      saveStatus.value = "error";
      errorMessage.value = error instanceof Error ? error.message : "Failed to save plant";
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form ref={formRef} class="space-y-6" onSubmit={handleSubmit}>
      {/* Status Messages */}
      {saveStatus.value === "saving" && (
        <div class="alert alert-info">
          <span class="loading loading-spinner"></span>
          Saving plant data...
        </div>
      )}
      {saveStatus.value === "success" && (
        <div class="alert alert-success">Plant data saved successfully!</div>
      )}
      {saveStatus.value === "error" && (
        <div class="alert alert-error">{errorMessage.value || "An error occurred"}</div>
      )}

      <div role="tablist" class="tabs tabs-lifted">
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="Basic Info" checked={activeTab.value === "basic"} onChange={() => (activeTab.value = "basic")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><BasicInfoForm plant={plant} /></div>
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="Details" checked={activeTab.value === "details"} onChange={() => (activeTab.value = "details")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><DetailsForm plant={plant} /></div>
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="Properties" checked={activeTab.value === "properties"} onChange={() => (activeTab.value = "properties")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><PlantPropertiesForm plant={plant} properties={undefined} /></div>
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="Germination" checked={activeTab.value === "germination"} onChange={() => (activeTab.value = "germination")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><GerminationGuideForm plant={plant} plantGermination={undefined} /></div>
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="Planting Guide" checked={activeTab.value === "planting"} onChange={() => (activeTab.value = "planting")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><PlantingGuideForm plant={plant} /></div>
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="TCM" checked={activeTab.value === "tcm"} onChange={() => (activeTab.value = "tcm")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><TCMPropertiesForm plant={plant} tcmProperties={undefined} /></div>
        <input type="radio" name="plant_tabs" role="tab" class="tab" aria-label="Ayurvedic" checked={activeTab.value === "ayurvedic"} onChange={() => (activeTab.value = "ayurvedic")} />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6"><AyurvedicPropertiesForm plant={plant} ayurvedicProperties={undefined} /></div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn btn-ghost" onClick={onCancel} disabled={saveStatus.value === "saving"}>Cancel</button>
        <button type="submit" class="btn btn-primary" disabled={saveStatus.value === "saving"}>
          {saveStatus.value === "saving" ? (<><span class="loading loading-spinner"></span>Saving...</>) : ("Save Plant")}
        </button>
      </div>
    </form>
  );
}