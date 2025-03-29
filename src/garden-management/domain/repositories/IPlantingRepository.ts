import { Planting, PlantingStatus } from "../entities/Planting.ts";
import { PlantingId } from "../value-objects/PlantingId.ts";
import { PlotId } from "../value-objects/PlotId.ts";
import { PlantId } from "../../../plant-management/domain/value-objects/PlantId.ts";

/**
 * Repository interface for Planting entity
 */
export interface IPlantingRepository {
  /**
   * Find a planting by its ID
   * @param id The planting ID
   * @returns The planting if found, undefined otherwise
   */
  findById(id: PlantingId): Promise<Planting | undefined>;
  
  /**
   * Find all plantings
   * @returns Array of plantings
   */
  findAll(): Promise<Planting[]>;
  
  /**
   * Find plantings by plot ID
   * @param plotId The plot ID
   * @returns Array of plantings in the plot
   */
  findByPlotId(plotId: PlotId): Promise<Planting[]>;
  
  /**
   * Find plantings by plant ID
   * @param plantId The plant ID
   * @returns Array of plantings of the plant
   */
  findByPlantId(plantId: PlantId): Promise<Planting[]>;
  
  /**
   * Find plantings by status
   * @param status The planting status
   * @returns Array of plantings with the status
   */
  findByStatus(status: PlantingStatus): Promise<Planting[]>;
  
  /**
   * Find plantings by plot ID and status
   * @param plotId The plot ID
   * @param status The planting status
   * @returns Array of plantings in the plot with the status
   */
  findByPlotIdAndStatus(plotId: PlotId, status: PlantingStatus): Promise<Planting[]>;
  
  /**
   * Find plantings by plant ID and status
   * @param plantId The plant ID
   * @param status The planting status
   * @returns Array of plantings of the plant with the status
   */
  findByPlantIdAndStatus(plantId: PlantId, status: PlantingStatus): Promise<Planting[]>;
  
  /**
   * Find plantings by planting date range
   * @param startDate The start date
   * @param endDate The end date
   * @returns Array of plantings within the date range
   */
  findByPlantingDateRange(startDate: Date, endDate: Date): Promise<Planting[]>;
  
  /**
   * Find plantings by harvest date range
   * @param startDate The start date
   * @param endDate The end date
   * @returns Array of plantings within the date range
   */
  findByHarvestDateRange(startDate: Date, endDate: Date): Promise<Planting[]>;
  
  /**
   * Save a planting (create or update)
   * @param planting The planting to save
   * @returns The saved planting
   */
  save(planting: Planting): Promise<Planting>;
  
  /**
   * Delete a planting
   * @param id The ID of the planting to delete
   * @returns True if deleted, false if not found
   */
  delete(id: PlantingId): Promise<boolean>;
  
  /**
   * Get the total count of plantings
   * @returns The count of plantings
   */
  count(): Promise<number>;
  
  /**
   * Get the count of plantings by status
   * @param status The planting status
   * @returns The count of plantings with the status
   */
  countByStatus(status: PlantingStatus): Promise<number>;
  
  /**
   * Get the count of plantings by plot ID
   * @param plotId The plot ID
   * @returns The count of plantings in the plot
   */
  countByPlotId(plotId: PlotId): Promise<number>;
  
  /**
   * Get the count of plantings by plant ID
   * @param plantId The plant ID
   * @returns The count of plantings of the plant
   */
  countByPlantId(plantId: PlantId): Promise<number>;
}
