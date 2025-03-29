import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import GardenBedForm from "../../../../islands/GardenBedForm.tsx";
import { db } from "../../../../utils/db.ts";
import { gardenBeds, plots, Plot, NewGardenBed } from "../../../../utils/schema.ts";

interface NewGardenBedPageData {
  plots: Plot[];
  error?: string;
}

export const handler: Handlers<NewGardenBedPageData> = {
  async GET(_, ctx) {
    const plotsList = await db.select().from(plots);
    return ctx.render({ plots: plotsList });
  },
  
  async POST(req, ctx) {
    const form = await req.formData();
    const bedData: Partial<NewGardenBed> = {};
    
    // Process form data
    for (const [key, value] of form.entries()) {
      if (key === 'raisedBed') {
        bedData[key] = value === 'on';
      } else if (['plotId', 'lengthCm', 'widthCm', 'heightCm'].includes(key) && value) {
        bedData[key] = parseInt(value as string);
      } else if (['soilDepthCm', 'areaSqm'].includes(key) && value) {
        bedData[key] = parseFloat(value as string);
      } else if (value) {
        bedData[key] = value;
      }
    }
    
    // Calculate area if length and width are provided
    if (bedData.lengthCm && bedData.widthCm) {
      bedData.areaSqm = (bedData.lengthCm * bedData.widthCm) / 10000; // Convert cm² to m²
    }
    
    try {
      await db.insert(gardenBeds).values(bedData);
      return new Response('', {
        status: 303,
        headers: { Location: '/admin/garden/beds' }
      });
    } catch (error) {
      console.error('Error creating garden bed:', error);
      const plotsList = await db.select().from(plots);
      return ctx.render({ plots: plotsList, error: error.message });
    }
  }
};

export default function NewGardenBedPage({ data }: PageProps<NewGardenBedPageData>) {
  const { plots, error } = data;
  
  return (
    <AdminLayout title="New Garden Bed">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Create New Garden Bed</h1>
        
        {error && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <GardenBedForm
            plots={plots}
            onSubmit={(data) => {
              // Create a form and submit it
              const form = document.createElement('form');
              form.method = 'POST';
              form.style.display = 'none';
              
              for (const [key, value] of Object.entries(data)) {
                if (value !== undefined && value !== null) {
                  const input = document.createElement('input');
                  input.name = key;
                  input.value = value.toString();
                  form.appendChild(input);
                }
              }
              
              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            }}
            onCancel={() => globalThis.location.href = '/admin/garden/beds'}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
