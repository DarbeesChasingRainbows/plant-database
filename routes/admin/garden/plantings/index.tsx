import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../../../components/AdminLayout.tsx";
import { db } from "../../../../utils/db.ts";
import { plants, plantings, plots, gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import { Button } from "../../../../components/Button.tsx";

interface PlantingListData {
  plantings: Array<{
    plantingId: number;
    plantingDate: Date;
    plantName: string;
    plotName: string;
    bedName: string;
    quantityPlanted: number;
    notes: string | null;
  }>;
}

export const handler: Handlers<PlantingListData> = {
  async GET(_, ctx) {
    try {
      // Get all plantings with related data
      const plantingsList = await db
        .select({
          plantingId: plantings.plantingId,
          plantingDate: plantings.plantingDate,
          plantName: plants.botanicalName,
          plotName: plots.plotCode,
          bedName: gardenBeds.bedName,
          quantityPlanted: plantings.quantityPlanted,
          notes: plantings.notes,
        })
        .from(plantings)
        .leftJoin(plants, eq(plantings.plantId, plants.id))
        .leftJoin(plots, eq(plantings.plotId, plots.plotId))
        .leftJoin(gardenBeds, eq(plantings.plotId, gardenBeds.plotId))
        .orderBy(plantings.plantingDate);

      return ctx.render({ plantings: plantingsList });
    } catch (error) {
      console.error("Error fetching plantings:", error);
      return ctx.render({ plantings: [] });
    }
  }
};

export default function PlantingList({ data }: PageProps<PlantingListData>) {
  const { plantings } = data;

  return (
    <AdminLayout active="garden">
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Garden Plantings</h1>
          <Button href="/admin/garden/plantings/new">
            Add New Planting
          </Button>
        </div>

        {plantings.length === 0 ? (
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <p class="text-gray-500">No plantings found. Start by adding a new planting.</p>
          </div>
        ) : (
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plant
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {plantings.map((planting) => (
                  <tr key={planting.plantingId} class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(planting.plantingDate).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {planting.plantName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {planting.plotName} - {planting.bedName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {planting.quantityPlanted}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {planting.notes || "-"}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/garden/plantings/${planting.plantingId}`} class="text-green-600 hover:text-green-900 mr-4">
                        View
                      </a>
                      <a href={`/admin/garden/plantings/edit/${planting.plantingId}`} class="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
