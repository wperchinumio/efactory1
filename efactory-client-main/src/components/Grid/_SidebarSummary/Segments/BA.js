import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { fmtbundletype, fmtbundlepl } from '../../../_Helpers/_Renderers'

const SummarySegmentR = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a className="collapse"/>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Bundle</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Bundle #:</div>
          <div className="col-md-7">{ detail.bundle_item_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.bundle_description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Account #:</div>
          <div className="col-md-7">{ detail.account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Bundle Qty:</div>
          <div className="col-md-7">{ formatNumber(detail.bundle_qty_net,0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Bundle Type:</div>
          <div className="col-md-7">{ fmtbundletype(detail, 'bundle_type') }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PL Print:</div>
          <div className="col-md-7">{ fmtbundlepl(detail, 'bundle_pl') }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Item PL:</div>
          <div className="col-md-7">{ fmtbundlepl(detail, 'item_pl') }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">UPC:</div>
          <div className="col-md-7">{ detail.bundle_upc }</div>
        </div>
      </div>
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Item</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Item #:</div>
          <div className="col-md-7">{ detail.item_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.item_description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Quantity:</div>
          <div className="col-md-7">{ detail.item_qty }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentR