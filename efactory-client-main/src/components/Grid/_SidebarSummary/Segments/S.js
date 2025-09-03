import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentS = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Transaction</div>
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
          <div className="col-md-5 seg-label">Trans. Date:</div>
          <div className="col-md-7">{ formatDate(detail.transaction_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Trans. Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.tr_qty, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Trans. Type:</div>
          <div className="col-md-7">{ detail.tr_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Trans. Expl.:</div>
          <div className="col-md-7">{ detail.tr_exp }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Hold Status:</div>
          <div className="col-md-7">{ detail.hold_st }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot / Serial:</div>
          <div className="col-md-7">{ detail.lot_ser }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Doc. No:</div>
          <div className="col-md-7">{ detail.doc_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Doc. Type:</div>
          <div className="col-md-7">{ detail.doc_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Create Date:</div>
          <div className="col-md-7">{ formatDate(detail.create_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Location:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentS