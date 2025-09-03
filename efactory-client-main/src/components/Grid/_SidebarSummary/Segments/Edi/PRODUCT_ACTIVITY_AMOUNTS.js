import React from 'react'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const ProductActivity = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Amounts </div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Gross Sales:</div>
          <div className="col-md-7">{ formatNumber( detail.gross_sales ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cust. Returns:</div>
          <div className="col-md-7">{ formatNumber( detail.customer_returns ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Stock On Hand:</div>
          <div className="col-md-7">{ formatNumber( detail.stock_on_hand ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Unavbl Stock:</div>
          <div className="col-md-7">{ formatNumber( detail.unavailable_stock ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ret. To Vendor:</div>
          <div className="col-md-7">{ formatNumber( detail.return_to_vendor ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Buyer Reserve:</div>
          <div className="col-md-7">{ formatNumber( detail.buyer_reserve ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">On Order:</div>
          <div className="col-md-7">{ formatNumber( detail.on_order ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">In Transit:</div>
          <div className="col-md-7">{ formatNumber( detail.in_transit ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Inbound Alloc:</div>
          <div className="col-md-7">{ formatNumber( detail.inbound_alloc ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Outbound Alloc:</div>
          <div className="col-md-7">{ formatNumber( detail.outbound_alloc ) }</div>
        </div>
      </div>
    </div>
  )
}

export default ProductActivity