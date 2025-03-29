import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a garden plot identifier in the domain
 */
export class PlotId extends ValueObject<number> {
  protected validate(value: number): void {
    if (value <= 0) {
      throw new Error("Plot ID must be a positive number");
    }
  }

  protected equalsCore(other: ValueObject<number>): boolean {
    return this.value === other.value;
  }

  /**
   * Create a new PlotId from a raw number
   */
  static create(id: number): PlotId {
    return new PlotId(id);
  }
}
