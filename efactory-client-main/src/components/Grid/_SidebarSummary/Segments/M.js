import React from 'react'

const SummarySegmentM = ({
  detail
}) => {
  return (
      <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Backlog</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Account #:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.location }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Demand Qty:</div>
          <div className="col-md-7">{ detail.qty_demand }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">On Hand:</div>
          <div className="col-md-7">{ detail.qty_onhand }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">On Hold:</div>
          <div className="col-md-7">{ detail.qty_onhold }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Committed:</div>
          <div className="col-md-7">{ detail.qty_committed }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">In Process:</div>
          <div className="col-md-7">{ detail.qty_inprocess }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Available Qty:</div>
          <div className="col-md-7">{ detail.qty_available }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty Short:</div>
          <div className="col-md-7">{ detail.qty_short }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">QTY On PO:</div>
          <div className="col-md-7">{ detail.qty_po }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentM