import React from 'react'
import { withRouter } from 'react-router-dom'
import OrderHelp from './Order/_Content'
import OPHelp from './OrderPoints/_Content'

const OthersMain = ({
  location: { pathname }
}) => {
  let isOrders = pathname.startsWith('/orders') || pathname.startsWith('orders')
  return (
    <div>
      {
        isOrders &&
       <OrderHelp pathname={pathname} />
      }
      {
        !isOrders &&
       <OPHelp pathname={pathname} />
      }
    </div>
  )
}

export default withRouter(OthersMain)
