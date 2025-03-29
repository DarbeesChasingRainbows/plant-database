import { type Plant } from "../../utils/schema.ts";
import BaseForm from "./BaseForm.tsx";
import { DateField, NumberField, TextareaField, CheckboxField, SelectField } from "../FormField.tsx";

interface PlantingGuideFormProps {
  plant?: Plant;
}

export default function PlantingGuideForm({ plant }: PlantingGuideFormProps) {
  return (
    <BaseForm title="Planting Guide">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Spring Planting Start */}
        <DateField
          label="Spring Planting Start"
          name="springPlantingStart"
          value=""
          description="Start date for spring planting"
        />

        {/* Spring Planting End */}
        <DateField
          label="Spring Planting End"
          name="springPlantingEnd"
          value=""
          description="End date for spring planting"
        />

        {/* Fall Planting Start */}
        <DateField
          label="Fall Planting Start"
          name="fallPlantingStart"
          value=""
          description="Start date for fall planting"
        />

        {/* Fall Planting End */}
        <DateField
          label="Fall Planting End"
          name="fallPlantingEnd"
          value=""
          description="End date for fall planting"
        />

        {/* Indoor Sowing Start */}
        <DateField
          label="Indoor Sowing Start"
          name="indoorSowingStart"
          value=""
          description="Start date for indoor sowing"
        />

        {/* Transplant Ready Weeks */}
        <NumberField
          label="Transplant Ready (Weeks)"
          name="transplantReadyWeeks"
          value=""
          description="Weeks until transplant-ready"
        />

        {/* Direct Sow After Frost */}
        <CheckboxField
          label="Direct Sow After Frost"
          name="directSowAfterFrost"
          value={false}
          description="Sow directly after frost risk"
        />

        {/* Frost Tolerance */}
        <SelectField
          label="Frost Tolerance"
          name="frostTolerance"
          value=""
          description="Ability to withstand frost"
          options={[
            { value: "", label: "Select tolerance" },
            { value: "High", label: "High" },
            { value: "Moderate", label: "Moderate" },
            { value: "Low", label: "Low" },
            { value: "None", label: "None" },
          ]}
        />

        {/* Heat Tolerance */}
        <SelectField
          label="Heat Tolerance"
          name="heatTolerance"
          value=""
          description="Ability to withstand heat"
          options={[
            { value: "", label: "Select tolerance" },
            { value: "High", label: "High" },
            { value: "Moderate", label: "Moderate" },
            { value: "Low", label: "Low" },
            { value: "None", label: "None" },
          ]}
        />

        {/* Succession Planting Interval */}
        <NumberField
          label="Succession Planting Interval (Days)"
          name="successionPlantingInterval"
          value=""
          description="Days between successive plantings"
        />

        {/* Rotation Interval */}
        <NumberField
          label="Rotation Interval (Years)"
          name="rotationInterval"
          value=""
          description="Years before replanting in same spot"
        />

        {/* Rotation Group */}
        <TextareaField
          label="Rotation Group"
          name="rotationGroup"
          value=""
          description="Crop rotation category"
          rows={1}
        />
      </div>

      {/* Companion Plants */}
      <TextareaField
        label="Companion Plants"
        name="companionPlants"
        value=""
        description="Beneficial companion plants"
        rows={3}
      />

      {/* Incompatible Plants */}
      <TextareaField
        label="Incompatible Plants"
        name="incompatiblePlants"
        value=""
        description="Plants to avoid planting nearby"
        rows={3}
      />
    </BaseForm>
  );
}