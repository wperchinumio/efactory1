// Filter configurations for different grid pages based on legacy code
import type { FilterConfig, GridFilterConfig } from '@/types/api/filters';

// Common filter definitions (based on legacy QuickFilters/_Libs.js)
export const locationQF: FilterConfig = {
  field: 'location',
  title: 'WAREHOUSE',
  type: 'DROPDOWN_QF',
  options: [],
  iconClassName: 'fa fa-industry',
  width: '120px'
};

export const accountNumberQF: FilterConfig = {
  field: 'account_number',
  title: 'ACCOUNT',
  type: 'DROPDOWN_QF',
  options: [],
  iconClassName: 'fa fa-user',
  width: '100px'
};

export const receivedDateQF: FilterConfig = {
  field: 'received_date',
  title: 'RECEIVED DATE',
  type: 'DATE_RANGE_CUSTOM_QF',
  iconClassName: 'fa fa-calendar',
  width: '140px',
  allowClear: true
};

export const shippedDateQF: FilterConfig = {
  field: 'shipped_date',
  title: 'SHIPPED DATE',
  type: 'DATE_RANGE_CUSTOM_QF',
  iconClassName: 'fa fa-calendar',
  width: '140px',
  allowClear: true
};

export const deliveryDateQF: FilterConfig = {
  field: 'delivery_date',
  title: 'DELIVERY DATE',
  type: 'DATE_RANGE_CUSTOM_QF',
  iconClassName: 'fa fa-calendar',
  width: '140px',
  allowClear: true
};

export const orderedDateQF: FilterConfig = {
  field: 'ordered_date',
  title: 'ORDER DATE',
  type: 'DATE_RANGE_CUSTOM_QF',
  iconClassName: 'fa fa-calendar',
  width: '140px',
  allowClear: true
};

export const orderTypeQF: FilterConfig = {
  field: 'order_type',
  title: 'CHANNEL',
  type: 'DROPDOWN_QF',
  options: [],
  iconClassName: 'fa fa-cloud',
  width: '100px'
};

export const intCodeQF: FilterConfig = {
  field: 'international_code',
  title: 'DESTINATION',
  type: 'DROPDOWN_QF',
  options: [
    { key: 'All', value: '', oper: '=' },
    { key: 'Domestic', value: '0', oper: '=' },
    { key: 'International', value: '1', oper: '<>' }
  ],
  iconClassName: 'fa fa-location-arrow',
  width: '120px'
};

export const flagsQF: FilterConfig = {
  field: 'flags',
  title: 'FLAGS',
  type: 'DROPDOWN_QF',
  options: [
    { key: 'Key', value: 'K', oper: '=' },
    { key: 'Re-Order', value: 'R', oper: '=' },
    { key: 'Short', value: 'S', oper: '=' }
  ]
};

export const boLinesOnlyQF: FilterConfig = {
  field: 'bo_lines',
  title: 'B/O Lines Only',
  type: 'BOOLEAN_QF',
  iconClassName: 'fa fa-no-icon'
};

export const qtyShortQF: FilterConfig = {
  field: 'qty_short',
  title: 'SHORT ONLY',
  type: 'BOOLEAN_QF',
  iconClassName: 'fa fa-no-icon'
};

export const qtyVarianceQF: FilterConfig = {
  field: 'qty_variance',
  title: 'VARIANCE ONLY',
  type: 'BOOLEAN_QF',
  iconClassName: 'fa fa-no-icon'
};

export const warehouseQF: FilterConfig = {
  field: 'inv_type_region',
  title: 'WAREHOUSE',
  type: 'DROPDOWN_QF',
  options: [],
  iconClassName: 'fa fa-industry'
};

export const totalTypeQF: FilterConfig = {
  field: 'total',
  title: 'TOTAL',
  type: 'TOTAL_QF'
};

// Grid-specific filter configurations
export const gridFilterConfigs: GridFilterConfig = {
  'orders-open': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'orders-onhold': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'orders-backorders': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'orders-prerelease': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'orders-shipped': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: { ...shippedDateQF, allowClear: false },
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: receivedDateQF
  },
  'orders-canceled': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'orders-all': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: shippedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: { ...receivedDateQF, allowClear: false },
    ordered_date: orderedDateQF
  },
  'order-lines-open': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'order-lines-onhold': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'order-lines-backorders': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF,
    bo_lines: boLinesOnlyQF
  },
  'order-lines-prerelease': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'order-lines-shipped': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: { ...shippedDateQF, allowClear: false },
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: receivedDateQF
  },
  'order-lines-canceled': {
    location: locationQF,
    account_number: accountNumberQF,
    received_date: receivedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    ordered_date: orderedDateQF
  },
  'order-lines-all': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: shippedDateQF,
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: { ...receivedDateQF, allowClear: false },
    ordered_date: orderedDateQF
  },
  // =====================
  // Items (Inventory)
  // =====================
  'items-status': {
    inv_type_region: warehouseQF,
    flags: flagsQF,
    omit_zero_qty: { ...qtyVarianceQF, field: 'omit_zero_qty', title: 'OMIT ZERO QTY' },
    omit_obsolete: { ...qtyVarianceQF, field: 'omit_obsolete', title: 'OMIT OBSOLETE' },
  },
  'items-receiving': {
    inv_type_region: warehouseQF,
    received_date: { ...receivedDateQF, allowClear: true },
    consigned: { field: 'consigned', title: 'CONSIGNED', type: 'BOOLEAN_QF' } as any,
    returns: { field: 'returns', title: 'RETURNS', type: 'BOOLEAN_QF' } as any,
    dcl_purchased: { field: 'dcl_purchased', title: 'DCL PURCHASED', type: 'BOOLEAN_QF' } as any,
    status: { field: 'status', title: 'STATUS', type: 'DROPDOWN_QF', options: [ { key: 'Received', value: 'received', oper: '=' }, { key: 'To Receive', value: 'to_receive', oper: '=' } ] } as any,
  },
  'items-onhold': {
    inv_type_region: warehouseQF,
    show_all: { field: 'show_all', title: 'SHOW ALL LOCATIONS', type: 'BOOLEAN_QF' } as any,
  },
  'items-transactions': {
    inv_type_region: warehouseQF,
    transaction_date: { field: 'transaction_date', title: 'TRANSACTION DATE', type: 'DATE_RANGE_CUSTOM_QF', allowClear: false },
  },
  'items-lotmaster': {
    inv_type_region: warehouseQF,
    omit_zero_qty: { field: 'omit_zero_qty', title: 'OMIT ZERO QTY', type: 'BOOLEAN_QF' } as any,
    omit_expired: { field: 'omit_expired', title: 'OMIT EXPIRED LOTS', type: 'BOOLEAN_QF' } as any,
  },
  'items-asofadate': {
    inv_type_region: warehouseQF,
    on_date: { field: 'on_date', title: 'AS OF DATE', type: 'DATE_QF', allowClear: false } as any,
    omit_zero_qty: { field: 'omit_zero_qty', title: 'OMIT ZERO QTY', type: 'BOOLEAN_QF' } as any,
    omit_obsolete: { field: 'omit_obsolete', title: 'OMIT OBSOLETE', type: 'BOOLEAN_QF' } as any,
  },
  'items-trsummary': {
    inv_type_region: warehouseQF,
    transaction_date: { field: 'transaction_date', title: 'TRANSACTION DATE', type: 'DATE_RANGE_CUSTOM_QF', allowClear: false },
  },
  'items-cyclecount': {
    inv_type_region: warehouseQF,
    cycle_count_date: { field: 'cycle_count_date', title: 'CYCLE COUNT DATE', type: 'DATE_RANGE_CUSTOM_QF', allowClear: false },
    qty_variance: qtyVarianceQF,
  },
  'items-dg-data': {
    account_wh: { field: 'account_wh', title: 'Account-WH', type: 'DROPDOWN_QF', options: [] } as any,
    battery_category: { field: 'battery_category', title: 'Battery Category', type: 'DROPDOWN_QF', options: [ { key: 'ION - Ion', value: 'ION', oper: '=' }, { key: 'MTL - Metal', value: 'MTL', oper: '=' } ] } as any,
    battery_configuration: { field: 'battery_configuration', title: 'Battery Config.', type: 'DROPDOWN_QF', options: [ { key: 'SKU - SKU Only', value: 'SKU', oper: '=' }, { key: 'CNT - Contained', value: 'CNT', oper: '=' }, { key: 'PCK - Packed', value: 'PCK', oper: '=' } ] } as any,
    battery_type: { field: 'battery_type', title: 'Battery Type', type: 'DROPDOWN_QF', options: [ { key: 'CCN - Cell', value: 'CCN', oper: '=' }, { key: 'BTT - Battery', value: 'BTT', oper: '=' }, { key: 'CBT - Button', value: 'CBT', oper: '=' } ] } as any,
  },
  // =====================
  // Inventory: Assembly
  // =====================
  'inventory-assembly': {
    inv_type_region: warehouseQF,
    build_date: { field: 'build_date', title: 'START DATE', type: 'DATE_RANGE_CUSTOM_QF' } as any,
    completion_date: { field: 'completion_date', title: 'COMPLETION DATE', type: 'DATE_RANGE_CUSTOM_QF' } as any,
    wo_status: { field: 'wo_status', title: 'WO STATUS', type: 'DROPDOWN_QF', allOptionHidden: true, options: [ { key: 'Open', value: 'open', oper: '=' }, { key: 'Complete', value: 'complete', oper: '=' } ] } as any,
  },
  // =====================
  // Inventory: Returns
  // =====================
  'inventory-returns': {
    inv_type_region: warehouseQF,
    issued_date: { field: 'issued_date', title: 'ISSUED DATE', type: 'DATE_RANGE_CUSTOM_QF' } as any,
    p_receipt_date: { field: 'p_receipt_date', title: 'P RECEIPT DATE', type: 'DATE_RANGE_CUSTOM_QF' } as any,
    i_receipt_date: { field: 'i_receipt_date', title: 'I RECEIPT DATE', type: 'DATE_RANGE_CUSTOM_QF' } as any,
    return_status: { field: 'return_status', title: 'RETURN STATUS', type: 'DROPDOWN_QF', options: [ { key: 'Open', value: 'open', oper: '=' }, { key: 'Received', value: 'received', oper: '=' } ] } as any,
    return_type: { field: 'return_type', title: 'RETURN TYPE', type: 'DROPDOWN_QF', options: [ { key: 'RMA', value: 'RMA', oper: '=' }, { key: 'Undeliverables', value: 'Undeliverables', oper: '=' } ] } as any,
  },
  'order-items-backlog': {
    inv_type_region: warehouseQF,
    account_number: accountNumberQF,
    qty_short: qtyShortQF,
    bo_lines: boLinesOnlyQF
  },
  'order-items-shipped': {
    inv_type_region: warehouseQF,
    account_number: accountNumberQF,
    shipped_date: { ...shippedDateQF, allowClear: false },
    total: totalTypeQF
  },
  'order-items-all': {
    inv_type_region: warehouseQF,
    account_number: accountNumberQF,
    received_date: { ...receivedDateQF, allowClear: false }
  },
  'detail-freight': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: { ...shippedDateQF, allowClear: false },
    delivery_date: { ...deliveryDateQF, allowClear: true },
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: receivedDateQF
  },
  'detail-package': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: { ...shippedDateQF, allowClear: false },
    delivery_date: { ...deliveryDateQF, allowClear: true },
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: receivedDateQF
  },
  'detail-serial': {
    location: locationQF,
    account_number: accountNumberQF,
    shipped_date: { ...shippedDateQF, allowClear: false },
    delivery_date: { ...deliveryDateQF, allowClear: true },
    order_type: orderTypeQF,
    international_code: intCodeQF,
    received_date: receivedDateQF
  }
};

// Helper function to get filters for a specific page
export function getFiltersForPage(pageKey: string): Record<string, FilterConfig> {
  return gridFilterConfigs[pageKey] || {};
}

// Helper function to get all available page keys
export function getAvailablePageKeys(): string[] {
  return Object.keys(gridFilterConfigs);
}
