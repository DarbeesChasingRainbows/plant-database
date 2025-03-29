import { ComponentChildren, JSX } from "preact";

interface SelectFieldProps extends JSX.HTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  onChange: (e: Event) => void;
  children: ComponentChildren;
}

export function SelectField({
  label,
  name,
  value = "",
  required = false,
  onChange,
  children,
  ...props
}: SelectFieldProps) {
  const id = `select-${name}`;

  return (
    <div class="space-y-2">
      <label 
        htmlFor={id} 
        class="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
