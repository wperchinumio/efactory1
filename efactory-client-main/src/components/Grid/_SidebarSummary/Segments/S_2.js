import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const SummarySegmentS2 = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Transaction Summary</div>
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
          <div className="col-md-5 seg-label">Begin Balance:</div>
          <div className="col-md-7">{ formatNumber(detail.begin_balance, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sales Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.sales_qty, 0) }</div>
        </div>        
        <div className="row">
          <div className="col-md-5 seg-label">Receipts:</div>
          <div className="col-md-7">{ formatNumber(detail.receipts, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Assembled Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.assembled_qty, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Transfer Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.transfer_qty, 0) }</div>
        </div>
         <div className="row">
          <div className="col-md-5 seg-label">Adjusted Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.adjusted_qty, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Return Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.return_qty, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Count Adjusted:</div>
          <div className="col-md-7">{ formatNumber(detail.cycle_count, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">End Balance:</div>
          <div className="col-md-7">{ formatNumber(detail.end_balance, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cat 6:</div>
          <div className="col-md-7">{ detail.cat6 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cat 7:</div>
          <div className="col-md-7">{ detail.cat7 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cat 8:</div>
          <div className="col-md-7">{ detail.cat8 }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentS2