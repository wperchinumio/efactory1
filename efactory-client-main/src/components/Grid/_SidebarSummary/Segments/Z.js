import React from 'react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const SummarySegmentZ = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" />
        </div>
        <div className="caption font-yellow-gold bold uppercase">Returns</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Warehouse:</div>
          <div className="col-md-7">{ detail.inv_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">R/U:</div>
          <div className="col-md-7">{ detail.ru }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">RMA #:</div>
          <div className="col-md-7">{ detail.rma_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Issued date:</div>
          <div className="col-md-7">{ formatDate(detail.issued_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Issued To:</div>
          <div className="col-md-7"> { detail.rma_issued_to } </div>
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
          <div className="col-md-5 seg-label">Desc. 2:</div>
          <div className="col-md-7">{ detail.desc2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">PO Line #:</div>
          <div className="col-md-7"> { detail.r_line } </div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Authorized:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_auth, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Q Received:</div>
          <div className="col-md-7">{ formatNumber(detail.qty_rec, 0) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Serial Number:</div>
          <div className="col-md-7">{ detail.sn }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL PO #:</div>
          <div className="col-md-7">{ detail.receipt_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Pkg Receipt Date:</div>
          <div className="col-md-7">{ formatDate(detail.p_receipt_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Inv Receipt Date:</div>
          <div className="col-md-7">{ formatDate(detail.i_receipt_date) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">RMA Code:</div>
          <div className="col-md-7">{ detail.reason_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Reason for Return:</div>
          <div className="col-md-7">{ detail.reason_ret }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cond. Code:</div>
          <div className="col-md-7">{ detail.cond_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Condition Upon Ret.:</div>
          <div className="col-md-7">{ detail.cond_upon }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Disp. Code:</div>
          <div className="col-md-7">{ detail.disp_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Disp. Description:</div>
          <div className="col-md-7">{ detail.disp_desc }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Supplier #:</div>
          <div className="col-md-7">{ detail.sup_no }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Original Order:</div>
          <div className="col-md-7">{ detail.orig_order }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Recv. Pkg Reference:</div>
          <div className="col-md-7">{ detail.other }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Comments:</div>
          <div className="col-md-7">{ detail.comments }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentZ