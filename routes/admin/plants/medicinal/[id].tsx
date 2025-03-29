import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, medicinalProperties } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface MedicinalProperty {
  propertyId: number;
  plantId: number;
  isMedicinal: boolean;
  medicineSystems: string[] | null;
  primaryActions: string[] | null;
  secondaryActions: string[] | null;
  constituentCompounds: string[] | null;
  contraindications: string | null;
  safetyNotes: string | null;
  traditionalUses: string | null;
  researchFindings: string | null;
  preparationMethods: string | null;
  dosageGuidelines: string | null;
}

interface Data {
  plant: Plant | null;
  medicinalProperties: MedicinalProperty | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        medicinalProperties: null,
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
          medicinalProperties: null,
          error: "Plant not found" 
        });
      }

      // Get medicinal properties using Drizzle ORM
      const medicinalResult = await db
        .select()
        .from(medicinalProperties)
        .where(eq(medicinalProperties.plantId, id))
        .limit(1);
      
      let medicinalProps: MedicinalProperty | null = null;
      
      if (medicinalResult[0]) {
        const result = medicinalResult[0];
        medicinalProps = {
          propertyId: result.medPropId,
          plantId: result.plantId,
          isMedicinal: true, // If it exists in the table, it's medicinal
          medicineSystems: null, // These fields aren't in the database schema yet
          primaryActions: null,
          secondaryActions: null,
          constituentCompounds: null,
          contraindications: null,
          safetyNotes: result.safetyNotes,
          traditionalUses: result.traditionalUses,
          researchFindings: null, // Not in the database schema
          preparationMethods: result.preparationMethods,
          dosageGuidelines: result.dosageGuidelines
        };
      }

      return ctx.render({
        plant,
        medicinalProperties: medicinalProps,
      });
    } catch (error) {
      console.error("Error fetching medicinal properties:", error);
      return ctx.render({
        plant: null,
        medicinalProperties: null,
        error: `Error fetching medicinal properties: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function PlantMedicinal({ data }: PageProps<Data>) {
  const { plant, medicinalProperties, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="medicinal">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="medicinal">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="medicinal">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Medicinal Properties</h1>
        <div class="flex space-x-2">
          {medicinalProperties ? (
            <Button href={`/admin/plants/medicinal/edit/${plant.id}`}>Edit Medicinal Properties</Button>
          ) : (
            <Button href={`/admin/plants/medicinal/new/${plant.id}`}>Add Medicinal Properties</Button>
          )}
        </div>
      </div>
      
      {!medicinalProperties ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No medicinal properties have been added for this plant.</p>
          <Button href={`/admin/plants/medicinal/new/${plant.id}`} class="mt-2">Add Medicinal Properties</Button>
        </div>
      ) : (
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Medicine Systems</h3>
              {medicinalProperties.medicineSystems && medicinalProperties.medicineSystems.length > 0 ? (
                <div class="flex flex-wrap gap-2">
                  {medicinalProperties.medicineSystems.map((system) => (
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {system}
                    </span>
                  ))}
                </div>
              ) : (
                <p class="text-gray-500 italic">None specified</p>
              )}
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Primary Actions</h3>
              {medicinalProperties.primaryActions && medicinalProperties.primaryActions.length > 0 ? (
                <div class="flex flex-wrap gap-2">
                  {medicinalProperties.primaryActions.map((action) => (
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {action}
                    </span>
                  ))}
                </div>
              ) : (
                <p class="text-gray-500 italic">None specified</p>
              )}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Secondary Actions</h3>
            {medicinalProperties.secondaryActions && medicinalProperties.secondaryActions.length > 0 ? (
              <div class="flex flex-wrap gap-2">
                {medicinalProperties.secondaryActions.map((action) => (
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {action}
                  </span>
                ))}
              </div>
            ) : (
              <p class="text-gray-500 italic">None specified</p>
            )}
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Constituent Compounds</h3>
            {medicinalProperties.constituentCompounds && medicinalProperties.constituentCompounds.length > 0 ? (
              <div class="flex flex-wrap gap-2">
                {medicinalProperties.constituentCompounds.map((compound) => (
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {compound}
                  </span>
                ))}
              </div>
            ) : (
              <p class="text-gray-500 italic">None specified</p>
            )}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Contraindications</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {medicinalProperties.contraindications || "None specified"}
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Safety Notes</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {medicinalProperties.safetyNotes || "None specified"}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Traditional Uses</h3>
            <p class="text-gray-700 whitespace-pre-line">
              {medicinalProperties.traditionalUses || "None specified"}
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Research Findings</h3>
            <p class="text-gray-700 whitespace-pre-line">
              {medicinalProperties.researchFindings || "None specified"}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Preparation Methods</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {medicinalProperties.preparationMethods || "None specified"}
              </p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Dosage Guidelines</h3>
              <p class="text-gray-700 whitespace-pre-line">
                {medicinalProperties.dosageGuidelines || "None specified"}
              </p>
            </div>
          </div>
        </div>
      )}
    </PlantAdminLayout>
  );
}
