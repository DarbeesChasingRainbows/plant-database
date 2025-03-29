import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { db } from "../../../utils/db.ts";
import { cutFlowerCharacteristics, plants } from "../../../utils/schema.ts";

interface NewCutFlowerData {
  error?: string;
  plants?: Array<{
    id: number;
    botanicalName: string;
  }>;
}

export const handler: Handlers<NewCutFlowerData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const plantId = parseInt(form.get("plantId")?.toString() || "0");
      const stemLengthMin = form.get("stemLengthMin")?.toString() 
        ? parseFloat(form.get("stemLengthMin")?.toString() || "0") 
        : null;
      const stemLengthMax = form.get("stemLengthMax")?.toString() 
        ? parseFloat(form.get("stemLengthMax")?.toString() || "0") 
        : null;
      const stemStrength = form.get("stemStrength")?.toString() || null;
      const flowerForm = form.get("flowerForm")?.toString() || null;
      const colorVariations = form.get("colorVariations")?.toString() 
        ? form.get("colorVariations")?.toString().split(',').map(s => s.trim())
        : null;
      const fragranceLevel = form.get("fragranceLevel")?.toString() || null;
      const seasonalAvailability = form.get("seasonalAvailability")?.toString() 
        ? form.get("seasonalAvailability")?.toString().split(',').map(s => s.trim())
        : null;
      const harvestStage = form.get("harvestStage")?.toString() || null;
      const ethyleneSensitivity = form.get("ethyleneSensitivity") === "true";
      const coldStorageTemp = form.get("coldStorageTemp")?.toString() 
        ? parseFloat(form.get("coldStorageTemp")?.toString() || "0") 
        : null;
      const transportRequirements = form.get("transportRequirements")?.toString() || null;
      const typicalVaseLifeDays = form.get("typicalVaseLifeDays")?.toString() 
        ? parseInt(form.get("typicalVaseLifeDays")?.toString() || "0") 
        : null;
      const notes = form.get("notes")?.toString() || null;

      if (!plantId) {
        return ctx.render({ error: "Plant is required" });
      }

      // Use Drizzle ORM to insert the new cut flower characteristics
      const [newFlower] = await db.insert(cutFlowerCharacteristics).values({
        plantId,
        stemLengthMin: stemLengthMin !== null ? stemLengthMin.toString() : null,
        stemLengthMax: stemLengthMax !== null ? stemLengthMax.toString() : null,
        stemStrength,
        flowerForm,
        colorVariations,
        fragranceLevel,
        seasonalAvailability,
        harvestStage,
        ethyleneSensitivity,
        coldStorageTemp: coldStorageTemp !== null ? coldStorageTemp.toString() : null,
        transportRequirements,
        typicalVaseLifeDays: typicalVaseLifeDays !== null ? Number(typicalVaseLifeDays) : null,
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      // Redirect to the cut flower details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/cutflowers/${newFlower.characteristicId}` }
      });
    } catch (error) {
      console.error("Error creating cut flower:", error);
      return ctx.render({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  },

  async GET(_, ctx) {
    try {
      // Fetch all plants for the dropdown
      const plantsList = await db.select({
        id: plants.id,
        botanicalName: plants.botanicalName,
      }).from(plants).orderBy(plants.botanicalName);

      return ctx.render({ plants: plantsList });
    } catch (error) {
      console.error("Error fetching plants:", error);
      return ctx.render({ error: "Failed to load plants", plants: [] });
    }
  },
};

export default function NewCutFlowerPage({ data }: PageProps<NewCutFlowerData>) {
  const { error, plants = [] } = data;

  return (
    <AdminLayout title="Add Cut Flower" currentPath="/admin/cutflowers">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Cut Flower Characteristics</h1>
        <a href="/admin/cutflowers" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Back to Cut Flowers
        </a>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" action="/admin/cutflowers/new" class="p-6 space-y-6">
          <div>
            <label for="plantId" class="block text-sm font-medium text-gray-700">
              Plant *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a plant</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.botanicalName}
                </option>
              ))}
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="stemLengthMin" class="block text-sm font-medium text-gray-700">
                Minimum Stem Length (cm)
              </label>
              <input
                type="number"
                step="0.01"
                name="stemLengthMin"
                id="stemLengthMin"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="stemLengthMax" class="block text-sm font-medium text-gray-700">
                Maximum Stem Length (cm)
              </label>
              <input
                type="number"
                step="0.01"
                name="stemLengthMax"
                id="stemLengthMax"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="stemStrength" class="block text-sm font-medium text-gray-700">
              Stem Strength
            </label>
            <select
              id="stemStrength"
              name="stemStrength"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select stem strength</option>
              <option value="Very Weak">Very Weak</option>
              <option value="Weak">Weak</option>
              <option value="Moderate">Moderate</option>
              <option value="Strong">Strong</option>
              <option value="Very Strong">Very Strong</option>
            </select>
          </div>

          <div>
            <label for="flowerForm" class="block text-sm font-medium text-gray-700">
              Flower Form
            </label>
            <input
              type="text"
              name="flowerForm"
              id="flowerForm"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Single, Double, Spray, etc."
            />
          </div>

          <div>
            <label for="colorVariations" class="block text-sm font-medium text-gray-700">
              Color Variations (comma separated)
            </label>
            <input
              type="text"
              name="colorVariations"
              id="colorVariations"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Red, Pink, White, Yellow"
            />
          </div>

          <div>
            <label for="fragranceLevel" class="block text-sm font-medium text-gray-700">
              Fragrance Level
            </label>
            <select
              id="fragranceLevel"
              name="fragranceLevel"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select fragrance level</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Strong">Strong</option>
              <option value="Very Strong">Very Strong</option>
            </select>
          </div>

          <div>
            <label for="seasonalAvailability" class="block text-sm font-medium text-gray-700">
              Seasonal Availability (comma separated)
            </label>
            <input
              type="text"
              name="seasonalAvailability"
              id="seasonalAvailability"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Spring, Summer, Fall, Winter"
            />
          </div>

          <div>
            <label for="harvestStage" class="block text-sm font-medium text-gray-700">
              Harvest Stage
            </label>
            <input
              type="text"
              name="harvestStage"
              id="harvestStage"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Bud, Half-open, Fully open"
            />
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="ethyleneSensitivity"
                name="ethyleneSensitivity"
                type="checkbox"
                value="true"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="ethyleneSensitivity" class="font-medium text-gray-700">Ethylene Sensitivity</label>
              <p class="text-gray-500">Check if this flower is sensitive to ethylene</p>
            </div>
          </div>

          <div>
            <label for="coldStorageTemp" class="block text-sm font-medium text-gray-700">
              Cold Storage Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              name="coldStorageTemp"
              id="coldStorageTemp"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="transportRequirements" class="block text-sm font-medium text-gray-700">
              Transport Requirements
            </label>
            <textarea
              name="transportRequirements"
              id="transportRequirements"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe transport requirements for this cut flower"
            ></textarea>
          </div>

          <div>
            <label for="typicalVaseLifeDays" class="block text-sm font-medium text-gray-700">
              Typical Vase Life (days)
            </label>
            <input
              type="number"
              name="typicalVaseLifeDays"
              id="typicalVaseLifeDays"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Any additional notes about this cut flower"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Save Cut Flower
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
