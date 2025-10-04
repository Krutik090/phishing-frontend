import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { imapProfileSchema } from '../../pages/ImapPage';
import type { ImapFormData, ImapProfile } from '../../pages/ImapPage';
import { PasswordInput } from '../ui/PasswordInput';
import { Switch } from '../ui/Switch';

interface ImapFormDrawerProps {
  isOpen: boolean;
  editingProfile: ImapProfile | null;
  onClose: () => void;
  onSave: (data: ImapFormData) => void;
}

export function ImapFormDrawer({ isOpen, editingProfile, onClose, onSave }: ImapFormDrawerProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ImapFormData>({
    resolver: zodResolver(imapProfileSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset(editingProfile || {
        name: "",
        provider: 'generic',
        host: "",
        port: 993,
        useSSL: true,
        authType: "password",
        username: "",
        password: "",
        folder: "INBOX",
        pollIntervalSeconds: 300,
        markAsRead: true,
        deleteAfterFetch: false,
        enabled: true,
      });
    }
  }, [isOpen, editingProfile, reset]);

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-40">
    <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
    <div className="absolute inset-y-0 right-0 bg-card text-foreground w-full max-w-lg h-full shadow-lg border-l border-border flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h2 className="text-xl font-semibold">{editingProfile ? 'Edit' : 'Create'} IMAP Profile</h2>
        <button onClick={onClose} className="text-foreground/60 hover:text-destructive"><X className="w-6 h-6" /></button>
      </div>
      <form onSubmit={handleSubmit(onSave)} className="flex-1 overflow-y-auto p-6 space-y-4">
        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg mb-2">General</legend>
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Profile Name <span className="text-destructive">*</span></label>
            <input id="name" {...register("name")} className={`w-full bg-input dark:bg-card border ${errors.name ? 'border-destructive' : 'border-border'} rounded-md text-foreground dark:text-card-foreground`} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block font-medium mb-1">Description</label>
            <input id="description" {...register("description")} className="w-full bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground" />
          </div>
        </fieldset>
        
        <fieldset className="space-y-4 pt-4 border-t border-border">
          <legend className="font-semibold text-lg mb-2">Connection</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="host" className="block font-medium mb-1">Host <span className="text-destructive">*</span></label>
              <input id="host" {...register("host")} className={`w-full bg-input dark:bg-card border ${errors.host ? 'border-destructive' : 'border-border'} rounded-md text-foreground dark:text-card-foreground`} />
                {errors.host && <p className="text-sm text-destructive mt-1">{errors.host.message}</p>}
            </div>
            <div>
              <label htmlFor="port" className="block font-medium mb-1">Port <span className="text-destructive">*</span></label>
              <input id="port" type="number" {...register("port", { valueAsNumber: true })} className={`w-full bg-input dark:bg-card border ${errors.port ? 'border-destructive' : 'border-border'} rounded-md text-foreground dark:text-card-foreground`} />
                {errors.port && <p className="text-sm text-destructive mt-1">{errors.port.message}</p>}
            </div>
          </div>
          <Controller name="useSSL" control={control} render={({ field }) => (
            <label className="flex items-center gap-2"><Switch checked={field.value} onChange={field.onChange} /> Use SSL/TLS</label>
          )} />
        </fieldset>

        <fieldset className="space-y-4 pt-4 border-t border-border">
          <legend className="font-semibold text-lg mb-2">Authentication</legend>
          <div>
            <label htmlFor="username" className="block font-medium mb-1">Username <span className="text-destructive">*</span></label>
            <input id="username" {...register("username")} className={`w-full bg-input dark:bg-card border ${errors.username ? 'border-destructive' : 'border-border'} rounded-md text-foreground dark:text-card-foreground`} />
            {errors.username && <p className="text-sm text-destructive mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">Password</label>
            <PasswordInput id="password" {...register("password")} className="w-full bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground" />
          </div>
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-300">Credentials are stored encrypted. Do not reuse production passwords.</p>
          </div>
        </fieldset>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-md bg-input dark:bg-card text-foreground dark:text-card-foreground">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-md shadow flex items-center gap-2">
            <Save className="w-5 h-5" /> {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}