import { JSX } from "preact";

interface FormFieldProps {
  label: string;
  name: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: JSX.Element;
}

/**
 * Base form field component that provides consistent styling and structure
 */
export function FormField({ 
  label, 
  name, 
  description, 
  required = false,
  className = "block",
  children 
}: FormFieldProps) {
  return (
    <div class={className}>
      <label htmlFor={name} class="block text-sm font-medium text-gray-700">
        {label}{required && <span class="text-red-500">*</span>}
      </label>
      {children}
      {description && <p class="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

/**
 * Text input field component
 */
export function TextField({
  label,
  name,
  value = "",
  placeholder = "",
  description,
  required = false,
  onChange,
  className = "",
}: {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  onChange?: (e: Event) => void;
  className?: string;
}) {
  return (
    <FormField 
      label={label} 
      name={name} 
      description={description} 
      required={required}
      className={className}
    >
      <input
        type="text"
        id={name}
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        required={required}
        class="input input-bordered w-full"
        onChange={onChange}
      />
    </FormField>
  );
}

/**
 * Number input field component
 */
export function NumberField({
  label,
  name,
  value,
  min,
  max,
  step = 1,
  placeholder = "",
  description,
  required = false,
  onChange,
  className = "",
}: {
  label: string;
  name: string;
  value?: number | string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  description?: string;
  required?: boolean;
  onChange?: (e: Event) => void;
  className?: string;
}) {
  return (
    <FormField 
      label={label} 
      name={name} 
      description={description} 
      required={required}
      className={className}
    >
      <input
        type="number"
        id={name}
        name={name}
        defaultValue={value !== undefined ? String(value) : ""}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        required={required}
        class="input input-bordered w-full"
        onChange={onChange}
      />
    </FormField>
  );
}

/**
 * Date input field component
 */
export function DateField({
  label,
  name,
  value = "",
  description,
  required = false,
  onChange,
  className = "",
}: {
  label: string;
  name: string;
  value?: string;
  description?: string;
  required?: boolean;
  onChange?: (e: Event) => void;
  className?: string;
}) {
  return (
    <FormField 
      label={label} 
      name={name} 
      description={description} 
      required={required}
      className={className}
    >
      <input
        type="date"
        id={name}
        name={name}
        defaultValue={value}
        required={required}
        class="input input-bordered w-full"
        onChange={onChange}
      />
    </FormField>
  );
}

/**
 * Textarea field component
 */
export function TextareaField({
  label,
  name,
  value = "",
  placeholder = "",
  rows = 3,
  description,
  required = false,
  onChange,
  className = "",
}: {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
  required?: boolean;
  onChange?: (e: Event) => void;
  className?: string;
}) {
  return (
    <FormField 
      label={label} 
      name={name} 
      description={description} 
      required={required}
      className={className}
    >
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={value}
        placeholder={placeholder}
        required={required}
        class="textarea textarea-bordered w-full"
        onChange={onChange}
      />
    </FormField>
  );
}

/**
 * Select field component
 */
export function SelectField({
  label,
  name,
  value = "",
  options = [],
  description,
  required = false,
  onChange,
  className = "",
}: {
  label: string;
  name: string;
  value?: string | number;
  options: Array<{ value: string | number; label: string }>;
  description?: string;
  required?: boolean;
  onChange?: (e: Event) => void;
  className?: string;
}) {
  return (
    <FormField 
      label={label} 
      name={name} 
      description={description} 
      required={required}
      className={className}
    >
      <select
        id={name}
        name={name}
        defaultValue={value !== undefined ? String(value) : ""}
        required={required}
        class="select select-bordered w-full"
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

/**
 * Checkbox field component
 */
export function CheckboxField({
  label,
  name,
  checked = false,
  description,
  onChange,
  className = "",
}: {
  label: string;
  name: string;
  checked?: boolean;
  description?: string;
  onChange?: (e: Event) => void;
  className?: string;
}) {
  return (
    <div class={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={name}
        name={name}
        defaultChecked={checked}
        class="checkbox"
        onChange={onChange}
      />
      <label htmlFor={name} class="ml-2 block text-sm text-gray-700">
        {label}
      </label>
      {description && (
        <p class="ml-5 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
