import { Handlers, PageProps } from "$fresh/server.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import CulinaryUsesForm from "../../../../../islands/CulinaryUsesForm.tsx";
import { db } from "../../../../../utils/client.ts";
import { eq } from "drizzle-orm";
import { plants, culinaryUses } from "../../../../../utils/schema.ts";

interface Plant {
  id: number;
  commonName: string;
  botanicalName: string;
}

interface CulinaryUse {
  useId: number;
  plantId: number;
  edibleParts: string[] | null;
  flavorProfile: string | null;
  culinaryCategory: string | null;
  preparationMethods: string | null;
  commonDishes: string | null;
  cuisines: string[] | null;
  harvestingSeason: string | null;
  nutritionalInfo: string | null;
  substitutions: string | null;
  pairsWith: string[] | null;
  storageMethod: string | null;
  preservationMethods: string | null;
  specialConsiderations: string | null;
  notes: string | null;
}

interface Data {
  plant: Plant | null;
  culinaryUse: CulinaryUse | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        culinaryUse: null,
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
          culinaryUse: null,
          error: "Plant not found" 
        });
      }

      // Get culinary uses using Drizzle ORM
      const culinaryResult = await db.select()
        .from(culinaryUses)
        .where(eq(culinaryUses.plantId, id))
        .limit(1);
      
      const culinaryUse = culinaryResult[0] || null;

      if (!culinaryUse) {
        return ctx.render({
          plant,
          culinaryUse: null,
          error: "Culinary uses not found for this plant"
        });
      }

      return ctx.render({
        plant,
        culinaryUse,
      });
    } catch (error) {
      console.error("Error fetching culinary uses:", error);
      return ctx.render({
        plant: null,
        culinaryUse: null,
        error: `Error fetching culinary uses: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
      return ctx.render({ 
        plant: null, 
        culinaryUse: null,
        error: "Invalid plant ID" 
      });
    }

    try {
      const form = await req.formData();
      
      // Get the existing culinary use to ensure it exists
      const existingCulinaryResult = await db.select({ useId: culinaryUses.useId })
        .from(culinaryUses)
        .where(eq(culinaryUses.plantId, id))
        .limit(1);
      
      if (existingCulinaryResult.length === 0) {
        throw new Error("Culinary uses not found for this plant");
      }

      // Process array fields from comma-separated strings
      const edibleParts = form.get('edibleParts')?.toString() || "";
      const ediblePartsArray = edibleParts ? edibleParts.split(',').map(part => part.trim()).filter(Boolean) : [];
      
      const cuisines = form.get('cuisines')?.toString() || "";
      const cuisinesArray = cuisines ? cuisines.split(',').map(cuisine => cuisine.trim()).filter(Boolean) : [];
      
      const pairsWith = form.get('pairsWith')?.toString() || "";
      const pairsWithArray = pairsWith ? pairsWith.split(',').map(item => item.trim()).filter(Boolean) : [];
      
      // Update culinary uses using Drizzle ORM
      await db.update(culinaryUses)
        .set({
          edibleParts: ediblePartsArray.length > 0 ? ediblePartsArray : null,
          flavorProfile: form.get('flavorProfile')?.toString() || null,
          culinaryCategory: form.get('culinaryCategory')?.toString() || null,
          preparationMethods: form.get('preparationMethods')?.toString() || null,
          commonDishes: form.get('commonDishes')?.toString() || null,
          cuisines: cuisinesArray.length > 0 ? cuisinesArray : null,
          harvestingSeason: form.get('harvestingSeason')?.toString() || null,
          nutritionalInfo: form.get('nutritionalInfo')?.toString() || null,
          substitutions: form.get('substitutions')?.toString() || null,
          pairsWith: pairsWithArray.length > 0 ? pairsWithArray : null,
          storageMethod: form.get('storageMethod')?.toString() || null,
          preservationMethods: form.get('preservationMethods')?.toString() || null,
          specialConsiderations: form.get('specialConsiderations')?.toString() || null,
          notes: form.get('notes')?.toString() || null,
          updatedAt: new Date(),
        })
        .where(eq(culinaryUses.plantId, id));

      // Redirect to the culinary uses page
      const headers = new Headers();
      headers.set("location", `/admin/plants/culinary/${id}`);
      return new Response(null, {
        status: 303,
        headers,
      });
    } catch (error) {
      console.error("Error updating culinary uses:", error);
      
      // Get plant and culinary use details for re-rendering the form
      const plantResult = await db.select({
          id: plants.id,
          commonName: plants.commonName,
          botanicalName: plants.botanicalName,
        })
        .from(plants)
        .where(eq(plants.id, id))
        .limit(1);
      
      const plant = plantResult[0] || null;
      
      const culinaryResult = await db.select()
        .from(culinaryUses)
        .where(eq(culinaryUses.plantId, id))
        .limit(1);
      
      const culinaryUse = culinaryResult[0] || null;
      
      return ctx.render({
        plant,
        culinaryUse,
        error: `Error updating culinary uses: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  },
};

export default function EditCulinaryUses({ data }: PageProps<Data>) {
  const { plant, culinaryUse, error } = data;

  if (!plant || !culinaryUse) {
    return (
      <PlantAdminLayout plantId={plant?.id || 0} plantName={plant?.commonName || "Not Found"} activeTab="culinary">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">{error || (plant ? "Culinary uses not found" : "Plant not found")}</p>
            </div>
          </div>
        </div>
        <a href={plant ? `/admin/plants/culinary/${plant.id}` : "/admin/plants"} class="text-blue-600 hover:text-blue-800">
          &larr; {plant ? "Back to Culinary Uses" : "Back to Plants"}
        </a>
      </PlantAdminLayout>
    );
  }

  return (
    <PlantAdminLayout plantId={plant.id} plantName={plant.commonName} activeTab="culinary">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Edit Culinary Uses</h1>
        <p class="text-gray-600">
          For {plant.commonName} ({plant.botanicalName})
        </p>
      </div>
      
      <CulinaryUsesForm
        initialData={{
          edibleParts: culinaryUse.edibleParts || [],
          flavorProfile: culinaryUse.flavorProfile || "",
          culinaryCategory: culinaryUse.culinaryCategory || "",
          preparationMethods: culinaryUse.preparationMethods || "",
          commonDishes: culinaryUse.commonDishes || "",
          cuisines: culinaryUse.cuisines || [],
          harvestingSeason: culinaryUse.harvestingSeason || "",
          nutritionalInfo: culinaryUse.nutritionalInfo || "",
          substitutions: culinaryUse.substitutions || "",
          pairsWith: culinaryUse.pairsWith || [],
          storageMethod: culinaryUse.storageMethod || "",
          preservationMethods: culinaryUse.preservationMethods || "",
          specialConsiderations: culinaryUse.specialConsiderations || "",
          notes: culinaryUse.notes || ""
        }}
        actionUrl={`/admin/plants/culinary/edit/${plant.id}`}
        error={error}
      />
    </PlantAdminLayout>
  );
}
