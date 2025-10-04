import React from 'react';
import { Check } from 'lucide-react';

// Use React.ComponentPropsWithoutRef to get all standard input props like 'name', 'disabled', etc.
interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}

export function Checkbox({ label, checked, ...props }: CheckboxProps) {
  const id = React.useId();

  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer group">
      <div className="relative flex items-center">
        {/* The hidden, native checkbox for accessibility and state management */}
        <input
          type="checkbox"
          id={id}
          checked={checked}
          className="peer sr-only" // sr-only hides it visually but keeps it accessible
          {...props}
        />
        
        {/* The custom-styled checkbox */}
        <div
          className={`w-5 h-5 bg-input border-2 border-border rounded transition-colors group-hover:border-primary
                      peer-checked:bg-primary peer-checked:border-primary
                      peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background`}
        >
          {/* The checkmark icon, shown only when checked */}
          {checked && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
      </div>
      <span className="ml-3 text-foreground select-none">{label}</span>
    </label>
  );
}