import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { UserTable } from '../components/user-management/UserTable';
import { UserModal } from '../components/user-management/UserModal';
import { DeleteModal } from '../components/user-management/DeleteModal';

// TYPES ARE NOW DEFINED AND EXPORTED HERE
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'readonly';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export type UserFormData = Omit<User, 'id' | 'lastLogin' | 'createdAt'> & {
  password?: string;
  confirmPassword?: string;
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'user', status: 'active', lastLogin: '2025-10-04T08:30:00Z', createdAt: '2025-09-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'readonly', status: 'inactive', lastLogin: '2025-10-03T14:20:00Z', createdAt: '2025-09-20' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => 
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
  [users, searchTerm]);

  const handleCreateUser = () => { setEditingUser(null); setModalOpen(true); };
  const handleEditUser = (user: User) => { setEditingUser(user); setModalOpen(true); };
  const handleDeleteUser = (user: User) => { setDeletingUser(user); setDeleteModalOpen(true); };

  const handleSaveUser = (data: UserFormData) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...data } : u));
    } else {
      const newUser: User = { ...data, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
      setUsers(prev => [...prev, newUser]);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      setDeleteModalOpen(false);
    }
  };

  const handleStatusToggle = (id: number, status: 'active' | 'inactive') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };
  
  const handleRoleChange = (id: number, role: 'user' | 'readonly') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

   return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="inline w-5 h-5 mr-1" />
          Add User
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-4">
        <div className="relative mb-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-foreground/40" />
        </div>
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onStatusToggle={handleStatusToggle}
          onRoleChange={handleRoleChange}
        />
      </div>
      <UserModal
        isOpen={isModalOpen}
        user={editingUser}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        user={deletingUser}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}