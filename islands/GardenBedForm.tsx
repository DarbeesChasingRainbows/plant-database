import { GardenBed, NewGardenBed, Plot } from "../utils/schema.ts";
import { Button } from "../components/Button.tsx";
import { InputField } from "../components/InputField.tsx";
import { SelectField } from "../components/SelectField.tsx";
import { TextareaField } from "../components/TextareaField.tsx";
import { CheckboxField } from "../components/CheckboxField.tsx";
import BaseFormIsland from "./BaseFormIsland.tsx";

interface GardenBedFormProps {
  bed?: GardenBed;
  plots: Plot[];
  onSubmit?: (data: Partial<NewGardenBed>) => void;
  onCancel?: () => void;
  submitUrl?: string;
  successRedirectUrl?: string;
}

export default function GardenBedForm({ 
  bed, 
  plots, 
  onSubmit, 
  onCancel,
  submitUrl = "/api/garden/beds",
  successRedirectUrl = "/admin/garden/beds"
}: GardenBedFormProps) {
  
  // Create initial data object from bed if it exists
  const initialData = bed || {
    bedName: "",
    bedCode: "",
    plotId: undefined,
    lengthCm: undefined,
    widthCm: undefined,
    heightCm: undefined,
    soilType: "",
    soilDepthCm: undefined,
    raisedBed: false,
    irrigationType: "",
    sunExposure: "",
    notes: "",
    status: "active"
  };

  // Transform form data for submission
  const transformForSubmit = (formData: Record<string, unknown>): Partial<NewGardenBed> => {
    const cleanData = { ...formData };
    
    // Calculate area in square meters if length and width are provided
    if (formData.lengthCm && formData.widthCm) {
      const lengthCm = Number(formData.lengthCm);
      const widthCm = Number(formData.widthCm);
      if (!isNaN(lengthCm) && !isNaN(widthCm)) {
        const areaSqm = (lengthCm * widthCm) / 10000; // Convert cm² to m²
        cleanData.areaSqm = areaSqm;
      }
    }
    
    // Ensure plotId is a number
    if (typeof cleanData.plotId === 'string') {
      cleanData.plotId = parseInt(cleanData.plotId, 10);
    }
    
    // Clean up date fields before sending
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    
    return cleanData as Partial<NewGardenBed>;
  };

  return (
    <BaseFormIsland
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitUrl={bed?.bedId ? `${submitUrl}/${bed.bedId}` : submitUrl}
      successRedirectUrl={successRedirectUrl}
      transformForSubmit={transformForSubmit}
      method={bed?.bedId ? "PUT" : "POST"}
    >
      {({ formData, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Bed Name"
              name="bedName"
              value={formData.bedName}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Bed Code"
              name="bedCode"
              value={formData.bedCode}
              onChange={handleChange}
              required
            />
            
            <SelectField
              label="Plot"
              name="plotId"
              value={formData.plotId?.toString() || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select a plot</option>
              {plots.map((plot) => (
                <option key={plot.plotId} value={plot.plotId}>
                  {plot.plotCode} {plot.notes && `(${plot.notes})`}
                </option>
              ))}
            </SelectField>
            
            <InputField
              label="Length (cm)"
              name="lengthCm"
              type="number"
              value={formData.lengthCm?.toString()}
              onChange={handleChange}
            />
            
            <InputField
              label="Width (cm)"
              name="widthCm"
              type="number"
              value={formData.widthCm?.toString()}
              onChange={handleChange}
            />
            
            <InputField
              label="Height (cm)"
              name="heightCm"
              type="number"
              value={formData.heightCm?.toString()}
              onChange={handleChange}
            />
            
            <InputField
              label="Soil Type"
              name="soilType"
              value={formData.soilType || ""}
              onChange={handleChange}
            />
            
            <InputField
              label="Soil Depth (cm)"
              name="soilDepthCm"
              type="number"
              step="0.1"
              value={formData.soilDepthCm?.toString()}
              onChange={handleChange}
            />
            
            <CheckboxField
              label="Raised Bed"
              name="raisedBed"
              checked={formData.raisedBed || false}
              onChange={handleChange}
            />
            
            <InputField
              label="Irrigation Type"
              name="irrigationType"
              value={formData.irrigationType || ""}
              onChange={handleChange}
            />
            
            <SelectField
              label="Sun Exposure"
              name="sunExposure"
              value={formData.sunExposure || ""}
              onChange={handleChange}
            >
              <option value="">Select sun exposure</option>
              <option value="Full sun">Full sun</option>
              <option value="Partial shade">Partial shade</option>
              <option value="Full shade">Full shade</option>
              <option value="Mixed sun/shade">Mixed sun/shade</option>
            </SelectField>
            
            <SelectField
              label="Status"
              name="status"
              value={formData.status || "active"}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="planned">Planned</option>
            </SelectField>
          </div>
          
          <TextareaField
            label="Notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows={4}
          />
          
          <div class="flex justify-end space-x-4">
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {bed ? "Update Bed" : "Create Bed"}
            </Button>
          </div>
        </form>
      )}
    </BaseFormIsland>
  );
}
