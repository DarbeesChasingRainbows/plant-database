// Script to add planting_guide table to the database
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add planting_guide table...");
  
  try {
    // Check if table already exists
    const tableExistsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'planting_guide'
      );
    `);
    
    const tableExists = tableExistsResult.rows[0].exists;
    
    if (!tableExists) {
      console.log("Creating planting_guide table...");
      await pool.query(`
        CREATE TABLE planting_guide (
          guide_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          spring_planting_start DATE,
          spring_planting_end DATE,
          fall_planting_start DATE,
          fall_planting_end DATE,
          indoor_sowing_start DATE,
          transplant_ready_weeks INTEGER,
          direct_sow_after_frost BOOLEAN DEFAULT FALSE,
          frost_tolerance VARCHAR(50),
          heat_tolerance VARCHAR(50),
          succession_planting_interval INTEGER,
          companion_plants TEXT[],
          incompatible_plants TEXT[],
          rotation_group VARCHAR(50),
          rotation_interval INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX idx_planting_guide_plant_id ON planting_guide(plant_id);
        
        COMMENT ON TABLE planting_guide IS 'Planting guide information for plants';
        COMMENT ON COLUMN planting_guide.guide_id IS 'Primary key for the planting guide';
        COMMENT ON COLUMN planting_guide.plant_id IS 'Reference to the plant this guide is for';
        COMMENT ON COLUMN planting_guide.spring_planting_start IS 'Start date for spring planting';
        COMMENT ON COLUMN planting_guide.spring_planting_end IS 'End date for spring planting';
        COMMENT ON COLUMN planting_guide.fall_planting_start IS 'Start date for fall planting';
        COMMENT ON COLUMN planting_guide.fall_planting_end IS 'End date for fall planting';
        COMMENT ON COLUMN planting_guide.indoor_sowing_start IS 'Date to start indoor sowing';
        COMMENT ON COLUMN planting_guide.transplant_ready_weeks IS 'Weeks until transplant ready';
        COMMENT ON COLUMN planting_guide.direct_sow_after_frost IS 'Whether to direct sow after frost';
        COMMENT ON COLUMN planting_guide.frost_tolerance IS 'Level of frost tolerance';
        COMMENT ON COLUMN planting_guide.heat_tolerance IS 'Level of heat tolerance';
        COMMENT ON COLUMN planting_guide.succession_planting_interval IS 'Interval in days for succession planting';
        COMMENT ON COLUMN planting_guide.companion_plants IS 'Array of companion plants';
        COMMENT ON COLUMN planting_guide.incompatible_plants IS 'Array of incompatible plants';
        COMMENT ON COLUMN planting_guide.rotation_group IS 'Crop rotation group';
        COMMENT ON COLUMN planting_guide.rotation_interval IS 'Years between plantings in same location';
      `);
      console.log("✅ Created planting_guide table successfully");
    } else {
      console.log("planting_guide table already exists, skipping...");
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
