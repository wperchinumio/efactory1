import { IFloatingFilterComp, IFloatingFilterParams } from 'ag-grid-community';

// Store the actual filter values outside of AG Grid's state management
// Use window object to ensure it's accessible from LunoAgGrid
if (typeof window !== 'undefined') {
  (window as any).__wildcardFilterStore = (window as any).__wildcardFilterStore || {};
}

export class WildcardTextFloatingFilter implements IFloatingFilterComp {
  private params!: IFloatingFilterParams;
  private inputElement!: HTMLInputElement;
  private fieldId: string = '';
  private lastApplyTime: number = 0;
  private handleKeyDown!: (e: KeyboardEvent) => void;

  init(params: IFloatingFilterParams): void {
    this.params = params;
    
    // Use current URL path to make filters page-specific
    const currentPath = window.location.pathname.replace(/\//g, '_'); // Convert /orders/open to _orders_open
    this.fieldId = `${currentPath}__${params.column.getColId()}`;
    
    
    // Create input element
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'ag-floating-filter-input';
    this.inputElement.placeholder = '';
    try { this.inputElement.setAttribute('data-field-id', this.fieldId); } catch {}
    // Register this input so the grid can restore focus after fetch
    try {
      const apiAny = this.params.api as any;
      apiAny.__floatingFilterInputs = apiAny.__floatingFilterInputs || {};
      apiAny.__floatingFilterInputs[this.fieldId] = this.inputElement;
      // Update last focused when user focuses this field
      this.inputElement.addEventListener('focus', () => {
        try { (this.params.api as any).__lastFocusedFloatingFilter = { fieldId: this.fieldId }; } catch {}
      });
    } catch {}
    
    // Initialize with stored value if exists
    const storedValue = (window as any).__wildcardFilterStore[this.fieldId] || '';
    this.inputElement.value = storedValue;
    
    // Handle input changes - ONLY store, don't trigger API
    this.inputElement.addEventListener('input', (e) => {
      // Store the raw value, or delete if empty
      // DO NOT trigger API call here - only on Enter
      if (this.inputElement.value.trim()) {
        (window as any).__wildcardFilterStore[this.fieldId] = this.inputElement.value;
      } else {
        delete (window as any).__wildcardFilterStore[this.fieldId];
      }
    });

    // Handle Enter key - use named function to avoid duplicates
    this.handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        try { (this.params.api as any).__lastFocusedFloatingFilter = { fieldId: this.fieldId }; } catch {}
        this.applyFilter();
      }
    };
    
    // Remove any existing listeners and add new one
    this.inputElement.removeEventListener('keydown', this.handleKeyDown);
    this.inputElement.addEventListener('keydown', this.handleKeyDown);
  }

  applyFilter(): void {
    
    // ALWAYS read from input field to get the most current value
    const value = (this.inputElement.value || '').trim();
    
    // Update store immediately with current input value
    if (value) {
      (window as any).__wildcardFilterStore[this.fieldId] = value;
    } else {
      delete (window as any).__wildcardFilterStore[this.fieldId];
    }
    
    
    
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
    
    // COMPLETELY BYPASS AG GRID - call the debounced fetch directly
    setTimeout(() => {
      // Access the debounced function stored on the API
      const debouncedFetch = (this.params.api as any).__debouncedFilterFetch;
      
      if (debouncedFetch) {
        try { (this.params.api as any).__wildcardLastApplied = Date.now(); } catch {}
        debouncedFetch();
      }
    }, 10);
  }

  onParentModelChanged(parentModel: any): void {
    // Don't let AG Grid update our input - we manage our own state
    const store = (window as any).__wildcardFilterStore || {};
    // Only update if we don't have a value in our store
    if (!store[this.fieldId]) {
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
        store[this.fieldId] = displayValue;
      }
    }
  }

  getGui(): HTMLElement {
    return this.inputElement;
  }

  // Clean up
  destroy(): void {
    // Remove event listeners to prevent memory leaks
    if (this.inputElement && this.handleKeyDown) {
      this.inputElement.removeEventListener('keydown', this.handleKeyDown);
    }
    // Unregister stored input
    try {
      const apiAny = this.params.api as any;
      if (apiAny && apiAny.__floatingFilterInputs) {
        delete apiAny.__floatingFilterInputs[this.fieldId];
      }
    } catch {}
    // Don't clear the store on destroy - we want to persist across re-renders
  }
}