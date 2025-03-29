import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, plantAyurvedicProperties } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface AyurvedicProperties {
  propertyId: number;
  plantId: number;
  sanskritName: string | null;
  rasa: string[] | null;
  virya: string | null;
  vipaka: string | null;
  doshaEffect: {
    vata: string | null;
    pitta: string | null;
    kapha: string | null;
  } | null;
  gunas: string[] | null;
  dhatus: string[] | null;
  srotas: string[] | null;
  traditionalUsage: string | null;
  preparations: string | null;
  dosage: string | null;
  contraindications: string | null;
  interactions: string | null;
  notes: string | null;
}

interface Data {
  plant: Plant | null;
  ayurvedicProperties: AyurvedicProperties | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        ayurvedicProperties: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      // Get plant details using Drizzle ORM
      const plantResult = await db
        .select({
          id: plants.id,
          commonName: plants.commonName,
          botanicalName: plants.botanicalName,
        })
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          ayurvedicProperties: null,
          error: "Plant not found" 
        });
      }

      // Get ayurvedic properties using Drizzle ORM
      const ayurvedicResult = await db
        .select()
        .from(plantAyurvedicProperties)
        .where(eq(plantAyurvedicProperties.plantId, id))
        .limit(1);
      
      const ayurvedicProps = ayurvedicResult[0] || null;

      return ctx.render({
        plant,
        ayurvedicProperties: ayurvedicProps,
      });
    } catch (error) {
      console.error("Error fetching ayurvedic properties:", error);
      return ctx.render({
        plant: null,
        ayurvedicProperties: null,
        error: `Error fetching ayurvedic properties: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function PlantAyurvedic({ data }: PageProps<Data>) {
  const { plant, ayurvedicProperties, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="ayurvedic">
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
        <div class="flex justify-between">
          <Button href="/admin/plants">Back to Plants</Button>
        </div>
      </PlantAdminLayout>
    );
  }

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="ayurvedic">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">Plant not found</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <Button href="/admin/plants">Back to Plants</Button>
        </div>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="ayurvedic">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Ayurvedic Properties</h1>
        <div class="flex space-x-2">
          {ayurvedicProperties ? (
            <Button href={`/admin/plants/ayurvedic/edit/${plant.id}`}>Edit Ayurvedic Properties</Button>
          ) : (
            <Button href={`/admin/plants/ayurvedic/new/${plant.id}`}>Add Ayurvedic Properties</Button>
          )}
        </div>
      </div>
      
      {!ayurvedicProperties ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No ayurvedic properties have been added for this plant.</p>
          <Button href={`/admin/plants/ayurvedic/new/${plant.id}`} class="mt-2">Add Ayurvedic Properties</Button>
        </div>
      ) : (
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Sanskrit Name</h3>
              <p class="text-gray-700">
                {ayurvedicProperties.sanskritName || "Not specified"}
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Rasa (Taste)</h3>
              {ayurvedicProperties.rasa && ayurvedicProperties.rasa.length > 0 ? (
                <div class="flex flex-wrap gap-2">
                  {ayurvedicProperties.rasa.map((taste) => (
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {taste}
                    </span>
                  ))}
                </div>
              ) : (
                <p class="text-gray-500 italic">Not specified</p>
              )}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Virya (Energy)</h3>
              <p class="text-gray-700">
                {ayurvedicProperties.virya || "Not specified"}
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Vipaka (Post-digestive Effect)</h3>
              <p class="text-gray-700">
                {ayurvedicProperties.vipaka || "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Dosha Effects</h3>
            {ayurvedicProperties.doshaEffect ? (
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-3 bg-orange-50 rounded-md">
                  <p class="font-medium text-orange-700">Vata</p>
                  <p class="text-orange-600">{ayurvedicProperties.doshaEffect.vata || "Neutral"}</p>
                </div>
                <div class="p-3 bg-red-50 rounded-md">
                  <p class="font-medium text-red-700">Pitta</p>
                  <p class="text-red-600">{ayurvedicProperties.doshaEffect.pitta || "Neutral"}</p>
                </div>
                <div class="p-3 bg-blue-50 rounded-md">
                  <p class="font-medium text-blue-700">Kapha</p>
                  <p class="text-blue-600">{ayurvedicProperties.doshaEffect.kapha || "Neutral"}</p>
                </div>
              </div>
            ) : (
              <p class="text-gray-500 italic">Not specified</p>
            )}
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Gunas (Qualities)</h3>
            {ayurvedicProperties.gunas && ayurvedicProperties.gunas.length > 0 ? (
              <div class="flex flex-wrap gap-2">
                {ayurvedicProperties.gunas.map((guna) => (
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {guna}
                  </span>
                ))}
              </div>
            ) : (
              <p class="text-gray-500 italic">Not specified</p>
            )}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Dhatus (Tissues)</h3>
              {ayurvedicProperties.dhatus && ayurvedicProperties.dhatus.length > 0 ? (
                <div class="flex flex-wrap gap-2">
                  {ayurvedicProperties.dhatus.map((dhatu) => (
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {dhatu}
                    </span>
                  ))}
                </div>
              ) : (
                <p class="text-gray-500 italic">Not specified</p>
              )}
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Srotas (Channels)</h3>
              {ayurvedicProperties.srotas && ayurvedicProperties.srotas.length > 0 ? (
                <div class="flex flex-wrap gap-2">
                  {ayurvedicProperties.srotas.map((srota) => (
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {srota}
                    </span>
                  ))}
                </div>
              ) : (
                <p class="text-gray-500 italic">Not specified</p>
              )}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Traditional Usage</h3>
            <p class="text-gray-700 whitespace-pre-line">
              {ayurvedicProperties.traditionalUsage || "Not specified"}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Preparations</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {ayurvedicProperties.preparations || "Not specified"}
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Dosage</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {ayurvedicProperties.dosage || "Not specified"}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Contraindications</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {ayurvedicProperties.contraindications || "Not specified"}
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Interactions</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {ayurvedicProperties.interactions || "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
            <p class="text-gray-700 whitespace-pre-line">
              {ayurvedicProperties.notes || "Not specified"}
            </p>
          </div>
        </div>
      )}
    </PlantAdminLayout>
  );
}
