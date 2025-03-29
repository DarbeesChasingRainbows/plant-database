import { type Plant } from "../../utils/schema.ts";

interface WesternPropertiesFormProps {
  plant?: Plant;
}

export default function WesternPropertiesForm({ plant }: WesternPropertiesFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Western Medicinal Properties</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Herbal Category */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Herbal Category</label>
          <select
            name="herbalCategory"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            <option value="alterative">Alterative</option>
            <option value="analgesic">Analgesic</option>
            <option value="antiemetic">Antiemetic</option>
            <option value="antiinflammatory">Anti-inflammatory</option>
            <option value="antimicrobial">Antimicrobial</option>
            <option value="antispasmodic">Antispasmodic</option>
            <option value="astringent">Astringent</option>
            <option value="carminative">Carminative</option>
            <option value="demulcent">Demulcent</option>
            <option value="diaphoretic">Diaphoretic</option>
            <option value="diuretic">Diuretic</option>
            <option value="emmenagogue">Emmenagogue</option>
            <option value="expectorant">Expectorant</option>
            <option value="hepatic">Hepatic</option>
            <option value="nervine">Nervine</option>
            <option value="vulnerary">Vulnerary</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Primary western herbal category</p>
        </div>

        {/* Effectiveness Rating */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Effectiveness Rating</label>
          <select
            name="effectivenessRating"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select rating</option>
            <option value="1">1 - Minimal evidence</option>
            <option value="2">2 - Limited evidence</option>
            <option value="3">3 - Moderate evidence</option>
            <option value="4">4 - Strong evidence</option>
            <option value="5">5 - Very strong evidence</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Clinical effectiveness rating</p>
        </div>

        {/* Primary Herbal Actions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Primary Herbal Actions</label>
          <input
            type="text"
            name="primaryHerbalActions"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., anti-inflammatory, analgesic, carminative"
          />
          <p class="mt-1 text-sm text-gray-500">Comma-separated list of primary herbal actions</p>
        </div>

        {/* Systems Affected */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Systems Affected</label>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="respiratory"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Respiratory</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="digestive"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Digestive</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="nervous"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Nervous</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="cardiovascular"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Cardiovascular</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="immune"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Immune</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="reproductive"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Reproductive</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="musculoskeletal"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Musculoskeletal</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="systemsAffected"
                value="skin"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Skin</label>
            </div>
          </div>
        </div>

        {/* Historical Applications */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Historical Applications</label>
          <textarea
            name="historicalApplications"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe traditional western herbal uses..."
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">Traditional western herbal applications</p>
        </div>

        {/* Modern Clinical Uses */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Modern Clinical Uses</label>
          <textarea
            name="modernClinicalUses"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe evidence-based applications..."
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">Evidence-based clinical applications</p>
        </div>

        {/* Safety Considerations */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Safety Considerations</label>
          <textarea
            name="safetyConsiderations"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe safety concerns and contraindications..."
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">Safety concerns, contraindications, and cautions</p>
        </div>

        {/* Clinical Research References */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Clinical Research References</label>
          <textarea
            name="clinicalResearchReferences"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List key studies, publications, or reviews..."
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">Key studies, publications, or literature reviews</p>
        </div>
      </div>
    </div>
  );
}
