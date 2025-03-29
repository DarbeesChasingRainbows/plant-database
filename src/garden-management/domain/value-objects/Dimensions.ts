import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Interface for dimensions properties
 */
interface DimensionsProps {
  widthCm: number;
  lengthCm: number;
  heightCm?: number;
}

/**
 * Represents the physical dimensions of a garden element
 */
export class Dimensions extends ValueObject<DimensionsProps> {
  protected validate(value: DimensionsProps): void {
    if (value.widthCm <= 0) {
      throw new Error("Width must be a positive number");
    }
    
    if (value.lengthCm <= 0) {
      throw new Error("Length must be a positive number");
    }
    
    if (value.heightCm !== undefined && value.heightCm <= 0) {
      throw new Error("Height must be a positive number");
    }
  }

  protected equalsCore(other: ValueObject<DimensionsProps>): boolean {
    return (
      this.value.widthCm === other.value.widthCm &&
      this.value.lengthCm === other.value.lengthCm &&
      this.value.heightCm === other.value.heightCm
    );
  }
  
  /**
   * Get the width in centimeters
   */
  get widthCm(): number {
    return this.value.widthCm;
  }
  
  /**
   * Get the length in centimeters
   */
  get lengthCm(): number {
    return this.value.lengthCm;
  }
  
  /**
   * Get the height in centimeters (if defined)
   */
  get heightCm(): number | undefined {
    return this.value.heightCm;
  }
  
  /**
   * Get the width in inches
   */
  get widthInches(): number {
    return Math.round(this.value.widthCm / 2.54 * 10) / 10;
  }
  
  /**
   * Get the length in inches
   */
  get lengthInches(): number {
    return Math.round(this.value.lengthCm / 2.54 * 10) / 10;
  }
  
  /**
   * Get the height in inches (if defined)
   */
  get heightInches(): number | undefined {
    return this.value.heightCm !== undefined 
      ? Math.round(this.value.heightCm / 2.54 * 10) / 10
      : undefined;
  }
  
  /**
   * Get the area in square centimeters
   */
  get areaCm2(): number {
    return this.value.widthCm * this.value.lengthCm;
  }
  
  /**
   * Get the area in square feet
   */
  get areaFt2(): number {
    const areaInches = this.widthInches * this.lengthInches;
    return Math.round(areaInches / 144 * 10) / 10; // 12^2 = 144 sq inches in a sq foot
  }
  
  /**
   * Get the volume in cubic centimeters (if height is defined)
   */
  get volumeCm3(): number | undefined {
    return this.value.heightCm !== undefined
      ? this.value.widthCm * this.value.lengthCm * this.value.heightCm
      : undefined;
  }
  
  /**
   * Create a new Dimensions value object
   */
  static create(props: DimensionsProps): Dimensions {
    return new Dimensions(props);
  }
}
