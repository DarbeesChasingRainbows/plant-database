import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { db } from "../../../utils/db.ts";
import { cutFlowerCharacteristics, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface CutFlowersPageData {
  flowers: Array<{
    characteristicId: number;
    plantId: number;
    plantName: string | null;
    stemLengthMin: number | null;
    stemLengthMax: number | null;
    flowerForm: string | null;
    typicalVaseLifeDays: number | null;
  }>;
}

export const handler: Handlers<CutFlowersPageData> = {
  async GET(_, ctx) {
    try {
      // Use Drizzle ORM to fetch cut flower characteristics
      const flowers = await db.select({
        characteristicId: cutFlowerCharacteristics.characteristicId,
        plantId: cutFlowerCharacteristics.plantId,
        plantName: plants.botanicalName,
        stemLengthMin: cutFlowerCharacteristics.stemLengthMin,
        stemLengthMax: cutFlowerCharacteristics.stemLengthMax,
        flowerForm: cutFlowerCharacteristics.flowerForm,
        typicalVaseLifeDays: cutFlowerCharacteristics.typicalVaseLifeDays,
      })
      .from(cutFlowerCharacteristics)
      .leftJoin(plants, eq(cutFlowerCharacteristics.plantId, plants.id));
      
      return ctx.render({ flowers });
    } catch (error) {
      console.error("Error fetching cut flowers:", error);
      return ctx.render({ flowers: [] });
    }
  }
};

export default function CutFlowersPage({ data }: PageProps<CutFlowersPageData>) {
  const { flowers } = data;
  
  return (
    <AdminLayout title="Cut Flowers" currentPath="/admin/cutflowers">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Cut Flowers</h1>
        <Button href="/admin/cutflowers/new">Add Cut Flower</Button>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stem Length (cm)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flower Form
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vase Life (days)
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {flowers.map((flower) => (
              <tr key={flower.characteristicId}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {flower.plantName || "Unknown Plant"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flower.stemLengthMin && flower.stemLengthMax 
                    ? `${flower.stemLengthMin} - ${flower.stemLengthMax}`
                    : flower.stemLengthMin || flower.stemLengthMax || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flower.flowerForm || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flower.typicalVaseLifeDays || "Not specified"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/cutflowers/${flower.characteristicId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </a>
                  <a href={`/admin/cutflowers/edit/${flower.characteristicId}`} class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {flowers.length === 0 && (
              <tr>
                <td colSpan={5} class="px-6 py-4 text-center text-sm text-gray-500">
                  No cut flowers found. Add your first cut flower to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
