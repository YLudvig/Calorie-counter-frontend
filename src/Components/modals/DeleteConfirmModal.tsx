import { useEffect } from "react";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  mealname: string;
  mealtype: string;
};

export default function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  mealname,
  mealtype,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // Prevent rendering if not open
  if (!isOpen) return null;

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 relative shadow-lg min-w-[300px] max-w-[35vw] w-full">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">Confirm delete</h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{mealname}</span> from{" "}
          <span className="font-semibold">{mealtype.toLowerCase()}</span>?
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
