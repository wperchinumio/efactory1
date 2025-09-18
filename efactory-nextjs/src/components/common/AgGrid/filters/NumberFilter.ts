import { IFilterComp, IFilterParams } from 'ag-grid-community';

interface NumberFilterModel {
  type: string;
  filter: string;
}

export class NumberFilter implements IFilterComp {
  private filterParams!: IFilterParams;
  private gui!: HTMLElement;
  private filterType: string = 'equals';
  private filterValue: string | null = null;
  private onFilterChangedCallback?: () => void;

  init(params: IFilterParams): void {
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

  doesFilterPass(): boolean {
    // We don't use this since we're doing server-side filtering
    return true;
  }

  isFilterActive(): boolean {
    return this.filterValue !== null && this.filterValue !== '';
  }

  getModel(): NumberFilterModel | null {
    if (this.isFilterActive()) {
      return {
        type: this.filterType,
        filter: this.filterValue!
      };
    }
    return null;
  }

  setModel(model: NumberFilterModel | null): void {
    if (model) {
      this.filterType = model.type || 'equals';
      this.filterValue = model.filter;
    } else {
      this.filterType = 'equals';
      this.filterValue = null;
    }
  }

  destroy(): void {
    // Clean up if needed
  }
}
