import { type Plant } from "../../utils/schema.ts";

interface HorticultureFormProps {
  plant?: Plant;
}

export default function HorticultureForm({ plant }: HorticultureFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Horticulture Information</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Propagation Methods */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Propagation Methods</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="propagationMethods"
                value="seed"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Seed</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="propagationMethods"
                value="cutting"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Cutting</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="propagationMethods"
                value="division"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Division</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="propagationMethods"
                value="layering"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Layering</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="propagationMethods"
                value="grafting"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Grafting</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="propagationMethods"
                value="tissueculture"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Tissue Culture</label>
            </div>
          </div>
        </div>

        {/* Optimal Growing Conditions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Optimal Growing Conditions</label>
          <textarea
            name="optimalGrowingConditions"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe ideal soil composition, pH, light, temperature, and humidity..."
          ></textarea>
        </div>

        {/* Plant Spacing */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Plant Spacing (cm)</label>
          <input
            type="number"
            name="plantSpacing"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            placeholder="30"
          />
          <p class="mt-1 text-sm text-gray-500">Recommended spacing between plants</p>
        </div>

        {/* Row Spacing */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Row Spacing (cm)</label>
          <input
            type="number"
            name="rowSpacing"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
            placeholder="60"
          />
          <p class="mt-1 text-sm text-gray-500">Recommended spacing between rows</p>
        </div>

        {/* Planting Depth */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Planting Depth (cm)</label>
          <input
            type="number"
            name="plantingDepth"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            step="0.1"
            min="0"
            placeholder="1.5"
          />
          <p class="mt-1 text-sm text-gray-500">Recommended planting depth</p>
        </div>

        {/* Growth Rate */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Growth Rate</label>
          <select
            name="growthRate"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select growth rate</option>
            <option value="slow">Slow</option>
            <option value="moderate">Moderate</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        {/* Pruning Requirements */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Pruning Requirements</label>
          <textarea
            name="pruningRequirements"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe when and how to prune..."
          ></textarea>
        </div>

        {/* Fertility Requirements */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Fertility Requirements</label>
          <textarea
            name="fertilityRequirements"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe nutrient needs and fertilization schedule..."
          ></textarea>
        </div>

        {/* Disease Management */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Disease Management</label>
          <textarea
            name="diseaseManagement"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Common diseases and prevention strategies..."
          ></textarea>
        </div>

        {/* Pest Management */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Pest Management</label>
          <textarea
            name="pestManagement"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Common pests and prevention strategies..."
          ></textarea>
        </div>

        {/* Special Care Instructions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Special Care Instructions</label>
          <textarea
            name="specialCareInstructions"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any special considerations or unique care requirements..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
