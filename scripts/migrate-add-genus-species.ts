// Script to add genus and species columns to the plants table
import dbConfig from "../utils/db.ts";
import { sql } from "drizzle-orm";

const { db } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add genus and species columns...");
  
  try {
    // Check if columns already exist
    const checkColumnsQuery = sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plants' 
      AND column_name IN ('genus', 'species');
    `;
    
    const existingColumns = await db.execute(checkColumnsQuery);
    const columnNames = existingColumns.rows.map((row: any) => row.column_name);
    
    // Add genus column if it doesn't exist
    if (!columnNames.includes('genus')) {
      console.log("Adding genus column...");
      await db.execute(sql`ALTER TABLE plants ADD COLUMN genus VARCHAR(100);`);
      await db.execute(sql`COMMENT ON COLUMN plants.genus IS 'Taxonomic genus of the plant';`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_plants_genus ON plants(genus);`);
      console.log("✅ Added genus column successfully");
    } else {
      console.log("Genus column already exists, skipping...");
    }
    
    // Add species column if it doesn't exist
    if (!columnNames.includes('species')) {
      console.log("Adding species column...");
      await db.execute(sql`ALTER TABLE plants ADD COLUMN species VARCHAR(100);`);
      await db.execute(sql`COMMENT ON COLUMN plants.species IS 'Taxonomic species of the plant';`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_plants_species ON plants(species);`);
      console.log("✅ Added species column successfully");
    } else {
      console.log("Species column already exists, skipping...");
    }
    
    // Optionally, extract genus and species from botanical_name for existing records
    console.log("Updating existing records with genus and species data...");
    await db.execute(sql`
      UPDATE plants 
      SET 
        genus = SPLIT_PART(botanical_name, ' ', 1),
        species = SPLIT_PART(botanical_name, ' ', 2)
      WHERE 
        genus IS NULL OR species IS NULL;
    `);
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    // Close the database connection
    await dbConfig.pool.end();
  }
}

// Run the migration
runMigration();
