import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'

const OrdersToResolve = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Status</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Routing Status:</div>
          <div className="col-md-7">{ detail.routing_status }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Routing Date:</div>
          <div className="col-md-7">{ formatDate( detail.routing_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Proc. Status:</div>
          <div className="col-md-7">{ detail.processing_status }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Proc. Date:</div>
          <div className="col-md-7">{ formatDate( detail.processing_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Appr. Status:</div>
          <div className="col-md-7">{ detail.approval_status }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Appr. Date:</div>
          <div className="col-md-7">{ formatDate( detail.approval_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Approved By:</div>
          <div className="col-md-7">{ detail.approved_by }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Updated Date:</div>
          <div className="col-md-7">{ formatDate( detail.updated_date ) }</div>
        </div>
      </div>
    </div>
  )
}

export default OrdersToResolve