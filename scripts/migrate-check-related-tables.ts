// Script to check and create any other missing tables
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

// List of tables to check
const tablesToCheck = [
  'plant_properties',
  'plant_germination_guide',
  'plant_part'
];

async function runMigration() {
  console.log("Starting check for missing related tables...");
  
  try {
    // Check which tables exist
    const tablesExistResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN (${tablesToCheck.map((_, i) => `$${i+1}`).join(',')})
    `, tablesToCheck);
    
    const existingTables = tablesExistResult.rows.map(row => row.table_name);
    console.log("Existing tables:", existingTables);
    
    // Create plant_properties table if it doesn't exist
    if (!existingTables.includes('plant_properties')) {
      console.log("Creating plant_properties table...");
      await pool.query(`
        CREATE TABLE plant_properties (
          property_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          zone_range VARCHAR(50),
          soil_ph_range VARCHAR(50),
          light_requirements VARCHAR(100),
          water_requirements VARCHAR(100),
          days_to_maturity INTEGER,
          height_mature_cm INTEGER,
          spread_mature_cm INTEGER,
          soil_type_preferences TEXT,
          cultivation_notes TEXT,
          pest_susceptibility TEXT,
          disease_susceptibility TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX idx_plant_properties_plant_id ON plant_properties(plant_id);
      `);
      console.log("✅ Created plant_properties table successfully");
    } else {
      console.log("plant_properties table already exists, skipping...");
    }
    
    // Create plant_germination_guide table if it doesn't exist
    if (!existingTables.includes('plant_germination_guide')) {
      console.log("Creating plant_germination_guide table...");
      await pool.query(`
        CREATE TABLE plant_germination_guide (
          guide_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          zone_range VARCHAR(50),
          soil_temp_min_c DECIMAL(4,1),
          soil_temp_max_c DECIMAL(4,1),
          days_to_germination_min INTEGER,
          days_to_germination_max INTEGER,
          planting_depth_cm DECIMAL(4,1),
          light_requirement VARCHAR(50),
          spring_start_week INTEGER,
          spring_end_week INTEGER,
          fall_start_week INTEGER,
          fall_end_week INTEGER,
          indoor_sowing_weeks_before_frost INTEGER,
          stratification_required BOOLEAN DEFAULT FALSE,
          stratification_instructions TEXT,
          scarification_required BOOLEAN DEFAULT FALSE,
          scarification_instructions TEXT,
          special_requirements TEXT,
          germination_notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(plant_id, zone_range)
        );
        
        CREATE INDEX idx_plant_germination_guide_plant_id ON plant_germination_guide(plant_id);
      `);
      console.log("✅ Created plant_germination_guide table successfully");
    } else {
      console.log("plant_germination_guide table already exists, skipping...");
    }
    
    // Create plant_part table if it doesn't exist
    if (!existingTables.includes('plant_part')) {
      console.log("Creating plant_part table...");
      await pool.query(`
        CREATE TABLE plant_part (
          part_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          part_name VARCHAR(50) NOT NULL,
          description TEXT,
          edible BOOLEAN DEFAULT FALSE,
          harvest_guidelines TEXT,
          storage_requirements TEXT,
          processing_notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(plant_id, part_name)
        );
        
        CREATE INDEX idx_plant_part_plant_id ON plant_part(plant_id);
      `);
      console.log("✅ Created plant_part table successfully");
    } else {
      console.log("plant_part table already exists, skipping...");
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
