import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Enum representing the different categories of dictionary terms
 */
export enum DictionaryCategory {
  MEDICAL = 'medical',
  BOTANICAL = 'botanical',
  HORTICULTURAL = 'horticultural',
  FARMING = 'farming',
  CHEMICAL = 'chemical',
  GENERAL = 'general'
}

/**
 * Represents a category for a dictionary term
 */
export class Category extends ValueObject<DictionaryCategory> {
  constructor(value: DictionaryCategory) {
    super(value);
    this.validate();
  }

  private validate(): void {
    const validCategories = Object.values(DictionaryCategory);
    if (!validCategories.includes(this.value)) {
      throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  equals(other: Category): boolean {
    return other.value === this.value;
  }

  toString(): string {
    return this.value;
  }
}
