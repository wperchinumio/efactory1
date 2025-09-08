import React, { useEffect, useId, useRef } from 'react';

export interface CheckBoxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  className?: string; // wrapper extra classes
  id?: string;
  name?: string;
  indeterminate?: boolean;
  inputClassName?: string; // input extra classes
  labelClassName?: string; // label extra classes
  mode?: 'native' | 'emulated';
}

const CheckBox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false, 
  size = 'normal',
  className = '',
  id,
  name,
  indeterminate = false,
  inputClassName = '',
  labelClassName = '',
  mode = 'native'
}: CheckBoxProps) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    normal: 'w-4 h-4', 
    large: 'w-5 h-5'
  };

  const labelSizeClasses = {
    small: 'text-sm',
    normal: 'text-sm', // Match Luno's 14px/20px
    large: 'text-base'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.checked);
    }
  };

  // Prevent parent clickable containers (e.g., links, row handlers) from
  // intercepting the click which can navigate to "#" and scroll the page.
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleInputMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Stable id across SSR/CSR to avoid hydration mismatch
  const reactId = useId();
  const safeId = `checkbox-${reactId}`.replace(/[^a-zA-Z0-9_-]/g, '-');
  const checkboxId = id || safeId;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  // Emulated mode: use button but prevent all default behaviors that cause scrolling
  if (mode === 'emulated') {
    const boxSize = size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4';
    const iconSize = size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-3.5 h-3.5' : 'w-3 h-3';
    return (
      <div className={`inline-flex items-center gap-2 ${className}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          disabled={disabled}
          tabIndex={-1}
          onMouseDown={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            // Prevent focus to avoid scrolling
            e.currentTarget.blur();
          }}
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            if (!disabled) onChange?.(!checked); 
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') { 
              e.preventDefault(); 
              if (!disabled) onChange?.(!checked); 
            }
          }}
          onFocus={(e) => {
            // Immediately blur to prevent scrolling
            e.currentTarget.blur();
          }}
          className={`
            ${boxSize} rounded border border-border-color flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
            ${(checked || indeterminate) ? 'bg-primary border-primary' : 'bg-card-color'}
            ${inputClassName}
          `}
        >
          {checked && !indeterminate && (
            <svg className={`${iconSize} text-white`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {indeterminate && (
            <svg className={`${iconSize} text-white`} viewBox="0 0 20 20" fill="currentColor">
              <rect x="5" y="9" width="10" height="2" rx="1" />
            </svg>
          )}
        </button>
        {label && (
          <span className={`${labelSizeClasses[size]} text-font-color select-none ${labelClassName}`}>{label}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`form-check ${className}`} onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        onChange={handleChange}
        onClick={handleInputClick}
        onMouseDown={handleInputMouseDown}
        disabled={disabled}
        ref={inputRef}
        aria-checked={indeterminate ? 'mixed' : checked}
        className={`form-check-input ${size === 'small' ? 'scale-90' : size === 'large' ? 'scale-110' : ''} ${inputClassName}`}
      />
      {label && (
        <label htmlFor={checkboxId} className={`form-check-label ${labelSizeClasses[size]} text-font-color-100 ${labelClassName}`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default CheckBox;