import React from 'react'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const Invoice = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Payment Info</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Net Amt:</div>
          <div className="col-md-7">{ formatNumber( detail.net_amount, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Discount Amt:</div>
          <div className="col-md-7">{ formatNumber( detail.discount_amount, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Gross Amt:</div>
          <div className="col-md-7">{ formatNumber( detail.gross_amount, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Payer:</div>
          <div className="col-md-7">{ detail.payer }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Payee:</div>
          <div className="col-md-7">{ detail.payee }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Pay Action:</div>
          <div className="col-md-7">{ detail.pay_action }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Pay Method:</div>
          <div className="col-md-7">{ detail.pay_method }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Check #:</div>
          <div className="col-md-7">{ detail.check_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Trace #:</div>
          <div className="col-md-7">{ detail.trace_number }</div>
        </div>
      </div>
    </div>
  )
}

export default Invoice