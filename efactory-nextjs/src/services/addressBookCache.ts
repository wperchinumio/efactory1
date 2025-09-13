import { readAddresses } from './api';
import { ReadAddressesResponse } from '../types/api/orderpoints';

interface AddressBookCacheEntry {
  data: ReadAddressesResponse['rows'];
  total: number;
  timestamp: number;
  filters: {
    page_num: number;
    page_size: number;
    filter?: any;
  };
}

interface AddressBookCache {
  [key: string]: AddressBookCacheEntry;
}

class AddressBookCacheService {
  private cache: AddressBookCache = {};
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (addresses change less frequently)

  private generateCacheKey(page_num: number, page_size: number, filter?: any): string {
    const filterKey = filter ? JSON.stringify(filter) : 'no-filter';
    return `addressbook_${page_num}_${page_size}_${filterKey}`;
  }

  private isCacheValid(entry: AddressBookCacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  async getAddressBookData(
    page_num: number = 1, 
    page_size: number = 100, 
    filter?: any, 
    forceRefresh = false
  ): Promise<{ rows: ReadAddressesResponse['rows']; total: number }> {
    const cacheKey = this.generateCacheKey(page_num, page_size, filter);
    const cachedEntry = this.cache[cacheKey];

    // If we have valid cache and not forcing refresh, return cached data
    if (cachedEntry && this.isCacheValid(cachedEntry) && !forceRefresh) {
      return {
        rows: cachedEntry.data,
        total: cachedEntry.total
      };
    }

    // Fetch fresh data from API
    const response = await readAddresses({
      action: 'read_addresses',
      page_num,
      page_size,
      filter: filter ? { field: 'name', value: filter } : null
    });

    const data = response.rows || [];
    const total = response.total || 0;

    // Update cache
    this.cache[cacheKey] = {
      data,
      total,
      timestamp: Date.now(),
      filters: {
        page_num,
        page_size,
        filter
      }
    };

    return { rows: data, total };
  }

  // Search within cached data (for instant search)
  searchInCache(page_num: number, page_size: number, searchTerm: string): ReadAddressesResponse['rows'] {
    const cacheKey = this.generateCacheKey(page_num, page_size, undefined);
    const cachedEntry = this.cache[cacheKey];

    if (!cachedEntry || !this.isCacheValid(cachedEntry)) {
      return [];
    }

    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return cachedEntry.data;
    }

    return cachedEntry.data.filter((address: any) => {
      const title = (address.title || '').toLowerCase();
      return title.includes(trimmed);
    });
  }

  // Check if we have valid cache for given parameters
  hasValidCache(page_num: number, page_size: number, filter?: any): boolean {
    const cacheKey = this.generateCacheKey(page_num, page_size, filter);
    const cachedEntry = this.cache[cacheKey];
    return cachedEntry ? this.isCacheValid(cachedEntry) : false;
  }

  // Clear cache for specific parameters or all
  clearCache(page_num?: number, page_size?: number, filter?: any): void {
    if (page_num && page_size) {
      const cacheKey = this.generateCacheKey(page_num, page_size, filter);
      delete this.cache[cacheKey];
    } else {
      this.cache = {};
    }
  }

  // Clear all caches when new address is added
  clearAllCaches(): void {
    this.cache = {};
  }

  // Get cache info for debugging
  getCacheInfo(): { [key: string]: { timestamp: number; count: number; valid: boolean } } {
    const info: { [key: string]: { timestamp: number; count: number; valid: boolean } } = {};
    
    Object.keys(this.cache).forEach(key => {
      const entry = this.cache[key];
      if (entry) {
        info[key] = {
          timestamp: entry.timestamp,
          count: entry.data.length,
          valid: this.isCacheValid(entry)
        };
      }
    });

    return info;
  }
}

// Export singleton instance
export const addressBookCache = new AddressBookCacheService();
