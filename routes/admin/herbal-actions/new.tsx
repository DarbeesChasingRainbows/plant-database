import { Handlers, PageProps } from "$fresh/server.ts";
import pool from "../../../utils/db.ts";
import AdminLayout from "../../../components/AdminLayout.tsx";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();

    const conn = await pool.connect();
    try {
      await conn.queryObject`
        INSERT INTO herbal_actions (
          action_name,
          description,
          scientific_basis,
          historical_context
        ) VALUES (
          ${form.get("action_name")},
          ${form.get("description")},
          ${form.get("scientific_basis")},
          ${form.get("historical_context")}
        )
      `;

      return new Response("", {
        status: 303,
        headers: { Location: `/admin/herbal-actions` },
      });
    } finally {
      conn.release();
    }
  },
};

export default function NewHerbalAction(_props: PageProps) {
  return (
    <AdminLayout currentPath="/admin/herbal-actions">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Add New Herbal Action</h1>

        <form method="POST" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Action Name
              <input
                type="text"
                name="action_name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Adaptogenic, Carminative, etc."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Description
              <textarea
                name="description"
                rows={3}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Describe what this action does..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Scientific Basis
              <textarea
                name="scientific_basis"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Explain the scientific understanding behind this action..."
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Historical Context
              <textarea
                name="historical_context"
                rows={4}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Describe historical use and understanding..."
              />
            </label>
          </div>

          <div class="flex justify-end space-x-4">
            <a
              href="/admin/herbal-actions"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Action
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
