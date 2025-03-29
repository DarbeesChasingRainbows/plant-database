import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import PlotForm from "../../../../islands/PlotForm.tsx";

interface NewPlotPageData {
  error?: string;
  suggestedPlotCode?: string;
}

export const handler: Handlers<NewPlotPageData> = {
  async GET(_, ctx) {
    try {
      // Get the next available plot code
      const response = await fetch(`${new URL(_.url).origin}/api/garden/plots/next-code`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        return ctx.render({ error: "Failed to generate plot code" });
      }
      
      const { nextPlotCode } = await response.json();
      return ctx.render({ suggestedPlotCode: nextPlotCode });
    } catch (error) {
      console.error("Error generating plot code:", error);
      return ctx.render({});
    }
  }
};

export default function NewPlotPage({ data }: PageProps<NewPlotPageData>) {
  const { error, suggestedPlotCode } = data;
  
  return (
    <AdminLayout active="garden">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Create New Garden Plot</h1>
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
            onSubmit={async (data) => {
              try {
                const response = await fetch('/api/garden/plots', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                  alert(result.error || 'Failed to create plot');
                  return;
                }
                
                // Redirect to the plots list page on success
                globalThis.location.href = '/admin/garden/plots';
              } catch (error) {
                console.error('Error creating plot:', error);
                alert('An error occurred while creating the plot');
              }
            }}
            onCancel={() => globalThis.location.href = '/admin/garden/plots'}
            suggestedPlotCode={suggestedPlotCode}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
