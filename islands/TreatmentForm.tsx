import { useSignal } from "@preact/signals";

interface Plant {
  id: number;
  name: string;
}

interface TreatmentFormProps {
  plants: Plant[];
  initialValues?: {
    treatmentId?: number;
    plantId?: number;
    treatmentType?: string;
    treatmentName?: string;
    chemicalComposition?: string;
    concentration?: string;
    applicationMethod?: string;
    duration?: string;
    effectiveness?: string;
    precautions?: string;
    notes?: string;
  };
  isEditing?: boolean;
}

export default function TreatmentForm({ plants, initialValues = {}, isEditing = false }: TreatmentFormProps) {
  // Use signals instead of useState to avoid conditional hook calls
  const formData = useSignal({
    plantId: initialValues.plantId?.toString() || "",
    treatmentType: initialValues.treatmentType || "",
    treatmentName: initialValues.treatmentName || "",
    chemicalComposition: initialValues.chemicalComposition || "",
    concentration: initialValues.concentration || "",
    applicationMethod: initialValues.applicationMethod || "",
    duration: initialValues.duration || "",
    effectiveness: initialValues.effectiveness || "",
    precautions: initialValues.precautions || "",
    notes: initialValues.notes || "",
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    formData.value = {
      ...formData.value,
      [target.name]: target.value,
    };
  };

  return (
    <form method="POST" class="space-y-6">
      {isEditing && initialValues.treatmentId && (
        <input type="hidden" name="treatmentId" value={initialValues.treatmentId} />
      )}
      
      <div>
        <label htmlFor="plantId" class="block text-sm font-medium text-gray-700">
          Plant
        </label>
        <select
          id="plantId"
          name="plantId"
          required
          value={formData.value.plantId}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a plant</option>
          {plants.map((plant) => (
            <option key={plant.id} value={plant.id}>
              {plant.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="treatmentName" class="block text-sm font-medium text-gray-700">
          Treatment Name
        </label>
        <input
          type="text"
          name="treatmentName"
          id="treatmentName"
          value={formData.value.treatmentName}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="treatmentType" class="block text-sm font-medium text-gray-700">
          Treatment Type
        </label>
        <input
          type="text"
          name="treatmentType"
          id="treatmentType"
          value={formData.value.treatmentType}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Chemical, Organic, Physical"
        />
      </div>

      <div>
        <label htmlFor="chemicalComposition" class="block text-sm font-medium text-gray-700">
          Chemical Composition
        </label>
        <textarea
          name="chemicalComposition"
          id="chemicalComposition"
          rows={3}
          value={formData.value.chemicalComposition}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="concentration" class="block text-sm font-medium text-gray-700">
          Concentration
        </label>
        <input
          type="text"
          name="concentration"
          id="concentration"
          value={formData.value.concentration}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., 5%, 10 ppm"
        />
      </div>

      <div>
        <label htmlFor="applicationMethod" class="block text-sm font-medium text-gray-700">
          Application Method
        </label>
        <textarea
          name="applicationMethod"
          id="applicationMethod"
          rows={3}
          value={formData.value.applicationMethod}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="duration" class="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <input
          type="text"
          name="duration"
          id="duration"
          value={formData.value.duration}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., 30 minutes, 2 hours"
        />
      </div>

      <div>
        <label htmlFor="effectiveness" class="block text-sm font-medium text-gray-700">
          Effectiveness
        </label>
        <textarea
          name="effectiveness"
          id="effectiveness"
          rows={3}
          value={formData.value.effectiveness}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="precautions" class="block text-sm font-medium text-gray-700">
          Precautions
        </label>
        <textarea
          name="precautions"
          id="precautions"
          rows={3}
          value={formData.value.precautions}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" class="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          value={formData.value.notes}
          onChange={handleChange}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isEditing ? "Update Treatment" : "Create Treatment"}
        </button>
      </div>
    </form>
  );
}
