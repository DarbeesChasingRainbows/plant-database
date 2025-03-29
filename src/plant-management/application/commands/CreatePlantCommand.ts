/**
 * Command for creating a new plant
 */
export class CreatePlantCommand {
  constructor(
    public readonly botanicalName: string,
    public readonly commonName: string,
    public readonly family?: string,
    public readonly genus?: string,
    public readonly species?: string,
    public readonly description?: string,
    public readonly nativeRange?: string,
    public readonly growthHabit?: string,
    public readonly lifespan?: string,
    public readonly hardinessZones?: string,
    public readonly heightMatureCm?: number,
    public readonly spreadMatureCm?: number
  ) {}
}
