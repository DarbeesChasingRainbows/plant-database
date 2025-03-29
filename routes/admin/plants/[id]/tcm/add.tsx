// routes/admin/plants/[id]/tcm/add.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantTcmProperties, tcmTemperatures, tcmTastes, tcmMeridians, tcmPatterns } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface AddTcmPageData {
  plant: Plant;
  tempOptions: Array<{ temperatureId: number; name: string }>;
  tasteOptions: Array<{ tasteId: number; name: string }>;
  channelOptions: Array<{ meridianId: number; name: string }>;
  _patternOptions: Array<{ 
    patternId: number; 
    name: string;
    chineseName: string | null;
    description: string | null;
  }>;
}

export const handler: Handlers<AddTcmPageData> = {
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

      // Fetch TCM reference data
      const temperatures = await db.select().from(tcmTemperatures).execute();
      const tastes = await db.select().from(tcmTastes).execute();
      const meridians = await db.select().from(tcmMeridians).execute();
      const patterns = await db.select().from(tcmPatterns).execute();

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
        is_medicinal: true, // Since we're adding TCM properties, this plant is medicinal
        is_food_crop: false, // Default value, can be updated if needed
        created_at: plant[0].createdAt,
        updated_at: plant[0].updatedAt
      };

      return ctx.render({
        plant: plantData,
        tempOptions: temperatures,
        tasteOptions: tastes,
        channelOptions: meridians,
        _patternOptions: patterns,
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

      // Insert TCM information into database
      await db.insert(plantTcmProperties).values({
        plantId,
        chineseName: chineseName,
        pinyinName: pinyinName,
        temperatureId: temperatureId,
        tasteIds: tasteIds,
        meridianIds: meridianIds,
        dosageRange: dosageRange,
        contraindications: contraindications,
        preparationMethods: preparationMethods,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).execute();

      // Redirect to the TCM information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/tcm`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error adding TCM information:", error);
      return new Response("Error adding TCM information", { status: 500 });
    }
  },
};

export default function AddTcmPage({ data }: PageProps<AddTcmPageData>) {
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

  const { plant, tempOptions, tasteOptions, channelOptions, _patternOptions } = data;

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="tcm"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Add Traditional Chinese Medicine Information</h1>
          <p class="text-gray-600">
            Add TCM information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
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
                  <option value="">Select tastes</option>
                  {tasteOptions.map((option) => (
                    <option key={option.tasteId} value={option.tasteId}>
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
                    <option key={option.temperatureId} value={option.temperatureId}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <p class="mt-1 text-sm text-gray-500">Select a nature</p>
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
                  <option value="">Select channels</option>
                  {channelOptions.map((option) => (
                    <option key={option.meridianId} value={option.meridianId}>
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
                ></textarea>
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
                  placeholder="List conditions treated..."
                ></textarea>
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
                ></textarea>
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div class="flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/tcm`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save TCM Information
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
