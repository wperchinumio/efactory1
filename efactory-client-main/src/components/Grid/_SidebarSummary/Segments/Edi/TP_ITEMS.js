import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'

const TpItems = ({
  detail: {
    partner,
    item_upc,
    item_vendor_num,
    item_buyer_num,
    user_id,
    program_id,
    workstation_id,
    last_update,
  }
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
          <div className="col-md-5 seg-label">Partner / Def.:</div>
          <div className="col-md-7">{ partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item UPC:</div>
          <div className="col-md-7">{ item_upc }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item Vendor Num:</div>
          <div className="col-md-7">{ item_vendor_num }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item Buyer Num:</div>
          <div className="col-md-7">{ item_buyer_num }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">User Id:</div>
          <div className="col-md-7">{ user_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Program Id:</div>
          <div className="col-md-7">{ program_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Work Station Id:</div>
          <div className="col-md-7">{ workstation_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Last Update:</div>
          <div className="col-md-7">{ formatDate( last_update ) }</div>
        </div>
      </div>
    </div>
  )
}

export default TpItems