import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/FormatDate'

const SummarySegmentDG = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">DG Data</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Account-WH:</div>
          <div className="col-md-7">{ detail.account_wh }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Battery Cat.:</div>
          <div className="col-md-7">{ detail.battery_category }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Battery Config.:</div>
          <div className="col-md-7">{ detail.battery_configuration }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Battery Type:</div>
          <div className="col-md-7">{ detail.battery_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Per Package:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_per_package, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">U Per Carton:</div>
          <div className="col-md-7">{ formatNumber(detail.units_per_carton, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">U Per Master Carton:</div>
          <div className="col-md-7">{ formatNumber(detail.units_per_master_carton, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Battery Spec Q:</div>
          <div className="col-md-7">{ formatNumber(detail.battery_spec_quantity, 2) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Battery Spec UOM:</div>
          <div className="col-md-7">{ detail.battery_spec_unit_of_measure }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Net Weight (g):</div>
          <div className="col-md-7">{ formatNumber(detail.net_weight_in_grams, 2) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Last Updated:</div>
          <div className="col-md-7">{ detail.last_updated ? formatDate(detail.last_updated,'true') : '' }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentDG