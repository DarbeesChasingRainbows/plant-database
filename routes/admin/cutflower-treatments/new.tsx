import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { db } from "../../../utils/db.ts";
import { cutFlowerTreatments, plants, type NewCutFlowerTreatment } from "../../../utils/schema.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import TreatmentForm from "../../../islands/TreatmentForm.tsx";

interface NewTreatmentData {
  plants: { id: number; name: string }[];
  formError?: string;
}

export const handler: Handlers<NewTreatmentData> = {
  async GET(_req, ctx) {
    try {
      const plantsList = await db
        .select({
          id: plants.id,
          name: plants.botanicalName,
        })
        .from(plants)
        .orderBy(plants.botanicalName);

      return ctx.render({ plants: plantsList });
    } catch (error) {
      console.error("Error fetching plants:", error);
      return ctx.render({ plants: [], formError: "Failed to load plants" });
    }
  },

  async POST(req, ctx) {
    const formData = await req.formData();
    const plantId = parseInt(formData.get("plantId")?.toString() || "");
    
    try {
      const newTreatment: NewCutFlowerTreatment = {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.insert(cutFlowerTreatments).values(newTreatment).returning();
      const treatmentId = result[0].treatmentId;

      // Redirect to the detail page of the newly created treatment
      return new Response("", {
        status: 303,
        headers: {
          Location: `/admin/cutflower-treatments/${treatmentId}`,
        },
      });
    } catch (error) {
      console.error("Error creating cut flower treatment:", error);
      
      // Re-fetch plants for the form
      const plantsList = await db
        .select({
          id: plants.id,
          name: plants.botanicalName,
        })
        .from(plants)
        .orderBy(plants.botanicalName);

      return ctx.render({
        plants: plantsList,
        formError: "Failed to create treatment. Please try again.",
      });
    }
  },
};

export default function NewTreatment({ data }: PageProps<NewTreatmentData>) {
  const { plants, formError } = data;

  return (
    <>
      <Head>
        <title>New Cut Flower Treatment | Plant Database</title>
      </Head>
      <AdminLayout>
        <div class="px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl">
            <div class="md:flex md:items-center md:justify-between mb-4">
              <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Add New Cut Flower Treatment
                </h2>
              </div>
              <div class="mt-4 flex md:mt-0 md:ml-4">
                <a
                  href="/admin/cutflower-treatments"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Back to Treatments
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
                <TreatmentForm plants={plants} />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
