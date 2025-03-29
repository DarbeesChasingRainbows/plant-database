// src/db/client.ts
import { drizzle } from "drizzle-orm/node-postgres"; 
import pg from "pg";
const { Pool } = pg;

import { 
    plants, 
    plantParts,
    plantProperties,
    plantGerminationGuide,
    companionGroups,
    //companionGroupPlants,
    plantConstituents,
    plantDosages,
    sideEffects,
    plantTcmProperties,
    plantTcmActions,
    plantTcmPatterns,
    plantAyurvedicProperties,
    plantAyurvedicActions,
    plantsRelations,
    //companionGroupPlantsRelations,
} from './schema.ts';

const CONN_STRING = Deno.env.get("DATABASE_URL") ||
  "postgres://postgres:*Tx325z59aq@localhost:5433/plants";

export const db = drizzle({
    client: new Pool({connectionString: CONN_STRING}),
    schema: {
        plants,
        plantParts,
        plantProperties,
        plantGerminationGuide,
        companionGroups,
        //companionGroupPlants,
        plantConstituents,
        plantDosages,
        sideEffects,
        plantTcmProperties,
        plantTcmActions,
        plantTcmPatterns,
        plantAyurvedicProperties,
        plantAyurvedicActions,
    },
});