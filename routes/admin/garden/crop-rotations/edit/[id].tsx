import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../../components/AdminLayout.tsx";
import { Button } from "../../../../../components/Button.tsx";
import { db } from "../../../../../utils/db.ts";
import { cropRotations, gardenBeds } from "../../../../../utils/schema.ts";
import CropRotationForm from "../../../../../islands/CropRotationForm.tsx";
import { eq } from "drizzle-orm";

interface GardenBed {
  bedId: number;
  bedCode: string;
}

interface CropRotation {
  rotationId: number;
  bedId: number;
  season: string;
  year: number;
  plantFamilies: string[];
  notes: string;
}

interface EditCropRotationPageData {
  rotation: CropRotation | null;
  beds: GardenBed[];
  error?: string;
}

export const handler: Handlers<EditCropRotationPageData> = {
  async GET(_, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return ctx.render({ rotation: null, beds: [], error: "Invalid rotation ID" });
    }
    
    // Get the crop rotation
    const rotationResult = await db.select().from(cropRotations).where(eq(cropRotations.rotationId, id)).limit(1);
    
    if (rotationResult.length === 0) {
      return ctx.render({ rotation: null, beds: [], error: "Crop rotation not found" });
    }
    
    // Get all garden beds
    const bedsList = await db.select({
      bedId: gardenBeds.bedId,
      bedCode: gardenBeds.bedCode,
    })
    .from(gardenBeds)
    .orderBy(gardenBeds.bedCode);
    
    return ctx.render({ rotation: rotationResult[0], beds: bedsList });
  },
  
  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return new Response("Invalid rotation ID", { status: 400 });
    }
    
    const formData = await req.formData();
    const jsonData = formData.get("data");
    
    if (!jsonData) {
      return new Response("No data provided", { status: 400 });
    }
    
    try {
      const data = JSON.parse(jsonData.toString());
      
      // Validate required fields
      if (!data.bedId || !data.year) {
        return new Response("Missing required fields", { status: 400 });
      }
      
      // Prepare data for update
      const updateData = {
        bedId: data.bedId,
        season: data.season || null,
        year: data.year,
        plantFamilies: data.plantFamilies || [],
        notes: data.notes || null,
        updatedAt: new Date(),
      };
      
      // Update the crop rotation
      const result = await db.update(cropRotations)
        .set(updateData)
        .where(eq(cropRotations.rotationId, id))
        .returning();
      
      if (result.length === 0) {
        return new Response("Failed to update crop rotation", { status: 500 });
      }
      
      // Return the updated rotation
      return new Response(JSON.stringify(result[0]), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating crop rotation:", error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};

export default function EditCropRotationPage({ data }: PageProps<EditCropRotationPageData>) {
  const { rotation, beds, error } = data;
  
  if (error) {
    return (
      <AdminLayout title="Error" currentPath="/admin/garden/crop-rotations">
        <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Button href="/admin/garden/crop-rotations">Back to Crop Rotations</Button>
      </AdminLayout>
    );
  }
  
  if (!rotation) {
    return (
      <AdminLayout title="Loading..." currentPath="/admin/garden/crop-rotations">
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={`Edit Crop Rotation: ${rotation.year} ${rotation.season || ""}`} currentPath="/admin/garden/crop-rotations">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Crop Rotation</h1>
        <Button href={`/admin/garden/crop-rotations/${rotation.rotationId}`} color="gray">Cancel</Button>
      </div>
      
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <CropRotationForm
            rotation={rotation}
            beds={beds}
            onSubmit={async (formData) => {
              try {
                const response = await fetch(`/admin/garden/crop-rotations/edit/${rotation.rotationId}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    data: JSON.stringify(formData),
                  }),
                });
                
                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(errorText);
                }
                
                const result = await response.json();
                globalThis.location.href = `/admin/garden/crop-rotations/${result.rotationId}`;
              } catch (error) {
                console.error("Error submitting form:", error);
                alert(`Error: ${error.message}`);
              }
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
