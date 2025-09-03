import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentQ = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">Received</div>
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
          <div className="col-md-5 seg-label">Order Type Desc:</div>
          <div className="col-md-7">{ detail.order_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cust. PO #:</div>
          <div className="col-md-7">{ detail.cust_po }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receipt Date:</div>
          <div className="col-md-7">{ formatDate(detail.receipt_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Received:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_received, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Supplier Ref.:</div>
          <div className="col-md-7"> { detail.sup_ref } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Box / Pallet:</div>
          <div className="col-md-7">{ detail.box_pal }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot / Serial:</div>
          <div className="col-md-7">{ detail.lot_ser }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Date:</div>
          <div className="col-md-7">{ formatDate(detail.order_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL PO #:</div>
          <div className="col-md-7">{ detail.dcl_po }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Type:</div>
          <div className="col-md-7">{ detail.order_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL PO Line #:</div>
          <div className="col-md-7">{ detail.dcl_po_line }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Ordered:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_ordered, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Receipt #:</div>
          <div className="col-md-7">{ detail.dcl_rec_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cust. Trans. Ref:</div>
          <div className="col-md-7"> @@todo </div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentQ