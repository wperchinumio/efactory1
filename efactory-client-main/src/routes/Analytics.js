import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import AnalyticsContent from '../components/Analytics/_Content'
import CustomReports from '../components/Scheduler/CustomReports'
import GridContent from '../components/Grid/_Content'
import SchedulerContent from '../components/Scheduler/_Content'
import StandardReports from '../components/Scheduler/StandardReports'

export default function AnalyticsRoutes () {
  return <Switch>
    <Route
      exact
      path={[
        '/analytics/profiles/domestic',
        '/analytics/profiles/international',
        '/analytics/profiles/time',
        '/analytics/profiles/customer',
        '/analytics/profiles/item',
        '/analytics/profiles/channel',
        '/analytics/profiles/shipservice',
        '/analytics/slas/shipment-times',
        '/analytics/slas/rma-receive-times',
        '/analytics/slas/cyclecount',
        '/analytics/slas/incident-reports',
        '/analytics/deliverytimes',
      ]}
      component={AnalyticsContent}
    />
    <Route
      path='/analytics/scheduler'
      component={SchedulerContent}
      exact
    />
    <Route
      exact
      path='/analytics/scheduler/reports'
      component={StandardReports}
    />
    <Route
      exact
      path='/analytics/scheduler/customreports'
      component={CustomReports}
    />
    <Route
      exact
      path="/analytics/planning/replenishment"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-replenishment',
              header: {
                pageIcon: 'icon-calendar',
                pageTitle: 'PLANNING',
                pageSubtitle: 'REPLENISHMENT',
              },
              defaultColumns : [ 'indexCol' ],
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                recommended_qty_only: QuickFilters.recommendedQtyOnlyQF,
                basis_level: QuickFilters.basisLevelQF,
                target_level: QuickFilters.targetLevelQF
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
      path="/analytics/planning/slowmoving"
      render={
        () => {
          return <GridContent
            config={{
              view: 'inventory-slowmoving',
              header: {
                pageIcon: 'icon-calendar',
                pageTitle: 'PLANNING',
                pageSubtitle: 'SLOW MOVING',
              },
              defaultColumns : [ 'indexCol' ],
              grid : {
                orderTypeColumnVisible : false,
                paginationWord : 'items'
              },
              quick_filters: {
                exclude_zero_qty: QuickFilters.excludeZeroQtyQF,
                shipment_weeks: QuickFilters.shipmentWeeksQF,
                qty_less_than: QuickFilters.qtyLessThanQF
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
  </Switch>
}
