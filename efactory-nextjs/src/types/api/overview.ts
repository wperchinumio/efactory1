// Legacy Overview API types mapped from efactory-client-main
// Endpoints used:
// POST /api/overview with body [{ overview_id: 1001|1002|1003|1004|1005|1006|1007, ... }]
// POST /api/views with actions get_default_overview, save_overview

export interface OverviewPostBodyBase {
  overview_id: 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007;
}

export interface GetFulfillmentsBody extends OverviewPostBodyBase {
  overview_id: 1001;
}

export interface Get30DaysActivityBody extends OverviewPostBodyBase {
  overview_id: 1002;
}

export interface GetLatest50OrdersReceivedBody extends OverviewPostBodyBase {
  overview_id: 1003;
}

export interface GetLatest50OrdersShippedBody extends OverviewPostBodyBase {
  overview_id: 1004;
}

export interface GetInventoryBody extends OverviewPostBodyBase {
  overview_id: 1005;
  filters: InventoryFilters;
}

export interface GetAnnouncementsBadgeBody extends OverviewPostBodyBase {
  overview_id: 1006;
}

export interface GetLast30DaysRMAsBody extends OverviewPostBodyBase {
  overview_id: 1007;
}

// Responses are returned in an envelope keyed by the overview id as string
export type OverviewEnvelope<K extends string, T> = Record<K, T> & { [key: string]: unknown };

// 1001: Fulfillments summary rows per account/warehouse
export interface FulfillmentRowDto {
  account_number: string;
  group: string;
  region: string; // warehouse code in legacy naming
  orders_today: number;
  back_orders: number;
  batches_today: number;
  ff_hold: number;
  total_open_orders: number;
  total_open_qty: number;
  shipped_today: number;
  ship_today_units: number;
  open_rmas: number;
  pre_release: number;
  ready_to_print: number;
  ready_to_release: number;
  ready_to_ship: number;
  shipped_others: number;
  shipped_units_others: number;
  risk?: number;
  op_drafts?: number;
  rma_drafts?: number;
  // Additional fields observed in legacy dashboard counters
  recv_today_lines?: number;
  recv_today_units?: number;
  ship_today_lines?: number;
  issued_rmas_today?: number;
  received_rmas_today?: number;
  rma_units_auth?: number;
  rma_units_recv?: number;
  rma_units_open?: number;
  total_open_lines?: number;
  total_back_orders?: number;
  total_back_lines?: number;
  back_qty?: number;
  subtotal_received_today?: number;
  subtotal_shipped_today?: number;
  subtotal_open?: number;
  sh_received_today?: number;
  sh_shipped_today?: number;
  sh_open?: number;
}

export interface GetFulfillmentsResponse {
  data: FulfillmentRowDto[];
}

// 1002: 30 days activity (orders received/shipped per day)
export interface ActivityPointDto {
  date: string; // YYYY-MM-DD
  received: number;
  shipped: number;
}

export interface Get30DaysActivityResponse {
  data: ActivityPointDto[];
}

// 1003/1004: Latest 50 orders (received or shipped)
export interface LatestOrderDto {
  order_number: string;
  received: string | null; // date-time string
  shipped: string | null; // date-time string
  order_type: string;
  order_stage: string | number;
  stage_description?: string;
  ship_to: string;
  ship_address: string;
  carrier: string;
  service: string;
  tracking_url?: string;
  tracking_no?: string;
}

export interface GetLatest50OrdersResponse {
  data: LatestOrderDto[];
}

// 1005: Inventory slice for overview
export interface InventoryFilters {
  hasKey: boolean;
  isShort: boolean;
  needReorder: boolean;
}

export interface InventoryItemDto {
  warehouse: string;
  item_number: string;
  description: string;
  flags: string;
  qty_onhand: number;
  qty_onhold: number;
  qty_committed: number;
  qty_inproc: number;
  qty_onff: number;
  qty_net: number;
  qty_min: number;
  qty_dcl: number;
  qty_openwo: number;
  qty_openpo: number;
  qty_openrma: number;
}

export interface GetInventoryResponse {
  data: InventoryItemDto[];
}

// 1006: Announcements badge
export interface GetAnnouncementsBadgeResponse {
  new_announcements: number;
}

// 1007: 30 days RMA activity
export interface RmaActivityPointDto {
  date: string; // YYYY-MM-DD
  issued: number; // authorized
  closed: number; // closed
}

export interface GetLast30DaysRMAsResponse {
  data: RmaActivityPointDto[];
}


