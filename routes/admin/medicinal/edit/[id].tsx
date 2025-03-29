import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { db } from "../../../../utils/db.ts";
import { medicinalProperties, plants } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditMedicinalPropertyData {
  property?: {
    medPropId: number;
    plantId: number;
    plantName: string;
    drugInteractions: string | null;
    traditionalUses: string | null;
    safetyNotes: string | null;
    preparationMethods: string | null;
    dosageGuidelines: string | null;
  };
  plants?: Array<{
    id: number;
    botanicalName: string;
  }>;
  error?: string;
}

export const handler: Handlers<EditMedicinalPropertyData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const medPropId = parseInt(id);

    if (isNaN(medPropId)) {
      return ctx.render({ error: "Invalid medicinal property ID" });
    }

    try {
      // Fetch the medicinal property with plant details
      const results = await db.select({
        medPropId: medicinalProperties.medPropId,
        plantId: medicinalProperties.plantId,
        plantName: plants.botanicalName,
        drugInteractions: medicinalProperties.drugInteractions,
        traditionalUses: medicinalProperties.traditionalUses,
        safetyNotes: medicinalProperties.safetyNotes,
        preparationMethods: medicinalProperties.preparationMethods,
        dosageGuidelines: medicinalProperties.dosageGuidelines,
      })
      .from(medicinalProperties)
      .leftJoin(plants, eq(medicinalProperties.plantId, plants.id))
      .where(eq(medicinalProperties.medPropId, medPropId))
      .limit(1);

      if (results.length === 0) {
        return ctx.render({ error: "Medicinal property not found" });
      }

      // Fetch all plants for the dropdown
      const plantsList = await db.select({
        id: plants.id,
        botanicalName: plants.botanicalName,
      }).from(plants).orderBy(plants.botanicalName);

      return ctx.render({ 
        property: results[0],
        plants: plantsList
      });
    } catch (error) {
      console.error("Error fetching medicinal property:", error);
      return ctx.render({ error: "Failed to fetch medicinal property details" });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const medPropId = parseInt(id);

    if (isNaN(medPropId)) {
      return ctx.render({ error: "Invalid medicinal property ID" });
    }

    try {
      const form = await req.formData();
      const plantId = parseInt(form.get("plantId")?.toString() || "0");
      const traditionalUses = form.get("traditionalUses")?.toString() || null;
      const drugInteractions = form.get("drugInteractions")?.toString() || null;
      const safetyNotes = form.get("safetyNotes")?.toString() || null;
      const preparationMethods = form.get("preparationMethods")?.toString() || null;
      const dosageGuidelines = form.get("dosageGuidelines")?.toString() || null;

      if (!plantId) {
        return ctx.render({ error: "Plant is required" });
      }

      // Update the medicinal property
      await db.update(medicinalProperties)
        .set({
          plantId,
          traditionalUses,
          drugInteractions,
          safetyNotes,
          preparationMethods,
          dosageGuidelines,
          updatedAt: new Date(),
        })
        .where(eq(medicinalProperties.medPropId, medPropId));

      // Redirect to the medicinal property details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/medicinal/${medPropId}` }
      });
    } catch (error) {
      console.error("Error updating medicinal property:", error);
      return ctx.render({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  }
};

export default function EditMedicinalPropertyPage({ data }: PageProps<EditMedicinalPropertyData>) {
  const { property, plants = [], error } = data;

  if (error) {
    return (
      <AdminLayout title="Error" currentPath="/admin/medicinal">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
        <a href="/admin/medicinal" class="text-indigo-600 hover:text-indigo-900">
          &larr; Back to Medicinal Properties
        </a>
      </AdminLayout>
    );
  }

  if (!property) {
    return (
      <AdminLayout title="Loading..." currentPath="/admin/medicinal">
        <div>Loading medicinal property details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit ${property.plantName} - Medicinal Properties`} currentPath="/admin/medicinal">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Medicinal Property</h1>
        <div class="space-x-2">
          <a 
            href={`/admin/medicinal/${property.medPropId}`} 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            View Details
          </a>
          <a 
            href="/admin/medicinal" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to Properties
          </a>
        </div>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" action={`/admin/medicinal/edit/${property.medPropId}`} class="p-6 space-y-6">
          <div>
            <label for="plantId" class="block text-sm font-medium text-gray-700">
              Plant *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={property.plantId}
            >
              <option value="">Select a plant</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id} selected={plant.id === property.plantId}>
                  {plant.botanicalName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label for="traditionalUses" class="block text-sm font-medium text-gray-700">
              Traditional Uses
            </label>
            <textarea
              name="traditionalUses"
              id="traditionalUses"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >{property.traditionalUses || ""}</textarea>
          </div>

          <div>
            <label for="drugInteractions" class="block text-sm font-medium text-gray-700">
              Drug Interactions
            </label>
            <textarea
              name="drugInteractions"
              id="drugInteractions"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >{property.drugInteractions || ""}</textarea>
          </div>

          <div>
            <label for="safetyNotes" class="block text-sm font-medium text-gray-700">
              Safety Notes
            </label>
            <textarea
              name="safetyNotes"
              id="safetyNotes"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >{property.safetyNotes || ""}</textarea>
          </div>

          <div>
            <label for="preparationMethods" class="block text-sm font-medium text-gray-700">
              Preparation Methods
            </label>
            <textarea
              name="preparationMethods"
              id="preparationMethods"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >{property.preparationMethods || ""}</textarea>
          </div>

          <div>
            <label for="dosageGuidelines" class="block text-sm font-medium text-gray-700">
              Dosage Guidelines
            </label>
            <textarea
              name="dosageGuidelines"
              id="dosageGuidelines"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >{property.dosageGuidelines || ""}</textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Update Medicinal Property
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
