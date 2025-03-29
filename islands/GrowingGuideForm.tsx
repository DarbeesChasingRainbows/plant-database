import { useState } from "preact/hooks";
import { JSX } from "preact";

interface GrowingGuideFormData {
  springPlantingStart: string;
  springPlantingEnd: string;
  fallPlantingStart: string;
  fallPlantingEnd: string;
  indoorSowingStart: string;
  transplantReadyWeeks: string;
  directSowAfterFrost: string;
  frostTolerance: string;
  heatTolerance: string;
  successionPlantingInterval: string;
  companionPlants: string[];
  incompatiblePlants: string[];
  rotationGroup: string;
  rotationInterval: string;
}

export interface GrowingGuideFormProps {
  initialData?: Partial<GrowingGuideFormData>;
  actionUrl: string;
  error?: string;
}

export default function GrowingGuideForm({ initialData, actionUrl, error }: GrowingGuideFormProps) {
  const [formData, setFormData] = useState<GrowingGuideFormData>({
    springPlantingStart: initialData?.springPlantingStart || "",
    springPlantingEnd: initialData?.springPlantingEnd || "",
    fallPlantingStart: initialData?.fallPlantingStart || "",
    fallPlantingEnd: initialData?.fallPlantingEnd || "",
    indoorSowingStart: initialData?.indoorSowingStart || "",
    transplantReadyWeeks: initialData?.transplantReadyWeeks || "",
    directSowAfterFrost: initialData?.directSowAfterFrost || "",
    frostTolerance: initialData?.frostTolerance || "",
    heatTolerance: initialData?.heatTolerance || "",
    successionPlantingInterval: initialData?.successionPlantingInterval || "",
    companionPlants: initialData?.companionPlants || [""],
    incompatiblePlants: initialData?.incompatiblePlants || [""],
    rotationGroup: initialData?.rotationGroup || "",
    rotationInterval: initialData?.rotationInterval || ""
  });

  const handleInputChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayItemChange = (field: keyof GrowingGuideFormData, index: number, value: string) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof GrowingGuideFormData) => {
    setFormData({ 
      ...formData, 
      [field]: [...(formData[field] as string[]), ""] 
    });
  };

  const removeArrayItem = (field: keyof GrowingGuideFormData, index: number) => {
    const newArray = [...(formData[field] as string[])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  // Helper function to render array input fields
  const renderArrayField = (
    field: keyof GrowingGuideFormData,
    label: string,
    buttonText: string,
    placeholder: string,
    buttonColor: string
  ) => (
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          class={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {buttonText}
        </button>
      </div>
      
      <div class="space-y-2">
        {(formData[field] as string[]).map((item, index) => (
          <div key={index} class="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayItemChange(field, index, (e.target as HTMLInputElement).value)}
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={placeholder}
            />
            {(formData[field] as string[]).length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
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
      <input type="hidden" name={field} value={(formData[field] as string[]).join('|')} />
    </div>
  );

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
      
      {/* Planting Information Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Planting Information</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="springPlantingStart" class="block text-sm font-medium text-gray-700">
              Spring Planting Start
            </label>
            <input
              type="text"
              id="springPlantingStart"
              name="springPlantingStart"
              value={formData.springPlantingStart}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 4 weeks before last frost"
            />
          </div>
          
          <div>
            <label for="springPlantingEnd" class="block text-sm font-medium text-gray-700">
              Spring Planting End
            </label>
            <input
              type="text"
              id="springPlantingEnd"
              name="springPlantingEnd"
              value={formData.springPlantingEnd}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 2 weeks after last frost"
            />
          </div>
          
          <div>
            <label for="fallPlantingStart" class="block text-sm font-medium text-gray-700">
              Fall Planting Start
            </label>
            <input
              type="text"
              id="fallPlantingStart"
              name="fallPlantingStart"
              value={formData.fallPlantingStart}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 8 weeks before first frost"
            />
          </div>
          
          <div>
            <label for="fallPlantingEnd" class="block text-sm font-medium text-gray-700">
              Fall Planting End
            </label>
            <input
              type="text"
              id="fallPlantingEnd"
              name="fallPlantingEnd"
              value={formData.fallPlantingEnd}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 2 weeks before first frost"
            />
          </div>
          
          <div>
            <label for="indoorSowingStart" class="block text-sm font-medium text-gray-700">
              Indoor Sowing Start
            </label>
            <input
              type="text"
              id="indoorSowingStart"
              name="indoorSowingStart"
              value={formData.indoorSowingStart}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 6 weeks before last frost"
            />
          </div>
          
          <div>
            <label for="transplantReadyWeeks" class="block text-sm font-medium text-gray-700">
              Transplant Ready Weeks
            </label>
            <input
              type="text"
              id="transplantReadyWeeks"
              name="transplantReadyWeeks"
              value={formData.transplantReadyWeeks}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 2-3 weeks"
            />
          </div>
          
          <div>
            <label for="directSowAfterFrost" class="block text-sm font-medium text-gray-700">
              Direct Sow After Frost
            </label>
            <input
              type="text"
              id="directSowAfterFrost"
              name="directSowAfterFrost"
              value={formData.directSowAfterFrost}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 1 week after last frost"
            />
          </div>
          
          <div>
            <label for="frostTolerance" class="block text-sm font-medium text-gray-700">
              Frost Tolerance
            </label>
            <input
              type="text"
              id="frostTolerance"
              name="frostTolerance"
              value={formData.frostTolerance}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Light frost, 25°F (-4°C)"
            />
          </div>
          
          <div>
            <label for="heatTolerance" class="block text-sm font-medium text-gray-700">
              Heat Tolerance
            </label>
            <input
              type="text"
              id="heatTolerance"
              name="heatTolerance"
              value={formData.heatTolerance}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., High heat, 85°F (29°C)"
            />
          </div>
          
          <div>
            <label for="successionPlantingInterval" class="block text-sm font-medium text-gray-700">
              Succession Planting Interval
            </label>
            <input
              type="text"
              id="successionPlantingInterval"
              name="successionPlantingInterval"
              value={formData.successionPlantingInterval}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Every 1-2 weeks"
            />
          </div>
        </div>
        
        {renderArrayField(
          'companionPlants',
          'Companion Plants',
          '+ Add Plant',
          'e.g., Basil, Marigold',
          'text-green-700 bg-green-100 hover:bg-green-200'
        )}
        
        {renderArrayField(
          'incompatiblePlants',
          'Incompatible Plants',
          '+ Add Plant',
          'e.g., Fennel, Dill',
          'text-red-700 bg-red-100 hover:bg-red-200'
        )}
      </div>
      
      {/* Crop Rotation Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Crop Rotation</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="rotationGroup" class="block text-sm font-medium text-gray-700">
              Rotation Group
            </label>
            <input
              type="text"
              id="rotationGroup"
              name="rotationGroup"
              value={formData.rotationGroup}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Brassicas, Solanaceae"
            />
          </div>
          
          <div>
            <label for="rotationInterval" class="block text-sm font-medium text-gray-700">
              Rotation Interval
            </label>
            <input
              type="text"
              id="rotationInterval"
              name="rotationInterval"
              value={formData.rotationInterval}
              onChange={handleInputChange}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 2-3 years"
            />
          </div>
        </div>
      </div>
      
      <div class="pt-5">
        <div class="flex justify-end">
          <button
            type="submit"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
