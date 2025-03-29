import { useState } from "preact/hooks";
import { GrowingRecord, Plant } from "../../../../../../types/index.ts";
import AdminLayout from "../../../../../../components/AdminLayout.tsx";

interface NewGrowingRecordProps {
  plant: Plant;
}

const NewGrowingRecord = ({ plant }: NewGrowingRecordProps) => {
  const [formData, setFormData] = useState<
    Omit<GrowingRecord, "id" | "created_at" | "updated_at">
  >({
    plant_id: plant.id, // Changed from plant.plant_id to match Plant interface
    planting_date: new Date(),
    planting_method: "Direct seed",
    quantity_planted: 1,
    spacing_cm: 10,
    depth_cm: 0.5,
    area_sqm: 1.0,
    notes: "",
    layout: "POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))",
    planting_area: "POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))",
    row_lines: "MULTILINESTRING((0 0, 1 0), (0 1, 1 1))",
  });

  const handleChange = (
    e: Event & {
      currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    },
  ) => {
    const { name, value, type } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/growing-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      window.location.href = `/admin/plants/${plant.id}/growing`;
    } catch (error) {
      console.error("Error saving growing record:", error);
      alert("Failed to save growing record. Please try again.");
    }
  };

  return (
    <AdminLayout currentPath="/admin/plants">
      <div class="max-w-3xl mx-auto p-4">
        <h2 class="text-2xl font-semibold mb-4">
          Add New Growing Record for {plant.common_name}
        </h2>
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Planting Date
                <input
                  type="date"
                  name="planting_date"
                  required
                  value={formData.planting_date
                    ? formData.planting_date.toISOString().slice(0, 10)
                    : ""}
                  onChange={handleChange}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Planting Method
                <select
                  name="planting_method"
                  required
                  value={formData.planting_method}
                  onChange={handleChange}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="Direct seed">Direct seed</option>
                  <option value="Transplant">Transplant</option>
                  <option value="Division">Division</option>
                  <option value="Cutting">Cutting</option>
                </select>
              </label>
            </div>
          </div>

          {/* Rest of your form fields remain the same */}

          <div class="flex justify-end space-x-4 mt-6">
            <a
              href={`/admin/plants/${plant.id}/growing`}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Growing Record
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewGrowingRecord;
