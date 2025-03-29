import { type Plant } from "../../utils/schema.ts";

interface BasicInfoFormProps {
  plant?: Plant;
}

export default function BasicInfoForm({ plant }: BasicInfoFormProps) {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium">Common Name</label>
        <input
          type="text"
          name="commonName"
          defaultValue={plant?.commonName ?? ""}
          required
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Botanical Name</label>
        <input
          type="text"
          name="botanicalName"
          defaultValue={plant?.botanicalName ?? ""}
          required
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Family</label>
        <input
          type="text"
          name="family"
          defaultValue={plant?.family ?? ""}
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Genus</label>
        <input
          type="text"
          name="genus"
          defaultValue={plant?.genus ?? ""}
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Species</label>
        <input
          type="text"
          name="species"
          defaultValue={plant?.species ?? ""}
          class="input input-bordered w-full"
        />
      </div>
    </div>
  );
}