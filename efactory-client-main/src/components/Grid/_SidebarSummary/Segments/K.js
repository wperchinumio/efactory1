import React from 'react'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentK = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Serial / Lot #</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Package #:</div>
          <div className="col-md-7">{ detail.package_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Line # (DCL):</div>
          <div className="col-md-7">{ detail.line_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Line # (Cus):</div>
          <div className="col-md-7"> { detail.d_custom_field3 } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item #:</div>
          <div className="col-md-7">{ detail.item_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Shipped:</div>
          <div className="col-md-7">{ detail.d_qty_shipped }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Serial / Lot #:</div>
          <div className="col-md-7">{ detail.serial_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship Date:</div>
          <div className="col-md-7">{ formatDate(detail.shipped_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Tracking #:</div>
          <div className="col-md-7">
            {
              detail.trl &&
              <a href={detail.trl} target="_blank">{ detail.tr }</a>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentK