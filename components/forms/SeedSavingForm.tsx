import { type Plant } from "../../utils/schema.ts";

interface SeedSavingFormProps {
  plant?: Plant;
}

export default function SeedSavingForm({ plant }: SeedSavingFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Seed Saving Information</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Pollination Type */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Pollination Type</label>
          <select
            name="pollinationType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select pollination type</option>
            <option value="self">Self-pollinating</option>
            <option value="cross">Cross-pollinating</option>
            <option value="insect">Insect-pollinated</option>
            <option value="wind">Wind-pollinated</option>
            <option value="bird">Bird-pollinated</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Primary method of pollination</p>
        </div>

        {/* Isolation Distance */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Isolation Distance (meters)</label>
          <input
            type="number"
            name="isolationDistance"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            placeholder="e.g., 100"
          />
          <p class="mt-1 text-sm text-gray-500">Recommended isolation distance for seed purity</p>
        </div>

        {/* Days to Maturity (Seeds) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Days to Seed Maturity</label>
          <input
            type="number"
            name="daysToSeedMaturity"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            placeholder="e.g., 120"
          />
          <p class="mt-1 text-sm text-gray-500">Days from flowering to seed harvest</p>
        </div>

        {/* Minimum Population Size */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Minimum Population Size</label>
          <input
            type="number"
            name="minimumPopulationSize"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            placeholder="e.g., 20"
          />
          <p class="mt-1 text-sm text-gray-500">Minimum plants needed for genetic diversity</p>
        </div>

        {/* Seed Extraction Method */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Seed Extraction Method</label>
          <select
            name="seedExtractionMethod"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select extraction method</option>
            <option value="dry">Dry Processing</option>
            <option value="wet">Wet Processing</option>
            <option value="fermentation">Fermentation Processing</option>
            <option value="manual">Manual Extraction</option>
            <option value="mechanical">Mechanical Extraction</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Primary method for extracting seeds</p>
        </div>

        {/* Seed Cleaning Instructions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Seed Cleaning Instructions</label>
          <textarea
            name="seedCleaningInstructions"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Detailed instructions for cleaning seeds..."
          ></textarea>
        </div>

        {/* Seed Storage Conditions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Storage Conditions</label>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="storageConditions"
                value="cool"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Cool</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="storageConditions"
                value="dry"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Dry</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="storageConditions"
                value="dark"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Dark</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="storageConditions"
                value="airtight"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Airtight</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="storageConditions"
                value="freezer"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Freezer</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="storageConditions"
                value="refrigerator"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Refrigerator</label>
            </div>
          </div>
        </div>

        {/* Expected Seed Viability (Years) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Expected Seed Viability (Years)</label>
          <input
            type="number"
            name="seedViability"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            step="0.5"
            placeholder="e.g., 3"
          />
          <p class="mt-1 text-sm text-gray-500">Expected years of seed viability under proper storage</p>
        </div>

        {/* Germination Test Method */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Germination Test Method</label>
          <select
            name="germinationTestMethod"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select test method</option>
            <option value="paper">Paper Towel Test</option>
            <option value="soil">Soil Test</option>
            <option value="water">Water Test</option>
            <option value="sand">Sand Test</option>
            <option value="lab">Laboratory Test</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Recommended method for testing germination</p>
        </div>

        {/* Seed Harvest Indicators */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Seed Harvest Indicators</label>
          <textarea
            name="seedHarvestIndicators"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Visual cues that seeds are ready for harvest..."
          ></textarea>
        </div>

        {/* Special Considerations */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Special Considerations</label>
          <textarea
            name="specialConsiderations"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any special techniques or considerations for this species..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
