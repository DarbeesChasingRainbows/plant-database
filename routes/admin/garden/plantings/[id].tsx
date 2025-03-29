import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../../../components/AdminLayout.tsx";
import { db } from "../../../../utils/db.ts";
import { plants, plantings, plots, gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import { Button } from "../../../../components/Button.tsx";

interface PlantingDetailData {
  planting: typeof plantings.$inferSelect & {
    plant: typeof plants.$inferSelect;
    plot: typeof plots.$inferSelect;
    bed: typeof gardenBeds.$inferSelect;
  };
  error?: string;
}

export const handler: Handlers<PlantingDetailData> = {
  async GET(_, ctx) {
    try {
      const id = ctx.params.id;
      
      // Get the planting with related data
      const planting = await db
        .select({
          ...plantings,
          plant: plants,
          plot: plots,
          bed: gardenBeds,
        })
        .from(plantings)
        .where(eq(plantings.plantingId, parseInt(id)))
        .leftJoin(plants, eq(plantings.plantId, plants.id))
        .leftJoin(plots, eq(plantings.plotId, plots.plotId))
        .leftJoin(gardenBeds, eq(plantings.bedId, gardenBeds.bedId))
        .limit(1);
      
      if (planting.length === 0) {
        return ctx.render({
          planting: null,
          error: "Planting not found"
        });
      }
      
      return ctx.render({
        planting: planting[0]
      });
    } catch (error) {
      console.error("Error fetching planting details:", error);
      return ctx.render({
        planting: null,
        error: error.message
      });
    }
  }
};

export default function PlantingDetail({ data }: PageProps<PlantingDetailData>) {
  const { planting, error } = data;
  
  if (error || !planting) {
    return (
      <AdminLayout active="garden">
        <div class="container mx-auto px-4 py-8">
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error || "Planting not found"}</p>
            <p class="mt-2">
              <a href="/admin/garden/plantings" class="text-red-700 underline">
                Return to plantings list
              </a>
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this planting record? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/garden/plantings/${planting.plantingId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const result = await response.json();
        alert(result.error || "Failed to delete planting");
        return;
      }
      
      // Redirect to plantings list on success
      window.location.href = "/admin/garden/plantings";
    } catch (error) {
      console.error("Error deleting planting:", error);
      alert("An error occurred while deleting the planting");
    }
  };
  
  return (
    <AdminLayout active="garden">
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Planting Details</h1>
          <div class="space-x-2">
            <Button href={`/admin/garden/plantings/edit/${planting.plantingId}`}>
              Edit
            </Button>
            <Button onClick={handleDelete} class="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-xl font-semibold mb-4">Plant Information</h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600 font-medium">Plant:</span>
                    <span class="ml-2">{planting.plant?.botanicalName} ({planting.plant?.commonName})</span>
                  </div>
                  <div>
                    <span class="text-gray-600 font-medium">Family:</span>
                    <span class="ml-2">{planting.plant?.family || "N/A"}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 font-medium">Lifecycle:</span>
                    <span class="ml-2">{planting.plant?.lifecycle || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-xl font-semibold mb-4">Location</h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600 font-medium">Plot:</span>
                    <span class="ml-2">{planting.plot?.plotCode} - {planting.plot?.plotName}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 font-medium">Garden Bed:</span>
                    <span class="ml-2">{planting.bed?.bedName} ({planting.bed?.bedCode})</span>
                  </div>
                  <div>
                    <span class="text-gray-600 font-medium">Soil Type:</span>
                    <span class="ml-2">{planting.bed?.soilType || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-8">
              <h2 class="text-xl font-semibold mb-4">Planting Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span class="text-gray-600 font-medium">Planting Date:</span>
                  <span class="ml-2">{new Date(planting.plantingDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="text-gray-600 font-medium">Planting Method:</span>
                  <span class="ml-2">{planting.plantingMethod || "N/A"}</span>
                </div>
                <div>
                  <span class="text-gray-600 font-medium">Quantity Planted:</span>
                  <span class="ml-2">{planting.quantityPlanted || "N/A"}</span>
                </div>
                <div>
                  <span class="text-gray-600 font-medium">Spacing (cm):</span>
                  <span class="ml-2">{planting.spacingCm || "N/A"}</span>
                </div>
                <div>
                  <span class="text-gray-600 font-medium">Planting Depth (cm):</span>
                  <span class="ml-2">{planting.depthCm || "N/A"}</span>
                </div>
                <div>
                  <span class="text-gray-600 font-medium">Area (sq m):</span>
                  <span class="ml-2">{planting.areaSqm || "N/A"}</span>
                </div>
              </div>
            </div>
            
            {planting.notes && (
              <div class="mt-8">
                <h2 class="text-xl font-semibold mb-2">Notes</h2>
                <div class="bg-gray-50 p-4 rounded">
                  <p class="whitespace-pre-line">{planting.notes}</p>
                </div>
              </div>
            )}
            
            <div class="mt-8 text-sm text-gray-500">
              <div>Created: {new Date(planting.createdAt).toLocaleString()}</div>
              <div>Last Updated: {new Date(planting.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <a href="/admin/garden/plantings" class="text-indigo-600 hover:text-indigo-900">
            ← Back to Plantings List
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
