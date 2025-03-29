import { db } from "./utils/db.ts";

// Check the structure of the cutFlowerCharacteristics table
try {
  const result = await db.query.cutFlowerCharacteristics.findMany();
  console.log("Found records:", result.length);
  if (result.length > 0) {
    console.log("Columns:", Object.keys(result[0]).join(", "));
    console.log("Sample data:", result[0]);
  } else {
    // If no records, try to get the table structure
    console.log("No records found. Checking table structure...");
    const tableInfo = await db.execute(`PRAGMA table_info(cut_flower_characteristics)`);
    console.log("Table structure:", tableInfo.rows);
  }
} catch (error) {
  console.error("Error:", error.message);
}
