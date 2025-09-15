// Order detail types inferred from legacy eFactory response (parity-first)

export interface AddressDto {
  company: string;
  attention: string;
  address1: string;
  address2: string;
  email: string;
  phone: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface OrderLineDto {
  id: number;
  order_id: number;
  orderdetail_id: number;
  kit_id: number;
  is_kit_component: boolean;
  line_number: number;
  item_number: string;
  description: string;
  quantity: number;
  shipped: number;
  is_back_order: boolean;
  price: number;
  do_not_ship_before: string | null;
  ship_by: string | null;
  comments: string;
  custom_field1: string;
  custom_field2: string;
  custom_field3: string;
  custom_field4: string;
  custom_field5: string;
  voided: boolean;
}

export interface SerialLotDto {
  SerialNo: string; // Contains either serial number (when Type="S") or lot number (when Type="L")
  Quantity: number;
  Type: string; // "S" for serial number, "L" for lot
}

export interface ShipmentShippedItemDto {
  id: number;
  line_number: number;
  extrafield_1: string;
  item_number: string;
  description: string;
  quantity: number;
  serials: SerialLotDto[] | null;
}

export interface ShipmentPackageDto {
  id: number;
  carton_id: string;
  pallet_id: string | null;
  pallet_asn: string | null;
  carton_count_number: number;
  weight: number;
  freight: number;
  tracking_number: string;
  tracking_number_link: string;
  asn: string;
  rated_weight: number;
  dimension: string;
  delivery_date: string | null;
  promised_date: string | null;
  delivery_info: string;
  shipped_items: ShipmentShippedItemDto[];
}

export interface ShipmentAddressDto extends AddressDto {
  country: string; // may return UNITED_STATES
}

export interface ShipmentDto {
  id: number;
  ship_id: number;
  ship_date: string;
  status: number;
  shipping_carrier: string;
  shipping_service: string;
  carrier_id: number;
  carrier_dcln2: number;
  freight_account: string;
  total_weight: number;
  total_charge: number;
  reference1: string;
  reference2: string;
  reference3: string;
  reference4: string;
  rs_tr: string;
  ci_link: string | null;
  pl_link: string | null;
  bol_link: string | null;
  packages: ShipmentPackageDto[];
  shipping_address: ShipmentAddressDto;
}

export interface ShipmentsOverviewShipmentRowDto {
  id: number;
  line_index: number;
  ship_date: string;
  status: string;
  packages: number;
  total_weight: number;
  total_charge: number;
  shipping_carrier: string;
  shipping_service: string;
  pl_link: string | null;
  ci_link: string | null;
  bol_link: string | null;
  rs_tr: string;
  reference1: string;
  reference2: string;
  reference3: string;
  reference4: string;
}

export interface ShipmentsOverviewPackageRowDto {
  id: number;
  line_index: number;
  ship_date: string;
  package_number: string;
  asn: string;
  pallet_number: string | null;
  pallet_asn: string | null;
  shipping_carrier: string;
  shipping_service: string;
  tracking_number: string;
  tracking_link: string;
  proway_bill_number: string;
  freight_bill_to: string;
  package_weight: number;
  package_rated_weight: number;
  package_dimension: string;
  package_charge: number;
  delivery_date: string | null;
  promised_date: string | null;
  delivery_info: string;
}

export interface ShipmentsOverviewPackageDetailRowDto {
  id: number;
  line_index: number;
  ship_date: string;
  package_number: string;
  line_number: number;
  item_number: string;
  description: string;
  quantity: number;
  delivery_date: string | null;
  promised_date: string | null;
  delivery_info: string;
}

export interface ShipmentsOverviewSerialRowDto {
  id: number;
  line_index: number;
  ship_date: string;
  package_number: string;
  line_number: number;
  item_number: string;
  description: string;
  Type: string; // "S" for serial number, "L" for lot
  serial_no: string;
  quantity: number;
}

export interface ShipmentsOverviewDto {
  shipments: ShipmentsOverviewShipmentRowDto[];
  packages: ShipmentsOverviewPackageRowDto[];
  package_details: ShipmentsOverviewPackageDetailRowDto[];
  serials: ShipmentsOverviewSerialRowDto[] | null;
}

export interface OrderDetailDto {
  hide_pii: boolean;
  id: number;
  order_id: number;
  home_dir: string[];
  order_status: number;
  order_number: string;
  location: string;
  order_stage: number;
  stage_description: string;
  is_cancelled: boolean;
  is_back_order: boolean;
  account_number: string;
  order_type: string;
  system_id: string;
  ordered_date: string;
  received_date: string;
  po_number: string;
  customer_number: string;
  freight_account: string;
  consignee_number: string;
  shipping_carrier: string;
  shipping_service: string;
  shipping_address: AddressDto;
  billing_address: AddressDto;
  international_code: number;
  order_subtotal: number;
  shipping_handling: number;
  sales_tax: number;
  international_handling: number;
  total_due: number;
  amount_paid: number;
  net_due_currency: number;
  balance_due_us: number;
  international_declared_value: number;
  insurance: number;
  payment_type: string;
  terms: string;
  fob: string;
  packing_list_type: number;
  packing_list_comments: string;
  shipping_instructions: string;
  custom_field1: string;
  custom_field2: string;
  custom_field3: string;
  custom_field4: string;
  custom_field5: string;
  total_price_line: number;
  order_lines: OrderLineDto[];
  shipments: ShipmentDto[];
  shipments_overview: ShipmentsOverviewDto | null;
  allow_resent_ship_notification: boolean;
  custom_data: any;
}

// Request/response envelopes
export interface ReadOrderDetailRequest {
  action: 'read';
  resource: 'order';
  page_num: number;
  page_size: number;
  sort?: Array<Record<string, 'asc' | 'desc'>>;
  filter: {
    and: Array<Record<string, string>>;
    or: Array<Record<string, string>>;
  };
  fields: string[];
  policy_code?: string | number | null;
}

export interface ReadOrderDetailResponse {
  rows?: OrderDetailDto[];
  data?: { rows?: OrderDetailDto[] };
  error_message?: string;
}

export type OrderDetailResult =
  | { kind: 'single'; order: OrderDetailDto }
  | { kind: 'multiple'; orders: OrderDetailDto[] }
  | { kind: 'not_found' };

// Actions on orders (from legacy OrderPoints/OrderDetail toolbar)
export interface PutOnHoldBody {
  action: 'on_hold' | 'off_hold';
  order_id: number | string;
  location: string; // warehouse code string like 'LA - ZLDC'
  reason?: string; // only for on_hold
}

export interface CancelOrderBody {
  action: 'cancel_order';
  order_id: number | string;
  location: string;
}

export interface TransferOrderBody {
  action: 'transfer-order';
  order_id: number | string;
  source_warehouse: string; // e.g. 'LA'
  destination_warehouse: string; // e.g. 'YK'
}

export interface CloneOrderBody {
  action: 'clone_order';
  order_number: string;
  account_number: string;
}

export interface ResendShipConfirmationBody {
  action: 'resend_ship_confirmation';
  order_number: string;
  account_number: string;
  ship_to_email: string;
  bill_to_email: string;
}


