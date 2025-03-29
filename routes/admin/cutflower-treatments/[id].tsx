import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { db } from "../../../utils/db.ts";
import { cutFlowerTreatments, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import AdminLayout from "../../../components/AdminLayout.tsx";

interface TreatmentDetailData {
  treatment: {
    treatmentId: number;
    plantId: number;
    plantName: string | null;
    treatmentType: string | null;
    treatmentName: string | null;
    chemicalComposition: string | null;
    concentration: string | null;
    applicationMethod: string | null;
    duration: string | null;
    effectiveness: string | null;
    precautions: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  } | null;
}

export const handler: Handlers<TreatmentDetailData> = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    const treatmentId = parseInt(id);

    if (isNaN(treatmentId)) {
      return new Response("Invalid treatment ID", { status: 400 });
    }

    try {
      const treatmentWithPlant = await db
        .select({
          treatmentId: cutFlowerTreatments.treatmentId,
          plantId: cutFlowerTreatments.plantId,
          plantName: plants.botanicalName,
          treatmentType: cutFlowerTreatments.treatmentType,
          treatmentName: cutFlowerTreatments.treatmentName,
          chemicalComposition: cutFlowerTreatments.chemicalComposition,
          concentration: cutFlowerTreatments.concentration,
          applicationMethod: cutFlowerTreatments.applicationMethod,
          duration: cutFlowerTreatments.duration,
          effectiveness: cutFlowerTreatments.effectiveness,
          precautions: cutFlowerTreatments.precautions,
          notes: cutFlowerTreatments.notes,
          createdAt: cutFlowerTreatments.createdAt,
          updatedAt: cutFlowerTreatments.updatedAt,
        })
        .from(cutFlowerTreatments)
        .leftJoin(plants, eq(cutFlowerTreatments.plantId, plants.id))
        .where(eq(cutFlowerTreatments.treatmentId, treatmentId))
        .limit(1);

      return ctx.render({ treatment: treatmentWithPlant[0] || null });
    } catch (error) {
      console.error("Error fetching cut flower treatment:", error);
      return ctx.render({ treatment: null });
    }
  },
};

export default function TreatmentDetail({ data }: PageProps<TreatmentDetailData>) {
  const { treatment } = data;

  if (!treatment) {
    return (
      <>
        <Head>
          <title>Treatment Not Found | Plant Database</title>
        </Head>
        <AdminLayout>
          <div class="px-4 py-6 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
              <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    Treatment Not Found
                  </h3>
                  <div class="mt-2 max-w-xl text-sm text-gray-500">
                    <p>The requested cut flower treatment could not be found.</p>
                  </div>
                  <div class="mt-5">
                    <a
                      href="/admin/cutflower-treatments"
                      class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Back to Treatments
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{treatment.treatmentName || "Treatment Detail"} | Plant Database</title>
      </Head>
      <AdminLayout>
        <div class="px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-7xl">
            <div class="md:flex md:items-center md:justify-between mb-4">
              <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {treatment.treatmentName || "Unnamed Treatment"}
                </h2>
                <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    Plant: {treatment.plantName || "Unknown Plant"}
                  </div>
                  {treatment.treatmentType && (
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      Type: {treatment.treatmentType}
                    </div>
                  )}
                </div>
              </div>
              <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <a
                  href="/admin/cutflower-treatments"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Back
                </a>
                <a
                  href={`/admin/cutflower-treatments/edit/${treatment.treatmentId}`}
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit
                </a>
              </div>
            </div>

            <div class="overflow-hidden bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Treatment Name</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.treatmentName || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Treatment Type</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.treatmentType || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Chemical Composition</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.chemicalComposition || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Concentration</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.concentration || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Application Method</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.applicationMethod || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Duration</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.duration || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Effectiveness</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.effectiveness || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Precautions</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.precautions || "Not specified"}</dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Notes</dt>
                    <dd class="mt-1 text-sm text-gray-900">{treatment.notes || "No notes available"}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Created At</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {treatment.createdAt ? new Date(treatment.createdAt).toLocaleString() : "Unknown"}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {treatment.updatedAt ? new Date(treatment.updatedAt).toLocaleString() : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
