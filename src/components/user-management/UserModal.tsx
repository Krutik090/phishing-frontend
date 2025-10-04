import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import type { User, UserFormData } from '../../pages/UserManagement'; // UPDATED IMPORT
import { PasswordInput } from '../ui/PasswordInput';

const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

interface UserModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSave: (data: UserFormData) => void;
}

export function UserModal({ isOpen, user, onClose, onSave }: UserModalProps) {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<UserFormData>();

    useEffect(() => {
        if (isOpen) {
            reset(user || {
                name: '',
                email: '',
                role: 'user',
                status: 'active',
                password: '',
                confirmPassword: '',
            });
        }
    }, [isOpen, user, reset]);

    const handleGeneratePassword = () => {
        const password = generatePassword();
        setValue('password', password, { shouldValidate: true });
        setValue('confirmPassword', password, { shouldValidate: true });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-card text-foreground max-w-md w-full rounded-lg shadow-2xl border border-border">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-semibold">
                        {user ? 'Edit User' : 'Create User'}
                    </h2>
                    <button onClick={onClose} className="text-foreground/60 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4 overflow-y-auto">
                    {/* Name */}
                    <div>
                        <label className="block font-medium mb-1">Full Name <span className="text-destructive">*</span></label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"

                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium mb-1">Email Address <span className="text-destructive">*</span></label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                            })}
                            className="w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"

                            placeholder="john.doe@company.com"
                        />
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Role */}
                        <div>
                            <label className="block font-medium mb-1">Role</label>
                            <select
                                {...register('role')}
                                className="w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"

                            >
                                <option value="user">User</option>
                                <option value="readonly">Read Only</option>
                            </select>
                        </div>
                        {/* Status */}
                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"

                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Password fields are only shown when creating a new user */}
                    {!user && (
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block font-medium">Temporary Password <span className="text-destructive">*</span></label>
                                    <button type="button" onClick={handleGeneratePassword} className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                                        Generate
                                    </button>
                                </div>
                                <PasswordInput
                                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                                    placeholder="Enter a temporary password"
                                    className={errors.confirmPassword ? 'border-destructive w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary' : 'w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary'}

                                />
                                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Confirm Password <span className="text-destructive">*</span></label>
                                <PasswordInput
                                    {...register('confirmPassword', {
                                        required: 'Please confirm the password',
                                        validate: value => value === watch('password') || 'Passwords do not match'
                                    })}
                                    placeholder="Confirm the password"
                                    className={errors.confirmPassword ? 'border-destructive w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary' : 'w-full px-3 py-2 bg-input dark:bg-card border border-border text-foreground dark:text-card-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary'}

                                />
                                {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <button type="button" onClick={onClose} className="px-5 py-2 border border-border rounded-lg hover:bg-accent">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-7 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {isSubmitting ? 'Saving...' : (user ? 'Update User' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}