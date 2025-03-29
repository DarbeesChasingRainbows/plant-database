import { type Plant } from "../../utils/schema.ts";

interface CulinaryUsesFormProps {
  plant?: Plant;
}

export default function CulinaryUsesForm({ _plant }: CulinaryUsesFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Culinary and Folk Tradition Uses</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Edible Parts */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Edible Parts</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="leaves"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Leaves</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="flowers"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Flowers</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="stems"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Stems</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="roots"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Roots</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="fruits"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Fruits</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="seeds"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Seeds</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="bark"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Bark</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="sap"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sap</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="edibleParts"
                value="whole"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Whole Plant</label>
            </div>
          </div>
        </div>

        {/* Primary Flavor Profile */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Primary Flavor Profile</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="sweet"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sweet</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="sour"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sour</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="salty"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Salty</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="bitter"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Bitter</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="umami"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Umami</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="pungent"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Pungent</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="aromatic"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Aromatic</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="flavorProfile"
                value="astringent"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Astringent</label>
            </div>
          </div>
        </div>

        {/* Culinary Categories */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Culinary Categories</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="vegetable"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Vegetable</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="fruit"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Fruit</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="herb"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Herb</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="spice"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Spice</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="starch"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Starch/Grain</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="nut"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Nut/Seed</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="oil"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Oil</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="beverage"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Beverage</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="culinaryCategories"
                value="sweetener"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sweetener</label>
            </div>
          </div>
        </div>

        {/* Preparation Methods */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Common Preparation Methods</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="raw"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Raw</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="steamed"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Steamed</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="boiled"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Boiled</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="roasted"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Roasted</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="sauteed"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sautéed</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="fried"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Fried</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="baked"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Baked</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="fermented"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Fermented</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="pickled"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Pickled</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="dried"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Dried</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="infused"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Infused</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationMethods"
                value="preserved"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Preserved</label>
            </div>
          </div>
        </div>

        {/* Traditional Culinary Uses */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Traditional Culinary Uses</label>
          <textarea
            name="traditionalCulinaryUses"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe traditional ways this plant has been used in cooking..."
          ></textarea>
        </div>

        {/* Modern Culinary Applications */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Modern Culinary Applications</label>
          <textarea
            name="modernCulinaryApplications"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe contemporary cooking methods and recipes..."
          ></textarea>
        </div>

        {/* Companion Ingredients */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Companion Ingredients</label>
          <input
            type="text"
            name="companionIngredients"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List ingredients that pair well with this plant..."
          />
          <p class="mt-1 text-sm text-gray-500">Comma-separated list of complementary ingredients</p>
        </div>

        {/* Cultural Significance */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Cultural Significance</label>
          <textarea
            name="culturalSignificance"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe cultural and historical significance in different traditions..."
          ></textarea>
        </div>

        {/* Folk Uses */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Folk Tradition Uses</label>
          <textarea
            name="folkUses"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe folk medicine, ceremonial, or other traditional non-culinary uses..."
          ></textarea>
        </div>

        {/* Seasonal Availability */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Seasonal Availability</label>
          <div class="mt-2 grid grid-cols-4 gap-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="seasonalAvailability"
                value="spring"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Spring</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="seasonalAvailability"
                value="summer"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Summer</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="seasonalAvailability"
                value="fall"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Fall</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="seasonalAvailability"
                value="winter"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Winter</label>
            </div>
          </div>
        </div>

        {/* Culinary Recipes */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Culinary Recipes</label>
          <textarea
            name="culinaryRecipes"
            rows={4}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Share specific recipes that feature this plant..."
          ></textarea>
        </div>

        {/* Nutritional Information */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Nutritional Information</label>
          <textarea
            name="nutritionalInformation"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Include key nutrients, calories, and other nutritional data if available..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
