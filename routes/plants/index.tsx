import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../utils/client.ts";
import { plants } from "../../utils/schema.ts";
import { count } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

interface PlantStats {
  totalPlants: number;
  medicinalPlants: number;
  foodCrops: number;
  recentlyAdded: {
    id: number;
    commonName: string;
    botanicalName: string;
  }[];
}

interface Data {
  stats: PlantStats;
}

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    try {
      // Get total plant count
      const totalResult = await db.select({ count: count() }).from(plants);
      const totalPlants = Number(totalResult[0]?.count) || 0;

      // Get medicinal plants count - using a direct query since the schema doesn't have isMedicinal field
      const medicinalResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM plants 
        WHERE EXISTS (
          SELECT 1 FROM medicinal_properties 
          WHERE medicinal_properties.plant_id = plants.id
        )
      `);
      const medicinalPlants = Number(medicinalResult.rows[0]?.count) || 0;

      // Get food crops count - using a direct query since the schema doesn't have isFoodCrop field
      const foodResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM plants 
        WHERE EXISTS (
          SELECT 1 FROM food_uses 
          WHERE food_uses.plant_id = plants.id
        )
      `);
      const foodCrops = Number(foodResult.rows[0]?.count) || 0;

      // Get recently added plants
      const recentlyAdded = await db.select({
        id: plants.id,
        commonName: plants.commonName,
        botanicalName: plants.botanicalName,
      })
        .from(plants)
        .orderBy(sql`${plants.createdAt} DESC`)
        .limit(5);

      return ctx.render({
        stats: {
          totalPlants,
          medicinalPlants,
          foodCrops,
          recentlyAdded,
        },
      });
    } catch (error) {
      console.error("Error fetching plant dashboard data:", error);
      return ctx.render({
        stats: {
          totalPlants: 0,
          medicinalPlants: 0,
          foodCrops: 0,
          recentlyAdded: [],
        },
      });
    }
  },
};

export default function PlantDashboard({ data }: PageProps<Data>) {
  const { stats } = data;

  return (
    <div class="p-4 mx-auto max-w-screen-lg">
      <h1 class="text-3xl font-bold mb-6 text-center">Plant Database Dashboard</h1>
      
      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h2 class="text-xl font-semibold text-gray-700">Total Plants</h2>
          <p class="text-4xl font-bold text-green-600 mt-2">{stats.totalPlants}</p>
          <a href="/plants/all" class="text-green-600 hover:text-green-800 text-sm mt-4 inline-block">
            View all plants →
          </a>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 class="text-xl font-semibold text-gray-700">Medicinal Plants</h2>
          <p class="text-4xl font-bold text-blue-600 mt-2">{stats.medicinalPlants}</p>
          <a href="/plants/medicinal" class="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block">
            View medicinal plants →
          </a>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <h2 class="text-xl font-semibold text-gray-700">Food Crops</h2>
          <p class="text-4xl font-bold text-amber-600 mt-2">{stats.foodCrops}</p>
          <a href="/plants/food" class="text-amber-600 hover:text-amber-800 text-sm mt-4 inline-block">
            View food crops →
          </a>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/plants/search" class="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="font-medium">Search Plants</span>
          </a>
          
          <a href="/admin/plants/new" class="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="font-medium">Add New Plant</span>
          </a>
          
          <a href="/garden/plots" class="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span class="font-medium">Garden Plots</span>
          </a>
          
          <a href="/admin" class="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium">Admin Panel</span>
          </a>
        </div>
      </div>
      
      {/* Recently Added Plants */}
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Recently Added Plants</h2>
        {stats.recentlyAdded.length > 0 ? (
          <div class="divide-y">
            {stats.recentlyAdded.map((plant) => (
              <div key={plant.id} class="py-3 flex justify-between items-center">
                <div>
                  <h3 class="font-medium">{plant.commonName}</h3>
                  <p class="text-sm text-gray-500 italic">{plant.botanicalName}</p>
                </div>
                <a 
                  href={`/plants/${plant.id}`} 
                  class="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition-colors"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p class="text-gray-500 text-center py-4">No plants have been added recently.</p>
        )}
        
        <div class="mt-4 text-center">
          <a href="/plants/all" class="text-blue-600 hover:text-blue-800 inline-flex items-center">
            View all plants
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
