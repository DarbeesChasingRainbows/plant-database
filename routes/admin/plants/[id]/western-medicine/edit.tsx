// routes/admin/plants/[id]/western-medicine/edit.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants, westernMedicine } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditWesternMedicinePageData {
  plant: Plant;
  medicineInfo: any;
}

export const handler: Handlers<EditWesternMedicinePageData> = {
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

      // Fetch western medicine information
      const medicineData = await db.select().from(westernMedicine).where(
        eq(westernMedicine.plantId, plantId),
      ).execute();

      if (medicineData.length === 0) {
        // Redirect to the add page if no western medicine info exists
        const headers = new Headers();
        headers.set("location", `/admin/plants/${plantId}/western-medicine/add`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return ctx.render({
        plant: plantData,
        medicineInfo: medicineData[0],
      });
    } catch (error) {
      console.error("Error fetching western medicine data:", error);
      return new Response("Error fetching western medicine data", { status: 500 });
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
      const medicineId = formData.get("medicineId")?.toString();
      if (!medicineId) {
        return new Response("Missing western medicine ID", { status: 400 });
      }

      const activeConstituents = formData.get("activeConstituents")?.toString().split(',').map(constituent => constituent.trim()) || [];
      const clinicalEffects = formData.get("clinicalEffects")?.toString().split(',').map(effect => effect.trim()) || [];
      const medicalUses = formData.get("medicalUses")?.toString() || null;
      const preparations = formData.get("preparations")?.toString() || null;
      const dosage = formData.get("dosage")?.toString() || null;
      const contraindications = formData.get("contraindications")?.toString() || null;
      const sideEffects = formData.get("sideEffects")?.toString() || null;
      const interactions = formData.get("interactions")?.toString() || null;
      const clinicalTrials = formData.get("clinicalTrials")?.toString() || null;
      const safetyProfile = formData.get("safetyProfile")?.toString() || null;
      const pharmacokinetics = formData.get("pharmacokinetics")?.toString() || null;
      const researchStatus = formData.get("researchStatus")?.toString() || null;
      const regulatoryStatus = formData.get("regulatoryStatus")?.toString() || null;
      const notes = formData.get("notes")?.toString() || null;

      // Update western medicine information in database
      await db.update(westernMedicine)
        .set({
          activeConstituents,
          clinicalEffects,
          medicalUses,
          preparations,
          dosage,
          contraindications,
          sideEffects,
          interactions,
          clinicalTrials,
          safetyProfile,
          pharmacokinetics,
          researchStatus,
          regulatoryStatus,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(westernMedicine.medicineId, parseInt(medicineId)))
        .execute();

      // Redirect to the western medicine information page
      const headers = new Headers();
      headers.set("location", `/admin/plants/${plantId}/western-medicine`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating western medicine information:", error);
      return new Response("Error updating western medicine information", { status: 500 });
    }
  },
};

export default function EditWesternMedicinePage({ data }: PageProps<EditWesternMedicinePageData>) {
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

  const { plant, medicineInfo } = data;

  // Helper function to join array to comma-separated string, handling null/undefined
  const joinArray = (arr: string[] | null | undefined): string => {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join(", ");
  };

  return (
    <PlantAdminLayout
      plantId={plant.id}
      plantName={plant.common_name}
      activeTab="western-medicine"
    >
      <div class="p-4">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Edit Western Medicine Information</h1>
          <p class="text-gray-600">
            Modify western medicine information for {plant.common_name} ({plant.botanical_name})
          </p>
        </div>

        <form method="POST" class="bg-white shadow rounded-lg p-6">
          <input type="hidden" name="medicineId" value={medicineInfo.medicineId} />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="activeConstituents">
                  Active Constituents
                </label>
                <input
                  type="text"
                  id="activeConstituents"
                  name="activeConstituents"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Alkaloids, Flavonoids, Tannins (comma-separated)"
                  value={joinArray(medicineInfo.activeConstituents)}
                />
                <p class="mt-1 text-sm text-gray-500">Comma-separated list of active constituents</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="clinicalEffects">
                  Clinical Effects
                </label>
                <input
                  type="text"
                  id="clinicalEffects"
                  name="clinicalEffects"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Anti-inflammatory, Analgesic, Antioxidant (comma-separated)"
                  value={joinArray(medicineInfo.clinicalEffects)}
                />
                <p class="mt-1 text-sm text-gray-500">Comma-separated list of effects</p>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="medicalUses">
                  Medical Uses
                </label>
                <textarea
                  id="medicalUses"
                  name="medicalUses"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe medical uses..."
                >{medicineInfo.medicalUses || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="preparations">
                  Preparations
                </label>
                <textarea
                  id="preparations"
                  name="preparations"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe common preparations..."
                >{medicineInfo.preparations || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="dosage">
                  Dosage
                </label>
                <textarea
                  id="dosage"
                  name="dosage"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe dosage guidelines..."
                >{medicineInfo.dosage || ""}</textarea>
              </div>
            </div>

            {/* Right Column */}
            <div>
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
                >{medicineInfo.contraindications || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="sideEffects">
                  Side Effects
                </label>
                <textarea
                  id="sideEffects"
                  name="sideEffects"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe potential side effects..."
                >{medicineInfo.sideEffects || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="interactions">
                  Drug Interactions
                </label>
                <textarea
                  id="interactions"
                  name="interactions"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe known drug interactions..."
                >{medicineInfo.interactions || ""}</textarea>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="clinicalTrials">
                  Clinical Trials
                </label>
                <textarea
                  id="clinicalTrials"
                  name="clinicalTrials"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Summarize relevant clinical trials..."
                >{medicineInfo.clinicalTrials || ""}</textarea>
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="safetyProfile">
              Safety Profile
            </label>
            <textarea
              id="safetyProfile"
              name="safetyProfile"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe the overall safety profile..."
            >{medicineInfo.safetyProfile || ""}</textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="pharmacokinetics">
              Pharmacokinetics
            </label>
            <textarea
              id="pharmacokinetics"
              name="pharmacokinetics"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe absorption, distribution, metabolism, and excretion..."
            >{medicineInfo.pharmacokinetics || ""}</textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="researchStatus">
              Research Status
            </label>
            <textarea
              id="researchStatus"
              name="researchStatus"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe current research status..."
            >{medicineInfo.researchStatus || ""}</textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="regulatoryStatus">
              Regulatory Status
            </label>
            <textarea
              id="regulatoryStatus"
              name="regulatoryStatus"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe regulatory status in different countries..."
            >{medicineInfo.regulatoryStatus || ""}</textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any other relevant information..."
            >{medicineInfo.notes || ""}</textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <a
              href={`/admin/plants/${plant.id}/western-medicine`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Western Medicine Information
            </button>
          </div>
        </form>
      </div>
    </PlantAdminLayout>
  );
}
