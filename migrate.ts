import { db } from "./utils/db.ts";
import { migrate } from "drizzle-orm/node-postgres/migrator";

console.log("Starting database migration...");

try {
  // This will create all tables defined in your schema
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
}

// Close the database connection
await db.pool?.end();
