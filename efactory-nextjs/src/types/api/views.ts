// Overview layout customization API types

export interface GetDefaultOverviewLayoutRequest {
  action: 'get_default_overview';
}

export interface SaveOverviewLayoutRequest {
  action: 'save_overview';
  data: {
    overview_layout: OverviewLayout;
  };
}

export interface OverviewLayout {
  areas: OverviewArea[];
}

export interface OverviewArea {
  name: 'tiles' | 'fulfillment' | '30days' | 'inventory' | '50orders' | '30days_rmas';
  visible: boolean;
  // tiles area contains sub areas specifying counters (max 4 visible)
  areas?: Array<{ name: OverviewTileName; visible: boolean }>;
}

export type OverviewTileName =
  | 'orders_received_today'
  | 'orders_shipped_today'
  | 'back_orders'
  | 'open_rma'
  | 'multi_received_today'
  | 'multi_shipped_today'
  | 'multi_rmas_today'
  | 'multi_rma_units_today'
  | 'multi_open_orders'
  | 'multi_backorders'
  | 'multi_subtotal'
  | 'multi_sh';

export interface GetOverviewLayoutResponse {
  overview_layout: OverviewLayout;
}


