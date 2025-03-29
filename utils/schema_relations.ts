export const seedSavingInfoRelations = relations(seedSavingInfo, ({ one }) => ({
  plant: one(plants, { fields: [seedSavingInfo.plantId], references: [plants.id] }),
}));

export const culinaryUsesRelations = relations(culinaryUses, ({ one }) => ({
  plant: one(plants, { fields: [culinaryUses.plantId], references: [plants.id] }),
}));
