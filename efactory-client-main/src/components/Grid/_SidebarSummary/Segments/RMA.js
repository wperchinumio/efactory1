import React from 'react'
import { formatDate }	from '../../../_Helpers/FormatDate'
import RMAType from '../../../_Helpers/RMAType'
import { Link } from 'react-router-dom'

const SummarySegmentRMA = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">RMA</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">RMA Type:</div>
          <div className="col-md-7">
              <RMAType rma_type_code={detail.rma_type_code} rma_type_name={detail.rma_type_name} />
          </div>
        </div>
        {
          detail.disposition_name &&
          <div className="row">
            <div className="col-md-5 seg-label">Disposition:</div>
            <div className="col-md-7"> {detail.disposition_code} : {detail.disposition_name}            
            </div>
          </div>
        }
        <div className="row">
          <div className="col-md-5 seg-label">RMA Acc #:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
        {
          detail.om_number &&
          <div className="row">
            <div className="col-md-5 seg-label">OM #:</div>
            <div className="col-md-7">{ detail.om_number }</div>
          </div>
        }
        <div className="row">
          <div className="col-md-5 seg-label">RMA Date:</div>
          <div className="col-md-7">{ formatDate(detail.rma_date,'true')} </div>
        </div>          
        {
          detail.original_order_number &&
          <div className="row">
            <div className="col-md-5 seg-label">Orig. Order #:</div>
             <div className="col-md-7 text-primary bold">
                <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(detail.original_order_number)}&accountNum=${detail.original_account_number ? detail.original_account_number : ''}`}>
                    {detail.original_order_number}
                </Link>
            </div>           
          </div>
        }
        {
          detail.original_account_number &&
          <div className="row">
            <div className="col-md-5 seg-label">Orig. Acc #:</div>
            <div className="col-md-7">{ detail.original_account_number }</div>
          </div>
        }
        {
          detail.customer_number &&
          <div className="row">
            <div className="col-md-5 seg-label">Customer #:</div>
            <div className="col-md-7">{ detail.customer_number }</div>
          </div>
        }
        {
          detail.po_number &&
          <div className="row">
            <div className="col-md-5 seg-label">PO #:</div>
            <div className="col-md-7">{ detail.po_number }</div>
          </div>
        }        
        {
          detail.replacement_order_number &&
          <div className="row">
            <div className="col-md-5 seg-label">Repl. Order #:</div>            
            <div className="col-md-7 text-primary bold">
                <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(detail.replacement_order_number)}&accountNum=${detail.shipping_account_number ? detail.shipping_account_number : ''}`}>
                    {detail.replacement_order_number}
                </Link>
            </div>
          </div>
        }
        {
          detail.shipping_account_number &&
          <div className="row">
            <div className="col-md-5 seg-label">Repl. Acc #:</div>
            <div className="col-md-7">{ detail.shipping_account_number }</div>
          </div>
        }
        {
          detail.trl &&
          <div className="row">
            <div className="col-md-5 seg-label">Repl. Tracking #:</div>
            <div className="col-md-7 text-primary bold">                             
                <Link to={`${detail.trl}`} target={"_blank"}>
                {detail.tr}
                </Link>        
            </div>
          </div>
        }
        {
          detail.replacement_shipped_date &&
          <div className="row">
            <div className="col-md-5 seg-label">Shipped Date:</div>
            <div className="col-md-7">{ formatDate(detail.replacement_shipped_date,'true') }</div>
          </div>
        }
        {
          detail.cancelled_date &&
          <div className="row">
            <div className="col-md-5 seg-label">Cancelled Date:</div>
            <div className="col-md-7">{ formatDate(detail.cancelled_date,'true') }</div>
          </div>
        }
        {
          detail.expired_date &&
          <div className="row">
            <div className="col-md-5 seg-label">Exp. Date:</div>
            <div className="col-md-7">{ formatDate(detail.expired_date,'true') }</div>
          </div>
        }
      </div>
    </div>
  )
}

export default SummarySegmentRMA