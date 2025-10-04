import { useState, useMemo } from 'react';
import { Plus, Trash } from 'lucide-react';
import { SendingProfileModal } from '../components/sending-profiles/SendingProfileModal';

export interface SendingProfile {
  id: number;
  name: string;
  description?: string;
  provider: 'SMTP' | 'API' | 'WEBHOOK';
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  testRecipient?: string;
  smtp?: any;
  api?: any;
  webhook?: any;
  rateLimit?: number;
  tracking?: { open: boolean; click: boolean; customHeaders: boolean };
  createdAt: string;
}

export function SendingProfiles() {
  const [profiles, setProfiles] = useState<SendingProfile[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SendingProfile | null>(null);

  const handleOpenNew = () => {
    setEditingProfile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (profile: SendingProfile) => {
    setEditingProfile(profile);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<SendingProfile, 'id' | 'createdAt'>) => {
    if (editingProfile) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editingProfile.id
            ? { ...editingProfile, ...data }
            : p
        )
      );
    } else {
      setProfiles((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure?')) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Simple filtering example
  const filtered = useMemo(
    () => profiles,
    [profiles]
  );

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Sending Profiles</h1>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md"
        >
          <Plus className="inline w-5 h-5 mr-1" /> New Profile
        </button>
      </div>

      {/* Listing */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4">
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filtered.map((profile) => (
            <div
              key={profile.id}
              className="p-3 rounded-lg border border-border bg-background dark:bg-card hover:border-primary cursor-pointer transition-all group flex items-center justify-between"
              onClick={() => handleOpenEdit(profile)}
            >
              <div>
                <p className="font-semibold text-foreground">{profile.name}</p>
                <span className="text-xs text-foreground/60 block">{profile.provider}</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(profile.id); }}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <SendingProfileModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        editingProfile={editingProfile}
        onSave={handleSave}
      />
    </div>
  );
}
