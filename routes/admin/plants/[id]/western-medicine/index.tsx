// routes/admin/plants/[id]/western-medicine/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantConstituents, sideEffects, plantDosages } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface WesternMedicineData {
  constituents: any[];
  sideEffects: any[];
  dosages: any[];
}

interface WesternMedicinePageData {
  plant: Plant;
  medicinalData: WesternMedicineData;
}

export const handler: Handlers<WesternMedicinePageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    
    // Validate that id is a valid number
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }

    try {
      // Fetch the plant by ID
      const plant = await db.select().from(plants).where(
        eq(plants.id, plantId),
      ).execute();

      if (plant.length === 0) {
        return ctx.render(undefined);
      }

      // Map the database result to match the Plant interface
      const plantData: Plant = {
        id: plant[0].id,
        common_name: plant[0].commonName,
        botanical_name: plant[0].botanicalName,
        family: plant[0].family || "",
        genus: plant[0].genus || "",
        species: plant[0].species || "",
        description: plant[0].description || "",
        taxonomy: null,
        is_medicinal: Boolean(plant[0]?.isMedicinal ?? 0),
        is_food_crop: Boolean(plant[0]?.isFoodCrop ?? 0),
        created_at: plant[0].createdAt,
        updated_at: plant[0].updatedAt
      };

      // Fetch western medicine data
      const constituents = await db.select().from(plantConstituents).where(
        eq(plantConstituents.plantId, plantId),
      ).execute();

      const sideEffectsData = await db.select().from(sideEffects).where(
        eq(sideEffects.plantId, plantId),
      ).execute();

      const dosages = await db.select().from(plantDosages).where(
        eq(plantDosages.plantId, plantId),
      ).execute();

      return ctx.render({
        plant: plantData,
        medicinalData: {
          constituents,
          sideEffects: sideEffectsData,
          dosages
        }
      });
    } catch (error) {
      console.error("Error fetching western medicine data:", error);
      return new Response("Error fetching western medicine data", { status: 500 });
    }
  },
};

export default function WesternMedicinePage({ data }: PageProps<WesternMedicinePageData>) {
  // Handle case where data is undefined (plant not found)
  if (!data) {
    return (
      <div class="p-4">
        <h1 class="text-2xl font-bold">Plant not found</h1>
        <p class="mt-2">The requested plant could not be found.</p>
        <a href="/admin/plants" class="text-blue-500 hover:underline mt-4 inline-block">
          Back to Plants
        </a>
      </div>
    );
  }

  const { plant, medicinalData } = data;
  const { constituents, sideEffects, dosages } = medicinalData;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="western-medicine"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Western Medicine Information</h1>
          <p class="text-gray-600">
            Western medicine information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Constituents Section */}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Constituents</h2>
              <a
                href={`/admin/plants/${plant.id}/western-medicine/constituents/add`}
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add Constituent
              </a>
            </div>
            <div class="px-4 py-5">
              {constituents.length > 0 ? (
                <ul class="divide-y divide-gray-200">
                  {constituents.map((constituent) => (
                    <li key={constituent.constituentId} class="py-4">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="text-sm font-medium">{constituent.name}</h3>
                          <p class="text-sm text-gray-500">{constituent.category || "No category"}</p>
                          {constituent.description && (
                            <p class="mt-1 text-sm text-gray-600">{constituent.description}</p>
                          )}
                          {constituent.percentContent && (
                            <p class="mt-1 text-sm text-gray-600">Content: {constituent.percentContent}%</p>
                          )}
                        </div>
                        <a
                          href={`/admin/plants/${plant.id}/western-medicine/constituents/edit/${constituent.constituentId}`}
                          class="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-gray-500 text-center py-4">No constituents have been added yet.</p>
              )}
            </div>
          </div>

          {/* Side Effects Section */}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Side Effects</h2>
              <a
                href={`/admin/plants/${plant.id}/western-medicine/side-effects/add`}
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add Side Effect
              </a>
            </div>
            <div class="px-4 py-5">
              {sideEffects.length > 0 ? (
                <ul class="divide-y divide-gray-200">
                  {sideEffects.map((effect) => (
                    <li key={effect.effectId} class="py-4">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="text-sm font-medium">{effect.effect}</h3>
                          <p class="text-sm text-gray-500">Severity: {effect.severity || "Not specified"}</p>
                          {effect.description && (
                            <p class="mt-1 text-sm text-gray-600">{effect.description}</p>
                          )}
                        </div>
                        <a
                          href={`/admin/plants/${plant.id}/western-medicine/side-effects/edit/${effect.effectId}`}
                          class="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-gray-500 text-center py-4">No side effects have been added yet.</p>
              )}
            </div>
          </div>

          {/* Dosages Section */}
          <div class="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
            <div class="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Dosages</h2>
              <a
                href={`/admin/plants/${plant.id}/western-medicine/dosages/add`}
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add Dosage
              </a>
            </div>
            <div class="px-4 py-5">
              {dosages.length > 0 ? (
                <ul class="divide-y divide-gray-200">
                  {dosages.map((dosage) => (
                    <li key={dosage.dosageId} class="py-4">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="text-sm font-medium">{dosage.form}</h3>
                          <p class="text-sm text-gray-500">Route: {dosage.route || "Not specified"}</p>
                          {dosage.dosageRange && (
                            <p class="mt-1 text-sm text-gray-600">Dosage: {dosage.dosageRange}</p>
                          )}
                          {dosage.frequency && (
                            <p class="mt-1 text-sm text-gray-600">Frequency: {dosage.frequency}</p>
                          )}
                          {dosage.notes && (
                            <p class="mt-1 text-sm text-gray-600">Notes: {dosage.notes}</p>
                          )}
                        </div>
                        <a
                          href={`/admin/plants/${plant.id}/western-medicine/dosages/edit/${dosage.dosageId}`}
                          class="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-gray-500 text-center py-4">No dosages have been added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PlantAdminLayout>
  );
}
