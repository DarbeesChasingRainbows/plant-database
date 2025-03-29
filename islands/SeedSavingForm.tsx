import { useState } from "preact/hooks";
import { JSX } from "preact";

interface SeedSavingFormData {
  seedType: string;
  seedSize: string;
  seedColor: string;
  daysToMaturity: string;
  harvestSeason: string;
  harvestingInstructions: string;
  cleaningInstructions: string;
  dryingInstructions: string;
  storageInstructions: string;
  storageLifespan: string;
  germinationRequirements: string;
  stratificationNeeds: string;
  scarificationNeeds: string;
  seedViabilityTest: string;
  seedSavingDifficulty: string;
  crossPollinationConcerns: string;
  isolationDistance: string;
  seedYield: string;
  notes: string;
}

export interface SeedSavingFormProps {
  initialData?: Partial<SeedSavingFormData>;
  actionUrl: string;
  error?: string;
}

export default function SeedSavingForm({ initialData, actionUrl, error }: SeedSavingFormProps) {
  const [formData, setFormData] = useState<SeedSavingFormData>({
    seedType: initialData?.seedType || "",
    seedSize: initialData?.seedSize || "",
    seedColor: initialData?.seedColor || "",
    daysToMaturity: initialData?.daysToMaturity || "",
    harvestSeason: initialData?.harvestSeason || "",
    harvestingInstructions: initialData?.harvestingInstructions || "",
    cleaningInstructions: initialData?.cleaningInstructions || "",
    dryingInstructions: initialData?.dryingInstructions || "",
    storageInstructions: initialData?.storageInstructions || "",
    storageLifespan: initialData?.storageLifespan || "",
    germinationRequirements: initialData?.germinationRequirements || "",
    stratificationNeeds: initialData?.stratificationNeeds || "",
    scarificationNeeds: initialData?.scarificationNeeds || "",
    seedViabilityTest: initialData?.seedViabilityTest || "",
    seedSavingDifficulty: initialData?.seedSavingDifficulty || "",
    crossPollinationConcerns: initialData?.crossPollinationConcerns || "",
    isolationDistance: initialData?.isolationDistance || "",
    seedYield: initialData?.seedYield || "",
    notes: initialData?.notes || ""
  });

  const handleInputChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form method="POST" action={actionUrl} class="space-y-6">
      {error && (
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Seed Characteristics Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Seed Characteristics</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="seedType" class="block text-sm font-medium text-gray-700">
              Seed Type
            </label>
            <select
              id="seedType"
              name="seedType"
              value={formData.seedType}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select seed type</option>
              <option value="Dry Seed">Dry Seed</option>
              <option value="Wet Seed">Wet Seed</option>
              <option value="Pod">Pod</option>
              <option value="Capsule">Capsule</option>
              <option value="Berry">Berry</option>
              <option value="Fruit">Fruit</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label for="seedSize" class="block text-sm font-medium text-gray-700">
              Seed Size
            </label>
            <select
              id="seedSize"
              name="seedSize"
              value={formData.seedSize}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select size</option>
              <option value="Very Small">Very Small</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Very Large">Very Large</option>
            </select>
          </div>
          
          <div>
            <label for="seedColor" class="block text-sm font-medium text-gray-700">
              Seed Color
            </label>
            <input
              type="text"
              id="seedColor"
              name="seedColor"
              value={formData.seedColor}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Brown, Black, Tan"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="daysToMaturity" class="block text-sm font-medium text-gray-700">
              Days to Maturity
            </label>
            <input
              type="text"
              id="daysToMaturity"
              name="daysToMaturity"
              value={formData.daysToMaturity}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 90-120 days"
            />
          </div>
          
          <div>
            <label for="harvestSeason" class="block text-sm font-medium text-gray-700">
              Harvest Season
            </label>
            <select
              id="harvestSeason"
              name="harvestSeason"
              value={formData.harvestSeason}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Late Summer to Fall">Late Summer to Fall</option>
              <option value="Year Round">Year Round</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Harvesting & Processing Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Harvesting & Processing</h3>
        
        <div>
          <label for="harvestingInstructions" class="block text-sm font-medium text-gray-700">
            Harvesting Instructions
          </label>
          <textarea
            id="harvestingInstructions"
            name="harvestingInstructions"
            rows={3}
            value={formData.harvestingInstructions}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe when and how to harvest seeds"
          ></textarea>
        </div>
        
        <div>
          <label for="cleaningInstructions" class="block text-sm font-medium text-gray-700">
            Cleaning Instructions
          </label>
          <textarea
            id="cleaningInstructions"
            name="cleaningInstructions"
            rows={3}
            value={formData.cleaningInstructions}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe how to clean and process seeds"
          ></textarea>
        </div>
        
        <div>
          <label for="dryingInstructions" class="block text-sm font-medium text-gray-700">
            Drying Instructions
          </label>
          <textarea
            id="dryingInstructions"
            name="dryingInstructions"
            rows={3}
            value={formData.dryingInstructions}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe how to dry seeds properly"
          ></textarea>
        </div>
      </div>
      
      {/* Storage Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Storage</h3>
        
        <div>
          <label for="storageInstructions" class="block text-sm font-medium text-gray-700">
            Storage Instructions
          </label>
          <textarea
            id="storageInstructions"
            name="storageInstructions"
            rows={3}
            value={formData.storageInstructions}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe optimal storage conditions"
          ></textarea>
        </div>
        
        <div>
          <label for="storageLifespan" class="block text-sm font-medium text-gray-700">
            Storage Lifespan
          </label>
          <input
            type="text"
            id="storageLifespan"
            name="storageLifespan"
            value={formData.storageLifespan}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 2-3 years under optimal conditions"
          />
        </div>
      </div>
      
      {/* Germination Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Germination</h3>
        
        <div>
          <label for="germinationRequirements" class="block text-sm font-medium text-gray-700">
            Germination Requirements
          </label>
          <textarea
            id="germinationRequirements"
            name="germinationRequirements"
            rows={3}
            value={formData.germinationRequirements}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe temperature, light, and moisture requirements"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="stratificationNeeds" class="block text-sm font-medium text-gray-700">
              Stratification Needs
            </label>
            <input
              type="text"
              id="stratificationNeeds"
              name="stratificationNeeds"
              value={formData.stratificationNeeds}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 4-6 weeks cold stratification"
            />
          </div>
          
          <div>
            <label for="scarificationNeeds" class="block text-sm font-medium text-gray-700">
              Scarification Needs
            </label>
            <input
              type="text"
              id="scarificationNeeds"
              name="scarificationNeeds"
              value={formData.scarificationNeeds}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Light sanding or hot water soak"
            />
          </div>
        </div>
        
        <div>
          <label for="seedViabilityTest" class="block text-sm font-medium text-gray-700">
            Seed Viability Test
          </label>
          <textarea
            id="seedViabilityTest"
            name="seedViabilityTest"
            rows={2}
            value={formData.seedViabilityTest}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe how to test seed viability"
          ></textarea>
        </div>
      </div>
      
      {/* Additional Information Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Additional Information</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="seedSavingDifficulty" class="block text-sm font-medium text-gray-700">
              Seed Saving Difficulty
            </label>
            <select
              id="seedSavingDifficulty"
              name="seedSavingDifficulty"
              value={formData.seedSavingDifficulty}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
              <option value="Very Difficult">Very Difficult</option>
            </select>
          </div>
          
          <div>
            <label for="isolationDistance" class="block text-sm font-medium text-gray-700">
              Isolation Distance
            </label>
            <input
              type="text"
              id="isolationDistance"
              name="isolationDistance"
              value={formData.isolationDistance}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 1/4 mile for cross-pollination prevention"
            />
          </div>
          
          <div>
            <label for="seedYield" class="block text-sm font-medium text-gray-700">
              Seed Yield
            </label>
            <input
              type="text"
              id="seedYield"
              name="seedYield"
              value={formData.seedYield}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., ~100 seeds per plant"
            />
          </div>
        </div>
        
        <div>
          <label for="crossPollinationConcerns" class="block text-sm font-medium text-gray-700">
            Cross-Pollination Concerns
          </label>
          <textarea
            id="crossPollinationConcerns"
            name="crossPollinationConcerns"
            rows={3}
            value={formData.crossPollinationConcerns}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe any cross-pollination concerns with related species"
          ></textarea>
        </div>
        
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Any additional notes about seed saving for this plant"
          ></textarea>
        </div>
      </div>
      
      <div class="pt-5">
        <div class="flex justify-end">
          <button
            type="submit"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
