import { eq, like, inArray } from "drizzle-orm";
import { db } from "../../../../utils/client.ts";
import { dictionaryTerms, relatedTerms } from "../../../../utils/dictionary-schema.ts";
import { ITermRepository } from "../../domain/repositories/ITermRepository.ts";
import { Term } from "../../domain/entities/Term.ts";
import { TermId } from "../../domain/value-objects/TermId.ts";
import { Definition } from "../../domain/value-objects/Definition.ts";
import { Category, DictionaryCategory } from "../../domain/value-objects/Category.ts";
import { Reference } from "../../domain/value-objects/Reference.ts";

/**
 * Drizzle ORM implementation of the Term repository
 */
export class DrizzleTermRepository implements ITermRepository {
  async findById(id: TermId): Promise<Term | null> {
    const result = await db.select().from(dictionaryTerms).where(eq(dictionaryTerms.id, id.value)).limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    const termData = result[0];
    return this.mapToEntity(termData);
  }
  
  async findByExactTerm(term: string): Promise<Term[]> {
    const results = await db.select().from(dictionaryTerms).where(eq(dictionaryTerms.term, term));
    return Promise.all(results.map(this.mapToEntity.bind(this)));
  }
  
  async searchByTerm(searchTerm: string): Promise<Term[]> {
    const results = await db.select().from(dictionaryTerms).where(like(dictionaryTerms.term, `%${searchTerm}%`));
    return Promise.all(results.map(this.mapToEntity.bind(this)));
  }
  
  async findByCategory(category: Category): Promise<Term[]> {
    const results = await db.select().from(dictionaryTerms).where(eq(dictionaryTerms.category, category.value));
    return Promise.all(results.map(this.mapToEntity.bind(this)));
  }
  
  async findRelatedTerms(termId: TermId): Promise<Term[]> {
    const relationships = await db.select().from(relatedTerms).where(eq(relatedTerms.termId, termId.value));
    
    if (relationships.length === 0) {
      return [];
    }
    
    const relatedIds = relationships.map(rel => rel.relatedTermId);
    const results = await db.select().from(dictionaryTerms).where(inArray(dictionaryTerms.id, relatedIds));
    
    return Promise.all(results.map(this.mapToEntity.bind(this)));
  }
  
  async save(term: Term): Promise<Term> {
    const termData = {
      id: term.id.value,
      term: term.term,
      definition: term.definition.value,
      category: term.category.value,
      reference: term.reference?.value,
      url: term.reference?.url,
      updatedAt: new Date()
    };
    
    // Check if term exists
    const existingTerm = await this.findById(term.id);
    
    if (existingTerm) {
      // Update existing term
      await db.update(dictionaryTerms)
        .set(termData)
        .where(eq(dictionaryTerms.id, term.id.value));
    } else {
      // Create new term
      await db.insert(dictionaryTerms).values({
        ...termData,
        createdAt: new Date()
      });
    }
    
    // Update related terms
    await this.updateRelatedTerms(term);
    
    return term;
  }
  
  async delete(id: TermId): Promise<boolean> {
    // Delete related terms relationships first
    await db.delete(relatedTerms).where(eq(relatedTerms.termId, id.value));
    await db.delete(relatedTerms).where(eq(relatedTerms.relatedTermId, id.value));
    
    // Delete the term
    const result = await db.delete(dictionaryTerms).where(eq(dictionaryTerms.id, id.value));
    return true;
  }
  
  async addRelationship(termId: TermId, relatedTermId: TermId, relationshipType?: string): Promise<void> {
    // Check if relationship already exists
    const existing = await db.select()
      .from(relatedTerms)
      .where(eq(relatedTerms.termId, termId.value))
      .where(eq(relatedTerms.relatedTermId, relatedTermId.value))
      .limit(1);
    
    if (existing.length === 0) {
      // Create new relationship
      await db.insert(relatedTerms).values({
        termId: termId.value,
        relatedTermId: relatedTermId.value,
        relationshipType: relationshipType || null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  
  async removeRelationship(termId: TermId, relatedTermId: TermId): Promise<void> {
    await db.delete(relatedTerms)
      .where(eq(relatedTerms.termId, termId.value))
      .where(eq(relatedTerms.relatedTermId, relatedTermId.value));
  }
  
  private async mapToEntity(data: any): Promise<Term> {
    // Get related term IDs
    const relationships = await db.select()
      .from(relatedTerms)
      .where(eq(relatedTerms.termId, data.id));
    
    const relatedTermIds = relationships.map(rel => new TermId(rel.relatedTermId));
    
    return new Term(
      new TermId(data.id),
      data.term,
      new Definition(data.definition),
      new Category(data.category as DictionaryCategory),
      data.reference ? new Reference(data.reference, data.url) : undefined,
      relatedTermIds,
      data.createdAt,
      data.updatedAt
    );
  }
  
  private async updateRelatedTerms(term: Term): Promise<void> {
    // Get current relationships
    const currentRelationships = await db.select()
      .from(relatedTerms)
      .where(eq(relatedTerms.termId, term.id.value));
    
    const currentRelatedIds = currentRelationships.map(rel => rel.relatedTermId);
    const newRelatedIds = term.relatedTermIds.map(id => id.value);
    
    // Remove relationships that are no longer present
    const idsToRemove = currentRelatedIds.filter(id => !newRelatedIds.includes(id));
    if (idsToRemove.length > 0) {
      await db.delete(relatedTerms)
        .where(eq(relatedTerms.termId, term.id.value))
        .where(inArray(relatedTerms.relatedTermId, idsToRemove));
    }
    
    // Add new relationships
    const idsToAdd = newRelatedIds.filter(id => !currentRelatedIds.includes(id));
    for (const idToAdd of idsToAdd) {
      await this.addRelationship(term.id, new TermId(idToAdd));
    }
  }
}
