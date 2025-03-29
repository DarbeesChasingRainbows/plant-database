import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import pg from "npm:pg";
import * as schema from "./schema.ts";

const { Pool } = pg;

const env = config();

const client = new Pool({
  host: "localhost",
  port: 5433,
  database: "plants",
  user: "postgres",
  password: "*Tx325z59aq",
  max: 10,
});

export const db = drizzle(client, { schema });
export default { db, pool: client };