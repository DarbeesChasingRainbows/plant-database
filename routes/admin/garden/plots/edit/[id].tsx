import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../../components/AdminLayout.tsx";
import PlotForm from "../../../../../islands/PlotForm.tsx";
import { db } from "../../../../../utils/db.ts";
import { plots, Plot } from "../../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface EditPlotPageData {
  plot?: Plot;
  error?: string;
}

export const handler: Handlers<EditPlotPageData> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const plotId = parseInt(id);
    
    if (isNaN(plotId)) {
      return ctx.render({ error: "Invalid plot ID" });
    }
    
    try {
      const plotResult = await db.select().from(plots).where(eq(plots.plotId, plotId)).limit(1);
      
      if (plotResult.length === 0) {
        return ctx.render({ error: "Plot not found" });
      }
      
      return ctx.render({ plot: plotResult[0] });
    } catch (error) {
      console.error('Error fetching plot:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return ctx.render({ error: errorMessage });
    }
  }
};

export default function EditPlotPage({ data }: PageProps<EditPlotPageData>) {
  const { plot, error } = data;
  
  return (
    <AdminLayout active="garden">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            Edit Garden Plot: {plot?.plotCode}
          </h1>
          <a href="/admin/garden/plots" class="text-indigo-600 hover:text-indigo-900">
            &larr; Back to Plots
          </a>
        </div>
        
        {error && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <PlotForm
            plot={plot}
            onSubmit={async (data) => {
              try {
                const response = await fetch(`/api/garden/plots/${plot?.plotId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                  alert(result.error || 'Failed to update plot');
                  return;
                }
                
                // Redirect to the plots list page on success
                globalThis.location.href = '/admin/garden/plots';
              } catch (error) {
                console.error('Error updating plot:', error);
                alert('An error occurred while updating the plot');
              }
            }}
            onCancel={() => {
              globalThis.location.href = '/admin/garden/plots';
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
