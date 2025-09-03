import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

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
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.location }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Branch Plant:</div>
          <div className="col-md-7">{ detail.branch_plant }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Acct #:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Addr. Book #:</div>
          <div className="col-md-7">{ detail.an8 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order #:</div>
          <div className="col-md-7">{ detail.order_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receipt Date:</div>
          <div className="col-md-7">{ formatDate( detail.received_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO Type:</div>
          <div className="col-md-7">{detail.po_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO #:</div>
          <div className="col-md-7">{ detail.po_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO Total:</div>
          <div className="col-md-7">{ formatNumber( detail.po_total, 2 ) }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve