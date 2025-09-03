import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AnalyticsContent from '../components/Analytics/_Content'
import * as QuickFilters from '../components/Grid/QuickFilters/_Libs'
import GridContent from '../components/Grid/_Content'
import FreightEstimator from '../components/Services/Utilities/FreightEstimator/_Content'
import { getUserData } from '../util/storageHelperFuncs'

export default function TransportationRoutes () {
  const isLocalAdmin = Boolean(getUserData('is_local_admin'))
  if (!isLocalAdmin) {
    return <span />
  }
  return <Switch>
    <Route
      exact
      path={
        [
          '/transportation/time',
          '/transportation/service',
          '/transportation/analyzer'
        ]
      }
      component={AnalyticsContent}
    />
    <Route
      exact
      path="/transportation/packages/cost-estimator"
      component={FreightEstimator}
    />

    <Route
      path="/transportation/packages/shipping-detail"
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
