// routes/admin/plants/[id]/tcm/edit.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantTcmProperties, tcmTemperatures, tcmTastes, tcmMeridians } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditTcmPageData {
  plant: Plant;
  tcmInfo: {
    propertyId: number;
    chineseName: string | null;
    pinyinName: string | null;
    temperatureId: number | null;
    tasteIds: number[];
    meridianIds: number[];
    dosageRange: string | null;
    contraindications: string | null;
    preparationMethods: string | null;
  };
  tempOptions: Array<{ temperatureId: number; name: string }>;
  tasteOptions: Array<{ tasteId: number; name: string }>;
  channelOptions: Array<{ meridianId: number; name: string }>;
}

export const handler: Handlers<EditTcmPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    
    // Validate that id is a valid number
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }
    
    try {
      // Fetch plant information
      const plant = await db.select().from(plants).where(
        eq(plants.id, plantId)
      ).execute();
      
      if (plant.length === 0) {
        return ctx.render(undefined);
      }

      // Map the database result to match the Plant interface
      const plantData: Plant = {
        id: plant[0].id,
        common_name: plant[0].commonName,
        botanical_name: plant[0].botanicalName,
        family: plant[0].family || null,
        genus: plant[0].genus || null,
        species: plant[0].species || null,
        description: plant[0].description || null,
        taxonomy: null,
        is_medicinal: true, // Since we're editing TCM properties, this plant is medicinal
        is_food_crop: false, // Default value, can be updated if needed
        created_at: plant[0].createdAt,
        updated_at: plant[0].updatedAt
      };

      // Fetch TCM information for this plant
      const tcmInfo = await db.select().from(plantTcmProperties).where(
        eq(plantTcmProperties.plantId, plantId)
      ).execute();

      if (tcmInfo.length === 0) {
        // Redirect to add page if no TCM info exists
        const headers = new Headers();
        headers.set("location", `/admin/plants/${plantId}/tcm/add`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      // Fetch options for dropdowns
      const tempOptions = await db.select().from(tcmTemperatures).execute();
      const tasteOptions = await db.select().from(tcmTastes).execute();
      const channelOptions = await db.select().from(tcmMeridians).execute();

      return ctx.render({
        plant: plantData,
        tcmInfo: tcmInfo[0],
        tempOptions,
        tasteOptions,
        channelOptions,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return new Response("Error fetching plant data", { status: 500 });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const plantId = parseInt(id);
    
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }

    try {
      const formData = await req.formData();
      
      // Extract form data
      const propertyId = parseInt(formData.get("propertyId")!.toString());
      const chineseName = formData.get("chineseName")?.toString() || null;
      const pinyinName = formData.get("pinyinName")?.toString() || null;
      
      // Get selected tastes (array of IDs)
      const tasteIds = formData.getAll("tasteIds").map(id => parseInt(id.toString())).filter(id => !isNaN(id));
      
      // Get temperature as single ID
      const temperatureId = formData.get("temperatureId") ? 
        parseInt(formData.get("temperatureId")!.toString()) : null;
      
      // Get meridians (array of IDs)
      const meridianIds = formData.getAll("meridianIds").map(id => parseInt(id.toString())).filter(id => !isNaN(id));
      
      const dosageRange = formData.get("dosageRange")?.toString() || null;
      const contraindications = formData.get("contraindications")?.toString() || null;
      const preparationMethods = formData.get("preparationMethods")?.toString() || null;

      // Update TCM information in database
      await db.update(plantTcmProperties)
        .set({
          chineseName,
          pinyinName,
          temperatureId,
          tasteIds,
          meridianIds,
          dosageRange,
          contraindications,
          preparationMethods,
          updatedAt: new Date(),
        })
        .where(eq(plantTcmProperties.propertyId, propertyId))
        .execute();

      // Redirect to the TCM information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/tcm`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating TCM information:", error);
      return new Response("Error updating TCM information", { status: 500 });
    }
  },
};

export default function EditTcmPage({ data }: PageProps<EditTcmPageData>) {
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

  const { plant, tcmInfo, tempOptions, tasteOptions, channelOptions } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="tcm"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Edit Traditional Chinese Medicine Information</h1>
          <p class="text-gray-600">
            Edit TCM information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
          <input type="hidden" name="propertyId" value={tcmInfo.propertyId} />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="chineseName">
                  Chinese Name
                </label>
                <input
                  type="text"
                  id="chineseName"
                  name="chineseName"
                  value={tcmInfo.chineseName || ""}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Chinese characters"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="pinyinName">
                  Pinyin
                </label>
                <input
                  type="text"
                  id="pinyinName"
                  name="pinyinName"
                  value={tcmInfo.pinyinName || ""}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Romanized pronunciation"
                />
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="tasteIds">
                  Taste (Wei)
                </label>
                <select
                  id="tasteIds"
                  name="tasteIds"
                  multiple
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {tasteOptions.map((option) => (
                    <option 
                      key={option.tasteId} 
                      value={option.tasteId}
                      selected={tcmInfo.tasteIds?.includes(option.tasteId)}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
                <p class="mt-1 text-sm text-gray-500">Hold Ctrl (or Cmd) to select multiple tastes</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="temperatureId">
                  Nature (Xing)
                </label>
                <select
                  id="temperatureId"
                  name="temperatureId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a nature</option>
                  {tempOptions.map((option) => (
                    <option 
                      key={option.temperatureId} 
                      value={option.temperatureId}
                      selected={tcmInfo.temperatureId === option.temperatureId}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="meridianIds">
                  Channels (Gui Jing)
                </label>
                <select
                  id="meridianIds"
                  name="meridianIds"
                  multiple
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {channelOptions.map((option) => (
                    <option 
                      key={option.meridianId} 
                      value={option.meridianId}
                      selected={tcmInfo.meridianIds?.includes(option.meridianId)}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
                <p class="mt-1 text-sm text-gray-500">Hold Ctrl (or Cmd) to select multiple channels</p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="dosageRange">
                  Dosage Range
                </label>
                <textarea
                  id="dosageRange"
                  name="dosageRange"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe dosage range..."
                >{tcmInfo.dosageRange || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="contraindications">
                  Contraindications
                </label>
                <textarea
                  id="contraindications"
                  name="contraindications"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="List contraindications..."
                >{tcmInfo.contraindications || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="preparationMethods">
                  Preparation Methods
                </label>
                <textarea
                  id="preparationMethods"
                  name="preparationMethods"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe preparation methods..."
                >{tcmInfo.preparationMethods || ""}</textarea>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/tcm`}
              class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
