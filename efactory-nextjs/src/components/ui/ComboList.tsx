import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconSearch, IconCheck } from '@tabler/icons-react';

export interface ComboListOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
}

export interface ComboListProps {
  value?: string;
  onValueChange: (value: string) => void;
  options?: ComboListOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  icon?: React.ComponentType<any>;
  emptyMessage?: string;
  showSearch?: boolean;
  clearable?: boolean;
}

const ComboList = ({ 
  value, 
  onValueChange, 
  options = [], 
  placeholder = "Select option...", 
  searchPlaceholder = "Search...",
  className = "",
  disabled = false,
  size = 'normal',
  icon: Icon = undefined,
  emptyMessage = "No options found.",
  showSearch = true,
  clearable = false
}: ComboListProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    normal: 'px-3 py-2 text-base',
    large: 'px-4 py-3 text-lg'
  };

  const iconSizeClasses = {
    small: 'w-4 h-4',
    normal: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  // Filter options based on search query (only if search is enabled)
  const filteredOptions = showSearch 
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current && showSearch) {
      inputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} style={{ zIndex: isOpen ? 99999 : 'auto' }}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`
          cursor-pointer rounded-lg bg-card-color border border-border-color 
          ${sizeClasses[size]} w-full
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary 
          shadow-sm hover:shadow-md transition-all duration-200 text-font-color
          flex items-center justify-between gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isOpen ? 'ring-2 ring-primary ring-opacity-20 border-primary' : ''}
        `}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {Icon && <Icon className={`${iconSizeClasses[size]} text-font-color-100 flex-shrink-0`} />}
          {selectedOption?.icon && (
            <selectedOption.icon className={`${iconSizeClasses[size]} text-font-color-100 flex-shrink-0`} />
          )}
          <span className={`truncate ${selectedOption ? 'text-font-color' : 'text-font-color-100'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {clearable && selectedOption && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-primary-10 rounded transition-colors"
            >
              <IconCheck className={`${iconSizeClasses[size]} text-font-color-100 rotate-45`} />
            </button>
          )}
          <IconChevronDown 
            className={`${iconSizeClasses[size]} text-font-color-100 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div 
          className="fixed mt-1 z-[99999] bg-card-color border border-border-color rounded-lg shadow-xl overflow-hidden min-w-[200px]"
          style={{
            top: (containerRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY + 4,
            left: (containerRef.current?.getBoundingClientRect().left || 0) + window.scrollX,
            width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 200)
          }}
        >
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b border-border-color">
              <div className="relative">
                <IconSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100" />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-transparent border-0 outline-none text-font-color placeholder:text-font-color-100"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-font-color-100 text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    w-full text-left px-3 py-2 flex items-center gap-2
                    hover:bg-primary-10 transition-colors
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${option.value === value ? 'bg-primary-10 text-primary font-medium' : 'text-font-color'}
                  `}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  {option.icon && (
                    <option.icon className={`${iconSizeClasses[size]} flex-shrink-0`} />
                  )}
                  <span className="flex-1 truncate text-sm">
                    {option.label}
                  </span>
                  {option.value === value && (
                    <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboList;

