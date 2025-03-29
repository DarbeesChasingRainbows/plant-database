import { GardenBedId } from "../value-objects/GardenBedId.ts";
import { Dimensions } from "../value-objects/Dimensions.ts";
import { Location } from "../value-objects/Location.ts";

/**
 * Interface for garden bed properties
 */
export interface GardenBedProps {
  id: GardenBedId;
  name: string;
  dimensions: Dimensions;
  location?: Location;
  soilType?: string;
  sunExposure?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Garden Bed entity - an aggregate root in the Garden Management bounded context
 */
export class GardenBed {
  private readonly props: GardenBedProps;
  
  private constructor(props: GardenBedProps) {
    this.validateProps(props);
    this.props = props;
  }
  
  private validateProps(props: GardenBedProps): void {
    if (!props.name || props.name.trim() === '') {
      throw new Error("Garden bed name cannot be empty");
    }
    
    if (props.name.length > 100) {
      throw new Error("Garden bed name cannot exceed 100 characters");
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
   * Get the garden bed ID
   */
  get id(): GardenBedId {
    return this.props.id;
  }
  
  /**
   * Get the garden bed name
   */
  get name(): string {
    return this.props.name;
  }
  
  /**
   * Get the garden bed dimensions
   */
  get dimensions(): Dimensions {
    return this.props.dimensions;
  }
  
  /**
   * Get the garden bed location
   */
  get location(): Location | undefined {
    return this.props.location;
  }
  
  /**
   * Get the garden bed soil type
   */
  get soilType(): string | undefined {
    return this.props.soilType;
  }
  
  /**
   * Get the garden bed sun exposure
   */
  get sunExposure(): string | undefined {
    return this.props.sunExposure;
  }
  
  /**
   * Get the garden bed notes
   */
  get notes(): string | undefined {
    return this.props.notes;
  }
  
  /**
   * Get the garden bed creation date
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }
  
  /**
   * Get the garden bed last update date
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  
  /**
   * Update the garden bed name
   */
  updateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error("Garden bed name cannot be empty");
    }
    
    if (name.length > 100) {
      throw new Error("Garden bed name cannot exceed 100 characters");
    }
    
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the garden bed dimensions
   */
  updateDimensions(dimensions: Dimensions): void {
    this.props.dimensions = dimensions;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the garden bed location
   */
  updateLocation(location?: Location): void {
    this.props.location = location;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the garden bed soil type
   */
  updateSoilType(soilType?: string): void {
    if (soilType && soilType.length > 100) {
      throw new Error("Soil type cannot exceed 100 characters");
    }
    
    this.props.soilType = soilType;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the garden bed sun exposure
   */
  updateSunExposure(sunExposure?: string): void {
    if (sunExposure && sunExposure.length > 50) {
      throw new Error("Sun exposure cannot exceed 50 characters");
    }
    
    this.props.sunExposure = sunExposure;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Update the garden bed notes
   */
  updateNotes(notes?: string): void {
    if (notes && notes.length > 1000) {
      throw new Error("Notes cannot exceed 1000 characters");
    }
    
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }
  
  /**
   * Calculate the garden bed area in square feet
   */
  getAreaInSquareFeet(): number {
    return this.props.dimensions.areaFt2;
  }
  
  /**
   * Create a new garden bed entity
   */
  static create(props: Omit<GardenBedProps, 'createdAt' | 'updatedAt'>): GardenBed {
    const now = new Date();
    
    return new GardenBed({
      ...props,
      createdAt: now,
      updatedAt: now
    });
  }
  
  /**
   * Reconstitute a garden bed entity from persistence
   */
  static reconstitute(props: GardenBedProps): GardenBed {
    return new GardenBed(props);
  }
}
