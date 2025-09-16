import { useMemo } from 'react';
import type { GridFilter } from '@/types/api/grid';

// Lightweight placeholder to avoid import error; returns identity by default
export function usePriorityFilters() {
  const applyPriorityFilters = useMemo(() => {
    return (filter: GridFilter): GridFilter => filter;
  }, []);
  return { applyPriorityFilters };
}


