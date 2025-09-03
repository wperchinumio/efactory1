import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import GridContent from '../components/Grid/_Content'
import Entry from '../components/ReturnTrak/Entry/_Content'
import DraftsContent from '../components/ReturnTrak/Drafts/_Content'

export default function ReturnTrakRoutes () {
  return <Switch>
    <Route 
      exact
      path='/returntrak'
      component={Entry} 
    />
    <Route 
      exact
      path='/returntrak/drafts'
      component={DraftsContent} 
    />
    <Route
      exact
      path="/returntrak/rmas/open"
      render={
        () => {
          return <GridContent
            config={{
              view: 'returntrak-open',
              defaultColumns : [ 'indexCol' ],
              header: {
                pageIcon: 'fa fa-exchange',
                pageTitle: 'RMAS',
                pageSubtitle: 'OPEN'
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'rmas'
              },
              quick_filters: {
                rma_date: Object.assign({}, QuickFilters.rtRMADateQF ,{allowClear : true}),
                account_number: QuickFilters.accountNumberQF,
                rma_type_code: QuickFilters.rtRMATypeQF,
                location: QuickFilters.rtRMAWarehouseQF,
                last_receive_date : QuickFilters.lastReceiveDate
              },
              gridSidebarSummary : {
                type:'rma'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/returntrak/rmas/all"
      render={
        () => {
          return <GridContent
            config={{
              view: 'returntrak-all',
              defaultColumns : [ 'indexCol' ],
              header: {
                pageIcon: 'fa fa-exchange',
                pageTitle: 'RMAS',
                pageSubtitle: 'ALL',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'rmas'
              },
              quick_filters: {
                rma_date: QuickFilters.rtRMADateQF,
                account_number: QuickFilters.accountNumberQF,
                rma_type_code: QuickFilters.rtRMATypeQF,
                rma_status: QuickFilters.rtRMAStatusQF,
                location: QuickFilters.rtRMAWarehouseQF,
                last_receive_date : QuickFilters.lastReceiveDate,
                closed_date: QuickFilters.closedDate,
                label_used_date:  QuickFilters.labelUsedDate,
              },
              gridSidebarSummary : {
                type:'rma'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/returntrak/rmas/items"
      render={
        () => {
          return <GridContent
            config={{
              view: 'returntrak-items',
              defaultColumns : [ 'indexCol' ],
              header: {
                pageIcon: 'fa fa-exchange',
                pageTitle: 'RMAS',
                pageSubtitle: 'ITEMS',
              },
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'rows'
              },
              quick_filters: {
                rma_date: QuickFilters.rtRMADateQF,
                account_number: QuickFilters.accountNumberQF,
                rma_type_code: QuickFilters.rtRMATypeQF,
                rma_status: QuickFilters.rtRMAStatusQF,
                location: QuickFilters.rtRMAWarehouseQF,
                items_view : QuickFilters.itemsViewQF,
                last_receive_date : QuickFilters.lastReceiveDate
              },
              gridSidebarSummary : {
                type:'rma'
              },
              rowDetailHidden : true
            }}
          />
        }
      }
    />
    <Route
      exact
      path="/returntrak/shipped-orders"
      render={
        () => {
          return <GridContent
            config={{
              view: 'fulfillment-rma',
              defaultColumns : [ 'indexCol', 'orderTypeCol' ],
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
                shipped_date: Object.assign({}, QuickFilters.shippedDateQF ,{allowClear : false}) ,
                account_number: QuickFilters.accountNumberQF,
                location: QuickFilters.locationQF,
                international_code: QuickFilters.intCodeQF,
                serial_number: QuickFilters.serialNumberQF
              },
              gridSidebarSummary : {
                type : 'order'
              },
                rowDetailHidden : true,
            }}
          />
        }
      }
    />
  </Switch>
}