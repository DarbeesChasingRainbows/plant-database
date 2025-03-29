import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../../../../components/AdminLayout.tsx";
import { db } from "../../../../../utils/db.ts";
import { plants, plantings, plots, gardenBeds } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import PlantingForm from "../../../../../islands/PlantingForm.tsx";

interface EditPlantingData {
  planting: typeof plantings.$inferSelect;
  plants: typeof plants.$inferSelect[];
  plots: typeof plots.$inferSelect[];
  beds: typeof gardenBeds.$inferSelect[];
  error?: string;
}

export const handler: Handlers<EditPlantingData> = {
  async GET(_, ctx) {
    try {
      const id = ctx.params.id;
      
      // Get the planting
      const planting = await db
        .select()
        .from(plantings)
        .where(eq(plantings.plantingId, parseInt(id)))
        .limit(1);
      
      if (planting.length === 0) {
        return ctx.render({
          planting: null,
          plants: [],
          plots: [],
          beds: [],
          error: "Planting not found"
        });
      }
      
      // Get plants, plots, and beds
      const [plantsList, plotsList, bedsList] = await Promise.all([
        db.select().from(plants).orderBy(plants.botanicalName),
        db.select().from(plots).orderBy(plots.plotCode),
        db.select().from(gardenBeds).orderBy(gardenBeds.bedName)
      ]);
      
      return ctx.render({
        planting: planting[0],
        plants: plantsList,
        plots: plotsList,
        beds: bedsList
      });
    } catch (error) {
      console.error("Error fetching data for editing planting:", error);
      return ctx.render({
        planting: null,
        plants: [],
        plots: [],
        beds: [],
        error: error.message
      });
    }
  }
};

export default function EditPlanting({ data }: PageProps<EditPlantingData>) {
  const { planting, plants, plots, beds, error } = data;
  
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
  
  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/garden/plantings/${planting.plantingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(result.error || "Failed to update planting");
        return;
      }
      
      // Redirect to plantings list on success
      window.location.href = "/admin/garden/plantings";
    } catch (error) {
      console.error("Error updating planting:", error);
      alert("An error occurred while updating the planting");
    }
  };
  
  const handleCancel = () => {
    window.location.href = "/admin/garden/plantings";
  };
  
  return (
    <AdminLayout active="garden">
      <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">Edit Planting</h1>
          <p class="text-gray-600">
            Update the details for this planting record.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <PlantingForm
            planting={planting}
            plants={plants}
            plots={plots}
            beds={beds}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
