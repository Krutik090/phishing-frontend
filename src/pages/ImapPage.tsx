import { useState, useMemo } from "react";
import { Plus, Search, Edit, Trash2, RefreshCw, Activity } from "lucide-react";
// UPDATED IMPORTS
import { ImapFormDrawer } from "../components/imap/ImapFormDrawer";
import { ImapTestConsole } from "../components/imap/ImapTestConsole";
import { ImapLogsPanel } from "../components/imap/ImapLogsPanel";
import { Badge } from '../components/ui/Badge';
import { DeleteModal } from '../components/ui/DeleteModal';
import * as z from 'zod';

// --- COMPLETE INTERFACE ---
// All fields from the prompt are now included.
export interface ImapProfile {
  id: string;
  name: string;
  description?: string;
  provider: 'generic' | 'gmail' | 'o365';
  host: string;
  port: number;
  useSSL: boolean;
  authType: 'password' | 'oauth2';
  username?: string;
  password?: string;
  folder: string;
  pollIntervalSeconds: number;
  markAsRead: boolean;
  deleteAfterFetch: boolean;
  enabled: boolean;
  lastChecked?: string;
}

// --- COMPLETE SCHEMA ---
// This now matches the ImapProfile interface, which will fix the error.
export const imapProfileSchema = z.object({
  name: z.string().min(1, 'Profile Name is required'),
  description: z.string().optional(),
  provider: z.enum(['generic', 'gmail', 'o365']),
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1, 'Port is required').max(65535),
  useSSL: z.boolean(),
  authType: z.enum(['password', 'oauth2']),
  username: z.string().optional(),
  password: z.string().optional(),
  folder: z.string().min(1, 'Folder is required'),
  pollIntervalSeconds: z.number().min(60, 'Interval must be at least 60 seconds'),
  markAsRead: z.boolean(),
  deleteAfterFetch: z.boolean(),
  enabled: z.boolean(),
}).refine(data => data.authType !== 'password' || (data.username && data.username.length > 0), {
  message: 'Username is required for password authentication',
  path: ['username'],
});

export type ImapFormData = z.infer<typeof imapProfileSchema>;


export function ImapPage() {
  const [profiles, setProfiles] = useState<ImapProfile[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ type: 'FORM' | 'TEST' | 'LOGS' | 'DELETE' | null; data?: ImapProfile }>({ type: null });

  const filtered = useMemo(() =>
    profiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [profiles, search]
  );

  // This function is now correct because the types match
  const handleSave = (data: ImapFormData) => {
    if (modal.data) { // Editing
      // When editing, we merge the old data with the new form data
      setProfiles(ps => ps.map(p => p.id === modal.data!.id ? { ...modal.data!, ...data } : p));
    } else { // Creating
      // When creating, we add all fields from the form data
      const newProfile: ImapProfile = {
        ...data,
        id: String(Date.now()),
        lastChecked: undefined, // Ensure all properties exist
      };
      setProfiles(ps => [...ps, newProfile]);
    }
    setModal({ type: null });
  };

  const handleDelete = () => {
    if (modal.data) {
      setProfiles(ps => ps.filter(p => p.id !== modal.data!.id));
    }
    setModal({ type: null });
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">IMAP Profiles</h1>
        <button onClick={() => setModal({ type: 'FORM' })} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold">
          <Plus className="inline w-5 h-5 mr-1" /> New Profile
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-4">
        <div className="relative mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-foreground/40" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-border">
              <tr>
                <th className="p-3 font-semibold text-foreground">Name</th>
                <th className="p-3 font-semibold text-foreground">Host</th>
                <th className="p-3 font-semibold text-foreground">Status</th>
                <th className="p-3 font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(profile => (
                <tr key={profile.id} className="border-b border-border last:border-b-0 hover:bg-accent">
                  <td className="p-3 font-medium text-foreground">{profile.name}</td>
                  <td className="p-3 text-foreground/90">{profile.host}</td>
                  <td className="p-3">
                    <Badge variant={profile.enabled ? 'primary' : 'default'}>
                      {profile.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal({ type: 'FORM', data: profile })} className="p-1 text-primary/80 hover:text-primary" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setModal({ type: 'TEST', data: profile })} className="p-1 text-secondary/80 hover:text-secondary" title="Run Test"><RefreshCw className="w-4 h-4" /></button>
                      <button onClick={() => setModal({ type: 'LOGS', data: profile })} className="p-1 text-blue-500/80 hover:text-blue-500" title="View Logs"><Activity className="w-4 h-4" /></button>
                      <button onClick={() => setModal({ type: 'DELETE', data: profile })} className="p-1 text-destructive/80 hover:text-destructive" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-foreground/60">No IMAP profiles found.</div>}
        </div>
      </div>

      <ImapFormDrawer
        isOpen={modal.type === 'FORM'}
        editingProfile={modal.data || null}
        onClose={() => setModal({ type: null })}
        onSave={handleSave}
      />
      {modal.type === 'TEST' && modal.data && <ImapTestConsole profile={modal.data} onClose={() => setModal({ type: null })} />}
      {modal.type === 'LOGS' && modal.data && <ImapLogsPanel profile={modal.data} onClose={() => setModal({ type: null })} />}
      <DeleteModal
        isOpen={modal.type === 'DELETE'}
        item={modal.data?.name || ''}
        onClose={() => setModal({ type: null })}
        onConfirm={handleDelete}
      />
    </div>
  );

}