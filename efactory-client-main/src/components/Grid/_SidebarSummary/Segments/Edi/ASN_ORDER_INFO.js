import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'

const OrdersToResolve = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Order</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Order #:</div>
          <div className="col-md-7">{ detail.order_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO #:</div>
          <div className="col-md-7">{ detail.po_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Id:</div>
          <div className="col-md-7">{ detail.order_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">ASN #:</div>
          <div className="col-md-7">{ detail.ship_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Shipped:</div>
          <div className="col-md-7">{ formatDate(detail.shipped_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sent:</div>
          <div className="col-md-7">{ formatDate( detail.asn_sent ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Acknowledged:</div>
          <div className="col-md-7">{ formatDate( detail.ack_received ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Document:</div>
          <div className="col-md-7">{ detail.document }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve