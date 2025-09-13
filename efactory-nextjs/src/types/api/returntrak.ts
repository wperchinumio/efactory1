// Types for ReturnTrak endpoints based on legacy code in efactory-client-main
// Source references:
// - src/components/ReturnTrak/Entry/redux.js
// - src/components/ReturnTrak/Settings/redux.js
// - src/components/ReturnTrak/Entry/Modals/BrowseItems/redux.js
// - Endpoints use base: POST /api/returntrak with { action, ... }

import type { ApiResponse } from './index';

// ============= Common DTOs =============

export interface AddressDto {
  company?: string;
  attention?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string; // e.g., 'US'
  phone?: string;
  email?: string;
}

export interface ShippingSettingsDto {
  carrier?: string;
  service?: string;
  packing_list_type?: string | number;
  freight_account?: string;
  consignee_number?: string;
  terms?: string;
  fob?: string;
  int_code?: string | number | null;
  comments?: string;
}

export interface RmaAutoNumberSettingsDto {
  manual: boolean;
  prefix?: string;
  suffix?: string;
  starting_number?: number;
  minimum_number_of_digits?: number;
}

export interface RmaCustomFieldDto {
  index: number; // 1..7
  title: string;
  type: 'text' | 'selection';
  list?: string[]; // selection values (e.g., ["A||Choice A","B||Choice B"]) or plain list
  required?: boolean;
}

export interface RmaTypeOption { code: string; title: string }
export interface DispositionOption { code: string; title: string }

export interface RmaSettingsDto {
  general: {
    auto_number: RmaAutoNumberSettingsDto;
    expiration_days?: string | number;
    shipping: {
      domestic: ShippingSettingsDto;
      international: ShippingSettingsDto;
    }
  };
  rma_types: RmaTypeOption[];
  dispositions: DispositionOption[];
  custom_fields: RmaCustomFieldDto[];
  // Additional settings occasionally referenced by legacy (not essential for entry)
  email_settings_rt?: Record<string, any>;
}

// ============= Entry DTOs =============

export interface RmaHeaderDto {
  rma_id?: number;
  is_draft?: boolean;
  open?: boolean;
  voided?: boolean;

  rma_number?: string;
  rma_type_code?: string; // legacy read returns *_code
  rma_type_name?: string;
  disposition_code?: string;
  disposition_name?: string;

  // Accounts & warehouses
  original_account_number?: string;
  original_order_number?: string;
  account_number?: string; // receiving account
  location?: string; // receiving location (warehouse)
  shipping_account_number?: string;
  shipping_warehouse?: string;

  // Addresses
  shipping_address?: AddressDto;

  // Customer & shipping fields (flattened in header in legacy)
  customer_number?: string;
  freight_account?: string;
  consignee_number?: string;
  comments?: string;
  international_code?: string | number | null;
  shipping_carrier?: string;
  shipping_service?: string;
  packing_list_type?: string | number;
  payment_type?: string;
  terms?: string;
  fob?: string;
  shipping_instructions?: string;
  return_weight_lb?: number | string;

  // Custom fields
  cf1?: string; cf2?: string; cf3?: string; cf4?: string; cf5?: string; cf6?: string; cf7?: string;

  // Amounts
  order_subtotal?: number | string;
  shipping_handling?: number | string;
  sales_tax?: number | string;
  international_handling?: number | string;
  total_due?: number | string;
  amount_paid?: number | string;
  net_due_currency?: number | string;
  balance_due_us?: number | string;
  international_declared_value?: number | string;
  insurance?: number | string;
}

export interface RmaAuthItemDto {
  detail_id: number; // 0 for new line
  line_number: number;
  item_number: string;
  description?: string;
  quantity: number;
  serialnumber?: string;
  voided?: boolean;
}

export interface RmaShipItemDto {
  detail_id: number; // 0 for new line
  line_number: number;
  item_number: string;
  description?: string;
  quantity: number;
  unit_price: string | number;
  voided?: boolean;
}

export interface RmaReadResponse {
  rma_header: RmaHeaderDto;
  to_receive: RmaAuthItemDto[];
  to_ship: RmaShipItemDto[];
}

// Save payload uses slightly different field names (header composed from form)
export interface RmaHeaderSaveDto {
  // lifecycle
  is_draft: boolean;
  open?: boolean;
  voided?: boolean;

  // RMA-specific
  rma_id?: number;
  rma_number?: string;
  rma_type_code?: string;
  rma_type_name?: string;
  disposition_code?: string;
  disposition_name?: string;

  // Accounts & warehouses
  account_number?: string;
  location?: string;
  shipping_account_number?: string;
  shipping_warehouse?: string;

  // Addresses
  shipping_address?: AddressDto;

  // Shipping
  shipping_carrier?: string;
  shipping_service?: string;
  packing_list_type?: string | number;
  freight_account?: string;
  consignee_number?: string;
  international_code?: string | number | null;
  terms?: string;
  fob?: string;
  payment_type?: string;

  // Amounts
  order_subtotal?: string | number;
  shipping_handling?: string | number;
  sales_tax?: string | number;
  international_handling?: string | number;
  total_due?: string | number;
  amount_paid?: string | number;
  net_due_currency?: string | number;
  balance_due_us?: string | number;
  international_declared_value?: string | number;
  insurance?: string | number;

  // Others / Comments
  customer_number?: string;
  shipping_instructions?: string;
  comments?: string;

  // Custom fields
  cf1?: string; cf2?: string; cf3?: string; cf4?: string; cf5?: string; cf6?: string; cf7?: string;
}

// ============= Requests =============

export interface ReadRmaSettingsRequest { action: 'read_settings' }
export type ReadRmaSettingsResponse = ApiResponse<RmaSettingsDto>;

export interface ReadRmaGeneralSettingsRequest { action: 'read_general' }

export interface GenerateRmaNumberRequest { action: 'generate_number' }
export interface GenerateRmaNumberResponse { number: string }

export interface ReadRmaEntryRequest { action: 'read'; rma_id: number }
export type ReadRmaEntryResponse = ApiResponse<RmaReadResponse>;

export interface ReadRmaFromOrderRequest { action: 'read_from_order'; order_number: string; account_number: string }

export interface SaveRmaEntryRequest {
  action: 'save';
  data: {
    rma_header: RmaHeaderSaveDto;
    to_receive: RmaAuthItemDto[];
    to_ship: RmaShipItemDto[];
  };
}

export interface SaveRmaEntryResponse {
  rma_number?: string;
  total_drafts?: number;
  // When saving draft, backend may return either draft_rma or rma_header with items
  draft_rma?: RmaReadResponse & { rma_header: RmaHeaderDto };
  rma_header?: RmaHeaderDto;
  to_receive?: RmaAuthItemDto[];
  to_ship?: RmaShipItemDto[];
}

export interface ListRmaDraftsRequest { action: 'list_drafts' }
// Legacy drafts list returns a flat draft row (not nested under rma_header)
export interface RmaDraftRow {
  rma_id: number;
  rma_number?: string;
  rma_type?: string;
  rma_type_code?: string;
  receiving_account_number?: string;
  receiving_warehouse?: string;
  original_order_number?: string;
  shipping_address?: AddressDto;
}
export type ListRmaDraftsResponse = ApiResponse<RmaDraftRow[]>;

export interface DeleteRmaDraftsRequest { action: 'delete_draft'; rma_ids: number[] }

// Convenience envelope type
export type ApiEnvelope<T> = ApiResponse<T>;


