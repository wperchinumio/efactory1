import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const SummarySegmentC = ({
	detail
}) => {

  return (
			<div className="portlet light order-summary">
		  <div className="portlet-title">
		    <div className="tools pull-left">
		      <a  className="collapse" data-original-title="" title=""> </a>
		    </div>
		    <div className="caption font-yellow-gold bold uppercase"> Amounts</div>
		  </div>
		  <div className="portlet-body">
		    <div className="row">
		      <div className="col-md-6 seg-label">Subtotal:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.order_subtotal) } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">S & H:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.shipping_handling)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Sales Taxes:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.sales_tax)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Int. Hand.:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.international_handling)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Total Due:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.total_due)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Amount Paid:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.amount_paid)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Net Due:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.net_due_currency)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Balance Due:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.balance_due_us)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Int. Decl. Value:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.international_declared_value)  } </div>
		    </div>
		    <div className="row">
		      <div className="col-md-6 seg-label">Total Price Line:</div>
		      <div className="col-md-6 text-right">{ formatNumber(detail.total_price_line)  } </div>
		    </div>
		  </div>
		</div>
  )
}

export default SummarySegmentC