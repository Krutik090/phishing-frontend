import { useMemo, useState } from 'react';
import { Edit, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import type { User } from '../../pages/UserManagement'; // UPDATED IMPORT
import { Switch } from '../ui/Switch';

type SortField = keyof User;
type SortDirection = 'asc' | 'desc';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onStatusToggle: (id: number, status: 'active' | 'inactive') => void;
    onRoleChange: (id: number, role: 'user' | 'readonly') => void;
}

export function UserTable({ users, onEdit, onDelete, onStatusToggle, onRoleChange }: UserTableProps) {
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            const order = sortDirection === 'asc' ? 1 : -1;
            return aVal < bVal ? -1 * order : aVal > bVal ? 1 * order : 0;
        });
    }, [users, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <th className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => handleSort(field)}>
            <div className="flex items-center gap-1">{children}
                {sortField === field && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <SortableHeader field="name">Name</SortableHeader>
                        <SortableHeader field="role">Role</SortableHeader>
                        <SortableHeader field="status">Status</SortableHeader>
                        <SortableHeader field="lastLogin">Last Login</SortableHeader>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-accent">
                            <td className="py-3 px-4"><p className="font-medium text-foreground">{user.name}</p><p className="text-sm text-foreground/60">{user.email}</p></td>
                            <td className="py-3 px-4">
                                <select
                                    value={user.role}
                                    onChange={(e) => onRoleChange(user.id, e.target.value as 'user' | 'readonly')}
                                    onClick={(e) => e.stopPropagation()} // Prevent row click
                                    className="text-sm bg-input dark:bg-card border-none text-foreground dark:text-card-foreground focus:outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="readonly">Read Only</option>
                                </select>
                            </td>
                            <td className="py-3 px-4"><Switch checked={user.status === 'active'} onChange={(checked) => onStatusToggle(user.id, checked ? 'active' : 'inactive')} /></td>
                            <td className="py-3 px-4 text-foreground/80 text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                            <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => onEdit(user)} className="p-1 text-primary/80 hover:text-primary" title="Edit user"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(user)} className="p-1 text-destructive/80 hover:text-destructive" title="Delete user"><Trash className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedUsers.length === 0 && <div className="text-center py-12 text-foreground/60">No users found.</div>}
        </div>
    );
}