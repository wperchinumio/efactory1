import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import EdiContent from '../components/Grid/_ContentEdi'
import EdiCustomizeView from '../components/Edi/CustomizeView/_Content'
import EdiExtShipmentsEntryContent from '../components/Edi/ExtShipments/Entry'
import EdiExtShipmentsDraftsContent from '../components/Edi/ExtShipments/Drafts'
import EdiFormContent from '../components/Edi/Form'
import EdiOverviewContent from '../components/Edi/Overview'

export default function EdiRoutes () {
  return <Switch>
    <Route
      exact
      path="/edi/documents/orders-to-resolve"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-850-to-resolve',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'ORDERS TO RESOLVE',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                received_date : { ...QuickFilters.receivedDateQF },
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              checkboxesAllowed : true,
              checkboxesAllowed_requireAdmin : true,
              rowDetailHidden : false,
              defaultColumns : [ 'indexCol', 'orderTypeCol' ],
              identifiers : {
                single_word : 'order',
                a_single_word : 'an order',
                plural_word : 'orders',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/orders-to-approve"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-850-to-approve',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'ORDERS TO APPROVE',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF),
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              checkboxesAllowed : true,
              checkboxesAllowed_requireAdmin : false,
              rowDetailHidden : false,
              defaultColumns : [ 'indexCol', 'orderTypeCol' ],
              identifiers : {
                single_word : 'order',
                a_single_word : 'an order',
                plural_word : 'orders',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/orders-to-ship"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-850-to-ship',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'ORDERS TO SHIP',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF),
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : false,
              defaultColumns : [ 'indexCol', 'orderTypeCol' ],
              identifiers : {
                single_word : 'order',
                a_single_word : 'an order',
                plural_word : 'orders',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/order-history"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-850-history',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'ORDER HISTORY',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                processing_date: Object.assign({}, QuickFilters.processingDateQF),
                received_date: Object.assign({}, QuickFilters.receivedDateQF),

              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              checkboxesAllowed : true,
              checkboxesAllowed_requireAdmin : true,
              rowDetailHidden : false,
              defaultColumns : [ 'indexCol', 'orderTypeCol' ],
              identifiers : {
                single_word : 'order',
                a_single_word : 'an order',
                plural_word : 'orders',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/asn-856"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-856-asn',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'ASN (856)',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                asn_sent: Object.assign({}, QuickFilters.asnSentDate,{allowClear : false}),
                ack_received: Object.assign({}, QuickFilters.ackReceivedDate),
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'order',
                a_single_word : 'an order',
                plural_word : 'orders',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/invoice-810"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-810-invoice',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'INVOICE (810)',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'invoices'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                invoice_sent: Object.assign({}, QuickFilters.invoiceSentDate,{allowClear : false}),
                ack_received: Object.assign({}, QuickFilters.ackReceivedDate),
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'invoice',
                a_single_word : 'an invoice',
                plural_word : 'invoices',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/remittance-820"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-820-remittance',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'REMITTANCE (820)',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'remittances'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF),
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'remittance',
                a_single_word : 'a remittance',
                plural_word : 'remittances',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/product-activity-852"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-852-product',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'PRODUCT ACTIVITY (852)',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'activities'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                period_start: Object.assign({}, QuickFilters.periodStartDateQF,{allowClear : false})
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'UPC',
                a_single_word : 'an activity',
                plural_word : 'activities',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/documents/planning-schedule-830"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-830-planning',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'PLANNING SCHEDULE (830)',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'activities'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
                plan_start_date: Object.assign({}, QuickFilters.planStartDateQF,{allowClear : false})
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'record',
                a_single_word : 'an activity',
                plural_word : 'activities',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/tp-activity"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-tp-activity',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'TP ACTIVITY',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'activities'
              },
              quick_filters: {
                account_number: QuickFilters.accountNumberQF,
                period: Object.assign({}, QuickFilters.periodDateQF,{allowClear : false})
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'order',
                a_single_word : 'an order',
                plural_word : 'orders',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/tp-items"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-tp-items',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'TP ITEMS',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'items'
              },
              quick_filters: {
                account_number: QuickFilters.accountNumberQF,
                partner       : { ...QuickFilters.partnersQF },
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'item',
                a_single_word : 'an item',
                plural_word : 'items',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/tp-addresses"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-tp-addresses',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'TP Addresses',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'addresses'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
                account_number: QuickFilters.accountNumberQF,
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'address',
                a_single_word : 'an address',
                plural_word : 'addresses',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/tp-d-ship-methods"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-tp-d-ship-methods',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'TP D. Ship Methods',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'ship methods'
              },
              quick_filters: {
                partner       : { ...QuickFilters.partnersQF },
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'ship method',
                a_single_word : 'a ship method',
                plural_word : 'ship methods',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/tp-status"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-tp-status',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'TP Status',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'partners'
              },
              quick_filters: {},
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'partner',
                a_single_word : 'a partner',
                plural_word : 'partners',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/basic-profile"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-basic-profile',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'Basic Profile',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'profiles'
              },
              quick_filters: {
                account_number: QuickFilters.accountNumberQF,
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'profile',
                a_single_word : 'a profile',
                plural_word : 'profiles',
              }
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/invoicing-profile"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-invoicing-profile',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'Invoicing Profile',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'profiles'
              },
              quick_filters: {
                account_number: QuickFilters.accountNumberQF,
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'profile',
                a_single_word : 'a profile',
                plural_word : 'profiles',
              }
            }}     
          />
        }
      }
    />
    <Route
      exact
      path="/edi/trading-partners/dcl-partners"
      render={
        () => {
          return <EdiContent
            config={{
              view: 'edi-dcl-partners',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'EDI',
                pageSubtitle: 'DCL PARTNERS',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'partners'
              },
              quick_filters: {
                plan_start_date: Object.assign({}, QuickFilters.planStartDateQF,{allowClear : false})
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
              defaultColumns : [ 'indexCol' ],
              identifiers : {
                single_word : 'partner',
                a_single_word : 'a partner',
                plural_word : 'partners',
              }
            }}      
          />
        }
      }
    />
    <Route
      exact
      path="/edi/overview"
      render={
        () => <EdiOverviewContent 
          config={{
            animation_on_next_query : false
          }}
        />
      }
    />
    <Route
      exact
      path="/edi/overview/customize-view"
      component={EdiCustomizeView}
    />
    <Route
      exact
      path="/edi/form"
      render={
        () => <EdiFormContent 
          config={{
            animation_on_next_query : false
          }}
        />
      }
    />
    <Route
      exact
      path="/edi/ext-shipments/shipment-entry"
      component={EdiExtShipmentsEntryContent}
    />
    <Route
      exact
      path="/edi/ext-shipments/drafts"
      component={EdiExtShipmentsDraftsContent}
    />
  </Switch>
}