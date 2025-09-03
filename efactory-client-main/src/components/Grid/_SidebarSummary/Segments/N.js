import React from 'react'

const SummarySegmentN = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">
          Shipped
        </div>
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
          <div className="col-md-5 seg-label">Shipped:</div>
          <div className="col-md-7">{ detail.qty_shipped }</div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentN