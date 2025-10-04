import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Use React.ComponentPropsWithoutRef to get all standard input props
interface PasswordInputProps extends React.ComponentPropsWithoutRef<'input'> {}

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        {...props}
        className={`w-full px-3 py-2 pr-10 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${props.className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}