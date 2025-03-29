import { type Plant, type PlantGerminationGuide } from "../../utils/schema.ts";

interface GerminationGuideFormProps {
  plant?: Plant;
  plantGermination?: PlantGerminationGuide;
}

export default function GerminationGuideForm({ plant, plantGermination }: GerminationGuideFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Germination Guide</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Zone Range */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Zone Range</label>
          <input
            type="text"
            name="zoneRange"
            defaultValue={plantGermination?.zoneRange ?? ""}
            class="input input-bordered w-full"
            placeholder="e.g., 4-9"
          />
          <p class="mt-1 text-sm text-gray-500">Applicable USDA zones</p>
        </div>

        {/* Soil Temperature Min (C) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Soil Temp Min (°C)</label>
          <input
            type="number"
            name="soilTempMinC"
            defaultValue={plantGermination?.soilTempMinC ?? ""}
            step="0.1"
            class="input input-bordered w-full"
            placeholder="e.g., 15.5"
          />
          <p class="mt-1 text-sm text-gray-500">Minimum soil temperature</p>
        </div>

        {/* Soil Temperature Max (C) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Soil Temp Max (°C)</label>
          <input
            type="number"
            name="soilTempMaxC"
            defaultValue={plantGermination?.soilTempMaxC ?? ""}
            step="0.1"
            class="input input-bordered w-full"
            placeholder="e.g., 25.0"
          />
          <p class="mt-1 text-sm text-gray-500">Maximum soil temperature</p>
        </div>

        {/* Days to Germination Min */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Days to Germination Min</label>
          <input
            type="number"
            name="daysToGerminationMin"
            defaultValue={plantGermination?.daysToGerminationMin ?? ""}
            min="1"
            class="input input-bordered w-full"
            placeholder="e.g., 7"
          />
          <p class="mt-1 text-sm text-gray-500">Minimum days to germinate</p>
        </div>

        {/* Days to Germination Max */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Days to Germination Max</label>
          <input
            type="number"
            name="daysToGerminationMax"
            defaultValue={plantGermination?.daysToGerminationMax ?? ""}
            min="1"
            class="input input-bordered w-full"
            placeholder="e.g., 14"
          />
          <p class="mt-1 text-sm text-gray-500">Maximum days to germinate</p>
        </div>

        {/* Planting Depth (cm) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Planting Depth (cm)</label>
          <input
            type="number"
            name="plantingDepthCm"
            defaultValue={plantGermination?.plantingDepthCm ?? ""}
            step="0.1"
            class="input input-bordered w-full"
            placeholder="e.g., 0.5"
          />
          <p class="mt-1 text-sm text-gray-500">Depth to plant seeds</p>
        </div>

        {/* Light Requirement */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Light Requirement</label>
          <select
            name="lightRequirement"
            defaultValue={plantGermination?.lightRequirement ?? ""}
            class="select select-bordered w-full"
          >
            <option value="">Select light requirement</option>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="Either">Either</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Light needs for germination</p>
        </div>

        {/* Spring Start Week */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Spring Start Week</label>
          <input
            type="number"
            name="springStartWeek"
            defaultValue={plantGermination?.springStartWeek ?? ""}
            min="1"
            max="52"
            class="input input-bordered w-full"
            placeholder="e.g., 12"
          />
          <p class="mt-1 text-sm text-gray-500">Week number for spring sowing</p>
        </div>

        {/* Spring End Week */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Spring End Week</label>
          <input
            type="number"
            name="springEndWeek"
            defaultValue={plantGermination?.springEndWeek ?? ""}
            min="1"
            max="52"
            class="input input-bordered w-full"
            placeholder="e.g., 20"
          />
          <p class="mt-1 text-sm text-gray-500">Week number to end spring sowing</p>
        </div>

        {/* Fall Start Week */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Fall Start Week</label>
          <input
            type="number"
            name="fallStartWeek"
            defaultValue={plantGermination?.fallStartWeek ?? ""}
            min="1"
            max="52"
            class="input input-bordered w-full"
            placeholder="e.g., 35"
          />
          <p class="mt-1 text-sm text-gray-500">Week number for fall sowing</p>
        </div>

        {/* Fall End Week */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Fall End Week</label>
          <input
            type="number"
            name="fallEndWeek"
            defaultValue={plantGermination?.fallEndWeek ?? ""}
            min="1"
            max="52"
            class="input input-bordered w-full"
            placeholder="e.g., 45"
          />
          <p class="mt-1 text-sm text-gray-500">Week number to end fall sowing</p>
        </div>

        {/* Indoor Sowing Weeks Before Frost */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Indoor Sowing Weeks Before Frost</label>
          <input
            type="number"
            name="indoorSowingWeeksBeforeFrost"
            defaultValue={plantGermination?.indoorSowingWeeksBeforeFrost ?? ""}
            min="0"
            class="input input-bordered w-full"
            placeholder="e.g., 6"
          />
          <p class="mt-1 text-sm text-gray-500">Weeks before last frost to start indoors</p>
        </div>
      </div>

      {/* Stratification Required */}
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          name="stratificationRequired"
          defaultChecked={plantGermination?.stratificationRequired ?? false}
          class="checkbox checkbox-primary"
        />
        <label class="text-sm font-medium text-gray-700">Stratification Required</label>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Stratification Instructions</label>
        <textarea
          name="stratificationInstructions"
          defaultValue={plantGermination?.stratificationInstructions ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Cold stratify at 4°C for 30 days"
        />
        <p class="mt-1 text-sm text-gray-500">Instructions for stratification</p>
      </div>

      {/* Scarification Required */}
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          name="scarificationRequired"
          defaultChecked={plantGermination?.scarificationRequired ?? false}
          class="checkbox checkbox-primary"
        />
        <label class="text-sm font-medium text-gray-700">Scarification Required</label>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Scarification Instructions</label>
        <textarea
          name="scarificationInstructions"
          defaultValue={plantGermination?.scarificationInstructions ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Soak in hot water for 24 hours"
        />
        <p class="mt-1 text-sm text-gray-500">Instructions for scarification</p>
      </div>

      {/* Special Requirements */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Special Requirements</label>
        <textarea
          name="specialRequirements"
          defaultValue={plantGermination?.specialRequirements ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Requires darkness for first 48 hours"
        />
        <p class="mt-1 text-sm text-gray-500">Additional germination needs</p>
      </div>

      {/* Germination Notes */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Germination Notes</label>
        <textarea
          name="germinationNotes"
          defaultValue={plantGermination?.germinationNotes ?? ""}
          rows={3}
          class="textarea textarea-bordered w-full"
          placeholder="e.g., Germination rate improves with fresh seeds"
        />
        <p class="mt-1 text-sm text-gray-500">Additional notes</p>
      </div>
    </div>
  );
}