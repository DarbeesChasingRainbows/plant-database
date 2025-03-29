// Script to add vipaka_id column to plant_ayurvedic_properties table
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add vipaka_id column to plant_ayurvedic_properties table...");
  
  try {
    // Check if the column exists
    const columnExistsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plant_ayurvedic_properties' AND column_name = 'vipaka_id';
    `);
    
    const columnExists = columnExistsResult.rows.length > 0;
    
    if (!columnExists) {
      console.log("Adding vipaka_id column to plant_ayurvedic_properties table...");
      
      // Add the vipaka_id column
      await pool.query(`
        ALTER TABLE plant_ayurvedic_properties
        ADD COLUMN vipaka_id INTEGER REFERENCES ayurvedic_vipaka(vipaka_id);
      `);
      
      console.log("✅ Added vipaka_id column successfully");
    } else {
      console.log("vipaka_id column already exists, skipping...");
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
