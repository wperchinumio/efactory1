import React from 'react'

const OrdersToResolve = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Partner</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ detail.partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">ISA Number:</div>
          <div className="col-md-7">{ detail.isa_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">GS Number:</div>
          <div className="col-md-7">{ detail.gs_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">TS Number:</div>
          <div className="col-md-7">{ detail.ts_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">TS Sequence:</div>
          <div className="col-md-7">{ detail.ts_sequence }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sender Qual:</div>
          <div className="col-md-7">{ detail.sender_qual }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receiver Qual:</div>
          <div className="col-md-7">{ detail.receiver_qual }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve