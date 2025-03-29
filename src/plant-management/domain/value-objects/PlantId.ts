import { ValueObject } from "./ValueObject.ts";

/**
 * Represents a plant identifier in the domain
 */
export class PlantId extends ValueObject<number> {
  protected validate(value: number): void {
    if (value <= 0) {
      throw new Error("Plant ID must be a positive number");
    }
  }

  protected equalsCore(other: ValueObject<number>): boolean {
    return this.value === other.value;
  }

  /**
   * Create a new PlantId from a raw number
   */
  static create(id: number): PlantId {
    return new PlantId(id);
  }
}
