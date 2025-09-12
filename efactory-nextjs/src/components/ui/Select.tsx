import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value = '', onValueChange, children, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open]);

    return (
      <SelectContext.Provider value={{ value, onValueChange: onValueChange || (() => {}), open, setOpen }}>
        <div ref={containerRef} className="relative" {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = '', children, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectTrigger must be used within Select');

    return (
      <button
        ref={ref}
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm bg-card-color border-border-color text-font-color placeholder:text-font-color-100 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => context.setOpen(!context.open)}
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectValue must be used within Select');

    return (
      <span ref={ref} {...props}>
        {context.value || placeholder}
      </span>
    );
  }
);
SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = '', children, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectContent must be used within Select');

    if (!context.open) return null;

    return (
      <div
        ref={ref}
        className={`absolute top-full z-50 w-full rounded-lg border border-border-color bg-card-color mt-1 shadow-md ${className}`}
        {...props}
      >
        <div className="max-h-60 overflow-auto p-1">
          {children}
        </div>
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = '', value, children, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectItem must be used within Select');

    return (
      <div
        ref={ref}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm text-font-color outline-none hover:bg-primary-10 focus:bg-primary-10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
        onClick={() => {
          context.onValueChange(value);
          context.setOpen(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
