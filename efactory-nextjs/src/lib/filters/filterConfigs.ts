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
