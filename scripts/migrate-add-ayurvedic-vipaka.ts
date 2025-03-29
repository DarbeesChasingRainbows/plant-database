// Script to add ayurvedic_vipaka table and vipaka_id column to plant_ayurvedic_properties
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add ayurvedic_vipaka table and vipaka_id column...");
  
  try {
    // Check if the ayurvedic_vipaka table exists
    const tableExistsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'ayurvedic_vipaka';
    `);
    
    const tableExists = tableExistsResult.rows.length > 0;
    
    if (!tableExists) {
      console.log("Creating ayurvedic_vipaka table...");
      
      // Create the ayurvedic_vipaka table
      await pool.query(`
        CREATE TABLE ayurvedic_vipaka (
          vipaka_id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          sanskrit_name VARCHAR(100),
          description TEXT,
          properties TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Insert common vipaka types
        INSERT INTO ayurvedic_vipaka (name, sanskrit_name, description)
        VALUES 
          ('Sweet', 'Madhura', 'Post-digestive effect that is nourishing and building'),
          ('Sour', 'Amla', 'Post-digestive effect that is heating and acidic'),
          ('Pungent', 'Katu', 'Post-digestive effect that is depleting and drying');
      `);
      
      console.log("✅ Created ayurvedic_vipaka table successfully");
    } else {
      console.log("ayurvedic_vipaka table already exists, skipping...");
    }
    
    // Check if the vipaka_id column exists in plant_ayurvedic_properties
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
