import { IFloatingFilterComp, IFloatingFilterParams } from 'ag-grid-community';

// Store the actual filter values outside of AG Grid's state management
// Use window object to ensure it's accessible from LunoAgGrid
if (typeof window !== 'undefined') {
  (window as any).__wildcardFilterStore = (window as any).__wildcardFilterStore || {};
}

export class NumberFloatingFilter implements IFloatingFilterComp {
  private params!: IFloatingFilterParams;
  private inputElement!: HTMLInputElement;
  private fieldId: string = '';
  private lastApplyTime: number = 0;

  init(params: IFloatingFilterParams): void {
    this.params = params;
    
    // Use current URL path to make filters page-specific
    const currentPath = window.location.pathname.replace(/\//g, '_');
    this.fieldId = `${currentPath}__${params.column.getColId()}`;
    
    // Create input element
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'ag-floating-filter-input';
    this.inputElement.placeholder = '';
    try { this.inputElement.setAttribute('data-field-id', this.fieldId); } catch {}
    // Register with grid API and record focus for restoration after queries
    try {
      const apiAny = this.params.api as any;
      apiAny.__floatingFilterInputs = apiAny.__floatingFilterInputs || {};
      apiAny.__floatingFilterInputs[this.fieldId] = this.inputElement;
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

    // Handle Enter key
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        try { (this.params.api as any).__lastFocusedFloatingFilter = { fieldId: this.fieldId }; } catch {}
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    // Prevent multiple calls within 100ms
    const now = Date.now();
    if (now - this.lastApplyTime < 100) {
      return;
    }
    this.lastApplyTime = now;
    
    
    // ALWAYS read from input field to get the most current value
    const value = (this.inputElement.value || '').trim();
    
    // Update store immediately with current input value
    if (value) {
      (window as any).__wildcardFilterStore[this.fieldId] = value;
    } else {
      delete (window as any).__wildcardFilterStore[this.fieldId];
    }
    
    // Parse number operators
    let filterType = 'equals';
    let filterValue = value;
    
    if (value) {
      if (value.startsWith('>=')) {
        filterType = 'greaterThanOrEqual';
        filterValue = value.substring(2).trim();
      } else if (value.startsWith('<=')) {
        filterType = 'lessThanOrEqual';
        filterValue = value.substring(2).trim();
      } else if (value.startsWith('<>') || value.startsWith('!=')) {
        filterType = 'notEqual';
        filterValue = value.substring(2).trim();
      } else if (value.startsWith('>')) {
        filterType = 'greaterThan';
        filterValue = value.substring(1).trim();
      } else if (value.startsWith('<')) {
        filterType = 'lessThan';
        filterValue = value.substring(1).trim();
      } else if (value.startsWith('=')) {
        filterType = 'equals';
        filterValue = value.substring(1).trim();
      }
      // If no operator, default to equals
    }
    
    // COMPLETELY BYPASS AG GRID - call the debounced fetch directly
    setTimeout(() => {
      // Access the debounced function stored on the API
      const debouncedFetch = (this.params.api as any).__debouncedFilterFetch;
      if (debouncedFetch) {
        debouncedFetch();
      }
    }, 10);
  }

  onParentModelChanged(parentModel: any): void {
    // Don't let AG Grid update our input - we manage our own state
    // Only update if we don't have a value in our store
    if (!(window as any).__wildcardFilterStore[this.fieldId]) {
      if (!parentModel) {
        this.inputElement.value = '';
      } else {
        // Restore the display with operators based on filter type
        const { type, filter } = parentModel;
        let displayValue = filter || '';
        
        if (filter) {
          switch (type) {
            case 'greaterThanOrEqual':
              displayValue = '>=' + filter;
              break;
            case 'lessThanOrEqual':
              displayValue = '<=' + filter;
              break;
            case 'greaterThan':
              displayValue = '>' + filter;
              break;
            case 'lessThan':
              displayValue = '<' + filter;
              break;
            case 'notEqual':
              displayValue = '<>' + filter;
              break;
            case 'equals':
            default:
              displayValue = filter;
          }
        }
        
        this.inputElement.value = displayValue;
        (window as any).__wildcardFilterStore[this.fieldId] = displayValue;
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
