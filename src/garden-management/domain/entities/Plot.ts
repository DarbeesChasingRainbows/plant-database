import { PlotId } from "../value-objects/PlotId.ts";
import { GardenBedId } from "../value-objects/GardenBedId.ts";
import { Dimensions } from "../value-objects/Dimensions.ts";
import { Location } from "../value-objects/Location.ts";

/**
 * Interface for plot properties
 */
export interface PlotProps {
  id: PlotId;
  gardenBedId: GardenBedId;
  name: string;
  dimensions: Dimensions;
  location?: Location;
  soilType?: string;
  sunExposure?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Plot entity - an aggregate root in the Garden Management bounded context
 */
export class Plot {
  private readonly props: PlotProps;
  
  private constructor(props: PlotProps) {
    this.validateProps(props);
    this.props = props;
  }
  
  private validateProps(props: PlotProps): void {
    if (!props.name || props.name.trim() === '') {
      throw new Error("Plot name cannot be empty");
    }
    
    if (props.name.length > 100) {
      throw new Error("Plot name cannot exceed 100 characters");
    }
    
    if (props.soilType && props.soilType.length > 100) {
      throw new Error("Soil type cannot exceed 100 characters");
    }
    
    if (props.sunExposure && props.sunExposure.length > 50) {
      throw new Error("Sun exposure cannot exceed 50 characters");
    }
    
    if (props.notes && props.notes.length > 1000) {
      throw new Error("Notes cannot exceed 1000 characters");
    }
  }
  
  /**
   * Get the plot ID
   */
  get id(): PlotId {
    return this.props.id;
  }
  
  /**
   * Get the garden bed ID this plot belongs to
   */
  get gardenBedId(): GardenBedId {
    return this.props.gardenBedId;
  }
  
  /**
   * Get the plot name
   */
  get name(): string {
    return this.props.name;
  }
  
  /**
   * Get the plot dimensions
   */
  get dimensions(): Dimensions {
    return this.props.dimensions;
  }
  
  /**
   * Get the plot location
   */
  get location(): Location | undefined {
    return this.props.location;
  }
  
  /**
   * Get the plot soil type
   */
  get soilType(): string | undefined {
    return this.props.soilType;
  }
  
  /**
   * Get the plot sun exposure
   */
  get sunExposure(): string | undefined {
    return this.props.sunExposure;
  }
  
  /**
   * Get the plot notes
   */
  get notes(): string | undefined {
    return this.props.notes;
  }
  
  /**
   * Check if the plot is active
   */
  get isActive(): boolean {
    return this.props.isActive;
  }
  
  /**
   * Get the plot creation date
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }
  
  /**
   * Get the plot last update date
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  
  /**
   * Update the plot name
   */
  updateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error("Plot name cannot be empty");
    }
    
    if (name.length > 100) {
      throw new Error("Plot name cannot exceed 100 characters");
    }
    
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the plot dimensions
   */
  updateDimensions(dimensions: Dimensions): void {
    this.props.dimensions = dimensions;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the plot location
   */
  updateLocation(location?: Location): void {
    this.props.location = location;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the plot soil type
   */
  updateSoilType(soilType?: string): void {
    if (soilType && soilType.length > 100) {
      throw new Error("Soil type cannot exceed 100 characters");
    }
    
    this.props.soilType = soilType;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the plot sun exposure
   */
  updateSunExposure(sunExposure?: string): void {
    if (sunExposure && sunExposure.length > 50) {
      throw new Error("Sun exposure cannot exceed 50 characters");
    }
    
    this.props.sunExposure = sunExposure;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the plot notes
   */
  updateNotes(notes?: string): void {
    if (notes && notes.length > 1000) {
      throw new Error("Notes cannot exceed 1000 characters");
    }
    
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Activate the plot
   */
  activate(): void {
    if (this.props.isActive) return;
    
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Deactivate the plot
   */
  deactivate(): void {
    if (!this.props.isActive) return;
    
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Calculate the plot area in square feet
   */
  getAreaInSquareFeet(): number {
    return this.props.dimensions.areaFt2;
  }
  
  /**
   * Create a new plot entity
   */
  static create(props: Omit<PlotProps, 'createdAt' | 'updatedAt' | 'isActive'>): Plot {
    const now = new Date();
    
    return new Plot({
      ...props,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }
  
  /**
   * Reconstitute a plot entity from persistence
   */
  static reconstitute(props: PlotProps): Plot {
    return new Plot(props);
  }
}
