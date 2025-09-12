import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`
        w-full px-3 py-2 rounded-lg text-sm resize-none
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
Textarea.displayName = 'Textarea';

export { Textarea };
