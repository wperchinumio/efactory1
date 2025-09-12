import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', style, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== null && value !== '';
    const isEmpty = !hasValue;
    
    return (
      <input
        type={type}
        ref={ref}
        value={value}
        className={`
          w-full px-3 py-2 rounded-lg text-sm transition-all duration-200
          bg-card-color border border-border-color text-font-color
          ${hasValue ? 'font-medium' : ''}
          focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary
          hover:shadow-md
          ${className}
        `}
        style={style}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
