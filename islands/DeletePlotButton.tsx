import { useState } from "preact/hooks";

interface DeletePlotButtonProps {
  plotId: number;
}

export default function DeletePlotButton({ plotId }: DeletePlotButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this plot? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/garden/plots/${plotId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          alert(data.error || 'Failed to delete plot');
          setIsDeleting(false);
          return;
        }
        
        // Redirect to plots list page on success
        globalThis.location.href = '/admin/garden/plots';
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the plot.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      type="button"
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete Plot"}
    </button>
  );
}
