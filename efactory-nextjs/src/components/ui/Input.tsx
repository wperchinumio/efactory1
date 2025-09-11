import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', style, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${className}`}
      style={{
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--card-color)',
        color: 'var(--font-color)',
        ...style
      }}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
