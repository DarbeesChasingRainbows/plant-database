import { ValueObject } from "./ValueObject.ts";

/**
 * Interface representing growth characteristics of a plant
 */
interface GrowthCharacteristicsProps {
  growthHabit?: string;
  lifespan?: string;
  hardinessZones?: string;
  heightMatureCm?: number;
  spreadMatureCm?: number;
}

/**
 * Represents the growth characteristics of a plant in the domain
 */
export class GrowthCharacteristics extends ValueObject<GrowthCharacteristicsProps> {
  protected validate(value: GrowthCharacteristicsProps): void {
    // Validate height and spread are positive if provided
    if (value.heightMatureCm !== undefined && value.heightMatureCm < 0) {
      throw new Error("Height must be a positive number");
    }
    
    if (value.spreadMatureCm !== undefined && value.spreadMatureCm < 0) {
      throw new Error("Spread must be a positive number");
    }
    
    // Validate string lengths
    if (value.growthHabit && value.growthHabit.length > 100) {
      throw new Error("Growth habit cannot exceed 100 characters");
    }
    
    if (value.lifespan && value.lifespan.length > 50) {
      throw new Error("Lifespan cannot exceed 50 characters");
    }
    
    if (value.hardinessZones && value.hardinessZones.length > 50) {
      throw new Error("Hardiness zones cannot exceed 50 characters");
    }
  }

  protected equalsCore(other: ValueObject<GrowthCharacteristicsProps>): boolean {
    const otherProps = other.value;
    return (
      this.value.growthHabit === otherProps.growthHabit &&
      this.value.lifespan === otherProps.lifespan &&
      this.value.hardinessZones === otherProps.hardinessZones &&
      this.value.heightMatureCm === otherProps.heightMatureCm &&
      this.value.spreadMatureCm === otherProps.spreadMatureCm
    );
  }
  
  /**
   * Get the growth habit of the plant
   */
  get growthHabit(): string | undefined {
    return this.value.growthHabit;
  }
  
  /**
   * Get the lifespan of the plant
   */
  get lifespan(): string | undefined {
    return this.value.lifespan;
  }
  
  /**
   * Get the hardiness zones of the plant
   */
  get hardinessZones(): string | undefined {
    return this.value.hardinessZones;
  }
  
  /**
   * Get the mature height of the plant in centimeters
   */
  get heightMatureCm(): number | undefined {
    return this.value.heightMatureCm;
  }
  
  /**
   * Get the mature spread of the plant in centimeters
   */
  get spreadMatureCm(): number | undefined {
    return this.value.spreadMatureCm;
  }
  
  /**
   * Get the mature height of the plant in inches (converted from cm)
   */
  get heightMatureInches(): number | undefined {
    return this.value.heightMatureCm !== undefined 
      ? Math.round(this.value.heightMatureCm / 2.54 * 10) / 10
      : undefined;
  }
  
  /**
   * Get the mature spread of the plant in inches (converted from cm)
   */
  get spreadMatureInches(): number | undefined {
    return this.value.spreadMatureCm !== undefined 
      ? Math.round(this.value.spreadMatureCm / 2.54 * 10) / 10
      : undefined;
  }
  
  /**
   * Create a new GrowthCharacteristics value object
   */
  static create(props: GrowthCharacteristicsProps): GrowthCharacteristics {
    return new GrowthCharacteristics(props);
  }
}
