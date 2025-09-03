import React from 'react'
import OrderEntry from './OrderEntry'
import Drafts from './Drafts'
import AddressBook from './AddressBook'
import MassUpload from './MassUpload'
import ShippingCostEstimator from './ShippingCostEstimator'

const OrderpointsHelpSection = ({ pathname }) => {
  return (
    <div>
      { 
        pathname.includes('help/1') &&
        <OrderEntry />
      }
      { 
        pathname.includes('help/2') &&
        <Drafts />
      }
      { 
        pathname.includes('help/3') &&
        <AddressBook />
      }
      { 
        pathname.includes('help/4') &&
        <MassUpload />
      }
      { 
        pathname.includes('help/5') &&
        <ShippingCostEstimator />
      }
    </div>
  )
}

export default React.memo(OrderpointsHelpSection)