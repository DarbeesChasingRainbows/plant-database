// Script to add missing columns to the plants table
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add missing columns...");
  
  try {
    // Get existing columns
    const existingColumnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plants'
    `);
    
    const existingColumns = existingColumnsResult.rows.map((row: any) => row.column_name);
    console.log("Existing columns:", existingColumns);
    
    // Add native_range column if it doesn't exist
    if (!existingColumns.includes('native_range')) {
      console.log("Adding native_range column...");
      await pool.query(`
        ALTER TABLE plants ADD COLUMN native_range TEXT;
        COMMENT ON COLUMN plants.native_range IS 'Geographic regions where the plant naturally occurs';
      `);
      console.log("✅ Added native_range column successfully");
    } else {
      console.log("native_range column already exists, skipping...");
    }
    
    // Add growth_habit column if it doesn't exist
    if (!existingColumns.includes('growth_habit')) {
      console.log("Adding growth_habit column...");
      await pool.query(`
        ALTER TABLE plants ADD COLUMN growth_habit VARCHAR(100);
        COMMENT ON COLUMN plants.growth_habit IS 'Growth form of the plant (e.g., tree, shrub, herb, vine)';
      `);
      console.log("✅ Added growth_habit column successfully");
    } else {
      console.log("growth_habit column already exists, skipping...");
    }
    
    // Add lifespan column if it doesn't exist
    if (!existingColumns.includes('lifespan')) {
      console.log("Adding lifespan column...");
      await pool.query(`
        ALTER TABLE plants ADD COLUMN lifespan VARCHAR(50);
        COMMENT ON COLUMN plants.lifespan IS 'Lifespan category of the plant (e.g., annual, biennial, perennial)';
      `);
      console.log("✅ Added lifespan column successfully");
    } else {
      console.log("lifespan column already exists, skipping...");
    }
    
    // Add hardiness_zones column if it doesn't exist
    if (!existingColumns.includes('hardiness_zones')) {
      console.log("Adding hardiness_zones column...");
      await pool.query(`
        ALTER TABLE plants ADD COLUMN hardiness_zones VARCHAR(50);
        COMMENT ON COLUMN plants.hardiness_zones IS 'USDA plant hardiness zones where the plant can survive';
      `);
      console.log("✅ Added hardiness_zones column successfully");
    } else {
      console.log("hardiness_zones column already exists, skipping...");
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
