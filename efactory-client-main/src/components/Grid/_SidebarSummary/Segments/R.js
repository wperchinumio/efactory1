import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentR = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
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
          <div className="col-md-5 seg-label">Hold Code:</div>
          <div className="col-md-7">{ detail.hold_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Hold Reason:</div>
          <div className="col-md-7">{ detail.hold_reason }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty On Hold:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhold, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot / Serial:</div>
          <div className="col-md-7">{ detail.lot_set }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Loc. Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.loc_qty, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Location:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Prm / Sec:</div>
          <div className="col-md-7">{ detail.prm_sec }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Last Act. Date:</div>
          <div className="col-md-7">{ formatDate(detail.last_date)}</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentR