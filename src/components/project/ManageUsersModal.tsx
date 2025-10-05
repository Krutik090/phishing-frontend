import { useState } from 'react';
import { X, UserPlus, Trash2, Search } from 'lucide-react';
import { mockUsers } from '../project/mockProjectData';

interface ManageUsersModalProps {
  project: any;
  onClose: () => void;
}

export function ManageUsersModal({ project, onClose }: ManageUsersModalProps) {
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(
    project.assignedUsers.map((u: any) => u.id)
  );
  const [searchTerm, setSearchTerm] = useState('');

  const assignedUsers = mockUsers.filter((u) => assignedUserIds.includes(u.id));
  const availableUsers = mockUsers.filter((u) => !assignedUserIds.includes(u.id));

  const filteredAvailable = availableUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addUser = (userId: string) => {
    setAssignedUserIds([...assignedUserIds, userId]);
  };

  const removeUser = (userId: string) => {
    setAssignedUserIds(assignedUserIds.filter((id) => id !== userId));
  };

  const handleSave = () => {
    console.log('Saving assigned users:', assignedUserIds);
    alert('Users updated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Manage Project Users</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned Users */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Assigned Users ({assignedUsers.length})
              </h3>
              <div className="space-y-2">
                {assignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-foreground/60">{user.email}</div>
                    </div>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors text-destructive"
                      title="Remove user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {assignedUsers.length === 0 && (
                  <div className="text-center py-8 text-foreground/60">No users assigned yet</div>
                )}
              </div>
            </div>

            {/* Available Users */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Available Users</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAvailable.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-foreground/60">{user.email}</div>
                    </div>
                    <button
                      onClick={() => addUser(user.id)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors text-primary"
                      title="Add user"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {filteredAvailable.length === 0 && (
                  <div className="text-center py-8 text-foreground/60">No users available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
