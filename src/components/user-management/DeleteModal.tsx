import type { User } from '../../pages/UserManagement'; // UPDATED IMPORT

interface DeleteModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteModal({ isOpen, user, onClose, onConfirm }: DeleteModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-card text-foreground max-w-md w-full rounded-lg shadow-2xl border border-border">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-3">Delete User</h3>
                    <p className="text-foreground/80 mb-6">
                        Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-5 py-2 border border-border rounded-lg hover:bg-accent bg-input dark:bg-card text-foreground dark:text-card-foreground"
                        >Cancel</button>
                        <button onClick={onConfirm} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                        >Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}