import { type Plant } from "../../utils/schema.ts";

interface RecipeKeeperFormProps {
  plant?: Plant;
}

export default function RecipeKeeperForm({ _plant }: RecipeKeeperFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Recipe Keeper for Tinctures and Teas</h3>
      
      <div class="grid grid-cols-1 gap-4">
        {/* Recipe Type Selector */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Recipe Type</label>
          <select
            name="recipeType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select recipe type</option>
            <option value="tincture">Tincture</option>
            <option value="tea">Tea/Infusion</option>
            <option value="decoction">Decoction</option>
            <option value="syrup">Syrup</option>
            <option value="oil">Infused Oil</option>
            <option value="salve">Salve/Ointment</option>
            <option value="honey">Infused Honey</option>
            <option value="vinegar">Infused Vinegar</option>
            <option value="glycerite">Glycerite</option>
            <option value="oxymels">Oxymels</option>
            <option value="electuary">Electuary</option>
            <option value="other">Other (specify in notes)</option>
          </select>
        </div>

        {/* Recipe Name */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Recipe Name</label>
          <input
            type="text"
            name="recipeName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Echinacea Immune Support Tincture"
          />
        </div>

        {/* Target Condition/Use */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Target Condition/Use</label>
          <input
            type="text"
            name="targetCondition"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Immune support, inflammation, sleep aid"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Ingredients</label>
          <textarea
            name="ingredients"
            rows={4}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List all ingredients with precise amounts (e.g., 1 oz dried echinacea root, 8 oz 80 proof vodka)"
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">Include plant parts, menstruum (alcohol, water, etc.) with exact measurements</p>
        </div>

        {/* Preparation Method */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Preparation Method</label>
          <textarea
            name="preparationMethod"
            rows={4}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Detailed step-by-step instructions for preparation"
          ></textarea>
        </div>

        {/* Menstruum Details (for tinctures) */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Menstruum Details (for tinctures)</label>
          <div class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Alcohol Percentage</label>
              <select
                name="alcoholPercentage"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select percentage</option>
                <option value="40">40% (80 proof vodka)</option>
                <option value="45">45% (90 proof vodka)</option>
                <option value="48">48% (95 proof grain alcohol)</option>
                <option value="75">75% (diluted 95% alcohol)</option>
                <option value="95">95% (190 proof grain alcohol)</option>
                <option value="other">Other (specify in notes)</option>
                <option value="none">Not applicable</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Alcohol-Water Ratio</label>
              <input
                type="text"
                name="alcoholWaterRatio"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 1:1, 1:2, 1:3"
              />
              <p class="mt-1 text-sm text-gray-500">Plant material to liquid ratio</p>
            </div>
          </div>
        </div>

        {/* Maceration Time */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Maceration Time</label>
          <div class="mt-1 flex items-center">
            <input
              type="number"
              name="macerationTime"
              class="block w-20 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="4"
              min="0"
            />
            <select
              name="macerationTimeUnit"
              class="ml-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks" selected>Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
          <p class="mt-1 text-sm text-gray-500">How long to steep/macerate before straining</p>
        </div>

        {/* Processing Steps */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Processing Steps</label>
          <textarea
            name="processingSteps"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Steps for straining, bottling, etc."
          ></textarea>
        </div>

        {/* Storage Instructions */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Storage Instructions</label>
          <input
            type="text"
            name="storageInstructions"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Store in amber glass bottles in a cool, dark place"
          />
        </div>

        {/* Shelf Life */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Shelf Life</label>
          <div class="mt-1 flex items-center">
            <input
              type="number"
              name="shelfLife"
              class="block w-20 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="2"
              min="0"
            />
            <select
              name="shelfLifeUnit"
              class="ml-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years" selected>Years</option>
            </select>
          </div>
        </div>

        {/* Dosage Instructions */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Dosage Instructions</label>
          <textarea
            name="dosageInstructions"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Recommended adult dosage, frequency, timing, etc."
          ></textarea>
        </div>

        {/* Additional Notes */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            name="additionalNotes"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Additional information, variations, substitutions, etc."
          ></textarea>
        </div>

        {/* Effectiveness Rating */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Effectiveness Rating</label>
          <div class="mt-2">
            <fieldset class="flex gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} class="flex items-center">
                  <input
                    id={`rating-${rating}`}
                    name="effectivenessRating"
                    type="radio"
                    value={rating}
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label for={`rating-${rating}`} class="ml-2 block text-sm text-gray-700">
                    {rating}
                  </label>
                </div>
              ))}
            </fieldset>
            <p class="mt-1 text-sm text-gray-500">1 = Not effective, 5 = Very effective</p>
          </div>
        </div>

        {/* Date Created */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Date Created</label>
          <input
            type="date"
            name="dateCreated"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Source/Attribution */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Source/Attribution</label>
          <input
            type="text"
            name="source"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Traditional recipe, specific herbalist, book, etc."
          />
        </div>
      </div>
    </div>
  );
}
