import { Plot, NewPlot } from "../utils/schema.ts";
import { Button } from "../components/Button.tsx";
import { InputField } from "../components/InputField.tsx";
import { SelectField } from "../components/SelectField.tsx";
import { TextareaField } from "../components/TextareaField.tsx";
import BaseFormIsland from "./BaseFormIsland.tsx";

interface PlotFormProps {
  plot?: Plot;
  onSubmit?: (data: Partial<NewPlot>) => void;
  onCancel?: () => void;
  suggestedPlotCode?: string;
  submitUrl?: string;
  successRedirectUrl?: string;
}

export default function PlotForm({ 
  plot, 
  onSubmit, 
  onCancel, 
  suggestedPlotCode,
  submitUrl = "/api/garden/plots",
  successRedirectUrl = "/admin/garden/plots"
}: PlotFormProps) {
  // Convert from metric to imperial for display
  const getImperialSize = (sizeSqm?: number | null) => {
    if (!sizeSqm) return undefined;
    // Convert square meters to square feet (1 sq meter = 10.764 sq feet)
    return Math.round(sizeSqm * 10.764 * 100) / 100;
  };

  // Convert from imperial to metric for storage
  const getMetricSize = (sizeSqFt?: number | null) => {
    if (!sizeSqFt) return undefined;
    // Convert square feet to square meters (1 sq foot = 0.0929 sq meters)
    return Math.round(sizeSqFt * 0.0929 * 100) / 100;
  };

  // Initialize form with imperial units for display
  const initialData = plot ? {
    ...plot,
    sizeSqFt: getImperialSize(typeof plot.sizeSqm === 'number' ? plot.sizeSqm : undefined)
  } : {
    plotCode: suggestedPlotCode || "",
    sizeSqm: undefined,
    sizeSqFt: undefined,
    orientation: "",
    sunExposure: "",
    irrigationType: "",
    notes: "",
    status: "active"
  };

  // Custom change handler to handle unit conversion
  const customChangeHandler = (formData: Record<string, unknown>, e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    
    const updatedData = { ...formData };

    if (name === 'sizeSqFt' && value) {
      // When square feet is updated, calculate square meters for storage
      const sizeSqFt = parseFloat(value as string);
      const sizeSqm = getMetricSize(sizeSqFt);
      
      updatedData.sizeSqFt = sizeSqFt;
      // Make sure sizeSqm is passed as a number or undefined
      updatedData.sizeSqm = sizeSqm !== undefined ? Number(sizeSqm) : undefined;
    } else {
      updatedData[name] = value;
    }

    return updatedData;
  };

  // Transform form data for submission
  const transformForSubmit = (formData: Record<string, unknown>): Partial<NewPlot> => {
    // Make sure we don't send the sizeSqFt field to the server
    // as it's not in the database schema
    const { sizeSqFt: _sizeSqFt, ...submitData } = formData;
    
    // Clean up the data before sending
    // Remove date fields or ensure they're in the proper format
    const cleanData = { ...submitData };
    
    // Remove createdAt and updatedAt - these should be handled by the server
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    
    return cleanData as Partial<NewPlot>;
  };

  return (
    <BaseFormIsland
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitUrl={plot?.plotId ? `${submitUrl}/${plot.plotId}` : submitUrl}
      successRedirectUrl={successRedirectUrl}
      transformForSubmit={transformForSubmit}
      method={plot?.plotId ? "PUT" : "POST"}
      customChangeHandler={customChangeHandler}
    >
      {({ formData, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Plot Code"
              name="plotCode"
              value={formData.plotCode}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Size (sq ft)"
              name="sizeSqFt"
              type="number"
              step="0.01"
              value={formData.sizeSqFt?.toString()}
              onChange={handleChange}
            />
            
            <SelectField
              label="Orientation"
              name="orientation"
              value={formData.orientation || ""}
              onChange={handleChange}
            >
              <option value="">Select orientation</option>
              <option value="North-South">North-South</option>
              <option value="East-West">East-West</option>
              <option value="Northeast-Southwest">Northeast-Southwest</option>
              <option value="Northwest-Southeast">Northwest-Southeast</option>
            </SelectField>
            
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
            
            <InputField
              label="Irrigation Type"
              name="irrigationType"
              value={formData.irrigationType || ""}
              onChange={handleChange}
            />
            
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
          
          {/* Geolocation data would typically be handled through a map interface */}
          <p class="text-sm text-gray-500">
            Note: Boundary and centroid geolocation data can be added through the map interface on the next screen.
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {plot ? "Update Plot" : "Create Plot"}
            </Button>
          </div>
        </form>
      )}
    </BaseFormIsland>
  );
}
