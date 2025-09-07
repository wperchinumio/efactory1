// Utility functions for handling global filter data
// Extracted from useGlobalFilterData hook to improve maintainability

import type { FilterOption } from '@/types/api';

export interface GlobalFilterData {
  warehouses: Record<string, any>;
  sub_warehouses: Record<string, any>;
  countries: Record<string, string>;
  states: Record<string, any>;
  carriers: Record<string, string>;
  order_types: Record<string, string>;
  accounts: string[];
  loading: boolean;
  error: string | null;
}

export interface FilterOptions {
  getWarehouseOptions: () => FilterOption[];
  getAccountOptions: (selectedWarehouses?: string[]) => FilterOption[];
  getCountryOptions: () => FilterOption[];
  getStateOptions: (selectedCountry?: string) => FilterOption[];
  getChannelOptions: () => FilterOption[];
  getDestinationOptions: () => FilterOption[];
  getOrderTypeOptions: () => FilterOption[];
}

/**
 * Extract accounts from nested object structures
 * This function recursively traverses objects to find account arrays
 */
export function extractAccountsFromObject(
  obj: any, 
  accountsArray: string[], 
  path = ''
): void {
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const currentPath = path ? `${path}.${key}` : key;
    
    if (Array.isArray(value)) {
      // Found an array - check if it contains account numbers
      value.forEach(item => {
        if (typeof item === 'string' || typeof item === 'number') {
          // Looks like an account number
          accountsArray.push(String(item));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // Nested object - recurse deeper
      extractAccountsFromObject(value, accountsArray, currentPath);
    }
  });
}

/**
 * Process global API data and extract relevant information
 */
export function processGlobalApiData(globalData: any): Partial<GlobalFilterData> {
  const accounts: string[] = [];
  
  // Extract accounts from warehouses data
  if (globalData.warehouses) {
    extractAccountsFromObject(globalData.warehouses, accounts);
  }
  
  // Remove duplicates
  const uniqueAccounts = [...new Set(accounts)];
  
  return {
    warehouses: globalData.warehouses || {},
    sub_warehouses: globalData.sub_warehouses || {},
    countries: globalData.countries || {},
    states: globalData.states || {},
    carriers: globalData.carriers || {},
    order_types: globalData.order_types || {},
    accounts: uniqueAccounts,
  };
}

/**
 * Create filter options from global data
 */
export function createFilterOptions(data: GlobalFilterData): FilterOptions {
  return {
    getWarehouseOptions: () => {
      return Object.entries(data.warehouses).map(([key, value]) => ({
        value: key,
        label: typeof value === 'string' ? value : key,
        name: key,
      }));
    },

    getAccountOptions: (selectedWarehouses?: string[]) => {
      let accounts = data.accounts;
      
      // Filter accounts based on selected warehouses if provided
      if (selectedWarehouses && selectedWarehouses.length > 0) {
        // This is a simplified filter - you might need more complex logic
        // based on your specific requirements
        accounts = data.accounts.filter(account => {
          // Add your filtering logic here
          return true;
        });
      }
      
      return accounts.map(account => ({
        value: account,
        label: account,
        name: account,
      }));
    },

    getCountryOptions: () => {
      return Object.entries(data.countries).map(([key, value]) => ({
        value: key,
        label: value,
        name: key,
      }));
    },

    getStateOptions: (selectedCountry?: string) => {
      if (!selectedCountry || !data.states[selectedCountry]) {
        return [];
      }
      
      const countryStates = data.states[selectedCountry];
      if (typeof countryStates === 'object' && countryStates !== null) {
        return Object.entries(countryStates).map(([key, value]) => ({
          value: key,
          label: typeof value === 'string' ? value : key,
          name: key,
        }));
      }
      
      return [];
    },

    getChannelOptions: () => {
      // This might need to be implemented based on your data structure
      return [];
    },

    getDestinationOptions: () => {
      // This might need to be implemented based on your data structure
      return [];
    },

    getOrderTypeOptions: () => {
      return Object.entries(data.order_types).map(([key, value]) => ({
        value: key,
        label: value,
        name: key,
      }));
    },
  };
}

/**
 * Validate global filter data
 */
export function validateGlobalFilterData(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Add validation logic here
  return true;
}

/**
 * Get default filter values
 */
export function getDefaultFilterValues(): Record<string, any> {
  return {
    warehouses: [],
    accounts: [],
    countries: [],
    states: [],
    carriers: [],
    order_types: [],
  };
}

/**
 * Apply filter to data
 */
export function applyFilters<T>(
  data: T[], 
  filters: Record<string, any>
): T[] {
  // Implement your filtering logic here
  // This is a placeholder - you'll need to implement based on your specific needs
  return data;
}

/**
 * Clear all filters
 */
export function clearAllFilters(): Record<string, any> {
  return getDefaultFilterValues();
}
