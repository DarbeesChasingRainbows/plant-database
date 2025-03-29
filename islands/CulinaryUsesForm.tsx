import { useState } from "preact/hooks";
import { JSX } from "preact";

interface CulinaryUsesFormData {
  edibleParts: string[];
  flavorProfile: string;
  culinaryCategory: string;
  preparationMethods: string;
  commonDishes: string;
  cuisines: string[];
  harvestingSeason: string;
  nutritionalInfo: string;
  substitutions: string;
  pairsWith: string[];
  storageMethod: string;
  preservationMethods: string;
  specialConsiderations: string;
  notes: string;
}

export interface CulinaryUsesFormProps {
  initialData?: Partial<CulinaryUsesFormData>;
  actionUrl: string;
  error?: string;
}

export default function CulinaryUsesForm({ initialData, actionUrl, error }: CulinaryUsesFormProps) {
  // Convert array fields to comma-separated strings for editing
  const [formData, setFormData] = useState<{
    edibleParts: string;
    flavorProfile: string;
    culinaryCategory: string;
    preparationMethods: string;
    commonDishes: string;
    cuisines: string;
    harvestingSeason: string;
    nutritionalInfo: string;
    substitutions: string;
    pairsWith: string;
    storageMethod: string;
    preservationMethods: string;
    specialConsiderations: string;
    notes: string;
  }>({
    edibleParts: initialData?.edibleParts ? initialData.edibleParts.join(", ") : "",
    flavorProfile: initialData?.flavorProfile || "",
    culinaryCategory: initialData?.culinaryCategory || "",
    preparationMethods: initialData?.preparationMethods || "",
    commonDishes: initialData?.commonDishes || "",
    cuisines: initialData?.cuisines ? initialData.cuisines.join(", ") : "",
    harvestingSeason: initialData?.harvestingSeason || "",
    nutritionalInfo: initialData?.nutritionalInfo || "",
    substitutions: initialData?.substitutions || "",
    pairsWith: initialData?.pairsWith ? initialData.pairsWith.join(", ") : "",
    storageMethod: initialData?.storageMethod || "",
    preservationMethods: initialData?.preservationMethods || "",
    specialConsiderations: initialData?.specialConsiderations || "",
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
      
      {/* Basic Culinary Information Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Basic Culinary Information</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="edibleParts" class="block text-sm font-medium text-gray-700">
              Edible Parts <span class="text-xs text-gray-500">(comma separated)</span>
            </label>
            <input
              type="text"
              id="edibleParts"
              name="edibleParts"
              value={formData.edibleParts}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Leaves, Flowers, Roots, Seeds"
            />
            <p class="mt-1 text-xs text-gray-500">Enter parts separated by commas</p>
          </div>
          
          <div>
            <label for="flavorProfile" class="block text-sm font-medium text-gray-700">
              Flavor Profile
            </label>
            <input
              type="text"
              id="flavorProfile"
              name="flavorProfile"
              value={formData.flavorProfile}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Sweet, Bitter, Pungent, Earthy"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="culinaryCategory" class="block text-sm font-medium text-gray-700">
              Culinary Category
            </label>
            <select
              id="culinaryCategory"
              name="culinaryCategory"
              value={formData.culinaryCategory}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select category</option>
              <option value="Herb">Herb</option>
              <option value="Spice">Spice</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Nut">Nut</option>
              <option value="Grain">Grain</option>
              <option value="Legume">Legume</option>
              <option value="Root">Root</option>
              <option value="Leafy Green">Leafy Green</option>
              <option value="Flower">Flower</option>
              <option value="Mushroom">Mushroom</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label for="harvestingSeason" class="block text-sm font-medium text-gray-700">
              Harvesting Season
            </label>
            <select
              id="harvestingSeason"
              name="harvestingSeason"
              value={formData.harvestingSeason}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Year-round">Year-round</option>
              <option value="Spring-Summer">Spring-Summer</option>
              <option value="Summer-Fall">Summer-Fall</option>
              <option value="Fall-Winter">Fall-Winter</option>
              <option value="Winter-Spring">Winter-Spring</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Preparation & Uses Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Preparation & Uses</h3>
        
        <div>
          <label for="preparationMethods" class="block text-sm font-medium text-gray-700">
            Preparation Methods
          </label>
          <textarea
            id="preparationMethods"
            name="preparationMethods"
            rows={3}
            value={formData.preparationMethods}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe how to prepare this plant for culinary use"
          ></textarea>
        </div>
        
        <div>
          <label for="commonDishes" class="block text-sm font-medium text-gray-700">
            Common Dishes
          </label>
          <textarea
            id="commonDishes"
            name="commonDishes"
            rows={3}
            value={formData.commonDishes}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="List common dishes that use this plant"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="cuisines" class="block text-sm font-medium text-gray-700">
              Cuisines <span class="text-xs text-gray-500">(comma separated)</span>
            </label>
            <input
              type="text"
              id="cuisines"
              name="cuisines"
              value={formData.cuisines}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Mediterranean, Asian, Indian, French"
            />
          </div>
          
          <div>
            <label for="pairsWith" class="block text-sm font-medium text-gray-700">
              Pairs Well With <span class="text-xs text-gray-500">(comma separated)</span>
            </label>
            <input
              type="text"
              id="pairsWith"
              name="pairsWith"
              value={formData.pairsWith}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Garlic, Lemon, Chicken, Tomatoes"
            />
          </div>
        </div>
      </div>
      
      {/* Storage & Preservation Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Storage & Preservation</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="storageMethod" class="block text-sm font-medium text-gray-700">
              Storage Method
            </label>
            <select
              id="storageMethod"
              name="storageMethod"
              value={formData.storageMethod}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select method</option>
              <option value="Refrigerate">Refrigerate</option>
              <option value="Freeze">Freeze</option>
              <option value="Room Temperature">Room Temperature</option>
              <option value="Cool, Dark Place">Cool, Dark Place</option>
              <option value="Dry">Dry</option>
              <option value="Multiple Methods">Multiple Methods</option>
            </select>
          </div>
          
          <div>
            <label for="preservationMethods" class="block text-sm font-medium text-gray-700">
              Preservation Methods
            </label>
            <textarea
              id="preservationMethods"
              name="preservationMethods"
              rows={3}
              value={formData.preservationMethods}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Drying, Freezing, Pickling, Fermenting"
            ></textarea>
          </div>
        </div>
      </div>
      
      {/* Nutritional & Additional Information Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Nutritional & Additional Information</h3>
        
        <div>
          <label for="nutritionalInfo" class="block text-sm font-medium text-gray-700">
            Nutritional Information
          </label>
          <textarea
            id="nutritionalInfo"
            name="nutritionalInfo"
            rows={3}
            value={formData.nutritionalInfo}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe nutritional benefits and content"
          ></textarea>
        </div>
        
        <div>
          <label for="substitutions" class="block text-sm font-medium text-gray-700">
            Substitutions
          </label>
          <textarea
            id="substitutions"
            name="substitutions"
            rows={2}
            value={formData.substitutions}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="What can be used as a substitute for this plant"
          ></textarea>
        </div>
        
        <div>
          <label for="specialConsiderations" class="block text-sm font-medium text-gray-700">
            Special Considerations
          </label>
          <textarea
            id="specialConsiderations"
            name="specialConsiderations"
            rows={2}
            value={formData.specialConsiderations}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Any special considerations for culinary use (allergies, interactions, etc.)"
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
            placeholder="Any additional notes about culinary uses"
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
