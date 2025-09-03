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
          <div className="col-md-5 seg-label">Invoice #:</div>
          <div className="col-md-7">{ detail.invoice_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Shipped Date:</div>
          <div className="col-md-7">{ formatDate( detail.shipped_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sent:</div>
          <div className="col-md-7">{ formatDate( detail.invoice_sent ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Acknowledged:</div>
          <div className="col-md-7">{ formatDate( detail.ack_received ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Net Amount:</div>
          <div className="col-md-7">{ formatNumber( detail.net_amount, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Allowances:</div>
          <div className="col-md-7">{ formatNumber( detail.allowances, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Charges:</div>
          <div className="col-md-7">{ formatNumber( detail.charges, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Gross Amount:</div>
          <div className="col-md-7">{ formatNumber( detail.gross_amount, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Freight:</div>
          <div className="col-md-7">{ formatNumber( detail.freight, 2 ) }</div>
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