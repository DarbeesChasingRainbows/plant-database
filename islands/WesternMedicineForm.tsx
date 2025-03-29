import { useState } from "preact/hooks";
import { JSX } from "preact";

interface WesternMedicineFormData {
  clinicalIndications: string[];
  activeCompounds: string[];
  pharmacologicalActions: string[];
  clinicalStudies: string;
  drugInteractions: string;
  contraindications: string;
  sideEffects: string;
  safetyProfile: string;
  standardDosage: string;
  preparations: string;
  regulatoryStatus: string;
  notes: string;
}

export interface WesternMedicineFormProps {
  initialData?: Partial<WesternMedicineFormData>;
  actionUrl: string;
  error?: string;
}

export default function WesternMedicineForm({ initialData, actionUrl, error }: WesternMedicineFormProps) {
  const [formData, setFormData] = useState<WesternMedicineFormData>({
    clinicalIndications: initialData?.clinicalIndications || [""],
    activeCompounds: initialData?.activeCompounds || [""],
    pharmacologicalActions: initialData?.pharmacologicalActions || [""],
    clinicalStudies: initialData?.clinicalStudies || "",
    drugInteractions: initialData?.drugInteractions || "",
    contraindications: initialData?.contraindications || "",
    sideEffects: initialData?.sideEffects || "",
    safetyProfile: initialData?.safetyProfile || "",
    standardDosage: initialData?.standardDosage || "",
    preparations: initialData?.preparations || "",
    regulatoryStatus: initialData?.regulatoryStatus || "",
    notes: initialData?.notes || ""
  });

  const handleInputChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayItemChange = (field: keyof WesternMedicineFormData, index: number, value: string) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof WesternMedicineFormData) => {
    setFormData({ 
      ...formData, 
      [field]: [...(formData[field] as string[]), ""] 
    });
  };

  const removeArrayItem = (field: keyof WesternMedicineFormData, index: number) => {
    const newArray = [...(formData[field] as string[])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
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
      
      {/* Clinical Indications */}
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">
            Clinical Indications
          </label>
          <button
            type="button"
            onClick={() => addArrayItem('clinicalIndications')}
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Indication
          </button>
        </div>
        
        <div class="space-y-2">
          {formData.clinicalIndications.map((indication, index) => (
            <div key={index} class="flex items-center space-x-2">
              <input
                type="text"
                value={indication}
                onChange={(e) => handleArrayItemChange('clinicalIndications', index, (e.target as HTMLInputElement).value)}
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`e.g., Anxiety, Inflammation, etc.`}
              />
              {formData.clinicalIndications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('clinicalIndications', index)}
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
        <input type="hidden" name="clinicalIndications" value={formData.clinicalIndications.join('|')} />
      </div>
      
      {/* Active Compounds */}
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">
            Active Compounds
          </label>
          <button
            type="button"
            onClick={() => addArrayItem('activeCompounds')}
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            + Add Compound
          </button>
        </div>
        
        <div class="space-y-2">
          {formData.activeCompounds.map((compound, index) => (
            <div key={index} class="flex items-center space-x-2">
              <input
                type="text"
                value={compound}
                onChange={(e) => handleArrayItemChange('activeCompounds', index, (e.target as HTMLInputElement).value)}
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`e.g., Flavonoids, Alkaloids, etc.`}
              />
              {formData.activeCompounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('activeCompounds', index)}
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
        <input type="hidden" name="activeCompounds" value={formData.activeCompounds.join('|')} />
      </div>
      
      {/* Pharmacological Actions */}
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">
            Pharmacological Actions
          </label>
          <button
            type="button"
            onClick={() => addArrayItem('pharmacologicalActions')}
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Action
          </button>
        </div>
        
        <div class="space-y-2">
          {formData.pharmacologicalActions.map((action, index) => (
            <div key={index} class="flex items-center space-x-2">
              <input
                type="text"
                value={action}
                onChange={(e) => handleArrayItemChange('pharmacologicalActions', index, (e.target as HTMLInputElement).value)}
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`e.g., Anti-inflammatory, Anxiolytic, etc.`}
              />
              {formData.pharmacologicalActions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('pharmacologicalActions', index)}
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
        <input type="hidden" name="pharmacologicalActions" value={formData.pharmacologicalActions.join('|')} />
      </div>
      
      {/* Clinical Studies */}
      <div>
        <label for="clinicalStudies" class="block text-sm font-medium text-gray-700">
          Clinical Studies
        </label>
        <textarea
          id="clinicalStudies"
          name="clinicalStudies"
          rows={4}
          value={formData.clinicalStudies}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Summarize relevant clinical studies and research findings"
        ></textarea>
      </div>
      
      {/* Standard Dosage */}
      <div>
        <label for="standardDosage" class="block text-sm font-medium text-gray-700">
          Standard Dosage
        </label>
        <textarea
          id="standardDosage"
          name="standardDosage"
          rows={3}
          value={formData.standardDosage}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Standard dosage information based on clinical evidence"
        ></textarea>
      </div>
      
      {/* Preparations */}
      <div>
        <label for="preparations" class="block text-sm font-medium text-gray-700">
          Preparations
        </label>
        <textarea
          id="preparations"
          name="preparations"
          rows={3}
          value={formData.preparations}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Common pharmaceutical or standardized preparations"
        ></textarea>
      </div>
      
      {/* Safety Profile Section */}
      <div class="border border-gray-200 rounded-md p-4 space-y-4">
        <h3 class="font-medium text-gray-900">Safety Profile</h3>
        
        {/* Contraindications */}
        <div>
          <label for="contraindications" class="block text-sm font-medium text-gray-700">
            Contraindications
          </label>
          <textarea
            id="contraindications"
            name="contraindications"
            rows={3}
            value={formData.contraindications}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Conditions or situations where use is not recommended"
          ></textarea>
        </div>
        
        {/* Drug Interactions */}
        <div>
          <label for="drugInteractions" class="block text-sm font-medium text-gray-700">
            Drug Interactions
          </label>
          <textarea
            id="drugInteractions"
            name="drugInteractions"
            rows={3}
            value={formData.drugInteractions}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Known interactions with medications"
          ></textarea>
        </div>
        
        {/* Side Effects */}
        <div>
          <label for="sideEffects" class="block text-sm font-medium text-gray-700">
            Side Effects
          </label>
          <textarea
            id="sideEffects"
            name="sideEffects"
            rows={3}
            value={formData.sideEffects}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Common or significant side effects"
          ></textarea>
        </div>
        
        {/* Safety Profile */}
        <div>
          <label for="safetyProfile" class="block text-sm font-medium text-gray-700">
            Overall Safety Profile
          </label>
          <textarea
            id="safetyProfile"
            name="safetyProfile"
            rows={3}
            value={formData.safetyProfile}
            onChange={handleInputChange}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="General safety assessment (e.g., Generally Recognized as Safe, etc.)"
          ></textarea>
        </div>
      </div>
      
      {/* Regulatory Status */}
      <div>
        <label for="regulatoryStatus" class="block text-sm font-medium text-gray-700">
          Regulatory Status
        </label>
        <input
          type="text"
          id="regulatoryStatus"
          name="regulatoryStatus"
          value={formData.regulatoryStatus}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., FDA approved, ESCOP monograph, etc."
        />
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
          placeholder="Any additional information about western medicine applications"
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
