import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const BasicProfile = ({
  detail
}) => {
  let {
    customer_group,
    account_number,
    address_book_number,
    branch_plant,
    shipping_site,
    item_base,
    start_at,
    csr_email,
    acctmgr_email,
    customer_name,
    customer_fast_id,
    identifier,
    qualifier,
    routing,
    protocol,
    contact_name,
    contact_email,
    contact_phone,
    active_date,
    inactive_date,
    registered,
    user_id,
    program_id,
    workstation_id,
    last_update,
  } = detail

  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Invoice</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Customer Group:</div>
          <div className="col-md-7">{ customer_group }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Account:</div>
          <div className="col-md-7">{ account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Address Book No.:</div>
          <div className="col-md-7">{ address_book_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Branch Plant:</div>
          <div className="col-md-7">{ branch_plant }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Shipping Site:</div>
          <div className="col-md-7">{ shipping_site }</div>
        </div>
         <div className="row">
          <div className="col-md-5 seg-label">Item Base:</div>
          <div className="col-md-7">{ item_base }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Start At:</div>
          <div className="col-md-7">{ start_at }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">CSR Email:</div>
          <div className="col-md-7">{ csr_email }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">AcctMgr Email:</div>
          <div className="col-md-7">{ acctmgr_email }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Customer Name:</div>
          <div className="col-md-7">{ customer_name }</div>
        </div>
         <div className="row">
          <div className="col-md-5 seg-label">Cust ID:</div>
          <div className="col-md-7">{ formatNumber( customer_fast_id, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Identifier:</div>
          <div className="col-md-7">{ identifier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Qualifier:</div>
          <div className="col-md-7">{ qualifier }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Routing:</div>
          <div className="col-md-7">{ routing }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Protocol:</div>
          <div className="col-md-7">{ protocol }</div>
        </div>
         <div className="row">
          <div className="col-md-5 seg-label">Contact Name:</div>
          <div className="col-md-7">{ contact_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Email:</div>
          <div className="col-md-7">{ contact_email }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Phone:</div>
          <div className="col-md-7">{ contact_phone }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Active Date:</div>
          <div className="col-md-7">{ formatDate( active_date ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">InActive Date:</div>
          <div className="col-md-7">{ formatDate( inactive_date ) }</div>
        </div>
         <div className="row">
          <div className="col-md-5 seg-label">Registered:</div>
          <div className="col-md-7">{ registered ? '1' : '0' }</div>
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

export default BasicProfile