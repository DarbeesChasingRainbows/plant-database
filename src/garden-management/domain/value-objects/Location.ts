import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Interface for location properties
 */
interface LocationProps {
  x: number;
  y: number;
  zone?: string;
  description?: string;
}

/**
 * Represents the location of a garden element
 */
export class Location extends ValueObject<LocationProps> {
  protected validate(value: LocationProps): void {
    if (value.x < 0) {
      throw new Error("X coordinate cannot be negative");
    }
    
    if (value.y < 0) {
      throw new Error("Y coordinate cannot be negative");
    }
    
    if (value.description && value.description.length > 255) {
      throw new Error("Description cannot exceed 255 characters");
    }
  }

  protected equalsCore(other: ValueObject<LocationProps>): boolean {
    return (
      this.value.x === other.value.x &&
      this.value.y === other.value.y &&
      this.value.zone === other.value.zone
    );
  }
  
  /**
   * Get the X coordinate
   */
  get x(): number {
    return this.value.x;
  }
  
  /**
   * Get the Y coordinate
   */
  get y(): number {
    return this.value.y;
  }
  
  /**
   * Get the zone (if defined)
   */
  get zone(): string | undefined {
    return this.value.zone;
  }
  
  /**
   * Get the description (if defined)
   */
  get description(): string | undefined {
    return this.value.description;
  }
  
  /**
   * Get a string representation of the location
   */
  override toString(): string {
    let result = `(${this.value.x}, ${this.value.y})`;
    
    if (this.value.zone) {
      result += ` in ${this.value.zone}`;
    }
    
    return result;
  }
  
  /**
   * Calculate the distance to another location
   */
  distanceTo(other: Location): number {
    const dx = this.value.x - other.value.x;
    const dy = this.value.y - other.value.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Create a new Location value object
   */
  static create(props: LocationProps): Location {
    return new Location(props);
  }
}
