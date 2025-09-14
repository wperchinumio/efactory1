// Grid (Views + Rows) API types derived from legacy eFactory grid

export type GridAlign = 'left' | 'right' | 'center';

export interface GridFilterCondition {
  field: string;
  oper: string; // '=', '<>', '>', '<', 'like', etc.
  value: any;
  // Legacy sometimes adds a transient "key" on client; server does not require it
  key?: string;
}

export interface GridFilter {
  and: GridFilterCondition[];
  or?: GridFilterCondition[];
}

export interface GridSortSpec {
  field: string;
  dir: 'asc' | 'desc';
}

export interface GridFieldDef {
  field: string;
  alias: string;
  sortable?: boolean;
  filterable?: boolean; // Whether this column should have a header filter
  align?: GridAlign;
  render?: string; // e.g. 'fmtorderlink', 'fmtdate', ... (legacy renderer id)
  min_width?: number;
  width?: number;
  data_type?: string; // e.g. 'string', 'number', 'date', 'boolean'
}

export interface GridSelectedView {
  id?: number;
  fields: GridFieldDef[];
  filter: GridFilter;
  rows_per_page: number;
  sort: GridSortSpec[];
}

export interface GridViewItemMeta {
  id: number;
  name: string;
  selected: boolean;
  view?: GridSelectedView;
}

export interface GridViewListData {
  type: string; // resource, e.g. 'fulfillment-open'
  url: string; // server rows endpoint, e.g. '/api/fulfillment'
  views: GridViewItemMeta[];
  // Optional list of saved filters provided by server; passthrough typing
  filters?: Array<{ id: number; name: string; [key: string]: any }>;
}

export interface ListGridViewsRequest {
  action: 'list';
  views: string[]; // [resource]
}

export interface ListGridViewsResponse {
  data: [GridViewListData];
}

export interface SelectGridViewRequest {
  action: 'select';
  view: string; // resource
  id: number; // view id
}

export interface ReadGridRowsRequest {
  action: 'read';
  fields: string[]; // typically ['*']
  filter: GridFilter;
  page_num: number;
  page_size: number;
  resource: string; // same as GridViewListData.type
  sort: Array<Record<string, 'asc' | 'desc'>>; // legacy shape [{ field: 'desc' }]
  filter_id?: number | string | '' | null;
}

export interface GridRowResponse<T = any> {
  resource: string;
  total: number;
  rows: T[];
}


// ======================
// Saved Filters (Views API: resource = 'filter')
// ======================

export interface GridSavedFilterItem {
  id: number;
  name: string;
  description?: string;
  selected?: boolean;
}

export interface ListSavedFiltersRequest {
  action: 'list';
  resource: 'filter';
  view: string; // resource key, e.g., 'fulfillment-shipped'
}

export type ListSavedFiltersResponse = {
  data: GridSavedFilterItem[];
};

export interface SelectSavedFilterRequest {
  action: 'select';
  resource: 'filter';
  id: number; // filter id
}

export interface UnsetSavedFilterRequest {
  action: 'unset';
  resource: 'filter';
  view: string; // resource key
}

export interface GetAvailableFieldsRequest {
  action: 'detail';
  view: string; // resource key
  id: number; // selected view id (not filter id!)
}

export interface AvailableFieldDef {
  title: string;
  field: string;
  queryable?: boolean;
}

export interface GetAvailableFieldsResponse {
  data: {
    available_fields: AvailableFieldDef[];
    [key: string]: any;
  };
}

export interface CreateSavedFilterRequest {
  action: 'create';
  resource: 'filter';
  view: string; // resource key
  data: {
    name: string;
    description?: string;
    filter: GridFilter;
  };
}

export interface UpdateSavedFilterRequest {
  action: 'update';
  resource: 'filter';
  id: number;
  data: {
    name: string;
    description?: string;
    filter: GridFilter;
  };
}

export interface DeleteSavedFilterRequest {
  action: 'delete';
  resource: 'filter';
  id: number;
}

export interface GetSavedFilterDetailRequest {
  action: 'get';
  resource: 'filter';
  id: number;
}

export interface SavedFilterDetailResponse {
  data: {
    name: string;
    description?: string;
    filter: GridFilter;
  };
}

// ======================
// Export (Rows endpoint)
// ======================

export type ExportFormat = 'excel' | 'csv' | 'zip';

export interface ExportGridRowsRequest extends Omit<ReadGridRowsRequest, 'action'> {
  action: 'export';
  format: ExportFormat;
}

