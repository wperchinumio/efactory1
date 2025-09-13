import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { TextInputFilterConfig } from '@/types/api/filters';

interface FilterTextInputProps {
  config: TextInputFilterConfig;
  value?: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export default function FilterTextInput({ 
  config, 
  value, 
  onChange, 
  className = '' 
}: FilterTextInputProps) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleApply = () => {
    const trimmedValue = inputValue.trim();
    onChange(trimmedValue || null);
  };

  const handleClear = () => {
    setInputValue('');
    onChange(null);
  };

  const handleBlur = () => {
    handleApply();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {config.iconClassName ? (
            <i className={`${config.iconClassName} h-4 w-4 text-gray-400 dark:text-gray-500`} />
          ) : (
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          placeholder="Search..."
          className={`
            w-full pl-10 pr-10 py-2 text-sm border rounded-md shadow-sm
            bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
          `}
          style={{ width: config.width || '200px' }}
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-md transition-colors"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
}
