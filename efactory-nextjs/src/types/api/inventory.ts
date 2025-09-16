// Types for /api/inventory endpoints inferred from legacy efactory-client-main
// Sources inspected:
// - src/components/Grid/redux.js (DG Data, Lot Revision)
// - src/components/Grid/Modals/Bundle/redux.js (Bundle & ASN helpers)
// - src/components/Invoices/Open/redux.js (Item detail & update)
// - src/components/Services/**/BrowseItems/redux.js (inventory-status-for-cart)
// - src/components/Analytics/redux.js (inventory-cyclecount-chart)

import type { ApiResponse } from './index';

// ============================
// Common filter pieces
// ============================
export interface InventoryFilterClause {
  field: string;
  oper: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like';
  value: string | number | boolean;
}

// ============================
// inventory-status-for-cart (modal search/browse)
// ============================
export interface InventoryStatusForCartBody {
  resource: 'inventory-status-for-cart';
  action: 'read';
  page_size: number;
  page_num: number;
  sort?: Array<Record<string, 'asc' | 'desc'>>;
  filter: { and: InventoryFilterClause[] };
}

export interface InventoryItemForCartDto {
  item_number: string;
  description: string;
  qty_net: number;
  // Optional fields often present in legacy rows
  inv_type?: string;
  inv_region?: string;
  price?: number | string;
}

export interface InventoryStatusForCartResponse {
  rows: InventoryItemForCartDto[];
  total: number;
}

// ============================
// Dangerous Goods (DG Data)
// ============================
export interface ReadDangerousGoodsBody {
  action: 'get_dg_data';
  item_number: string;
  account_wh: string; // e.g., "10501.FR"
}

export interface DangerousGoodsDto {
  item_number: string;
  description?: string;
  account_wh: string;
  battery_category?: string;
  battery_configuration?: string;
  battery_type?: string;
  qty_per_package?: string | number;
  units_per_carton?: string | number;
  units_per_master_carton?: string | number;
  battery_spec_quantity?: string | number;
  battery_spec_unit_of_measure?: string;
  net_weight_in_grams?: string | number;
}

export type ReadDangerousGoodsResponse = ApiResponse<DangerousGoodsDto>;

export interface UpdateDangerousGoodsBody {
  action: 'post_dg_data';
  data: DangerousGoodsDto & { account_wh: string };
}

// ============================
// Lot Revision
// ============================
export interface ReadLotRevisionBody {
  action: 'get_lot_revision';
  lot_ser: string;
  inv_type: string;
  item_number: string;
}

export interface LotRevisionSettings {
  lot_code1: string[];
  lot_code2: string[];
  lot_code3: string[];
  lot_code4: string[];
  lot_code5: string[];
}

export interface LotMasterDto {
  lot_ser?: string;
  inv_type?: string;
  item_number?: string;
  expiration_date?: string;
  qty_on_hand?: number;
  [key: string]: unknown;
}

export interface ReadLotRevisionResponseData {
  lot_master: LotMasterDto;
  settings: LotRevisionSettings;
}

export type ReadLotRevisionResponse = ApiResponse<ReadLotRevisionResponseData>;

export interface UpdateLotRevisionBody {
  action: 'post_lot_revision';
  data: LotMasterDto;
}

// ============================
// Bundle & ASN helpers
// ============================
export interface ReadBundleDataBody {
  action: 'get_bundle_data';
  bundle_item_id: number;
  warehouse: string; // legacy passes region only (before '-')
}

export interface BundleDetailLine {
  quantity?: number | string;
  line_num?: number | string;
  item_pl?: number | string;
  [key: string]: unknown;
}

export interface ReadBundleDataResponseData {
  bundle_item_id: number;
  bundle_item_number: string;
  bundle_upc?: string;
  bundle_type?: string;
  bundle_pl?: string | number;
  bundle_description?: string;
  bundle_detail: Record<string, BundleDetailLine>; // keyed by item_number
  account_number?: string;
}

export type ReadBundleDataResponse = ApiResponse<ReadBundleDataResponseData>;

export interface SaveBundleDataBody {
  action: 'save_bundle_data';
  data: {
    bundle_detail: Record<string, BundleDetailLine>;
    bundle_item_number: string;
    bundle_item_id: number;
    bundle_upc?: string;
    bundle_type?: string;
    account_number?: string;
    bundle_pl?: string | number;
    bundle_description?: string;
    warehouse: string; // region
  };
}

export interface ExpireBundleBody {
  action: 'expire_bundle';
  data: {
    bundle_item_id: number;
    warehouse: string; // region
  };
}

export interface EditAsnLineBody {
  action: 'edit_asn_line';
  data: { dcl_po: string | number; dcl_po_line: string | number; order_type: string; new_date: string };
}

export interface CancelAsnLineBody {
  action: 'cancel_asn_line';
  data: { dcl_po: string | number; dcl_po_line: string | number; order_type: string };
}

export interface CloseShortAsnLineBody {
  action: 'close_short_asn_line';
  data: { dcl_po: string | number; dcl_po_line: string | number; order_type: string };
}

// ============================
// Item Detail (Invoices -> Open -> Edit Item)
// ============================
export interface ReadItemDetailBody {
  action: 'item_detail';
  item_number: string;
  warehouse: string; // location/warehouse
  account_wh: string; // e.g., '10501.FR'
  weeks: string | number | boolean; // legacy uses truthy/number of weeks
}

// ============================
// Item Detail (overview/status page parity)
// ============================

export interface ItemChartPointDto {
  period: string;
  shipped?: number;
  returned?: number;
  received?: number;
  adjusted?: number;
}

export interface ItemStockRowDto {
  location?: string; // e.g., "LA"
  branch?: string;   // e.g., "ZLDC"
  qty_onhand?: number;
  qty_onhold?: number;
  qty_comm?: number;
  qty_proc?: number;
  qty_ff?: number;
  qty_net?: number;
  open_wo?: number;
  open_po?: number;
  open_rma?: number;
}

export interface ItemShippingDto {
  upc?: string;
  weight?: string | number;
  dimension?: string;
  serial_no?: string;
  serial_format?: string;
  lot_days?: string | number;
  lot_format?: string;
}

export interface ItemExportDto {
  eccn?: string;
  hcode?: string;
  hcode_ca?: string;
  coo?: string;
  gl?: string;
  cat?: string;
}

export interface ItemDgDto {
  li_b_cat?: string;
  li_b_conf?: string;
  li_t_type?: string;
  cell_rp?: string | number;
  unit_innerc?: string | number;
  unit_masterc?: string | number;
  wh_cell?: string | number;
  net_wh?: string | number;
}

export interface ItemDetailSectionDto {
  item_number?: string;
  desc1?: string;
  desc2?: string;
  lot_exp?: string | number;
  reorder?: string | number;
  reorder_qty?: string | number;
  lot_assign?: string;
  pack?: string | number;
  cat1?: string;
  cat2?: string;
  cat3?: string; // KEY indicator
  cat4?: string;
  warehouse?: string;
}

export interface ItemDetailResponseData {
  detail?: ItemDetailSectionDto;
  shipping?: ItemShippingDto;
  export?: ItemExportDto;
  dg?: ItemDgDto;
  edi?: Array<{ tp?: string; item_number?: string }>;
  charts?: ItemChartPointDto[];
  stock?: ItemStockRowDto[];
  noResponse?: boolean; // legacy pattern when not found
}

export type ReadItemDetailResponse = ApiResponse<ItemDetailResponseData>;

export interface UpdateItemBody {
  action: 'update';
  resource: 'item';
  account_wh: string; // '' to apply to all warehouses
  item_number: string;
  key_item?: boolean;
  data: {
    shipping?: Record<string, unknown>;
    export?: Record<string, unknown>;
    dg?: Record<string, unknown>;
    edi?: unknown[];
  };
}

export type UpdateItemResponse = ApiResponse<ItemDetailResponseData>;

// ============================
// Analytics – Cyclecount chart
// ============================
export interface ReadCyclecountChartBody {
  action: 'read';
  fields: ['*'];
  filter: { and: InventoryFilterClause[] };
  page_num: 1;
  page_size: 1000;
  resource: 'inventory-cyclecount-chart';
  sort: Array<{ cycle_count_date: 'desc' | 'asc' }>;
}

export interface CyclecountChartPoint {
  cycle_count_date: string;
  value?: number;
  [key: string]: unknown;
}

export interface ReadCyclecountChartResponseData {
  chart: CyclecountChartPoint[];
  [key: string]: unknown;
}

export type ReadCyclecountChartResponse = ApiResponse<ReadCyclecountChartResponseData>;


