import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { db } from "../../../utils/db.ts";
import { cutFlowerTreatments, plants } from "../../../utils/schema.ts";
import { eq } from "drizzle-orm";
import AdminLayout from "../../../components/AdminLayout.tsx";

interface TreatmentListData {
  treatments: {
    treatmentId: number;
    plantId: number;
    plantName: string | null;
    treatmentType: string | null;
    treatmentName: string | null;
    applicationMethod: string | null;
    effectiveness: string | null;
  }[];
}

export const handler: Handlers<TreatmentListData> = {
  async GET(req, ctx) {
    try {
      // Join with plants table to get plant names
      const treatmentsWithPlants = await db
        .select({
          treatmentId: cutFlowerTreatments.treatmentId,
          plantId: cutFlowerTreatments.plantId,
          plantName: plants.botanicalName,
          treatmentType: cutFlowerTreatments.treatmentType,
          treatmentName: cutFlowerTreatments.treatmentName,
          applicationMethod: cutFlowerTreatments.applicationMethod,
          effectiveness: cutFlowerTreatments.effectiveness,
        })
        .from(cutFlowerTreatments)
        .leftJoin(plants, eq(cutFlowerTreatments.plantId, plants.id));

      return ctx.render({ treatments: treatmentsWithPlants });
    } catch (error) {
      console.error("Error fetching cut flower treatments:", error);
      return ctx.render({ treatments: [] });
    }
  },
};

export default function TreatmentsList({ data }: PageProps<TreatmentListData>) {
  const { treatments } = data;

  return (
    <>
      <Head>
        <title>Cut Flower Treatments | Plant Database</title>
      </Head>
      <AdminLayout>
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-2xl font-semibold text-gray-900">Cut Flower Treatments</h1>
              <p class="mt-2 text-sm text-gray-700">
                A list of all cut flower treatments in the database
              </p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <a
                href="/admin/cutflower-treatments/new"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add Treatment
              </a>
            </div>
          </div>
          <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Treatment Name
                        </th>
                        <th
                          scope="col"
                          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Plant
                        </th>
                        <th
                          scope="col"
                          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Application Method
                        </th>
                        <th
                          scope="col"
                          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Effectiveness
                        </th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      {treatments.length === 0 ? (
                        <tr>
                          <td colSpan={6} class="py-4 px-6 text-center text-sm text-gray-500">
                            No treatments found. <a href="/admin/cutflower-treatments/new" class="text-indigo-600 hover:text-indigo-900">Add one</a>
                          </td>
                        </tr>
                      ) : (
                        treatments.map((treatment) => (
                          <tr key={treatment.treatmentId}>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <a
                                href={`/admin/cutflower-treatments/${treatment.treatmentId}`}
                                class="text-indigo-600 hover:text-indigo-900"
                              >
                                {treatment.treatmentName || "Unnamed Treatment"}
                              </a>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {treatment.plantName || "Unknown Plant"}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {treatment.treatmentType || "Not specified"}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {treatment.applicationMethod ? (
                                <span class="truncate max-w-xs inline-block">
                                  {treatment.applicationMethod}
                                </span>
                              ) : (
                                "Not specified"
                              )}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {treatment.effectiveness ? (
                                <span class="truncate max-w-xs inline-block">
                                  {treatment.effectiveness}
                                </span>
                              ) : (
                                "Not specified"
                              )}
                            </td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <a
                                href={`/admin/cutflower-treatments/edit/${treatment.treatmentId}`}
                                class="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </a>
                              <a
                                href={`/admin/cutflower-treatments/${treatment.treatmentId}`}
                                class="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
