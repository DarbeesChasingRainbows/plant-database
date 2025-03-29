import { useState } from "preact/hooks";
import { GardenBed, NewGardenBed, Plot } from "../utils/schema.ts";
import { Button } from "./Button.tsx";
import { InputField } from "./InputField.tsx";
import { SelectField } from "./SelectField.tsx";
import { TextareaField } from "./TextareaField.tsx";
import { CheckboxField } from "./CheckboxField.tsx";

interface GardenBedFormProps {
  bed?: GardenBed;
  plots: Plot[];
  onSubmit: (data: Partial<NewGardenBed>) => void;
  onCancel: () => void;
}

export function GardenBedForm({ bed, plots, onSubmit, onCancel }: GardenBedFormProps) {
  const [formData, setFormData] = useState<Partial<NewGardenBed>>(
    bed || {
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
    }
  );

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    // Calculate area if length and width are provided
    if (formData.lengthCm && formData.widthCm) {
      const areaSqm = (formData.lengthCm * formData.widthCm) / 10000; // Convert cm² to m²
      formData.areaSqm = areaSqm;
    }
    
    onSubmit(formData);
  };

  return (
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
          value={formData.plotId?.toString()}
          onChange={handleChange}
          required
        >
          <option value="">Select a plot</option>
          {plots.map(plot => (
            <option key={plot.plotId} value={plot.plotId}>
              {plot.plotCode}
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
          value={formData.soilType}
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
          checked={formData.raisedBed}
          onChange={handleChange}
        />
        
        <InputField
          label="Irrigation Type"
          name="irrigationType"
          value={formData.irrigationType}
          onChange={handleChange}
        />
        
        <SelectField
          label="Sun Exposure"
          name="sunExposure"
          value={formData.sunExposure}
          onChange={handleChange}
        >
          <option value="">Select sun exposure</option>
          <option value="full">Full Sun</option>
          <option value="partial">Partial Sun</option>
          <option value="shade">Shade</option>
        </SelectField>
        
        <SelectField
          label="Status"
          name="status"
          value={formData.status}
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
        value={formData.notes}
        onChange={handleChange}
        rows={4}
      />
      
      {/* Geolocation data would typically be handled through a map interface */}
      <p class="text-sm text-gray-500">
        Note: Boundary and centroid geolocation data can be added through the map interface on the next screen.
      </p>
      
      <div class="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {bed ? "Update Garden Bed" : "Create Garden Bed"}
        </Button>
      </div>
    </form>
  );
}
