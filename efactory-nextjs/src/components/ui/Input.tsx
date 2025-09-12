import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', style, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={`
        w-full px-3 py-2 rounded-lg text-sm
        bg-card-color border border-border-color text-font-color
        focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary
        hover:shadow-md transition-all duration-200
        placeholder:text-font-color-100
        ${className}
      `}
      style={style}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
