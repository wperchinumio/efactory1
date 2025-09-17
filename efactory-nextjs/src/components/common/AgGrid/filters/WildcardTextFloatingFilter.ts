import { IFloatingFilterComp, IFloatingFilterParams } from 'ag-grid-community';

// Store the actual filter values outside of AG Grid's state management
// Use window object to ensure it's accessible from LunoAgGrid
// Each page/resource has its own filter store
if (typeof window !== 'undefined') {
  (window as any).__wildcardFilterStores = (window as any).__wildcardFilterStores || {};
}

export class WildcardTextFloatingFilter implements IFloatingFilterComp {
  private params!: IFloatingFilterParams;
  private inputElement!: HTMLInputElement;
  private fieldId: string = '';
  private storeKey: string = '';

  init(params: IFloatingFilterParams): void {
    this.params = params;
    this.fieldId = params.column.getColId();
    
    // Get the resource/page identifier from the grid context
    const gridContext = (params.api as any).gridOptions?.context;
    const resource = gridContext?.resource || 'default';
    this.storeKey = resource;
    console.log('[DEBUG] WildcardFilter init for field:', this.fieldId, 'resource:', this.storeKey);
    
    // Create input element
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'ag-floating-filter-input';
    this.inputElement.placeholder = 'Filter...';
    
    // Initialize with stored value if exists
    const filterStores = (window as any).__wildcardFilterStores || {};
    if (!filterStores[this.storeKey]) {
      filterStores[this.storeKey] = {};
    }
    const storedValue = filterStores[this.storeKey][this.fieldId] || '';
    this.inputElement.value = storedValue;
    
    // Handle input changes
    this.inputElement.addEventListener('input', (e) => {
      // Store the raw value
      const filterStores = (window as any).__wildcardFilterStores || {};
      if (!filterStores[this.storeKey]) {
        filterStores[this.storeKey] = {};
      }
      filterStores[this.storeKey][this.fieldId] = this.inputElement.value;
    });

    // Handle Enter key
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    const filterStores = (window as any).__wildcardFilterStores || {};
    const filterStore = filterStores[this.storeKey] || {};
    const value = (filterStore[this.fieldId] || '').trim();
    
    // Parse wildcard patterns
    let filterType = 'equals';
    let filterValue = value;
    
    if (value) {
      if (value.startsWith('*') && value.endsWith('*') && value.length > 2) {
        filterType = 'contains';
        filterValue = value.slice(1, -1);
      } else if (value.startsWith('*') && value.length > 1) {
        filterType = 'endsWith';
        filterValue = value.slice(1);
      } else if (value.endsWith('*') && value.length > 1) {
        filterType = 'startsWith';
        filterValue = value.slice(0, -1);
      }
    }
    
    // Update our store
    if (!value) {
      // Clear from our store when empty
      delete filterStore[this.fieldId];
    }
    
    // We don't need to set filter model on AG Grid anymore
    // Just trigger the filter change so LunoAgGrid reads from our store
    
    // Force the grid to update
    // Use a small timeout to ensure it only triggers once
    setTimeout(() => {
      (this.params.api as any).onFilterChanged?.();
    }, 10);
  }

  onParentModelChanged(parentModel: any): void {
    // Don't let AG Grid update our input - we manage our own state
    const filterStores = (window as any).__wildcardFilterStores || {};
    const filterStore = filterStores[this.storeKey] || {};
    // Only update if we don't have a value in our store
    if (!filterStore[this.fieldId]) {
      if (!parentModel) {
        this.inputElement.value = '';
      } else {
        // Restore the display with wildcards based on filter type
        const { type, filter } = parentModel;
        let displayValue = filter || '';
        
        if (filter) {
          switch (type) {
            case 'startsWith':
              displayValue = filter + '*';
              break;
            case 'endsWith':
              displayValue = '*' + filter;
              break;
            case 'contains':
              displayValue = '*' + filter + '*';
              break;
          }
        }
        
        this.inputElement.value = displayValue;
        filterStore[this.fieldId] = displayValue;
      }
    }
  }

  getGui(): HTMLElement {
    return this.inputElement;
  }

  // Clean up
  destroy(): void {
    // Don't clear the store on destroy - we want to persist across re-renders
  }
}