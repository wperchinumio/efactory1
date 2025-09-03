import React from 'react'
import { withRouter } from 'react-router-dom'
import Bar from './Bar'
import SingleReportDetail from './SingleReportDetail/_Content'
import OrderDetails from '../DetailPages/OrderDetail/_Content'

const AnalyticsMain = ({
  location
}) => {
  const getIdForPathname = pathname => {
    switch( pathname ){
      case '/analytics/profiles/domestic':
        return '2'
      case '/analytics/profiles/international':
        return '3'
      case '/analytics/slas/shipment-times':
        return '1'
      case '/analytics/slas/rma-receive-times':
        return '5'
      case '/analytics/slas/cyclecount':
        return '4'
      case '/analytics/profiles/time':
      case '/admin/analytics/profiles/by-time':
        return '6'
      case '/analytics/profiles/customer':
        return '7'
      case '/analytics/profiles/item':
        return '8'
      case '/analytics/profiles/shipservice':
      case '/admin/analytics/profiles/by-ship-service':
        return '9'
      case '/analytics/profiles/channel':
      case '/admin/analytics/profiles/by-channel':
        return '10'
      case '/transportation/analyzer':
        return '11'
      case '/analytics/slas/incident-reports':
        return '12'
      case '/transportation/time':
        return '13'
      case '/transportation/service':
        return '14'
      case '/analytics/deliverytimes':
        return '15'
      case '/admin/analytics/profiles/by-account':
        return '16'
      default:
        console.error(`route matches no id. ['${pathname}']`)
        return ''
    }
  }

  let { pathname, search } = location
  let id = getIdForPathname(pathname)
  let isOrderDetailShown = search.includes("?orderNum=")

  return (
    <div>
      {
        isOrderDetailShown &&
        <OrderDetails navigationHidden_received={true} />
      }
      <div style={ isOrderDetailShown ? { display : 'none' } : {} }>
        <Bar id={id} key={id} location={location} />
        <div>
          {
            id !== '' &&
            <SingleReportDetail
              id={id}
              key={`single-report-${id}`}
              pathname={pathname}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default withRouter(AnalyticsMain)
