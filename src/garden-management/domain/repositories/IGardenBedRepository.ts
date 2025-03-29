import { GardenBed } from "../entities/GardenBed.ts";
import { GardenBedId } from "../value-objects/GardenBedId.ts";

/**
 * Repository interface for Garden Bed aggregate
 */
export interface IGardenBedRepository {
  /**
   * Find a garden bed by its ID
   * @param id The garden bed ID
   * @returns The garden bed if found, undefined otherwise
   */
  findById(id: GardenBedId): Promise<GardenBed | undefined>;
  
  /**
   * Find all garden beds
   * @returns Array of garden beds
   */
  findAll(): Promise<GardenBed[]>;
  
  /**
   * Find garden beds by name (partial match)
   * @param name The name to search for
   * @returns Array of matching garden beds
   */
  findByName(name: string): Promise<GardenBed[]>;
  
  /**
   * Save a garden bed (create or update)
   * @param gardenBed The garden bed to save
   * @returns The saved garden bed
   */
  save(gardenBed: GardenBed): Promise<GardenBed>;
  
  /**
   * Delete a garden bed
   * @param id The ID of the garden bed to delete
   * @returns True if deleted, false if not found
   */
  delete(id: GardenBedId): Promise<boolean>;
  
  /**
   * Get the total count of garden beds
   * @returns The count of garden beds
   */
  count(): Promise<number>;
}
