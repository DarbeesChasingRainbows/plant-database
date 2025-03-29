import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../utils/client.ts";
import { Button as _Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import { eq, sql } from "drizzle-orm";
import { plants, plantTcmProperties, tcmMeridians, tcmTastes, tcmTemperatures, tcmActions, tcmPatterns, plantTcmActions, plantTcmPatterns } from "../../../../utils/schema.ts";

interface Data {
  plant: {
    id: number;
    commonName: string;
    botanicalName: string;
  } | null;
  tcmProperties: {
    propertyId: number;
    tasteIds: number[];
    tasteNames: string[];
    meridianIds: number[];
    meridianNames: string[];
    temperatureId: number | null;
    temperatureName: string | null;
    dosageRange: string | null;
    preparationMethods: string | null;
  } | null;
  tcmActions: {
    actionId: number;
    actionName: string;
    notes: string | null;
  }[];
  tcmPatterns: {
    patternId: number;
    patternName: string;
    usageNotes: string | null;
  }[];
  error?: string;
}

interface TcmAction {
  actionId: number;
  actionName: string;
  notes: string | null;
}

interface TcmPattern {
  patternId: number;
  patternName: string;
  usageNotes: string | null;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    try {
      const { id } = ctx.params;
      const plantId = parseInt(id);
      
      if (isNaN(plantId)) {
        return ctx.render({ 
          plant: null, 
          tcmProperties: null,
          tcmActions: [],
          tcmPatterns: [],
          error: "Invalid plant ID" 
        });
      }

      // Get plant data using Drizzle ORM
      const plantResult = await db.select().from(plants).where(eq(plants.id, plantId));
      const plant = plantResult[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          tcmProperties: null,
          tcmActions: [],
          tcmPatterns: [],
          error: "Plant not found" 
        });
      }

      // Get TCM properties
      const tcmPropertiesResult = await db.select({
        propertyId: plantTcmProperties.propertyId,
        tasteIds: plantTcmProperties.tasteIds,
        meridianIds: plantTcmProperties.meridianIds,
        temperatureId: plantTcmProperties.temperatureId,
        dosageRange: plantTcmProperties.dosageRange,
        preparationMethods: plantTcmProperties.preparationMethods,
      }).from(plantTcmProperties)
        .where(eq(plantTcmProperties.plantId, plantId));

      let tcmProperties = null;
      if (tcmPropertiesResult.length > 0) {
        const property = tcmPropertiesResult[0];
        
        // Get taste names
        const tasteNames: string[] = [];
        if (property.tasteIds && property.tasteIds.length > 0) {
          const tastes = await db.select({
            id: tcmTastes.tasteId,
            name: tcmTastes.name,
          }).from(tcmTastes)
            .where(sql`${tcmTastes.tasteId} = ANY(${property.tasteIds})`);
          
          tastes.forEach(taste => tasteNames.push(taste.name));
        }
        
        // Get meridian names
        const meridianNames: string[] = [];
        if (property.meridianIds && property.meridianIds.length > 0) {
          const meridians = await db.select({
            id: tcmMeridians.meridianId,
            name: tcmMeridians.name,
          }).from(tcmMeridians)
            .where(sql`${tcmMeridians.meridianId} = ANY(${property.meridianIds})`);
          
          meridians.forEach(meridian => meridianNames.push(meridian.name));
        }
        
        // Get temperature name
        let temperatureName = null;
        if (property.temperatureId) {
          const temperature = await db.select({
            name: tcmTemperatures.name,
          }).from(tcmTemperatures)
            .where(eq(tcmTemperatures.temperatureId, property.temperatureId));
          
          if (temperature.length > 0) {
            temperatureName = temperature[0].name;
          }
        }
        
        tcmProperties = {
          ...property,
          tasteNames,
          meridianNames,
          temperatureName,
        };
      }
      
      // Fetch TCM actions
      const tcmActionsResult = await db.select({
        actionId: plantTcmActions.actionId,
        notes: plantTcmActions.notes,
      }).from(plantTcmActions)
        .where(eq(plantTcmActions.plantId, plantId));

      const tcmActions: TcmAction[] = [];
      for (const action of tcmActionsResult) {
        const actionInfo = await db.select({
          name: tcmActions.name,
        }).from(tcmActions)
          .where(eq(tcmActions.actionId, action.actionId as number));
        
        if (actionInfo.length > 0) {
          tcmActions.push({
            actionId: action.actionId as number,
            actionName: actionInfo[0].name,
            notes: action.notes,
          });
        }
      }

      // Fetch TCM patterns
      const tcmPatternsResult = await db.select({
        patternId: plantTcmPatterns.patternId,
        usageNotes: plantTcmPatterns.usageNotes,
      }).from(plantTcmPatterns)
        .where(eq(plantTcmPatterns.plantId, plantId));

      const tcmPatterns: TcmPattern[] = [];
      for (const pattern of tcmPatternsResult) {
        const patternInfo = await db.select({
          name: tcmPatterns.name,
        }).from(tcmPatterns)
          .where(eq(tcmPatterns.patternId, pattern.patternId as number));
        
        if (patternInfo.length > 0) {
          tcmPatterns.push({
            patternId: pattern.patternId as number,
            patternName: patternInfo[0].name,
            usageNotes: pattern.usageNotes,
          });
        }
      }

      return ctx.render({
        plant: {
          id: plant.id,
          commonName: plant.commonName,
          botanicalName: plant.botanicalName,
        },
        tcmProperties,
        tcmActions,
        tcmPatterns,
      });
    } catch (error) {
      console.error("Error fetching TCM properties:", error);
      return ctx.render({
        plant: null,
        tcmProperties: null,
        tcmActions: [],
        tcmPatterns: [],
        error: `Error fetching TCM properties: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

function TCMProperties({ data }: PageProps<Data>) {
  const { plant, tcmProperties, tcmActions, tcmPatterns, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="tcm">
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
      </PlantAdminLayout>
    );
  }

  if (!plant) {
    return (
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="tcm">
        <div class="text-center py-8">
          <h2 class="text-2xl font-bold text-gray-900">Plant Not Found</h2>
          <p class="mt-2 text-gray-600">The plant you're looking for doesn't exist or has been removed.</p>
          <div class="mt-6">
            <a href="/admin/plants" class="text-blue-600 hover:text-blue-800">
              Return to Plants List
            </a>
          </div>
        </div>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="tcm">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          TCM Properties for {plant.botanicalName}
        </h1>

        {/* TCM Properties Section */}
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Basic Properties</h2>
            <a href={`/admin/plants/tcm/edit/${plant.id}`} class="text-blue-600 hover:text-blue-800">
              Edit Properties
            </a>
          </div>

          {tcmProperties ? (
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Tastes</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {tcmProperties.tasteNames.length > 0 
                        ? tcmProperties.tasteNames.join(", ") 
                        : "None specified"}
                    </dd>
                  </div>
                  
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Temperature</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {tcmProperties.temperatureName || "Not specified"}
                    </dd>
                  </div>
                  
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Meridians</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {tcmProperties.meridianNames.length > 0 
                        ? tcmProperties.meridianNames.join(", ") 
                        : "None specified"}
                    </dd>
                  </div>
                  
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Dosage Range</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {tcmProperties.dosageRange || "Not specified"}
                    </dd>
                  </div>
                  
                  <div class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Preparation Methods</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {tcmProperties.preparationMethods 
                        ? <p class="whitespace-pre-line">{tcmProperties.preparationMethods}</p>
                        : "Not specified"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div class="bg-gray-50 p-4 border border-gray-200 rounded-md">
              <p class="text-gray-600">No TCM properties have been added for this plant.</p>
              <a 
                href={`/admin/plants/tcm/new/${plant.id}`}
                class="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Add TCM Properties
              </a>
            </div>
          )}
        </div>

        {/* TCM Actions Section */}
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">TCM Actions</h2>
            <a href={`/admin/plants/tcm/actions/${plant.id}`} class="text-blue-600 hover:text-blue-800">
              Manage Actions
            </a>
          </div>

          {tcmActions.length > 0 ? (
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul class="divide-y divide-gray-200">
                {tcmActions.map(action => (
                  <li class="px-4 py-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-medium text-gray-900">{action.actionName}</h3>
                        {action.notes && (
                          <p class="mt-1 text-sm text-gray-600">{action.notes}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div class="bg-gray-50 p-4 border border-gray-200 rounded-md">
              <p class="text-gray-600">No TCM actions have been added for this plant.</p>
              <a 
                href={`/admin/plants/tcm/actions/${plant.id}`}
                class="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Add TCM Actions
              </a>
            </div>
          )}
        </div>

        {/* TCM Patterns Section */}
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">TCM Patterns</h2>
            <a href={`/admin/plants/tcm/patterns/${plant.id}`} class="text-blue-600 hover:text-blue-800">
              Manage Patterns
            </a>
          </div>

          {tcmPatterns.length > 0 ? (
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul class="divide-y divide-gray-200">
                {tcmPatterns.map(pattern => (
                  <li class="px-4 py-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-medium text-gray-900">{pattern.patternName}</h3>
                        {pattern.usageNotes && (
                          <p class="mt-1 text-sm text-gray-600">{pattern.usageNotes}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div class="bg-gray-50 p-4 border border-gray-200 rounded-md">
              <p class="text-gray-600">No TCM patterns have been added for this plant.</p>
              <a 
                href={`/admin/plants/tcm/patterns/${plant.id}`}
                class="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Add TCM Patterns
              </a>
            </div>
          )}
        </div>
      </div>
    </PlantAdminLayout>
  );
}

export default TCMProperties;
