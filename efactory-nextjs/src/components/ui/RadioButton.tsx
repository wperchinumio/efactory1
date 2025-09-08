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
  // Luno-native sizing uses 1rem radio with background-image dot.
  // We scale the input for visual sizes and adjust label font.
  const inputScaleBySize: Record<typeof size, string> = {
    small: 'scale-90',
    normal: '',
    large: 'scale-125'
  } as any;

  const labelSizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled && e.target.checked) {
      onChange(value);
    }
  };

  const radioId = id || `radio-${name}-${value}`;

  return (
    <div className={`form-radio ${className}`}>
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`form-radio-input ${inputScaleBySize[size]}`}
      />
      {label && (
        <label
          htmlFor={radioId}
          className={`form-radio-label ${labelSizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;

