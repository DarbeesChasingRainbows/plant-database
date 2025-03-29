import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Enum for dictionary categories
export const dictionaryCategoryEnum = pgEnum('dictionary_category', [
  'medical', 
  'botanical', 
  'horticultural', 
  'farming', 
  'chemical',
  'general'
]);

// Dictionary terms table
export const dictionaryTerms = pgTable('dictionary_terms', {
  id: serial('id').primaryKey(),
  term: varchar('term', { length: 100 }).notNull(),
  definition: text('definition').notNull(),
  category: dictionaryCategoryEnum('category').notNull(),
  reference: varchar('reference', { length: 255 }),
  url: varchar('url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Related terms (for cross-referencing)
export const relatedTerms = pgTable('related_terms', {
  id: serial('id').primaryKey(),
  termId: integer('term_id').references(() => dictionaryTerms.id).notNull(),
  relatedTermId: integer('related_term_id').references(() => dictionaryTerms.id).notNull(),
  relationshipType: varchar('relationship_type', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Term to plant relationships (for linking terms to specific plants)
export const termPlantRelationships = pgTable('term_plant_relationships', {
  id: serial('id').primaryKey(),
  termId: integer('term_id').references(() => dictionaryTerms.id).notNull(),
  plantId: integer('plant_id').notNull(), // References plants table
  context: text('context'), // Optional context for the relationship
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
