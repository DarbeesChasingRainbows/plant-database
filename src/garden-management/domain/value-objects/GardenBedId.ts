import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a garden bed identifier in the domain
 */
export class GardenBedId extends ValueObject<number> {
  protected validate(value: number): void {
    if (value <= 0) {
      throw new Error("Garden bed ID must be a positive number");
    }
  }

  protected equalsCore(other: ValueObject<number>): boolean {
    return this.value === other.value;
  }

  /**
   * Create a new GardenBedId from a raw number
   */
  static create(id: number): GardenBedId {
    return new GardenBedId(id);
  }
}
