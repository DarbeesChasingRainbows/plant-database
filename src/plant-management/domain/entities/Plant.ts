import { PlantId } from "../value-objects/PlantId.ts";
import { BotanicalName } from "../value-objects/BotanicalName.ts";
import { CommonName } from "../value-objects/CommonName.ts";
import { Taxonomy } from "../value-objects/Taxonomy.ts";
import { GrowthCharacteristics } from "../value-objects/GrowthCharacteristics.ts";

/**
 * Plant entity - Aggregate Root for the Plant Management bounded context
 */
export class Plant {
  private _id: PlantId;
  private _botanicalName: BotanicalName;
  private _commonName: CommonName;
  private _taxonomy: Taxonomy;
  private _growthCharacteristics: GrowthCharacteristics;
  private _description?: string;
  private _nativeRange?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  
  private constructor(
    id: PlantId,
    botanicalName: BotanicalName,
    commonName: CommonName,
    taxonomy: Taxonomy,
    growthCharacteristics: GrowthCharacteristics,
    description?: string,
    nativeRange?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._botanicalName = botanicalName;
    this._commonName = commonName;
    this._taxonomy = taxonomy;
    this._growthCharacteristics = growthCharacteristics;
    this._description = description;
    this._nativeRange = nativeRange;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }
  
  // Getters
  get id(): PlantId {
    return this._id;
  }
  
  get botanicalName(): BotanicalName {
    return this._botanicalName;
  }
  
  get commonName(): CommonName {
    return this._commonName;
  }
  
  get taxonomy(): Taxonomy {
    return this._taxonomy;
  }
  
  get growthCharacteristics(): GrowthCharacteristics {
    return this._growthCharacteristics;
  }
  
  get description(): string | undefined {
    return this._description;
  }
  
  get nativeRange(): string | undefined {
    return this._nativeRange;
  }
  
  get createdAt(): Date {
    return this._createdAt;
  }
  
  get updatedAt(): Date {
    return this._updatedAt;
  }
  
  // Domain methods
  
  /**
   * Update the plant's botanical name
   * @param botanicalName The new botanical name
   */
  updateBotanicalName(botanicalName: BotanicalName): void {
    this._botanicalName = botanicalName;
    this._updatedAt = new Date();
    
    // Update taxonomy based on botanical name
    this._taxonomy = Taxonomy.create({
      family: this._taxonomy.family,
      genus: botanicalName.genus,
      species: botanicalName.species,
      variety: this._taxonomy.variety,
      cultivar: this._taxonomy.cultivar
    });
  }
  
  /**
   * Update the plant's common name
   * @param commonName The new common name
   */
  updateCommonName(commonName: CommonName): void {
    this._commonName = commonName;
    this._updatedAt = new Date();
  }
  
  /**
   * Update the plant's description
   * @param description The new description
   */
  updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }
  
  /**
   * Update the plant's native range
   * @param nativeRange The new native range
   */
  updateNativeRange(nativeRange?: string): void {
    this._nativeRange = nativeRange;
    this._updatedAt = new Date();
  }
  
  /**
   * Update the plant's growth characteristics
   * @param growthCharacteristics The new growth characteristics
   */
  updateGrowthCharacteristics(growthCharacteristics: GrowthCharacteristics): void {
    this._growthCharacteristics = growthCharacteristics;
    this._updatedAt = new Date();
  }
  
  /**
   * Update the plant's taxonomy
   * @param taxonomy The new taxonomy
   */
  updateTaxonomy(taxonomy: Taxonomy): void {
    this._taxonomy = taxonomy;
    this._updatedAt = new Date();
    
    // Update botanical name based on taxonomy
    this._botanicalName = BotanicalName.create(taxonomy.fullBotanicalName);
  }
  
  /**
   * Convert the domain entity to a data transfer object for persistence
   * This maintains compatibility with the existing Drizzle ORM schema
   */
  toPersistence(): any {
    return {
      id: this._id.value,
      botanicalName: this._botanicalName.value,
      commonName: this._commonName.value,
      family: this._taxonomy.family,
      genus: this._taxonomy.genus,
      species: this._taxonomy.species,
      description: this._description,
      nativeRange: this._nativeRange,
      growthHabit: this._growthCharacteristics.growthHabit,
      lifespan: this._growthCharacteristics.lifespan,
      hardinessZones: this._growthCharacteristics.hardinessZones,
      heightMatureCm: this._growthCharacteristics.heightMatureCm,
      spreadMatureCm: this._growthCharacteristics.spreadMatureCm,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
  
  /**
   * Create a new Plant entity
   */
  static create(
    id: PlantId,
    botanicalName: BotanicalName,
    commonName: CommonName,
    taxonomy: Taxonomy,
    growthCharacteristics: GrowthCharacteristics,
    description?: string,
    nativeRange?: string,
    createdAt?: Date,
    updatedAt?: Date
  ): Plant {
    return new Plant(
      id,
      botanicalName,
      commonName,
      taxonomy,
      growthCharacteristics,
      description,
      nativeRange,
      createdAt,
      updatedAt
    );
  }
  
  /**
   * Reconstruct a Plant entity from persistence data (Drizzle ORM)
   */
  static fromPersistence(data: any): Plant {
    const id = PlantId.create(data.id);
    const botanicalName = BotanicalName.create(data.botanicalName);
    const commonName = CommonName.create(data.commonName);
    
    const taxonomy = Taxonomy.create({
      family: data.family,
      genus: data.genus ? (data.genus.charAt(0).toUpperCase() + data.genus.slice(1)) : "Unknown",
      species: data.species ? data.species.toLowerCase() : "sp."
    });
    
    const growthCharacteristics = GrowthCharacteristics.create({
      growthHabit: data.growthHabit,
      lifespan: data.lifespan,
      hardinessZones: data.hardinessZones,
      heightMatureCm: data.heightMatureCm,
      spreadMatureCm: data.spreadMatureCm
    });
    
    return Plant.create(
      id,
      botanicalName,
      commonName,
      taxonomy,
      growthCharacteristics,
      data.description,
      data.nativeRange,
      data.createdAt,
      data.updatedAt
    );
  }
}
