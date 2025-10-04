import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save } from 'lucide-react';
import { TestConsole } from './TestConsole';
import { SmtpSettings } from './SmtpSettings';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  provider: z.enum(['SMTP', 'API', 'WEBHOOK']),
  fromName: z.string().min(1, 'From Name is required'),
  fromEmail: z.string().email('Invalid email address'),
  replyTo: z.string().email('Invalid email address').optional().or(z.literal('')),
  testRecipient: z.string().email('Invalid email address').optional().or(z.literal('')),
  smtp: z.object({
    host: z.string().min(1, 'Host is required'),
    port: z.number().int().min(1).max(65535),
    username: z.string().optional(),
    password: z.string().optional(),
    secure: z.boolean(),
    rejectUnauthorized: z.boolean()
  }).optional(),
});

type FormData = z.infer<typeof profileSchema>;

interface SendingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProfile: any | null;
  onSave: (data: FormData) => void;
}

export function SendingProfileModal({ isOpen, onClose, editingProfile, onSave }: SendingProfileModalProps) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: editingProfile || {
      provider: 'SMTP',
      smtp: { host: '', port: 587, username: '', password: '', secure: true, rejectUnauthorized: true }
    },
  });
  
  const provider = watch('provider');
  const testRecipient = watch('testRecipient');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card text-foreground max-w-6xl w-full rounded-lg shadow-2xl border border-border max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold">{editingProfile ? 'Edit' : 'Create'} Sending Profile</h2>
          <button onClick={onClose} className="text-foreground/60 hover:text-destructive">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSave)} className="flex-1 overflow-y-auto p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-foreground">Name <span className="text-red-500">*</span></label>
                <input 
                  {...register('name')} 
                  className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Description</label>
                <input 
                  {...register('description')} 
                  className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Provider Type <span className="text-red-500">*</span></label>
                <Controller 
                  name="provider" 
                  control={control} 
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {(['SMTP', 'API', 'WEBHOOK'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => field.onChange(type)}
                          className={`px-4 py-2 rounded-lg border font-medium ${
                            field.value === type 
                              ? 'bg-primary text-white border-primary' 
                              : 'bg-input dark:bg-card border-border text-foreground dark:text-card-foreground'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">From Name <span className="text-red-500">*</span></label>
                <input 
                  {...register('fromName')} 
                  className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="IT Support"
                />
                {errors.fromName && <p className="text-red-500 text-sm mt-1">{errors.fromName.message}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">From Email <span className="text-red-500">*</span></label>
                <input 
                  {...register('fromEmail')} 
                  className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="noreply@company.com"
                />
                {errors.fromEmail && <p className="text-red-500 text-sm mt-1">{errors.fromEmail.message}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Reply To</label>
                <input 
                  {...register('replyTo')} 
                  className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="support@company.com"
                />
                {errors.replyTo && <p className="text-red-500 text-sm mt-1">{errors.replyTo.message}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Test Recipient</label>
                <input 
                  {...register('testRecipient')} 
                  className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="test@company.com"
                />
                {errors.testRecipient && <p className="text-red-500 text-sm mt-1">{errors.testRecipient.message}</p>}
              </div>

              {/* Conditional SMTP Settings */}
              {provider === 'SMTP' && <SmtpSettings register={register} control={control} errors={errors} />}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <TestConsole testRecipient={testRecipient} onSendTest={async () => true} />
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-200 mb-2">Security Notice</h4>
                <p className="text-sm text-yellow-300">Credentials are encrypted. Do not reuse production keys in test environments.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 mt-6 gap-3 border-t border-border">
            <button 
              type="button" 
              className="px-5 py-2 border border-border rounded-lg hover:bg-accent bg-input dark:bg-card text-foreground dark:text-card-foreground" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-7 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {editingProfile ? 'Update' : 'Create'} Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
