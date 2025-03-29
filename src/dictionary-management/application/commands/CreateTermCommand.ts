import { DictionaryCategory } from "../../domain/value-objects/Category.ts";

/**
 * Command for creating a new dictionary term
 */
export class CreateTermCommand {
  constructor(
    public readonly term: string,
    public readonly definition: string,
    public readonly category: DictionaryCategory,
    public readonly reference?: string,
    public readonly referenceUrl?: string
  ) {}
}
