import React, { useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';

export interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'chart';
  chartColor?: 'chart1' | 'chart2' | 'chart3' | 'chart4' | 'chart5';
  size?: 'small' | 'normal' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const Button = ({ 
  onClick, 
  children, 
  disabled = false,
  loading = false,
  variant = 'primary', 
  chartColor = 'chart1',
  size = 'normal',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  className = '',
  type = 'button',
  fullWidth = false
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    small: iconOnly ? '' : 'px-2 py-1 text-xs',
    normal: iconOnly ? '' : 'px-3 py-1.5 text-sm',
    large: iconOnly ? '' : 'px-4 py-2 text-sm'
  };

  // Inline styles for icon-only buttons
  const iconOnlyStyles = iconOnly ? {
    width: size === 'small' ? '24px' : size === 'large' ? '44px' : '32px',
    height: size === 'small' ? '24px' : size === 'large' ? '44px' : '32px',
    minWidth: size === 'small' ? '24px' : size === 'large' ? '44px' : '32px',
    minHeight: size === 'small' ? '24px' : size === 'large' ? '44px' : '32px'
  } : {};
  
  // Variant classes - theme-aware and static colors
  const variantClasses = {
    // Theme-aware variants (use CSS custom properties that adapt to theme)
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary border border-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary border border-secondary',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300/20',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary border border-transparent',
    
    // Chart color variants (use chart color CSS custom properties)
    chart: chartColor === 'chart1' ? 'bg-chart-color1 text-white hover:bg-chart-color1/90 focus:ring-chart-color1 border border-chart-color1' :
           chartColor === 'chart2' ? 'bg-chart-color2 text-white hover:bg-chart-color2/90 focus:ring-chart-color2 border border-chart-color2' :
           chartColor === 'chart3' ? 'bg-chart-color3 text-white hover:bg-chart-color3/90 focus:ring-chart-color3 border border-chart-color3' :
           chartColor === 'chart4' ? 'bg-chart-color4 text-white hover:bg-chart-color4/90 focus:ring-chart-color4 border border-chart-color4' :
           'bg-chart-color5 text-white hover:bg-chart-color5/90 focus:ring-chart-color5 border border-chart-color5',
    
    // Static color variants
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-green-600',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 border border-yellow-600'
  };
  
  // Combine classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Handle loading state - loading takes precedence over disabled
  const isDisabled = disabled && !loading;
  
  // Handle click
  const handleClick = () => {
    if (isDisabled) return;
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };
  
  // Render icon
  const renderIcon = () => {
    if (loading) {
      return (
        <IconLoader2 
          className="animate-spin" 
          style={{
            animation: 'spin 1s linear infinite'
          }}
        />
      );
    }
    return icon;
  };
  
  // Render content
  const renderContent = () => {
    if (iconOnly) {
      return renderIcon();
    }
    
    if (!children && !icon) {
      return null;
    }
    
    const iconElement = renderIcon();
    const iconSize = size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5';
    
    if (iconElement) {
      const iconWithSize = React.cloneElement(iconElement as React.ReactElement<any>, {
        className: `${iconSize} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`
      });
      
      if (iconPosition === 'right') {
        return (
          <>
            {children}
            {iconWithSize}
          </>
        );
      } else {
        return (
          <>
            {iconWithSize}
            {children}
          </>
        );
      }
    }
    
    return children;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClasses}
      style={iconOnlyStyles}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
