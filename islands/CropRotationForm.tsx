import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import { useSignal } from "@preact/signals";

interface GardenBed {
  bedId: number;
  bedCode: string;
}

interface CropRotation {
  rotationId?: number;
  bedId: number;
  season: string;
  year: number;
  plantFamilies: string[];
  notes: string;
}

interface CropRotationFormProps {
  rotation?: CropRotation;
  beds: GardenBed[];
  onSubmit: (rotation: CropRotation) => void;
  isSubmitting?: boolean;
}

export default function CropRotationForm({ rotation, beds, onSubmit, isSubmitting = false }: CropRotationFormProps) {
  const [formData, setFormData] = useState<CropRotation>({
    rotationId: rotation?.rotationId,
    bedId: rotation?.bedId || (beds.length > 0 ? beds[0].bedId : 0),
    season: rotation?.season || '',
    year: rotation?.year || new Date().getFullYear(),
    plantFamilies: rotation?.plantFamilies || [],
    notes: rotation?.notes || '',
  });
  
  const [newFamily, setNewFamily] = useState('');
  const errorMessage = useSignal<string | null>(null);
  
  // Update form when rotation prop changes
  useEffect(() => {
    if (rotation) {
      setFormData({
        rotationId: rotation.rotationId,
        bedId: rotation.bedId,
        season: rotation.season,
        year: rotation.year,
        plantFamilies: rotation.plantFamilies,
        notes: rotation.notes,
      });
    }
  }, [rotation]);
  
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    
    setFormData({
      ...formData,
      [name]: target.type === 'number' ? Number(value) : value,
    });
  };
  
  const addPlantFamily = () => {
    if (!newFamily.trim()) return;
    
    setFormData({
      ...formData,
      plantFamilies: [...formData.plantFamilies, newFamily.trim()],
    });
    
    setNewFamily('');
  };
  
  const removePlantFamily = (index: number) => {
    const updatedFamilies = [...formData.plantFamilies];
    updatedFamilies.splice(index, 1);
    
    setFormData({
      ...formData,
      plantFamilies: updatedFamilies,
    });
  };
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.bedId) {
      errorMessage.value = "Please select a garden bed";
      return;
    }
    
    if (!formData.year) {
      errorMessage.value = "Please enter a year";
      return;
    }
    
    // Clear any error
    errorMessage.value = null;
    
    // Submit the form
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {errorMessage.value && (
        <div class="bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{errorMessage.value}</p>
            </div>
          </div>
        </div>
      )}
      
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="bedId" class="block text-sm font-medium text-gray-700">Garden Bed</label>
          <select
            id="bedId"
            name="bedId"
            value={formData.bedId}
            onChange={handleChange}
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a garden bed</option>
            {beds.map((bed) => (
              <option key={bed.bedId} value={bed.bedId}>
                {bed.bedCode}
              </option>
            ))}
          </select>
        </div>
        
        <div class="sm:col-span-3">
          <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            name="year"
            id="year"
            value={formData.year}
            onChange={handleChange}
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div class="sm:col-span-3">
          <label for="season" class="block text-sm font-medium text-gray-700">Season</label>
          <select
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a season (optional)</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        
        <div class="sm:col-span-6">
          <label class="block text-sm font-medium text-gray-700">Plant Families</label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newFamily}
              onChange={(e) => setNewFamily((e.target as HTMLInputElement).value)}
              placeholder="Enter plant family name"
              class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            />
            <button
              type="button"
              onClick={addPlantFamily}
              class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
            >
              Add
            </button>
          </div>
          <div class="mt-2">
            {formData.plantFamilies.length > 0 ? (
              <ul class="divide-y divide-gray-200">
                {formData.plantFamilies.map((family, index) => (
                  <li key={index} class="py-2 flex justify-between">
                    <span class="text-sm text-gray-900">{family}</span>
                    <button
                      type="button"
                      onClick={() => removePlantFamily(index)}
                      class="text-red-600 hover:text-red-900 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p class="text-sm text-gray-500 italic">No plant families added yet</p>
            )}
          </div>
        </div>
        
        <div class="sm:col-span-6">
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <div class="mt-1">
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
