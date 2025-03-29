import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { db } from "../../../../utils/db.ts";
import { cropRotations, gardenBeds } from "../../../../utils/schema.ts";
import CropRotationForm from "../../../../islands/CropRotationForm.tsx";

interface GardenBed {
  bedId: number;
  bedCode: string;
}

interface NewCropRotationPageData {
  beds: GardenBed[];
}

export const handler: Handlers<NewCropRotationPageData> = {
  async GET(_, ctx) {
    const bedsList = await db.select({
      bedId: gardenBeds.bedId,
      bedCode: gardenBeds.bedCode,
    })
    .from(gardenBeds)
    .orderBy(gardenBeds.bedCode);
    
    return ctx.render({ beds: bedsList });
  },
  
  async POST(req, _ctx) {
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
      
      // Prepare data for insertion
      const now = new Date();
      const newRotation = {
        bedId: data.bedId,
        season: data.season || null,
        year: data.year,
        plantFamilies: data.plantFamilies || [],
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now,
      };
      
      // Insert the new crop rotation
      const result = await db.insert(cropRotations).values(newRotation).returning();
      
      if (result.length === 0) {
        return new Response("Failed to create crop rotation", { status: 500 });
      }
      
      // Return the newly created rotation
      return new Response(JSON.stringify(result[0]), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating crop rotation:", error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};

export default function NewCropRotationPage({ data }: PageProps<NewCropRotationPageData>) {
  const { beds } = data;
  
  return (
    <AdminLayout title="Add Crop Rotation" currentPath="/admin/garden/crop-rotations">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Crop Rotation</h1>
        <Button href="/admin/garden/crop-rotations" color="gray">Cancel</Button>
      </div>
      
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <CropRotationForm
            beds={beds}
            onSubmit={async (formData) => {
              try {
                const response = await fetch("/admin/garden/crop-rotations/new", {
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
