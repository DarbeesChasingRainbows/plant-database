import { eq, like, sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { GardenBed } from "../../domain/entities/GardenBed.ts";
import { GardenBedId } from "../../domain/value-objects/GardenBedId.ts";
import { IGardenBedRepository } from "../../domain/repositories/IGardenBedRepository.ts";
import { Dimensions } from "../../domain/value-objects/Dimensions.ts";
import { Location } from "../../domain/value-objects/Location.ts";
import { gardenBeds } from "../../../../utils/schema.ts";

/**
 * Type for garden bed database record
 */
interface GardenBedRecord {
  bedId: number;
  plotId?: number;
  bedName: string;
  bedCode: string;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  areaSqm?: number;
  boundary?: unknown;
  centroid?: unknown;
  soilType?: string;
  soilDepthCm?: number;
  raisedBed?: boolean;
  irrigationType?: string;
  sunExposure?: string;
  notes?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Implementation of IGardenBedRepository using Drizzle ORM
 */
export class DrizzleGardenBedRepository implements IGardenBedRepository {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  /**
   * Map a database garden bed record to a domain GardenBed entity
   */
  private toDomainEntity(record: GardenBedRecord): GardenBed {
    const dimensions = Dimensions.create({
      widthCm: record.widthCm ?? 0,
      lengthCm: record.lengthCm ?? 0,
      heightCm: record.heightCm
    });

    let location: Location | undefined = undefined;
    if (record.centroid) {
      // Assuming centroid is stored as a point with x,y coordinates
      const [x, y] = this.extractPointCoordinates(record.centroid);
      location = Location.create({
        x,
        y,
        zone: record.plotId ? `Plot ${record.plotId}` : undefined,
        description: record.notes
      });
    }

    return GardenBed.reconstitute({
      id: GardenBedId.create(record.bedId),
      name: record.bedName,
      dimensions,
      location,
      soilType: record.soilType,
      sunExposure: record.sunExposure,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }

  /**
   * Extract x,y coordinates from a PostGIS point
   */
  private extractPointCoordinates(point: unknown): [number, number] {
    // Handle different possible formats of point data from PostGIS
    if (typeof point === 'string') {
      // Format might be "(x,y)" or similar
      const match = point.match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
      if (match) {
        return [parseFloat(match[1]), parseFloat(match[2])];
      }
    } else if (point && typeof point === 'object') {
      // If it's already an object with x,y properties
      const pointObj = point as { x?: number, y?: number };
      if ('x' in pointObj && 'y' in pointObj && typeof pointObj.x === 'number' && typeof pointObj.y === 'number') {
        return [pointObj.x, pointObj.y];
      }
    }
    
    // Default fallback
    return [0, 0];
  }

  /**
   * Map a domain GardenBed entity to a database record
   */
  private toDatabaseRecord(gardenBed: GardenBed): Partial<GardenBedRecord> {
    const record: Partial<GardenBedRecord> = {
      bedName: gardenBed.name,
      lengthCm: gardenBed.dimensions.lengthCm,
      widthCm: gardenBed.dimensions.widthCm,
      heightCm: gardenBed.dimensions.heightCm,
      areaSqm: gardenBed.dimensions.areaCm2 / 10000, // Convert cm² to m²
      soilType: gardenBed.soilType,
      sunExposure: gardenBed.sunExposure,
      notes: gardenBed.notes,
      updatedAt: new Date()
    };

    // Only include ID for existing garden beds
    if (gardenBed.id.value !== 0) {
      record.bedId = gardenBed.id.value;
    }

    // Set centroid if location is available
    if (gardenBed.location) {
      // This would need to be properly formatted for your PostGIS setup
      // This is a simplified example
      record.centroid = `POINT(${gardenBed.location.x} ${gardenBed.location.y})`;
    }

    return record;
  }

  async findById(id: GardenBedId): Promise<GardenBed | undefined> {
    const record = await this.db.query.gardenBeds.findFirst({
      where: eq(gardenBeds.bedId, id.value)
    });

    return record ? this.toDomainEntity(record as GardenBedRecord) : undefined;
  }

  async findAll(): Promise<GardenBed[]> {
    const records = await this.db.query.gardenBeds.findMany();
    return records.map(record => this.toDomainEntity(record as GardenBedRecord));
  }

  async findByName(name: string): Promise<GardenBed[]> {
    const records = await this.db.query.gardenBeds.findMany({
      where: like(gardenBeds.bedName, `%${name}%`)
    });

    return records.map(record => this.toDomainEntity(record as GardenBedRecord));
  }

  async save(gardenBed: GardenBed): Promise<GardenBed> {
    const record = this.toDatabaseRecord(gardenBed);

    if (gardenBed.id.value === 0) {
      // Insert new garden bed
      const [inserted] = await this.db.insert(gardenBeds)
        .values({
          ...record,
          bedCode: `BED-${Date.now()}`, // Generate a unique bed code
          createdAt: new Date()
        })
        .returning();

      return this.toDomainEntity(inserted as GardenBedRecord);
    } else {
      // Update existing garden bed
      const [updated] = await this.db.update(gardenBeds)
        .set(record)
        .where(eq(gardenBeds.bedId, gardenBed.id.value))
        .returning();

      return this.toDomainEntity(updated as GardenBedRecord);
    }
  }

  async delete(id: GardenBedId): Promise<boolean> {
    const result = await this.db.delete(gardenBeds)
      .where(eq(gardenBeds.bedId, id.value))
      .returning({ deleted: gardenBeds.bedId });

    return result.length > 0;
  }

  async count(): Promise<number> {
    const result = await this.db.select({ count: sql`count(*)` })
      .from(gardenBeds);
    
    return Number(result[0].count) || 0;
  }
}
