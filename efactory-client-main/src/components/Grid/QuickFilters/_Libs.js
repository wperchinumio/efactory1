import moment                         from 'moment'
import * as QuickFilterTypes          from './_Types'

var last_months = [];
var i;
for (i = 0; i < 17; i++) {
    var s = moment().subtract(i,'months').endOf('month').format('YYYY-MM');
    last_months.push( { key: s, value: s, oper: '='});
}

export const
  last30DaysDate = moment().subtract(29, 'days').format('YYYY-MM-DD'),
  last10DaysDate = moment().subtract(9, 'days').format('YYYY-MM-DD'),
  lastDayPreviousMonth = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),

// get accounts and locations array
  lastReceiveDate = {
    field: 'last_receive_date',
    title: 'LAST RECEIVE DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  closedDate = {
    field: 'closed_date',
    title: 'CLOSED DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  labelUsedDate = {
    field: 'label_used_date',
    title: 'LABEL USED DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  partnersQF = {
    field: 'partner',
    title: 'PARTNER',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [],
    iconClassName : 'fa fa-industry',
    width : '230px'
  },
  qtyShortQF = {
    field: 'qty_short',
    title: 'SHORT ONLY',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  qtyVarianceQF = {
    field: 'qty_variance',
    title: 'VARIANCE ONLY',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  itemsViewQF = {
    field: 'items_view',
    title: 'ITEMS VIEW',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'Authorized',  value: 'authorized',  oper: '=' },
      { key: 'Replacement', value: 'replacement', oper: '=' }
    ],
    iconClassName : 'fa fa-tags'
  },
  daterangeDates = {
    'Last 30 Days': last30DaysDate,
    'Last 10 Days': last10DaysDate,
  },

  receivedDateQF = {
    field: 'received_date',
    title: 'RECEIVED DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  shippedDateQF = {
    field: 'shipped_date',
    title: 'SHIPPED DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  deliveryDateQF = {
    field: 'delivery_date',
    title: 'DELIVERY DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  processingDateQF = {
    field: 'processing_date',
    title: 'SHIPPED DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  orderedDateQF = {
    field: 'ordered_date',
    title: 'ORDER DATE' ,
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  accountNumberQF = {
    field: 'account_number',
    title: 'ACCOUNT',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [],
    iconClassName : 'fa fa-user'
  },
  orderTypeQF = {
    field: 'order_type',
    title: 'CHANNEL',
    type : QuickFilterTypes.DROPDOWN_QF, options: [],
    iconClassName : 'fa fa-cloud'
  }, // TODO
  locationQF = {
    field: 'location',
    title: 'WAREHOUSE',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [],
    iconClassName : 'fa fa-industry'
  },
  warehouseQF = {
    field: 'inv_type_region',
    title: 'WAREHOUSE',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [],
    iconClassName : 'fa fa-industry'
  },
  flagsQF = {
    field: 'flags',
    title: 'FLAGS',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'Key', value: 'K', oper: '=' },
      { key: 'Re-Order', value: 'R', oper: '=' },
      { key: 'Short', value: 'S', oper: '=' }
    ]
  },
  itemStatusQF = {
    field: 'status',
    title: 'STATUS',
    type : QuickFilterTypes.DROPDOWN_QF,
    allOptionHidden: true,
    options: [
      { key: 'Received', value: 'received', oper: '=' },
      { key: 'To Receive', value: 'to_receive', oper: '=' }
    ]
  },
  intCodeQF = {
    field: 'international_code',
    title: 'DESTINATION',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [ { key: 'Domestic', value: 0, oper: '=' }, { key: 'International', value: 0, oper: '<>' } ],
    iconClassName : 'fa fa-location-arrow'
  },
  omitZeroQtyQF = {
    field: 'omit_zero_qty',
    title: 'OMIT ZERO QTY',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },

  boLinesOnlyQF = {
    field: 'bo_lines',
    title: ' B/O Lines Only',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },

  consignedQF = {
    field: 'consigned',
    title: 'CONSIGNED',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  returnsQF = {
    field: 'returns',
    title: 'RETURNS',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  dclPurchasedQF = {
    field: 'dcl_purchased',
    title: 'DCL PURCHASED',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  showAllQF = {
    field: 'show_all',
    title: 'SHOW ALL LOCATIONS',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  transactionDateQF = {
    field: 'transaction_date',
    title: 'TRANSACTION DATE',
    type : QuickFilterTypes.DATE_RANGE_QF,
  },
  cycleCountDateQF = {
    field: 'cycle_count_date',
    title: 'CYCLE COUNT DATE',
    type : QuickFilterTypes.DATE_RANGE_QF,
  },
  omitExpiredQF = {
    field: 'omit_expired',
    title: 'OMIT EXPIRED LOTS',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  showExpiredBundleQF = {
    field: 'show_expired',
    title: 'SHOW EXPIRED',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  omitObsoleteQF = {
    field: 'omit_obsolete',
    title: 'OMIT OBSOLETE',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  issuedDateQF = {
    field: 'issued_date',
    title: 'ISSUED DATE',
    type : QuickFilterTypes.DATE_RANGE_QF,
  },
  preceiptdateQF = {
    field: 'p_receipt_date',
    title: 'P RECEIPT DATE',
    type : QuickFilterTypes.DATE_RANGE_QF,
  },
  ireceiptdateQF = {
    field: 'i_receipt_date',
    title: 'I RECEIPT DATE',
    type : QuickFilterTypes.DATE_RANGE_QF,
  },
  returnStatusQF = {
    field: 'return_status',
    title: 'RETURN STATUS',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'Open', value: 'open', oper: '=' },
      { key: 'Received', value: 'received', oper: '=' }
      //{ key: 'Disposition Pending', value: 'disposition', oper: '=' }
    ],
    iconClassName : 'fa fa-reorder'
  },
  returnTypeQF = {
    field: 'return_type',
    title: 'RETURN TYPE',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'RMA', value: 'RMA', oper: '=' },
      { key: 'Undeliverables', value: 'Undeliverables', oper: '=' }
    ],
    iconClassName : 'fa fa-reorder'
  },
  totalTypeQF = {
    field: 'total',
    title: 'TOTAL',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'Total - By Item',       value: 'item', oper: '=' },
      { key: 'Total - By Warehouse',  value: 'warehouse', oper: '=' },
      { key: 'Total - By Account',    value: 'account', oper: '=' }
    ]
  },
  onDateQF = {
    field: 'on_date',
    title: 'AS OF DATE',
    type : QuickFilterTypes.DATE_QF
  },
  recommendedQtyOnlyQF = {
    field: 'recommended_qty_only',
    title: 'RECOMMENDED QTY ONLY',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  basisLevelQF = {
    field: 'basis_level',
    title: 'BASIS LEVEL ',
    type : QuickFilterTypes.INPUT_TEXT_QF,
    iconClassName : 'fa fa-pencil-square-o'
  },
  targetLevelQF = {
    field: 'target_level',
    title: 'TARGET LEVEL ',
    type : QuickFilterTypes.INPUT_TEXT_QF,
    iconClassName : 'fa fa-pencil-square-o'
  },
  excludeZeroQtyQF = {
    field: 'exclude_zero_qty',
    title: 'EXCLUDE ZERO QTY',
    type : QuickFilterTypes.BOOLEAN_QF,
    iconClassName : 'fa fa-no-icon'
  },
  shipmentWeeksQF = {
    field: 'shipment_weeks',
    title: 'SHIPMENT WEEKS ',
    type : QuickFilterTypes.INPUT_TEXT_QF,
    iconClassName : 'fa fa-pencil-square-o'
  },
  qtyLessThanQF = {
    field: 'qty_less_than',
    title: 'QTY LESS THAN ',
    type : QuickFilterTypes.INPUT_TEXT_QF,
    iconClassName : 'fa fa-pencil-square-o'
  },
  serialNumberQF = {
    field: 'serial_number',
    title: 'SERIAL # ',
    type : QuickFilterTypes.INPUT_TEXT_QF,
    iconClassName : 'fa fa-pencil-square-o'
  },
  rtRMADateQF = {
    field: 'rma_date',
    title: 'RMA DATE',
    type : QuickFilterTypes.DATE_RANGE_QF,
  },
  rtRMATypeQF = {
    field: 'rma_type_code',
    title: 'RMA TYPE',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'T01', value: 'T01', oper: '=' },
      { key: 'T02', value: 'T02', oper: '=' },
      { key: 'T03', value: 'T03', oper: '=' },
      { key: 'T11', value: 'T11', oper: '=' },
      { key: 'T12', value: 'T12', oper: '=' },
      { key: 'T13', value: 'T13', oper: '=' },
      { key: 'T21', value: 'T21', oper: '=' },
      { key: 'T22', value: 'T22', oper: '=' },
      { key: 'T23', value: 'T23', oper: '=' },
      { key: 'T24', value: 'T24', oper: '=' },
      { key: 'T25', value: 'T25', oper: '=' },
      { key: 'T26', value: 'T26', oper: '=' },
      { key: 'T31', value: 'T31', oper: '=' },
      { key: 'T32', value: 'T32', oper: '=' },
      { key: 'T33', value: 'T33', oper: '=' },
      { key: 'T81', value: 'T81', oper: '=' },
      { key: 'T82', value: 'T82', oper: '=' },
      { key: 'T99', value: 'T99', oper: '=' },
      ],
    iconClassName : 'fa fa-exchange'
  },
  rtRMAStatusQF = {
    field: 'rma_status',
    title: 'RMA STATUS',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'Open', value: 1, oper: '=' },
      { key: 'Closed', value: 2, oper: '=' },
      { key: 'Expired', value: 3, oper: '=' },
      { key: 'Canceled', value: 4, oper: '=' }
    ],
    iconClassName : 'fa fa-question-circle'
  },

  // orderConditionQF = {
  //   field: 'order_condition',
  //   title: 'ORDER CONDITION',
  //   type : QuickFilterTypes.DROPDOWN_QF,
  //   options: [
  //     { key: 'Open', value: 'open', oper: '=' },
  //     { key: 'On Hold', value: 'onhold', oper: '=' },
  //     { key: 'B/O Orders Only', value: 'bo-orders', oper: '=' },
  //     { key: 'B/O Lines Only', value: 'bo-lines', oper: '=' },
  //     { key: 'Pre-Released', value: 'pre-released', oper: '=' },
  //     { key: 'Shipped', value: 'shipped', oper: '=' },
  //     { key: 'Canceled', value: 'canceled', oper: '=' }
  //   ],
  //   iconClassName : 'fa fa-question-circle'
  // },

  /*rtDispositionQF = {
    field: 'disposition_code',
    title: 'DISPOSITION',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [ { key: 'D1', value: 'D1', oper: '=' },
      { key: 'D2', value: 'D2', oper: '=' },
      { key: 'D3', value: 'D3', oper: '=' },
      { key: 'D5', value: 'D5', oper: '=' },
      { key: 'D10', value: 'D10', oper: '=' },
      { key: 'D18', value: 'D18', oper: '=' }
    ],
    iconClassName : 'fa fa-exchange'
  },*/
  rtRMAWarehouseQF = {
    field: 'location',
    title: 'RMA WAREHOUSE',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [],
    iconClassName : 'fa fa-industry'
  },
  invoiceDate = {
    field: 'invoice_date',
    title: 'INVOICE DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  asnSentDate = {
    field: 'asn_sent',
    title: 'ASN SENT',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  ackReceivedDate = {
    field: 'ack_received',
    title: 'ACK. Received',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  invoiceSentDate = {
    field: 'invoice_sent',
    title: 'Invoice SENT',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  periodStartDateQF = {
    field: 'period_start',
    title: 'Period Start',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  planStartDateQF = {
    field: 'plan_start_date',
    title: 'Plan Start',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  periodDateQF = {
    field: 'period',
    title: 'Period',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  accountWHQF = {
    field: 'account_wh',
    title: 'Account-WH',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [],
    iconClassName : 'fa fa-industry'
  },
  batteryCategoriesQF = {
    field: 'battery_category',
    title: 'Battery Category',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'ION - Ion', value: 'ION', oper: '=' },
      { key: 'MTL - Metal', value: 'MTL', oper: '=' }
    ]
  },
  batteryConfigQF = {
    field: 'battery_configuration',
    title: 'Battery Config.',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'SKU - SKU Only', value: 'SKU', oper: '=' },
      { key: 'CNT - Contained', value: 'CNT', oper: '=' },
      { key: 'PCK - Packed', value: 'PCK', oper: '=' },
    ]
  },
  batteryTypeQF = {
    field: 'battery_type',
    title: 'Battery Type',
    type : QuickFilterTypes.DROPDOWN_QF,
    options: [
      { key: 'CCN - Cell', value: 'CCN', oper: '=' },
      { key: 'BTT - Battery', value: 'BTT', oper: '=' },
      { key: 'CBT - Button', value: 'CBT', oper: '=' },
    ]
  },
  buildDateQF = {
    field: 'build_date',
    title: 'START DATE',
    type: QuickFilterTypes.DATE_RANGE_QF,
  },
  completionDateQF = {
    field: 'completion_date',
    title: 'COMPLETION DATE',
    type: QuickFilterTypes.DATE_RANGE_QF,
  },
  woStatusQF = {
    field: 'wo_status',
    title: 'WO STATUS',
    type: QuickFilterTypes.DROPDOWN_QF,
    allOptionHidden: true,
    options: [
      { key: 'Open', value: 'open', oper: '=' },
      { key: 'Complete', value: 'complete', oper: '=' }
    ]
  },
  billingDate = {
    field: 'tbp_date',
    title: 'BILLING DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  issueDate = {
    field: 'issue_date',
    title: 'ISSUE DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  transactionDate = {
    field: 'transaction_date',
    title: 'TRANSACTION DATE',
    type : QuickFilterTypes.DATE_RANGE_QF
  },
  sourceTypeQF = {
    field: 'source_type',
    title: 'Source',
    type : QuickFilterTypes.DROPDOWN_QF,
    nosort: true,
    options: [
      { key: '0 - ReturnTrak', value: '0', oper: '=' },
      { key: '1 - Orders', value: '1', oper: '=' },
      { key: '2 - Returns', value: '2', oper: '=' },
      { key: '3 - Orders no tracking', value: '3', oper: '=' },
      { key: '4 - Returns no tracking', value: '4', oper: '=' },
      { key: '12 - Customer Charge', value: '12', oper: '=' },
      { key: '13 - Assigned FF Adj.', value: '13', oper: '=' },
      { key: '14 - Assigned RS Adj.', value: '14', oper: '=' },
    ]
  },
  billingPeriod = {
    field: 'tbp_period',
    title: 'Billing Period',
    type : QuickFilterTypes.DROPDOWN_QF,
    nosort: true,
    options: last_months /*[
      { key: '2021-10', value: '2021-10', oper: '=' },
      { key: '2021-11', value: '2021-11', oper: '=' },
      { key: '2021-12', value: '2021-12', oper: '=' },
      { key: '2022-01', value: '2022-01', oper: '=' },
      { key: '2022-02', value: '2022-02', oper: '=' },
      { key: '2022-03', value: '2022-03', oper: '=' },
      { key: '2022-04', value: '2022-04', oper: '=' },
      { key: '2022-05', value: '2022-05', oper: '=' },
      { key: '2022-06', value: '2022-06', oper: '=' },
      { key: '2022-07', value: '2022-07', oper: '=' },
    ]*/
  },
  carrierRateCards = {
    field: 'carrier',
    title: 'Carrier',
    type : QuickFilterTypes.DROPDOWN_QF,
    nosort: true,
    options: [
      { key: 'Passport', value: 'APC', oper: '=' },
      //{ key: 'APC_DCL (APC DIRECT)', value: 'APC_DCL', oper: '=' },
      { key: 'DHL Global Mail', value: 'DHL Global Mail', oper: '=' },
      { key: 'FedEx', value: 'FedEx', oper: '=' },
      { key: 'UPS', value: 'UPS', oper: '=' },
      { key: 'UPS SurePost', value: 'UPS SurePost', oper: '=' },
      { key: 'USPS', value: 'USPS', oper: '=' },
      { key: 'SELECTSHIP', value: 'SELECTSHIP', oper: '=' },
    ]
  },
  billingCategory = {
    field: 'billing_category',
    title: 'Category',
    type : QuickFilterTypes.DROPDOWN_QF,
    nosort: true,
    options: [
      { key: 'Fulfillment', value: 'GF01', oper: '=' },
      { key: 'Returns, Others', value: 'GF02', oper: '=' },
      { key: 'Adjustments', value: 'GF03', oper: '=' },
    ]
  }
