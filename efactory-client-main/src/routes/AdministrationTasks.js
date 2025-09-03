import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import Accounts from '../components/Services/Accounts/_Content'
import GridContent from '../components/Grid/_Content'
import InvoiceOpen from '../components/Invoices/Open/_Content'
import NotificationReceiptContents from '../components/Notification/ReceiptRouterContainer'
import OPSettingsContent from '../components/OrderPoints/Settings/_Content'
import RMASettingsContent from '../components/ReturnTrak/Settings/_Content'
import ShipConfirmationContent from '../components/Notification/ShipConfirmation'
import ThreePLSettingsContent from '../components/ThreePLSettings'
import RateCards from '../components/RateCards/_Content'

export default function AdministrationTasks () {
  return <Switch>
      <Route 
        exact
        path="/services/administration-tasks/orderpoints-settings"  
        component={OPSettingsContent} 
      />
      <Route 
        exact
        path="/services/administration-tasks/returntrak-settings"   
        component={RMASettingsContent} 
      />
      <Route 
        exact
        path="/services/administration-tasks/special-settings"          
        component={ThreePLSettingsContent} 
      />
      <Route 
        exact
        path="/services/administration-tasks/accounts"              
        component={Accounts} 
      />
      <Route
        exact
        path="/services/administration-tasks/email-notifications/ship-confirmation" 
        component={ShipConfirmationContent} 
      />
      <Route
        exact
        path={[
          '/services/administration-tasks/email-notifications/order-receipt',
          '/services/administration-tasks/email-notifications/po-receipt',
          '/services/administration-tasks/email-notifications/rma-receipt',
          '/services/administration-tasks/email-notifications/unplanned-receipt'
        ]} 
        component={NotificationReceiptContents} 
      />
      <Route
        component={InvoiceOpen}
        exact
        path="/services/administration-tasks/invoices/open"
      />
      <Route
        exact
        path="/services/administration-tasks/invoices/all"
        render={
          () => {
            return <GridContent
              config={{
                view: 'invoice-all',
                header: {
                  pageIcon: 'icon-book-open',
                  pageTitle: 'INVOICE',
                  pageSubtitle: 'ALL'
                },
                defaultColumns : [ 'indexCol' ],
                grid : {
                  orderTypeColumnVisible : false,
                  paginationWord : 'invoice',
                  invoiceAllColumnVisible : true
                },
                quick_filters: {
                  invoice_date: QuickFilters.invoiceDate,
                },
                gridSidebarSummary : {
                  hidden:true
                },
                rowDetailHidden : true,
                  schedulerHidden : true
              }}
            />
          }
        }
      />
      <Route
        exact
        path="/services/administration-tasks/invoices/freight-charges"
        render={
          () => {
            return <GridContent
              config={{
                view: 'freight-charges',
                header: {
                  pageIcon: 'fa fa-truck',
                  pageTitle: 'FREIGHT CHARGES',
                  pageSubtitle: ''
                },
                defaultColumns : [ 'indexCol' ],
                grid : {
                  orderTypeColumnVisible : false,
                  paginationWord : 'records',
                  //invoiceAllColumnVisible : true
                },
                quick_filters: {
                  tbp_period: QuickFilters.billingPeriod,
                  inv_type_region: QuickFilters.warehouseQF,
                  account_number: QuickFilters.accountNumberQF,
                  billing_category: QuickFilters.billingCategory,
                  //tbp_date: QuickFilters.billingDate,
                  //issue_date: QuickFilters.issueDate,
                  //transaction_date: QuickFilters.transactionDate,
                  //source_type: QuickFilters.sourceTypeQF,
                },
                gridSidebarSummary : {
                  hidden:true
                },
                rowDetailHidden : true,
                  schedulerHidden : true
              }}
            />
          }
        }
      />
      <Route
        exact
        path="/services/administration-tasks/invoices/rate-cards"
        render={
          () => {
            return <RateCards />
            /*return <GridContent
              config={{
                view: 'rate-cards',
                header: {
                  pageIcon: 'fa fa-list',
                  pageTitle: 'RATE CARDS',
                  pageSubtitle: ''
                },
                defaultColumns : [ 'indexCol' ],
                grid : {
                  orderTypeColumnVisible : false,
                  paginationWord : 'records',
                  //invoiceAllColumnVisible : true
                },
                quick_filters: {
                  carrier: QuickFilters.carrierRateCards,
                },
                gridSidebarSummary : {
                  hidden:true
                },
                rowDetailHidden : true,
                  schedulerHidden : true
              }}
            />*/
          }
        }
      />
  </Switch>
}