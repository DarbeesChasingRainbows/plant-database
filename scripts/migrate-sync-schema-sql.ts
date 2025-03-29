// Script to synchronize database schema with schema.ts definitions using SQL
import dbConfig from "../utils/db.ts";

const { pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to synchronize database with schema.ts...");
  
  try {
    // Check for missing columns in the plant_ayurvedic_properties table
    console.log("Checking for vipaka_id column in plant_ayurvedic_properties table...");
    
    const columnExistsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plant_ayurvedic_properties' AND column_name = 'vipaka_id';
    `);
    
    const columnExists = columnExistsResult.rows.length > 0;
    
    if (!columnExists) {
      console.log("Adding vipaka_id column to plant_ayurvedic_properties table...");
      
      // First check if ayurvedic_vipaka table exists
      const tableExistsResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'ayurvedic_vipaka';
      `);
      
      const tableExists = tableExistsResult.rows.length > 0;
      
      if (!tableExists) {
        console.log("Creating ayurvedic_vipaka table first...");
        
        // Create the ayurvedic_vipaka table
        await pool.query(`
          CREATE TABLE ayurvedic_vipaka (
            vipaka_id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            sanskrit_name VARCHAR(100),
            description TEXT,
            effects TEXT,
            related_taste VARCHAR(50),
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
      }
      
      // Add the vipaka_id column
      await pool.query(`
        ALTER TABLE plant_ayurvedic_properties
        ADD COLUMN vipaka_id INTEGER REFERENCES ayurvedic_vipaka(vipaka_id);
      `);
      
      console.log("✅ Added vipaka_id column successfully");
    } else {
      console.log("vipaka_id column already exists, skipping...");
    }
    
    // Check for missing columns in the plants table
    console.log("Checking for missing columns in plants table...");
    
    const requiredColumns = [
      { name: "genus", type: "VARCHAR(100)" },
      { name: "species", type: "VARCHAR(100)" },
      { name: "native_range", type: "TEXT" },
      { name: "growth_habit", type: "VARCHAR(100)" },
      { name: "lifespan", type: "VARCHAR(50)" },
      { name: "hardiness_zones", type: "VARCHAR(50)" }
    ];
    
    for (const column of requiredColumns) {
      const columnExistsResult = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = $1;
      `, [column.name]);
      
      const columnExists = columnExistsResult.rows.length > 0;
      
      if (!columnExists) {
        console.log(`Adding ${column.name} column to plants table...`);
        
        await pool.query(`
          ALTER TABLE plants
          ADD COLUMN ${column.name} ${column.type};
        `);
        
        console.log(`✅ Added ${column.name} column successfully`);
      } else {
        console.log(`${column.name} column already exists, skipping...`);
      }
    }
    
    // Check if planting_guide table exists
    console.log("Checking for planting_guide table...");
    
    const tableExistsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'planting_guide';
    `);
    
    const tableExists = tableExistsResult.rows.length > 0;
    
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
          direct_sow_after_frost BOOLEAN DEFAULT false,
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
      `);
      
      console.log("✅ Created planting_guide table successfully");
    } else {
      console.log("planting_guide table already exists, skipping...");
    }
    
    // Check for plant_tcm_properties table
    console.log("Checking for plant_tcm_properties table...");
    
    const tcmTableExistsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'plant_tcm_properties';
    `);
    
    const tcmTableExists = tcmTableExistsResult.rows.length > 0;
    
    if (!tcmTableExists) {
      console.log("Creating plant_tcm_properties table...");
      
      // First check if tcm_temperatures and tcm_meridians tables exist
      const tcmTablesExistResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name IN ('tcm_temperatures', 'tcm_meridians');
      `);
      
      const existingTcmTables = tcmTablesExistResult.rows.map(row => row.table_name);
      
      if (!existingTcmTables.includes('tcm_temperatures')) {
        console.log("Creating tcm_temperatures table first...");
        
        await pool.query(`
          CREATE TABLE tcm_temperatures (
            temperature_id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            chinese_name VARCHAR(50),
            description TEXT,
            characteristics TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          
          -- Insert common temperature types
          INSERT INTO tcm_temperatures (name, chinese_name, description)
          VALUES 
            ('Cold', '寒', 'Cooling property that clears heat'),
            ('Cool', '涼', 'Mildly cooling property'),
            ('Neutral', '平', 'Balanced temperature property'),
            ('Warm', '温', 'Warming property that dispels cold'),
            ('Hot', '熱', 'Strongly warming property');
        `);
        
        console.log("✅ Created tcm_temperatures table successfully");
      }
      
      if (!existingTcmTables.includes('tcm_meridians')) {
        console.log("Creating tcm_meridians table first...");
        
        await pool.query(`
          CREATE TABLE tcm_meridians (
            meridian_id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            chinese_name VARCHAR(50),
            description TEXT,
            associated_organ VARCHAR(50),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          
          -- Insert common meridians
          INSERT INTO tcm_meridians (name, chinese_name, associated_organ)
          VALUES 
            ('Lung', '肺', 'Lung'),
            ('Large Intestine', '大腸', 'Large Intestine'),
            ('Stomach', '胃', 'Stomach'),
            ('Spleen', '脾', 'Spleen'),
            ('Heart', '心', 'Heart'),
            ('Small Intestine', '小腸', 'Small Intestine'),
            ('Bladder', '膀胱', 'Bladder'),
            ('Kidney', '腎', 'Kidney'),
            ('Pericardium', '心包', 'Pericardium'),
            ('Triple Burner', '三焦', 'Triple Burner'),
            ('Gallbladder', '膽', 'Gallbladder'),
            ('Liver', '肝', 'Liver');
        `);
        
        console.log("✅ Created tcm_meridians table successfully");
      }
      
      // Check if tcm_tastes table exists
      const tcmTastesExistsResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'tcm_tastes';
      `);
      
      const tcmTastesExists = tcmTastesExistsResult.rows.length > 0;
      
      if (!tcmTastesExists) {
        console.log("Creating tcm_tastes table first...");
        
        await pool.query(`
          CREATE TABLE tcm_tastes (
            taste_id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            chinese_name VARCHAR(50),
            description TEXT,
            characteristics TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          
          -- Insert common taste types
          INSERT INTO tcm_tastes (name, chinese_name, description)
          VALUES 
            ('Sweet', '甘', 'Tonifying and harmonizing quality'),
            ('Sour', '酸', 'Astringent and gathering quality'),
            ('Bitter', '苦', 'Draining and drying quality'),
            ('Pungent', '辛', 'Dispersing and moving quality'),
            ('Salty', '鹹', 'Softening and purging quality');
        `);
        
        console.log("✅ Created tcm_tastes table successfully");
      }
      
      // Create the plant_tcm_properties table
      await pool.query(`
        CREATE TABLE plant_tcm_properties (
          property_id SERIAL PRIMARY KEY,
          plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
          chinese_name VARCHAR(100),
          pinyin_name VARCHAR(100),
          temperature_id INTEGER REFERENCES tcm_temperatures(temperature_id),
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
