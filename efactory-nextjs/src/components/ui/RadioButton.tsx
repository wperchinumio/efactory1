import React from 'react';

export interface RadioButtonProps {
  checked?: boolean;
  onChange?: (value: string) => void;
  value: string;
  name: string;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  className?: string;
  id?: string;
}

const RadioButton = ({ 
  checked = false, 
  onChange, 
  value,
  name,
  label, 
  disabled = false, 
  size = 'normal',
  className = '',
  id
}: RadioButtonProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    normal: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const labelSizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg'
  };

  const dotSizeClasses = {
    small: 'w-1.5 h-1.5',
    normal: 'w-2 h-2',
    large: 'w-2.5 h-2.5'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled && e.target.checked) {
      onChange(value);
    }
  };

  const radioId = id || `radio-${name}-${value}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            ${sizeClasses[size]}
            appearance-none
            bg-card-color
            border-2 border-border-color
            rounded-full
            cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary
            hover:border-primary
            checked:bg-card-color checked:border-primary
            checked:hover:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border-color
            relative
          `}
        />
        {/* Custom radio dot */}
        {checked && (
          <div className={`
            absolute inset-0 flex items-center justify-center pointer-events-none
            ${disabled ? 'opacity-50' : ''}
          `}>
            <div className={`
              ${dotSizeClasses[size]}
              bg-primary
              rounded-full
              transition-all duration-200
            `} />
          </div>
        )}
      </div>
      {label && (
        <label 
          htmlFor={radioId}
          className={`
            ${labelSizeClasses[size]}
            text-font-color
            cursor-pointer
            select-none
            transition-colors duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary'}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;

