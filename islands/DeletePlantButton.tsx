import { useState } from "preact/hooks";

interface DeletePlantButtonProps {
  id: number;
  name: string;
}

export default function DeletePlantButton({ id, name }: DeletePlantButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/plants/delete/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Use globalThis instead of window for Deno compatibility
        globalThis.location.href = '/admin/plants?success=Plant deleted successfully';
      } else {
        setError(data.error || 'Failed to delete plant');
        setIsDeleting(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while trying to delete the plant');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete Plant'}
      </button>
      
      {error && (
        <div class="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </>
  );
}
