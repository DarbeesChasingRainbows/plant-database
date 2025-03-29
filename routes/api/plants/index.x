import { FreshContext } from "$fresh/server.ts";
import { PlantRepository } from "../../../repositories/PlantRepository.ts";
import { initializeDB, pool } from "../../../utils/db.ts";

export const handler = async (req: Request, _ctx: FreshContext) => {
  await initializeDB();
  const plantRepo = new PlantRepository();

  // BEGIN TEST CODE

  // END TEST CODE

  try {
    if (req.method === "POST") {
      console.log("Received POST request");
      const plantData = await req.json();
      console.log("Plant data:", plantData);
      const plant = await plantRepo.create(plantData);
      console.log("Created plant:", plant);
      return new Response(JSON.stringify(plant), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // GET request - list all plants
    const plants = await plantRepo.searchByName("");
    return new Response(JSON.stringify(plants), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const status = error instanceof Error && error.message.includes("required")
      ? 400
      : 500;
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};
