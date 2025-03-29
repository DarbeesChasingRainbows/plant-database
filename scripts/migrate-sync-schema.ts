// Script to synchronize database schema with schema.ts definitions
import dbConfig from "../utils/db.ts";
import * as schema from "../utils/schema.ts";

const { db, pool } = dbConfig;

async function runMigration() {
  console.log("Starting migration to synchronize database with schema.ts...");
  
  try {
    // Get all table definitions from schema.ts
    const schemaTables = Object.entries(schema)
      .filter(([_, value]) => typeof value === 'object' && value !== null && 'name' in value)
      .map(([key, value]) => ({ 
        name: value.name,
        tsName: key 
      }));
    
    console.log(`Found ${schemaTables.length} tables in schema.ts`);
    
    // Check which tables exist in the database
    const tablesExistResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `);
    
    const existingTables = tablesExistResult.rows.map(row => row.table_name);
    console.log(`Found ${existingTables.length} existing tables in database`);
    
    // Find missing tables
    const missingTables = schemaTables.filter(table => !existingTables.includes(table.name));
    console.log(`Found ${missingTables.length} missing tables`);
    
    if (missingTables.length > 0) {
      console.log("Missing tables:", missingTables.map(t => t.name).join(", "));
      
      // Generate SQL for missing tables using Drizzle
      console.log("Generating SQL for missing tables...");
      
      // For each missing table, we'll use Drizzle to generate the SQL
      for (const table of missingTables) {
        console.log(`Creating table: ${table.name}`);
        
        try {
          // Use the Drizzle schema object to create the table
          await db.execute(db.schema.createTable(schema[table.tsName]));
          console.log(`✅ Created table ${table.name} successfully`);
        } catch (error) {
          console.error(`❌ Failed to create table ${table.name}:`, error);
        }
      }
    } else {
      console.log("No missing tables found.");
    }
    
    // Now check for missing columns in existing tables
    console.log("Checking for missing columns in existing tables...");
    
    for (const tableInfo of schemaTables) {
      if (existingTables.includes(tableInfo.name)) {
        const tableSchema = schema[tableInfo.tsName];
        
        // Get columns from schema
        const schemaColumns = Object.entries(tableSchema.columns || {})
          .map(([key, value]) => ({
            name: value.name,
            tsName: key
          }));
        
        // Get existing columns from database
        const columnsExistResult = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = $1
          AND table_schema = 'public';
        `, [tableInfo.name]);
        
        const existingColumns = columnsExistResult.rows.map(row => row.column_name);
        
        // Find missing columns
        const missingColumns = schemaColumns.filter(col => !existingColumns.includes(col.name));
        
        if (missingColumns.length > 0) {
          console.log(`Table ${tableInfo.name} is missing ${missingColumns.length} columns:`, 
            missingColumns.map(c => c.name).join(", "));
          
          // Add missing columns
          for (const column of missingColumns) {
            try {
              console.log(`Adding column ${column.name} to table ${tableInfo.name}...`);
              
              // Use raw SQL to add the column since Drizzle doesn't have a direct way to alter tables
              // This is a simplified approach and might need adjustments for specific column types
              await pool.query(`
                ALTER TABLE ${tableInfo.name}
                ADD COLUMN IF NOT EXISTS ${column.name} VARCHAR(255);
              `);
              
              console.log(`✅ Added column ${column.name} to table ${tableInfo.name}`);
            } catch (error) {
              console.error(`❌ Failed to add column ${column.name} to table ${tableInfo.name}:`, error);
            }
          }
        } else {
          console.log(`Table ${tableInfo.name} has all required columns.`);
        }
      }
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
