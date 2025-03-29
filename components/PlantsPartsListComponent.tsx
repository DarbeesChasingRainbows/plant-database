import { type PlantPart } from "../utils/schema.ts";
import { Button } from "./Button.tsx";
import { useSignal } from "@preact/signals";

interface PlantPartsListProps {
  plantParts: PlantPart[];
  onChange?: (parts: PlantPart[]) => void;
  readOnly?: boolean;
}

export default function PlantPartsList({ plantParts = [], onChange, readOnly = false }: PlantPartsListProps) {
  const parts = useSignal<(PlantPart & { isNew?: boolean })[]>(plantParts);

  const addPart = () => {
    if (readOnly) return;
    const newParts = [...parts.value, {
      id: 0,
      plant_id: null,
      part_name: "",
      description: null,
      edible: null,
      created_at: null,
      updated_at: null,
      harvest_guidelines: null,
      storage_requirements: null,
      processing_notes: null,
      isNew: true
    }];
    parts.value = newParts;
    onChange?.(newParts);
  };

  const removePart = (index: number) => {
    if (readOnly) return;
    const newParts = parts.value.filter((_, i) => i !== index);
    parts.value = newParts;
    onChange?.(newParts);
  };

  const updatePart = (index: number, updates: Partial<PlantPart>) => {
    if (readOnly) return;
    const newParts = [...parts.value];
    newParts[index] = { ...newParts[index], ...updates };
    parts.value = newParts;
    onChange?.(newParts);
  };

  return (
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Plant Parts</h2>
        {!readOnly && <Button onClick={addPart}>Add Part</Button>}
      </div>
      <div class="space-y-4">
        {parts.value.map((part, index) => (
          <div key={part.id || index} class="border rounded-lg p-4 space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Part Name</label>
                <input
                  type="text"
                  value={part.part_name}
                  onChange={(e) => updatePart(index, { part_name: e.target.value })}
                  required
                  disabled={readOnly}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={part.edible ?? false}
                  onChange={(e) => updatePart(index, { edible: e.target.checked })}
                  disabled={readOnly}
                  class="checkbox checkbox-primary"
                />
                <label class="block text-sm text-gray-900">Edible</label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={part.description ?? ""}
                onChange={(e) => updatePart(index, { description: e.target.value })}
                rows={2}
                disabled={readOnly}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Harvest Guidelines</label>
              <textarea
                value={part.harvest_guidelines ?? ""}
                onChange={(e) => updatePart(index, { harvest_guidelines: e.target.value })}
                rows={2}
                disabled={readOnly}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Storage Requirements</label>
              <textarea
                value={part.storage_requirements ?? ""}
                onChange={(e) => updatePart(index, { storage_requirements: e.target.value })}
                rows={2}
                disabled={readOnly}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Processing Notes</label>
              <textarea
                value={part.processing_notes ?? ""}
                onChange={(e) => updatePart(index, { processing_notes: e.target.value })}
                rows={2}
                disabled={readOnly}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div class="flex justify-end">
              {!readOnly && <Button onClick={() => removePart(index)}>Remove Part</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}