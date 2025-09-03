import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentY = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">Assembly</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO #:</div>
          <div className="col-md-7">{ detail.po }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Build Date:</div>
          <div className="col-md-7">{ formatDate(detail.build_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Ordered:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_ordered, 0)  }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Open:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_open, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">WO #:</div>
          <div className="col-md-7">{ detail.wo }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">WO Stage:</div>
          <div className="col-md-7">{ detail.wo_stage }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">First Article:</div>
          <div className="col-md-7">{ detail.first_art }</div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentY