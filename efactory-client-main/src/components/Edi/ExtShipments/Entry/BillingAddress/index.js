import React from 'react'
import EditBillingAddressModal from './EditBillingAddressModal'

const BillingAddress = ({
	ediState,
	ediActions
}) => {
	let { addedShipmentData } = ediState
	let {
		billing_address = {}
	} = addedShipmentData
	let {
		attention,
		address1,
  	address2,
		city,
		postal_code,
		state_province,
		country,
		company,
		phone,
		email
	} = billing_address

  return (
    <div className="op-review-sidebar">
    	<div className="addr-type"><i className="fa fa-location-arrow"></i> Billing Address
        <div className="pull-right">
          <a
          	href="#ext-edit-billing-address"
          	data-toggle="modal"
          	className="addr-edit"
            tabIndex="-1"
          >
          	<i className="fa fa-edit"></i> Edit...
          </a>
        </div>
      </div>
      <div className="section">
        {company}<br/>
        {attention}<br/>
        {address1} {address2}<br/>
        {`${city ? city + ', ' : '' }`} {state_province} {postal_code}<br/>
        {country}<br/>
        <div>
        	{ phone && <span><i className="fa fa-phone"></i> { ' ' } { phone }</span> }
        	&nbsp;
        </div>
        <div>
        	{ email && <span><i className="fa fa-envelope"></i> { ' ' } { email }</span> }
        	&nbsp;
        </div>
      </div>
      <EditBillingAddressModal 
      	ediState={ ediState }
        ediActions={ ediActions }
      />
    </div>
  )
}

export default BillingAddress