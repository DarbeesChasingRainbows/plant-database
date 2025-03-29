import { Term } from "../entities/Term.ts";
import { TermId } from "../value-objects/TermId.ts";
import { Definition } from "../value-objects/Definition.ts";
import { Category, DictionaryCategory } from "../value-objects/Category.ts";
import { Reference } from "../value-objects/Reference.ts";
import { ITermRepository } from "../repositories/ITermRepository.ts";

/**
 * Service for handling term operations
 */
export class TermService {
  private repository: ITermRepository;

  constructor(repository: ITermRepository) {
    this.repository = repository;
  }

  /**
   * Create a new term
   */
  async createTerm(
    term: string,
    definition: string,
    category: DictionaryCategory,
    reference?: string,
    referenceUrl?: string
  ): Promise<Term> {
    // Check if term already exists
    const existingTerms = await this.repository.findByExactTerm(term);
    
    if (existingTerms.length > 0) {
      throw new Error(`Term '${term}' already exists in the ${existingTerms[0].category.value} dictionary`);
    }

    // Create value objects
    const termId = new TermId(Date.now()); // Temporary ID, will be replaced by DB
    const definitionObj = new Definition(definition);
    const categoryObj = new Category(category);
    const referenceObj = reference ? new Reference(reference, referenceUrl) : undefined;

    // Create term entity
    const newTerm = new Term(
      termId,
      term,
      definitionObj,
      categoryObj,
      referenceObj
    );

    // Save to repository
    return await this.repository.save(newTerm);
  }

  /**
   * Update an existing term
   */
  async updateTerm(
    id: number,
    definition?: string,
    category?: DictionaryCategory,
    reference?: string,
    referenceUrl?: string
  ): Promise<Term> {
    const termId = new TermId(id);
    const term = await this.repository.findById(termId);
    
    if (!term) {
      throw new Error(`Term with ID ${id} not found`);
    }

    // Update definition if provided
    if (definition) {
      term.updateDefinition(new Definition(definition));
    }

    // Update category if provided
    if (category) {
      term.updateCategory(new Category(category));
    }

    // Update reference if provided
    if (reference !== undefined) {
      term.updateReference(reference ? new Reference(reference, referenceUrl) : undefined);
    }

    // Save changes
    return await this.repository.save(term);
  }

  /**
   * Delete a term
   */
  async deleteTerm(id: number): Promise<boolean> {
    const termId = new TermId(id);
    return await this.repository.delete(termId);
  }

  /**
   * Add a relationship between two terms
   */
  async addRelatedTerm(termId: number, relatedTermId: number): Promise<void> {
    const term = await this.repository.findById(new TermId(termId));
    const relatedTerm = await this.repository.findById(new TermId(relatedTermId));
    
    if (!term) {
      throw new Error(`Term with ID ${termId} not found`);
    }
    
    if (!relatedTerm) {
      throw new Error(`Related term with ID ${relatedTermId} not found`);
    }
    
    // Add relationship in both directions for bidirectional relationship
    await this.repository.addRelationship(new TermId(termId), new TermId(relatedTermId));
    await this.repository.addRelationship(new TermId(relatedTermId), new TermId(termId));
  }

  /**
   * Remove a relationship between two terms
   */
  async removeRelatedTerm(termId: number, relatedTermId: number): Promise<void> {
    // Remove relationship in both directions
    await this.repository.removeRelationship(new TermId(termId), new TermId(relatedTermId));
    await this.repository.removeRelationship(new TermId(relatedTermId), new TermId(termId));
  }

  /**
   * Search for terms
   */
  async searchTerms(searchTerm: string, category?: DictionaryCategory): Promise<Term[]> {
    let results = await this.repository.searchByTerm(searchTerm);
    
    // Filter by category if provided
    if (category) {
      results = results.filter(term => term.category.value === category);
    }
    
    return results;
  }

  /**
   * Get terms by category
   */
  async getTermsByCategory(category: DictionaryCategory): Promise<Term[]> {
    return await this.repository.findByCategory(new Category(category));
  }

  /**
   * Get related terms
   */
  async getRelatedTerms(termId: number): Promise<Term[]> {
    return await this.repository.findRelatedTerms(new TermId(termId));
  }
}
