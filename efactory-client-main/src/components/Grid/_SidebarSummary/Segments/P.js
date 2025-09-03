import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const SummarySegmentP = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Quantity</div>
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
          <div className="col-md-5 seg-label">Q On Hand:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhand, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On Hold:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhold, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Comm.:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_committed, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q In Proc.:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_inproc, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On FF:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onff, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Net Avail.:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_net, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open WO:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_openwo, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open PO:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_openpo, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open RMA:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_openrma, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cat 1:</div>
          <div className="col-md-7">{ detail.cat1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cat 2:</div>
          <div className="col-md-7">{ detail.cat2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cat 3:</div>
          <div className="col-md-7">{ detail.cat3 }</div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentP