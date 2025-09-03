import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const PlanningSchedule = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Planning Schedule </div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner Name:</div>
          <div className="col-md-7">{ detail.partner_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Record ID:</div>
          <div className="col-md-7">{ detail.record_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Received:</div>
          <div className="col-md-7">{ formatDate( detail.received_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan Code:</div>
          <div className="col-md-7">{ detail.plan_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan ID:</div>
          <div className="col-md-7">{ detail.plan_id }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan Type:</div>
          <div className="col-md-7">{ detail.plan_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qty Type:</div>
          <div className="col-md-7">{ detail.qty_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan Start:</div>
          <div className="col-md-7">{ formatDate( detail.plan_start_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan End:</div>
          <div className="col-md-7">{ formatDate( detail.plan_end_date )  }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan Generated:</div>
          <div className="col-md-7">{ formatDate( detail.plan_generated_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Vendor #:</div>
          <div className="col-md-7">{ detail.vendor_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Plan Location:</div>
          <div className="col-md-7">{ detail.plan_location }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">ID Qual:</div>
          <div className="col-md-7">{ detail.id_qual }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">ID #:</div>
          <div className="col-md-7">{ detail.id_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item # Qual:</div>
          <div className="col-md-7">{ detail.item_number_qual }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item #:</div>
          <div className="col-md-7">{ detail.item_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Purch. Qual:</div>
          <div className="col-md-7">{ detail.purchase_qual }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Purch Item:</div>
          <div className="col-md-7">{ detail.purchase_item }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">UOM:</div>
          <div className="col-md-7">{ detail.unit_of_measure }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Unit Price:</div>
          <div className="col-md-7">{ formatNumber( detail.unit_price, 2 )  }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Price Type:</div>
          <div className="col-md-7">{ detail.price_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Forcast Qty:</div>
          <div className="col-md-7">{ formatNumber( detail.forecast_qty, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Forcast Type:</div>
          <div className="col-md-7">{ detail.forecast_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Forcast Period:</div>
          <div className="col-md-7">{ detail.forecast_period }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Forcast Start:</div>
          <div className="col-md-7">{ formatDate( detail.forecast_start_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Forcast End:</div>
          <div className="col-md-7">{ formatDate( detail.forecast_end_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ detail.partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Account:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
      </div>
    </div>
  )
}

export default PlanningSchedule