import { useState } from "preact/hooks";
import { JSX } from "preact";

interface AyurvedicPropertiesFormData {
  sanskritName: string;
  rasa: string[];
  virya: string;
  vipaka: string;
  doshaVata: string;
  doshaPitta: string;
  doshaKapha: string;
  gunas: string[];
  dhatus: string[];
  srotas: string[];
  traditionalUsage: string;
  preparations: string;
  dosage: string;
  contraindications: string;
  interactions: string;
  notes: string;
}

export interface AyurvedicFormProps {
  initialData?: Partial<AyurvedicPropertiesFormData>;
  actionUrl: string;
  error?: string;
}

const rasaOptions = [
  "Madhura (Sweet)",
  "Amla (Sour)",
  "Lavana (Salty)",
  "Katu (Pungent)",
  "Tikta (Bitter)",
  "Kashaya (Astringent)"
];

const viryaOptions = [
  "Ushna (Hot)",
  "Sheeta (Cold)"
];

const vipakaOptions = [
  "Madhura (Sweet)",
  "Amla (Sour)",
  "Katu (Pungent)"
];

const doshaEffectOptions = [
  "Increases",
  "Decreases",
  "Balances",
  "Neutral"
];

const gunaOptions = [
  "Guru (Heavy)",
  "Laghu (Light)",
  "Manda (Slow)",
  "Tikshna (Sharp)",
  "Sheeta (Cold)",
  "Ushna (Hot)",
  "Snigdha (Oily)",
  "Ruksha (Dry)",
  "Slakshna (Smooth)",
  "Khara (Rough)",
  "Mridu (Soft)",
  "Kathina (Hard)"
];

const dhatuOptions = [
  "Rasa (Plasma)",
  "Rakta (Blood)",
  "Mamsa (Muscle)",
  "Meda (Fat)",
  "Asthi (Bone)",
  "Majja (Marrow)",
  "Shukra (Reproductive)"
];

const srotasOptions = [
  "Pranavaha (Respiratory)",
  "Annavaha (Digestive)",
  "Udakavaha (Water)",
  "Rasavaha (Plasma)",
  "Raktavaha (Blood)",
  "Mamsavaha (Muscle)",
  "Medavaha (Fat)",
  "Asthivaha (Bone)",
  "Majjavaha (Marrow)",
  "Shukravaha (Reproductive)",
  "Mutravaha (Urinary)",
  "Purishavaha (Fecal)",
  "Swedavaha (Sweat)"
];

export default function AyurvedicPropertiesForm({ initialData, actionUrl, error }: AyurvedicFormProps) {
  const [formData, setFormData] = useState<AyurvedicPropertiesFormData>({
    sanskritName: initialData?.sanskritName || "",
    rasa: initialData?.rasa || [],
    virya: initialData?.virya || "",
    vipaka: initialData?.vipaka || "",
    doshaVata: initialData?.doshaVata || "",
    doshaPitta: initialData?.doshaPitta || "",
    doshaKapha: initialData?.doshaKapha || "",
    gunas: initialData?.gunas || [],
    dhatus: initialData?.dhatus || [],
    srotas: initialData?.srotas || [],
    traditionalUsage: initialData?.traditionalUsage || "",
    preparations: initialData?.preparations || "",
    dosage: initialData?.dosage || "",
    contraindications: initialData?.contraindications || "",
    interactions: initialData?.interactions || "",
    notes: initialData?.notes || ""
  });

  const handleInputChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: JSX.TargetedEvent<HTMLInputElement>, optionGroup: string, option: string) => {
    const { checked } = e.currentTarget;
    const currentOptions = [...(formData[optionGroup as keyof AyurvedicPropertiesFormData] as string[]) || []];
    
    if (checked && !currentOptions.includes(option)) {
      setFormData({ 
        ...formData, 
        [optionGroup]: [...currentOptions, option] 
      });
    } else if (!checked && currentOptions.includes(option)) {
      setFormData({ 
        ...formData, 
        [optionGroup]: currentOptions.filter(item => item !== option) 
      });
    }
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
      
      {/* Sanskrit Name */}
      <div>
        <label for="sanskritName" class="block text-sm font-medium text-gray-700">
          Sanskrit Name
        </label>
        <input
          type="text"
          name="sanskritName"
          id="sanskritName"
          value={formData.sanskritName}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      {/* Rasa (Taste) */}
      <div>
        <span class="block text-sm font-medium text-gray-700 mb-2">
          Rasa (Taste)
        </span>
        <div class="grid grid-cols-2 gap-2">
          {rasaOptions.map((option) => (
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id={`rasa-${option}`}
                  name={`rasa-${option}`}
                  type="checkbox"
                  checked={formData.rasa.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "rasa", option)}
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for={`rasa-${option}`} class="font-medium text-gray-700">{option}</label>
              </div>
            </div>
          ))}
        </div>
        {/* Hidden input to store the actual values */}
        <input type="hidden" name="rasa" value={formData.rasa.join(',')} />
      </div>
      
      {/* Virya (Energy) */}
      <div>
        <label for="virya" class="block text-sm font-medium text-gray-700">
          Virya (Energy)
        </label>
        <select
          id="virya"
          name="virya"
          value={formData.virya}
          onChange={handleInputChange}
          class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Virya</option>
          {viryaOptions.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      {/* Vipaka (Post-digestive Effect) */}
      <div>
        <label for="vipaka" class="block text-sm font-medium text-gray-700">
          Vipaka (Post-digestive Effect)
        </label>
        <select
          id="vipaka"
          name="vipaka"
          value={formData.vipaka}
          onChange={handleInputChange}
          class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Vipaka</option>
          {vipakaOptions.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      {/* Dosha Effects */}
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900">Dosha Effects</h3>
        
        {/* Vata */}
        <div>
          <label for="doshaVata" class="block text-sm font-medium text-gray-700">
            Vata
          </label>
          <select
            id="doshaVata"
            name="doshaVata"
            value={formData.doshaVata}
            onChange={handleInputChange}
            class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Effect on Vata</option>
            {doshaEffectOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {/* Pitta */}
        <div>
          <label for="doshaPitta" class="block text-sm font-medium text-gray-700">
            Pitta
          </label>
          <select
            id="doshaPitta"
            name="doshaPitta"
            value={formData.doshaPitta}
            onChange={handleInputChange}
            class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Effect on Pitta</option>
            {doshaEffectOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {/* Kapha */}
        <div>
          <label for="doshaKapha" class="block text-sm font-medium text-gray-700">
            Kapha
          </label>
          <select
            id="doshaKapha"
            name="doshaKapha"
            value={formData.doshaKapha}
            onChange={handleInputChange}
            class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Effect on Kapha</option>
            {doshaEffectOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Gunas */}
      <div>
        <span class="block text-sm font-medium text-gray-700 mb-2">
          Gunas (Qualities)
        </span>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          {gunaOptions.map((option) => (
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id={`gunas-${option}`}
                  name={`gunas-${option}`}
                  type="checkbox"
                  checked={formData.gunas.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "gunas", option)}
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for={`gunas-${option}`} class="font-medium text-gray-700">{option}</label>
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="gunas" value={formData.gunas.join(',')} />
      </div>
      
      {/* Dhatus */}
      <div>
        <span class="block text-sm font-medium text-gray-700 mb-2">
          Dhatus (Tissues)
        </span>
        <div class="grid grid-cols-2 gap-2">
          {dhatuOptions.map((option) => (
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id={`dhatus-${option}`}
                  name={`dhatus-${option}`}
                  type="checkbox"
                  checked={formData.dhatus.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "dhatus", option)}
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for={`dhatus-${option}`} class="font-medium text-gray-700">{option}</label>
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="dhatus" value={formData.dhatus.join(',')} />
      </div>
      
      {/* Srotas */}
      <div>
        <span class="block text-sm font-medium text-gray-700 mb-2">
          Srotas (Channels)
        </span>
        <div class="grid grid-cols-2 gap-2">
          {srotasOptions.map((option) => (
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id={`srotas-${option}`}
                  name={`srotas-${option}`}
                  type="checkbox"
                  checked={formData.srotas.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "srotas", option)}
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for={`srotas-${option}`} class="font-medium text-gray-700">{option}</label>
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="srotas" value={formData.srotas.join(',')} />
      </div>
      
      {/* Traditional Usage */}
      <div>
        <label for="traditionalUsage" class="block text-sm font-medium text-gray-700">
          Traditional Usage
        </label>
        <textarea
          id="traditionalUsage"
          name="traditionalUsage"
          rows={3}
          value={formData.traditionalUsage}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
        ></textarea>
      </div>
      
      {/* Dosage */}
      <div>
        <label for="dosage" class="block text-sm font-medium text-gray-700">
          Dosage
        </label>
        <textarea
          id="dosage"
          name="dosage"
          rows={3}
          value={formData.dosage}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
      </div>
      
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
        ></textarea>
      </div>
      
      {/* Interactions */}
      <div>
        <label for="interactions" class="block text-sm font-medium text-gray-700">
          Interactions
        </label>
        <textarea
          id="interactions"
          name="interactions"
          rows={3}
          value={formData.interactions}
          onChange={handleInputChange}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
