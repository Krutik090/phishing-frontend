import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps extends React.ComponentPropsWithoutRef<'select'> {
  label?: string;
  containerClassName?: string;
}

export function Dropdown({ label, id, containerClassName, className, children, ...props }: DropdownProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  return (
    <div className={containerClassName}>
      {label && <label htmlFor={selectId} className="block font-medium mb-1">{label}</label>}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none bg-input border border-border rounded-md px-3 py-2 pr-8
                      focus:outline-none focus:ring-2 focus:ring-ring
                      ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground/70">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}