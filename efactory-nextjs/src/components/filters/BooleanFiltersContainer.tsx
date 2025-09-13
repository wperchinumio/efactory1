import React from 'react';
import BooleanFilter from './BooleanFilter';

interface BooleanFilterItem {
  key: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface BooleanFiltersContainerProps {
  filters: BooleanFilterItem[];
  className?: string;
}

export default function BooleanFiltersContainer({ 
  filters, 
  className = '' 
}: BooleanFiltersContainerProps) {
  if (filters.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {filters.map((filter, index) => (
        <React.Fragment key={filter.key}>
          <BooleanFilter
            label={filter.label}
            checked={filter.checked}
            onChange={filter.onChange}
          />
          {index < filters.length - 1 && (
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
