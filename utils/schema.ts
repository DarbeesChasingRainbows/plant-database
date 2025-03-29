import { relations, sql } from "drizzle-orm";
import { 
  boolean, 
  date,
  decimal, 
  integer, 
  jsonb,
  pgTable, 
  serial, 
  text, 
  timestamp,
  time,
  varchar,
  unique,
  point,
  customType
} from "drizzle-orm/pg-core";

// Custom PostGIS types
const polygon = customType<{ data: string }>({
  dataType() {
    return "geometry(POLYGON)";
  },
});

const multiLineString = customType<{ data: string }>({
  dataType() {
    return "geometry(MULTILINESTRING)";
  },
});

const multiPolygon = customType<{ data: string }>({
  dataType() {
    return "geometry(MULTIPOLYGON)";
  },
});

// Utility for timestamp with timezone
const timestampTz = (name: string) => 
  timestamp(name, { withTimezone: true }).defaultNow().notNull();

// Core plant table
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  botanicalName: varchar("botanical_name", { length: 255 }).notNull().unique(),
  commonName: varchar("common_name", { length: 255 }).notNull(),
  family: varchar("family", { length: 100 }),
  genus: varchar("genus", { length: 100 }),
  species: varchar("species", { length: 100 }),
  description: text("description"),
  nativeRange: text("native_range"),
  growthHabit: varchar("growth_habit", { length: 100 }),
  lifespan: varchar("lifespan", { length: 50 }),
  hardinessZones: varchar("hardiness_zones", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Plant parts
export const plantParts = pgTable("plant_part", {
  partId: serial("part_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  partName: varchar("part_name", { length: 50 }).notNull(),
  description: text("description"),
  edible: boolean("edible").default(false),
  harvestGuidelines: text("harvest_guidelines"),
  storageRequirements: text("storage_requirements"),
  processingNotes: text("processing_notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (table) => ({
  uniquePlantPart: unique("unique_plant_part").on(table.plantId, table.partName),
}));

// Plant growing properties
export const plantProperties = pgTable("plant_properties", {
  propertyId: serial("property_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  zoneRange: varchar("zone_range", { length: 50 }),
  soilPhRange: varchar("soil_ph_range", { length: 50 }),
  lightRequirements: varchar("light_requirements", { length: 100 }),
  waterRequirements: varchar("water_requirements", { length: 100 }),
  daysToMaturity: integer("days_to_maturity"),
  heightMatureCm: integer("height_mature_cm"),
  spreadMatureCm: integer("spread_mature_cm"),
  soilTypePreferences: text("soil_type_preferences"),
  cultivationNotes: text("cultivation_notes"),
  pestSusceptibility: text("pest_susceptibility"),
  diseaseSusceptibility: text("disease_susceptibility"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Germination guide
export const plantGerminationGuide = pgTable("plant_germination_guide", {
  guideId: serial("guide_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  zoneRange: varchar("zone_range", { length: 50 }),
  soilTempMinC: decimal("soil_temp_min_c", { precision: 4, scale: 1 }),
  soilTempMaxC: decimal("soil_temp_max_c", { precision: 4, scale: 1 }),
  daysToGerminationMin: integer("days_to_germination_min"),
  daysToGerminationMax: integer("days_to_germination_max"),
  plantingDepthCm: decimal("planting_depth_cm", { precision: 4, scale: 1 }),
  lightRequirement: varchar("light_requirement", { length: 50 }),
  springStartWeek: integer("spring_start_week"),
  springEndWeek: integer("spring_end_week"),
  fallStartWeek: integer("fall_start_week"),
  fallEndWeek: integer("fall_end_week"),
  indoorSowingWeeksBeforeFrost: integer("indoor_sowing_weeks_before_frost"),
  stratificationRequired: boolean("stratification_required").default(false),
  stratificationInstructions: text("stratification_instructions"),
  scarificationRequired: boolean("scarification_required").default(false),
  scarificationInstructions: text("scarification_instructions"),
  specialRequirements: text("special_requirements"),
  germinationNotes: text("germination_notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (table) => ({
  uniquePlantZone: unique("unique_plant_zone").on(table.plantId, table.zoneRange),
}));

// Planting guide
export const plantingGuide = pgTable("planting_guide", {
  guideId: serial("guide_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  springPlantingStart: date("spring_planting_start"),
  springPlantingEnd: date("spring_planting_end"),
  fallPlantingStart: date("fall_planting_start"),
  fallPlantingEnd: date("fall_planting_end"),
  indoorSowingStart: date("indoor_sowing_start"),
  transplantReadyWeeks: integer("transplant_ready_weeks"),
  directSowAfterFrost: boolean("direct_sow_after_frost").default(false),
  frostTolerance: varchar("frost_tolerance", { length: 50 }),
  heatTolerance: varchar("heat_tolerance", { length: 50 }),
  successionPlantingInterval: integer("succession_planting_interval"),
  companionPlants: text("companion_plants").array(),
  incompatiblePlants: text("incompatible_plants").array(),
  rotationGroup: varchar("rotation_group", { length: 50 }),
  rotationInterval: integer("rotation_interval"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Companion Planting
export const companionGroups = pgTable("companion_groups", {
  groupId: serial("group_id").primaryKey(),
  groupName: varchar("group_name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const companionRelationshipTypes = pgTable("companion_relationship_types", {
  relationshipTypeId: serial("relationship_type_id").primaryKey(),
  typeName: varchar("type_name", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const companionGroupPlant = pgTable("companion_group_plant", {
  companionGroupPlantId: serial("companion_group_plant_id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => companionGroups.groupId, { onDelete: "cascade" }),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  relationshipTypeId: integer("relationship_type_id").references(() => companionRelationshipTypes.relationshipTypeId, { onDelete: "set null" }),
  benefits: text("benefits"),
  cautions: text("cautions"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (_table) => ({
  uniqueRelation: unique().on(_table.groupId, _table.plantId, _table.relationshipTypeId),
}));

// Medicinal Properties
export const herbalActions = pgTable("herbal_action", {
  actionId: serial("action_id").primaryKey(),
  actionName: varchar("action_name", { length: 100 }).notNull().unique(),
  description: text("description"),
  scientificBasis: text("scientific_basis"),
  historicalContext: text("historical_context"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantActions = pgTable("plant_actions", {
  plantActionId: serial("plant_action_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  actionId: integer("action_id").references(() => herbalActions.actionId),
  partId: integer("part_id").references(() => plantParts.partId),
  specificNotes: text("specific_notes"),
  strengthRating: integer("strength_rating"),
  researchReferences: text("research_references"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (_table) => ({
  uniquePlantActionPart: unique().on(_table.plantId, _table.actionId, _table.partId),
  strengthRatingCheck: sql`CHECK (strength_rating BETWEEN 1 AND 10)`,
}));

export const medicinalProperties = pgTable("medicinal_properties", {
  medPropId: serial("med_prop_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  drugInteractions: text("drug_interactions"),
  traditionalUses: text("traditional_uses"),
  safetyNotes: text("safety_notes"),
  preparationMethods: text("preparation_methods"),
  dosageGuidelines: text("dosage_guidelines"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Plant Recipes
export const plantRecipes = pgTable("plant_recipes", {
  recipeId: serial("recipe_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  recipeName: varchar("recipe_name", { length: 255 }).notNull(),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  preparationTime: integer("preparation_time"),
  difficultyLevel: varchar("difficulty_level", { length: 50 }),
  yield: varchar("yield", { length: 100 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Seed Saving Information
export const seedSavingInfo = pgTable("seed_saving_info", {
  infoId: serial("info_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  pollinationType: varchar("pollination_type", { length: 100 }),
  lifeCycle: varchar("life_cycle", { length: 50 }),
  isolationDistanceM: integer("isolation_distance_m"),
  seedViabilityYears: integer("seed_viability_years"),
  seedCollectionMethod: text("seed_collection_method"),
  seedCleaningMethod: text("seed_cleaning_method"),
  seedStorageConditions: text("seed_storage_conditions"),
  seedsPerGram: integer("seeds_per_gram"),
  germinationTestMethod: text("germination_test_method"),
  seedTreatmentBeforeStorage: text("seed_treatment_before_storage"),
  minimumPopulationSize: integer("minimum_population_size"),
  timeToSeedMaturityDays: integer("time_to_seed_maturity_days"),
  seedSavingNotes: text("seed_saving_notes"),
  createdAt: timestampTz("created_at").defaultNow(),
  updatedAt: timestampTz("updated_at").defaultNow(),
});

// Culinary Uses
export const culinaryUses = pgTable("culinary_uses", {
  useId: serial("use_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  edibleParts: text("edible_parts").array(),
  flavorProfile: varchar("flavor_profile", { length: 255 }),
  culinaryCategory: varchar("culinary_category", { length: 100 }),
  preparationMethods: text("preparation_methods"),
  commonDishes: text("common_dishes"),
  cuisines: text("cuisines").array(),
  harvestingSeason: varchar("harvesting_season", { length: 100 }),
  nutritionalInfo: text("nutritional_info"),
  substitutions: text("substitutions"),
  pairsWith: text("pairs_with").array(),
  storageMethod: varchar("storage_method", { length: 100 }),
  preservationMethods: text("preservation_methods"),
  specialConsiderations: text("special_considerations"),
  notes: text("notes"),
  createdAt: timestampTz("created_at").defaultNow(),
  updatedAt: timestampTz("updated_at").defaultNow(),
});

// Nutritional Information
export const nutrients = pgTable("nutrient", {
  nutrientId: serial("nutrient_id").primaryKey(),
  nutrientName: varchar("nutrient_name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }),
  unitOfMeasure: varchar("unit_of_measure", { length: 20 }),
  rdaValue: varchar("rda_value", { length: 50 }),
  description: text("description"),
  healthBenefits: text("health_benefits"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantNutrientContent = pgTable("plant_nutrient_content", {
  contentId: serial("content_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  partId: integer("part_id").references(() => plantParts.partId),
  nutrientId: integer("nutrient_id").references(() => nutrients.nutrientId),
  amountPer100g: decimal("amount_per_100g", { precision: 10, scale: 2 }),
  analysisMethod: text("analysis_method"),
  analysisDate: date("analysis_date"),
  preparationState: varchar("preparation_state", { length: 50 }),
  notes: text("notes"),
  sourceReference: text("source_reference"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (table) => ({
  uniqueNutrientContent: unique().on(table.plantId, table.partId, table.nutrientId, table.preparationState),
}));

// Constituent Management
export const constituentTypes = pgTable("constituent_types", {
  typeId: serial("type_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantConstituents = pgTable("plant_constituents", {
  constituentId: serial("constituent_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  typeId: integer("type_id").references(() => constituentTypes.typeId),
  name: varchar("name", { length: 255 }),
  percentage: decimal("percentage", { precision: 10, scale: 4 }),
  concentrationRange: varchar("concentration_range", { length: 100 }),
  notes: text("notes"),
  sourceReference: text("source_reference"),
  partId: integer("part_id").references(() => plantParts.partId),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Dosage Management
export const dosageForms = pgTable("dosage_forms", {
  formId: serial("form_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const dosageRoutes = pgTable("dosage_routes", {
  routeId: serial("route_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantDosages = pgTable("plant_dosages", {
  dosageId: serial("dosage_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  formId: integer("form_id").references(() => dosageForms.formId),
  routeId: integer("route_id").references(() => dosageRoutes.routeId),
  partId: integer("part_id").references(() => plantParts.partId),
  minDosage: decimal("min_dosage", { precision: 10, scale: 4 }),
  maxDosage: decimal("max_dosage", { precision: 10, scale: 4 }),
  dosageUnit: varchar("dosage_unit", { length: 50 }),
  frequency: varchar("frequency", { length: 100 }),
  maxFrequency: varchar("max_frequency", { length: 100 }),
  concentrationPercentage: decimal("concentration_percentage", { precision: 10, scale: 4 }),
  indication: text("indication"),
  contraindications: text("contraindications"),
  sourceReference: text("source_reference"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Pharmacological Studies
export const studyMethods = pgTable("study_methods", {
  methodId: serial("method_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const studyConditions = pgTable("study_conditions", {
  conditionId: serial("condition_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const pharmacologicalActionTypes = pgTable("pharmacological_action_types", {
  typeId: serial("type_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const pharmacologicalActions = pgTable("pharmacological_actions", {
  actionId: serial("action_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  typeId: integer("type_id").references(() => pharmacologicalActionTypes.typeId),
  summary: text("summary"),
  clinicalEvidence: text("clinical_evidence"),
  preclinicalEvidence: text("preclinical_evidence"),
  safetyNotes: text("safety_notes"),
  mechanismOfAction: text("mechanism_of_action"),
  pharmacokinetics: text("pharmacokinetics"),
  researchStatus: varchar("research_status", { length: 50 }),
  evidenceLevel: varchar("evidence_level", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const pharmacologicalStudies = pgTable("pharmacological_studies", {
  studyId: serial("study_id").primaryKey(),
  actionId: integer("action_id").references(() => pharmacologicalActions.actionId, { onDelete: "cascade" }),
  methodId: integer("method_id").references(() => studyMethods.methodId),
  conditionId: integer("condition_id").references(() => studyConditions.conditionId),
  constituentId: integer("constituent_id").references(() => plantConstituents.constituentId),
  title: text("title").notNull(),
  methodology: text("methodology"),
  studyDesign: text("study_design"),
  controlType: varchar("control_type", { length: 100 }),
  sampleSize: integer("sample_size"),
  dosage: text("dosage"),
  duration: varchar("duration", { length: 100 }),
  results: text("results"),
  significance: text("significance"),
  statisticalMethod: varchar("statistical_method", { length: 255 }),
  pValue: varchar("p_value", { length: 50 }),
  confidenceInterval: varchar("confidence_interval", { length: 100 }),
  concentrationAmount: decimal("concentration_amount", { precision: 10, scale: 4 }),
  concentrationUnit: varchar("concentration_unit", { length: 50 }),
  studyModel: varchar("study_model", { length: 255 }),
  referenceSource: varchar("reference_source", { length: 50 }),
  publicationDoi: varchar("publication_doi", { length: 255 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Dictionary and Contraindications
export const dictionaryTerms = pgTable("dictionary_terms", {
  termId: serial("term_id").primaryKey(),
  term: varchar("term", { length: 255 }).notNull().unique(),
  pronunciation: varchar("pronunciation", { length: 255 }),
  definition: text("definition").notNull(),
  etymology: text("etymology"),
  notes: text("notes"),
  termType: varchar("term_type", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const termLinks = pgTable("term_links", {
  linkId: serial("link_id").primaryKey(),
  termId: integer("term_id").notNull().references(() => dictionaryTerms.termId, { onDelete: "cascade" }),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: integer("entity_id").notNull(),
  context: text("context"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (table) => ({
  uniqueTermLink: unique().on(table.termId, table.entityType, table.entityId),
}));

export const contraindicationTypes = pgTable("contraindication_types", {
  typeId: serial("type_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantContraindications = pgTable("plant_contraindications", {
  contraindicationId: serial("contraindication_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  typeId: integer("type_id").references(() => contraindicationTypes.typeId),
  description: text("description").notNull(),
  warningLevel: varchar("warning_level", { length: 50 }),
  affectedPopulations: text("affected_populations").array(),
  evidenceLevel: varchar("evidence_level", { length: 50 }),
  referenceSource: text("reference_source"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Food and Herbal Uses
export const foodCategories = pgTable("food_categories", {
  categoryId: serial("category_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  regulatoryNotes: text("regulatory_notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const foodUses = pgTable("food_uses", {
  foodUseId: serial("food_use_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => foodCategories.categoryId),
  isFoodCrop: boolean("is_food_crop").default(false),
  isFlavoring: boolean("is_flavoring").default(false),
  regulatoryStatus: text("regulatory_status"),
  preparationMethods: text("preparation_methods").array(),
  nutritionalNotes: text("nutritional_notes"),
  safetyLimitations: text("safety_limitations"),
  historicalUse: text("historical_use"),
  culinaryUses: text("culinary_uses"),
  storageHandling: text("storage_handling"),
  seasonalAvailability: text("seasonal_availability").array(),
  referenceSource: text("reference_source"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const herbalCategories = pgTable("herbal_categories", {
  categoryId: serial("category_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  traditionalSystem: varchar("traditional_system", { length: 100 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const herbalUses = pgTable("herbal_uses", {
  herbalUseId: serial("herbal_use_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => herbalCategories.categoryId),
  traditionalUses: text("traditional_uses").array(),
  preparationMethods: text("preparation_methods").array(),
  administrationRoutes: text("administration_routes").array(),
  historicalContext: text("historical_context"),
  effectivenessNotes: text("effectiveness_notes"),
  modernApplications: text("modern_applications"),
  referenceSource: text("reference_source"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Side Effects and Toxicity
export const sideEffectTypes = pgTable("side_effect_types", {
  typeId: serial("type_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  systemAffected: varchar("system_affected", { length: 100 }),
  severityScale: varchar("severity_scale", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const sideEffects = pgTable("side_effects", {
  effectId: serial("effect_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  typeId: integer("type_id").references(() => sideEffectTypes.typeId),
  description: text("description").notNull(),
  onsetPattern: varchar("onset_pattern", { length: 100 }),
  severity: varchar("severity", { length: 50 }),
  frequency: varchar("frequency", { length: 50 }),
  reversibility: boolean("reversibility"),
  populationAffected: text("population_affected"),
  clinicalNotes: text("clinical_notes"),
  referenceSource: text("reference_source"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const toxicityTypes = pgTable("toxicity_types", {
  typeId: serial("type_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  measurementMethod: text("measurement_method"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const toxicityStudies = pgTable("toxicity_studies", {
  studyId: serial("study_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  typeId: integer("type_id").references(() => toxicityTypes.typeId),
  studyType: varchar("study_type", { length: 100 }),
  species: varchar("species", { length: 100 }),
  routeOfExposure: varchar("route_of_exposure", { length: 100 }),
  duration: varchar("duration", { length: 100 }),
  dosageAmount: decimal("dosage_amount", { precision: 10, scale: 4 }),
  dosageUnit: varchar("dosage_unit", { length: 50 }),
  studyDesign: text("study_design"),
  outcomes: text("outcomes"),
  ld50Value: decimal("ld50_value", { precision: 10, scale: 4 }),
  ld50Unit: varchar("ld50_unit", { length: 50 }),
  noaelValue: decimal("noael_value", { precision: 10, scale: 4 }),
  noaelUnit: varchar("noael_unit", { length: 50 }),
  histologicalFindings: text("histological_findings"),
  regulatoryOutcome: text("regulatory_outcome"),
  referenceSource: text("reference_source"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Cut Flower Management
export const cutFlowerCharacteristics = pgTable("cut_flower_characteristics", {
  characteristicId: serial("characteristic_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  stemLengthMin: decimal("stem_length_min", { precision: 5, scale: 2 }),
  stemLengthMax: decimal("stem_length_max", { precision: 5, scale: 2 }),
  stemStrength: varchar("stem_strength", { length: 50 }),
  flowerForm: varchar("flower_form", { length: 100 }),
  colorVariations: text("color_variations").array(),
  fragranceLevel: varchar("fragrance_level", { length: 50 }),
  seasonalAvailability: text("seasonal_availability").array(),
  harvestStage: text("harvest_stage"),
  ethyleneSensitivity: boolean("ethylene_sensitivity"),
  coldStorageTemp: decimal("cold_storage_temp", { precision: 4, scale: 1 }),
  transportRequirements: text("transport_requirements"),
  typicalVaseLifeDays: integer("typical_vase_life_days"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const cutFlowerTreatments = pgTable("cut_flower_treatments", {
  treatmentId: serial("treatment_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  treatmentType: varchar("treatment_type", { length: 100 }),
  treatmentName: varchar("treatment_name", { length: 255 }),
  chemicalComposition: text("chemical_composition"),
  concentration: varchar("concentration", { length: 100 }),
  applicationMethod: text("application_method"),
  duration: varchar("duration", { length: 100 }),
  effectiveness: text("effectiveness"),
  precautions: text("precautions"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const vaseLifeStudies = pgTable("vase_life_studies", {
  studyId: serial("study_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  studyConditions: text("study_conditions"),
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  relativeHumidity: integer("relative_humidity"),
  lightConditions: text("light_conditions"),
  solutionUsed: text("solution_used"),
  vaseLifeDays: integer("vase_life_days"),
  terminationCriteria: text("termination_criteria"),
  qualityParameters: text("quality_parameters").array(),
  findings: text("findings"),
  referenceSource: text("reference_source"),
  createdAt: timestampTz("created_at"),
});

export const flowerMarketData = pgTable("flower_market_data", {
  marketDataId: serial("market_data_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  marketCategory: varchar("market_category", { length: 100 }),
  typicalPriceRangeMin: decimal("typical_price_range_min", { precision: 10, scale: 2 }),
  typicalPriceRangeMax: decimal("typical_price_range_max", { precision: 10, scale: 2 }),
  priceUnit: varchar("price_unit", { length: 50 }),
  marketSeason: text("market_season").array(),
  peakDemandPeriods: text("peak_demand_periods").array(),
  marketTrends: text("market_trends"),
  commercialGrades: text("commercial_grades").array(),
  packagingRequirements: text("packaging_requirements"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Workers
export const workers = pgTable("workers", {
  workerId: serial("worker_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: varchar("role", { length: 50 }),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  emergencyContact: text("emergency_contact"),
  certifications: text("certifications").array(),
  specialSkills: text("special_skills"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: varchar("status", { length: 20 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Seed Library Management
export const seedLibraries = pgTable("seed_libraries", {
  libraryId: serial("library_id").primaryKey(),
  libraryName: varchar("library_name", { length: 100 }).notNull().unique(),
  description: text("description"),
  policies: text("policies"),
  membershipRequirements: text("membership_requirements"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const seedCollections = pgTable("seed_collections", {
  collectionId: serial("collection_id").primaryKey(),
  libraryId: integer("library_id").references(() => seedLibraries.libraryId),
  plantId: integer("plant_id").references(() => plants.id),
  collectionName: varchar("collection_name", { length: 100 }),
  description: text("description"),
  culturalSignificance: text("cultural_significance"),
  preservationPriority: varchar("preservation_priority", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (table) => ({
  uniqueLibraryCollection: unique().on(table.libraryId, table.collectionName),
}));

export const seedAccessions = pgTable("seed_accessions", {
  accessionId: serial("accession_id").primaryKey(),
  collectionId: integer("collection_id").references(() => seedCollections.collectionId),
  accessionNumber: varchar("accession_number", { length: 50 }).notNull().unique(),
  acquisitionDate: date("acquisition_date"),
  sourceType: varchar("source_type", { length: 50 }),
  sourceDetails: text("source_details"),
  geneticStatus: varchar("genetic_status", { length: 50 }),
  specialCharacteristics: text("special_characteristics"),
  generation: integer("generation"),
  parentAccessionId: integer("parent_accession_id").references(() => seedAccessions.accessionId),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const seedLots = pgTable("seed_lots", {
  lotId: serial("lot_id").primaryKey(),
  accessionId: integer("accession_id").references(() => seedAccessions.accessionId),
  harvestDate: date("harvest_date"),
  quantityGrams: decimal("quantity_grams", { precision: 10, scale: 2 }),
  seedCount: integer("seed_count"),
  initialGerminationRate: decimal("initial_germination_rate", { precision: 5, scale: 2 }),
  storageLocation: varchar("storage_location", { length: 100 }),
  storageConditions: text("storage_conditions"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const germinationTests = pgTable("germination_tests", {
  testId: serial("test_id").primaryKey(),
  lotId: integer("lot_id").references(() => seedLots.lotId),
  testDate: date("test_date").notNull(),
  seedsTested: integer("seeds_tested").notNull(),
  germinatedCount: integer("germinated_count"),
  germinationRate: decimal("germination_rate", { precision: 5, scale: 2 }),
  testDurationDays: integer("test_duration_days"),
  testConditions: text("test_conditions"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const seedLibraryMembers = pgTable("seed_library_members", {
  memberId: serial("member_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  phone: varchar("phone", { length: 20 }),
  joinDate: date("join_date").notNull(),
  membershipType: varchar("membership_type", { length: 50 }),
  growingExperience: text("growing_experience"),
  growingZone: varchar("growing_zone", { length: 20 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const seedDistributions = pgTable("seed_distributions", {
  distributionId: serial("distribution_id").primaryKey(),
  lotId: integer("lot_id").references(() => seedLots.lotId),
  memberId: integer("member_id").references(() => seedLibraryMembers.memberId),
  distributionDate: date("distribution_date").notNull(),
  quantityGrams: decimal("quantity_grams", { precision: 10, scale: 2 }),
  seedCount: integer("seed_count"),
  intendedUse: text("intended_use"),
  growingZone: varchar("growing_zone", { length: 20 }),
  returnAgreement: boolean("return_agreement").default(false),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const seedReturns = pgTable("seed_returns", {
  returnId: serial("return_id").primaryKey(),
  distributionId: integer("distribution_id").references(() => seedDistributions.distributionId),
  returnDate: date("return_date").notNull(),
  quantityGrams: decimal("quantity_grams", { precision: 10, scale: 2 }),
  seedCount: integer("seed_count"),
  growingConditions: text("growing_conditions"),
  selectionMethods: text("selection_methods"),
  weatherConditions: text("weather_conditions"),
  pestDiseaseNotes: text("pest_disease_notes"),
  successRating: integer("success_rating"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
}, (_table) => ({
  successRatingCheck: sql`CHECK (success_rating BETWEEN 1 AND 5)`,
}));

export const isolationDistances = pgTable("isolation_distances", {
  isolationId: serial("isolation_id").primaryKey(),
  plantId: integer("plant_id").references(() => plants.id),
  requiredDistanceMeters: integer("required_distance_meters"),
  isolationMethod: text("isolation_method"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const seedCleaningMethods = pgTable("seed_cleaning_methods", {
  methodId: serial("method_id").primaryKey(),
  plantId: integer("plant_id").references(() => plants.id),
  cleaningMethod: text("cleaning_method"),
  equipmentNeeded: text("equipment_needed"),
  instructions: text("instructions"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const seedStorageConditions = pgTable("seed_storage_conditions", {
  conditionId: serial("condition_id").primaryKey(),
  plantId: integer("plant_id").references(() => plants.id),
  optimalTemperature: decimal("optimal_temperature", { precision: 5, scale: 2 }),
  optimalHumidity: decimal("optimal_humidity", { precision: 5, scale: 2 }),
  storageContainer: text("storage_container"),
  expectedViabilityYears: integer("expected_viability_years"),
  specialRequirements: text("special_requirements"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

// CSA Management
export const csaMembers = pgTable("csa_members", {
  memberId: serial("member_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  joinDate: date("join_date").notNull(),
  status: varchar("status", { length: 20 }).default("active"),
  paymentPreference: varchar("payment_preference", { length: 50 }),
  communicationPreference: varchar("communication_preference", { length: 50 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const csaShareTypes = pgTable("csa_share_types", {
  shareTypeId: serial("share_type_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  frequency: varchar("frequency", { length: 20 }),
  size: varchar("size", { length: 20 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const csaSubscriptions = pgTable("csa_subscriptions", {
  subscriptionId: serial("subscription_id").primaryKey(),
  memberId: integer("member_id").references(() => csaMembers.memberId),
  shareTypeId: integer("share_type_id").references(() => csaShareTypes.shareTypeId),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: varchar("status", { length: 20 }).default("active"),
  pickupLocation: varchar("pickup_location", { length: 100 }),
  pickupDay: varchar("pickup_day", { length: 20 }),
  specialInstructions: text("special_instructions"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const csaMemberPreferences = pgTable("csa_member_preferences", {
  preferenceId: serial("preference_id").primaryKey(),
  memberId: integer("member_id").references(() => csaMembers.memberId),
  plantId: integer("plant_id").references(() => plants.id),
  preferenceType: varchar("preference_type", { length: 20 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const csaDistributionPlans = pgTable("csa_distribution_plans", {
  planId: serial("plan_id").primaryKey(),
  distributionDate: date("distribution_date").notNull(),
  shareTypeId: integer("share_type_id").references(() => csaShareTypes.shareTypeId),
  status: varchar("status", { length: 20 }).default("planned"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const csaPlanItems = pgTable("csa_plan_items", {
  planItemId: serial("plan_item_id").primaryKey(),
  planId: integer("plan_id").references(() => csaDistributionPlans.planId),
  plantId: integer("plant_id").references(() => plants.id),
  quantityPerShare: decimal("quantity_per_share", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 20 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const csaDistributions = pgTable("csa_distributions", {
  distributionId: serial("distribution_id").primaryKey(),
  planId: integer("plan_id").references(() => csaDistributionPlans.planId),
  subscriptionId: integer("subscription_id").references(() => csaSubscriptions.subscriptionId),
  distributionDate: date("distribution_date").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  pickupTime: timestamp("pickup_time", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const csaDistributedItems = pgTable("csa_distributed_items", {
  distributedItemId: serial("distributed_item_id").primaryKey(),
  distributionId: integer("distribution_id").references(() => csaDistributions.distributionId),
  plantId: integer("plant_id").references(() => plants.id),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 20 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

export const csaPayments = pgTable("csa_payments", {
  paymentId: serial("payment_id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => csaSubscriptions.subscriptionId),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  referenceNumber: varchar("reference_number", { length: 100 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

// Plot Management
export const gardenAreas = pgTable("garden_areas", {
  areaId: serial("area_id").primaryKey(),
  areaName: varchar("area_name", { length: 100 }).notNull(),
  description: text("description"),
  totalSizeSqm: decimal("total_size_sqm", { precision: 10, scale: 2 }),
  boundary: polygon("boundary"),
  elevationMeters: decimal("elevation_meters", { precision: 10, scale: 2 }),
  locationDetails: text("location_details"),
  topography: text("topography"),
  microclimateNotes: text("microclimate_notes"),
  waterAccess: text("water_access"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plots = pgTable("plots", {
  plotId: serial("plot_id").primaryKey(),
  areaId: integer("area_id").references(() => gardenAreas.areaId),
  plotCode: varchar("plot_code", { length: 20 }).notNull().unique(),
  sizeSqm: decimal("size_sqm", { precision: 10, scale: 2 }),
  boundary: polygon("boundary"),
  centroid: point("centroid"),
  orientation: varchar("orientation", { length: 50 }),
  sunExposure: text("sun_exposure"),
  irrigationType: text("irrigation_type"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const gardenBeds = pgTable("garden_beds", {
  bedId: serial("bed_id").primaryKey(),
  plotId: integer("plot_id").references(() => plots.plotId, { onDelete: "cascade" }),
  bedName: varchar("bed_name", { length: 100 }).notNull(),
  bedCode: varchar("bed_code", { length: 20 }).notNull().unique(),
  lengthCm: integer("length_cm"),
  widthCm: integer("width_cm"),
  heightCm: integer("height_cm"),
  areaSqm: decimal("area_sqm", { precision: 10, scale: 2 }),
  boundary: polygon("boundary"),
  centroid: point("centroid"),
  soilType: varchar("soil_type", { length: 100 }),
  soilDepthCm: decimal("soil_depth_cm", { precision: 5, scale: 2 }),
  raisedBed: boolean("raised_bed").default(false),
  irrigationType: varchar("irrigation_type", { length: 100 }),
  sunExposure: varchar("sun_exposure", { length: 50 }),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const soilTestLocations = pgTable("soil_test_locations", {
  locationId: serial("location_id").primaryKey(),
  plotId: integer("plot_id").references(() => plots.plotId),
  samplePoint: point("sample_point"),
  description: text("description"),
  createdAt: timestampTz("created_at"),
});

export const soilTests = pgTable("soil_tests", {
  testId: serial("test_id").primaryKey(),
  locationId: integer("location_id").references(() => soilTestLocations.locationId),
  testDate: date("test_date").notNull(),
  phLevel: decimal("ph_level", { precision: 4, scale: 2 }),
  organicMatterPct: decimal("organic_matter_pct", { precision: 5, scale: 2 }),
  nitrogenPpm: decimal("nitrogen_ppm", { precision: 10, scale: 2 }),
  phosphorusPpm: decimal("phosphorus_ppm", { precision: 10, scale: 2 }),
  potassiumPpm: decimal("potassium_ppm", { precision: 10, scale: 2 }),
  calciumPpm: decimal("calcium_ppm", { precision: 10, scale: 2 }),
  magnesiumPpm: decimal("magnesium_ppm", { precision: 10, scale: 2 }),
  sulfurPpm: decimal("sulfur_ppm", { precision: 10, scale: 2 }),
  zincPpm: decimal("zinc_ppm", { precision: 10, scale: 2 }),
  ironPpm: decimal("iron_ppm", { precision: 10, scale: 2 }),
  manganesePpm: decimal("manganese_ppm", { precision: 10, scale: 2 }),
  copperPpm: decimal("copper_ppm", { precision: 10, scale: 2 }),
  boronPpm: decimal("boron_ppm", { precision: 10, scale: 2 }),
  cecMeq: decimal("cec_meq", { precision: 5, scale: 2 }),
  soilTexture: text("soil_texture"),
  notes: text("notes"),
  labName: varchar("lab_name", { length: 100 }),
  labReportReference: text("lab_report_reference"),
  createdAt: timestampTz("created_at"),
});

export const plantingPlans = pgTable("planting_plans", {
  planId: serial("plan_id").primaryKey(),
  plotId: integer("plot_id").references(() => plots.plotId),
  season: varchar("season", { length: 20 }),
  year: integer("year"),
  layout: multiPolygon("layout"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("planned"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantings = pgTable("plantings", {
  plantingId: serial("planting_id").primaryKey(),
  planId: integer("plan_id").references(() => plantingPlans.planId),
  plotId: integer("plot_id").references(() => plots.plotId),
  plantId: integer("plant_id").references(() => plants.id),
  seedLotId: integer("seed_lot_id").references(() => seedLots.lotId),
  plantingDate: date("planting_date").notNull(),
  plantingMethod: varchar("planting_method", { length: 50 }),
  spacingCm: integer("spacing_cm"),
  depthCm: decimal("depth_cm", { precision: 5, scale: 2 }),
  quantityPlanted: integer("quantity_planted"),
  areaSqm: decimal("area_sqm", { precision: 10, scale: 2 }),
  plantingArea: polygon("planting_area"),
  rowLines: multiLineString("row_lines"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const growingObservations = pgTable("growing_observations", {
  observationId: serial("observation_id").primaryKey(),
  plantingId: integer("planting_id").references(() => plantings.plantingId, { onDelete: "cascade" }),
  observationDate: date("observation_date").notNull(),
  observationPoints: text("observation_points"),
  growthStage: varchar("growth_stage", { length: 50 }).notNull(),
  plantHealth: varchar("plant_health", { length: 50 }).notNull(),
  heightCm: decimal("height_cm", { precision: 10, scale: 2 }),
  spreadCm: decimal("spread_cm", { precision: 10, scale: 2 }),
  flowerStatus: varchar("flower_status", { length: 50 }).notNull(),
  fruitStatus: varchar("fruit_status", { length: 50 }).notNull(),
  pestIssues: text("pest_issues"),
  diseaseIssues: text("disease_issues"),
  environmentalStress: text("environmental_stress"),
  photos: text("photos").array(),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const harvests = pgTable("harvests", {
  harvestId: serial("harvest_id").primaryKey(),
  plantingId: integer("planting_id").references(() => plantings.plantingId),
  harvestDate: date("harvest_date").notNull(),
  quantityKg: decimal("quantity_kg", { precision: 10, scale: 2 }),
  quantityUnits: integer("quantity_units"),
  qualityRating: integer("quality_rating"),
  lossKg: decimal("loss_kg", { precision: 10, scale: 2 }),
  lossReason: text("loss_reason"),
  weatherConditions: text("weather_conditions"),
  harvestedBy: integer("harvested_by").references(() => workers.workerId),
  processingNotes: text("processing_notes"),
  storageLocation: text("storage_location"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (_table) => ({
  qualityRatingCheck: sql`CHECK (quality_rating BETWEEN 1 AND 5)`,
}));

// Equipment and Supplies
export const equipment = pgTable("equipment", {
  equipmentId: serial("equipment_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }),
  modelNumber: varchar("model_number", { length: 100 }),
  manufacturer: varchar("manufacturer", { length: 100 }),
  purchaseDate: date("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  warrantyExpiration: date("warranty_expiration"),
  maintenanceSchedule: text("maintenance_schedule"),
  lastMaintenanceDate: date("last_maintenance_date"),
  nextMaintenanceDate: date("next_maintenance_date"),
  status: varchar("status", { length: 50 }),
  storageLocation: varchar("storage_location", { length: 100 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const equipmentMaintenanceLogs = pgTable("equipment_maintenance_logs", {
  logId: serial("log_id").primaryKey(),
  equipmentId: integer("equipment_id").references(() => equipment.equipmentId),
  maintenanceDate: date("maintenance_date").notNull(),
  maintenanceType: varchar("maintenance_type", { length: 50 }),
  performedBy: varchar("performed_by", { length: 100 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  partsReplaced: text("parts_replaced"),
  notes: text("notes"),
  nextMaintenanceDate: date("next_maintenance_date"),
  createdAt: timestampTz("created_at"),
});

export const supplies = pgTable("supplies", {
  supplyId: serial("supply_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }),
  description: text("description"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 20 }),
  reorderPoint: decimal("reorder_point", { precision: 10, scale: 2 }),
  preferredSupplier: text("preferred_supplier"),
  location: varchar("location", { length: 100 }),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  lastOrderedDate: date("last_ordered_date"),
  lastReceivedDate: date("last_received_date"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const supplyTransactions = pgTable("supply_transactions", {
  transactionId: serial("transaction_id").primaryKey(),
  supplyId: integer("supply_id").references(() => supplies.supplyId),
  transactionType: varchar("transaction_type", { length: 20 }),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  transactionDate: date("transaction_date"),
  performedBy: varchar("performed_by", { length: 100 }),
  referenceNumber: varchar("reference_number", { length: 100 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

// Processing
export const preparationMethods = pgTable("preparation_methods", {
  methodId: serial("method_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  equipmentNeeded: text("equipment_needed"),
  safetyPrecautions: text("safety_precautions"),
  standardProcedure: text("standard_procedure"),
  qualityControlSteps: text("quality_control_steps"),
  estimatedTimeMinutes: integer("estimated_time_minutes"),
  difficultyLevel: varchar("difficulty_level", { length: 20 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const processedProducts = pgTable("processed_products", {
  productId: serial("product_id").primaryKey(),
  plantId: integer("plant_id").references(() => plants.id),
  methodId: integer("method_id").references(() => preparationMethods.methodId),
  name: varchar("name", { length: 100 }).notNull(),
  batchNumber: varchar("batch_number", { length: 50 }).unique(),
  productionDate: date("production_date"),
  expirationDate: date("expiration_date"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 20 }),
  ingredients: text("ingredients"),
  processingNotes: text("processing_notes"),
  storageConditions: text("storage_conditions"),
  qualityGrade: varchar("quality_grade", { length: 20 }),
  costOfProduction: decimal("cost_of_production", { precision: 10, scale: 2 }),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const qualityTests = pgTable("quality_tests", {
  testId: serial("test_id").primaryKey(),
  productId: integer("product_id").references(() => processedProducts.productId),
  testDate: date("test_date"),
  testType: varchar("test_type", { length: 50 }),
  testingMethod: text("testing_method"),
  specifications: text("specifications"),
  results: text("results"),
  approved: boolean("approved"),
  approvedBy: varchar("approved_by", { length: 100 }),
  approvalDate: date("approval_date"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Task Management
export const tasks = pgTable("tasks", {
  taskId: serial("task_id").primaryKey(),
  workerId: integer("worker_id").references(() => workers.workerId),
  taskType: varchar("task_type", { length: 50 }),
  priority: varchar("priority", { length: 20 }),
  description: text("description"),
  assignedDate: date("assigned_date"),
  dueDate: date("due_date"),
  completionDate: date("completion_date"),
  estimatedHours: decimal("estimated_hours", { precision: 4, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 4, scale: 2 }),
  status: varchar("status", { length: 20 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const workerSchedules = pgTable("worker_schedules", {
  scheduleId: serial("schedule_id").primaryKey(),
  workerId: integer("worker_id").references(() => workers.workerId),
  date: date("date"),
  startTime: time("start_time"),
  endTime: time("end_time"),
  breakDurationMinutes: integer("break_duration_minutes"),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
});

// Documentation
export const trainingMaterials = pgTable("training_materials", {
  materialId: serial("material_id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  contentType: varchar("content_type", { length: 50 }),
  targetAudience: varchar("target_audience", { length: 50 }),
  difficultyLevel: varchar("difficulty_level", { length: 20 }),
  prerequisites: text("prerequisites"),
  learningObjectives: text("learning_objectives").array(),
  content: text("content"),
  resources: text("resources"),
  createdBy: varchar("created_by", { length: 100 }),
  lastReviewedDate: date("last_reviewed_date"),
  version: varchar("version", { length: 20 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const documentation = pgTable("documentation", {
  docId: serial("doc_id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 50 }),
  tags: text("tags").array(),
  content: text("content"),
  relatedProcesses: text("related_processes").array(),
  attachments: text("attachments").array(),
  author: varchar("author", { length: 100 }),
  reviewFrequency: varchar("review_frequency", { length: 50 }),
  lastReviewedDate: date("last_reviewed_date"),
  nextReviewDate: date("next_review_date"),
  version: varchar("version", { length: 20 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// TCM Properties
export const tcmMeridians = pgTable("tcm_meridians", {
  meridianId: serial("meridian_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  chineseName: varchar("chinese_name", { length: 50 }),
  description: text("description"),
  organSystem: varchar("organ_system", { length: 100 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const tcmTastes = pgTable("tcm_tastes", {
  tasteId: serial("taste_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  chineseName: varchar("chinese_name", { length: 50 }),
  description: text("description"),
  characteristics: text("characteristics"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const tcmActions = pgTable("tcm_actions", {
  actionId: serial("action_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  chineseName: varchar("chinese_name", { length: 50 }),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const tcmPatterns = pgTable("tcm_patterns", {
  patternId: serial("pattern_id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  chineseName: varchar("chinese_name", { length: 50 }),
  description: text("description"),
  symptoms: text("symptoms").array(),
  etiology: text("etiology"),
  treatmentPrinciples: text("treatment_principles"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const tcmTemperatures = pgTable("tcm_temperatures", {
  temperatureId: serial("temperature_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  chineseName: varchar("chinese_name", { length: 50 }),
  description: text("description"),
  characteristics: text("characteristics"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantTcmProperties = pgTable("plant_tcm_properties", {
  propertyId: serial("property_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  chineseName: varchar("chinese_name", { length: 50 }),
  pinyinName: varchar("pinyin_name", { length: 100 }),
  temperatureId: integer("temperature_id").references(() => tcmTemperatures.temperatureId),
  tasteIds: integer("taste_ids").array().notNull(),
  meridianIds: integer("meridian_ids").array().notNull(),
  dosageRange: varchar("dosage_range", { length: 100 }),
  contraindications: text("contraindications"),
  preparationMethods: text("preparation_methods"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantTcmActions = pgTable("plant_tcm_actions", {
  plantActionId: serial("plant_action_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  actionId: integer("action_id").references(() => tcmActions.actionId),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantTcmPatterns = pgTable("plant_tcm_patterns", {
  plantPatternId: serial("plant_pattern_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  patternId: integer("pattern_id").references(() => tcmPatterns.patternId),
  usageNotes: text("usage_notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Ayurvedic Properties
export const ayurvedicDoshas = pgTable("ayurvedic_doshas", {
  doshaId: serial("dosha_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  elements: text("elements").array(),
  qualities: text("qualities").array(),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const ayurvedicRasas = pgTable("ayurvedic_rasas", {
  rasaId: serial("rasa_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  effects: text("effects"),
  doshaEffects: text("dosha_effects"),
  elements: text("elements").array(),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const ayurvedicVirya = pgTable("ayurvedic_virya", {
  viryaId: serial("virya_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  effects: text("effects"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const ayurvedicVipaka = pgTable("ayurvedic_vipaka", {
  vipakaId: serial("vipaka_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  effects: text("effects"),
  relatedTaste: varchar("related_taste", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const ayurvedicGuna = pgTable("ayurvedic_guna", {
  gunaId: serial("guna_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  oppositeQuality: varchar("opposite_quality", { length: 50 }),
  doshaEffects: text("dosha_effects"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const ayurvedicDhatus = pgTable("ayurvedic_dhatus", {
  dhatuId: serial("dhatu_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  formationTime: varchar("formation_time", { length: 50 }),
  relatedDosha: varchar("related_dosha", { length: 50 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const ayurvedicSrotas = pgTable("ayurvedic_srotas", {
  srotaId: serial("srota_id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 50 }),
  description: text("description"),
  relatedElements: text("related_elements").array(),
  relatedOrgans: text("related_organs").array(),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantAyurvedicProperties = pgTable("plant_ayurvedic_properties", {
  propertyId: serial("property_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  sanskritName: varchar("sanskrit_name", { length: 100 }),
  commonAyurvedicName: varchar("common_ayurvedic_name", { length: 100 }),
  rasaIds: integer("rasa_ids").array().notNull(),
  viryaId: integer("virya_id").references(() => ayurvedicVirya.viryaId),
  vipakaId: integer("vipaka_id").references(() => ayurvedicVipaka.vipakaId),
  gunaIds: integer("guna_ids").array().notNull(),
  doshaEffects: jsonb("dosha_effects"),
  dhatuEffects: jsonb("dhatu_effects"),
  srotaEffects: jsonb("srota_effects"),
  prabhava: text("prabhava"),
  dosageForm: text("dosage_form"),
  dosageRange: varchar("dosage_range", { length: 100 }),
  anupana: text("anupana"),
  contraindications: text("contraindications"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantAyurvedicActions = pgTable("plant_ayurvedic_actions", {
  actionId: serial("action_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 100 }),
  description: text("description"),
  traditionalReference: text("traditional_reference"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const plantAyurvedicIndications = pgTable("plant_ayurvedic_indications", {
  indicationId: serial("indication_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  conditionName: varchar("condition_name", { length: 100 }).notNull(),
  sanskritName: varchar("sanskrit_name", { length: 100 }),
  doshaInvolvement: text("dosha_involvement").array(),
  treatmentApproach: text("treatment_approach"),
  supportingFormulations: text("supporting_formulations").array(),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Companion planting - allows multiple plants in a single planting
export const plantingPlants = pgTable("planting_plants", {
  id: serial("id").primaryKey(),
  plantingId: integer("planting_id").references(() => plantings.plantingId, { onDelete: "cascade" }).notNull(),
  plantId: integer("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity"),
  xPosition: decimal("x_position", { precision: 10, scale: 2 }),
  yPosition: decimal("y_position", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
}, (table) => {
  return {
    plantingPlantIdx: unique().on(table.plantingId, table.plantId),
  };
});

// Crop rotation history
export const cropRotations = pgTable("crop_rotations", {
  rotationId: serial("rotation_id").primaryKey(),
  bedId: integer("bed_id").references(() => gardenBeds.bedId, { onDelete: "cascade" }).notNull(),
  season: varchar("season", { length: 50 }),
  year: integer("year").notNull(),
  plantFamilies: text("plant_families").array(),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Western Medicine Properties
export const westernMedicineCategories = pgTable("western_medicine_categories", {
  categoryId: serial("category_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const westernMedicineActions = pgTable("western_medicine_actions", {
  actionId: serial("action_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const westernMedicine = pgTable("western_medicine", {
  propertyId: serial("property_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  activeCompounds: text("active_compounds").array(),
  clinicalApplications: text("clinical_applications"),
  dosageInformation: text("dosage_information"),
  safetyConsiderations: text("safety_considerations"),
  drugInteractions: text("drug_interactions"),
  researchSummary: text("research_summary"),
  categoryIds: integer("category_ids").array(),
  actionIds: integer("action_ids").array(),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

export const westernMedicineRelations = relations(westernMedicine, ({ one }) => ({
  plant: one(plants, { fields: [westernMedicine.plantId], references: [plants.id] }),
}));

export const westernMedicineCategoriesRelations = relations(westernMedicineCategories, ({ many }) => ({
  properties: many(westernMedicine),
}));

export const westernMedicineActionsRelations = relations(westernMedicineActions, ({ many }) => ({
  properties: many(westernMedicine),
}));

// Add relations
export const plantingPlantsRelations = relations(plantingPlants, ({ one }) => ({
  planting: one(plantings, {
    fields: [plantingPlants.plantingId],
    references: [plantings.plantingId],
  }),
  plant: one(plants, {
    fields: [plantingPlants.plantId],
    references: [plants.id],
  }),
}));

export const cropRotationsRelations = relations(cropRotations, ({ one }) => ({
  bed: one(gardenBeds, {
    fields: [cropRotations.bedId],
    references: [gardenBeds.bedId],
  }),
}));

// Merged plantingsRelations to avoid redeclaration
export const plantingsRelations = relations(plantings, ({ one, many }) => ({
  plantingPlants: many(plantingPlants),
  plan: one(plantingPlans, { fields: [plantings.planId], references: [plantingPlans.planId] }),
  plot: one(plots, { fields: [plantings.plotId], references: [plots.plotId] }),
  plant: one(plants, { fields: [plantings.plantId], references: [plants.id] }),
  seedLot: one(seedLots, { fields: [plantings.seedLotId], references: [seedLots.lotId] }),
  observations: many(growingObservations),
  harvests: many(harvests),
}));

export const plantsRelations = relations(plants, ({ many }) => ({
  parts: many(plantParts),
  properties: many(plantProperties),
  germinationGuides: many(plantGerminationGuide),
  plantingGuides: many(plantingGuide),
  companionPlants: many(companionGroupPlant),
  actions: many(plantActions),
  medicinalProperties: many(medicinalProperties),
  nutrientContent: many(plantNutrientContent),
  constituents: many(plantConstituents),
  dosages: many(plantDosages),
  pharmacologicalActions: many(pharmacologicalActions),
  contraindications: many(plantContraindications),
  foodUses: many(foodUses),
  herbalUses: many(herbalUses),
  sideEffects: many(sideEffects),
  toxicityStudies: many(toxicityStudies),
  cutFlowerCharacteristics: many(cutFlowerCharacteristics),
  cutFlowerTreatments: many(cutFlowerTreatments),
  vaseLifeStudies: many(vaseLifeStudies),
  flowerMarketData: many(flowerMarketData),
  plantings: many(plantings),
  seedCollections: many(seedCollections),
  isolationDistances: many(isolationDistances),
  seedCleaningMethods: many(seedCleaningMethods),
  seedStorageConditions: many(seedStorageConditions),
  csaMemberPreferences: many(csaMemberPreferences),
  processedProducts: many(processedProducts),
  tcmProperties: many(plantTcmProperties),
  tcmActions: many(plantTcmActions),
  tcmPatterns: many(plantTcmPatterns),
  ayurvedicProperties: many(plantAyurvedicProperties),
  ayurvedicActions: many(plantAyurvedicActions),
  ayurvedicIndications: many(plantAyurvedicIndications),
  seedSavingInfo: many(seedSavingInfo),
  culinaryUses: many(culinaryUses),
}));

export const plantPartsRelations = relations(plantParts, ({ one, many }) => ({
  plant: one(plants, { fields: [plantParts.plantId], references: [plants.id] }),
  actions: many(plantActions),
  nutrientContent: many(plantNutrientContent),
  constituents: many(plantConstituents),
  dosages: many(plantDosages),
}));

export const plantPropertiesRelations = relations(plantProperties, ({ one }) => ({
  plant: one(plants, { fields: [plantProperties.plantId], references: [plants.id] }),
}));

export const plantGerminationGuideRelations = relations(plantGerminationGuide, ({ one }) => ({
  plant: one(plants, { fields: [plantGerminationGuide.plantId], references: [plants.id] }),
}));

export const plantingGuideRelations = relations(plantingGuide, ({ one }) => ({
  plant: one(plants, { fields: [plantingGuide.plantId], references: [plants.id] }),
}));

export const companionGroupsRelations = relations(companionGroups, ({ many }) => ({
  plants: many(companionGroupPlant),
}));

export const companionRelationshipTypesRelations = relations(companionRelationshipTypes, ({ many }) => ({
  companionPlants: many(companionGroupPlant),
}));

export const companionGroupPlantRelations = relations(companionGroupPlant, ({ one }) => ({
  group: one(companionGroups, { fields: [companionGroupPlant.groupId], references: [companionGroups.groupId] }),
  plant: one(plants, { fields: [companionGroupPlant.plantId], references: [plants.id] }),
  relationshipType: one(companionRelationshipTypes, { fields: [companionGroupPlant.relationshipTypeId], references: [companionRelationshipTypes.relationshipTypeId] }),
}));

export const herbalActionsRelations = relations(herbalActions, ({ many }) => ({
  plantActions: many(plantActions),
}));

export const plantActionsRelations = relations(plantActions, ({ one }) => ({
  plant: one(plants, { fields: [plantActions.plantId], references: [plants.id] }),
  action: one(herbalActions, { fields: [plantActions.actionId], references: [herbalActions.actionId] }),
  part: one(plantParts, { fields: [plantActions.partId], references: [plantParts.partId] }),
}));

export const medicinalPropertiesRelations = relations(medicinalProperties, ({ one }) => ({
  plant: one(plants, { fields: [medicinalProperties.plantId], references: [plants.id] }),
}));

export const nutrientsRelations = relations(nutrients, ({ many }) => ({
  plantNutrientContent: many(plantNutrientContent),
}));

export const plantNutrientContentRelations = relations(plantNutrientContent, ({ one }) => ({
  plant: one(plants, { fields: [plantNutrientContent.plantId], references: [plants.id] }),
  part: one(plantParts, { fields: [plantNutrientContent.partId], references: [plantParts.partId] }),
  nutrient: one(nutrients, { fields: [plantNutrientContent.nutrientId], references: [nutrients.nutrientId] }),
}));

export const constituentTypesRelations = relations(constituentTypes, ({ many }) => ({
  constituents: many(plantConstituents),
}));

// Continuing from plantConstituentsRelations
export const plantConstituentsRelations = relations(plantConstituents, ({ one, many }) => ({
  plant: one(plants, { fields: [plantConstituents.plantId], references: [plants.id] }),
  type: one(constituentTypes, { fields: [plantConstituents.typeId], references: [constituentTypes.typeId] }),
  part: one(plantParts, { fields: [plantConstituents.partId], references: [plantParts.partId] }),
  studies: many(pharmacologicalStudies),
}));

export const dosageFormsRelations = relations(dosageForms, ({ many }) => ({
  dosages: many(plantDosages),
}));

export const dosageRoutesRelations = relations(dosageRoutes, ({ many }) => ({
  dosages: many(plantDosages),
}));

export const plantDosagesRelations = relations(plantDosages, ({ one }) => ({
  plant: one(plants, { fields: [plantDosages.plantId], references: [plants.id] }),
  form: one(dosageForms, { fields: [plantDosages.formId], references: [dosageForms.formId] }),
  route: one(dosageRoutes, { fields: [plantDosages.routeId], references: [dosageRoutes.routeId] }),
  part: one(plantParts, { fields: [plantDosages.partId], references: [plantParts.partId] }),
}));

export const studyMethodsRelations = relations(studyMethods, ({ many }) => ({
  studies: many(pharmacologicalStudies),
}));

export const studyConditionsRelations = relations(studyConditions, ({ many }) => ({
  studies: many(pharmacologicalStudies),
}));

export const pharmacologicalActionTypesRelations = relations(pharmacologicalActionTypes, ({ many }) => ({
  actions: many(pharmacologicalActions),
}));

export const pharmacologicalActionsRelations = relations(pharmacologicalActions, ({ one, many }) => ({
  plant: one(plants, { fields: [pharmacologicalActions.plantId], references: [plants.id] }),
  type: one(pharmacologicalActionTypes, { fields: [pharmacologicalActions.typeId], references: [pharmacologicalActionTypes.typeId] }),
  studies: many(pharmacologicalStudies),
}));

export const pharmacologicalStudiesRelations = relations(pharmacologicalStudies, ({ one }) => ({
  action: one(pharmacologicalActions, { fields: [pharmacologicalStudies.actionId], references: [pharmacologicalActions.actionId] }),
  method: one(studyMethods, { fields: [pharmacologicalStudies.methodId], references: [studyMethods.methodId] }),
  condition: one(studyConditions, { fields: [pharmacologicalStudies.conditionId], references: [studyConditions.conditionId] }),
  constituent: one(plantConstituents, { fields: [pharmacologicalStudies.constituentId], references: [plantConstituents.constituentId] }),
}));

export const dictionaryTermsRelations = relations(dictionaryTerms, ({ many }) => ({
  links: many(termLinks),
}));

export const termLinksRelations = relations(termLinks, ({ one }) => ({
  term: one(dictionaryTerms, { fields: [termLinks.termId], references: [dictionaryTerms.termId] }),
}));

export const contraindicationTypesRelations = relations(contraindicationTypes, ({ many }) => ({
  contraindications: many(plantContraindications),
}));

export const plantContraindicationsRelations = relations(plantContraindications, ({ one }) => ({
  plant: one(plants, { fields: [plantContraindications.plantId], references: [plants.id] }),
  type: one(contraindicationTypes, { fields: [plantContraindications.typeId], references: [contraindicationTypes.typeId] }),
}));

export const foodCategoriesRelations = relations(foodCategories, ({ many }) => ({
  foodUses: many(foodUses),
}));

export const foodUsesRelations = relations(foodUses, ({ one }) => ({
  plant: one(plants, { fields: [foodUses.plantId], references: [plants.id] }),
  category: one(foodCategories, { fields: [foodUses.categoryId], references: [foodCategories.categoryId] }),
}));

export const herbalCategoriesRelations = relations(herbalCategories, ({ many }) => ({
  herbalUses: many(herbalUses),
}));

export const herbalUsesRelations = relations(herbalUses, ({ one }) => ({
  plant: one(plants, { fields: [herbalUses.plantId], references: [plants.id] }),
  category: one(herbalCategories, { fields: [herbalUses.categoryId], references: [herbalCategories.categoryId] }),
}));

export const sideEffectTypesRelations = relations(sideEffectTypes, ({ many }) => ({
  sideEffects: many(sideEffects),
}));

export const sideEffectsRelations = relations(sideEffects, ({ one }) => ({
  plant: one(plants, { fields: [sideEffects.plantId], references: [plants.id] }),
  type: one(sideEffectTypes, { fields: [sideEffects.typeId], references: [sideEffectTypes.typeId] }),
}));

export const toxicityTypesRelations = relations(toxicityTypes, ({ many }) => ({
  studies: many(toxicityStudies),
}));

export const toxicityStudiesRelations = relations(toxicityStudies, ({ one }) => ({
  plant: one(plants, { fields: [toxicityStudies.plantId], references: [plants.id] }),
  type: one(toxicityTypes, { fields: [toxicityStudies.typeId], references: [toxicityTypes.typeId] }),
}));

export const cutFlowerCharacteristicsRelations = relations(cutFlowerCharacteristics, ({ one }) => ({
  plant: one(plants, { fields: [cutFlowerCharacteristics.plantId], references: [plants.id] }),
}));

export const cutFlowerTreatmentsRelations = relations(cutFlowerTreatments, ({ one }) => ({
  plant: one(plants, { fields: [cutFlowerTreatments.plantId], references: [plants.id] }),
}));

export const vaseLifeStudiesRelations = relations(vaseLifeStudies, ({ one }) => ({
  plant: one(plants, { fields: [vaseLifeStudies.plantId], references: [plants.id] }),
}));

export const flowerMarketDataRelations = relations(flowerMarketData, ({ one }) => ({
  plant: one(plants, { fields: [flowerMarketData.plantId], references: [plants.id] }),
}));

export const workersRelations = relations(workers, ({ many }) => ({
  harvests: many(harvests),
  tasks: many(tasks),
  schedules: many(workerSchedules),
}));

export const seedLibrariesRelations = relations(seedLibraries, ({ many }) => ({
  collections: many(seedCollections),
}));

export const seedCollectionsRelations = relations(seedCollections, ({ one, many }) => ({
  library: one(seedLibraries, { fields: [seedCollections.libraryId], references: [seedLibraries.libraryId] }),
  plant: one(plants, { fields: [seedCollections.plantId], references: [plants.id] }),
  accessions: many(seedAccessions),
}));

export const seedAccessionsRelations = relations(seedAccessions, ({ one, many }) => ({
  collection: one(seedCollections, { fields: [seedAccessions.collectionId], references: [seedCollections.collectionId] }),
  parent: one(seedAccessions, { fields: [seedAccessions.parentAccessionId], references: [seedAccessions.accessionId] }),
  lots: many(seedLots),
}));

export const seedLotsRelations = relations(seedLots, ({ one, many }) => ({
  accession: one(seedAccessions, { fields: [seedLots.accessionId], references: [seedAccessions.accessionId] }),
  germinationTests: many(germinationTests),
  distributions: many(seedDistributions),
  plantings: many(plantings),
}));

export const germinationTestsRelations = relations(germinationTests, ({ one }) => ({
  lot: one(seedLots, { fields: [germinationTests.lotId], references: [seedLots.lotId] }),
}));

export const seedLibraryMembersRelations = relations(seedLibraryMembers, ({ many }) => ({
  distributions: many(seedDistributions),
}));

export const seedDistributionsRelations = relations(seedDistributions, ({ one, many }) => ({
  lot: one(seedLots, { fields: [seedDistributions.lotId], references: [seedLots.lotId] }),
  member: one(seedLibraryMembers, { fields: [seedDistributions.memberId], references: [seedLibraryMembers.memberId] }),
  returns: many(seedReturns),
}));

export const seedReturnsRelations = relations(seedReturns, ({ one }) => ({
  distribution: one(seedDistributions, { fields: [seedReturns.distributionId], references: [seedDistributions.distributionId] }),
}));

export const isolationDistancesRelations = relations(isolationDistances, ({ one }) => ({
  plant: one(plants, { fields: [isolationDistances.plantId], references: [plants.id] }),
}));

export const seedCleaningMethodsRelations = relations(seedCleaningMethods, ({ one }) => ({
  plant: one(plants, { fields: [seedCleaningMethods.plantId], references: [plants.id] }),
}));

export const seedStorageConditionsRelations = relations(seedStorageConditions, ({ one }) => ({
  plant: one(plants, { fields: [seedStorageConditions.plantId], references: [plants.id] }),
}));

export const csaMembersRelations = relations(csaMembers, ({ many }) => ({
  subscriptions: many(csaSubscriptions),
  preferences: many(csaMemberPreferences),
}));

export const csaShareTypesRelations = relations(csaShareTypes, ({ many }) => ({
  subscriptions: many(csaSubscriptions),
  distributionPlans: many(csaDistributionPlans),
}));

export const csaSubscriptionsRelations = relations(csaSubscriptions, ({ one, many }) => ({
  member: one(csaMembers, { fields: [csaSubscriptions.memberId], references: [csaMembers.memberId] }),
  shareType: one(csaShareTypes, { fields: [csaSubscriptions.shareTypeId], references: [csaShareTypes.shareTypeId] }),
  distributions: many(csaDistributions),
  payments: many(csaPayments),
}));

export const csaMemberPreferencesRelations = relations(csaMemberPreferences, ({ one }) => ({
  member: one(csaMembers, { fields: [csaMemberPreferences.memberId], references: [csaMembers.memberId] }),
  plant: one(plants, { fields: [csaMemberPreferences.plantId], references: [plants.id] }),
}));

export const csaDistributionPlansRelations = relations(csaDistributionPlans, ({ one, many }) => ({
  shareType: one(csaShareTypes, { fields: [csaDistributionPlans.shareTypeId], references: [csaShareTypes.shareTypeId] }),
  planItems: many(csaPlanItems),
  distributions: many(csaDistributions),
}));

export const csaPlanItemsRelations = relations(csaPlanItems, ({ one }) => ({
  plan: one(csaDistributionPlans, { fields: [csaPlanItems.planId], references: [csaDistributionPlans.planId] }),
  plant: one(plants, { fields: [csaPlanItems.plantId], references: [plants.id] }),
}));

export const csaDistributionsRelations = relations(csaDistributions, ({ one, many }) => ({
  plan: one(csaDistributionPlans, { fields: [csaDistributions.planId], references: [csaDistributionPlans.planId] }),
  subscription: one(csaSubscriptions, { fields: [csaDistributions.subscriptionId], references: [csaSubscriptions.subscriptionId] }),
  distributedItems: many(csaDistributedItems),
}));

export const csaDistributedItemsRelations = relations(csaDistributedItems, ({ one }) => ({
  distribution: one(csaDistributions, { fields: [csaDistributedItems.distributionId], references: [csaDistributions.distributionId] }),
  plant: one(plants, { fields: [csaDistributedItems.plantId], references: [plants.id] }),
}));

export const csaPaymentsRelations = relations(csaPayments, ({ one }) => ({
  subscription: one(csaSubscriptions, { fields: [csaPayments.subscriptionId], references: [csaSubscriptions.subscriptionId] }),
}));

export const gardenAreasRelations = relations(gardenAreas, ({ many }) => ({
  plots: many(plots),
}));

export const plotsRelations = relations(plots, ({ one, many }) => ({
  area: one(gardenAreas, { fields: [plots.areaId], references: [gardenAreas.areaId] }),
  plantings: many(plantings),
  soilTestLocations: many(soilTestLocations),
  plantingPlans: many(plantingPlans),
}));

export const soilTestLocationsRelations = relations(soilTestLocations, ({ one, many }) => ({
  plot: one(plots, { fields: [soilTestLocations.plotId], references: [plots.plotId] }),
  soilTests: many(soilTests),
}));

export const soilTestsRelations = relations(soilTests, ({ one }) => ({
  location: one(soilTestLocations, { fields: [soilTests.locationId], references: [soilTestLocations.locationId] }),
}));

export const plantingPlansRelations = relations(plantingPlans, ({ one, many }) => ({
  plot: one(plots, { fields: [plantingPlans.plotId], references: [plots.plotId] }),
  plantings: many(plantings),
}));

export const growingObservationsRelations = relations(growingObservations, ({ one }) => ({
  planting: one(plantings, { fields: [growingObservations.plantingId], references: [plantings.plantingId] }),
}));

export const harvestsRelations = relations(harvests, ({ one }) => ({
  planting: one(plantings, { fields: [harvests.plantingId], references: [plantings.plantingId] }),
  harvestedBy: one(workers, { fields: [harvests.harvestedBy], references: [workers.workerId] }),
}));

export const equipmentRelations = relations(equipment, ({ many }) => ({
  maintenanceLogs: many(equipmentMaintenanceLogs),
}));

export const equipmentMaintenanceLogsRelations = relations(equipmentMaintenanceLogs, ({ one }) => ({
  equipment: one(equipment, { fields: [equipmentMaintenanceLogs.equipmentId], references: [equipment.equipmentId] }),
}));

export const suppliesRelations = relations(supplies, ({ many }) => ({
  transactions: many(supplyTransactions),
}));

export const supplyTransactionsRelations = relations(supplyTransactions, ({ one }) => ({
  supply: one(supplies, { fields: [supplyTransactions.supplyId], references: [supplies.supplyId] }),
}));

export const preparationMethodsRelations = relations(preparationMethods, ({ many }) => ({
  processedProducts: many(processedProducts),
}));

export const processedProductsRelations = relations(processedProducts, ({ one, many }) => ({
  plant: one(plants, { fields: [processedProducts.plantId], references: [plants.id] }),
  method: one(preparationMethods, { fields: [processedProducts.methodId], references: [preparationMethods.methodId] }),
  qualityTests: many(qualityTests),
}));

export const qualityTestsRelations = relations(qualityTests, ({ one }) => ({
  product: one(processedProducts, { fields: [qualityTests.productId], references: [processedProducts.productId] }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  worker: one(workers, { fields: [tasks.workerId], references: [workers.workerId] }),
}));

export const workerSchedulesRelations = relations(workerSchedules, ({ one }) => ({
  worker: one(workers, { fields: [workerSchedules.workerId], references: [workers.workerId] }),
}));

export const tcmMeridiansRelations = relations(tcmMeridians, ({ many }) => ({
  properties: many(plantTcmProperties),
}));

export const tcmTastesRelations = relations(tcmTastes, ({ many }) => ({
  properties: many(plantTcmProperties),
}));

export const tcmActionsRelations = relations(tcmActions, ({ many }) => ({
  plantActions: many(plantTcmActions),
}));

export const tcmPatternsRelations = relations(tcmPatterns, ({ many }) => ({
  plantPatterns: many(plantTcmPatterns),
}));

export const plantTcmPropertiesRelations = relations(plantTcmProperties, ({ one }) => ({
  plant: one(plants, { fields: [plantTcmProperties.plantId], references: [plants.id] }),
  temperature: one(tcmTemperatures, { fields: [plantTcmProperties.temperatureId], references: [tcmTemperatures.temperatureId] }),
}));

export const plantTcmActionsRelations = relations(plantTcmActions, ({ one }) => ({
  plant: one(plants, { fields: [plantTcmActions.plantId], references: [plants.id] }),
  action: one(tcmActions, { fields: [plantTcmActions.actionId], references: [tcmActions.actionId] }),
}));

export const plantTcmPatternsRelations = relations(plantTcmPatterns, ({ one }) => ({
  plant: one(plants, { fields: [plantTcmPatterns.plantId], references: [plants.id] }),
  pattern: one(tcmPatterns, { fields: [plantTcmPatterns.patternId], references: [tcmPatterns.patternId] }),
}));

export const ayurvedicDoshasRelations = relations(ayurvedicDoshas, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const ayurvedicRasasRelations = relations(ayurvedicRasas, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const ayurvedicViryaRelations = relations(ayurvedicVirya, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const ayurvedicVipakaRelations = relations(ayurvedicVipaka, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const ayurvedicGunaRelations = relations(ayurvedicGuna, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const ayurvedicDhatusRelations = relations(ayurvedicDhatus, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const ayurvedicSrotasRelations = relations(ayurvedicSrotas, ({ many }) => ({
  properties: many(plantAyurvedicProperties),
}));

export const plantAyurvedicPropertiesRelations = relations(plantAyurvedicProperties, ({ one }) => ({
  plant: one(plants, { fields: [plantAyurvedicProperties.plantId], references: [plants.id] }),
  virya: one(ayurvedicVirya, { fields: [plantAyurvedicProperties.viryaId], references: [ayurvedicVirya.viryaId] }),
  vipaka: one(ayurvedicVipaka, { fields: [plantAyurvedicProperties.vipakaId], references: [ayurvedicVipaka.vipakaId] }),
}));

export const plantAyurvedicActionsRelations = relations(plantAyurvedicActions, ({ one }) => ({
  plant: one(plants, { fields: [plantAyurvedicActions.plantId], references: [plants.id] }),
}));

export const plantAyurvedicIndicationsRelations = relations(plantAyurvedicIndications, ({ one }) => ({
  plant: one(plants, { fields: [plantAyurvedicIndications.plantId], references: [plants.id] }),
}));

// Garden beds relations
export const gardenBedsRelations = relations(gardenBeds, ({ one }) => ({
  plot: one(plots, { fields: [gardenBeds.plotId], references: [plots.plotId] }),
}));

// Seed saving info relations
export const seedSavingInfoRelations = relations(seedSavingInfo, ({ one }) => ({
  plant: one(plants, { fields: [seedSavingInfo.plantId], references: [plants.id] }),
}));

// Culinary uses relations
export const culinaryUsesRelations = relations(culinaryUses, ({ one }) => ({
  plant: one(plants, { fields: [culinaryUses.plantId], references: [plants.id] }),
}));

// Type Exports
export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;
export type PlantPart = typeof plantParts.$inferSelect;
export type NewPlantPart = typeof plantParts.$inferInsert;
export type PlantProperty = typeof plantProperties.$inferSelect;
export type NewPlantProperty = typeof plantProperties.$inferInsert;
export type PlantGerminationGuide = typeof plantGerminationGuide.$inferSelect;
export type NewPlantGerminationGuide = typeof plantGerminationGuide.$inferInsert;
export type PlantingGuide = typeof plantingGuide.$inferSelect;
export type NewPlantingGuide = typeof plantingGuide.$inferInsert;
export type CompanionGroup = typeof companionGroups.$inferSelect;
export type NewCompanionGroup = typeof companionGroups.$inferInsert;
export type CompanionRelationshipType = typeof companionRelationshipTypes.$inferSelect;
export type NewCompanionRelationshipType = typeof companionRelationshipTypes.$inferInsert;
export type CompanionGroupPlant = typeof companionGroupPlant.$inferSelect;
export type NewCompanionGroupPlant = typeof companionGroupPlant.$inferInsert;
export type HerbalAction = typeof herbalActions.$inferSelect;
export type NewHerbalAction = typeof herbalActions.$inferInsert;
export type PlantAction = typeof plantActions.$inferSelect;
export type NewPlantAction = typeof plantActions.$inferInsert;
export type MedicinalProperty = typeof medicinalProperties.$inferSelect;
export type NewMedicinalProperty = typeof medicinalProperties.$inferInsert;
export type Nutrient = typeof nutrients.$inferSelect;
export type NewNutrient = typeof nutrients.$inferInsert;
export type PlantNutrientContent = typeof plantNutrientContent.$inferSelect;
export type NewPlantNutrientContent = typeof plantNutrientContent.$inferInsert;
export type ConstituentType = typeof constituentTypes.$inferSelect;
export type NewConstituentType = typeof constituentTypes.$inferInsert;
export type PlantConstituent = typeof plantConstituents.$inferSelect;
export type NewPlantConstituent = typeof plantConstituents.$inferInsert;
export type DosageForm = typeof dosageForms.$inferSelect;
export type NewDosageForm = typeof dosageForms.$inferInsert;
export type DosageRoute = typeof dosageRoutes.$inferSelect;
export type NewDosageRoute = typeof dosageRoutes.$inferInsert;
export type PlantDosage = typeof plantDosages.$inferSelect;
export type NewPlantDosage = typeof plantDosages.$inferInsert;
export type StudyMethod = typeof studyMethods.$inferSelect;
export type NewStudyMethod = typeof studyMethods.$inferInsert;
export type StudyCondition = typeof studyConditions.$inferSelect;
export type NewStudyCondition = typeof studyConditions.$inferInsert;
export type PharmacologicalActionType = typeof pharmacologicalActionTypes.$inferSelect;
export type NewPharmacologicalActionType = typeof pharmacologicalActionTypes.$inferInsert;
export type PharmacologicalAction = typeof pharmacologicalActions.$inferSelect;
export type NewPharmacologicalAction = typeof pharmacologicalActions.$inferInsert;
export type PharmacologicalStudy = typeof pharmacologicalStudies.$inferSelect;
export type NewPharmacologicalStudy = typeof pharmacologicalStudies.$inferInsert;
export type DictionaryTerm = typeof dictionaryTerms.$inferSelect;
export type NewDictionaryTerm = typeof dictionaryTerms.$inferInsert;
export type TermLink = typeof termLinks.$inferSelect;
export type NewTermLink = typeof termLinks.$inferInsert;
export type ContraindicationType = typeof contraindicationTypes.$inferSelect;
export type NewContraindicationType = typeof contraindicationTypes.$inferInsert;
export type PlantContraindication = typeof plantContraindications.$inferSelect;
export type NewPlantContraindication = typeof plantContraindications.$inferInsert;
export type FoodCategory = typeof foodCategories.$inferSelect;
export type NewFoodCategory = typeof foodCategories.$inferInsert;
export type FoodUse = typeof foodUses.$inferSelect;
export type NewFoodUse = typeof foodUses.$inferInsert;
export type HerbalCategory = typeof herbalCategories.$inferSelect;
export type NewHerbalCategory = typeof herbalCategories.$inferInsert;
export type HerbalUse = typeof herbalUses.$inferSelect;
export type NewHerbalUse = typeof herbalUses.$inferInsert;
export type SideEffectType = typeof sideEffectTypes.$inferSelect;
export type NewSideEffectType = typeof sideEffectTypes.$inferInsert;
export type SideEffect = typeof sideEffects.$inferSelect;
export type NewSideEffect = typeof sideEffects.$inferInsert;
export type ToxicityType = typeof toxicityTypes.$inferSelect;
export type NewToxicityType = typeof toxicityTypes.$inferInsert;
export type ToxicityStudy = typeof toxicityStudies.$inferSelect;
export type NewToxicityStudy = typeof toxicityStudies.$inferInsert;
export type CutFlowerCharacteristic = typeof cutFlowerCharacteristics.$inferSelect;
export type NewCutFlowerCharacteristic = typeof cutFlowerCharacteristics.$inferInsert;
export type CutFlowerTreatment = typeof cutFlowerTreatments.$inferSelect;
export type NewCutFlowerTreatment = typeof cutFlowerTreatments.$inferInsert;
export type VaseLifeStudy = typeof vaseLifeStudies.$inferSelect;
export type NewVaseLifeStudy = typeof vaseLifeStudies.$inferInsert;
export type FlowerMarketData = typeof flowerMarketData.$inferSelect;
export type NewFlowerMarketData = typeof flowerMarketData.$inferInsert;
export type Worker = typeof workers.$inferSelect;
export type NewWorker = typeof workers.$inferInsert;
export type SeedLibrary = typeof seedLibraries.$inferSelect;
export type NewSeedLibrary = typeof seedLibraries.$inferInsert;
export type SeedCollection = typeof seedCollections.$inferSelect;
export type NewSeedCollection = typeof seedCollections.$inferInsert;
export type SeedAccession = typeof seedAccessions.$inferSelect;
export type NewSeedAccession = typeof seedAccessions.$inferInsert;
export type SeedLot = typeof seedLots.$inferSelect;
export type NewSeedLot = typeof seedLots.$inferInsert;
export type GerminationTest = typeof germinationTests.$inferSelect;
export type NewGerminationTest = typeof germinationTests.$inferInsert;
export type SeedLibraryMember = typeof seedLibraryMembers.$inferSelect;
export type NewSeedLibraryMember = typeof seedLibraryMembers.$inferInsert;
export type SeedDistribution = typeof seedDistributions.$inferSelect;
export type NewSeedDistribution = typeof seedDistributions.$inferInsert;
export type SeedReturn = typeof seedReturns.$inferSelect;
export type NewSeedReturn = typeof seedReturns.$inferInsert;
export type IsolationDistance = typeof isolationDistances.$inferSelect;
export type NewIsolationDistance = typeof isolationDistances.$inferInsert;
export type SeedCleaningMethod = typeof seedCleaningMethods.$inferSelect;
export type NewSeedCleaningMethod = typeof seedCleaningMethods.$inferInsert;
export type SeedStorageCondition = typeof seedStorageConditions.$inferSelect;
export type NewSeedStorageCondition = typeof seedStorageConditions.$inferInsert;
export type CsaMember = typeof csaMembers.$inferSelect;
export type NewCsaMember = typeof csaMembers.$inferInsert;
export type CsaShareType = typeof csaShareTypes.$inferSelect;
export type NewCsaShareType = typeof csaShareTypes.$inferInsert;
export type CsaSubscription = typeof csaSubscriptions.$inferSelect;
export type NewCsaSubscription = typeof csaSubscriptions.$inferInsert;
export type CsaMemberPreference = typeof csaMemberPreferences.$inferSelect;
export type NewCsaMemberPreference = typeof csaMemberPreferences.$inferInsert;
export type CsaDistributionPlan = typeof csaDistributionPlans.$inferSelect;
export type NewCsaDistributionPlan = typeof csaDistributionPlans.$inferInsert;
export type CsaPlanItem = typeof csaPlanItems.$inferSelect;
export type NewCsaPlanItem = typeof csaPlanItems.$inferInsert;
export type CsaDistribution = typeof csaDistributions.$inferSelect;
export type NewCsaDistribution = typeof csaDistributions.$inferInsert;
export type CsaDistributedItem = typeof csaDistributedItems.$inferSelect;
export type NewCsaDistributedItem = typeof csaDistributedItems.$inferInsert;
export type CsaPayment = typeof csaPayments.$inferSelect;
export type NewCsaPayment = typeof csaPayments.$inferInsert;
export type GardenArea = typeof gardenAreas.$inferSelect;
export type NewGardenArea = typeof gardenAreas.$inferInsert;
export type Plot = typeof plots.$inferSelect;
export type NewPlot = typeof plots.$inferInsert;
export type SoilTestLocation = typeof soilTestLocations.$inferSelect;
export type NewSoilTestLocation = typeof soilTestLocations.$inferInsert;
export type SoilTest = typeof soilTests.$inferSelect;
export type NewSoilTest = typeof soilTests.$inferInsert;
export type PlantingPlan = typeof plantingPlans.$inferSelect;
export type NewPlantingPlan = typeof plantingPlans.$inferInsert;
export type Planting = typeof plantings.$inferSelect;
export type NewPlanting = typeof plantings.$inferInsert;
export type GrowingObservation = typeof growingObservations.$inferSelect;
export type NewGrowingObservation = typeof growingObservations.$inferInsert;
export type Harvest = typeof harvests.$inferSelect;
export type NewHarvest = typeof harvests.$inferInsert;
export type Equipment = typeof equipment.$inferSelect;
export type NewEquipment = typeof equipment.$inferInsert;
export type EquipmentMaintenanceLog = typeof equipmentMaintenanceLogs.$inferSelect;
export type NewEquipmentMaintenanceLog = typeof equipmentMaintenanceLogs.$inferInsert;
export type Supply = typeof supplies.$inferSelect;
export type NewSupply = typeof supplies.$inferInsert;
export type SupplyTransaction = typeof supplyTransactions.$inferSelect;
export type NewSupplyTransaction = typeof supplyTransactions.$inferInsert;
export type PreparationMethod = typeof preparationMethods.$inferSelect;
export type NewPreparationMethod = typeof preparationMethods.$inferInsert;
export type ProcessedProduct = typeof processedProducts.$inferSelect;
export type NewProcessedProduct = typeof processedProducts.$inferInsert;
export type QualityTest = typeof qualityTests.$inferSelect;
export type NewQualityTest = typeof qualityTests.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type WorkerSchedule = typeof workerSchedules.$inferSelect;
export type NewWorkerSchedule = typeof workerSchedules.$inferInsert;
export type TrainingMaterial = typeof trainingMaterials.$inferSelect;
export type NewTrainingMaterial = typeof trainingMaterials.$inferInsert;
export type Documentation = typeof documentation.$inferSelect;
export type NewDocumentation = typeof documentation.$inferInsert;
export type TcmMeridian = typeof tcmMeridians.$inferSelect;
export type NewTcmMeridian = typeof tcmMeridians.$inferInsert;
export type TcmTaste = typeof tcmTastes.$inferSelect;
export type NewTcmTaste = typeof tcmTastes.$inferInsert;
export type TcmAction = typeof tcmActions.$inferSelect;
export type NewTcmAction = typeof tcmActions.$inferInsert;
export type TcmPattern = typeof tcmPatterns.$inferSelect;
export type NewTcmPattern = typeof tcmPatterns.$inferInsert;
export type PlantTcmProperty = typeof plantTcmProperties.$inferSelect;
export type NewPlantTcmProperty = typeof plantTcmProperties.$inferInsert;
export type PlantTcmAction = typeof plantTcmActions.$inferSelect;
export type NewPlantTcmAction = typeof plantTcmActions.$inferInsert;
export type PlantTcmPattern = typeof plantTcmPatterns.$inferSelect;
export type NewPlantTcmPattern = typeof plantTcmPatterns.$inferInsert;
export type AyurvedicDosha = typeof ayurvedicDoshas.$inferSelect;
export type NewAyurvedicDosha = typeof ayurvedicDoshas.$inferInsert;
export type AyurvedicRasa = typeof ayurvedicRasas.$inferSelect;
export type NewAyurvedicRasa = typeof ayurvedicRasas.$inferInsert;
export type AyurvedicVirya = typeof ayurvedicVirya.$inferSelect;
export type NewAyurvedicVirya = typeof ayurvedicVirya.$inferInsert;
export type AyurvedicVipaka = typeof ayurvedicVipaka.$inferSelect;
export type NewAyurvedicVipaka = typeof ayurvedicVipaka.$inferInsert;
export type AyurvedicGuna = typeof ayurvedicGuna.$inferSelect;
export type NewAyurvedicGuna = typeof ayurvedicGuna.$inferInsert;
export type AyurvedicDhatu = typeof ayurvedicDhatus.$inferSelect;
export type NewAyurvedicDhatu = typeof ayurvedicDhatus.$inferInsert;
export type AyurvedicSrota = typeof ayurvedicSrotas.$inferSelect;
export type NewAyurvedicSrota = typeof ayurvedicSrotas.$inferInsert;
export type PlantAyurvedicProperty = typeof plantAyurvedicProperties.$inferSelect;
export type NewPlantAyurvedicProperty = typeof plantAyurvedicProperties.$inferInsert;
export type PlantAyurvedicAction = typeof plantAyurvedicActions.$inferSelect;
export type NewPlantAyurvedicAction = typeof plantAyurvedicActions.$inferInsert;
export type PlantAyurvedicIndication = typeof plantAyurvedicIndications.$inferSelect;
export type NewPlantAyurvedicIndication = typeof plantAyurvedicIndications.$inferInsert;
export type GardenBed = typeof gardenBeds.$inferSelect;
export type NewGardenBed = typeof gardenBeds.$inferInsert;
export type SeedSavingInfoType = typeof seedSavingInfo.$inferSelect;
export type NewSeedSavingInfoType = typeof seedSavingInfo.$inferInsert;
export type CulinaryUse = typeof culinaryUses.$inferSelect;
export type NewCulinaryUse = typeof culinaryUses.$inferInsert;
export type PlantRecipe = typeof plantRecipes.$inferSelect;
export type NewPlantRecipe = typeof plantRecipes.$inferInsert;

export const tcmChannels = pgTable("tcm_channels", {
  channelId: serial("channel_id").primaryKey(),
  name: varchar("name", { length: 50 }),
});
export type TcmChannel = typeof tcmChannels.$inferSelect;

export const tcmFlavors = pgTable("tcm_flavors", {
  flavorId: serial("flavor_id").primaryKey(),
  name: varchar("name", { length: 50 }),
});
export type TcmFlavor = typeof tcmFlavors.$inferSelect;

export const tcmTemperaturesRelations = relations(tcmTemperatures, ({ many }) => ({
  properties: many(plantTcmProperties),
}));
