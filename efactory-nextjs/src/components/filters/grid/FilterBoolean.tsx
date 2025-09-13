import React from 'react';
import CheckBox from '@/components/ui/CheckBox';
import type { BooleanFilterConfig } from '@/types/api/filters';

interface FilterBooleanProps {
  config: BooleanFilterConfig;
  value?: boolean | null;
  onChange: (value: boolean) => void;
  className?: string;
}

export default function FilterBoolean({ 
  config, 
  value, 
  onChange, 
  className = '' 
}: FilterBooleanProps) {
  const handleChange = (checked: boolean) => {
    console.log('FilterBoolean onChange:', config.field, checked);
    onChange(checked);
  };

  return (
    <div className={`inline-flex items-center px-3 py-2 bg-card-color rounded-md shadow-sm border border-border-color ${className}`}>
      <CheckBox
        id={`${config.field}-filter`}
        checked={value === true}
        onChange={handleChange}
        className="mr-2"
        mode="emulated"
        size="small"
      />
      <span className={`text-xs font-medium select-none transition-colors ${
        value ? 'text-primary' : 'text-font-color-100'
      }`}>
        {value ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}