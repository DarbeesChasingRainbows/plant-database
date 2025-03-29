import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { db } from "../../../../utils/db.ts";
import { cropRotations, gardenBeds } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";

interface CropRotationDetail {
  rotationId: number;
  bedId: number;
  season: string | null;
  year: number;
  plantFamilies: string[] | null;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  bedCode: string | null;
}

interface CropRotationDetailPageData {
  rotation: CropRotationDetail | null;
  error?: string;
}

export const handler: Handlers<CropRotationDetailPageData> = {
  async GET(_, ctx) {
    const id = Number(ctx.params.id);
    
    if (isNaN(id)) {
      return ctx.render({ rotation: null, error: "Invalid rotation ID" });
    }
    
    const rotation = await db.select({
      rotationId: cropRotations.rotationId,
      bedId: cropRotations.bedId,
      season: cropRotations.season,
      year: cropRotations.year,
      plantFamilies: cropRotations.plantFamilies,
      notes: cropRotations.notes,
      createdAt: cropRotations.createdAt,
      updatedAt: cropRotations.updatedAt,
      bedCode: gardenBeds.bedCode,
    })
    .from(cropRotations)
    .leftJoin(gardenBeds, eq(cropRotations.bedId, gardenBeds.bedId))
    .where(eq(cropRotations.rotationId, id))
    .limit(1);
    
    if (rotation.length === 0) {
      return ctx.render({ rotation: null, error: "Crop rotation not found" });
    }
    
    return ctx.render({ rotation: rotation[0] });
  }
};

export default function CropRotationDetailPage({ data }: PageProps<CropRotationDetailPageData>) {
  const { rotation, error } = data;
  
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
  
  // Format the date
  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <AdminLayout title={`Crop Rotation: ${rotation.year} ${rotation.season || ""}`} currentPath="/admin/garden/crop-rotations">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Crop Rotation Details</h1>
        <div class="space-x-2">
          <Button href={`/admin/garden/crop-rotations/edit/${rotation.rotationId}`} color="indigo">Edit</Button>
          <Button href="/admin/garden/crop-rotations" color="gray">Back</Button>
        </div>
      </div>
      
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {rotation.year} {rotation.season || ""}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Garden Bed: {rotation.bedCode || `ID: ${rotation.bedId}`}
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Year</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{rotation.year}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Season</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{rotation.season || "Not specified"}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Garden Bed</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {rotation.bedCode || `Bed ID: ${rotation.bedId}`}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Plant Families</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {rotation.plantFamilies && rotation.plantFamilies.length > 0 ? (
                  <ul class="list-disc pl-5">
                    {rotation.plantFamilies.map((family, index) => (
                      <li key={index}>{family}</li>
                    ))}
                  </ul>
                ) : (
                  "None specified"
                )}
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Notes</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {rotation.notes || "No notes"}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Created</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(rotation.createdAt)}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(rotation.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}
