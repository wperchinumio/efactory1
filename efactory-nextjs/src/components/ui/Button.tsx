import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'secondary-outline';
  className?: string;
}

const Button = ({ onClick, children, disabled, variant = 'primary', className = '' }: ButtonProps) => {
  const baseClasses = 'btn rounded-md transition-colors duration-200';
  const variantClasses = variant === 'outline' ? 'border border-primary text-primary' : variant === 'secondary-outline' ? 'border border-gray-500 text-gray-500' : 'bg-primary text-white';
  const darkModeClasses = 'dark:bg-purple-800 dark:border dark:border-purple-800 dark:text-white';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${darkModeClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
