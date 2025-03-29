import { type Plant, type PlantAyurvedicProperty } from "../../utils/schema.ts";

interface AyurvedicPropertiesFormProps {
  plant?: Plant;
  ayurvedicProperties?: PlantAyurvedicProperty;
}

export default function AyurvedicPropertiesForm({ plant, ayurvedicProperties }: AyurvedicPropertiesFormProps) {
  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Sanskrit Name</label>
        <input
          type="text"
          name="ayurvedic_sanskrit_name"
          value={ayurvedicProperties?.sanskrit_name ?? ""}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Common Ayurvedic Name</label>
        <input
          type="text"
          name="ayurvedic_common_name"
          value={ayurvedicProperties?.common_ayurvedic_name ?? ""}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Prabhava (Special Effect)</label>
        <textarea
          name="ayurvedic_prabhava"
          value={ayurvedicProperties?.prabhava ?? ""}
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Dosage Form</label>
        <input
          type="text"
          name="ayurvedic_dosage_form"
          value={ayurvedicProperties?.dosage_form ?? ""}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Dosage Range</label>
        <input
          type="text"
          name="ayurvedic_dosage_range"
          value={ayurvedicProperties?.dosage_range ?? ""}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Anupana (Vehicle)</label>
        <input
          type="text"
          name="ayurvedic_anupana"
          value={ayurvedicProperties?.anupana ?? ""}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Contraindications</label>
        <textarea
          name="ayurvedic_contraindications"
          value={ayurvedicProperties?.contraindications ?? ""}
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </div>
  );
}