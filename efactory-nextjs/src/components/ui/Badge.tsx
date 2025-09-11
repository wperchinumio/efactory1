import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', children, variant = 'default', ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'secondary':
          return 'bg-font-color-200 text-font-color border-font-color-200';
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
