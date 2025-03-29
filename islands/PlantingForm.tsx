import { useState, useEffect } from "preact/hooks";
import { Plant, Plot, GardenBed } from "../utils/schema.ts";
import { Button } from "../components/Button.tsx";
import { InputField } from "../components/InputField.tsx";
import { SelectField } from "../components/SelectField.tsx";
import { TextareaField } from "../components/TextareaField.tsx";
import { CheckboxField } from "../components/CheckboxField.tsx";

interface PlantingFormProps {
  planting?: {
    plantingId: number;
    planId?: number;
    plotId?: number;
    bedId?: number;
    plantId?: number;
    seedLotId?: number;
    plantingDate: Date;
    plantingMethod?: string;
    spacingCm?: number;
    depthCm?: number;
    quantityPlanted?: number;
    areaSqm?: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    companionPlants?: Array<{
      id: number;
      plantId: number;
      quantity?: number;
      xPosition?: number;
      yPosition?: number;
      notes?: string;
    }>;
  };
  plants: Plant[];
  plots: Plot[];
  beds: GardenBed[];
  onSubmit?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

interface CompanionPlant {
  id?: number;
  plantId: string | number;
  quantity?: string | number;
  xPosition?: string | number;
  yPosition?: string | number;
  notes?: string;
}

export default function PlantingForm({ planting, plants, plots, beds, onSubmit, onCancel }: PlantingFormProps) {
  const [formData, setFormData] = useState({
    plantingId: planting?.plantingId || 0,
    plotId: planting?.plotId || "",
    bedId: planting?.bedId || "",
    plantId: planting?.plantId || "",
    plantingDate: planting?.plantingDate ? new Date(planting.plantingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    plantingMethod: planting?.plantingMethod || "",
    spacingCm: planting?.spacingCm || "",
    depthCm: planting?.depthCm || "",
    quantityPlanted: planting?.quantityPlanted || "",
    notes: planting?.notes || "",
    isCompanionPlanting: planting?.companionPlants && planting.companionPlants.length > 0 ? true : false,
  });

  // State for companion plants
  const [companionPlants, setCompanionPlants] = useState<CompanionPlant[]>(
    planting?.companionPlants?.map(cp => ({
      id: cp.id,
      plantId: cp.plantId,
      quantity: cp.quantity || "",
      xPosition: cp.xPosition || "",
      yPosition: cp.yPosition || "",
      notes: cp.notes || ""
    })) || []
  );

  const [filteredBeds, setFilteredBeds] = useState<GardenBed[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [companionErrors, setCompanionErrors] = useState<Record<string, Record<string, string>>>({});

  // Filter beds based on selected plot
  useEffect(() => {
    if (formData.plotId) {
      const plotId = typeof formData.plotId === 'string' 
        ? parseInt(formData.plotId, 10) 
        : formData.plotId;
        
      setFilteredBeds(beds.filter(bed => bed.plotId === plotId));
    } else {
      setFilteredBeds([]);
    }
  }, [formData.plotId, beds]);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Add a new companion plant entry
  const addCompanionPlant = () => {
    setCompanionPlants([...companionPlants, { plantId: "", quantity: "", xPosition: "", yPosition: "", notes: "" }]);
  };

  // Remove a companion plant entry
  const removeCompanionPlant = (index: number) => {
    const updatedCompanionPlants = [...companionPlants];
    updatedCompanionPlants.splice(index, 1);
    setCompanionPlants(updatedCompanionPlants);

    // Remove any errors for this companion plant
    const updatedErrors = { ...companionErrors };
    delete updatedErrors[index];
    setCompanionErrors(updatedErrors);
  };

  // Handle changes to companion plant fields
  const handleCompanionPlantChange = (index: number, field: string, value: string | number) => {
    const updatedCompanionPlants = [...companionPlants];
    updatedCompanionPlants[index] = {
      ...updatedCompanionPlants[index],
      [field]: value
    };
    setCompanionPlants(updatedCompanionPlants);

    // Clear error for this field if it exists
    if (companionErrors[index]?.[field]) {
      const updatedErrors = { ...companionErrors };
      updatedErrors[index] = { ...updatedErrors[index], [field]: "" };
      setCompanionErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newCompanionErrors: Record<string, Record<string, string>> = {};
    
    if (!formData.plotId) {
      newErrors.plotId = "Plot is required";
    }
    
    if (!formData.bedId) {
      newErrors.bedId = "Garden bed is required";
    }
    
    if (!formData.plantId) {
      newErrors.plantId = "Primary plant is required";
    }
    
    if (!formData.plantingDate) {
      newErrors.plantingDate = "Planting date is required";
    }

    // Validate companion plants if enabled
    if (formData.isCompanionPlanting) {
      companionPlants.forEach((plant, index) => {
        const plantErrors: Record<string, string> = {};
        
        if (!plant.plantId) {
          plantErrors.plantId = "Plant is required";
        }
        
        if (Object.keys(plantErrors).length > 0) {
          newCompanionErrors[index] = plantErrors;
        }
      });
    }
    
    setErrors(newErrors);
    setCompanionErrors(newCompanionErrors);
    
    return Object.keys(newErrors).length === 0 && 
           Object.keys(newCompanionErrors).length === 0;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      plotId: typeof formData.plotId === 'string' ? parseInt(formData.plotId, 10) : formData.plotId,
      bedId: typeof formData.bedId === 'string' ? parseInt(formData.bedId, 10) : formData.bedId,
      plantId: typeof formData.plantId === 'string' ? parseInt(formData.plantId, 10) : formData.plantId,
      spacingCm: formData.spacingCm ? parseInt(String(formData.spacingCm), 10) : undefined,
      depthCm: formData.depthCm ? parseFloat(String(formData.depthCm)) : undefined,
      quantityPlanted: formData.quantityPlanted ? parseInt(String(formData.quantityPlanted), 10) : undefined,
    };

    // Add companion plants if enabled
    if (formData.isCompanionPlanting && companionPlants.length > 0) {
      submitData.companionPlants = companionPlants.map(plant => ({
        id: plant.id,
        plantId: typeof plant.plantId === 'string' ? parseInt(plant.plantId, 10) : plant.plantId,
        quantity: plant.quantity ? parseInt(String(plant.quantity), 10) : undefined,
        xPosition: plant.xPosition ? parseFloat(String(plant.xPosition)) : undefined,
        yPosition: plant.yPosition ? parseFloat(String(plant.yPosition)) : undefined,
        notes: plant.notes
      }));
    }
    
    // Check if onSubmit is a function before calling it
    if (typeof onSubmit === 'function') {
      onSubmit(submitData);
    } else {
      console.error('onSubmit is not a function');
      // Fallback submission - direct API call
      submitFormData(submitData);
    }
  };
  
  // Fallback submission function if onSubmit is not provided
  const submitFormData = async (data: Record<string, unknown>) => {
    try {
      const url = planting?.plantingId 
        ? `/api/garden/plantings/${planting.plantingId}` 
        : '/api/garden/plantings';
      
      const method = planting?.plantingId ? 'PUT' : 'POST';
      
      // Clean up date fields before sending
      const cleanData = { ...data };
      delete cleanData.createdAt;
      delete cleanData.updatedAt;
      delete cleanData.isCompanionPlanting; // Remove UI-only field
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(result.error || `Failed to ${planting ? 'update' : 'create'} planting`);
        return;
      }
      
      // Redirect to plantings list on success
      globalThis.location.href = '/admin/garden/plantings';
    } catch (error) {
      console.error(`Error ${planting ? 'updating' : 'creating'} planting:`, error);
      alert(`An error occurred while ${planting ? 'updating' : 'creating'} the planting`);
    }
  };
  
  const handleCancelClick = (e: Event) => {
    e.preventDefault();
    
    // Check if onCancel is a function before calling it
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      console.error('onCancel is not a function');
      // Fallback navigation
      globalThis.location.href = '/admin/garden/plantings';
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Plot"
          name="plotId"
          value={formData.plotId.toString()}
          onChange={handleChange}
          error={errors.plotId}
          required
        >
          <option value="">Select a plot</option>
          {plots.map((plot) => (
            <option key={plot.plotId} value={plot.plotId}>
              {plot.plotCode} {plot.notes && `(${plot.notes})`}
            </option>
          ))}
        </SelectField>
        
        <SelectField
          label="Garden Bed"
          name="bedId"
          value={formData.bedId.toString()}
          onChange={handleChange}
          error={errors.bedId}
          required
          disabled={!formData.plotId}
        >
          <option value="">Select a garden bed</option>
          {filteredBeds.map((bed) => (
            <option key={bed.bedId} value={bed.bedId}>
              {bed.bedName} ({bed.bedCode})
            </option>
          ))}
        </SelectField>
        
        <SelectField
          label="Primary Plant"
          name="plantId"
          value={formData.plantId.toString()}
          onChange={handleChange}
          error={errors.plantId}
          required
        >
          <option value="">Select a plant</option>
          {plants.map((plant) => (
            <option key={plant.id} value={plant.id}>
              {plant.botanicalName} ({plant.commonName})
            </option>
          ))}
        </SelectField>
        
        <InputField
          label="Planting Date"
          name="plantingDate"
          type="date"
          value={formData.plantingDate}
          onChange={handleChange}
          error={errors.plantingDate}
          required
        />
        
        <SelectField
          label="Planting Method"
          name="plantingMethod"
          value={formData.plantingMethod}
          onChange={handleChange}
        >
          <option value="">Select a method</option>
          <option value="Direct seeding">Direct seeding</option>
          <option value="Transplant">Transplant</option>
          <option value="Cutting">Cutting</option>
          <option value="Division">Division</option>
          <option value="Layering">Layering</option>
        </SelectField>
        
        <InputField
          label="Spacing (cm)"
          name="spacingCm"
          type="number"
          min="0"
          step="1"
          value={formData.spacingCm.toString()}
          onChange={handleChange}
        />
        
        <InputField
          label="Planting Depth (cm)"
          name="depthCm"
          type="number"
          min="0"
          step="0.1"
          value={formData.depthCm.toString()}
          onChange={handleChange}
        />
        
        <InputField
          label="Quantity Planted"
          name="quantityPlanted"
          type="number"
          min="1"
          step="1"
          value={formData.quantityPlanted.toString()}
          onChange={handleChange}
        />
      </div>
      
      <div class="mt-6">
        <CheckboxField
          label="This is a companion planting (multiple plants in the same bed)"
          name="isCompanionPlanting"
          checked={formData.isCompanionPlanting}
          onChange={handleChange}
        />
      </div>
      
      {formData.isCompanionPlanting && (
        <div class="mt-6 border-t pt-6">
          <h3 class="text-lg font-medium mb-4">Companion Plants</h3>
          
          {companionPlants.length === 0 ? (
            <p class="text-gray-500 italic mb-4">No companion plants added yet.</p>
          ) : (
            companionPlants.map((plant, index) => (
              <div key={index} class="mb-6 p-4 border rounded-lg bg-gray-50">
                <div class="flex justify-between items-center mb-4">
                  <h4 class="font-medium">Companion Plant #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCompanionPlant(index)}
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Plant"
                    value={plant.plantId.toString()}
                    onChange={(e) => handleCompanionPlantChange(index, 'plantId', e.target.value)}
                    error={companionErrors[index]?.plantId}
                    required
                  >
                    <option value="">Select a plant</option>
                    {plants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.botanicalName} ({p.commonName})
                      </option>
                    ))}
                  </SelectField>
                  
                  <InputField
                    label="Quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={plant.quantity?.toString() || ""}
                    onChange={(e) => handleCompanionPlantChange(index, 'quantity', e.target.value)}
                  />
                  
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="X Position (cm)"
                      type="number"
                      step="0.1"
                      value={plant.xPosition?.toString() || ""}
                      onChange={(e) => handleCompanionPlantChange(index, 'xPosition', e.target.value)}
                    />
                    
                    <InputField
                      label="Y Position (cm)"
                      type="number"
                      step="0.1"
                      value={plant.yPosition?.toString() || ""}
                      onChange={(e) => handleCompanionPlantChange(index, 'yPosition', e.target.value)}
                    />
                  </div>
                  
                  <div class="md:col-span-2">
                    <TextareaField
                      label="Notes"
                      value={plant.notes || ""}
                      onChange={(e) => handleCompanionPlantChange(index, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          
          <button
            type="button"
            onClick={addCompanionPlant}
            class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Companion Plant
          </button>
        </div>
      )}
      
      <TextareaField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={4}
      />
      
      <div class="flex justify-end space-x-4">
        <Button type="button" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type="submit">
          {planting ? "Update Planting" : "Create Planting"}
        </Button>
      </div>
    </form>
  );
}
