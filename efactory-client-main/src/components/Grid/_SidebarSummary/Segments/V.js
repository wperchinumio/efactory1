import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentV = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">Lot Master</div>
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
          <div className="col-md-5 seg-label">Q On Hand:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhand, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q On Hold:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_onhold, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Net Avail.:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_net, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot / Serial:</div>
          <div className="col-md-7">{ detail.lot_ser }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Exp. Date:</div>
          <div className="col-md-7">{ formatDate(detail.exp_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">OnHand Date:</div>
          <div className="col-md-7">{ formatDate(detail.onhand_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Status Code:</div>
          <div className="col-md-7">{ detail.status_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Desc:</div>
          <div className="col-md-7">{ detail.lot_desc }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Eff. Date:</div>
          <div className="col-md-7">{ formatDate(detail.eff_date)}</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Code 1:</div>
          <div className="col-md-7">{ detail.lot_code1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Date 1:</div>
          <div className="col-md-7">{ formatDate(detail.lot_date1) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Desc 1:</div>
          <div className="col-md-7">{ detail.lot_code_desc1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Memo 1:</div>
          <div className="col-md-7">{ detail.lot_mem1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Code 2:</div>
          <div className="col-md-7">{ detail.lot_code2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Date 2:</div>
          <div className="col-md-7">{ formatDate(detail.lot_date2) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Desc 2:</div>
          <div className="col-md-7">{ detail.lot_desc2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Memo 2:</div>
          <div className="col-md-7">{ detail.lot_mem2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Code 3:</div>
          <div className="col-md-7">{ detail.lot_code3 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Date 3:</div>
          <div className="col-md-7">{ formatDate(detail.lot_date3) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Desc 3:</div>
          <div className="col-md-7">{ detail.lot_desc3 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Memo 3:</div>
          <div className="col-md-7">{ detail.lot_mem3 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Code 4:</div>
          <div className="col-md-7">{ detail.lot_code4 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Date 4:</div>
          <div className="col-md-7">{ formatDate(detail.lot_date4) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Desc 4:</div>
          <div className="col-md-7">{ detail.lot_desc4 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Code 5:</div>
          <div className="col-md-7">{ detail.lot_code5 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Date 5:</div>
          <div className="col-md-7">{ formatDate(detail.lot_date5) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Lot Desc 5:</div>
          <div className="col-md-7">{ detail.lot_desc5 }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentV