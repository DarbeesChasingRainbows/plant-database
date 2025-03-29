import { JSX } from "preact";

interface InputFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (e: Event) => void;
}

export function InputField({
  label,
  name,
  value = "",
  type = "text",
  required = false,
  placeholder = "",
  onChange,
  ...props
}: InputFieldProps) {
  const id = `input-${name}`;

  return (
    <div class="space-y-2">
      <label 
        htmlFor={id} 
        class="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...props}
      />
    </div>
  );
}
