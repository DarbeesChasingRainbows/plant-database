import { Handlers, PageProps } from "$fresh/server.ts";
import AdminLayout from "../../../../components/AdminLayout.tsx";
import { Button } from "../../../../components/Button.tsx";
import { herbalActions } from "../../../../utils/schema.ts";
import { db } from "../../../../utils/db.ts";
import { eq } from "drizzle-orm";

interface HerbalActionData {
  action: {
    actionId: number;
    actionName: string;
    description: string | null;
    scientificBasis: string | null;
    historicalContext: string | null;
  };
  error?: string;
}

export const handler: Handlers<HerbalActionData> = {
  async GET(_, ctx) {
    try {
      const id = parseInt(ctx.params.id);
      if (isNaN(id)) {
        return ctx.renderNotFound();
      }

      // Use Drizzle ORM to fetch the herbal action
      const action = await db.query.herbalActions.findFirst({
        where: eq(herbalActions.actionId, id)
      });

      if (!action) {
        return ctx.renderNotFound();
      }

      return ctx.render({ action });
    } catch (error) {
      console.error("Error fetching herbal action:", error);
      return ctx.renderNotFound();
    }
  },

  async POST(req, ctx) {
    try {
      const id = parseInt(ctx.params.id);
      if (isNaN(id)) {
        return ctx.renderNotFound();
      }

      const form = await req.formData();
      const actionName = form.get("actionName")?.toString() || "";
      const description = form.get("description")?.toString() || null;
      const scientificBasis = form.get("scientificBasis")?.toString() || null;
      const historicalContext = form.get("historicalContext")?.toString() || null;

      if (!actionName) {
        // Fetch the current action to re-render the form with error
        const action = await db.query.herbalActions.findFirst({
          where: eq(herbalActions.actionId, id)
        });
        
        if (!action) {
          return ctx.renderNotFound();
        }
        
        return ctx.render({ 
          action, 
          error: "Action name is required" 
        });
      }

      // Use Drizzle ORM to update the herbal action
      await db.update(herbalActions)
        .set({
          actionName,
          description,
          scientificBasis,
          historicalContext,
          updatedAt: new Date()
        })
        .where(eq(herbalActions.actionId, id));

      // Redirect to the action details page
      return new Response(null, {
        status: 303,
        headers: { Location: `/admin/actions/${id}` }
      });
    } catch (error) {
      console.error("Error updating herbal action:", error);
      
      // Fetch the current action to re-render the form with error
      const action = await db.query.herbalActions.findFirst({
        where: eq(herbalActions.actionId, parseInt(ctx.params.id))
      });
      
      if (!action) {
        return ctx.renderNotFound();
      }
      
      return ctx.render({ 
        action, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    }
  }
};

export default function EditHerbalActionPage({ data }: PageProps<HerbalActionData>) {
  const { action, error } = data;

  return (
    <AdminLayout title="Edit Herbal Action" currentPath="/admin/actions">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Herbal Action</h1>
        <div class="space-x-2">
          <Button href={`/admin/actions/${action.actionId}`}>View Details</Button>
          <Button href="/admin/actions">Back to Herbal Actions</Button>
        </div>
      </div>

      {error && (
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div class="bg-white shadow overflow-hidden rounded-lg">
        <form method="POST" class="p-6 space-y-6">
          <div>
            <label for="actionName" class="block text-sm font-medium text-gray-700">
              Action Name *
            </label>
            <input
              type="text"
              name="actionName"
              id="actionName"
              required
              value={action.actionName}
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
            >{action.description || ""}</textarea>
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
            >{action.scientificBasis || ""}</textarea>
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
            >{action.historicalContext || ""}</textarea>
          </div>

          <div class="flex justify-end">
            <Button type="submit">Update Herbal Action</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
