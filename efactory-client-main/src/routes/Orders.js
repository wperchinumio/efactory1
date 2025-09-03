import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import GridContent from '../components/Grid/_Content'

export default function OrdersRoutes () {
  return <Switch>
    <Route
      path="/orders/open"
      exact
      render={
        () => {
          return <GridContent
            config={
              {
              view: 'fulfillment-open',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'OPEN',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      path="/orders/onhold" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-onhold',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'ON HOLD',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/orders/backorders" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-backorders',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'BACK ORDERS',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/orders/prerelease" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-risk',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'PRE-RELEASE',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/orders/shipped" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-shipped',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'SHIPPED',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}),
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: QuickFilters.receivedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/orders/canceled" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-cancelled',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'CANCELED'
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF) ,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/orders/all" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-any',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'ALL',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'orders'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF),
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF ,{allowClear : false}),
                ordered_date: QuickFilters.orderedDateQF,
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true,
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/open" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-open',
              header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'OPEN',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/onhold" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-onhold',
                header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'ON HOLD',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/backorders" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-backorders',
              header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'BACK ORDERS',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF,
                bo_lines : QuickFilters.boLinesOnlyQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/prerelease" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-risk',
              header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'PRE-RELEASE',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: QuickFilters.receivedDateQF,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/shipped" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-shipped',
              header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'SHIPPED',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}),
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: QuickFilters.receivedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/canceled" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-cancelled',
              header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'CANCELED'
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF) ,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                ordered_date: QuickFilters.orderedDateQF
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-lines/all" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-lines-any',
              header: {
                pageIcon: 'icon-list',
                pageTitle: 'ORDER LINES',
                pageSubtitle: 'ALL',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'lines'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF),
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF ,{allowClear : false}),
                ordered_date: QuickFilters.orderedDateQF,
              },
              gridSidebarSummary : {
                type : 'order' // oneOf[ 'order', 'item' ]
              },
              rowDetailHidden : true
            }}
          />
        }
      }      
    />
    <Route
      path="/order-items/backlog" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-backlog',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ORDER ITEMS',
                pageSubtitle: 'BACKLOG ITEMS',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'rows'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                account_number  : QuickFilters.accountNumberQF,
                qty_short       : QuickFilters.qtyShortQF,
                bo_lines        : QuickFilters.boLinesOnlyQF
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
      path="/order-items/shipped" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-shipped',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ORDER ITEMS',
                pageSubtitle: 'SHIPPED ITEMS',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'rows'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}) ,
                total   : QuickFilters.totalTypeQF
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
      path="/order-items/all" 
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-all-items',
              header: {
                pageIcon: 'icon-tag',
                pageTitle: 'ORDER ITEMS',
                pageSubtitle: 'ALL ITEMS',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'rows'
              },
              quick_filters: {
                inv_type_region : QuickFilters.warehouseQF,
                account_number: QuickFilters.accountNumberQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF ,{allowClear : false}) ,
                //order_type : QuickFilters.orderTypeQF
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
      path="/detail/package"
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-package',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'PACKAGE',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'items'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}) ,
                delivery_date: Object.assign({}, QuickFilters.deliveryDateQF ,{allowClear : true}) ,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF),
              },
              gridSidebarSummary : {
                type:'detail'
              },
              rowDetailHidden : true,
            }}
          />
        }
      }
    />
    <Route
      path="/detail/serial"
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-serial',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'SERIAL',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'serial numbers'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}) ,
                delivery_date: Object.assign({}, QuickFilters.deliveryDateQF ,{allowClear : true}) ,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF),
              },
              gridSidebarSummary : {
                type:'detail'
              },
              rowDetailHidden : true,
            }}
          />
        }
      }
    />
    <Route
      path="/detail/freight"
      exact
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-freight',
              header: {
                pageIcon: 'icon-book-open',
                pageTitle: 'ORDERS',
                pageSubtitle: 'FREIGHT',
              },
              grid : {
                orderTypeColumnVisible : true,
                paginationWord : 'packages'
              },
              quick_filters: {
                location: QuickFilters.locationQF,
                account_number: QuickFilters.accountNumberQF,
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}) ,
                delivery_date: Object.assign({}, QuickFilters.deliveryDateQF ,{allowClear : true}) ,
                order_type: QuickFilters.orderTypeQF,
                international_code: QuickFilters.intCodeQF,
                received_date: Object.assign({}, QuickFilters.receivedDateQF),
              },
              gridSidebarSummary : {
                type:'detail'
              },
              rowDetailHidden : true,
            }}
          />
        }
      }
    />
  </Switch>
}