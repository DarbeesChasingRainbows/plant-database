import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { db } from "../../../utils/db.ts";
import { cutFlowerCharacteristics, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface CutFlowerDetailData {
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
  error?: string;
}

export const handler: Handlers<CutFlowerDetailData> = {
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

      return ctx.render({ flower });
    } catch (error) {
      console.error("Error fetching cut flower:", error);
      return ctx.render({ error: "Failed to fetch cut flower details" });
    }
  }
};

export default function CutFlowerDetailPage({ data }: PageProps<CutFlowerDetailData>) {
  const { flower, error } = data;

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
    <AdminLayout title={`${flower.plantName} - Cut Flower Characteristics`} currentPath="/admin/cutflowers">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{flower.plantName} - Cut Flower Characteristics</h1>
        <div class="space-x-2">
          <a 
            href={`/admin/cutflowers/edit/${flower.characteristicId}`} 
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Edit
          </a>
          <a 
            href="/admin/cutflowers" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to Cut Flowers
          </a>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Cut Flower Details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this cut flower's characteristics.</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Plant</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a href={`/admin/plants/${flower.plantId}`} class="text-indigo-600 hover:text-indigo-900">
                  {flower.plantName}
                </a>
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Stem Length</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.stemLengthMin && flower.stemLengthMax 
                  ? `${flower.stemLengthMin} - ${flower.stemLengthMax} cm`
                  : flower.stemLengthMin 
                    ? `${flower.stemLengthMin} cm (minimum)`
                    : flower.stemLengthMax
                      ? `${flower.stemLengthMax} cm (maximum)`
                      : "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Stem Strength</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.stemStrength || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Flower Form</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.flowerForm || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Color Variations</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.colorVariations && flower.colorVariations.length > 0 
                  ? flower.colorVariations.join(", ")
                  : "Not specified"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Fragrance Level</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.fragranceLevel || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Seasonal Availability</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.seasonalAvailability && flower.seasonalAvailability.length > 0 
                  ? flower.seasonalAvailability.join(", ")
                  : "Not specified"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Harvest Stage</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.harvestStage || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Ethylene Sensitivity</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  flower.ethyleneSensitivity ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {flower.ethyleneSensitivity ? 'Sensitive' : 'Not Sensitive'}
                </span>
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Cold Storage Temperature</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.coldStorageTemp ? `${flower.coldStorageTemp}°C` : "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Transport Requirements</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {flower.transportRequirements || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Typical Vase Life</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {flower.typicalVaseLifeDays ? `${flower.typicalVaseLifeDays} days` : "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Notes</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {flower.notes || "No additional notes"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}
