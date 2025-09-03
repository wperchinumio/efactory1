import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentF = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Line Item</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Line # (DCL):</div>
          <div className="col-md-7">{ detail.line_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Line # (Cus):</div>
          <div className="col-md-7">{ detail.d_custom_field3 }</div>
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
          <div className="col-md-5 seg-label">Q Ordered:</div>
          <div className="col-md-7">{ detail.d_qty }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Shipped:</div>
          <div className="col-md-7"> { detail.d_qty_shipped } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q B/O:</div>
          <div className="col-md-7">{ detail.d_qty_bo }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">U. Price:</div>
          <div className="col-md-7"> { formatNumber( detail.d_unit_price, 2)  } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ext. Price:</div>
          <div className="col-md-7"> { formatNumber( detail.d_ext_price, 2)  } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship After Date:</div>
          <div className="col-md-7"> { formatDate(detail.d_ship_after_date) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Ship By Date:</div>
          <div className="col-md-7"> { formatDate(detail.d_ship_by) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Voided:</div>
          <div className="col-md-7">{ detail.custom_field2 }</div>
        </div>
      </div>
    </div>     
  )
}

export default SummarySegmentF