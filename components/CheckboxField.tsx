import { JSX } from "preact";

interface CheckboxFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  checked?: boolean;
  onChange: (e: Event) => void;
}

export function CheckboxField({
  label,
  name,
  checked = false,
  onChange,
  ...props
}: CheckboxFieldProps) {
  const id = `checkbox-${name}`;

  return (
    <div class="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        {...props}
      />
      <label 
        htmlFor={id} 
        class="ml-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    </div>
  );
}
