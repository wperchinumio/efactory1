// Utility functions for data processing and transformation
// Extracted from components to improve reusability and maintainability

import type { PaginationState, SortConfig } from '@/types/api';

/**
 * Sort array of objects by specified field
 */
export function sortData<T>(
  data: T[],
  sortConfig: SortConfig
): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as any)[sortConfig.field];
    const bValue = (b as any)[sortConfig.field];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter array of objects based on search criteria
 */
export function filterData<T>(
  data: T[],
  searchTerm: string,
  searchFields: string[]
): T[] {
  if (!searchTerm.trim()) return data;

  const term = searchTerm.toLowerCase();
  
  return data.filter(item => {
    return searchFields.some(field => {
      const value = (item as any)[field];
      if (value === null || value === undefined) return false;
      
      return value.toString().toLowerCase().includes(term);
    });
  });
}

/**
 * Paginate array of data
 */
export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): { data: T[]; pagination: PaginationState } {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  const pagination: PaginationState = {
    page,
    pageSize,
    total: data.length,
    totalPages: Math.ceil(data.length / pageSize),
  };

  return {
    data: paginatedData,
    pagination,
  };
}

/**
 * Group array of objects by specified field
 */
export function groupBy<T>(
  data: T[],
  field: string
): Record<string, T[]> {
  return data.reduce((groups, item) => {
    const key = (item as any)[field];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Get unique values from array of objects for specified field
 */
export function getUniqueValues<T>(
  data: T[],
  field: string
): any[] {
  const values = data.map(item => (item as any)[field]);
  return [...new Set(values)];
}

/**
 * Calculate statistics for numeric fields
 */
export function calculateStats<T>(
  data: T[],
  field: string
): {
  min: number;
  max: number;
  sum: number;
  average: number;
  count: number;
} {
  const values = data
    .map(item => (item as any)[field])
    .filter(value => typeof value === 'number' && !isNaN(value));

  if (values.length === 0) {
    return { min: 0, max: 0, sum: 0, average: 0, count: 0 };
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = sum / values.length;

  return { min, max, sum, average, count: values.length };
}

/**
 * Transform data for charts
 */
export function transformForChart<T>(
  data: T[],
  xField: string,
  yField: string
): Array<{ x: any; y: any }> {
  return data.map(item => ({
    x: (item as any)[xField],
    y: (item as any)[yField],
  }));
}

/**
 * Flatten nested object structure
 */
export function flattenObject(
  obj: any,
  prefix = '',
  result: Record<string, any> = {}
): Record<string, any> {
  Object.keys(obj).forEach(key => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }

  return obj;
}

/**
 * Merge two objects deeply
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = (source as any)[key];
    const targetValue = (result as any)[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      (result as any)[key] = deepMerge(targetValue, sourceValue);
    } else {
      (result as any)[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Debounce function
 */
export function debounce<T extends any[]>(
  func: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends any[]>(
  func: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let lastCall = 0;

  return (...args: T) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', options);
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
