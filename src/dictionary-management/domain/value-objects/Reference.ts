import { ValueObject } from "../../../plant-management/domain/value-objects/ValueObject.ts";

/**
 * Represents a reference source for a dictionary term
 */
export class Reference extends ValueObject<string> {
  private _url?: string;

  constructor(value: string, url?: string) {
    super(value);
    this._url = url;
    this.validate();
  }

  get url(): string | undefined {
    return this._url;
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error("Reference source cannot be empty");
    }
    
    if (this.value.length > 255) {
      throw new Error("Reference source is too long (maximum 255 characters)");
    }

    if (this._url && this._url.length > 255) {
      throw new Error("URL is too long (maximum 255 characters)");
    }
  }

  equals(other: Reference): boolean {
    return other.value === this.value && other.url === this._url;
  }

  toString(): string {
    return this._url ? `${this.value} (${this._url})` : this.value;
  }
}
