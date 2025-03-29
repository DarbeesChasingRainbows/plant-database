import { Handlers, PageProps } from "$fresh/server.ts";
import PlantListingLayout from "../../../components/PlantListingLayout.tsx";
import { count, sql } from "drizzle-orm";
import { plantRepository } from "../../../src/plant-management/index.ts";
import { db } from "../../../utils/client.ts";
import { plants } from "../../../utils/schema.ts";

interface PlantStats {
  totalPlants: number;
  recentlyAdded: {
    id: number;
    commonName: string;
    botanicalName: string;
    family: string | null;
    createdAt: Date;
  }[];
  byFamily: {
    family: string;
    count: number;
  }[];
}

interface Data {
  stats: PlantStats;
  success?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    try {
      const url = new URL(req.url);
      const success = url.searchParams.get("success");
      
      // Get all plants using the DDD repository
      const allPlants = await plantRepository.findAll();
      const totalPlants = allPlants.length;

      // Get recently added plants (still using Drizzle directly for this specific query)
      const recentlyAdded = await db.select({
        id: plants.id,
        commonName: plants.commonName,
        botanicalName: plants.botanicalName,
        family: plants.family,
        createdAt: plants.createdAt,
      })
        .from(plants)
        .orderBy(sql`${plants.createdAt} DESC`)
        .limit(6);

      // Get plants by family
      const byFamilyResult = await db.execute(sql`
        SELECT family, COUNT(*) as count 
        FROM plants 
        WHERE family IS NOT NULL 
        GROUP BY family 
        ORDER BY count DESC 
        LIMIT 5
      `);
      
      const byFamily = byFamilyResult.rows.map(row => ({
        family: row.family as string,
        count: Number(row.count)
      }));

      return ctx.render({
        stats: {
          totalPlants,
          recentlyAdded,
          byFamily,
        },
        success: success || undefined,
      });
    } catch (error) {
      console.error("Error fetching plant dashboard data:", error);
      return ctx.render({
        stats: {
          totalPlants: 0,
          recentlyAdded: [],
          byFamily: [],
        }
      });
    }
  },
};

export default function PlantsIndex(props: PageProps<Data>) {
  const { stats, success } = props.data;
  
  return (
    <PlantListingLayout title="Plant Management" activeSection="list">
      {success && (
        <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Plants Database</h1>
          <a
            href="/admin/plants/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Plant
          </a>
        </div>

        {/* Stats Overview */}
        <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Plants</dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">{stats.totalPlants}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <a href="/admin/plants/list" class="font-medium text-green-700 hover:text-green-900">View all plants</a>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Plant Categories</dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">{stats.byFamily.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <a href="/admin/plants/categories" class="font-medium text-blue-700 hover:text-blue-900">Manage categories</a>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Quick Actions</dt>
                    <dd>
                      <div class="text-sm font-medium text-gray-900">Add new entries</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3 flex justify-between">
              <div class="text-sm">
                <a href="/admin/plants/new" class="font-medium text-purple-700 hover:text-purple-900">New plant</a>
              </div>
              <div class="text-sm">
                <a href="/admin/actions/new" class="font-medium text-purple-700 hover:text-purple-900">New action</a>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Added Plants */}
        <div class="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Recently Added Plants</h3>
          </div>
          <ul class="divide-y divide-gray-200">
            {stats.recentlyAdded.map((plant) => (
              <li key={plant.id}>
                <a href={`/admin/plants/details/${plant.id}`} class="block hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">{plant.commonName}</p>
                          <p class="text-sm text-gray-500">{plant.botanicalName}</p>
                        </div>
                      </div>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {plant.family || "No family"}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                          </svg>
                          Added on {new Date(plant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                        View details
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Plants by Family */}
        {stats.byFamily.length > 0 && (
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Plants by Family</h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stats.byFamily.map((item) => (
                  <div key={item.family} class="bg-gray-50 overflow-hidden shadow-sm rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                      <div class="flex items-center">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{item.family}</p>
                          <p class="text-sm text-gray-500">{item.count} plants</p>
                        </div>
                        <div class="ml-5 flex-shrink-0">
                          <a 
                            href={`/admin/plants/list?family=${encodeURIComponent(item.family)}`}
                            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PlantListingLayout>
  );
}