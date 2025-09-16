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

class ReturnTrakInventoryCacheService {
  private authCache: InventoryCache = {};
  private shipCache: InventoryCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private generateCacheKey(warehouses?: string): string {
    return `inventory_${warehouses || 'default'}`;
  }

  private isCacheValid(entry: InventoryCacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  private getCacheForType(type: 'auth' | 'ship'): InventoryCache {
    return type === 'auth' ? this.authCache : this.shipCache;
  }

  async getInventoryData(warehouses?: string, type: 'auth' | 'ship' = 'auth', forceRefresh = false): Promise<InventoryItemForCartDto[]> {
    const cacheKey = this.generateCacheKey(warehouses);
    const cache = this.getCacheForType(type);
    const cachedEntry = cache[cacheKey];

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

    // Update cache for the specific type
    cache[cacheKey] = {
      data,
      timestamp: Date.now(),
      filters: {
        warehouses: warehouses || '',
        omit_zero_qty: true
      }
    };

    return data;
  }

  // Search within cached data for specific type
  searchInCache(warehouses: string | undefined, searchTerm: string, type: 'auth' | 'ship' = 'auth'): InventoryItemForCartDto[] {
    const cacheKey = this.generateCacheKey(warehouses);
    const cache = this.getCacheForType(type);
    const cachedEntry = cache[cacheKey];

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

  // Check if we have valid cache for given warehouses and type
  hasValidCache(warehouses?: string, type: 'auth' | 'ship' = 'auth'): boolean {
    const cacheKey = this.generateCacheKey(warehouses);
    const cache = this.getCacheForType(type);
    const cachedEntry = cache[cacheKey];
    return cachedEntry ? this.isCacheValid(cachedEntry) : false;
  }

  // Clear cache for specific warehouses and type, or all
  clearCache(warehouses?: string, type?: 'auth' | 'ship'): void {
    if (type) {
      const cache = this.getCacheForType(type);
      if (warehouses) {
        const cacheKey = this.generateCacheKey(warehouses);
        delete cache[cacheKey];
      } else {
        Object.keys(cache).forEach(key => delete cache[key]);
      }
    } else {
      // Clear both caches
      this.authCache = {};
      this.shipCache = {};
    }
  }

  // Get cache info for debugging
  getCacheInfo(): { 
    auth: { [key: string]: { timestamp: number; count: number; valid: boolean } };
    ship: { [key: string]: { timestamp: number; count: number; valid: boolean } };
  } {
    const authInfo: { [key: string]: { timestamp: number; count: number; valid: boolean } } = {};
    const shipInfo: { [key: string]: { timestamp: number; count: number; valid: boolean } } = {};
    
    Object.keys(this.authCache).forEach(key => {
      const entry = this.authCache[key];
      if (entry) {
        authInfo[key] = {
          timestamp: entry.timestamp,
          count: entry.data.length,
          valid: this.isCacheValid(entry)
        };
      }
    });

    Object.keys(this.shipCache).forEach(key => {
      const entry = this.shipCache[key];
      if (entry) {
        shipInfo[key] = {
          timestamp: entry.timestamp,
          count: entry.data.length,
          valid: this.isCacheValid(entry)
        };
      }
    });

    return { auth: authInfo, ship: shipInfo };
  }
}

// Export singleton instance
export const returntrakInventoryCache = new ReturnTrakInventoryCacheService();
