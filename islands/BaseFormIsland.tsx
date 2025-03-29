import { useState } from "preact/hooks";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export interface BaseFormIslandProps<T, U> {
  initialData?: T;
  onSubmit?: (data: U) => Promise<void>;
  onCancel?: () => void;
  submitUrl?: string;
  successRedirectUrl?: string;
  transformForSubmit?: (data: T) => U;
  children: (props: {
    formData: T;
    setFormData: (data: T) => void;
    handleChange: (e: Event) => void;
    handleSubmit: (e: Event) => void;
    saveStatus: SaveStatus;
    errorMessage: string;
  }) => preact.JSX.Element;
}

/**
 * Base form island component that handles form state and submission
 */
export default function BaseFormIsland<T extends Record<string, unknown>, U>({
  initialData,
  onSubmit,
  _onCancel: onCancel,
  submitUrl,
  successRedirectUrl,
  transformForSubmit = (data) => data as unknown as U,
  children
}: BaseFormIslandProps<T, U>) {
  const [formData, setFormData] = useState<T>(initialData || {} as T);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const value = target.type === "checkbox" 
      ? (target as HTMLInputElement).checked 
      : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const dataToSubmit = transformForSubmit(formData);
      
      if (onSubmit) {
        await onSubmit(dataToSubmit);
        setSaveStatus("success");
        if (successRedirectUrl) {
          globalThis.location.href = successRedirectUrl;
        }
      } else if (submitUrl) {
        const response = await fetch(submitUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Failed to save data");
        }

        setSaveStatus("success");
        if (successRedirectUrl) {
          globalThis.location.href = successRedirectUrl;
        }
      }
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  return children({
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    saveStatus,
    errorMessage
  });
}
