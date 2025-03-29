import { Handlers, PageProps as _PageProps } from "$fresh/server.ts";
import { eq } from "drizzle-orm";
import { db } from "./client.ts";
import { Column, Table } from "drizzle-orm";

export interface BasePageData {
  error?: string;
}

/**
 * Base route handler class for standardizing route handlers
 */
export class BaseRouteHandler<
  TTable extends Table, 
  TEntity, 
  TPageData extends BasePageData = BasePageData,
  TId = number
> {
  protected table: TTable;
  protected primaryKey: Column;
  protected entityName: string;
  
  constructor(table: TTable, primaryKey: Column, entityName: string) {
    this.table = table;
    this.primaryKey = primaryKey;
    this.entityName = entityName;
  }
  
  /**
   * Create a GET handler for retrieving a single entity
   */
  createGetHandler(): Handlers<TPageData>["GET"] {
    return async (_, ctx) => {
      const { id } = ctx.params;
      const entityId = this.parseId(id);
      
      if (this.isInvalidId(entityId)) {
        return ctx.render(this.createErrorData(`Invalid ${this.entityName} ID`));
      }
      
      try {
        const entity = await this.findById(entityId);
        
        if (!entity) {
          return ctx.render(this.createErrorData(`${this.entityName} not found`));
        }
        
        return ctx.render(this.createSuccessData(entity));
      } catch (error) {
        console.error(`Error fetching ${this.entityName}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return ctx.render(this.createErrorData(errorMessage));
      }
    };
  }
  
  /**
   * Create a POST handler for creating or updating an entity
   */
  createPostHandler(): Handlers<TPageData>["POST"] {
    return async (req, ctx) => {
      try {
        const formData = await req.formData();
        const data = this.processFormData(formData);
        
        // Check if this is an update or create
        const { id } = ctx.params;
        if (id) {
          const entityId = this.parseId(id);
          if (!this.isInvalidId(entityId)) {
            // Update the entity
            const result = await this.update(entityId, data);
            if (!result) {
              return ctx.render(this.createErrorData(`${this.entityName} not found`));
            }
            
            // Redirect to the entity detail page
            const headers = new Headers();
            headers.set("Location", `/${this.getBasePath()}/${entityId}`);
            return new Response(null, {
              status: 303,
              headers
            });
          }
        }
        
        // Create the entity
        const result = await this.create(data);
        
        // Redirect to the entity detail page
        const headers = new Headers();
        headers.set("Location", `/${this.getBasePath()}/${result.id}`);
        return new Response(null, {
          status: 303,
          headers
        });
      } catch (error) {
        console.error(`Error saving ${this.entityName}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return ctx.render(this.createErrorData(errorMessage));
      }
    };
  }
  
  /**
   * Find an entity by ID
   */
  protected async findById(id: TId): Promise<TEntity | null> {
    const results = await db.select()
      .from(this.table)
      .where(eq(this.primaryKey, id as unknown as number | string))
      .limit(1);
      
    return (results[0] as TEntity) || null;
  }
  
  /**
   * Create a new entity
   */
  protected async create(data: Record<string, unknown>): Promise<TEntity> {
    const results = await db.insert(this.table)
      .values(data as Record<string, unknown>)
      .returning();
      
    if (!results.length) {
      throw new Error(`Failed to create ${this.entityName}`);
    }
    
    return results[0] as TEntity;
  }
  
  /**
   * Update an existing entity
   */
  protected async update(id: TId, data: Record<string, unknown>): Promise<TEntity | null> {
    const results = await db.update(this.table)
      .set(data as Record<string, unknown>)
      .where(eq(this.primaryKey, id as unknown as number | string))
      .returning();
      
    return (results[0] as TEntity) || null;
  }
  
  /**
   * Parse an ID from a string
   */
  protected parseId(id: string): TId {
    return parseInt(id) as unknown as TId;
  }
  
  /**
   * Check if an ID is invalid
   */
  protected isInvalidId(id: TId): boolean {
    return isNaN(id as unknown as number);
  }
  
  /**
   * Create an error data object
   */
  protected createErrorData(errorMessage: string): TPageData {
    return { error: errorMessage } as TPageData;
  }
  
  /**
   * Create a success data object
   */
  protected createSuccessData(entity: TEntity): TPageData {
    return { [this.getEntityKey()]: entity } as unknown as TPageData;
  }
  
  /**
   * Get the entity key for the data object
   */
  protected getEntityKey(): string {
    return this.entityName.toLowerCase();
  }
  
  /**
   * Get the base path for the entity
   */
  protected getBasePath(): string {
    return `admin/${this.entityName.toLowerCase()}s`;
  }
  
  /**
   * Process form data into an entity object
   */
  protected processFormData(formData: FormData): Record<string, unknown> {
    // Default implementation - override in derived classes
    const data: Record<string, unknown> = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }
}
