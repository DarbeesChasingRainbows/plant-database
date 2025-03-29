// routes/admin/plants/[id]/ayurvedic/add.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, plantAyurvedicProperties, ayurvedicRasas, ayurvedicGuna, ayurvedicDoshas, ayurvedicDhatus, ayurvedicSrotas, ayurvedicVirya, ayurvedicVipaka } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface AddAyurvedicPageData {
  plant: Plant;
  rasaOptions: Array<{ id: number; name: string }>;
  gunaOptions: Array<{ id: number; name: string }>;
  viryaOptions: Array<{ id: number; name: string }>;
  vipakaOptions: Array<{ id: number; name: string }>;
  doshaOptions: Array<{ id: number; name: string }>;
  dhatuOptions: Array<{ id: number; name: string }>;
  srotaOptions: Array<{ id: number; name: string }>;
}

export const handler: Handlers<AddAyurvedicPageData> = {
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

      // Check if ayurvedic information already exists for this plant
      const existingInfo = await db.select().from(plantAyurvedicProperties).where(
        eq(plantAyurvedicProperties.plantId, plantId),
      ).execute();

      if (existingInfo.length > 0) {
        // Redirect to edit page if info already exists
        const headers = new Headers();
        headers.set("location", `/admin/plants/${plantId}/ayurvedic/edit`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      // Fetch option lists
      const rasaOptions = await db.select().from(ayurvedicRasas).execute();
      const gunaOptions = await db.select().from(ayurvedicGuna).execute();
      const viryaOptions = await db.select().from(ayurvedicVirya).execute();
      const vipakaOptions = await db.select().from(ayurvedicVipaka).execute();
      const doshaOptions = await db.select().from(ayurvedicDoshas).execute();
      const dhatuOptions = await db.select().from(ayurvedicDhatus).execute();
      const srotaOptions = await db.select().from(ayurvedicSrotas).execute();

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
        is_medicinal: !!plant[0].isMedicinal,
        is_food_crop: !!plant[0].isFoodCrop,
        created_at: plant[0].createdAt,
        updated_at: plant[0].updatedAt
      };

      return ctx.render({
        plant: plantData,
        rasaOptions: rasaOptions.map(r => ({ id: r.rasaId, name: r.name })),
        gunaOptions: gunaOptions.map(g => ({ id: g.gunaId, name: g.name })),
        viryaOptions: viryaOptions.map(v => ({ id: v.viryaId, name: v.name })),
        vipakaOptions: vipakaOptions.map(v => ({ id: v.vipakaId, name: v.name })),
        doshaOptions: doshaOptions.map(d => ({ id: d.doshaId, name: d.name })),
        dhatuOptions: dhatuOptions.map(d => ({ id: d.dhatuId, name: d.name })),
        srotaOptions: srotaOptions.map(s => ({ id: s.srotaId, name: s.name })),
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
      const sanskritName = formData.get("sanskritName")?.toString() || null;
      const commonAyurvedicName = formData.get("commonAyurvedicName")?.toString() || null;
      
      // Get selected IDs as arrays
      const rasaIds = formData.getAll("rasaIds").map(id => parseInt(id.toString()));
      const gunaIds = formData.getAll("gunaIds").map(id => parseInt(id.toString()));
      
      // Get virya and vipaka as single values
      const viryaId = formData.get("viryaId") ? parseInt(formData.get("viryaId")!.toString()) : null;
      const vipakaId = formData.get("vipakaId") ? parseInt(formData.get("vipakaId")!.toString()) : null;
      
      // Get doshaEffects, dhatuEffects, and srotaEffects as JSON objects
      const doshaEffects = {};
      formData.getAll("doshaIds").forEach(id => {
        const doshaId = id.toString();
        const effect = formData.get(`doshaEffect_${doshaId}`)?.toString() || "neutral";
        Object.assign(doshaEffects, { [doshaId]: effect });
      });
      
      const dhatuEffects = {};
      formData.getAll("dhatuIds").forEach(id => {
        const dhatuId = id.toString();
        const effect = formData.get(`dhatuEffect_${dhatuId}`)?.toString() || "neutral";
        Object.assign(dhatuEffects, { [dhatuId]: effect });
      });
      
      const srotaEffects = {};
      formData.getAll("srotaIds").forEach(id => {
        const srotaId = id.toString();
        const effect = formData.get(`srotaEffect_${srotaId}`)?.toString() || "neutral";
        Object.assign(srotaEffects, { [srotaId]: effect });
      });
      
      // Get other text fields
      const prabhava = formData.get("prabhava")?.toString() || null;
      const dosageForm = formData.get("dosageForm")?.toString() || null;
      const dosageRange = formData.get("dosageRange")?.toString() || null;
      const anupana = formData.get("anupana")?.toString() || null;
      const contraindications = formData.get("contraindications")?.toString() || null;

      // Insert ayurvedic information into database
      await db.insert(plantAyurvedicProperties).values({
        plantId,
        sanskritName,
        commonAyurvedicName,
        rasaIds,
        viryaId,
        vipakaId,
        gunaIds,
        doshaEffects,
        dhatuEffects,
        srotaEffects,
        prabhava,
        dosageForm,
        dosageRange,
        anupana,
        contraindications,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).execute();

      // Redirect to the ayurvedic information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/ayurvedic`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error adding ayurvedic information:", error);
      return new Response("Error adding ayurvedic information", { status: 500 });
    }
  },
};

export default function AddAyurvedicPage({ data }: PageProps<AddAyurvedicPageData>) {
  if (!data) {
    return <div>Plant not found</div>;
  }

  const { plant, rasaOptions, gunaOptions, viryaOptions, vipakaOptions, doshaOptions, dhatuOptions, srotaOptions } = data;

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.common_name} activeTab="ayurvedic">
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">Add Ayurvedic Properties for {plant.common_name}</h1>
        
        <form method="POST" class="space-y-6 max-w-4xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Sanskrit Name</label>
                <input
                  type="text"
                  name="sanskritName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Common Ayurvedic Name</label>
                <input
                  type="text"
                  name="commonAyurvedicName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Rasa and Guna */}
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Rasa (Taste)</label>
                <select
                  multiple
                  name="rasaIds"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {rasaOptions.map(rasa => (
                    <option value={rasa.id}>{rasa.name}</option>
                  ))}
                </select>
                <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Guna (Quality)</label>
                <select
                  multiple
                  name="gunaIds"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {gunaOptions.map(guna => (
                    <option value={guna.id}>{guna.name}</option>
                  ))}
                </select>
                <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Virya and Vipaka */}
            <div>
              <label class="block text-sm font-medium text-gray-700">Virya (Potency)</label>
              <select
                name="viryaId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Select Virya --</option>
                {viryaOptions.map(virya => (
                  <option value={virya.id}>{virya.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Vipaka (Post-digestive Effect)</label>
              <select
                name="vipakaId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Select Vipaka --</option>
                {vipakaOptions.map(vipaka => (
                  <option value={vipaka.id}>{vipaka.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dosha Effects */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Dosha Effects</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {doshaOptions.map(dosha => (
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`dosha_${dosha.id}`}
                    name="doshaIds"
                    value={dosha.id}
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label for={`dosha_${dosha.id}`}>{dosha.name}</label>
                  <select
                    name={`doshaEffect_${dosha.id}`}
                    class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="increases">Increases</option>
                    <option value="decreases">Decreases</option>
                    <option value="balances">Balances</option>
                    <option value="neutral" selected>Neutral</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Dhatu Effects */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Dhatu Effects (Tissues)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dhatuOptions.map(dhatu => (
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`dhatu_${dhatu.id}`}
                    name="dhatuIds"
                    value={dhatu.id}
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label for={`dhatu_${dhatu.id}`}>{dhatu.name}</label>
                  <select
                    name={`dhatuEffect_${dhatu.id}`}
                    class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="increases">Increases</option>
                    <option value="decreases">Decreases</option>
                    <option value="maintains">Maintains</option>
                    <option value="neutral" selected>Neutral</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Srota Effects */}
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Srota Effects (Channels)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {srotaOptions.map(srota => (
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`srota_${srota.id}`}
                    name="srotaIds"
                    value={srota.id}
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label for={`srota_${srota.id}`}>{srota.name}</label>
                  <select
                    name={`srotaEffect_${srota.id}`}
                    class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="opens">Opens</option>
                    <option value="blocks">Blocks</option>
                    <option value="cleanses">Cleanses</option>
                    <option value="neutral" selected>Neutral</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Prabhava (Special Effect)</label>
              <textarea
                name="prabhava"
                rows={3}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Contraindications</label>
              <textarea
                name="contraindications"
                rows={3}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Dosage Form</label>
              <input
                type="text"
                name="dosageForm"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Dosage Range</label>
              <input
                type="text"
                name="dosageRange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Anupana (Vehicle)</label>
              <input
                type="text"
                name="anupana"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/ayurvedic`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
