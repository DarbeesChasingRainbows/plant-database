// Script to add missing columns to the plants table
import dbConfig from "../utils/db.ts";
import { sql } from "drizzle-orm";

const { db } = dbConfig;

// Define all the columns we need to add
const columnsToAdd = [
  {
    name: 'native_range',
    type: 'TEXT',
    comment: 'Geographic regions where the plant naturally occurs'
  },
  {
    name: 'growth_habit',
    type: 'VARCHAR(100)',
    comment: 'Growth form of the plant (e.g., tree, shrub, herb, vine)'
  },
  {
    name: 'lifespan',
    type: 'VARCHAR(50)',
    comment: 'Lifespan category of the plant (e.g., annual, biennial, perennial)'
  },
  {
    name: 'hardiness_zones',
    type: 'VARCHAR(50)',
    comment: 'USDA plant hardiness zones where the plant can survive'
  }
];

async function runMigration() {
  console.log("Starting migration to add missing columns...");
  
  try {
    // Check which columns already exist
    const checkColumnsQuery = sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'plants';
    `;
    
    const existingColumnsResult = await db.execute(checkColumnsQuery);
    const existingColumns = existingColumnsResult.rows.map((row: any) => row.column_name);
    
    console.log("Existing columns:", existingColumns);
    
    // Add each missing column
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adding ${column.name} column...`);
        await db.execute(sql`ALTER TABLE plants ADD COLUMN ${sql.identifier(column.name)} ${sql.raw(column.type)};`);
        await db.execute(sql`COMMENT ON COLUMN plants.${sql.identifier(column.name)} IS ${column.comment};`);
        console.log(`✅ Added ${column.name} column successfully`);
      } else {
        console.log(`${column.name} column already exists, skipping...`);
      }
    }
    
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
