// Seed Saving Information
export const seedSavingInfo = pgTable("seed_saving_info", {
  infoId: serial("info_id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  seedType: varchar("seed_type", { length: 50 }),
  seedSize: varchar("seed_size", { length: 50 }),
  seedColor: varchar("seed_color", { length: 50 }),
  daysToMaturity: varchar("days_to_maturity", { length: 50 }),
  harvestSeason: varchar("harvest_season", { length: 50 }),
  harvestingInstructions: text("harvesting_instructions"),
  cleaningInstructions: text("cleaning_instructions"),
  dryingInstructions: text("drying_instructions"),
  storageInstructions: text("storage_instructions"),
  storageLifespan: varchar("storage_lifespan", { length: 100 }),
  germinationRequirements: text("germination_requirements"),
  stratificationNeeds: varchar("stratification_needs", { length: 255 }),
  scarificationNeeds: varchar("scarification_needs", { length: 255 }),
  seedViabilityTest: text("seed_viability_test"),
  seedSavingDifficulty: varchar("seed_saving_difficulty", { length: 50 }),
  crossPollinationConcerns: text("cross_pollination_concerns"),
  isolationDistance: varchar("isolation_distance", { length: 100 }),
  seedYield: varchar("seed_yield", { length: 100 }),
  notes: text("notes"),
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
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
  createdAt: timestampTz("created_at"),
  updatedAt: timestampTz("updated_at"),
});

// Relations
export const seedSavingInfoRelations = relations(seedSavingInfo, ({ one }) => ({
  plant: one(plants, { fields: [seedSavingInfo.plantId], references: [plants.id] }),
}));

export const culinaryUsesRelations = relations(culinaryUses, ({ one }) => ({
  plant: one(plants, { fields: [culinaryUses.plantId], references: [plants.id] }),
}));
