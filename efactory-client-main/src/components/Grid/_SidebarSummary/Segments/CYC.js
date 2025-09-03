import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/FormatDate'

const SummarySegmentCYC = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">CYCLE COUNT</div>
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
          <div className="col-md-5 seg-label">CC Days:</div>
          <div className="col-md-7">{ detail.cc_days }</div>
        </div>         
        <div className="row">
          <div className="col-md-5 seg-label">C. Count Date:</div>
          <div className="col-md-7">{ detail.cycle_count_date ? formatDate(detail.cycle_count_date,'true') : '' }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty On Hand:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhand, 0) }</div>
        </div>        
        <div className="row">
          <div className="col-md-5 seg-label">Qty Counted:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_counted, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty Variance:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_variance, 0) }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentCYC