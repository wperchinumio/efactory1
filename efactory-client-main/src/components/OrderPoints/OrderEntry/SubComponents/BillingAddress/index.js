import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EditBillingAddressModal from './EditBillingAddressModal'

const BillingAddress = ({ reviewActions, billingAddress }) => {
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
	} = billingAddress
  return (
    <div className="op-review-sidebar">
    	<div className="addr-type"><i className="fa fa-location-arrow"></i> Billing Address
        <div className="pull-right">
          <a
          	href="#op-edit-billing-address"
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
        { phone && <span><i className="fa fa-phone"></i> { ' ' } { phone }</span> }
        <br/>
        { email && <span><i className="fa fa-envelope"></i> { ' ' } { email }</span> }
      </div>
      <EditBillingAddressModal 
      	reviewActions={ reviewActions }
      />
    </div>
  )
}

BillingAddress.propTypes = {
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    countries: state.common.globalApi.globalApiData.countries,
		states: state.common.globalApi.globalApiData.states,
    billingAddress: state.orderPoints.entry.billingAddress
  })
)(BillingAddress)