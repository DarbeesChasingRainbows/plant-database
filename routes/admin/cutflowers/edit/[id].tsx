import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { db } from "../../../../utils/db.ts";
import { cutFlowerCharacteristics, plants } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditCutFlowerData {
  flower?: {
    characteristicId: number;
    plantId: number;
    plantName: string | null;
    stemLengthMin: number | null;
    stemLengthMax: number | null;
    stemStrength: string | null;
    flowerForm: string | null;
    colorVariations: string[] | null;
    fragranceLevel: string | null;
    seasonalAvailability: string[] | null;
    harvestStage: string | null;
    ethyleneSensitivity: boolean | null;
    coldStorageTemp: number | null;
    transportRequirements: string | null;
    typicalVaseLifeDays: number | null;
    notes: string | null;
  };
  plants?: Array<{
    id: number;
    botanicalName: string;
  }>;
  error?: string;
}

export const handler: Handlers<EditCutFlowerData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const characteristicId = parseInt(id);

    if (isNaN(characteristicId)) {
      return ctx.render({ error: "Invalid cut flower ID" });
    }

    try {
      // Use Drizzle ORM to fetch the cut flower with plant details
      const results = await db.select({
        characteristicId: cutFlowerCharacteristics.characteristicId,
        plantId: cutFlowerCharacteristics.plantId,
        plantName: plants.botanicalName,
        stemLengthMin: cutFlowerCharacteristics.stemLengthMin,
        stemLengthMax: cutFlowerCharacteristics.stemLengthMax,
        stemStrength: cutFlowerCharacteristics.stemStrength,
        flowerForm: cutFlowerCharacteristics.flowerForm,
        colorVariations: cutFlowerCharacteristics.colorVariations,
        fragranceLevel: cutFlowerCharacteristics.fragranceLevel,
        seasonalAvailability: cutFlowerCharacteristics.seasonalAvailability,
        harvestStage: cutFlowerCharacteristics.harvestStage,
        ethyleneSensitivity: cutFlowerCharacteristics.ethyleneSensitivity,
        coldStorageTemp: cutFlowerCharacteristics.coldStorageTemp,
        transportRequirements: cutFlowerCharacteristics.transportRequirements,
        typicalVaseLifeDays: cutFlowerCharacteristics.typicalVaseLifeDays,
        notes: cutFlowerCharacteristics.notes,
      })
      .from(cutFlowerCharacteristics)
      .leftJoin(plants, eq(cutFlowerCharacteristics.plantId, plants.id))
      .where(eq(cutFlowerCharacteristics.characteristicId, characteristicId))
      .limit(1);

      if (results.length === 0) {
        return ctx.render({ error: "Cut flower not found" });
      }

      // Convert string values to appropriate types if needed
      const flower = {
        ...results[0],
        stemLengthMin: results[0].stemLengthMin ? Number(results[0].stemLengthMin) : null,
        stemLengthMax: results[0].stemLengthMax ? Number(results[0].stemLengthMax) : null,
        coldStorageTemp: results[0].coldStorageTemp ? Number(results[0].coldStorageTemp) : null,
        typicalVaseLifeDays: results[0].typicalVaseLifeDays ? Number(results[0].typicalVaseLifeDays) : null,
      };

      // Fetch all plants for the dropdown
      const plantsList = await db.select({
        id: plants.id,
        botanicalName: plants.botanicalName,
      }).from(plants).orderBy(plants.botanicalName);

      return ctx.render({ flower, plants: plantsList });
    } catch (error) {
      console.error("Error fetching cut flower:", error);
      return ctx.render({ error: "Failed to fetch cut flower details" });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const characteristicId = parseInt(id);

    if (isNaN(characteristicId)) {
      return ctx.render({ error: "Invalid cut flower ID" });
    }

    try {
      const form = await req.formData();
      const plantId = parseInt(form.get("plantId")?.toString() || "0", 10);
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

      // Use Drizzle ORM to update the cut flower characteristics
      await db.update(cutFlowerCharacteristics)
        .set({
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
          updatedAt: new Date(),
        })
        .where(eq(cutFlowerCharacteristics.characteristicId, characteristicId));

      // Redirect to the cut flower details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/cutflowers/${characteristicId}` }
      });
    } catch (error) {
      console.error("Error updating cut flower:", error);
      return ctx.render({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  }
};

export default function EditCutFlowerPage({ data }: PageProps<EditCutFlowerData>) {
  const { flower, plants = [], error } = data;

  if (error) {
    return (
      <AdminLayout title="Error" currentPath="/admin/cutflowers">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
        <a href="/admin/cutflowers" class="text-indigo-600 hover:text-indigo-900">
          &larr; Back to Cut Flowers
        </a>
      </AdminLayout>
    );
  }

  if (!flower) {
    return (
      <AdminLayout title="Loading..." currentPath="/admin/cutflowers">
        <div>Loading cut flower details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit ${flower.plantName} - Cut Flower Characteristics`} currentPath="/admin/cutflowers">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Cut Flower Characteristics</h1>
        <div class="space-x-2">
          <a 
            href={`/admin/cutflowers/${flower.characteristicId}`} 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </a>
        </div>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" class="p-6 space-y-6">
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
                <option 
                  key={plant.id} 
                  value={plant.id}
                  selected={plant.id === flower.plantId}
                >
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
                value={flower.stemLengthMin || ""}
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
                value={flower.stemLengthMax || ""}
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
              {["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"].map((strength) => (
                <option 
                  key={strength} 
                  value={strength}
                  selected={flower.stemStrength === strength}
                >
                  {strength}
                </option>
              ))}
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
              value={flower.flowerForm || ""}
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
              value={flower.colorVariations ? flower.colorVariations.join(", ") : ""}
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
              {["None", "Mild", "Moderate", "Strong", "Very Strong"].map((level) => (
                <option 
                  key={level} 
                  value={level}
                  selected={flower.fragranceLevel === level}
                >
                  {level}
                </option>
              ))}
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
              value={flower.seasonalAvailability ? flower.seasonalAvailability.join(", ") : ""}
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
              value={flower.harvestStage || ""}
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
                checked={flower.ethyleneSensitivity || false}
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
              value={flower.coldStorageTemp || ""}
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
            >{flower.transportRequirements || ""}</textarea>
          </div>

          <div>
            <label for="typicalVaseLifeDays" class="block text-sm font-medium text-gray-700">
              Typical Vase Life (days)
            </label>
            <input
              type="number"
              name="typicalVaseLifeDays"
              id="typicalVaseLifeDays"
              value={flower.typicalVaseLifeDays || ""}
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
            >{flower.notes || ""}</textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Update Cut Flower
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
