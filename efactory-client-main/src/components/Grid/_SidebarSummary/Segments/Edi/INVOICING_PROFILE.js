import React from 'react'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const InvoicingProfile = ({
  detail
}) => {
  let {
    partner_code,
    vendor_number,
    account_number,
    address_book_number,
    remit_to_code,
    remit_to_name,
    remit_to_add1,
    remit_to_add2,
    remit_to_city,
    remit_to_state,
    remit_to_zip,
    remit_to_country,
    remit_to_contact,
    remit_to_phone,
    remit_to_email,
    terms_type_code,
    terms_basis_code,
    tdiscount_percent,
    tdiscount_due_days,
    terms_net_days,
    terms_description,
    customer_fast_id,
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
          <div className="col-md-5 seg-label">Partner Code:</div>
          <div className="col-md-7">{ partner_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Vendor Number:</div>
          <div className="col-md-7">{ vendor_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Account:</div>
          <div className="col-md-7">{ account_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Address Book Number:</div>
          <div className="col-md-7">{ address_book_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Code:</div>
          <div className="col-md-7">{ remit_to_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Name:</div>
          <div className="col-md-7">{ remit_to_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Add1:</div>
          <div className="col-md-7">{ remit_to_add1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Add2:</div>
          <div className="col-md-7">{ remit_to_add2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To City:</div>
          <div className="col-md-7">{ remit_to_city }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To State:</div>
          <div className="col-md-7">{ remit_to_state }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Zip:</div>
          <div className="col-md-7">{ remit_to_zip }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Country:</div>
          <div className="col-md-7">{ remit_to_country }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Contact:</div>
          <div className="col-md-7">{ remit_to_contact }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Phone:</div>
          <div className="col-md-7">{ remit_to_phone }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Remit To Email:</div>
          <div className="col-md-7">{ remit_to_email }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Terms Type Code:</div>
          <div className="col-md-7">{ terms_type_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Terms Basis Code:</div>
          <div className="col-md-7">{ terms_basis_code }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Discount %:</div>
          <div className="col-md-7">{ formatNumber( tdiscount_percent, 2 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Discount Due Days:</div>
          <div className="col-md-7">{ formatNumber( tdiscount_due_days, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Terms Net Days:</div>
          <div className="col-md-7">{ formatNumber( terms_net_days, 0 ) }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Terms Description:</div>
          <div className="col-md-7">{ terms_description }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Cust ID:</div>
          <div className="col-md-7">{ formatNumber( customer_fast_id, 0 ) }</div>
        </div>
      </div>
    </div>
  )
}

export default InvoicingProfile