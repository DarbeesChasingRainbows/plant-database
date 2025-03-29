// migrations/migrate.ts

import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { config } from "../utils/config.ts";
import * as path from "https://deno.land/std@0.177.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";

// Parse command line arguments
const args = parse(Deno.args);
const specificMigration = args.file;

async function runMigration() {
  const client = new Client(config.databaseUrl);
  await client.connect();

  try {
    console.log("Connected to database. Running migrations...");
    
    // Create migrations table if it doesn't exist
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await client.queryArray<[number, string, Date]>(
      "SELECT * FROM migrations ORDER BY id"
    );
    const executedMigrationNames = executedMigrations.map(row => row[1]);
    
    console.log("Already executed migrations:", executedMigrationNames);

    // Get all SQL files in the migrations directory
    const migrationFiles = [];
    
    if (specificMigration) {
      // If a specific migration file is specified, only run that one
      migrationFiles.push(specificMigration);
    } else {
      // Otherwise, get all SQL files in the migrations directory
      for await (const entry of Deno.readDir("./migrations")) {
        if (entry.isFile && entry.name.endsWith(".sql")) {
          migrationFiles.push(entry.name);
        }
      }
    }

    // Sort migration files alphabetically
    migrationFiles.sort();

    // Execute migrations that haven't been executed yet
    for (const migrationFile of migrationFiles) {
      if (!executedMigrationNames.includes(migrationFile)) {
        console.log(`Executing migration: ${migrationFile}`);
        
        // Read and execute the migration file
        const sql = await Deno.readTextFile(path.join("./migrations", migrationFile));
        await client.queryArray(sql);
        
        // Record the migration as executed
        await client.queryArray(
          "INSERT INTO migrations (name) VALUES ($1)",
          [migrationFile]
        );
        
        console.log(`Migration ${migrationFile} executed successfully.`);
      } else {
        console.log(`Skipping already executed migration: ${migrationFile}`);
      }
    }

    console.log("All migrations completed successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  } finally {
    await client.end();
  }
}

await runMigration();
