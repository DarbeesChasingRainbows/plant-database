// baseRepository.ts
import { SQL, eq } from "drizzle-orm";
import { PgTable, AnyPgColumn, TableConfig } from "drizzle-orm/pg-core";
import { db } from "../utils/client.ts";

export class BaseRepository<
  TTable extends PgTable<TableConfig>,
  TSelect extends object = TTable["$inferSelect"],
  TInsert extends object = TTable["$inferInsert"]
> {
  protected table: TTable;
  protected primaryKey: AnyPgColumn;

  constructor(table: TTable, primaryKey: AnyPgColumn) {
    this.table = table;
    this.primaryKey = primaryKey;
  }

  // Find all records with optional limit and offset
  async findAll(options: { limit?: number; offset?: number } = {}): Promise<TSelect[]> {
    const { limit, offset } = options;
    let query = db.select().from(this.table);
    if (limit) query = query.limit(limit);
    if (offset) query = query.offset(offset);
    return (await query) as TSelect[];
  }

  // Find by ID with error handling
  async findById(id: number): Promise<TSelect | null> {
    const results = (await db
      .select()
      .from(this.table)
      .where(eq(this.primaryKey, id))) as TSelect[];
    return results[0] || null;
  }

  // Find with custom where clause
  async findWhere(where: SQL<unknown>, options: { limit?: number; offset?: number } = {}): Promise<TSelect[]> {
    const { limit, offset } = options;
    let query = db.select().from(this.table).where(where);
    if (limit) query = query.limit(limit);
    if (offset) query = query.offset(offset);
    return (await query) as TSelect[];
  }

  // Create a new record
  async create(data: TInsert): Promise<TSelect> {
    const results = (await db
      .insert(this.table)
      .values(data)
      .returning()) as TSelect[];
    if (!results.length) throw new Error("Failed to create record");
    return results[0];
  }

  // Update a record by ID
  async update(id: number, data: Partial<TInsert>): Promise<TSelect | null> {
    const results = (await db
      .update(this.table)
      .set(data)
      .where(eq(this.primaryKey, id))
      .returning()) as TSelect[];
    return results[0] || null;
  }

  // Delete a record by ID
  async delete(id: number): Promise<boolean> {
    const results = (await db
      .delete(this.table)
      .where(eq(this.primaryKey, id))
      .returning()) as TSelect[];
    return results.length > 0;
  }

  // Bulk create - useful for seeding or batch operations
  async bulkCreate(data: TInsert[]): Promise<TSelect[]> {
    return (await db
      .insert(this.table)
      .values(data)
      .returning()) as TSelect[];
  }

  // Count records with optional where clause
  async count(where?: SQL<unknown>): Promise<number> {
    const query = where
      ? db.select({ count: db.fn.count() }).from(this.table).where(where)
      : db.select({ count: db.fn.count() }).from(this.table);
    const [{ count }] = await query;
    return Number(count);
  }
}