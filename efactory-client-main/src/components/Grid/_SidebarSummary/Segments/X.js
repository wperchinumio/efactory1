import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const SummarySegmentU = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Slow</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Shipped QTY:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_shipped, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On Hand:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhand, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open PO:</div>
          <div className="col-md-7">{ formatNumber(detail.open_po, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open WO:</div>
          <div className="col-md-7">{ formatNumber(detail.open_wo, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Expected Avail.:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_exp, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On Hold:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_shipped, 0) }</div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentU