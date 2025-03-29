import { type Plant } from "../../utils/schema.ts";

interface DosageGuidelinesFormProps {
  plant?: Plant;
}

export default function DosageGuidelinesForm({ plant }: DosageGuidelinesFormProps) {
  return (
    <div class="space-y-6">
      <h3 class="text-lg font-medium">Dosage Guidelines</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Preparation Forms */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Preparation Forms</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="tincture"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Tincture</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="tea"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Tea/Infusion</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="decoction"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Decoction</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="powder"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Powder</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="capsule"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Capsule</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="syrup"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Syrup</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="oil"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Oil</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="salve"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Salve/Ointment</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="preparationForms"
                value="poultice"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Poultice</label>
            </div>
          </div>
        </div>

        {/* Administration Routes */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Administration Routes</label>
          <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="administrationRoutes"
                value="oral"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Oral</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="administrationRoutes"
                value="topical"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Topical</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="administrationRoutes"
                value="inhalation"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Inhalation</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="administrationRoutes"
                value="gargle"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Gargle</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="administrationRoutes"
                value="bath"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Bath</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="administrationRoutes"
                value="compress"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Compress</label>
            </div>
          </div>
        </div>

        {/* Tincture Dosage */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Tincture Dosage</label>
          <div class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Adult Dosage</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="tinctureDosageAdultMin"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Min"
                  min="0"
                  step="1"
                />
                <span class="inline-flex items-center rounded-none border border-gray-300 px-3 text-gray-500 sm:text-sm">to</span>
                <input
                  type="number"
                  name="tinctureDosageAdultMax"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Max"
                  min="0"
                  step="1"
                />
              </div>
              <div class="mt-1 flex items-center">
                <span class="mr-2 text-sm text-gray-500">drops, </span>
                <input
                  type="number"
                  name="tinctureDosageAdultFrequency"
                  class="block w-16 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="3"
                  min="1"
                  max="12"
                />
                <span class="ml-2 text-sm text-gray-500">times daily</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Child Dosage (if applicable)</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="tinctureDosageChildMin"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Min"
                  min="0"
                  step="1"
                />
                <span class="inline-flex items-center rounded-none border border-gray-300 px-3 text-gray-500 sm:text-sm">to</span>
                <input
                  type="number"
                  name="tinctureDosageChildMax"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Max"
                  min="0"
                  step="1"
                />
              </div>
              <div class="mt-1 flex items-center">
                <span class="mr-2 text-sm text-gray-500">drops, </span>
                <input
                  type="number"
                  name="tinctureDosageChildFrequency"
                  class="block w-16 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="3"
                  min="1"
                  max="12"
                />
                <span class="ml-2 text-sm text-gray-500">times daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tea/Infusion Dosage */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Tea/Infusion Dosage</label>
          <div class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Preparation Ratio</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="teaDosageAmount"
                  class="block w-20 min-w-0 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="1-2"
                  min="0"
                  step="0.1"
                />
                <span class="inline-flex items-center rounded-none border border-gray-300 px-3 text-gray-500 sm:text-sm">tsp to</span>
                <input
                  type="number"
                  name="teaDosageWater"
                  class="block w-20 min-w-0 rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="8"
                  min="0"
                  step="1"
                />
                <span class="ml-2 text-sm text-gray-500">oz water</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Steep Time</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="teaSteepTimeMin"
                  class="block w-20 min-w-0 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="5"
                  min="0"
                  step="1"
                />
                <span class="inline-flex items-center rounded-none border border-gray-300 px-3 text-gray-500 sm:text-sm">to</span>
                <input
                  type="number"
                  name="teaSteepTimeMax"
                  class="block w-20 min-w-0 rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="10"
                  min="0"
                  step="1"
                />
                <span class="ml-2 text-sm text-gray-500">minutes</span>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <label class="block text-sm font-medium text-gray-700">Frequency</label>
            <div class="mt-1 flex items-center">
              <input
                type="number"
                name="teaFrequency"
                class="block w-16 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="3"
                min="1"
                max="12"
              />
              <span class="ml-2 text-sm text-gray-500">cups per day</span>
            </div>
          </div>
        </div>

        {/* Duration of Use */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Recommended Duration of Use</label>
          <select
            name="durationOfUse"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select duration</option>
            <option value="acute">Acute use only (3-7 days)</option>
            <option value="short">Short-term (1-3 weeks)</option>
            <option value="medium">Medium-term (1-3 months)</option>
            <option value="long">Long-term (3+ months)</option>
            <option value="indefinite">Indefinite/As needed</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">Recommended length of treatment</p>
        </div>

        {/* Age Restrictions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Age Restrictions</label>
          <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                name="ageRestrictions"
                value="infants"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Not for infants (0-1)</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="ageRestrictions"
                value="children"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Not for children (1-12)</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="ageRestrictions"
                value="adolescents"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Not for adolescents (13-18)</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                name="ageRestrictions"
                value="elderly"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label class="ml-2 text-sm text-gray-700">Caution for elderly (65+)</label>
            </div>
          </div>
        </div>

        {/* Contraindications */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Contraindications</label>
          <textarea
            name="contraindications"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List conditions when this plant should not be used..."
          ></textarea>
        </div>

        {/* Drug Interactions */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Drug Interactions</label>
          <textarea
            name="drugInteractions"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List potential interactions with medications..."
          ></textarea>
        </div>

        {/* Safety Notes */}
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Safety Notes</label>
          <textarea
            name="safetyNotes"
            rows={3}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Additional safety information and warnings..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
