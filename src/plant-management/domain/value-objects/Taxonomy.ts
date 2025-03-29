import { ValueObject } from "./ValueObject.ts";

/**
 * Interface representing the taxonomic classification of a plant
 */
interface TaxonomyProps {
  family?: string;
  genus: string;
  species: string;
  variety?: string;
  cultivar?: string;
}

/**
 * Represents the taxonomic classification of a plant in the domain
 */
export class Taxonomy extends ValueObject<TaxonomyProps> {
  protected validate(value: TaxonomyProps): void {
    // Skip validation if we're using our default values
    if (value.genus === "Unknown" && value.species === "sp.") {
      return;
    }
    
    if (!value.genus || value.genus.trim().length === 0) {
      throw new Error("Genus cannot be empty");
    }
    
    if (!value.species || value.species.trim().length === 0) {
      throw new Error("Species cannot be empty");
    }
    
    if (value.family && value.family.length > 100) {
      throw new Error("Family cannot exceed 100 characters");
    }
    
    if (value.genus.length > 100) {
      throw new Error("Genus cannot exceed 100 characters");
    }
    
    if (value.species.length > 100) {
      throw new Error("Species cannot exceed 100 characters");
    }
    
    // Validate genus is capitalized
    if (value.genus[0] !== value.genus[0].toUpperCase()) {
      throw new Error("Genus must start with a capital letter");
    }
    
    // Validate species is lowercase
    if (value.species !== value.species.toLowerCase()) {
      throw new Error("Species must be lowercase");
    }
  }

  protected equalsCore(other: ValueObject<TaxonomyProps>): boolean {
    const otherTaxonomy = other.value;
    return (
      this.value.family?.toLowerCase() === otherTaxonomy.family?.toLowerCase() &&
      this.value.genus.toLowerCase() === otherTaxonomy.genus.toLowerCase() &&
      this.value.species.toLowerCase() === otherTaxonomy.species.toLowerCase() &&
      this.value.variety?.toLowerCase() === otherTaxonomy.variety?.toLowerCase() &&
      this.value.cultivar?.toLowerCase() === otherTaxonomy.cultivar?.toLowerCase()
    );
  }
  
  /**
   * Get the family of the plant
   */
  get family(): string | undefined {
    return this.value.family;
  }
  
  /**
   * Get the genus of the plant
   */
  get genus(): string {
    return this.value.genus;
  }
  
  /**
   * Get the species of the plant
   */
  get species(): string {
    return this.value.species;
  }
  
  /**
   * Get the variety of the plant
   */
  get variety(): string | undefined {
    return this.value.variety;
  }
  
  /**
   * Get the cultivar of the plant
   */
  get cultivar(): string | undefined {
    return this.value.cultivar;
  }
  
  /**
   * Get the full botanical name including variety and cultivar if available
   */
  get fullBotanicalName(): string {
    let name = `${this.value.genus} ${this.value.species}`;
    
    if (this.value.variety) {
      name += ` var. ${this.value.variety}`;
    }
    
    if (this.value.cultivar) {
      name += ` '${this.value.cultivar}'`;
    }
    
    return name;
  }
  
  /**
   * Create a new Taxonomy from individual components
   */
  static create(props: TaxonomyProps): Taxonomy {
    // Ensure genus is not empty
    if (!props.genus || props.genus.trim().length === 0) {
      props = {
        ...props,
        genus: "Unknown"
      };
    } else {
      // Ensure genus is capitalized
      props = {
        ...props,
        genus: props.genus.charAt(0).toUpperCase() + props.genus.slice(1)
      };
    }
    
    // Ensure species is lowercase and not empty
    if (!props.species || props.species.trim().length === 0) {
      props = {
        ...props,
        species: "sp."
      };
    } else {
      props = {
        ...props,
        species: props.species.toLowerCase()
      };
    }
    
    return new Taxonomy(props);
  }
}
