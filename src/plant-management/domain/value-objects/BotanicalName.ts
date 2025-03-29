import { ValueObject } from "./ValueObject.ts";

/**
 * Represents a botanical name in the domain
 * Botanical names follow specific formatting rules and are unique identifiers for plants
 */
export class BotanicalName extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Botanical name cannot be empty");
    }
    
    if (value.length > 255) {
      throw new Error("Botanical name cannot exceed 255 characters");
    }
    
    // Basic validation for botanical name format (Genus species)
    // This could be enhanced with more specific botanical naming rules
    const parts = value.trim().split(' ');
    if (parts.length < 2) {
      throw new Error("Botanical name must include at least genus and species");
    }
    
    // First part (genus) should be capitalized
    if (parts[0][0] !== parts[0][0].toUpperCase()) {
      throw new Error("Genus must start with a capital letter");
    }
    
    // Second part (species) should be lowercase
    if (parts[1] !== parts[1].toLowerCase()) {
      throw new Error("Species must be lowercase");
    }
  }

  protected equalsCore(other: ValueObject<string>): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
  
  /**
   * Get the genus part of the botanical name
   */
  get genus(): string {
    return this.value.split(' ')[0];
  }
  
  /**
   * Get the species part of the botanical name
   */
  get species(): string {
    const parts = this.value.split(' ');
    return parts.length > 1 ? parts[1] : '';
  }
  
  /**
   * Format the botanical name in italics for display
   */
  toHtml(): string {
    return `<i>${this.value}</i>`;
  }
  
  /**
   * Create a new BotanicalName from a string
   */
  static create(name: string): BotanicalName {
    return new BotanicalName(name);
  }
}
