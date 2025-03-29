import { PlantingId } from "../value-objects/PlantingId.ts";
import { PlotId } from "../value-objects/PlotId.ts";
import { PlantingDate } from "../value-objects/PlantingDate.ts";
import { PlantId } from "../../../plant-management/domain/value-objects/PlantId.ts";

/**
 * Enum for planting status
 */
export enum PlantingStatus {
  PLANNED = 'PLANNED',
  PLANTED = 'PLANTED',
  GROWING = 'GROWING',
  HARVESTING = 'HARVESTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Interface for planting properties
 */
export interface PlantingProps {
  id: PlantingId;
  plotId: PlotId;
  plantId: PlantId;
  plantingDate: PlantingDate;
  harvestDate?: Date;
  status: PlantingStatus;
  quantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Planting entity - represents a plant planted in a plot
 */
export class Planting {
  private readonly props: PlantingProps;
  
  private constructor(props: PlantingProps) {
    this.validateProps(props);
    this.props = props;
  }
  
  private validateProps(props: PlantingProps): void {
    if (props.quantity <= 0) {
      throw new Error("Quantity must be a positive number");
    }
    
    if (props.notes && props.notes.length > 1000) {
      throw new Error("Notes cannot exceed 1000 characters");
    }
    
    if (props.harvestDate && props.harvestDate < props.plantingDate.value) {
      throw new Error("Harvest date cannot be before planting date");
    }
  }
  
  /**
   * Get the planting ID
   */
  get id(): PlantingId {
    return this.props.id;
  }
  
  /**
   * Get the plot ID
   */
  get plotId(): PlotId {
    return this.props.plotId;
  }
  
  /**
   * Get the plant ID
   */
  get plantId(): PlantId {
    return this.props.plantId;
  }
  
  /**
   * Get the planting date
   */
  get plantingDate(): PlantingDate {
    return this.props.plantingDate;
  }
  
  /**
   * Get the harvest date
   */
  get harvestDate(): Date | undefined {
    return this.props.harvestDate;
  }
  
  /**
   * Get the planting status
   */
  get status(): PlantingStatus {
    return this.props.status;
  }
  
  /**
   * Get the quantity
   */
  get quantity(): number {
    return this.props.quantity;
  }
  
  /**
   * Get the notes
   */
  get notes(): string | undefined {
    return this.props.notes;
  }
  
  /**
   * Get the creation date
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }
  
  /**
   * Get the last update date
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  
  /**
   * Update the planting date
   */
  updatePlantingDate(plantingDate: PlantingDate): void {
    if (this.props.harvestDate && plantingDate.value > this.props.harvestDate) {
      throw new Error("Planting date cannot be after harvest date");
    }
    
    this.props.plantingDate = plantingDate;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the harvest date
   */
  updateHarvestDate(harvestDate?: Date): void {
    if (harvestDate && harvestDate < this.props.plantingDate.value) {
      throw new Error("Harvest date cannot be before planting date");
    }
    
    this.props.harvestDate = harvestDate;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the status
   */
  updateStatus(status: PlantingStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
    
    // Automatically update related properties based on status
    if (status === PlantingStatus.COMPLETED || status === PlantingStatus.HARVESTING) {
      if (!this.props.harvestDate) {
        this.props.harvestDate = new Date();
      }
    }
  }
  
  /**
   * Update the quantity
   */
  updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be a positive number");
    }
    
    this.props.quantity = quantity;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the notes
   */
  updateNotes(notes?: string): void {
    if (notes && notes.length > 1000) {
      throw new Error("Notes cannot exceed 1000 characters");
    }
    
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Mark the planting as planted
   */
  markAsPlanted(): void {
    if (this.props.status !== PlantingStatus.PLANNED) {
      throw new Error("Only planned plantings can be marked as planted");
    }
    
    this.props.status = PlantingStatus.PLANTED;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Mark the planting as growing
   */
  markAsGrowing(): void {
    if (this.props.status !== PlantingStatus.PLANTED) {
      throw new Error("Only planted plantings can be marked as growing");
    }
    
    this.props.status = PlantingStatus.GROWING;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Mark the planting as harvesting
   */
  markAsHarvesting(): void {
    if (this.props.status !== PlantingStatus.GROWING) {
      throw new Error("Only growing plantings can be marked as harvesting");
    }
    
    this.props.status = PlantingStatus.HARVESTING;
    
    if (!this.props.harvestDate) {
      this.props.harvestDate = new Date();
    }
    
    this.props.updatedAt = new Date();
  }
  
  /**
   * Mark the planting as completed
   */
  markAsCompleted(): void {
    if (this.props.status !== PlantingStatus.HARVESTING) {
      throw new Error("Only harvesting plantings can be marked as completed");
    }
    
    this.props.status = PlantingStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Mark the planting as failed
   */
  markAsFailed(notes?: string): void {
    this.props.status = PlantingStatus.FAILED;
    
    if (notes) {
      this.updateNotes(notes);
    }
    
    this.props.updatedAt = new Date();
  }
  
  /**
   * Calculate days since planting
   */
  getDaysSincePlanting(): number {
    const now = new Date();
    const plantingDate = this.props.plantingDate.value;
    const diffTime = Math.abs(now.getTime() - plantingDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Calculate days until expected harvest (if harvest date is set)
   */
  getDaysUntilHarvest(): number | undefined {
    if (!this.props.harvestDate) {
      return undefined;
    }
    
    const now = new Date();
    const harvestDate = this.props.harvestDate;
    
    if (now > harvestDate) {
      return 0;
    }
    
    const diffTime = Math.abs(harvestDate.getTime() - now.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Create a new planting entity
   */
  static create(props: Omit<PlantingProps, 'createdAt' | 'updatedAt' | 'status'>): Planting {
    const now = new Date();
    
    return new Planting({
      ...props,
      status: PlantingStatus.PLANNED,
      createdAt: now,
      updatedAt: now
    });
  }
  
  /**
   * Reconstitute a planting entity from persistence
   */
  static reconstitute(props: PlantingProps): Planting {
    return new Planting(props);
  }
}
