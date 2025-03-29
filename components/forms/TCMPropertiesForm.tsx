import { type Plant, type PlantTcmProperty } from "../../utils/schema.ts";

interface TCMPropertiesFormProps {
  _plant?: Plant;
  tcmProperties?: PlantTcmProperty;
}

export default function TCMPropertiesForm({ _plant, tcmProperties }: TCMPropertiesFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">TCM Properties</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Chinese Name */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Chinese Name</label>
          <input
            type="text"
            name="chineseName"
            defaultValue={tcmProperties?.chineseName ?? ""}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 黄芪"
          />
          <p class="mt-1 text-sm text-gray-500">Name in Chinese characters</p>
        </div>

        {/* Pinyin Name */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Pinyin Name</label>
          <input
            type="text"
            name="pinyinName"
            defaultValue={tcmProperties?.pinyinName ?? ""}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Huang Qi"
          />
          <p class="mt-1 text-sm text-gray-500">Romanized Chinese name</p>
        </div>

        {/* Temperature */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Temperature</label>
          <select
            name="temperatureId"
            defaultValue={String(tcmProperties?.temperatureId) ?? ""}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Temperature</option>
            <option value="1">Hot</option>
            <option value="2">Warm</option>
            <option value="3">Neutral</option>
            <option value="4">Cool</option>
            <option value="5">Cold</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Thermal nature (assumes pre-fetched IDs)</p>
        </div>

        {/* Taste */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Taste</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="pungent"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Pungent/Acrid</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="sweet"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sweet</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="sour"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Sour</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="bitter"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Bitter</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="salty"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Salty</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="bland"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Bland</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="taste"
                value="astringent"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Astringent</label>
            </div>
          </div>
        </div>

        {/* Meridians */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Meridians/Channels</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="lung"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Lung</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="large_intestine"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Large Intestine</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="stomach"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Stomach</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="spleen"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Spleen</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="heart"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Heart</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="small_intestine"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Small Intestine</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="bladder"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Bladder</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="kidney"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Kidney</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="pericardium"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Pericardium</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="triple_burner"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Triple Burner</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="gallbladder"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Gallbladder</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="meridians"
                value="liver"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Liver</label>
            </div>
          </div>
        </div>

        {/* Dosage Range */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Dosage Range</label>
          <input
            type="text"
            name="dosageRange"
            defaultValue={tcmProperties?.dosageRange ?? ""}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 9-30g"
          />
          <p class="mt-1 text-sm text-gray-500">Recommended dosage range</p>
        </div>

        {/* Toxicity Level */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Toxicity Level</label>
          <select
            name="toxicityLevel"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Level</option>
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="extreme">Extreme</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Level of toxicity when improperly used</p>
        </div>
      </div>

      {/* Category Classification */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Category Classification</label>
        <select
          name="categoryClassification"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          <option value="release_exterior">Release Exterior</option>
          <option value="clear_heat">Clear Heat</option>
          <option value="downward_draining">Downward Draining</option>
          <option value="harmonize">Harmonize</option>
          <option value="dispel_dampness">Dispel Dampness</option>
          <option value="warm_interior">Warm Interior</option>
          <option value="tonify">Tonify</option>
          <option value="regulate_qi">Regulate Qi</option>
          <option value="invigorate_blood">Invigorate Blood</option>
          <option value="astringent">Astringent</option>
          <option value="extinguish_wind">Extinguish Wind</option>
          <option value="expel_parasites">Expel Parasites</option>
        </select>
        <p class="mt-1 text-sm text-gray-500">Primary therapeutic category</p>
      </div>

      {/* Actions */}
      <div>
        <label class="block text-sm font-medium text-gray-700">TCM Actions</label>
        <textarea
          name="actions"
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Tonifies Qi, Raises Yang, Stabilizes Exterior"
          defaultValue={tcmProperties?.actions ?? ""}
        ></textarea>
        <p class="mt-1 text-sm text-gray-500">Primary actions according to TCM theory</p>
      </div>

      {/* Preparation Methods */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Preparation Methods</label>
        <textarea
          name="preparationMethods"
          defaultValue={tcmProperties?.preparationMethods ?? ""}
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Decoction, Powder, Honey-fried, Wine-fried, Salt-processed"
        />
        <p class="mt-1 text-sm text-gray-500">Methods of preparation</p>
      </div>

      {/* Indications */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Indications</label>
        <textarea
          name="indications"
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Qi deficiency with fatigue, Lung Qi deficiency with shortness of breath"
          defaultValue={tcmProperties?.indications ?? ""}
        ></textarea>
        <p class="mt-1 text-sm text-gray-500">Conditions this herb treats according to TCM</p>
      </div>

      {/* Contraindications */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Contraindications</label>
        <textarea
          name="contraindications"
          defaultValue={tcmProperties?.contraindications ?? ""}
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Avoid in cases of excess heat, Yin deficiency with heat signs"
        />
        <p class="mt-1 text-sm text-gray-500">Conditions where use is not advised</p>
      </div>

      {/* Classical Formulas */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Classical Formulas</label>
        <textarea
          name="classicalFormulas"
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Bu Zhong Yi Qi Tang, Yu Ping Feng San"
          defaultValue={tcmProperties?.classicalFormulas ?? ""}
        ></textarea>
        <p class="mt-1 text-sm text-gray-500">Traditional formulas containing this herb</p>
      </div>

      {/* Common Combinations */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Common Combinations</label>
        <textarea
          name="commonCombinations"
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Combined with Bai Zhu for enhancing Spleen Qi"
          defaultValue={tcmProperties?.commonCombinations ?? ""}
        ></textarea>
        <p class="mt-1 text-sm text-gray-500">Common combinations with other herbs</p>
      </div>

      {/* Processing Methods */}
      <div>
        <label class="block text-sm font-medium text-gray-700">Processing Methods (Pao Zhi)</label>
        <textarea
          name="processingMethods"
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Raw, Stir-fried, Honey-fried, Wine-fried, Salt-processed"
          defaultValue={tcmProperties?.processingMethods ?? ""}
        ></textarea>
        <p class="mt-1 text-sm text-gray-500">Special preparation techniques that modify properties</p>
      </div>
    </div>
  );
}