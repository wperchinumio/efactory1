import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'

const ProductActivity = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Product Activity </div>
      </div>
      <div className="portlet-body">
      <div className="row">
        <div className="col-md-5 seg-label">Period Start:</div>
          <div className="col-md-7">{ formatDate( detail.period_start ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Period End:</div>
          <div className="col-md-7">{ formatDate( detail.period_end ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">UPC:</div>
          <div className="col-md-7">{ detail.upc }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item Number:</div>
          <div className="col-md-7">{ detail.item_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Account:</div>
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
          <div className="col-md-5 seg-label">Location:</div>
          <div className="col-md-7">{ detail.location }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Unit:</div>
          <div className="col-md-7">{ detail.unit }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">TP Assigned:</div>
          <div className="col-md-7">{ detail.tp_assigned }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Received:</div>
          <div className="col-md-7">{ formatDate( detail.received_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Loc Address:</div>
          <div className="col-md-7">{ detail.location_address }</div>
        </div>
      </div>
    </div>
  )
}

export default ProductActivity