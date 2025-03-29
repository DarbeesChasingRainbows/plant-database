import { ValueObject } from "./ValueObject.ts";

/**
 * Represents a common name for a plant in the domain
 */
export class CommonName extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Common name cannot be empty");
    }
    
    if (value.length > 255) {
      throw new Error("Common name cannot exceed 255 characters");
    }
  }

  protected equalsCore(other: ValueObject<string>): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
  
  /**
   * Format the common name for display
   */
  toString(): string {
    return this.value;
  }
  
  /**
   * Create a new CommonName from a string
   */
  static create(name: string): CommonName {
    return new CommonName(name);
  }
}
