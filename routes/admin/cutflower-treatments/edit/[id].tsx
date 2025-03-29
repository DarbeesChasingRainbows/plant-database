import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { db } from "../../../../utils/db.ts";
import { cutFlowerTreatments, plants } from "../../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import TreatmentForm from "../../../../islands/TreatmentForm.tsx";

interface EditTreatmentData {
  treatment: {
    treatmentId: number;
    plantId: number;
    treatmentType: string | null;
    treatmentName: string | null;
    chemicalComposition: string | null;
    concentration: string | null;
    applicationMethod: string | null;
    duration: string | null;
    effectiveness: string | null;
    precautions: string | null;
    notes: string | null;
  } | null;
  plants: { id: number; name: string }[];
  formError?: string;
}

export const handler: Handlers<EditTreatmentData> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;
    const treatmentId = parseInt(id);

    if (isNaN(treatmentId)) {
      return new Response("Invalid treatment ID", { status: 400 });
    }

    try {
      // Fetch the treatment
      const treatmentResult = await db
        .select()
        .from(cutFlowerTreatments)
        .where(eq(cutFlowerTreatments.treatmentId, treatmentId))
        .limit(1);

      if (treatmentResult.length === 0) {
        return ctx.render({ treatment: null, plants: [] });
      }

      // Fetch all plants for the dropdown
      const plantsList = await db
        .select({
          id: plants.id,
          name: plants.botanicalName,
        })
        .from(plants)
        .orderBy(plants.botanicalName);

      return ctx.render({
        treatment: treatmentResult[0],
        plants: plantsList,
      });
    } catch (error) {
      console.error("Error fetching treatment data:", error);
      return ctx.render({
        treatment: null,
        plants: [],
        formError: "Failed to load treatment data",
      });
    }
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const treatmentId = parseInt(id);

    if (isNaN(treatmentId)) {
      return new Response("Invalid treatment ID", { status: 400 });
    }

    const formData = await req.formData();
    const plantId = parseInt(formData.get("plantId")?.toString() || "");

    try {
      await db
        .update(cutFlowerTreatments)
        .set({
          plantId: plantId,
          treatmentType: formData.get("treatmentType")?.toString() || null,
          treatmentName: formData.get("treatmentName")?.toString() || null,
          chemicalComposition: formData.get("chemicalComposition")?.toString() || null,
          concentration: formData.get("concentration")?.toString() || null,
          applicationMethod: formData.get("applicationMethod")?.toString() || null,
          duration: formData.get("duration")?.toString() || null,
          effectiveness: formData.get("effectiveness")?.toString() || null,
          precautions: formData.get("precautions")?.toString() || null,
          notes: formData.get("notes")?.toString() || null,
          updatedAt: new Date(),
        })
        .where(eq(cutFlowerTreatments.treatmentId, treatmentId));

      // Redirect to the detail page after successful update
      return new Response("", {
        status: 303,
        headers: {
          Location: `/admin/cutflower-treatments/${treatmentId}`,
        },
      });
    } catch (error) {
      console.error("Error updating cut flower treatment:", error);

      // Re-fetch treatment and plants data for the form
      const treatmentResult = await db
        .select()
        .from(cutFlowerTreatments)
        .where(eq(cutFlowerTreatments.treatmentId, treatmentId))
        .limit(1);

      const plantsList = await db
        .select({
          id: plants.id,
          name: plants.botanicalName,
        })
        .from(plants)
        .orderBy(plants.botanicalName);

      return ctx.render({
        treatment: treatmentResult[0] || null,
        plants: plantsList,
        formError: "Failed to update treatment. Please try again.",
      });
    }
  },
};

export default function EditTreatment({ data }: PageProps<EditTreatmentData>) {
  const { treatment, plants, formError } = data;

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
        <title>Edit {treatment.treatmentName || "Treatment"} | Plant Database</title>
      </Head>
      <AdminLayout>
        <div class="px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl">
            <div class="md:flex md:items-center md:justify-between mb-4">
              <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Edit Cut Flower Treatment
                </h2>
              </div>
              <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <a
                  href={`/admin/cutflower-treatments/${treatment.treatmentId}`}
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </a>
              </div>
            </div>

            {formError && (
              <div class="rounded-md bg-red-50 p-4 mb-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{formError}</h3>
                  </div>
                </div>
              </div>
            )}

            <div class="overflow-hidden bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <TreatmentForm
                  plants={plants}
                  initialValues={{
                    treatmentId: treatment.treatmentId,
                    plantId: treatment.plantId,
                    treatmentType: treatment.treatmentType || "",
                    treatmentName: treatment.treatmentName || "",
                    chemicalComposition: treatment.chemicalComposition || "",
                    concentration: treatment.concentration || "",
                    applicationMethod: treatment.applicationMethod || "",
                    duration: treatment.duration || "",
                    effectiveness: treatment.effectiveness || "",
                    precautions: treatment.precautions || "",
                    notes: treatment.notes || "",
                  }}
                  isEditing
                />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
