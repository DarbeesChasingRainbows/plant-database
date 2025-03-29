// Script to add missing TCM-related tables to the database
import dbConfig from "../utils/db.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to add missing TCM tables...");
  
  try {
    // Check which tables exist in the database
    const tablesExistResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN (
        'tcm_meridians', 
        'tcm_tastes', 
        'tcm_temperatures', 
        'tcm_actions', 
        'tcm_patterns', 
        'plant_tcm_actions', 
        'plant_tcm_patterns'
      );
    `);
    
    const existingTables = tablesExistResult.rows.map(row => row.table_name);
    console.log(`Found ${existingTables.length} existing TCM tables in database`);
    
    // Create tcm_meridians table if it doesn't exist
    if (!existingTables.includes('tcm_meridians')) {
      console.log("Creating tcm_meridians table...");
      await pool.query(`
        CREATE TABLE tcm_meridians (
          meridian_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ Created tcm_meridians table successfully");
    } else {
      console.log("tcm_meridians table already exists, skipping...");
    }
    
    // Create tcm_tastes table if it doesn't exist
    if (!existingTables.includes('tcm_tastes')) {
      console.log("Creating tcm_tastes table...");
      await pool.query(`
        CREATE TABLE tcm_tastes (
          taste_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ Created tcm_tastes table successfully");
    } else {
      console.log("tcm_tastes table already exists, skipping...");
    }
    
    // Create tcm_temperatures table if it doesn't exist
    if (!existingTables.includes('tcm_temperatures')) {
      console.log("Creating tcm_temperatures table...");
      await pool.query(`
        CREATE TABLE tcm_temperatures (
          temperature_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ Created tcm_temperatures table successfully");
    } else {
      console.log("tcm_temperatures table already exists, skipping...");
    }
    
    // Create tcm_actions table if it doesn't exist
    if (!existingTables.includes('tcm_actions')) {
      console.log("Creating tcm_actions table...");
      await pool.query(`
        CREATE TABLE tcm_actions (
          action_id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ Created tcm_actions table successfully");
    } else {
      console.log("tcm_actions table already exists, skipping...");
    }
    
    // Create tcm_patterns table if it doesn't exist
    if (!existingTables.includes('tcm_patterns')) {
      console.log("Creating tcm_patterns table...");
      await pool.query(`
        CREATE TABLE tcm_patterns (
          pattern_id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ Created tcm_patterns table successfully");
    } else {
      console.log("tcm_patterns table already exists, skipping...");
    }
    
    // Create plant_tcm_actions table if it doesn't exist
    if (!existingTables.includes('plant_tcm_actions')) {
      console.log("Creating plant_tcm_actions table...");
      await pool.query(`
        CREATE TABLE plant_tcm_actions (
          plant_action_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          action_id INTEGER REFERENCES tcm_actions(action_id),
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX idx_plant_tcm_actions_plant_id ON plant_tcm_actions(plant_id);
      `);
      console.log("✅ Created plant_tcm_actions table successfully");
    } else {
      console.log("plant_tcm_actions table already exists, skipping...");
    }
    
    // Create plant_tcm_patterns table if it doesn't exist
    if (!existingTables.includes('plant_tcm_patterns')) {
      console.log("Creating plant_tcm_patterns table...");
      await pool.query(`
        CREATE TABLE plant_tcm_patterns (
          plant_pattern_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          pattern_id INTEGER REFERENCES tcm_patterns(pattern_id),
          usage_notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX idx_plant_tcm_patterns_plant_id ON plant_tcm_patterns(plant_id);
      `);
      console.log("✅ Created plant_tcm_patterns table successfully");
    } else {
      console.log("plant_tcm_patterns table already exists, skipping...");
    }
    
    console.log("Migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the migration
runMigration();
