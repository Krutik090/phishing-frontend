interface DeleteModalProps {
  isOpen: boolean;
  item: string; // The name of the item being deleted
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, item, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card text-foreground max-w-md w-full rounded-lg shadow-2xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-3">Delete Confirmation</h3>
        <p className="text-foreground/80 mb-6">Are you sure you want to delete <strong>{item}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-border rounded-lg hover:bg-accent">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">Delete</button>
        </div>
      </div>
    </div>
  );
}