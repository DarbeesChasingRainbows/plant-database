import { useState } from "preact/hooks";
import { type PlantPart } from "../../utils/schema.ts";
import { Button } from "../Button.tsx";
import { InputField } from "../InputField.tsx";
import { TextareaField } from "../TextareaField.tsx";
import { CheckboxField } from "../CheckboxField.tsx";

interface PlantPartsFormProps {
  plantParts?: PlantPart[];
  onChange: (parts: PlantPartInput[]) => void;
}

export interface PlantPartInput {
  id?: number;
  partName: string;
  description: string;
  edible: boolean;
  harvestGuidelines: string;
  storageRequirements: string;
  processingNotes: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export default function PlantPartsForm({ plantParts = [], onChange }: PlantPartsFormProps) {
  const [parts, setParts] = useState<PlantPartInput[]>(
    plantParts.map(part => ({
      id: part.partId,
      partName: part.partName,
      description: part.description || "",
      edible: part.edible === null ? false : part.edible,
      harvestGuidelines: part.harvestGuidelines || "",
      storageRequirements: part.storageRequirements || "",
      processingNotes: part.processingNotes || "",
      isNew: false,
      isDeleted: false
    }))
  );

  const addNewPart = () => {
    const newParts = [
      ...parts,
      {
        partName: "",
        description: "",
        edible: false,
        harvestGuidelines: "",
        storageRequirements: "",
        processingNotes: "",
        isNew: true,
        isDeleted: false
      }
    ];
    setParts(newParts);
    onChange(newParts);
  };

  const updatePart = (index: number, field: keyof PlantPartInput, value: string | boolean) => {
    const updatedParts = [...parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [field]: value
    };
    setParts(updatedParts);
    onChange(updatedParts);
  };

  const removePart = (index: number) => {
    const updatedParts = [...parts];
    if (updatedParts[index].id) {
      // Mark existing part as deleted
      updatedParts[index] = {
        ...updatedParts[index],
        isDeleted: true
      };
    } else {
      // Remove new part completely
      updatedParts.splice(index, 1);
    }
    setParts(updatedParts);
    onChange(updatedParts);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Plant Parts</h3>
      <p className="text-sm text-gray-500">
        Add the different parts of this plant (roots, leaves, flowers, etc.) and their characteristics.
      </p>

      {parts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No plant parts added yet. Click the button below to add a part.
        </div>
      )}

      {parts.filter(part => !part.isDeleted).map((part, index) => (
        <div key={part.id || `new-${index}`} className="border rounded-md p-4 mb-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Plant Part {index + 1}</h4>
            <button
              type="button"
              onClick={() => removePart(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <InputField
                label="Part Name"
                name={`part-${index}-name`}
                value={part.partName}
                onChange={(e: Event) => {
                  const target = e.currentTarget as HTMLInputElement;
                  updatePart(index, "partName", target.value);
                }}
                required
              />
            </div>
            <div>
              <CheckboxField
                label="Edible"
                name={`part-${index}-edible`}
                checked={part.edible}
                onChange={(e: Event) => {
                  const target = e.currentTarget as HTMLInputElement;
                  updatePart(index, "edible", target.checked);
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <TextareaField
              label="Description"
              name={`part-${index}-description`}
              value={part.description}
              onChange={(e: Event) => {
                const target = e.currentTarget as HTMLTextAreaElement;
                updatePart(index, "description", target.value);
              }}
              rows={3}
            />
          </div>

          <div className="mt-4">
            <TextareaField
              label="Harvest Guidelines"
              name={`part-${index}-harvest`}
              value={part.harvestGuidelines}
              onChange={(e: Event) => {
                const target = e.currentTarget as HTMLTextAreaElement;
                updatePart(index, "harvestGuidelines", target.value);
              }}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div>
              <TextareaField
                label="Storage Requirements"
                name={`part-${index}-storage`}
                value={part.storageRequirements}
                onChange={(e: Event) => {
                  const target = e.currentTarget as HTMLTextAreaElement;
                  updatePart(index, "storageRequirements", target.value);
                }}
                rows={2}
              />
            </div>
            <div>
              <TextareaField
                label="Processing Notes"
                name={`part-${index}-processing`}
                value={part.processingNotes}
                onChange={(e: Event) => {
                  const target = e.currentTarget as HTMLTextAreaElement;
                  updatePart(index, "processingNotes", target.value);
                }}
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <Button
          type="button"
          onClick={addNewPart}
          className="w-full"
        >
          Add Plant Part
        </Button>
      </div>
    </div>
  );
}
