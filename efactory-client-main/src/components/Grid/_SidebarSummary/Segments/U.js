import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const SummarySegmentU = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a className="collapse"/>
        </div>
        <div className="caption font-yellow-gold bold uppercase">As Of Date</div>
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
          <div className="col-md-5 seg-label">As Of Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.qty, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Current Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.current_qty, 0) }</div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentU