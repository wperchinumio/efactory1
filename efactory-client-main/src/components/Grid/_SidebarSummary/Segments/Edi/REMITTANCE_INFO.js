import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'

const Invoice = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Remittance Info</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Reference #:</div>
          <div className="col-md-7">{ detail.reference_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Account #:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ detail.partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Partner Name:</div>
          <div className="col-md-7">{ detail.partner_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO #:</div>
          <div className="col-md-7">{ detail.po_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Invoice Date:</div>
          <div className="col-md-7">{ formatDate(detail.invoice_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Settle Date:</div>
          <div className="col-md-7">{ formatDate(detail.settlement_date)  }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Received:</div>
          <div className="col-md-7">{ formatDate(detail.received_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Comment:</div>
          <div className="col-md-7">{ detail.comment }</div>
        </div>
      </div>
    </div>
  )
}

export default Invoice