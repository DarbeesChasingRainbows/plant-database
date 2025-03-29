import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { db } from "../../../../utils/db.ts";
import { plots, gardenBeds, Plot, GardenBed } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import DeletePlotButton from "../../../../islands/DeletePlotButton.tsx";

interface PlotDetailPageData {
  plot?: Plot;
  gardenBeds: GardenBed[];
  error?: string;
}

export const handler: Handlers<PlotDetailPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const plotId = parseInt(id);
    
    if (isNaN(plotId)) {
      return ctx.render({ gardenBeds: [], error: "Invalid plot ID" });
    }
    
    try {
      // Get the plot
      const plotResult = await db.select().from(plots).where(eq(plots.plotId, plotId)).limit(1);
      const plot = plotResult[0];
      
      if (!plot) {
        return ctx.render({ gardenBeds: [], error: "Plot not found" });
      }
      
      // Get garden beds associated with this plot
      const gardenBedsResult = await db.select().from(gardenBeds).where(eq(gardenBeds.plotId, plot.plotId));
      
      return ctx.render({ plot, gardenBeds: gardenBedsResult });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      return ctx.render({ gardenBeds: [], error: errorMessage });
    }
  },
  
  async DELETE(_req, ctx) {
    const { id } = ctx.params;
    const plotId = parseInt(id);
    
    if (isNaN(plotId)) {
      return new Response(JSON.stringify({ error: "Invalid plot ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    try {
      // Check if there are any garden beds associated with this plot
      const associatedBeds = await db.select().from(gardenBeds).where(eq(gardenBeds.plotId, plotId));
      
      if (associatedBeds.length > 0) {
        return new Response(JSON.stringify({ error: "Cannot delete plot with associated garden beds. Please remove the garden beds first." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Delete the plot
      await db.delete(plots).where(eq(plots.plotId, plotId));
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error('Error deleting plot:', error);
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

export default function PlotDetailPage({ data }: PageProps<PlotDetailPageData>) {
  const { plot, gardenBeds, error } = data;
  
  // Utility function to convert square meters to square feet
  const toSquareFeet = (sqm?: number | null) => {
    if (sqm === null || sqm === undefined) return 'Not specified';
    return `${Math.round(sqm * 10.764 * 100) / 100} sq ft`;
  };
  
  if (!plot && !error) {
    return (
      <AdminLayout title="Plot Details" currentPath="/admin/garden/plots">
        <div class="max-w-4xl mx-auto">
          <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>Loading plot data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Plot Details" currentPath="/admin/garden/plots">
        <div class="max-w-4xl mx-auto">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p class="text-red-500">{error}</p>
          </div>
          <div class="mt-4">
            <a href="/admin/garden/plots" class="text-indigo-600 hover:text-indigo-900">
              Back to Plots
            </a>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={`Plot: ${plot.plotCode}`} currentPath="/admin/garden/plots">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Plot: {plot.plotCode}</h1>
          <div class="flex space-x-4">
            <a href={`/admin/garden/plots/edit/${plot.plotId}`} class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Edit Plot
            </a>
          </div>
        </div>
        
        {error && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p class="text-red-500">{error}</p>
          </div>
        )}
        
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Plot Details</h3>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Plot Code</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{plot.plotCode}</dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Size</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {toSquareFeet(typeof plot.sizeSqm === 'number' ? plot.sizeSqm : undefined)}
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Orientation</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {plot.orientation || 'Not specified'}
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Sun Exposure</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {plot.sunExposure || 'Not specified'}
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Irrigation Type</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {plot.irrigationType || 'Not specified'}
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    plot.status === 'active' ? 'bg-green-100 text-green-800' :
                    plot.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plot.status}
                  </span>
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                  {plot.notes || 'No notes'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Garden Beds in this Plot</h3>
            <Button href={`/admin/garden/beds/new?plotId=${plot.plotId}`} size="sm">
              Add Garden Bed
            </Button>
          </div>
          <div class="border-t border-gray-200">
            {gardenBeds && gardenBeds.length > 0 ? (
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bed Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bed Code
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {gardenBeds.map((bed) => (
                    <tr key={bed.bedId}>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bed.bedName}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.bedCode}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {toSquareFeet(typeof bed.areaSqm === 'number' ? bed.areaSqm : undefined)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bed.status === 'active' ? 'bg-green-100 text-green-800' :
                          bed.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bed.status}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={`/admin/garden/beds/${bed.bedId}`} class="text-indigo-600 hover:text-indigo-900 mr-4">
                          View
                        </a>
                        <a href={`/admin/garden/beds/edit/${bed.bedId}`} class="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div class="px-6 py-4 text-center text-sm text-gray-500">
                No garden beds found in this plot. Click "Add Garden Bed" to create one.
              </div>
            )}
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 mt-6">
          <a href="/admin/garden/plots" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back to Plots
          </a>
          <a href={`/admin/garden/plots/edit/${plot.plotId}`} class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit Plot
          </a>
          <DeletePlotButton plotId={plot.plotId} />
        </div>
        
        <div class="mt-6">
          <a href="/admin/garden/plots" class="text-indigo-600 hover:text-indigo-900">
            &larr; Back to Plots
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
