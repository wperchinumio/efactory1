import React from 'react'
import { formatDate, orderStatus, orderTypeClass } from '../../../../_Helpers/OrderStatus'
import OrderStage from '../../../../_Helpers/OrderStage'

const Edi1 = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Order</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Channel:</div>
          <div className="col-md-7">
            <span className={orderTypeClass(detail.order_type)}>{detail.order_type}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Acct #:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order #:</div>
          <div className="col-md-7">{ detail.order_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Receipt Date:</div>
          <div className="col-md-7">{ formatDate(detail.received_date)} </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Status:</div>
          <div className="col-md-7">
            <span className="order-status-rr">{orderStatus(detail.order_status)}</span>&nbsp;
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Stage:</div>
          <div className="col-md-7">
            <OrderStage order_stage={detail.order_stage} stage_description={detail.stage_description} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Back Order:</div>
          <div className="col-md-7">  { detail.is_back_order ? 'Yes' : 'No' } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Customer #:</div>
          <div className="col-md-7">{ detail.customer_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO #:</div>
          <div className="col-md-7">
            <span className="order-status-rr">{detail.po_number}</span>&nbsp;
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Order Date:</div>
          <div className="col-md-7">{ formatDate(detail.ordered_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Batch:</div>
          <div className="col-md-7">
            <span>{detail.batch}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Edi1