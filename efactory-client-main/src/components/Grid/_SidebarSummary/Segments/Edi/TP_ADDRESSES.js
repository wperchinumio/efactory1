import React from 'react'
import { formatDate } from '../../../../_Helpers/OrderStatus'

const TpAddresses = ({
  detail: {
    partner,
    location,
    party_name,
    party_address1,
    party_address2,
    party_city,
    party_state,
    party_zip,
    party_county,
    party_country,
    party_contact_name,
    party_contact_function,
    party_contact_phone,
    party_contact_fax,
    party_contact_email,
    party_type,
    party_number,
    dcl_01,
    dcl_02,
    dcl_03,
    dcl_04,
    account_number,
    user_id,
    program_id,
    workstation_id,
    last_update,
  }
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Product Activity </div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Partner:</div>
          <div className="col-md-7">{ partner }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Location:</div>
          <div className="col-md-7">{ location }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Name:</div>
          <div className="col-md-7">{ party_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Address 1:</div>
          <div className="col-md-7">{ party_address1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Address 2:</div>
          <div className="col-md-7">{ party_address2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">City:</div>
          <div className="col-md-7">{ party_city }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">State:</div>
          <div className="col-md-7">{ party_state }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">ZIP:</div>
          <div className="col-md-7">{ party_zip }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">County:</div>
          <div className="col-md-7">{ party_county }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Country:</div>
          <div className="col-md-7">{ party_country }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Name:</div>
          <div className="col-md-7">{ party_contact_name }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Function:</div>
          <div className="col-md-7">{ party_contact_function }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Phone:</div>
          <div className="col-md-7">{ party_contact_phone }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Fax:</div>
          <div className="col-md-7">{ party_contact_fax }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Contact Email:</div>
          <div className="col-md-7">{ party_contact_email }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Type:</div>
          <div className="col-md-7">{ party_type }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Party Number:</div>
          <div className="col-md-7">{ party_number }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL01:</div>
          <div className="col-md-7">{ dcl_01 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL02:</div>
          <div className="col-md-7">{ dcl_02 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL03:</div>
          <div className="col-md-7">{ dcl_03 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL04:</div>
          <div className="col-md-7">{ dcl_04 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">DCL Account #:</div>
          <div className="col-md-7">{ account_number }</div>
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

export default TpAddresses