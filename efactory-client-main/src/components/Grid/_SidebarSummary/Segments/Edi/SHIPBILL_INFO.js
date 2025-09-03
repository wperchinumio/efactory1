import React from 'react'
import AddressTemplate from '../_AddressTemplate'

const OrdersToResolve = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Shipping & Billing</div>
      </div>
      <div className="portlet-body">
        <AddressTemplate
          { ...detail.shipping_address }
          isShipping={ true }
        />
        <div className="row">
          <div className="col-md-5 seg-label">Ship To Code:</div>
          <div className="col-md-7">{ detail.ship_to_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Carrier:</div>
          <div className="col-md-7">{ detail.shipping_carrier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Service:</div>
          <div className="col-md-7">{ detail.shipping_service }</div>
        </div>
        <AddressTemplate
          { ...detail.billing_address }
          isShipping={ false }
        />
        <div className="row">
          <div className="col-md-5 seg-label">Bill To Code:</div>
          <div className="col-md-7">{ detail.bill_to_code }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve