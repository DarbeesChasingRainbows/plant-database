import { useState } from "preact/hooks";
import { JSX } from "preact";

interface HerbalPreparationFormData {
  name: string;
  type: string;
  ingredients: string[];
  instructions: string;
  adultDosage: string;
  childDosage: string;
  elderlyDosage: string;
  specialDosage: string;
  storageInstructions: string;
  shelfLife: string;
  indications: string;
  notes: string;
}

export interface HerbalPreparationFormProps {
  initialData?: Partial<HerbalPreparationFormData>;
  actionUrl: string;
  error?: string;
}

const preparationTypes = [
  "Tincture",
  "Tea/Infusion",
  "Decoction",
  "Syrup",
  "Oil",
  "Salve/Balm",
  "Compress",
  "Poultice",
  "Bath",
  "Steam",
  "Powder",
  "Capsule",
  "Electuary",
  "Vinegar",
  "Other"
];

export default function HerbalPreparationForm({ initialData, actionUrl, error }: HerbalPreparationFormProps) {
  const [formData, setFormData] = useState<HerbalPreparationFormData>({
    name: initialData?.name || "",
    type: initialData?.type || "",
    ingredients: initialData?.ingredients || [""],
    instructions: initialData?.instructions || "",
    adultDosage: initialData?.adultDosage || "",
    childDosage: initialData?.childDosage || "",
    elderlyDosage: initialData?.elderlyDosage || "",
    specialDosage: initialData?.specialDosage || "",
    storageInstructions: initialData?.storageInstructions || "",
    shelfLife: initialData?.shelfLife || "",
    indications: initialData?.indications || "",
    notes: initialData?.notes || ""
  });

  const handleInputChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: newIngredients });
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
      
      {/* Preparation Name */}
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Preparation Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Calendula Tincture"
        />
      </div>
      
      {/* Preparation Type */}
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">
          Preparation Type
        </label>
        <select
          id="type"
          name="type"
          required
          value={formData.type}
          onChange={handleInputChange}
          class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select a Type</option>
          {preparationTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      {/* Ingredients */}
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <button
            type="button"
            onClick={addIngredient}
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Ingredient
          </button>
        </div>
        
        <div class="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} class="flex items-center space-x-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, (e.target as HTMLInputElement).value)}
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Ingredient ${index + 1} (e.g., 1 oz dried Calendula flowers)`}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  class="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <input type="hidden" name="ingredients" value={formData.ingredients.join('|')} />
      </div>
      
      {/* Instructions */}
      <div>
        <label for="instructions" class="block text-sm font-medium text-gray-700">
          Preparation Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          rows={5}
          required
          value={formData.instructions}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Detailed step-by-step instructions for preparing this remedy"
        ></textarea>
      </div>
      
      {/* Dosage Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Dosage Guidelines</h3>
        
        <div>
          <label for="adultDosage" class="block text-sm font-medium text-gray-700">
            Adult Dosage
          </label>
          <textarea
            id="adultDosage"
            name="adultDosage"
            rows={2}
            value={formData.adultDosage}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 30-60 drops, 3 times daily"
          ></textarea>
        </div>
        
        <div>
          <label for="childDosage" class="block text-sm font-medium text-gray-700">
            Child Dosage
          </label>
          <textarea
            id="childDosage"
            name="childDosage"
            rows={2}
            value={formData.childDosage}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 5-15 drops for ages 2-12, according to weight"
          ></textarea>
        </div>
        
        <div>
          <label for="elderlyDosage" class="block text-sm font-medium text-gray-700">
            Elderly Dosage
          </label>
          <textarea
            id="elderlyDosage"
            name="elderlyDosage"
            rows={2}
            value={formData.elderlyDosage}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 15-30 drops, 2 times daily"
          ></textarea>
        </div>
        
        <div>
          <label for="specialDosage" class="block text-sm font-medium text-gray-700">
            Special Populations/Conditions
          </label>
          <textarea
            id="specialDosage"
            name="specialDosage"
            rows={2}
            value={formData.specialDosage}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Dosage adjustments for pregnancy, certain medical conditions, etc."
          ></textarea>
        </div>
      </div>
      
      {/* Storage and Shelf Life */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="e.g., Store in amber glass bottles in a cool, dark place"
          ></textarea>
        </div>
        
        <div>
          <label for="shelfLife" class="block text-sm font-medium text-gray-700">
            Shelf Life
          </label>
          <input
            type="text"
            id="shelfLife"
            name="shelfLife"
            value={formData.shelfLife}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 2-3 years if properly stored"
          />
        </div>
      </div>
      
      {/* Indications */}
      <div>
        <label for="indications" class="block text-sm font-medium text-gray-700">
          Indications (What it's used for)
        </label>
        <textarea
          id="indications"
          name="indications"
          rows={3}
          value={formData.indications}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Conditions or symptoms this preparation may help with"
        ></textarea>
      </div>
      
      {/* Notes */}
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
          placeholder="Any additional information about this preparation"
        ></textarea>
      </div>
      
      <div class="pt-5">
        <div class="flex justify-end">
          <button
            type="submit"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
