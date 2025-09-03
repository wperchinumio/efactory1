import React from 'react'

const OrdersToResolve = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Partner</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ detail.partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sender ID:</div>
          <div className="col-md-7">{ detail.sender_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receiver ID:</div>
          <div className="col-md-7">{ detail.receiver_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sender Code:</div>
          <div className="col-md-7">{ detail.sender_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receiver Code:</div>
          <div className="col-md-7">{ detail.receiver_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Seller Name:</div>
          <div className="col-md-7">{ detail.seller_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Seller Code:</div>
          <div className="col-md-7">{ detail.seller_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">GS Number:</div>
          <div className="col-md-7">{ detail.gs_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">TS Purpose:</div>
          <div className="col-md-7">{ detail.ts_purpose }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve