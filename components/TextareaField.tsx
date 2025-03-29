import { JSX } from "preact";

interface TextareaFieldProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  onChange: (e: Event) => void;
}

export function TextareaField({
  label,
  name,
  value = "",
  required = false,
  placeholder = "",
  rows = 3,
  onChange,
  ...props
}: TextareaFieldProps) {
  const id = `textarea-${name}`;

  return (
    <div class="space-y-2">
      <label 
        htmlFor={id} 
        class="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
        required={required}
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...props}
      />
    </div>
  );
}
