// routes/admin/plants/[id]/recipes/index.tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import { db } from "../../../../../utils/client.ts";
import PlantAdminLayout from "../../../../../components/PlantAdminLayout.tsx";
import { Plant } from "../../../../../types/index.ts";
import { plants } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

// Mock recipe interface until the actual table is created
interface Recipe {
  recipeId: number;
  recipeName: string;
  ingredients: string;
  instructions: string;
  preparationTime?: number;
  difficultyLevel?: string;
  yield?: string;
  notes?: string;
}

interface RecipesPageData {
  plant: Plant;
  recipes: Recipe[];
}

export const handler: Handlers<RecipesPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    
    // Validate that id is a valid number
    const plantId = parseInt(id);
    if (isNaN(plantId)) {
      return new Response("Invalid plant ID", { status: 400 });
    }

    // Fetch the plant by ID
    const plant = await db.select().from(plants).where(
      eq(plants.id, plantId),
    ).execute();

    if (plant.length === 0) {
      return ctx.render(undefined);
    }

    // Map the database result to match the Plant interface
    const plantData: Plant = {
      id: plant[0].id,
      common_name: plant[0].commonName,
      botanical_name: plant[0].botanicalName,
      family: plant[0].family,
      genus: plant[0].genus,
      species: plant[0].species,
      description: plant[0].description,
      taxonomy: null, // Add default value if not in the database
      is_medicinal: Boolean(plant[0].isMedicinal), // Convert to boolean
      is_food_crop: Boolean(plant[0].isFoodCrop), // Convert to boolean
      created_at: plant[0].createdAt,
      updated_at: plant[0].updatedAt
    };

    // For now, return an empty recipes array
    // This will be replaced with actual database queries once the table is created
    const recipes: Recipe[] = [];

    return ctx.render({
      plant: plantData,
      recipes: recipes,
    });
  },
};

export default function PlantRecipes({ data }: PageProps<RecipesPageData>) {
  if (!data?.plant) {
    return <div>Plant not found</div>;
  }

  return (
    <PlantAdminLayout 
      plantId={data.plant.id} 
      plantName={data.plant.common_name} 
      activeTab="recipes"
    >
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            Recipes - {data.plant.common_name}
          </h1>
          <a
            href={`/admin/plants/${data.plant.id}/recipes/add`}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Recipe
          </a>
        </div>

        {!data.plant.is_food_crop && (
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700">
                  This plant is not marked as a food crop. <a href={`/admin/plants/edit/${data.plant.id}`} class="font-medium underline text-yellow-700 hover:text-yellow-600">Edit plant details</a> to mark it as a food crop.
                </p>
              </div>
            </div>
          </div>
        )}

        {data.recipes.length === 0 ? (
          <div class="bg-white shadow overflow-hidden rounded-md p-6 text-center">
            <p class="text-gray-500">No recipes have been added for this plant yet.</p>
            <a
              href={`/admin/plants/${data.plant.id}/recipes/add`}
              class="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add First Recipe
            </a>
          </div>
        ) : (
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.recipes.map((recipe) => (
              <div key={recipe.recipeId} class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
                    {recipe.recipeName}
                  </h3>
                  
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {recipe.preparationTime ? `${recipe.preparationTime} minutes` : 'Time not specified'}
                  </div>
                  
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {recipe.yield || 'Yield not specified'}
                  </div>
                  
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg>
                    {recipe.difficultyLevel || 'Difficulty not specified'}
                  </div>
                  
                  <div class="mt-4">
                    <p class="text-sm text-gray-500 line-clamp-3">
                      {recipe.instructions.substring(0, 150)}
                      {recipe.instructions.length > 150 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-4 sm:px-6">
                  <div class="flex justify-between">
                    <a
                      href={`/admin/plants/${data.plant.id}/recipes/${recipe.recipeId}`}
                      class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                    </a>
                    <div>
                      <a
                        href={`/admin/plants/${data.plant.id}/recipes/edit/${recipe.recipeId}`}
                        class="text-sm font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                      >
                        Edit
                      </a>
                      <a
                        href={`/admin/plants/${data.plant.id}/recipes/delete/${recipe.recipeId}`}
                        class="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlantAdminLayout>
  );
}
