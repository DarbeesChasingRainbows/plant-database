import { db } from "./utils/db.ts";
import { plots } from "./utils/schema.ts";

console.log("Inserting sample plot data...");

async function insertSamplePlots() {
  try {
    // Check if we already have plots to avoid duplicates
    const existingPlots = await db.select().from(plots);
    
    if (existingPlots.length > 0) {
      console.log(`Found ${existingPlots.length} existing plots. Skipping insertion.`);
      return;
    }
    
    // Sample plot data
    const samplePlots = [
      {
        plotCode: "PLOT-A",
        sizeSqm: 100.5,
        orientation: "North-South",
        sunExposure: "Full sun",
        irrigationType: "Drip irrigation",
        notes: "Main vegetable plot",
        status: "active"
      },
      {
        plotCode: "PLOT-B",
        sizeSqm: 75.25,
        orientation: "East-West",
        sunExposure: "Partial shade",
        irrigationType: "Sprinkler",
        notes: "Herb garden",
        status: "active"
      },
      {
        plotCode: "PLOT-C",
        sizeSqm: 50.0,
        orientation: "North-South",
        sunExposure: "Full sun",
        irrigationType: "Manual watering",
        notes: "Flower garden",
        status: "active"
      },
      {
        plotCode: "PLOT-D",
        sizeSqm: 200.0,
        orientation: "East-West",
        sunExposure: "Mixed sun/shade",
        irrigationType: "Soaker hose",
        notes: "Fruit trees area",
        status: "planned"
      }
    ];
    
    // Insert the sample plots
    const result = await db.insert(plots).values(samplePlots);
    console.log(`Successfully inserted ${samplePlots.length} sample plots.`);
  } catch (error) {
    console.error("Error inserting sample plots:", error);
  } finally {
    // Close the database connection
    await db.pool?.end();
  }
}

insertSamplePlots();
