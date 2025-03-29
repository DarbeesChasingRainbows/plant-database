import { TermId } from "../value-objects/TermId.ts";
import { Definition } from "../value-objects/Definition.ts";
import { Category, DictionaryCategory } from "../value-objects/Category.ts";
import { Reference } from "../value-objects/Reference.ts";

/**
 * Represents a dictionary term entity
 */
export class Term {
  private _id: TermId;
  private _term: string;
  private _definition: Definition;
  private _category: Category;
  private _reference?: Reference;
  private _relatedTermIds: TermId[] = [];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: TermId,
    term: string,
    definition: Definition,
    category: Category,
    reference?: Reference,
    relatedTermIds: TermId[] = [],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._term = term;
    this._definition = definition;
    this._category = category;
    this._reference = reference;
    this._relatedTermIds = relatedTermIds;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    
    this.validate();
  }

  get id(): TermId {
    return this._id;
  }

  get term(): string {
    return this._term;
  }

  get definition(): Definition {
    return this._definition;
  }

  get category(): Category {
    return this._category;
  }

  get reference(): Reference | undefined {
    return this._reference;
  }

  get relatedTermIds(): TermId[] {
    return [...this._relatedTermIds];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateDefinition(definition: Definition): void {
    this._definition = definition;
    this._updatedAt = new Date();
  }

  updateCategory(category: Category): void {
    this._category = category;
    this._updatedAt = new Date();
  }

  updateReference(reference?: Reference): void {
    this._reference = reference;
    this._updatedAt = new Date();
  }

  addRelatedTerm(termId: TermId): void {
    if (!this._relatedTermIds.some(id => id.equals(termId))) {
      this._relatedTermIds.push(termId);
      this._updatedAt = new Date();
    }
  }

  removeRelatedTerm(termId: TermId): void {
    this._relatedTermIds = this._relatedTermIds.filter(id => !id.equals(termId));
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._term || this._term.trim().length === 0) {
      throw new Error("Term cannot be empty");
    }
    
    if (this._term.length > 100) {
      throw new Error("Term is too long (maximum 100 characters)");
    }
  }

  toJSON() {
    return {
      id: this._id.value,
      term: this._term,
      definition: this._definition.value,
      category: this._category.value,
      reference: this._reference ? {
        source: this._reference.value,
        url: this._reference.url
      } : undefined,
      relatedTermIds: this._relatedTermIds.map(id => id.value),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
