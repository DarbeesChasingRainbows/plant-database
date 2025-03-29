import { eq } from "drizzle-orm";
import { db } from "./client.ts";
import { Column, Table } from "drizzle-orm";

/**
 * Base API handler class for standardizing API endpoints
 */
export class BaseApiHandler<TTable extends Table, TEntity, TId = number> {
  protected table: TTable;
  protected primaryKey: Column;
  
  constructor(table: TTable, primaryKey: Column) {
    this.table = table;
    this.primaryKey = primaryKey;
  }
  
  /**
   * Handle GET requests for a single entity
   */
  async handleGet(_req: Request, params: { id: string }): Promise<Response> {
    const id = this.parseId(params.id);
    
    if (this.isInvalidId(id)) {
      return this.jsonResponse({ error: "Invalid ID" }, 400);
    }
    
    try {
      const entity = await this.findById(id);
      
      if (!entity) {
        return this.jsonResponse({ error: "Not found" }, 404);
      }
      
      return this.jsonResponse(entity);
    } catch (error) {
      console.error(`API Error:`, error);
      return this.jsonResponse({ error: String(error) }, 500);
    }
  }
  
  /**
   * Handle POST requests to create a new entity
   */
  async handlePost(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const result = await this.create(body);
      return this.jsonResponse(result, 201);
    } catch (error) {
      console.error(`API Error:`, error);
      return this.jsonResponse({ error: String(error) }, 500);
    }
  }
  
  /**
   * Handle PUT requests to update an existing entity
   */
  async handlePut(req: Request, params: { id: string }): Promise<Response> {
    const id = this.parseId(params.id);
    
    if (this.isInvalidId(id)) {
      return this.jsonResponse({ error: "Invalid ID" }, 400);
    }
    
    try {
      const body = await req.json();
      const result = await this.update(id, body);
      
      if (!result) {
        return this.jsonResponse({ error: "Not found" }, 404);
      }
      
      return this.jsonResponse(result);
    } catch (error) {
      console.error(`API Error:`, error);
      return this.jsonResponse({ error: String(error) }, 500);
    }
  }
  
  /**
   * Handle DELETE requests to delete an entity
   */
  async handleDelete(_req: Request, params: { id: string }): Promise<Response> {
    const id = this.parseId(params.id);
    
    if (this.isInvalidId(id)) {
      return this.jsonResponse({ error: "Invalid ID" }, 400);
    }
    
    try {
      const success = await this.delete(id);
      
      if (!success) {
        return this.jsonResponse({ error: "Not found" }, 404);
      }
      
      return this.jsonResponse({ success: true });
    } catch (error) {
      console.error(`API Error:`, error);
      return this.jsonResponse({ error: String(error) }, 500);
    }
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
      throw new Error("Failed to create record");
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
   * Delete an entity
   */
  protected async delete(id: TId): Promise<boolean> {
    const results = await db.delete(this.table)
      .where(eq(this.primaryKey, id as unknown as number | string))
      .returning();
      
    return results.length > 0;
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
   * Create a JSON response
   */
  protected jsonResponse(data: Record<string, unknown> | TEntity, status = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}
