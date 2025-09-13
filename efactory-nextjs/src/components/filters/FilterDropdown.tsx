import React from 'react';
import GridMultiSelectFilter from './GridMultiSelectFilter';
import type { DropdownFilterConfig } from '@/types/api/filters';

interface FilterDropdownProps {
  config: DropdownFilterConfig;
  value?: string[]; // Changed to array for multi-select
  onChange: (value: string[]) => void; // Changed to array for multi-select
  className?: string;
}

export default function FilterDropdown({ 
  config, 
  value = [], 
  onChange, 
  className = '' 
}: FilterDropdownProps) {
  return (
    <GridMultiSelectFilter
      config={config}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}