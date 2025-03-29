import { type Plant } from "../../utils/schema.ts";
import { useSignal } from "@preact/signals";
import { Button } from "../Button.tsx";

interface CutFlowerFormProps {
  plant?: Plant;
  onChange?: (data: any) => void;
}

export default function CutFlowerForm({ plant }: CutFlowerFormProps) {
  const formData = useSignal({
    vaseLife: plant?.cutFlowerCharacteristics?.typical_vase_life_days || 0,
    stemLength: plant?.cutFlowerCharacteristics?.stem_length_min || 0,
    stemLengthMax: plant?.cutFlowerCharacteristics?.stem_length_max || 0,
    bloomSize: plant?.cutFlowerCharacteristics?.bloom_size || 0,
    fragrance: plant?.cutFlowerCharacteristics?.fragrance_level || 'none',
    hydration: plant?.cutFlowerTreatments?.water_requirements || '',
    preservative: plant?.cutFlowerTreatments?.preservative_requirements || '',
    storageTemp: plant?.cutFlowerTreatments?.cold_storage_temp || 0,
    ethyleneSensitive: plant?.cutFlowerTreatments?.ethylene_sensitivity || false,
    peakSeason: plant?.flowerMarketData?.peakSeason || '',
    avgPrice: plant?.flowerMarketData?.avgPrice || 0,
    demandLevel: plant?.flowerMarketData?.demandLevel || 'medium'
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    formData.value = {
      ...formData.value,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    };
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Vase Life (days)</label>
          <input
            type="number"
            name="vaseLife"
            value={formData.value.vaseLife}
            onInput={handleChange}
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Stem Length (cm)</label>
          <input
            type="number"
            name="stemLength"
            value={formData.value.stemLength}
            onInput={handleChange}
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bloom Size (cm)</label>
          <input
            type="number"
            name="bloomSize"
            value={formData.value.bloomSize}
            onInput={handleChange}
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Fragrance</label>
          <select
            name="fragrance"
            value={formData.value.fragrance}
            onChange={handleChange}
            class="select select-bordered w-full"
          >
            <option value="none">None</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="strong">Strong</option>
          </select>
        </div>
      </div>

      <div class="divider"></div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Hydration Requirements</label>
          <input
            type="text"
            name="hydration"
            value={formData.value.hydration}
            onInput={handleChange}
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Preservative Usage</label>
          <input
            type="text"
            name="preservative"
            value={formData.value.preservative}
            onInput={handleChange}
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Storage Temperature (°C)</label>
          <input
            type="number"
            name="storageTemp"
            value={formData.value.storageTemp}
            onInput={handleChange}
            class="input input-bordered w-full"
          />
        </div>
        <div class="flex items-end">
          <label class="label cursor-pointer">
            <input
              type="checkbox"
              name="ethyleneSensitive"
              checked={formData.value.ethyleneSensitive}
              onChange={handleChange}
              class="checkbox"
            />
            <span class="label-text ml-2">Ethylene Sensitive</span>
          </label>
        </div>
      </div>

      <div class="divider"></div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Peak Season</label>
          <select
            name="peakSeason"
            value={formData.value.peakSeason}
            onChange={handleChange}
            class="select select-bordered w-full"
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Average Price per Stem</label>
          <input
            type="number"
            name="avgPrice"
            value={formData.value.avgPrice}
            onInput={handleChange}
            class="input input-bordered w-full"
            step="0.01"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Market Demand</label>
          <select
            name="demandLevel"
            value={formData.value.demandLevel}
            onChange={handleChange}
            class="select select-bordered w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <Button type="submit">Save Changes</Button>
      </div>
    </div>
  );
}