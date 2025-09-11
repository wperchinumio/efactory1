import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 resize-none ${className}`}
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
Textarea.displayName = 'Textarea';

export { Textarea };
