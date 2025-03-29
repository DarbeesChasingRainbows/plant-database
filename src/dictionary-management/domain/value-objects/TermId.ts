import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a unique identifier for a dictionary term
 */
export class TermId extends ValueObject<number> {
  constructor(value: number) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!Number.isInteger(this.value) || this.value <= 0) {
      throw new Error("TermId must be a positive integer");
    }
  }

  equals(other: TermId): boolean {
    return other.value === this.value;
  }

  toString(): string {
    return String(this.value);
  }
}
