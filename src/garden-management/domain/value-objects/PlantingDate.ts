import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a planting date in the domain
 */
export class PlantingDate extends ValueObject<Date> {
  protected validate(value: Date): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("Planting date must be a valid date");
    }
    
    // Optional: Add additional validation rules for planting dates
    // For example, you might want to ensure the date is not in the distant future
    const now = new Date();
    const fiveYearsFromNow = new Date(now);
    fiveYearsFromNow.setFullYear(now.getFullYear() + 5);
    
    if (value > fiveYearsFromNow) {
      throw new Error("Planting date cannot be more than 5 years in the future");
    }
  }

  protected equalsCore(other: ValueObject<Date>): boolean {
    return this.value.getTime() === other.value.getTime();
  }
  
  /**
   * Get the year of the planting date
   */
  get year(): number {
    return this.value.getFullYear();
  }
  
  /**
   * Get the month of the planting date (1-12)
   */
  get month(): number {
    return this.value.getMonth() + 1; // JavaScript months are 0-indexed
  }
  
  /**
   * Get the day of the month of the planting date
   */
  get day(): number {
    return this.value.getDate();
  }
  
  /**
   * Get the season of the planting date
   */
  get season(): 'Winter' | 'Spring' | 'Summer' | 'Fall' {
    const month = this.month;
    
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Fall';
    return 'Winter';
  }
  
  /**
   * Format the date as YYYY-MM-DD
   */
  toISODateString(): string {
    return this.value.toISOString().split('T')[0];
  }
  
  /**
   * Format the date in a human-readable format
   */
  toFormattedString(): string {
    return this.value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  /**
   * Check if the planting date is in the past
   */
  isPast(): boolean {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only, not time
    return this.value < now;
  }
  
  /**
   * Create a new PlantingDate from a Date object
   */
  static create(date: Date): PlantingDate {
    return new PlantingDate(date);
  }
  
  /**
   * Create a new PlantingDate from a string in YYYY-MM-DD format
   */
  static fromISODateString(dateString: string): PlantingDate {
    const date = new Date(dateString);
    return new PlantingDate(date);
  }
  
  /**
   * Create a new PlantingDate from year, month, and day values
   */
  static fromYearMonthDay(year: number, month: number, day: number): PlantingDate {
    const date = new Date(year, month - 1, day); // JavaScript months are 0-indexed
    return new PlantingDate(date);
  }
}
