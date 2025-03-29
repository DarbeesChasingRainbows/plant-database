import { Plant } from "../entities/Plant.ts";
import { IPlantRepository } from "../repositories/IPlantRepository.ts";

/**
 * Domain service for plant-related operations
 */
export class PlantService {
  constructor(private plantRepository: IPlantRepository) {}
  
  /**
   * Check if two plants are compatible for companion planting
   * This is a domain service because it involves multiple entities
   * 
   * @param plant1 The first plant
   * @param plant2 The second plant
   * @returns An object describing the compatibility
   */
  async checkCompanionPlantingCompatibility(plant1: Plant, plant2: Plant): Promise<{
    isCompatible: boolean;
    reason?: string;
  }> {
    // This would typically involve complex domain logic
    // For now, we'll implement a simplified version
    
    // Example: Plants in the same family might compete for resources
    if (
      plant1.taxonomy.family && 
      plant2.taxonomy.family && 
      plant1.taxonomy.family === plant2.taxonomy.family
    ) {
      return {
        isCompatible: false,
        reason: "Plants from the same family often compete for the same nutrients"
      };
    }
    
    // More complex compatibility rules would be implemented here
    // This could involve checking companion planting databases, etc.
    
    return {
      isCompatible: true
    };
  }
  
  /**
   * Find plants suitable for a specific hardiness zone
   * 
   * @param zone The hardiness zone to search for
   * @returns Array of plants suitable for the zone
   */
  async findPlantsByHardinessZone(zone: string): Promise<Plant[]> {
    // Get all plants
    const allPlants = await this.plantRepository.findAll();
    
    // Filter plants by hardiness zone
    return allPlants.filter(plant => {
      const hardinessZones = plant.growthCharacteristics.hardinessZones;
      
      if (!hardinessZones) {
        return false;
      }
      
      // Check if the zone is included in the plant's hardiness zones
      // Hardiness zones can be specified in various formats like "5-9", "5,6,7", etc.
      
      // Handle range format (e.g., "5-9")
      if (hardinessZones.includes('-')) {
        const [min, max] = hardinessZones.split('-').map(z => parseInt(z.trim()));
        const zoneNum = parseInt(zone);
        return zoneNum >= min && zoneNum <= max;
      }
      
      // Handle list format (e.g., "5,6,7")
      if (hardinessZones.includes(',')) {
        const zones = hardinessZones.split(',').map(z => z.trim());
        return zones.includes(zone);
      }
      
      // Handle single value
      return hardinessZones.trim() === zone;
    });
  }
  
  /**
   * Calculate optimal planting dates based on plant requirements and location
   * 
   * @param plant The plant to calculate dates for
   * @param zone The hardiness zone
   * @param lastFrostDate The average last frost date for the location (ISO date string)
   * @returns Object with calculated planting dates
   */
  calculatePlantingDates(
    plant: Plant, 
    zone: string, 
    lastFrostDate: string
  ): {
    indoorSowingDate?: string;
    directSowingDate?: string;
    transplantDate?: string;
  } {
    // Parse the last frost date
    const lastFrost = new Date(lastFrostDate);
    
    // Default result
    const result: {
      indoorSowingDate?: string;
      directSowingDate?: string;
      transplantDate?: string;
    } = {};
    
    // This would typically involve complex domain logic based on:
    // - Plant germination requirements
    // - Days to maturity
    // - Hardiness zone
    // - Last frost date
    
    // For now, we'll implement a simplified version
    
    // Example: Calculate indoor sowing date (typically 6-8 weeks before last frost)
    const indoorSowingDate = new Date(lastFrost);
    indoorSowingDate.setDate(lastFrost.getDate() - 42); // 6 weeks before last frost
    result.indoorSowingDate = indoorSowingDate.toISOString().split('T')[0];
    
    // Example: Calculate direct sowing date (typically after last frost for tender plants)
    const directSowingDate = new Date(lastFrost);
    directSowingDate.setDate(lastFrost.getDate() + 7); // 1 week after last frost
    result.directSowingDate = directSowingDate.toISOString().split('T')[0];
    
    // Example: Calculate transplant date (typically 2 weeks after last frost)
    const transplantDate = new Date(lastFrost);
    transplantDate.setDate(lastFrost.getDate() + 14); // 2 weeks after last frost
    result.transplantDate = transplantDate.toISOString().split('T')[0];
    
    return result;
  }
}
