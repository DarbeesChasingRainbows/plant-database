import { type Plant, type PlantProperty } from "../../utils/schema.ts";

interface PlantPropertiesFormProps {
  plant?: Plant;
  properties?: PlantProperty; // Optional existing properties for editing
}

export default function PlantPropertiesForm({ plant, properties }: PlantPropertiesFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Plant Properties</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Zone Range */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Zone Range</label>
          <input
            type="text"
            name="zoneRange"
            defaultValue={properties?.zoneRange ?? ""}
            placeholder="e.g., 4-9"
            class="input input-bordered w-full"
          />
          <p class="mt-1 text-sm text-gray-500">USDA Hardiness Zone range (e.g., 4-9)</p>
        </div>

        {/* Soil pH Range */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Soil pH Range</label>
          <input
            type="text"
            name="soilPhRange"
            defaultValue={properties?.soilPhRange ?? ""}
            placeholder="e.g., 6.0-7.5"
            class="input input-bordered w-full"
          />
          <p class="mt-1 text-sm text-gray-500">Optimal soil pH range</p>
        </div>

        {/* Light Requirements */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Light Requirements</label>
          <select
            name="lightRequirements"
            defaultValue={properties?.lightRequirements ?? ""}
            class="select select-bordered w-full"
          >
            <option value="">Select light requirement</option>
            <option value="Full Sun">Full Sun</option>
            <option value="Partial Sun">Partial Sun</option>
            <option value="Shade">Shade</option>
            <option value="Full Sun to Partial Shade">Full Sun to Partial Shade</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Sun exposure needs</p>
        </div>

        {/* Water Requirements */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Water Requirements</label>
          <select
            name="waterRequirements"
            defaultValue={properties?.waterRequirements ?? ""}
            class="select select-bordered w-full"
          >
            <option value="">Select water requirement</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Well-drained">Well-drained</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Watering needs</p>
        </div>

        {/* Days to Maturity */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Days to Maturity</label>
          <input
            type="number"
            name="daysToMaturity"
            defaultValue={properties?.daysToMaturity ?? ""}
            min="1"
            class="input input-bordered w-full"
          />
          <p class="mt-1 text-sm text-gray-500">Days from planting to harvest</p>
        </div>

        {/* Height at Maturity (cm) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Height at Maturity (cm)</label>
          <input
            type="number"
            name="heightMatureCm"
            defaultValue={properties?.heightMatureCm ?? ""}
            min="0"
            step="1"
            class="input input-bordered w-full"
          />
          <p class="mt-1 text-sm text-gray-500">Mature height in centimeters</p>
        </div>

        {/* Spread at Maturity (cm) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Spread at Maturity (cm)</label>
          <input
            type="number"
            name="spreadMatureCm"
            defaultValue={properties?.spreadMatureCm ?? ""}
            min="0"
            step="1"
            class="input input-bordered w-full"
          />
          <p class="mt-1 text-sm text-gray-500">Mature spread in centimeters</p>
        </div>
      </div>

      {/* Soil Type Preferences */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Soil Type Preferences</label>
        <textarea
          name="soilTypePreferences"
          defaultValue={properties?.soilTypePreferences ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Loamy, well-drained soil with high organic matter"
        />
        <p class="mt-1 text-sm text-gray-500">Preferred soil types and conditions</p>
      </div>

      {/* Cultivation Notes */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Cultivation Notes</label>
        <textarea
          name="cultivationNotes"
          defaultValue={properties?.cultivationNotes ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Requires staking in windy areas"
        />
        <p class="mt-1 text-sm text-gray-500">Additional growing tips</p>
      </div>

      {/* Pest Susceptibility */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Pest Susceptibility</label>
        <textarea
          name="pestSusceptibility"
          defaultValue={properties?.pestSusceptibility ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Susceptible to aphids and spider mites"
        />
        <p class="mt-1 text-sm text-gray-500">Common pests affecting this plant</p>
      </div>

      {/* Disease Susceptibility */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Disease Susceptibility</label>
        <textarea
          name="diseaseSusceptibility"
          defaultValue={properties?.diseaseSusceptibility ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Prone to powdery mildew in humid conditions"
        />
        <p class="mt-1 text-sm text-gray-500">Common diseases affecting this plant</p>
      </div>
    </div>
  );
}