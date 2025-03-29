// plantRepository.ts
import { eq, ilike, or, SQL } from "drizzle-orm";
import { BaseRepository } from "./baseRepository.ts"; // Adjust path as needed
import { plants, type Plant, type NewPlant } from "../utils/schema.ts";
import { db } from "../utils/client.ts";

// Ensuring type compatibility with schema
export type CreatePlantInput = NewPlant;
export type UpdatePlantInput = Partial<CreatePlantInput>;

export class PlantRepository extends BaseRepository<typeof plants, Plant, CreatePlantInput> {
  constructor() {
    super(plants, plants.id);
  }

  // Override findAll with specific ordering
  async findAll(options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    const { limit, offset } = options;
    let query = db.select().from(this.table).orderBy(plants.botanicalName);
    if (limit) query = query.limit(limit);
    if (offset) query = query.offset(offset);
    return (await query) as Plant[];
  }

  // Search by name (common or botanical)
  async searchByName(name: string, options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    const where = or(
      ilike(plants.commonName, `%${name}%`),
      ilike(plants.botanicalName, `%${name}%`)
    );
    return this.findWhere(where, options);
  }

  // Get medicinal plants
  async getMedicinalPlants(options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    return this.findWhere(eq(plants.isMedicinal, true), options);
  }

  // Get plants by family
  async getByFamily(family: string, options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    return await this.findWhere(ilike(plants.family, `%${family}%`), options);
  }

  // Override create to ensure proper type alignment
  override async create(plant: CreatePlantInput): Promise<Plant> {
    return await super.create({
      botanicalName: plant.botanicalName,
      commonName: plant.commonName,
      family: plant.family,
      genus: plant.genus,
      species: plant.species,
      description: plant.description,
      nativeRange: plant.nativeRange,
      growthHabit: plant.growthHabit,
      lifespan: plant.lifespan,
      hardinessZones: plant.hardinessZones,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
    } as CreatePlantInput);
  }

  // Override update to handle partial updates
  async update(id: number, plant: UpdatePlantInput): Promise<Plant | null> {
    return super.update(id, plant);
  }

  // Additional utility methods
  async upsert(plant: CreatePlantInput): Promise<Plant> {
    const existing = await this.findWhere(eq(plants.botanicalName, plant.botanicalName));
    if (existing.length > 0) {
      return this.update(existing[0].id, plant) as Promise<Plant>;
    }
    return this.create(plant);
  }

  async deleteByBotanicalName(botanicalName: string): Promise<boolean> {
    const results = await db
      .delete(this.table)
      .where(eq(plants.botanicalName, botanicalName))
      .returning();
    return results.length > 0;
  }
}