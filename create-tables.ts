import { db } from "./utils/db.ts";
import { sql } from "drizzle-orm";
import dbModule from "./utils/db.ts";

console.log("Creating database tables...");

// Create tables for plots and garden beds
async function createTables() {
  try {
    // Create plots table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS plots (
        plot_id SERIAL PRIMARY KEY,
        area_id INTEGER,
        plot_code VARCHAR(20) NOT NULL UNIQUE,
        size_sqm DECIMAL(10, 2),
        boundary GEOMETRY(POLYGON),
        centroid POINT,
        orientation VARCHAR(50),
        sun_exposure TEXT,
        irrigation_type TEXT,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Plots table created successfully");

    // Create garden_beds table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS garden_beds (
        bed_id SERIAL PRIMARY KEY,
        plot_id INTEGER REFERENCES plots(plot_id) ON DELETE CASCADE,
        bed_name VARCHAR(100) NOT NULL,
        bed_code VARCHAR(20) NOT NULL UNIQUE,
        length_cm INTEGER,
        width_cm INTEGER,
        height_cm INTEGER,
        area_sqm DECIMAL(10, 2),
        boundary GEOMETRY(POLYGON),
        centroid POINT,
        soil_type VARCHAR(100),
        soil_depth_cm DECIMAL(5, 2),
        raised_bed BOOLEAN DEFAULT FALSE,
        irrigation_type VARCHAR(100),
        sun_exposure VARCHAR(50),
        notes TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Garden beds table created successfully");

    // Create planting_plants table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS planting_plants (
        id SERIAL PRIMARY KEY,
        planting_id INTEGER NOT NULL REFERENCES plantings(planting_id) ON DELETE CASCADE,
        plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
        quantity INTEGER,
        x_position DECIMAL(10, 2),
        y_position DECIMAL(10, 2),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(planting_id, plant_id)
      )
    `);
    console.log("Planting plants table created successfully");

    // Create crop_rotations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crop_rotations (
        rotation_id SERIAL PRIMARY KEY,
        bed_id INTEGER NOT NULL REFERENCES garden_beds(bed_id) ON DELETE CASCADE,
        season VARCHAR(50),
        year INTEGER NOT NULL,
        plant_families TEXT[],
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log("Crop rotations table created successfully");

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    // Close the database connection
    await dbModule.pool.end();
  }
}

createTables();
