// utils/config.ts

export const config = {
  // Use the same connection string as in client.ts
  databaseUrl: Deno.env.get("DATABASE_URL") || "postgres://postgres:*Tx325z59aq@localhost:5433/plants",
  
  // Application settings
  appName: "Plant Database",
  
  // Server settings
  port: parseInt(Deno.env.get("PORT") || "8000"),
  
  // Development mode
  isDev: Deno.env.get("ENV") !== "production",
};
