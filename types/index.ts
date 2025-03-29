import {
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
} from "npm:geojson-schema";

import {
  Point,
  Polygon,
} from "https://deno.land/x/postgres@v0.19.3/query/types.ts";

import * as Schema from "..//utils/schema.ts";
export type Tables = typeof Schema;

type InferSelect<T> = T extends { $inferSelect: infer S } ? S : never;
type InferInsert<T> = T extends { $inferInsert: infer I } ? I : never;

export type SelectTypes = {
  [K in keyof Tables]: InferSelect<Tables[K]>;
};

export type InsertTypes = {
  [K in keyof Tables]: InferInsert<Tables[K]>;
};

// types/index.ts
// Import CreatePlantInput from PlantRepository.ts only
import { CreatePlantInput as RepoCreatePlantInput } from "../repositories/PlantRepository.ts";

// Rename to avoid conflict if needed, or use directly
export interface ExtendedCreatePlantInput extends RepoCreatePlantInput {
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
    companionPlants?: string;
    incompatiblePlants?: string;
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
    tasteIds?: string;
    meridianIds?: string;
  };
  ayurvedicProperties?: {
    sanskritName?: string;
    commonAyurvedicName?: string;
    dosageForm?: string;
    dosageRange?: string;
    anupana?: string;
    prabhava?: string;
    contraindications?: string;
    rasaIds?: string;
    viryaId?: number;
    vipakaId?: number;
    gunaIds?: string;
    doshaEffects?: string;
    dhatuEffects?: string;
    srotaEffects?: string;
  };
  plantParts?: Array<{
    id?: number;
    partName: string;
    description?: string;
    edible?: boolean;
    harvestGuidelines?: string;
    storageRequirements?: string;
    processingNotes?: string;
    isNew?: boolean;
    isDeleted?: boolean;
  }>;
}

export type CreatePlantInput = {
  common_name: string;
  botanical_name: string;
  family: string;
  description?: string;
  is_medicinal?: boolean;
  is_food?: boolean;
  is_poisonous?: boolean;
  planting_guide?: {
    soil_type?: string;
    sun_exposure?: string;
    watering_frequency?: string;
    planting_season?: string;
  };
  germination_guide?: {
    days_to_germination?: number;
    temperature_range?: string;
    light_requirements?: string;
  };
};

export interface GrowingRecord {
  id?: number; // Optional for new records
  plant_id: number;
  planting_date?: Date;
  planting_method: string;
  quantity_planted: number;
  spacing_cm: number;
  depth_cm: number;
  area_sqm: number;
  notes: string;
  layout: string; // Stored as WKT (Well-Known Text)
  planting_area: string; // Stored as WKT
  row_lines: string; // Stored as WKT
  created_at?: Date;
  updated_at?: Date;
}

export type NewGrowingRecord = Omit<
  GrowingRecord,
  "id" | "created_at" | "updated_at"
>;

export interface GrowingObservation {
  observation_id: number;
  planting_id: number;
  observation_date: Date;
  observation_points: GeometryCollection | null;
  growth_stage: string | null;
  plant_health: string | null;
  height_cm: number | null;
  spread_cm: number | null;
  flower_status: string | null;
  fruit_status: string | null;
  pest_issues: string | null;
  disease_issues: string | null;
  environmental_stress: string | null;
  photos: string[] | null;
  notes: string | null;
  created_at: Date;
}

export type NewGrowingObservation = Omit<
  GrowingObservation,
  "observation_id" | "created_at"
>;

export interface Plant {
  id: number;
  common_name: string;
  botanical_name: string;
  family: string | null;
  genus: string | null;
  species: string | null;
  description: string | null;
  taxonomy: string | null;
  is_medicinal: boolean;
  is_food_crop: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PlantPart {
  id: number;
  plant_id: number;
  part_name: string;
  description: string | null;
  edible: boolean;
  harvest_guidelines: string | null;
  storage_requirements: string | null;
  processing_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MedicinalProperty {
  med_prop_id: number;
  plant_id: number;
  contraindications: string;
  drug_interactions: string;
  traditional_uses: string;
  safety_notes: string;
  preparation_methods: string;
  dosage_guidelines: string;
}

export interface PlantProperty {
  id: number;
  plant_id: number;
  zone_range: string | null;
  soil_ph_range: string | null;
  light_requirements: string | null;
  water_requirements: string | null;
  days_to_maturity: number | null;
  height_mature_cm: number | null;
  spread_mature_cm: number | null;
  soil_type_preferences: string | null;
  cultivation_notes: string | null;
  pest_susceptibility: string | null;
  disease_susceptibility: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PlantGerminationGuide {
  id: number;
  plant_id: number;
  zone_range: string | null;
  soil_temp_min_c: number | null;
  soil_temp_max_c: number | null;
  days_to_germination_min: number | null;
  days_to_germination_max: number | null;
  planting_depth_cm: number | null;
  light_requirement: string | null;
  spring_start_week: number | null;
  spring_end_week: number | null;
  fall_start_week: number | null;
  fall_end_week: number | null;
  indoor_sowing_weeks_before_frost: number | null;
  stratification_required: boolean;
  stratification_instructions: string | null;
  scarification_required: boolean;
  scarification_instructions: string | null;
  special_requirements: string | null;
  germination_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface GeometryCollection {
  type: "GeometryCollection";
  geometries: Array<
    Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon
  >;
}

export interface PlantingGeometry {
  layout: MultiPolygon; // From planting_plans
  planting_area: Polygon; // From plantings
  row_lines: MultiLineString; // From plantings
}

export interface CompanionRelationType {
  relationship_type_id: number;
  type_name: string;
  description: string | null;
  created_at: Date;
}

export interface CompanionGroup {
  group_id: number;
  group_name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CompanionGroupPlant {
  companion_group_plant_id: number;
  group_id: number;
  plant_id: number;
  relationship_type_id: number | null;
  benefits: string | null;
  cautions: string | null;
  created_at: Date;
}
