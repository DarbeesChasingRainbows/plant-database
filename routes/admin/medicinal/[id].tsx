import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { db } from "../../../utils/db.ts";
import { medicinalProperties, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface MedicinalPropertyDetailData {
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
  error?: string;
}

export const handler: Handlers<MedicinalPropertyDetailData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const medPropId = parseInt(id);

    if (isNaN(medPropId)) {
      return ctx.render({ error: "Invalid medicinal property ID" });
    }

    try {
      // Use Drizzle ORM to fetch the medicinal property with plant details
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

      return ctx.render({ property: results[0] });
    } catch (error) {
      console.error("Error fetching medicinal property:", error);
      return ctx.render({ error: "Failed to fetch medicinal property details" });
    }
  }
};

export default function MedicinalPropertyDetailPage({ data }: PageProps<MedicinalPropertyDetailData>) {
  const { property, error } = data;

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
    <AdminLayout title={`${property.plantName} - Medicinal Properties`} currentPath="/admin/medicinal">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{property.plantName} - Medicinal Properties</h1>
        <div class="space-x-2">
          <a 
            href={`/admin/medicinal/edit/${property.medPropId}`} 
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Edit Property
          </a>
          <a 
            href="/admin/medicinal" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to Properties
          </a>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Medicinal Property Details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this plant's medicinal properties.</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Plant</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a href={`/admin/plants/${property.plantId}`} class="text-indigo-600 hover:text-indigo-900">
                  {property.plantName}
                </a>
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Traditional Uses</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {property.traditionalUses || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Drug Interactions</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {property.drugInteractions || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Safety Notes</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {property.safetyNotes || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Preparation Methods</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {property.preparationMethods || "Not specified"}
              </dd>
            </div>
            
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Dosage Guidelines</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {property.dosageGuidelines || "Not specified"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}
