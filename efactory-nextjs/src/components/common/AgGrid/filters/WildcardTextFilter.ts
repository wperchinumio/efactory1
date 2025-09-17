import { IFilterComp, IFilterParams, IDoesFilterPassParams, PromiseOrValue } from 'ag-grid-community';

export interface WildcardFilterModel {
  type: string;
  filter: string | null;
}

export class WildcardTextFilter implements IFilterComp {
  private filterParams!: IFilterParams;
  private filterType: string = 'equals';
  private filterValue: string | null = null;
  private gui!: HTMLDivElement;
  private onFilterChangedCallback: (() => void) | null = null;

  init(params: IFilterParams): PromiseOrValue<void> {
    this.filterParams = params;
    
    // Register the filter changed callback
    if (params.filterChangedCallback) {
      this.onFilterChangedCallback = params.filterChangedCallback;
    }
    
    // Create a minimal GUI since we're using a floating filter
    this.gui = document.createElement('div');
    this.gui.className = 'ag-filter-body-wrapper';
  }

  getGui(): HTMLElement {
    return this.gui;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // For server-side filtering, this method is not used
    // The actual filtering happens on the server based on the model
    return true;
  }

  isFilterActive(): boolean {
    return this.filterValue != null && this.filterValue !== '';
  }

  getModel(): WildcardFilterModel | null {
    if (!this.isFilterActive()) {
      return null;
    }
    return {
      type: this.filterType,
      filter: this.filterValue
    };
  }

  setModel(model: WildcardFilterModel | null): PromiseOrValue<void> {
    if (model) {
      this.filterType = model.type || 'equals';
      this.filterValue = model.filter;
    } else {
      this.filterType = 'equals';
      this.filterValue = null;
    }
  }

  // Clean up
  destroy(): void {
    // Nothing to clean up
  }
}