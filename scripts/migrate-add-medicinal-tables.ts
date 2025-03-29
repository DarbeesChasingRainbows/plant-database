// Script to add TCM and Ayurvedic tables to the database
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add TCM and Ayurvedic tables...");
  
  try {
    // Check which tables exist
    const tablesExistResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('plant_tcm_properties', 'plant_ayurvedic_properties');
    `);
    
    const existingTables = tablesExistResult.rows.map(row => row.table_name);
    console.log("Existing tables:", existingTables);
    
    // Create plant_tcm_properties table if it doesn't exist
    if (!existingTables.includes('plant_tcm_properties')) {
      console.log("Creating plant_tcm_properties table...");
      await pool.query(`
        CREATE TABLE plant_tcm_properties (
          property_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          chinese_name VARCHAR(100),
          pinyin_name VARCHAR(100),
          temperature_id INTEGER,
          dosage_range VARCHAR(100),
          preparation_methods TEXT,
          contraindications TEXT,
          taste_ids INTEGER[],
          meridian_ids INTEGER[],
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX idx_plant_tcm_properties_plant_id ON plant_tcm_properties(plant_id);
      `);
      console.log("✅ Created plant_tcm_properties table successfully");
    } else {
      console.log("plant_tcm_properties table already exists, skipping...");
    }
    
    // Create plant_ayurvedic_properties table if it doesn't exist
    if (!existingTables.includes('plant_ayurvedic_properties')) {
      console.log("Creating plant_ayurvedic_properties table...");
      await pool.query(`
        CREATE TABLE plant_ayurvedic_properties (
          property_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          sanskrit_name VARCHAR(100),
          common_ayurvedic_name VARCHAR(100),
          dosage_form VARCHAR(100),
          dosage_range VARCHAR(100),
          anupana TEXT,
          prabhava TEXT,
          contraindications TEXT,
          rasa_ids INTEGER[],
          virya_id INTEGER,
          guna_ids INTEGER[],
          dosha_effects JSONB,
          dhatu_effects JSONB,
          srota_effects JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX idx_plant_ayurvedic_properties_plant_id ON plant_ayurvedic_properties(plant_id);
      `);
      console.log("✅ Created plant_ayurvedic_properties table successfully");
    } else {
      console.log("plant_ayurvedic_properties table already exists, skipping...");
    }
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the migration
runMigration();
