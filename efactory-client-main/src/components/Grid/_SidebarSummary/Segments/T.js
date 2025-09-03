import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentT = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">To Receive</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Type:</div>
          <div className="col-md-7">{ detail.order_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Expected at DCL:</div>
          <div className="col-md-7">{ formatDate(detail.prom_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty Ordered:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_ordered, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty Received:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_received, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty Open:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_open, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty On Hold:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhold, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cust. PO:</div>
          <div className="col-md-7">{ detail.cust_po }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Trans. #:</div>
          <div className="col-md-7"> { detail.cust_tr_no } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order #:</div>
          <div className="col-md-7">{ detail.order_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Line no:</div>
          <div className="col-md-7">{ detail.line_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Date:</div>
          <div className="col-md-7">{ formatDate(detail.order_date)}</div>
        </div>
      </div>
    </div>
  ) 
}

export default SummarySegmentT