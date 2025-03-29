// Domain Entities
export { Plant } from "./domain/entities/Plant.ts";

// Value Objects
export { PlantId } from "./domain/value-objects/PlantId.ts";
export { BotanicalName } from "./domain/value-objects/BotanicalName.ts";
export { CommonName } from "./domain/value-objects/CommonName.ts";
export { Taxonomy } from "./domain/value-objects/Taxonomy.ts";
export { GrowthCharacteristics } from "./domain/value-objects/GrowthCharacteristics.ts";

// Domain Services
export { PlantService } from "./domain/services/PlantService.ts";

// Repositories
export type { IPlantRepository } from "./domain/repositories/IPlantRepository.ts";
export { DrizzlePlantRepository } from "./infrastructure/repositories/DrizzlePlantRepository.ts";

// Factories
export { PlantFactory } from "./domain/factories/PlantFactory.ts";
export type { PlantCreationProps } from "./domain/factories/PlantFactory.ts";

// Application Commands
export { CreatePlantCommand } from "./application/commands/CreatePlantCommand.ts";
export { CreatePlantCommandHandler } from "./application/commands/CreatePlantCommandHandler.ts";

// Application Queries
export { GetPlantByIdQuery } from "./application/queries/GetPlantByIdQuery.ts";
export { GetPlantByIdQueryHandler } from "./application/queries/GetPlantByIdQueryHandler.ts";
export type { PlantDto } from "./application/queries/GetPlantByIdQueryHandler.ts";

// Create instances of repositories and services for dependency injection
import { DrizzlePlantRepository } from "./infrastructure/repositories/DrizzlePlantRepository.ts";
import { PlantService } from "./domain/services/PlantService.ts";
import { CreatePlantCommandHandler } from "./application/commands/CreatePlantCommandHandler.ts";
import { GetPlantByIdQueryHandler } from "./application/queries/GetPlantByIdQueryHandler.ts";

// Create singleton instances
const plantRepository = new DrizzlePlantRepository();
const plantService = new PlantService(plantRepository);
const createPlantCommandHandler = new CreatePlantCommandHandler(plantRepository);
const getPlantByIdQueryHandler = new GetPlantByIdQueryHandler(plantRepository);

// Export singleton instances
export {
  plantRepository,
  plantService,
  createPlantCommandHandler,
  getPlantByIdQueryHandler
};
