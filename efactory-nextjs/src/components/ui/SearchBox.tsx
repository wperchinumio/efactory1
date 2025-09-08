import React, { useEffect, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';

export interface SearchBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  className?: string;
  showClearButton?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
}

const SearchBox = ({ 
  value = '', 
  onChange, 
  onSearch,
  onClear,
  placeholder = 'Search...', 
  disabled = false, 
  size = 'normal',
  className = '',
  showClearButton = true,
  autoFocus = false,
  debounceMs = 300
}: SearchBoxProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Keep internal value in sync when used as a controlled component
  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    normal: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg'
  };

  const iconSizeClasses = {
    small: 'w-4 h-4',
    normal: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  // Pad input so placeholder/text doesn't overlap the icon on the left
  // and leaves room for the clear button on the right when visible
  const paddingClasses = {
    small: `${showClearButton && internalValue ? 'pr-8' : 'pr-3'} pl-8`,
    normal: `${showClearButton && internalValue ? 'pr-10' : 'pr-4'} pl-10`,
    large: `${showClearButton && internalValue ? 'pr-12' : 'pr-5'} pl-12`
  } as const;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }

    // Debounced search
    if (onSearch && debounceMs > 0) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      const timer = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
      
      setDebounceTimer(timer);
    } else if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      onSearch(internalValue);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className={`
        absolute left-0 top-0 h-full flex items-center justify-center pointer-events-none
        ${size === 'small' ? 'w-8' : size === 'large' ? 'w-12' : 'w-10'}
      `}>
        <IconSearch className={`${iconSizeClasses[size]} text-font-color-100`} />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`
          w-full
          ${sizeClasses[size]}
          ${paddingClasses[size]}
          bg-card-color
          border border-border-color
          rounded-lg
          text-font-color
          placeholder:text-font-color-100
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary
          hover:border-primary/50
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border-color
        `}
      />

      {/* Clear Button */}
      {showClearButton && internalValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute right-0 top-0 h-full flex items-center justify-center
            ${size === 'small' ? 'w-8' : size === 'large' ? 'w-12' : 'w-10'}
            text-font-color-100 hover:text-font-color
            transition-colors duration-200
            focus:outline-none focus:text-primary
          `}
        >
          <IconX className={`${iconSizeClasses[size]}`} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
