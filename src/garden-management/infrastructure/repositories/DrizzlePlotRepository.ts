import { eq, like, sql, and } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Plot } from "../../domain/entities/Plot.ts";
import { PlotId } from "../../domain/value-objects/PlotId.ts";
import { IPlotRepository } from "../../domain/repositories/IPlotRepository.ts";
import { Dimensions } from "../../domain/value-objects/Dimensions.ts";
import { Location } from "../../domain/value-objects/Location.ts";
import { plots } from "../../../../utils/schema.ts";
import { GardenBedId } from "../../domain/value-objects/GardenBedId.ts";

/**
 * Type for plot database record
 */
interface PlotRecord {
  plotId: number;
  areaId?: number;
  plotCode: string;
  sizeSqm?: number;
  boundary?: unknown;
  centroid?: unknown;
  orientation?: string;
  sunExposure?: string;
  irrigationType?: string;
  notes?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Implementation of IPlotRepository using Drizzle ORM
 */
export class DrizzlePlotRepository implements IPlotRepository {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  /**
   * Map a database plot record to a domain Plot entity
   */
  private toDomainEntity(record: PlotRecord): Plot {
    // Create dimensions from size if available
    const dimensions = Dimensions.create({
      // We don't have direct width/length in the DB, so we'll approximate
      // Assuming a square plot for simplicity if only sizeSqm is available
      widthCm: record.sizeSqm ? Math.sqrt(record.sizeSqm * 10000) : 0,
      lengthCm: record.sizeSqm ? Math.sqrt(record.sizeSqm * 10000) : 0
    });

    let location: Location | undefined = undefined;
    if (record.centroid) {
      // Assuming centroid is stored as a point with x,y coordinates
      const [x, y] = this.extractPointCoordinates(record.centroid);
      location = Location.create({
        x,
        y,
        zone: record.areaId ? `Area ${record.areaId}` : undefined,
        description: record.notes
      });
    }

    return Plot.reconstitute({
      id: PlotId.create(record.plotId),
      code: record.plotCode,
      dimensions,
      location,
      sunExposure: record.sunExposure,
      irrigationType: record.irrigationType,
      notes: record.notes,
      status: record.status || 'active',
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
   * Map a domain Plot entity to a database record
   */
  private toDatabaseRecord(plot: Plot): Partial<PlotRecord> {
    const record: Partial<PlotRecord> = {
      plotCode: plot.code,
      // Calculate sizeSqm from dimensions
      sizeSqm: (plot.dimensions.widthCm * plot.dimensions.lengthCm) / 10000, // Convert cm² to m²
      orientation: plot.orientation,
      sunExposure: plot.sunExposure,
      irrigationType: plot.irrigationType,
      notes: plot.notes,
      status: plot.status,
      updatedAt: new Date()
    };

    // Only include ID for existing plots
    if (plot.id.value !== 0) {
      record.plotId = plot.id.value;
    }

    // Set centroid if location is available
    if (plot.location) {
      // This would need to be properly formatted for your PostGIS setup
      record.centroid = `POINT(${plot.location.x} ${plot.location.y})`;
    }

    return record;
  }

  async findById(id: PlotId): Promise<Plot | undefined> {
    const record = await this.db.query.plots.findFirst({
      where: eq(plots.plotId, id.value)
    });

    return record ? this.toDomainEntity(record as PlotRecord) : undefined;
  }

  async findAll(): Promise<Plot[]> {
    const records = await this.db.query.plots.findMany();
    return records.map(record => this.toDomainEntity(record as PlotRecord));
  }

  async findByCode(code: string): Promise<Plot | undefined> {
    const record = await this.db.query.plots.findFirst({
      where: eq(plots.plotCode, code)
    });

    return record ? this.toDomainEntity(record as PlotRecord) : undefined;
  }

  async findByGardenBedId(gardenBedId: GardenBedId): Promise<Plot[]> {
    // In the schema, plots are linked to garden areas, not directly to garden beds
    // This is a simplified implementation - in a real system, you might need to 
    // join with garden beds to find plots that belong to a specific garden bed
    const records = await this.db.query.plots.findMany({
      where: eq(plots.areaId, gardenBedId.value)
    });

    return records.map(record => this.toDomainEntity(record as PlotRecord));
  }

  async findByStatus(status: string): Promise<Plot[]> {
    const records = await this.db.query.plots.findMany({
      where: eq(plots.status, status)
    });

    return records.map(record => this.toDomainEntity(record as PlotRecord));
  }

  async save(plot: Plot): Promise<Plot> {
    const record = this.toDatabaseRecord(plot);

    if (plot.id.value === 0) {
      // Insert new plot
      const [inserted] = await this.db.insert(plots)
        .values({
          ...record,
          createdAt: new Date()
        })
        .returning();

      return this.toDomainEntity(inserted as PlotRecord);
    } else {
      // Update existing plot
      const [updated] = await this.db.update(plots)
        .set(record)
        .where(eq(plots.plotId, plot.id.value))
        .returning();

      return this.toDomainEntity(updated as PlotRecord);
    }
  }

  async delete(id: PlotId): Promise<boolean> {
    const result = await this.db.delete(plots)
      .where(eq(plots.plotId, id.value))
      .returning({ deleted: plots.plotId });

    return result.length > 0;
  }

  async count(): Promise<number> {
    const result = await this.db.select({ count: sql`count(*)` })
      .from(plots);
    
    return Number(result[0].count) || 0;
  }
}
