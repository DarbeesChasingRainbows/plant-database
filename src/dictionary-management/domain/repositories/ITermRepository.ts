import { Term } from "../entities/Term.ts";
import { TermId } from "../value-objects/TermId.ts";
import { Category, DictionaryCategory } from "../value-objects/Category.ts";

/**
 * Interface for term repository operations
 */
export interface ITermRepository {
  /**
   * Find a term by its ID
   */
  findById(id: TermId): Promise<Term | null>;
  
  /**
   * Find terms by exact term match
   */
  findByExactTerm(term: string): Promise<Term[]>;
  
  /**
   * Search terms by partial term match
   */
  searchByTerm(searchTerm: string): Promise<Term[]>;
  
  /**
   * Find terms by category
   */
  findByCategory(category: Category): Promise<Term[]>;
  
  /**
   * Find related terms for a given term ID
   */
  findRelatedTerms(termId: TermId): Promise<Term[]>;
  
  /**
   * Save a term (create or update)
   */
  save(term: Term): Promise<Term>;
  
  /**
   * Delete a term by ID
   */
  delete(id: TermId): Promise<boolean>;
  
  /**
   * Add a relationship between two terms
   */
  addRelationship(termId: TermId, relatedTermId: TermId, relationshipType?: string): Promise<void>;
  
  /**
   * Remove a relationship between two terms
   */
  removeRelationship(termId: TermId, relatedTermId: TermId): Promise<void>;
}
