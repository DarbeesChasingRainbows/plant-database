/**
 * Base class for all value objects in the plant management domain.
 * Value objects are immutable and represent concepts in the domain.
 */
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  /**
   * Get the raw value of the value object
   */
  get value(): T {
    return this._value;
  }

  /**
   * Validate the value object
   * @param value The value to validate
   * @throws Error if validation fails
   */
  protected abstract validate(value: T): void;

  /**
   * Compare this value object with another
   * @param other The other value object to compare with
   * @returns true if the value objects are equal
   */
  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    
    if (!(other instanceof this.constructor)) {
      return false;
    }
    
    return this.equalsCore(other);
  }

  /**
   * Core equality comparison logic
   * @param other The other value object to compare with
   * @returns true if the value objects are equal
   */
  protected abstract equalsCore(other: ValueObject<T>): boolean;
}
