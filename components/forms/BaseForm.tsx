import { JSX } from "preact";

export interface BaseFormProps {
  title?: string;
  description?: string;
  className?: string;
  children: JSX.Element | JSX.Element[];
}

/**
 * Base form component that provides consistent styling and structure for form sections
 */
export default function BaseForm({ 
  title, 
  description, 
  className = "space-y-6",
  children 
}: BaseFormProps) {
  return (
    <div class={className}>
      {title && <h3 class="text-lg font-medium">{title}</h3>}
      {description && <p class="text-sm text-gray-500">{description}</p>}
      {children}
    </div>
  );
}
