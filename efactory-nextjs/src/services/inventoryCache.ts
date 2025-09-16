import { fetchInventoryForCart } from './api';
import { InventoryItemForCartDto } from '../types/api/inventory';

interface InventoryCacheEntry {
  data: InventoryItemForCartDto[];
  timestamp: number;
  filters: {
    warehouses?: string;
    omit_zero_qty: boolean;
  };
}

interface InventoryCache {
  [key: string]: InventoryCacheEntry;
}

class InventoryCacheService {
  private cache: InventoryCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private generateCacheKey(warehouses?: string): string {
    return `inventory_${warehouses || 'default'}`;
  }

  private isCacheValid(entry: InventoryCacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  async getInventoryData(warehouses?: string, forceRefresh = false): Promise<InventoryItemForCartDto[]> {
    const cacheKey = this.generateCacheKey(warehouses);
    const cachedEntry = this.cache[cacheKey];

    // If we have valid cache and not forcing refresh, return cached data
    if (cachedEntry && this.isCacheValid(cachedEntry) && !forceRefresh) {
      return cachedEntry.data;
    }

    // Fetch fresh data from API
    const and: any[] = [];
    
    // Add warehouse filter if available
    if (warehouses && typeof warehouses === 'string') {
      const parts = warehouses.split('-');
      if (parts.length >= 2) {
        const [inv_region, inv_type] = parts;
        and.push({ field: 'inv_type', oper: '=', value: inv_type });
        and.push({ field: 'inv_region', oper: '=', value: inv_region });
      }
    }
    
    and.push({ field: 'omit_zero_qty', oper: '=', value: true });

    const response = await fetchInventoryForCart({
      page_num: 1,
      page_size: 1000, // Get more results for better caching
      filter: { and }
    });

    const data = response.rows || [];

    // Update cache
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now(),
      filters: {
        warehouses: warehouses || '',
        omit_zero_qty: true
      }
    };

    return data;
  }

  // Search within cached data
  searchInCache(warehouses: string | undefined, searchTerm: string): InventoryItemForCartDto[] {
    const cacheKey = this.generateCacheKey(warehouses);
    const cachedEntry = this.cache[cacheKey];

    if (!cachedEntry || !this.isCacheValid(cachedEntry)) {
      return [];
    }

    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return cachedEntry.data;
    }

    return cachedEntry.data.filter((item: InventoryItemForCartDto) => {
      const itemNumber = item.item_number.toLowerCase();
      return itemNumber === trimmed || itemNumber.startsWith(trimmed);
    });
  }

  // Check if we have valid cache for given warehouses
  hasValidCache(warehouses?: string): boolean {
    const cacheKey = this.generateCacheKey(warehouses);
    const cachedEntry = this.cache[cacheKey];
    return cachedEntry ? this.isCacheValid(cachedEntry) : false;
  }

  // Clear cache for specific warehouses or all
  clearCache(warehouses?: string): void {
    if (warehouses) {
      const cacheKey = this.generateCacheKey(warehouses);
      delete this.cache[cacheKey];
    } else {
      this.cache = {};
    }
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
export const inventoryCache = new InventoryCacheService();
