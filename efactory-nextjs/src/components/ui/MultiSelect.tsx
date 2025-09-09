import React, { useState, useRef, useEffect } from 'react';
import CheckBox from './CheckBox';
import { IconChevronDown, IconCheck, IconSearch, IconX } from '@tabler/icons-react';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
}

export interface MultiSelectProps {
  value?: string[];
  onValueChange: (value: string[]) => void;
  options?: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  icon?: React.ComponentType<any>;
  emptyMessage?: string;
  showSearch?: boolean;
  showCheckboxes?: boolean;
  maxDisplayItems?: number;
  clearable?: boolean;
  applyMode?: boolean;
}

const MultiSelect = ({ 
  value = [], 
  onValueChange, 
  options = [], 
  placeholder = "Select options...", 
  searchPlaceholder = "Search...",
  className = "",
  disabled = false,
  size = 'normal',
  icon: Icon = undefined,
  emptyMessage = "No options found.",
  showSearch = true,
  showCheckboxes = true,
  maxDisplayItems = 2,
  clearable = true,
  applyMode = false
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(value) ? value : []);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Sync with external value changes
  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : []);
  }, [value]);

  // Filter options based on search query
  const filteredOptions = showSearch 
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside (ignore clicks inside dropdown)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = !!(containerRef.current && containerRef.current.contains(target));
      const clickedInsideDropdown = !!(dropdownRef.current && dropdownRef.current.contains(target as Node));
      if (!clickedInsideTrigger && !clickedInsideDropdown) {
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

  const handleToggleOption = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    
    setSelectedValues(newSelectedValues);
    if (!applyMode) onValueChange(newSelectedValues);
  };

  const handleClearAll = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedValues([]);
    onValueChange([]);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery('');
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    
    const selectedOptions = selectedValues
      .map(val => options.find(opt => opt.value === val))
      .filter(Boolean) as MultiSelectOption[];
    
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map(opt => opt.label).join(', ');
    }
    
    return `${selectedOptions.slice(0, maxDisplayItems).map(opt => opt.label).join(', ')} +${selectedOptions.length - maxDisplayItems} more`;
  };

  const hasActiveSelection = selectedValues.length > 0;

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
          <span className={`truncate ${hasActiveSelection ? 'text-font-color font-medium' : 'text-font-color-100'}`}>
            {getDisplayText()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {clearable && hasActiveSelection && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-0.5 hover:bg-primary-10 rounded transition-colors"
            >
              <IconX className={`${iconSizeClasses[size]} text-font-color-100`} />
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
          ref={dropdownRef}
          className="fixed mt-1 z-[99999] bg-card-color border border-border-color rounded-lg shadow-xl overflow-hidden min-w-[250px]"
          style={{
            top: (containerRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY + 4,
            left: (containerRef.current?.getBoundingClientRect().left || 0) + window.scrollX,
            width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 250)
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

          {/* Header with Clear All */}
          <div className="p-2 border-b border-border-color bg-primary-10/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-font-color">
                {selectedValues.length} selected
              </span>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                onClick={() => handleClearAll()}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-font-color-100 text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    flex items-center gap-3 px-3 py-2 hover:bg-primary-10 transition-colors
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  onClick={() => !option.disabled && handleToggleOption(option.value)}
                >
                  {showCheckboxes && (
                    <CheckBox
                      checked={selectedValues.includes(option.value)}
                      onChange={(checked) => {
                        if (option.disabled) return;
                        handleToggleOption(option.value);
                      }}
                      mode="emulated"
                    />
                  )}
                  {option.icon && (
                    <option.icon className={`${iconSizeClasses[size]} flex-shrink-0 text-font-color-100`} />
                  )}
                  <span className="text-sm text-font-color flex-1 truncate">
                    {option.label}
                  </span>
                  {!showCheckboxes && selectedValues.includes(option.value) && (
                    <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
          {applyMode && (
            <div className="flex items-center justify-end gap-3 p-3 border-t border-border-color bg-card-color">
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-md border border-border-color"
                onClick={() => {
                  setSelectedValues(Array.isArray(value) ? value : []);
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-md border border-primary bg-primary text-white"
                onClick={() => {
                  onValueChange(selectedValues);
                  setIsOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

