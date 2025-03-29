import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";
import { Button } from "../../../components/Button.tsx";
import { herbalActions } from "../../../utils/schema.ts";
import { db } from "../../../utils/db.ts";

interface NewHerbalActionData {
  error?: string;
}

export const handler: Handlers<NewHerbalActionData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const actionName = form.get("actionName")?.toString() || "";
      const description = form.get("description")?.toString() || null;
      const scientificBasis = form.get("scientificBasis")?.toString() || null;
      const historicalContext = form.get("historicalContext")?.toString() || null;

      if (!actionName) {
        return ctx.render({ error: "Action name is required" });
      }

      // Use Drizzle ORM to insert the new herbal action
      const [newAction] = await db.insert(herbalActions).values({
        actionName,
        description,
        scientificBasis,
        historicalContext,
      }).returning();

      // Redirect to the action details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/actions/${newAction.actionId}` }
      });
    } catch (error) {
      console.error("Error creating herbal action:", error);
      return ctx.render({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  },

  GET(_, ctx) {
    return ctx.render({});
  },
};

export default function NewHerbalActionPage({ data }: PageProps<NewHerbalActionData>) {
  const { error } = data;

  return (
    <AdminLayout title="Add Herbal Action" currentPath="/admin/actions">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Add Herbal Action</h1>
        <Button href="/admin/actions">Back to Herbal Actions</Button>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="post" action="/admin/actions/new" class="p-6 space-y-6">
          <div>
            <label for="actionName" class="block text-sm font-medium text-gray-700">
              Action Name *
            </label>
            <input
              type="text"
              name="actionName"
              id="actionName"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="scientificBasis" class="block text-sm font-medium text-gray-700">
              Scientific Basis
            </label>
            <textarea
              name="scientificBasis"
              id="scientificBasis"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="historicalContext" class="block text-sm font-medium text-gray-700">
              Historical Context
            </label>
            <textarea
              name="historicalContext"
              id="historicalContext"
              rows={3}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Save Herbal Action
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
