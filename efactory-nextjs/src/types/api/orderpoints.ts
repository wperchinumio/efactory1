// Types for OrderPoints endpoints based on legacy redux in efactory-client-main
// Source: src/components/OrderPoints/**/redux.js

import type { ApiResponse } from './index';
import type { GridFilter } from './grid';

// Common
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
  international_code?: number | string | null;
}

export interface OrderHeaderDto {
  order_id?: number;
  order_number?: string;
  account_number?: string;
  location?: string;
  order_status?: number; // 0 cancel, 1 normal, 2 on hold
  payment_type?: string;
  ordered_date?: string; // YYYY-MM-DD
  po_number?: string;
  customer_number?: string;
  acknowledgement_email?: string;
  shipping_instructions?: string;
  packing_list_comments?: string;
  // Shipping block (flattened in legacy)
  shipping_carrier?: string;
  shipping_service?: string;
  freight_account?: string;
  consignee_number?: string;
  packing_list_type?: number | string;
  terms?: string;
  fob?: string;
  international_code?: number | string | null;
  // Addresses
  shipping_address?: AddressDto;
  billing_address?: AddressDto;
  // Amounts block
  order_subtotal?: number;
  shipping_handling?: number;
  balance_due_us?: number;
  amount_paid?: number;
  total_due?: number;
  net_due_currency?: number;
  international_handling?: number;
  international_declared_value?: number;
  sales_tax?: number;
  insurance?: number;
  // Extra fields
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
  custom_field4?: string;
  custom_field5?: string;
}

export interface OrderDetailDto {
  detail_id: number; // 0 for new/draft lines
  line_number: number; // supports kit numbering 1001/2001 etc
  item_number: string;
  description?: string;
  quantity: number;
  price: number;
  do_not_ship_before?: string; // YYYY-MM-DD
  ship_by?: string; // YYYY-MM-DD
  custom_field1?: string;
  custom_field2?: string;
  custom_field3?: string;
  custom_field4?: string;
  custom_field5?: string;
  comments?: string;
  void?: number; // 1 for voided lines, 0 or undefined for active lines
  voided?: boolean;
  is_kit_component?: boolean;
  kit_id?: number; // > 0 for bundle lines
  quantity_org?: number; // used in edit order flow
}

export interface CreateOrderPointsBody {
  action: 'create';
  to_draft: boolean;
  from_draft?: boolean; // indicates if placing order from existing draft
  version?: number; // legacy sends 2 for draft
  data: {
    order_header: OrderHeaderDto;
    order_detail: OrderDetailDto[];
  };
}

export interface UpdateOrderPointsBody {
  action: 'update';
  from_draft: boolean;
  data: {
    order_header: OrderHeaderDto;
    order_detail: OrderDetailDto[];
  };
}

export interface ReadOrderPointsBody {
  action: 'read';
  order_id: number;
  location?: string;
  from_draft?: boolean;
}

export interface GenerateOrderNumberBody {
  action: 'generate_number';
}

export interface PutOnHoldBody {
  action: 'on_hold' | 'off_hold';
  order_id: number;
  location: string;
  reason?: string;
}

export interface CancelOrderBody {
  action: 'cancel_order';
  order_id: number;
  location: string;
}

export interface TransferOrderBody {
  action: 'transfer-order';
  order_id: number;
  source_warehouse: string;
  destination_warehouse: string;
}

// Address Book
export interface CreateAddressBody {
  action: 'create_address';
  data: {
    title?: string;
    ship_to?: AddressDto;
    bill_to?: AddressDto;
    is_validate?: boolean;
  };
}

export interface UpdateAddressBody {
  action: 'update_address';
  data: {
    id?: number | string;
    title?: string;
    ship_to?: AddressDto;
    bill_to?: AddressDto;
  };
}

export interface DeleteAddressBody {
  action: 'delete_address';
  id: number | string;
}

// Address Book Export / Import
export interface ExportAddressesRequest {
  action: 'export';
  page_num: number;
  page_size: number;
  filter?: AddressBookFilter | null;
}

export interface ImportAddressesUploadParams {
  func: 'address_upload';
  action: 'import' | 'replace' | string;
}

export type AddressBookFilter = { field: string; value: string };

export interface ReadAddressesBody {
  action: 'read_addresses';
  page_num: number;
  page_size: number;
  filter?: AddressBookFilter | null;
}

export interface ValidateAddressBody {
  action: 'validate_address';
  data: Pick<AddressDto, 'address1' | 'address2' | 'city' | 'state_province' | 'postal_code'>;
}

export interface ListDraftsBody {
  action: 'list_drafts';
}

export interface DeleteDraftsBody {
  action: 'delete_draft';
  order_ids: number[];
}

export interface ToggleTemplateBody {
  action: 'toggle_template';
  order_id: number;
  is_template: boolean;
}

export interface CloneTemplateBody {
  action: 'clone_template';
  order_id: number;
}

export interface CloneOrderBody {
  action: 'clone_order';
  order_number: string;
  account_number: string;
}

// Inventory modal types moved to src/types/api/inventory.ts

// Responses (partial, extend as needed)
export interface GenerateOrderNumberResponse {
  number: string;
}

export interface OrderReadResponse {
  order_header: OrderHeaderDto;
  order_detail: OrderDetailDto[];
}

export interface DraftOrderReadResponse {
  draft_order: OrderReadResponse & { order_header: OrderHeaderDto };
}

export interface CreateOrderPointsResponse {
  order_id?: number;
  order_number?: string;
  total_drafts?: number;
  draft_order?: OrderReadResponse;
}

// Legacy update response is not referenced elsewhere for structure; keep minimal fields we actually observe used
export interface UpdateOrderResponse {
  order_header?: OrderHeaderDto;
  order_detail?: OrderDetailDto[];
  order_number?: string;
  total_drafts?: number;
}

export interface SaveEntryResponse {
  order_number: string;
  total_drafts?: number;
}

export interface AddressValidationResult {
  warnings?: string[] | string | null;
  errors?: string[] | string | null;
  correct_address?: AddressDto;
}

export interface ReadAddressesResponse {
  rows: Array<{ id: number; title?: string; ship_to?: AddressDto; bill_to?: AddressDto }>;
  total: number;
}

export interface ListDraftsResponse {
  draft_orders: Array<{ order_id: number; is_template?: boolean; [k: string]: unknown }>;
  total_drafts: number;
}

export type ApiEnvelope<T> = ApiResponse<T>;

// ==========================
// Mass Upload
// ==========================
export type MassUploadEnvironment = 'verify' | 'sandbox' | 'production';

export interface MassUploadParamsHeader {
  func: 'mass_upload';
  environment: MassUploadEnvironment;
}

export interface MassUploadResponse {
  // Legacy upload returns 200 with { data: ... } or { error_message }
  // On success, UI only logs a success timestamp; server may return additional info
  message?: string;
}

// OrderPoints Settings
export interface OrderSettingsDto {
  manual: boolean;
  prefix: string;
  suffix: string;
  starting_number: number;
  minimum_number_of_digits: number;
}

export interface ReadGeneralSettingsRequest {
  action: 'read_general';
}

export interface ReadGeneralSettingsResponse {
  manual: boolean;
  prefix: string;
  suffix: string;
  starting_number: number;
  minimum_number_of_digits: number;
}

export interface ShippingSettingsDto {
  carrier: string;
  service: string;
  packing_list_type: string;
  freight_account: string;
  consignee_number: string;
  terms: string;
  int_code: string;
  comments?: string;
}

export interface CustomFieldsSettingsDto {
  header_cf_1: string;
  header_cf_2: string;
  header_cf_3: string;
  header_cf_4: string;
  header_cf_5: string;
  detail_cf_1: string;
  detail_cf_2: string;
  detail_cf_5: string;
}

export interface OrderSettingsDto {
  manual: boolean;
  prefix: string;
  suffix: string;
  starting_number: number;
  minimum_number_of_digits: number;
  ack_email?: string;
}

export interface OrderPointsSettingsDto {
  shipping: {
    domestic: ShippingSettingsDto;
    international: ShippingSettingsDto;
  };
  custom_fields: CustomFieldsSettingsDto;
  order: OrderSettingsDto; // It's an object, not an array
}

// API Request/Response types
export interface ReadOrderPointsSettingsRequest {
  action: 'read_settings';
}

export type ReadOrderPointsSettingsResponse = ApiResponse<OrderPointsSettingsDto>;


// ==========================
// FTP Batches (OrderPoints)
// ==========================

export interface FtpBatchRow {
  id: number;
  row_id?: number;
  account_number: string;
  location: string;
  received_date: string; // ISO date/time
  name: string; // batch name
  filename?: string | null;
  ack_filename?: string | null;
  total_orders?: number;
  total_imported?: number;
  error_message?: string | null;
  has_email?: boolean | number; // legacy may send 0/1
}

export interface ListFtpBatchesBody {
  action: 'list_batches';
  filter: GridFilter;
  page_num: number;
  page_size: number;
  sort: Array<Record<string, 'asc' | 'desc'>>;
}

export interface ListFtpBatchesResponse {
  rows: FtpBatchRow[];
  total: number;
}

