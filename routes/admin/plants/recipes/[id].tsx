import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { db } from "../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, herbalUses } from "../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface HerbalUse {
  herbalUseId: number;
  plantId: number;
  categoryId: number | null;
  traditionalUses: string[] | null;
  preparationMethods: string[] | null;
  administrationRoutes: string[] | null;
  historicalContext: string | null;
  effectivenessNotes: string | null;
  modernApplications: string | null;
  referenceSource: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Data {
  plant: Plant | null;
  herbalUses: HerbalUse[];
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        herbalUses: [],
        error: "Invalid plant ID" 
      });
    }

    try {
      // Get plant details using Drizzle ORM
      const plantResult = await db.select({
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
          herbalUses: [],
          error: "Plant not found" 
        });
      }

      // Get herbal uses using Drizzle ORM
      const herbalUsesResult = await db.select()
        .from(herbalUses)
        .where(eq(herbalUses.plantId, id));
      
      return ctx.render({
        plant,
        herbalUses: herbalUsesResult,
      });
    } catch (error) {
      console.error("Error fetching plant data:", error);
      return ctx.render({ 
        plant: null, 
        herbalUses: [],
        error: `Error fetching plant data: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  },
};

export default function PlantRecipes({ data }: PageProps<Data>) {
  const { plant, herbalUses, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="recipes">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="recipes">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="recipes">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Herbal Uses</h1>
        <Button href={`/admin/plants/recipes/new/${plant.id}`}>Add New Use</Button>
      </div>
      
      {herbalUses.length === 0 ? (
        <div class="bg-gray-50 p-4 rounded-md text-center">
          <p class="text-gray-600">No herbal uses have been added for this plant.</p>
          <Button href={`/admin/plants/recipes/new/${plant.id}`} class="mt-2">Add New Use</Button>
        </div>
      ) : (
        <div class="space-y-6">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Category
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Traditional Uses
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Preparation Methods
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Administration Routes
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {herbalUses.map((herbalUse) => (
                  <tr key={herbalUse.herbalUseId}>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {herbalUse.categoryId}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {herbalUse.traditionalUses?.join(', ') || "Not specified"}
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      {herbalUse.preparationMethods?.join(', ') || "Not specified"}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {herbalUse.administrationRoutes?.join(', ') || "Not specified"}
                    </td>
                    <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div class="flex space-x-3 justify-end">
                        <a href={`/admin/plants/recipes/${plant.id}/${herbalUse.herbalUseId}`} class="text-blue-600 hover:text-blue-900">
                          View
                        </a>
                        <a href={`/admin/plants/recipes/edit/${plant.id}/${herbalUse.herbalUseId}`} class="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PlantAdminLayout>
  );
}
