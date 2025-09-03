import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const SummarySegmentW = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">Replenishment</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Description:</div>
          <div className="col-md-7">{ detail.description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Shipped QTY:</div>
          <div className="col-md-7">{ detail.qty_shipped }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sell Rate - QTY PerWk:</div>
          <div className="col-md-7">{ formatNumber(detail.sell_rate, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Target Stock - QTY:</div>
          <div className="col-md-7"> { formatNumber(detail.qty_stock_tg, 0) } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On Hand:</div>
          <div className="col-md-7">{ detail.qty_onhand }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open PO:</div>
          <div className="col-md-7">{ detail.open_po }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Open WO:</div>
          <div className="col-md-7">{ detail.open_wo }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Expected Avail.:</div>
          <div className="col-md-7">{ detail.qty_exp }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Stock - Q Short:</div>
          <div className="col-md-7">{ detail.qty_short }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Package Multiple:</div>
          <div className="col-md-7">{ detail.pkg_multi }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sug QTY - Purchase:</div>
          <div className="col-md-7">{ detail.qty_sug }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Reorder Point:</div>
          <div className="col-md-7">{ detail.reorder_pt }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Reorder QTY:</div>
          <div className="col-md-7">{ detail.reorder_qty }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Sug QTY2 - Purchase:</div>
          <div className="col-md-7">{ detail.qty_sug2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Recommended QTY:</div>
          <div className="col-md-7">{ detail.qty_rec }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On Hold:</div>
          <div className="col-md-7">{ detail.qty_onhold }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Current Stock - Wks:</div>
          <div className="col-md-7">{ detail.curr_stock }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentW