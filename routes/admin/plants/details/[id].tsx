import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../utils/client.ts";
import { Button } from "../../../../components/Button.tsx";
import PlantAdminLayout from "../../../../components/PlantAdminLayout.tsx";
import DeletePlantButton from "../../../../islands/DeletePlantButton.tsx";
import { eq } from "drizzle-orm";
import { plants as plantsTable, plantParts as plantPartsTable, plantGerminationGuide as germinationGuidesTable, plantProperties as plantPropertiesTable, companionGroupPlant } from "../../../../utils/schema.ts";

interface Data {
  plant: {
    id: number;
    commonName: string;
    botanicalName: string;
    family: string | null;
    genus: string | null;
    species: string | null;
    description: string | null;
    nativeRange: string | null;
    growthHabit: string | null;
    lifespan: string | null;
    hardinessZones: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  plantParts: {
    partId: number;
    partName: string;
    description: string | null;
    edible: boolean;
  }[];
  germinationGuides: {
    guideId: number;
    zoneRange: string | null;
    soilTempMinC: number | null;
    soilTempMaxC: number | null;
    daysToGerminationMin: number | null;
    daysToGerminationMax: number | null;
    plantingDepthCm: number | null;
    lightRequirement: string | null;
    stratificationRequired: boolean | null;
    stratificationInstructions: string | null;
    scarificationRequired: boolean | null;
    scarificationInstructions: string | null;
    specialRequirements: string | null;
    germinationNotes: string | null;
  }[];
  plantProperties: {
    propId: number;
    zoneRange: string | null;
    soilPhRange: string | null;
    lightRequirements: string | null;
    waterRequirements: string | null;
    daysToMaturity: number | null;
    heightMatureCm: number | null;
    spreadMatureCm: number | null;
    soilTypePreferences: string | null;
    cultivationNotes: string | null;
    pestSusceptibility: string | null;
    diseaseSusceptibility: string | null;
  }[];
  companionGroups: {
    groupId: number;
    companionPlantId: number;
    companionPlantName: string;
    relationshipType: string;
    notes: string | null;
  }[];
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    try {
      const { id } = ctx.params;
      const plantId = parseInt(id);
      
      if (isNaN(plantId)) {
        return ctx.render({ 
          plant: null, 
          plantParts: [], 
          germinationGuides: [], 
          plantProperties: [], 
          companionGroups: [],
          error: "Invalid plant ID" 
        });
      }

      // Get plant data using Drizzle ORM
      const plantResult = await db.select().from(plantsTable).where(eq(plantsTable.id, plantId));
      const plant = plantResult[0] || null;
      
      if (!plant) {
        return ctx.render({ 
          plant: null, 
          plantParts: [], 
          germinationGuides: [], 
          plantProperties: [],
          companionGroups: [],
          error: "Plant not found" 
        });
      }

      // Get plant parts using Drizzle ORM
      const plantPartsResult = await db.select().from(plantPartsTable).where(eq(plantPartsTable.plantId, plantId));
      
      // Transform plant parts to match the expected interface
      const plantParts = plantPartsResult.map(part => ({
        partId: part.partId,
        partName: part.partName,
        description: part.description,
        edible: part.edible === null ? false : part.edible
      }));

      // Get germination guides using Drizzle ORM
      const germinationGuidesResult = await db.select().from(germinationGuidesTable).where(eq(germinationGuidesTable.plantId, plantId));
      
      // Transform germination guides to match the expected interface
      const germinationGuides = germinationGuidesResult.map(guide => ({
        guideId: guide.guideId,
        zoneRange: guide.zoneRange,
        soilTempMinC: guide.soilTempMinC ? Number(guide.soilTempMinC) : null,
        soilTempMaxC: guide.soilTempMaxC ? Number(guide.soilTempMaxC) : null,
        daysToGerminationMin: guide.daysToGerminationMin,
        daysToGerminationMax: guide.daysToGerminationMax,
        plantingDepthCm: guide.plantingDepthCm ? Number(guide.plantingDepthCm) : null,
        lightRequirement: guide.lightRequirement,
        stratificationRequired: guide.stratificationRequired,
        stratificationInstructions: guide.stratificationInstructions,
        scarificationRequired: guide.scarificationRequired,
        scarificationInstructions: guide.scarificationInstructions,
        specialRequirements: guide.specialRequirements,
        germinationNotes: guide.germinationNotes
      }));

      // Get plant properties using Drizzle ORM
      const plantPropertiesResult = await db.select().from(plantPropertiesTable).where(eq(plantPropertiesTable.plantId, plantId));
      
      // Transform plant properties to match the expected interface
      const plantProperties = plantPropertiesResult.map(prop => ({
        propId: prop.propertyId,
        zoneRange: prop.zoneRange,
        soilPhRange: prop.soilPhRange,
        lightRequirements: prop.lightRequirements,
        waterRequirements: prop.waterRequirements,
        daysToMaturity: prop.daysToMaturity,
        heightMatureCm: prop.heightMatureCm,
        spreadMatureCm: prop.spreadMatureCm,
        soilTypePreferences: prop.soilTypePreferences,
        cultivationNotes: prop.cultivationNotes,
        pestSusceptibility: prop.pestSusceptibility,
        diseaseSusceptibility: prop.diseaseSusceptibility
      }));

      // Get companion plants using Drizzle ORM
      const companionGroupsResult = await db.select().from(companionGroupPlant).where(eq(companionGroupPlant.plantId, plantId));
      
      // For now, we'll just return the basic companion group data
      // In a real implementation, we would need to join with plants table to get companion plant names
      const companionGroups = companionGroupsResult.map((companion) => ({
        groupId: companion.groupId,
        companionPlantId: companion.plantId,
        companionPlantName: "Unknown Plant", // This would need to be fetched from plants table
        relationshipType: companion.relationshipTypeId?.toString() || "Unknown",
        notes: companion.benefits || companion.cautions || null,
      }));

      // Format dates for the plant object
      const formattedPlant = plant ? {
        ...plant,
        createdAt: plant.createdAt ? plant.createdAt.toISOString() : '',
        updatedAt: plant.updatedAt ? plant.updatedAt.toISOString() : ''
      } : null;

      return ctx.render({
        plant: formattedPlant,
        plantParts,
        germinationGuides,
        plantProperties,
        companionGroups,
      });
    } catch (error) {
      console.error("Error fetching plant details:", error);
      return ctx.render({
        plant: null,
        plantParts: [],
        germinationGuides: [],
        plantProperties: [],
        companionGroups: [],
        error: `Error fetching plant details: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function PlantDetails({ data }: PageProps<Data>) {
  const { plant, plantParts, germinationGuides, plantProperties, companionGroups, error } = data;

  if (error) {
    return (
      <PlantAdminLayout plantId={0} plantName="Error" activeTab="details">
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
      <PlantAdminLayout plantId={0} plantName="Not Found" activeTab="details">
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
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="details">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{plant.commonName}</h1>
        <div class="flex space-x-2">
          <Button href="/admin/plants">Back to Plants</Button>
          <Button href={`/admin/plants/edit/${plant.id}`}>Edit Plant</Button>
          <DeletePlantButton id={plant.id} name={plant.commonName} />
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Plant Details</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Botanical and general information</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Common Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.commonName}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Botanical Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.botanicalName}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Family</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.family || "Not specified"}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Genus</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.genus || "Not specified"}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Species</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.species || "Not specified"}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.description || "No description available"}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Native Range</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.nativeRange || "Not specified"}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Taxonomy</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{plant.taxonomy || "Not specified"}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Plant Type</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {plant.isMedicinal && <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">Medicinal</span>}
                {plant.isFoodCrop && <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">Food Crop</span>}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Plant Parts Section */}
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Plant Parts</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Parts of the plant and their uses</p>
          </div>
          <Button href={`/admin/parts/new?plantId=${plant.id}`}>Add Plant Part</Button>
        </div>
        <div class="border-t border-gray-200">
          {plantParts.length > 0 ? (
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edible
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {plantParts.map((part) => (
                  <tr key={part.partId}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {part.partName}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      {part.description || "No description"}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.edible ? (
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      )}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/parts/edit/${part.partId}`} class="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </a>
                      <a href={`/admin/parts/${part.partId}`} class="text-indigo-600 hover:text-indigo-900">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div class="px-6 py-4 text-center text-sm text-gray-500">
              No plant parts have been added yet.
            </div>
          )}
        </div>
      </div>

      {/* Germination Guides Section */}
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Germination Guides</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Information on how to germinate this plant</p>
          </div>
          <Button href={`/admin/germination/new?plantId=${plant.id}`}>Add Germination Guide</Button>
        </div>
        <div class="border-t border-gray-200">
          {germinationGuides.length > 0 ? (
            <div class="px-4 py-5 sm:p-6">
              {germinationGuides.map((guide) => (
                <div key={guide.guideId} class="mb-4 p-4 border rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guide.zoneRange && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Zone Range</h4>
                        <p class="text-sm text-gray-900">{guide.zoneRange}</p>
                      </div>
                    )}
                    {guide.soilTempMinC && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Soil Temperature Min (°C)</h4>
                        <p class="text-sm text-gray-900">{guide.soilTempMinC}</p>
                      </div>
                    )}
                    {guide.soilTempMaxC && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Soil Temperature Max (°C)</h4>
                        <p class="text-sm text-gray-900">{guide.soilTempMaxC}</p>
                      </div>
                    )}
                    {guide.daysToGerminationMin && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Days to Germination Min</h4>
                        <p class="text-sm text-gray-900">{guide.daysToGerminationMin}</p>
                      </div>
                    )}
                    {guide.daysToGerminationMax && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Days to Germination Max</h4>
                        <p class="text-sm text-gray-900">{guide.daysToGerminationMax}</p>
                      </div>
                    )}
                    {guide.plantingDepthCm && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Planting Depth (cm)</h4>
                        <p class="text-sm text-gray-900">{guide.plantingDepthCm}</p>
                      </div>
                    )}
                    {guide.lightRequirement && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Light Requirement</h4>
                        <p class="text-sm text-gray-900">{guide.lightRequirement}</p>
                      </div>
                    )}
                    {guide.stratificationRequired && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Stratification Required</h4>
                        <p class="text-sm text-gray-900">{guide.stratificationRequired ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                    {guide.stratificationInstructions && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Stratification Instructions</h4>
                        <p class="text-sm text-gray-900">{guide.stratificationInstructions}</p>
                      </div>
                    )}
                    {guide.scarificationRequired && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Scarification Required</h4>
                        <p class="text-sm text-gray-900">{guide.scarificationRequired ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                    {guide.scarificationInstructions && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Scarification Instructions</h4>
                        <p class="text-sm text-gray-900">{guide.scarificationInstructions}</p>
                      </div>
                    )}
                    {guide.specialRequirements && (
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Special Requirements</h4>
                        <p class="text-sm text-gray-900">{guide.specialRequirements}</p>
                      </div>
                    )}
                    {guide.germinationNotes && (
                      <div class="md:col-span-2">
                        <h4 class="text-sm font-medium text-gray-500">Germination Notes</h4>
                        <p class="text-sm text-gray-900">{guide.germinationNotes}</p>
                      </div>
                    )}
                  </div>
                  <div class="mt-3 flex justify-end">
                    <a href={`/admin/germination/edit/${guide.guideId}`} class="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </a>
                    <a href={`/admin/germination/${guide.guideId}`} class="text-indigo-600 hover:text-indigo-900">
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="px-6 py-4 text-center text-sm text-gray-500">
              No germination guides have been added yet.
            </div>
          )}
        </div>
      </div>

      {/* Plant Properties Section */}
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Plant Properties</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Growing conditions and characteristics</p>
          </div>
          <Button href={`/admin/properties/new?plantId=${plant.id}`}>Add Properties</Button>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Properties</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {plantProperties.length > 0 && plantProperties.map(prop => (
                  <div key={prop.propId}>
                    {prop.zoneRange && <span class="mr-2">Zone Range: {prop.zoneRange}</span>}
                    {prop.soilPhRange && <span class="mr-2">Soil pH Range: {prop.soilPhRange}</span>}
                    {prop.lightRequirements && <span class="mr-2">Light Requirements: {prop.lightRequirements}</span>}
                    {prop.waterRequirements && <span class="mr-2">Water Requirements: {prop.waterRequirements}</span>}
                    {prop.daysToMaturity && <span class="mr-2">Days to Maturity: {prop.daysToMaturity}</span>}
                    {prop.heightMatureCm && <span class="mr-2">Height at Maturity (cm): {prop.heightMatureCm}</span>}
                    {prop.spreadMatureCm && <span class="mr-2">Spread at Maturity (cm): {prop.spreadMatureCm}</span>}
                    {prop.soilTypePreferences && <span class="mr-2">Soil Type Preferences: {prop.soilTypePreferences}</span>}
                    {prop.cultivationNotes && <span class="mr-2">Cultivation Notes: {prop.cultivationNotes}</span>}
                    {prop.pestSusceptibility && <span class="mr-2">Pest Susceptibility: {prop.pestSusceptibility}</span>}
                    {prop.diseaseSusceptibility && <span class="mr-2">Disease Susceptibility: {prop.diseaseSusceptibility}</span>}
                  </div>
                ))}
                {plantProperties.length === 0 && <span>No properties specified</span>}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Companion Plants Section */}
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Companion Plants</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Plants that grow well together</p>
          </div>
          <Button href={`/admin/companions/new?plantId=${plant.id}`}>Add Companion</Button>
        </div>
        <div class="border-t border-gray-200">
          {companionGroups.length > 0 ? (
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companion Plant
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relationship
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {companionGroups.map((companion) => (
                  <tr key={companion.groupId}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {companion.companionPlantName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        companion.relationshipType === 'beneficial' ? 'bg-green-100 text-green-800' :
                        companion.relationshipType === 'harmful' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {companion.relationshipType}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      {companion.notes || "No notes"}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/companions/edit/${companion.groupId}`} class="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </a>
                      <a href={`/admin/companions/${companion.groupId}`} class="text-indigo-600 hover:text-indigo-900">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div class="px-6 py-4 text-center text-sm text-gray-500">
              No companion plants have been added yet.
            </div>
          )}
        </div>
      </div>
    </PlantAdminLayout>
  );
}