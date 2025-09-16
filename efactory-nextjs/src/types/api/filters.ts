// Filter system types based on legacy QuickFilters implementation

export type FilterType = 
  | 'DATE_RANGE_QF'
  | 'DATE_RANGE_ADVANCED_QF'
  | 'DATE_RANGE_CUSTOM_QF'
  | 'DROPDOWN_QF' 
  | 'BOOLEAN_QF'
  | 'DATE_QF'
  | 'INPUT_TEXT_QF'
  | 'TOTAL_QF';

export interface FilterOption {
  key: string;
  value: any;
  oper: '=' | '<>' | 'like' | '>' | '<' | '>=' | '<=' | 'in' | 'not in';
}

export interface BaseFilterConfig {
  field: string;
  title: string;
  type: FilterType;
  iconClassName?: string;
  width?: string;
  allowClear?: boolean;
  allOptionHidden?: boolean;
  nosort?: boolean;
  // Optional hint to force single-select dropdown behavior
  singleSelect?: boolean;
}

export interface DropdownFilterConfig extends BaseFilterConfig {
  type: 'DROPDOWN_QF';
  options: FilterOption[];
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'DATE_RANGE_QF';
}

export interface DateRangeAdvancedFilterConfig extends BaseFilterConfig {
  type: 'DATE_RANGE_ADVANCED_QF';
}

export interface DateRangeCustomFilterConfig extends BaseFilterConfig {
  type: 'DATE_RANGE_CUSTOM_QF';
}

export interface DateFilterConfig extends BaseFilterConfig {
  type: 'DATE_QF';
}

export interface BooleanFilterConfig extends BaseFilterConfig {
  type: 'BOOLEAN_QF';
}

export interface TextInputFilterConfig extends BaseFilterConfig {
  type: 'INPUT_TEXT_QF';
}

export interface TotalFilterConfig extends BaseFilterConfig {
  type: 'TOTAL_QF';
}

export type FilterConfig = 
  | DropdownFilterConfig 
  | DateRangeFilterConfig 
  | DateRangeAdvancedFilterConfig
  | DateRangeCustomFilterConfig
  | DateFilterConfig 
  | BooleanFilterConfig 
  | TextInputFilterConfig
  | TotalFilterConfig;

export interface FilterValue {
  field: string;
  value: any;
  oper: string;
}

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface FilterState {
  [field: string]: FilterValue | FilterValue[];
}

export interface GridFilterConfig {
  [pageKey: string]: {
    [filterKey: string]: FilterConfig;
  };
}

// Predefined filter configurations for different pages
export interface OrdersOpenFilters {
  location: FilterConfig;
  account_number: FilterConfig;
  received_date: FilterConfig;
  order_type: FilterConfig;
  international_code: FilterConfig;
  ordered_date: FilterConfig;
}

export interface OrdersShippedFilters {
  location: FilterConfig;
  account_number: FilterConfig;
  shipped_date: FilterConfig;
  order_type: FilterConfig;
  international_code: FilterConfig;
  received_date: FilterConfig;
}

export interface OrdersAllFilters {
  location: FilterConfig;
  account_number: FilterConfig;
  shipped_date: FilterConfig;
  order_type: FilterConfig;
  international_code: FilterConfig;
  received_date: FilterConfig;
  ordered_date: FilterConfig;
}
