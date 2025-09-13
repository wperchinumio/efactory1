import React, { useState } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FilterTotalProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

const TOTAL_OPTIONS = [
  { key: 'No totals', value: '' },
  { key: 'Total - By Item', value: 'item' },
  { key: 'Total - By Warehouse', value: 'warehouse' },
  { key: 'Total - By Account', value: 'account' }
];

export default function FilterTotal({ 
  value = '', 
  onChange, 
  className = '' 
}: FilterTotalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    const option = TOTAL_OPTIONS.find(o => o.value === value);
    return option ? option.key : 'No totals';
  };

  const hasActiveSelection = value && value !== '';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 text-left text-xs font-medium
          bg-card-color border border-border-color
          rounded-lg shadow-sm hover:bg-primary-10
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-all duration-200 flex items-center justify-between
          ${hasActiveSelection ? 'text-primary border-primary bg-primary-10' : 'text-font-color'}
        `}
        style={{ minWidth: '140px', maxWidth: '180px' }}
      >
        <span className="truncate text-xs">{getDisplayText()}</span>
        <ChevronDownIcon 
          className={`h-3 w-3 text-font-color-100 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute z-20 mt-2 w-full bg-card-color border border-border-color rounded-xl shadow-xl overflow-hidden"
            style={{ 
              width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 180)
            }}
          >
            {/* Options List */}
            <div className="py-1">
              {TOTAL_OPTIONS.map((option, index) => {
                const isSelected = value === option.value;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectOption(option.value)}
                    className={`
                      w-full flex items-center px-3 py-2 hover:bg-primary-10 cursor-pointer transition-colors text-left
                      ${isSelected ? 'bg-primary-10 text-primary' : 'text-font-color'}
                    `}
                  >
                    <div className="flex items-center justify-center w-3 h-3 mr-2">
                      {isSelected && (
                        <CheckIcon className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <span className="text-xs flex-1 truncate">
                      {option.key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
