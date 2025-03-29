import { Plant } from "../entities/Plant.ts";
import { PlantId } from "../value-objects/PlantId.ts";
import { BotanicalName } from "../value-objects/BotanicalName.ts";

/**
 * Interface for Plant repository operations
 * Following the Repository pattern in DDD
 */
export interface IPlantRepository {
  /**
   * Find a plant by its ID
   * @param id The plant ID
   * @returns The plant if found, null otherwise
   */
  findById(id: PlantId): Promise<Plant | null>;
  
  /**
   * Find a plant by its botanical name
   * @param botanicalName The botanical name
   * @returns The plant if found, null otherwise
   */
  findByBotanicalName(botanicalName: BotanicalName): Promise<Plant | null>;
  
  /**
   * Find all plants
   * @param options Optional pagination parameters
   * @returns Array of plants
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Plant[]>;
  
  /**
   * Search plants by name (botanical or common)
   * @param searchTerm The search term
   * @param options Optional pagination parameters
   * @returns Array of matching plants
   */
  searchByName(searchTerm: string, options?: { limit?: number; offset?: number }): Promise<Plant[]>;
  
  /**
   * Get plants by family
   * @param family The plant family
   * @param options Optional pagination parameters
   * @returns Array of plants in the specified family
   */
  getByFamily(family: string, options?: { limit?: number; offset?: number }): Promise<Plant[]>;
  
  /**
   * Save a plant (create or update)
   * @param plant The plant to save
   * @returns The saved plant
   */
  save(plant: Plant): Promise<Plant>;
  
  /**
   * Delete a plant
   * @param id The ID of the plant to delete
   * @returns True if the plant was deleted, false otherwise
   */
  delete(id: PlantId): Promise<boolean>;
}
