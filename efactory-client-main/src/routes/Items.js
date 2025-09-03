import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import GridContent from '../components/Grid/_Content'
import PoNotifications from '../components/Services/Utilities/PoNotifications/_Content'
import PoReceipt from '../components/Services/Utilities/PoReceipt'
import PoRma from '../components/Services/Utilities/PoRma/_Content'

export default function ItemsRoutes () {
  return <Switch>
    <Route
      exact
      path="/inventory/items/status"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-status',
              defaultColumns : [ 'indexCol', 'itemFlagCol'],
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'STATUS',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                flags           : QuickFilters.flagsQF,
                omit_zero_qty : QuickFilters.omitZeroQtyQF,
                omit_obsolete: QuickFilters.omitObsoleteQF
              },
              gridSidebarSummary : {
                type : 'item', // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/receiving"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-receiving',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'RECEIVING',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF ,{allowClear : true}) ,
                consigned: QuickFilters.consignedQF,
                returns: QuickFilters.returnsQF,
                dcl_purchased: QuickFilters.dclPurchasedQF,
                status : QuickFilters.itemStatusQF,
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/onhold"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-onhold',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'ON HOLD',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                show_all        : QuickFilters.showAllQF
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/transactions"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-transactions',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'TRANSACTIONS',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                transaction_date: Object.assign( {}, QuickFilters.transactionDateQF, { allowClear : false } )
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    {/*<Route
      exact
      path="/inventory/items/toreceive"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-toreceive',
              defaultColumns : [ 'indexCol' ],
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'TO RECEIVE',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                consigned: QuickFilters.consignedQF,
                returns: QuickFilters.returnsQF,
                dcl_purchased: QuickFilters.dclPurchasedQF
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />*/}
    <Route
      exact
      path="/inventory/items/lotmaster"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-lotmaster',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'LOT MASTER',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                omit_zero_qty : QuickFilters.omitZeroQtyQF,
                omit_expired: QuickFilters.omitExpiredQF,
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/asofadate"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-asofadate',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'AS OF A DATE',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                on_date: Object.assign({}, QuickFilters.onDateQF ,{allowClear : false}) ,
                omit_zero_qty : QuickFilters.omitZeroQtyQF,
                omit_obsolete: QuickFilters.omitObsoleteQF,
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/trsummary"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-transaction-summary',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'TRANSACTION SUMMARY',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                transaction_date: Object.assign( {}, QuickFilters.transactionDateQF, { allowClear : false } )
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/cyclecount"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-cyclecount',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'CYCLE COUNT',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                cycle_count_date: Object.assign( {}, QuickFilters.cycleCountDateQF, { allowClear : false } ),
                qty_variance    : QuickFilters.qtyVarianceQF
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/dg-data"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-dangerous-goods',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'DG Data',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                account_wh : QuickFilters.accountWHQF,
                battery_category : QuickFilters.batteryCategoriesQF,
                battery_configuration : QuickFilters.batteryConfigQF,
                battery_type: QuickFilters.batteryTypeQF,
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/items/bundle"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-bundle',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ITEMS',
                pageSubtitle: 'BUNDLES',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'lines'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                account_number: QuickFilters.accountNumberQF,
                show_expired: QuickFilters.showExpiredBundleQF,
              },
              gridSidebarSummary : {
                type : 'bundle', // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/receipts/po-notifications"
      component={PoNotifications}
    />
    <Route
      exact
      path="/inventory/receipts/po-receipt"
      component={PoReceipt}
    />
    <Route
      exact
      path="/inventory/receipts/rma-receipt"
      component={PoRma}
    />
    <Route
      exact
      path="/inventory/assembly"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-assembly',
              header: {
                pageIcon: 'fa fa-cubes',
                pageTitle: 'ASSEMBLY',
                pageSubtitle: '',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                build_date: QuickFilters.buildDateQF,
                completion_date: QuickFilters.completionDateQF,
                wo_status: QuickFilters.woStatusQF,
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true,
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/inventory/returns"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-returns',
              header: {
                pageIcon: 'fa fa-mail-reply',
                pageTitle: 'RETURNS',
                pageSubtitle: '',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                //issued_date: Object.assign({}, QuickFilters.issuedDateQF ,{allowClear : false}) ,
                issued_date: QuickFilters.issuedDateQF,
                p_receipt_date: QuickFilters.preceiptdateQF,
                i_receipt_date: QuickFilters.ireceiptdateQF,
                return_status: QuickFilters.returnStatusQF,
                return_type: QuickFilters.returnTypeQF
              },
              gridSidebarSummary : {
                type:'item'
              },
              rowDetailHidden : true,
            }}
          />
        }
      }
    />
  </Switch>
}