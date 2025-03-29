import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../../../components/AdminLayout.tsx";
import { db } from "../../../../utils/db.ts";
import { plants, plots, gardenBeds } from "../../../../utils/schema.ts";
import PlantingForm from "../../../../islands/PlantingForm.tsx";

interface NewPlantingData {
  plants: typeof plants.$inferSelect[];
  plots: typeof plots.$inferSelect[];
  beds: typeof gardenBeds.$inferSelect[];
}

export const handler: Handlers<NewPlantingData> = {
  async GET(_, ctx) {
    try {
      const [plantsList, plotsList, bedsList] = await Promise.all([
        db.select().from(plants).orderBy(plants.botanicalName),
        db.select().from(plots).orderBy(plots.plotCode),
        db.select().from(gardenBeds).orderBy(gardenBeds.bedName)
      ]);

      return ctx.render({
        plants: plantsList,
        plots: plotsList,
        beds: bedsList
      });
    } catch (error) {
      console.error("Error fetching data for new planting:", error);
      return ctx.render({
        plants: [],
        plots: [],
        beds: []
      });
    }
  }
};

export default function NewPlanting({ data }: PageProps<NewPlantingData>) {
  const { plants, plots, beds } = data;

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/garden/plantings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to create planting");
        return;
      }

      // Redirect to plantings list on success
      window.location.href = "/admin/garden/plantings";
    } catch (error) {
      console.error("Error creating planting:", error);
      alert("An error occurred while creating the planting");
    }
  };

  const handleCancel = () => {
    window.location.href = "/admin/garden/plantings";
  };

  return (
    <AdminLayout active="garden">
      <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">Add New Planting</h1>
          <p class="text-gray-600">
            Create a new planting record to track what's growing in your garden beds.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <PlantingForm
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
