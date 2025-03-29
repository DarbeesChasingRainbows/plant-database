import { Plant } from "../entities/Plant.ts";
import { PlantId } from "../value-objects/PlantId.ts";
import { BotanicalName } from "../value-objects/BotanicalName.ts";
import { CommonName } from "../value-objects/CommonName.ts";
import { Taxonomy } from "../value-objects/Taxonomy.ts";
import { GrowthCharacteristics } from "../value-objects/GrowthCharacteristics.ts";

/**
 * Interface for plant creation data
 */
export interface PlantCreationProps {
  id?: number;
  botanicalName: string;
  commonName: string;
  family?: string;
  genus?: string;
  species?: string;
  description?: string;
  nativeRange?: string;
  growthHabit?: string;
  lifespan?: string;
  hardinessZones?: string;
  heightMatureCm?: number;
  spreadMatureCm?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Factory for creating Plant entities
 */
export class PlantFactory {
  /**
   * Create a new Plant entity
   * @param props Properties for creating a plant
   * @returns A new Plant entity
   */
  static createPlant(props: PlantCreationProps): Plant {
    // Create value objects
    const botanicalName = BotanicalName.create(props.botanicalName);
    const commonName = CommonName.create(props.commonName);
    
    // Extract genus and species from botanical name if not provided
    const genus = props.genus || botanicalName.genus;
    const species = props.species || botanicalName.species;
    
    const taxonomy = Taxonomy.create({
      family: props.family,
      genus,
      species
    });
    
    const growthCharacteristics = GrowthCharacteristics.create({
      growthHabit: props.growthHabit,
      lifespan: props.lifespan,
      hardinessZones: props.hardinessZones,
      heightMatureCm: props.heightMatureCm,
      spreadMatureCm: props.spreadMatureCm
    });
    
    // Create a plant ID (use provided ID or a temporary one)
    const plantId = PlantId.create(props.id || 0);
    
    // Create the plant entity
    return Plant.create(
      plantId,
      botanicalName,
      commonName,
      taxonomy,
      growthCharacteristics,
      props.description,
      props.nativeRange,
      props.createdAt,
      props.updatedAt
    );
  }
  
  /**
   * Create a Plant entity from persistence data
   * @param data Data from the database
   * @returns A new Plant entity
   */
  static createFromPersistence(data: any): Plant {
    return Plant.fromPersistence(data);
  }
}
