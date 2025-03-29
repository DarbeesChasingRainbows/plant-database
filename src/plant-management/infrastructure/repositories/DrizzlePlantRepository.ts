import { eq, ilike, or } from "drizzle-orm";
import { db } from "../../../../utils/client.ts";
import { plants } from "../../../../utils/schema.ts";
import { IPlantRepository } from "../../domain/repositories/IPlantRepository.ts";
import { Plant } from "../../domain/entities/Plant.ts";
import { PlantId } from "../../domain/value-objects/PlantId.ts";
import { BotanicalName } from "../../domain/value-objects/BotanicalName.ts";

/**
 * Drizzle ORM implementation of the Plant repository
 */
export class DrizzlePlantRepository implements IPlantRepository {
  /**
   * Find a plant by its ID
   * @param id The plant ID
   * @returns The plant if found, null otherwise
   */
  async findById(id: PlantId): Promise<Plant | null> {
    const result = await db.select().from(plants).where(eq(plants.id, id.value)).limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    return Plant.fromPersistence(result[0]);
  }
  
  /**
   * Find a plant by its botanical name
   * @param botanicalName The botanical name
   * @returns The plant if found, null otherwise
   */
  async findByBotanicalName(botanicalName: BotanicalName): Promise<Plant | null> {
    const result = await db.select().from(plants).where(eq(plants.botanicalName, botanicalName.value)).limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    return Plant.fromPersistence(result[0]);
  }
  
  /**
   * Find all plants
   * @param options Optional pagination parameters
   * @returns Array of plants
   */
  async findAll(options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    const { limit, offset } = options;
    let query = db.select().from(plants).orderBy(plants.botanicalName);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    const results = await query;
    return results.map(plant => Plant.fromPersistence(plant));
  }
  
  /**
   * Search plants by name (botanical or common)
   * @param searchTerm The search term
   * @param options Optional pagination parameters
   * @returns Array of matching plants
   */
  async searchByName(searchTerm: string, options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    const { limit, offset } = options;
    
    const where = or(
      ilike(plants.commonName, `%${searchTerm}%`),
      ilike(plants.botanicalName, `%${searchTerm}%`)
    );
    
    let query = db.select().from(plants).where(where).orderBy(plants.botanicalName);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    const results = await query;
    return results.map(plant => Plant.fromPersistence(plant));
  }
  
  /**
   * Get plants by family
   * @param family The plant family
   * @param options Optional pagination parameters
   * @returns Array of plants in the specified family
   */
  async getByFamily(family: string, options: { limit?: number; offset?: number } = {}): Promise<Plant[]> {
    const { limit, offset } = options;
    
    let query = db.select().from(plants).where(ilike(plants.family, `%${family}%`)).orderBy(plants.botanicalName);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    const results = await query;
    return results.map(plant => Plant.fromPersistence(plant));
  }
  
  /**
   * Save a plant (create or update)
   * @param plant The plant to save
   * @returns The saved plant
   */
  async save(plant: Plant): Promise<Plant> {
    const plantData = plant.toPersistence();
    
    // Check if the plant already exists
    const existingPlant = await this.findById(plant.id);
    
    if (existingPlant) {
      // Update existing plant
      const result = await db.update(plants)
        .set({
          botanicalName: plantData.botanicalName,
          commonName: plantData.commonName,
          family: plantData.family,
          genus: plantData.genus,
          species: plantData.species,
          description: plantData.description,
          nativeRange: plantData.nativeRange,
          growthHabit: plantData.growthHabit,
          lifespan: plantData.lifespan,
          hardinessZones: plantData.hardinessZones,
          updatedAt: new Date()
        })
        .where(eq(plants.id, plant.id.value))
        .returning();
      
      return Plant.fromPersistence(result[0]);
    } else {
      // Create new plant
      const result = await db.insert(plants)
        .values({
          botanicalName: plantData.botanicalName,
          commonName: plantData.commonName,
          family: plantData.family,
          genus: plantData.genus,
          species: plantData.species,
          description: plantData.description,
          nativeRange: plantData.nativeRange,
          growthHabit: plantData.growthHabit,
          lifespan: plantData.lifespan,
          hardinessZones: plantData.hardinessZones,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return Plant.fromPersistence(result[0]);
    }
  }
  
  /**
   * Delete a plant
   * @param id The ID of the plant to delete
   * @returns True if the plant was deleted, false otherwise
   */
  async delete(id: PlantId): Promise<boolean> {
    const result = await db.delete(plants)
      .where(eq(plants.id, id.value))
      .returning();
    
    return result.length > 0;
  }
}
