import { Plot } from "../entities/Plot.ts";
import { PlotId } from "../value-objects/PlotId.ts";
import { GardenBedId } from "../value-objects/GardenBedId.ts";

/**
 * Repository interface for Plot aggregate
 */
export interface IPlotRepository {
  /**
   * Find a plot by its ID
   * @param id The plot ID
   * @returns The plot if found, undefined otherwise
   */
  findById(id: PlotId): Promise<Plot | undefined>;
  
  /**
   * Find all plots
   * @returns Array of plots
   */
  findAll(): Promise<Plot[]>;
  
  /**
   * Find plots by garden bed ID
   * @param gardenBedId The garden bed ID
   * @returns Array of plots in the garden bed
   */
  findByGardenBedId(gardenBedId: GardenBedId): Promise<Plot[]>;
  
  /**
   * Find plots by name (partial match)
   * @param name The name to search for
   * @returns Array of matching plots
   */
  findByName(name: string): Promise<Plot[]>;
  
  /**
   * Find active plots
   * @returns Array of active plots
   */
  findActive(): Promise<Plot[]>;
  
  /**
   * Find active plots in a garden bed
   * @param gardenBedId The garden bed ID
   * @returns Array of active plots in the garden bed
   */
  findActiveByGardenBedId(gardenBedId: GardenBedId): Promise<Plot[]>;
  
  /**
   * Save a plot (create or update)
   * @param plot The plot to save
   * @returns The saved plot
   */
  save(plot: Plot): Promise<Plot>;
  
  /**
   * Delete a plot
   * @param id The ID of the plot to delete
   * @returns True if deleted, false if not found
   */
  delete(id: PlotId): Promise<boolean>;
  
  /**
   * Get the total count of plots
   * @returns The count of plots
   */
  count(): Promise<number>;
  
  /**
   * Get the count of plots in a garden bed
   * @param gardenBedId The garden bed ID
   * @returns The count of plots in the garden bed
   */
  countByGardenBedId(gardenBedId: GardenBedId): Promise<number>;
}
