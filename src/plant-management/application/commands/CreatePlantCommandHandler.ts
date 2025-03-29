import { CreatePlantCommand } from "./CreatePlantCommand.ts";
import { IPlantRepository } from "../../domain/repositories/IPlantRepository.ts";
import { Plant } from "../../domain/entities/Plant.ts";
import { PlantId } from "../../domain/value-objects/PlantId.ts";
import { BotanicalName } from "../../domain/value-objects/BotanicalName.ts";
import { CommonName } from "../../domain/value-objects/CommonName.ts";
import { Taxonomy } from "../../domain/value-objects/Taxonomy.ts";
import { GrowthCharacteristics } from "../../domain/value-objects/GrowthCharacteristics.ts";

/**
 * Handler for the CreatePlantCommand
 */
export class CreatePlantCommandHandler {
  constructor(private plantRepository: IPlantRepository) {}
  
  /**
   * Handle the CreatePlantCommand
   * @param command The command to handle
   * @returns The ID of the created plant
   */
  async handle(command: CreatePlantCommand): Promise<number> {
    // Check if a plant with the same botanical name already exists
    const existingPlant = await this.plantRepository.findByBotanicalName(
      BotanicalName.create(command.botanicalName)
    );
    
    if (existingPlant) {
      throw new Error(`A plant with botanical name '${command.botanicalName}' already exists`);
    }
    
    // Create value objects
    const botanicalName = BotanicalName.create(command.botanicalName);
    const commonName = CommonName.create(command.commonName);
    
    // Extract genus and species from botanical name if not provided
    const genus = command.genus || botanicalName.genus;
    const species = command.species || botanicalName.species;
    
    const taxonomy = Taxonomy.create({
      family: command.family,
      genus,
      species
    });
    
    const growthCharacteristics = GrowthCharacteristics.create({
      growthHabit: command.growthHabit,
      lifespan: command.lifespan,
      hardinessZones: command.hardinessZones,
      heightMatureCm: command.heightMatureCm,
      spreadMatureCm: command.spreadMatureCm
    });
    
    // Create a temporary ID (will be replaced by the database)
    const tempId = PlantId.create(0);
    
    // Create the plant entity
    const plant = Plant.create(
      tempId,
      botanicalName,
      commonName,
      taxonomy,
      growthCharacteristics,
      command.description,
      command.nativeRange
    );
    
    // Save the plant
    const savedPlant = await this.plantRepository.save(plant);
    
    // Return the ID of the saved plant
    return savedPlant.id.value;
  }
}
