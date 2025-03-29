import { type Plant } from "../../utils/schema.ts";

interface DetailsFormProps {
  plant?: Plant;
}

export default function DetailsForm({ plant }: DetailsFormProps) {
  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={plant?.description ?? ""}
          rows={4}
          class="textarea textarea-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Native Range</label>
        <input
          type="text"
          name="nativeRange"
          defaultValue={plant?.nativeRange ?? ""}
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Growth Habit</label>
        <input
          type="text"
          name="growthHabit"
          defaultValue={plant?.growthHabit ?? ""}
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Lifespan</label>
        <input
          type="text"
          name="lifespan"
          defaultValue={plant?.lifespan ?? ""}
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Hardiness Zones</label>
        <input
          type="text"
          name="hardinessZones"
          defaultValue={plant?.hardinessZones ?? ""}
          class="input input-bordered w-full"
        />
      </div>
    </div>
  );
}