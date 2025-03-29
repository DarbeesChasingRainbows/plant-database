import { eq, like, sql, and, gte, lte, inArray } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Planting } from "../../domain/entities/Planting.ts";
import { PlantingId } from "../../domain/value-objects/PlantingId.ts";
import { IPlantingRepository } from "../../domain/repositories/IPlantingRepository.ts";
import { PlotId } from "../../domain/value-objects/PlotId.ts";
import { plantings } from "../../../../utils/schema.ts";
import { PlantingDate } from "../../domain/value-objects/PlantingDate.ts";

/**
 * Type for planting database record
 */
interface PlantingRecord {
  plantingId: number;
  planId?: number;
  plotId: number;
  plantId: number;
  seedLotId?: number;
  plantingDate: Date;
  plantingMethod?: string;
  spacingCm?: number;
  depthCm?: number;
  quantityPlanted?: number;
  areaSqm?: number;
  plantingArea?: unknown;
  rowLines?: unknown;
  notes?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Implementation of IPlantingRepository using Drizzle ORM
 */
export class DrizzlePlantingRepository implements IPlantingRepository {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  /**
   * Map a database planting record to a domain Planting entity
   */
  private toDomainEntity(record: PlantingRecord): Planting {
    const plantingDate = PlantingDate.create(record.plantingDate);

    return Planting.reconstitute({
      id: PlantingId.create(record.plantingId),
      plotId: PlotId.create(record.plotId),
      plantId: record.plantId,
      plantingDate,
      plantingMethod: record.plantingMethod,
      spacingCm: record.spacingCm,
      depthCm: record.depthCm,
      quantityPlanted: record.quantityPlanted,
      notes: record.notes,
      status: record.status || 'active',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }

  /**
   * Map a domain Planting entity to a database record
   */
  private toDatabaseRecord(planting: Planting): Partial<PlantingRecord> {
    const record: Partial<PlantingRecord> = {
      plotId: planting.plotId.value,
      plantId: planting.plantId,
      plantingDate: planting.plantingDate.value,
      plantingMethod: planting.plantingMethod,
      spacingCm: planting.spacingCm,
      depthCm: planting.depthCm,
      quantityPlanted: planting.quantityPlanted,
      notes: planting.notes,
      status: planting.status,
      updatedAt: new Date()
    };

    // Only include ID for existing plantings
    if (planting.id.value !== 0) {
      record.plantingId = planting.id.value;
    }

    return record;
  }

  async findById(id: PlantingId): Promise<Planting | undefined> {
    const record = await this.db.query.plantings.findFirst({
      where: eq(plantings.plantingId, id.value)
    });

    return record ? this.toDomainEntity(record as PlantingRecord) : undefined;
  }

  async findAll(): Promise<Planting[]> {
    const records = await this.db.query.plantings.findMany();
    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async findByPlotId(plotId: PlotId): Promise<Planting[]> {
    const records = await this.db.query.plantings.findMany({
      where: eq(plantings.plotId, plotId.value)
    });

    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async findByPlantId(plantId: number): Promise<Planting[]> {
    const records = await this.db.query.plantings.findMany({
      where: eq(plantings.plantId, plantId)
    });

    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Planting[]> {
    const records = await this.db.query.plantings.findMany({
      where: and(
        gte(plantings.plantingDate, startDate),
        lte(plantings.plantingDate, endDate)
      )
    });

    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async findByStatus(status: string): Promise<Planting[]> {
    const records = await this.db.query.plantings.findMany({
      where: eq(plantings.status, status)
    });

    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async findByPlotIdAndPlantId(plotId: PlotId, plantId: number): Promise<Planting[]> {
    const records = await this.db.query.plantings.findMany({
      where: and(
        eq(plantings.plotId, plotId.value),
        eq(plantings.plantId, plantId)
      )
    });

    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async findByPlotIds(plotIds: PlotId[]): Promise<Planting[]> {
    const plotIdValues = plotIds.map(id => id.value);
    
    const records = await this.db.query.plantings.findMany({
      where: inArray(plantings.plotId, plotIdValues)
    });

    return records.map(record => this.toDomainEntity(record as PlantingRecord));
  }

  async save(planting: Planting): Promise<Planting> {
    const record = this.toDatabaseRecord(planting);

    if (planting.id.value === 0) {
      // Insert new planting
      const [inserted] = await this.db.insert(plantings)
        .values({
          ...record,
          createdAt: new Date()
        })
        .returning();

      return this.toDomainEntity(inserted as PlantingRecord);
    } else {
      // Update existing planting
      const [updated] = await this.db.update(plantings)
        .set(record)
        .where(eq(plantings.plantingId, planting.id.value))
        .returning();

      return this.toDomainEntity(updated as PlantingRecord);
    }
  }

  async delete(id: PlantingId): Promise<boolean> {
    const result = await this.db.delete(plantings)
      .where(eq(plantings.plantingId, id.value))
      .returning({ deleted: plantings.plantingId });

    return result.length > 0;
  }

  async count(): Promise<number> {
    const result = await this.db.select({ count: sql`count(*)` })
      .from(plantings);
    
    return Number(result[0].count) || 0;
  }
}
