import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  outline?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', children, variant = 'default', outline = false, ...props }, ref) => {
    const getVariantClasses = () => {
      if (outline) {
        switch (variant) {
          case 'secondary':
            return 'bg-transparent text-font-color border-font-color-200';
          case 'info':
            return 'bg-transparent text-info border-info';
          case 'success':
            return 'bg-transparent text-success border-success';
          case 'warning':
            return 'bg-transparent text-warning border-warning';
          case 'danger':
            return 'bg-transparent text-danger border-danger';
          default:
            return 'bg-transparent text-primary border-primary';
        }
      }
      switch (variant) {
        case 'secondary':
          return 'bg-font-color-200 text-font-color border-font-color-200';
        case 'info':
          return 'bg-info text-white border-info';
        case 'success':
          return 'bg-success text-white border-success';
        case 'warning':
          return 'bg-warning text-black border-warning';
        case 'danger':
          return 'bg-danger text-white border-danger';
        default:
          return 'bg-primary text-white border-primary';
      }
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantClasses()} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
