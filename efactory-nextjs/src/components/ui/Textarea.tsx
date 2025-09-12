import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', style, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== null && value !== '';
    const isEmpty = !hasValue;
    
    return (
      <textarea
        ref={ref}
        value={value}
        className={`
          w-full px-3 py-2 rounded-lg text-sm resize-none transition-all duration-200
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
Textarea.displayName = 'Textarea';

export { Textarea };
