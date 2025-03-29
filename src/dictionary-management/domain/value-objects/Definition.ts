import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a definition for a dictionary term
 */
export class Definition extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("Definition cannot be empty");
    }
    
    if (this.value.length > 5000) {
      throw new Error("Definition is too long (maximum 5000 characters)");
    }
  }

  equals(other: Definition): boolean {
    return other.value === this.value;
  }

  toString(): string {
    return this.value;
  }
}
