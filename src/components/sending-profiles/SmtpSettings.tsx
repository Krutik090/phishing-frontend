import { useState } from 'react';
import type { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface SmtpSettingsProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
}

// Utility to safely access nested errors
function getNestedError(errors: FieldErrors<any>, path: string) {
  return path.split('.').reduce<any>((obj, key) => obj && obj[key], errors);
}

// Password input with show/hide toggle
function PasswordInput({ register, name, placeholder, className }: any) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        {...register(name)}
        placeholder={placeholder}
        className={className}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function SmtpSettings({ register, errors }: SmtpSettingsProps) {
  // Safely access nested SMTP errors
  const hostError = getNestedError(errors, 'smtp.host');
  const portError = getNestedError(errors, 'smtp.port');
  const usernameError = getNestedError(errors, 'smtp.username');
  const passwordError = getNestedError(errors, 'smtp.password');

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full"></span>
        SMTP Configuration
      </h3>
      
      {/* Host and Port */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-foreground">
            Host <span className="text-red-500">*</span>
          </label>
          <input 
            {...register('smtp.host', { required: 'SMTP host is required' })} 
            className={`w-full px-3 py-2 bg-input dark:bg-card border ${
              hostError ? 'border-red-500' : 'border-border'
            } rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors`} 
            placeholder="smtp.office365.com"
          />
          {hostError && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {hostError.message}
            </p>
          )}
        </div>
        
        <div>
          <label className="block font-medium mb-1 text-foreground">
            Port <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            {...register('smtp.port', { 
              valueAsNumber: true, 
              required: 'Port is required',
              min: { value: 1, message: 'Port must be greater than 0' },
              max: { value: 65535, message: 'Port must be less than 65536' }
            })} 
            className={`w-full px-3 py-2 bg-input dark:bg-card border ${
              portError ? 'border-red-500' : 'border-border'
            } rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors`} 
            placeholder="587"
          />
          {portError && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {portError.message}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Common ports: 25 (unsecured), 587 (TLS), 465 (SSL)
          </p>
        </div>
      </div>
      
      {/* Authentication Type Selector */}
      <div>
        <label className="block font-medium mb-2 text-foreground">Authentication Type</label>
        <div className="flex gap-2 mb-3">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              {...register('smtp.authType')} 
              value="none"
              className="accent-primary w-4 h-4 mr-2" 
            />
            <span className="text-sm text-foreground">None</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              {...register('smtp.authType')} 
              value="password"
              className="accent-primary w-4 h-4 mr-2"
              defaultChecked
            />
            <span className="text-sm text-foreground">Username/Password</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              {...register('smtp.authType')} 
              value="oauth2"
              className="accent-primary w-4 h-4 mr-2" 
            />
            <span className="text-sm text-foreground">OAuth2</span>
          </label>
        </div>
      </div>

      {/* Username and Password */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-foreground">Username</label>
          <input 
            {...register('smtp.username')} 
            className={`w-full px-3 py-2 bg-input dark:bg-card border ${
              usernameError ? 'border-red-500' : 'border-border'
            } rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors`} 
            placeholder="admin@company.com"
          />
          {usernameError && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {usernameError.message}
            </p>
          )}
        </div>
        
        <div>
          <label className="block font-medium mb-1 text-foreground">Password</label>
          <PasswordInput
            register={register}
            name="smtp.password"
            placeholder="••••••••"
            className={`w-full px-3 py-2 pr-10 bg-input dark:bg-card border ${
              passwordError ? 'border-red-500' : 'border-border'
            } rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors`}
            error={passwordError}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {passwordError.message}
            </p>
          )}
        </div>
      </div>

      {/* Security Options */}
      <div className="space-y-3 pt-2">
        <h4 className="font-medium text-foreground text-sm">Security Options</h4>
        <div className="flex flex-col gap-3">
          <label className="inline-flex items-start font-medium text-foreground">
            <input 
              type="checkbox" 
              {...register('smtp.secure')} 
              className="accent-primary w-4 h-4 mr-3 mt-0.5" 
            />
            <div>
              <span className="text-sm">Use TLS/SSL (Secure Connection)</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Encrypts the connection to the SMTP server. Recommended for production.
              </p>
            </div>
          </label>
          
          <label className="inline-flex items-start font-medium text-foreground">
            <input 
              type="checkbox" 
              {...register('smtp.rejectUnauthorized')} 
              className="accent-primary w-4 h-4 mr-3 mt-0.5" 
            />
            <div>
              <span className="text-sm">Reject Unauthorized Certificates</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Reject connections to servers with invalid SSL certificates. Keep enabled for security.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Advanced Settings */}
      <details className="mt-4">
        <summary className="cursor-pointer font-medium text-foreground text-sm hover:text-primary transition-colors">
          Advanced Settings
        </summary>
        <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          <div>
            <label className="block font-medium mb-1 text-foreground text-sm">Connection Timeout (ms)</label>
            <input 
              type="number" 
              {...register('smtp.connectionTimeout')} 
              className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
              placeholder="60000"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Time to wait for connection (default: 60000ms)
            </p>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-foreground text-sm">Socket Timeout (ms)</label>
            <input 
              type="number" 
              {...register('smtp.socketTimeout')} 
              className="w-full px-3 py-2 bg-input dark:bg-card border border-border rounded-md text-foreground dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" 
              placeholder="60000"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Time to wait for socket inactivity (default: 60000ms)
            </p>
          </div>
        </div>
      </details>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 dark:text-blue-200 text-sm">SMTP Security Tips</h5>
            <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
              <li>• Use app-specific passwords for Gmail/Outlook accounts</li>
              <li>• Enable 2FA on your email account for additional security</li>
              <li>• Test with a dedicated sending account, not your personal email</li>
              <li>• Monitor your email provider's sending limits and quotas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
