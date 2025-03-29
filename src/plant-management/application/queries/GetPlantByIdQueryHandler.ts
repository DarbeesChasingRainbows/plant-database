import { GetPlantByIdQuery } from "./GetPlantByIdQuery.ts";
import { IPlantRepository } from "../../domain/repositories/IPlantRepository.ts";
import { PlantId } from "../../domain/value-objects/PlantId.ts";

/**
 * Data Transfer Object for plant details
 */
export interface PlantDto {
  id: number;
  botanicalName: string;
  commonName: string;
  family?: string;
  genus: string;
  species: string;
  description?: string;
  nativeRange?: string;
  growthHabit?: string;
  lifespan?: string;
  hardinessZones?: string;
  heightMatureCm?: number;
  spreadMatureCm?: number;
  heightMatureInches?: number;
  spreadMatureInches?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Handler for the GetPlantByIdQuery
 */
export class GetPlantByIdQueryHandler {
  constructor(private plantRepository: IPlantRepository) {}
  
  /**
   * Handle the GetPlantByIdQuery
   * @param query The query to handle
   * @returns The plant details or null if not found
   */
  async handle(query: GetPlantByIdQuery): Promise<PlantDto | null> {
    const plantId = PlantId.create(query.id);
    const plant = await this.plantRepository.findById(plantId);
    
    if (!plant) {
      return null;
    }
    
    // Map domain entity to DTO
    return {
      id: plant.id.value,
      botanicalName: plant.botanicalName.value,
      commonName: plant.commonName.value,
      family: plant.taxonomy.family,
      genus: plant.taxonomy.genus,
      species: plant.taxonomy.species,
      description: plant.description,
      nativeRange: plant.nativeRange,
      growthHabit: plant.growthCharacteristics.growthHabit,
      lifespan: plant.growthCharacteristics.lifespan,
      hardinessZones: plant.growthCharacteristics.hardinessZones,
      heightMatureCm: plant.growthCharacteristics.heightMatureCm,
      spreadMatureCm: plant.growthCharacteristics.spreadMatureCm,
      heightMatureInches: plant.growthCharacteristics.heightMatureInches,
      spreadMatureInches: plant.growthCharacteristics.spreadMatureInches,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt
    };
  }
}
