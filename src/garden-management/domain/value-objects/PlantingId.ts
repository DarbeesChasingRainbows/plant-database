import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a planting identifier in the domain
 */
export class PlantingId extends ValueObject<number> {
  protected validate(value: number): void {
    if (value <= 0) {
      throw new Error("Planting ID must be a positive number");
    }
  }

  protected equalsCore(other: ValueObject<number>): boolean {
    return this.value === other.value;
  }

  /**
   * Create a new PlantingId from a raw number
   */
  static create(id: number): PlantingId {
    return new PlantingId(id);
  }
}
