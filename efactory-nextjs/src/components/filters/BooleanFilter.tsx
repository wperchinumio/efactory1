import React from 'react';
import CheckBox from '@/components/ui/checkbox';

interface BooleanFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function BooleanFilter({ 
  label, 
  checked, 
  onChange, 
  className = '' 
}: BooleanFilterProps) {
  return (
    <div className={`inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 ${className}`}>
      <CheckBox
        id={label.toLowerCase().replace(/\s+/g, '-')}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label 
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
      >
        {label.toUpperCase()}
      </label>
    </div>
  );
}
