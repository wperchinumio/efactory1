import React       from 'react'
import PropTypes   from 'prop-types'

const Address = ({  
	company = '',
	attention = '',
	address1 = '',
	address2 = '',
	city = '',
	state_province = '',
	postal_code = '',
	country = '',
	isShipping
}) => {
	return (
		<div className="row">
      <div className="col-md-10 col-md-offset-1 well padding-5">
        <h6 className="font-green-seagreen"><i className="fa fa-location-arrow "></i>
          <span className="sbold uppercase"> { isShipping ? ' Shipping' : 'Billing' } Address:</span>
        </h6>
        { company } <br/>
        { attention } <br/>
        { address1 } <br/>
        { address2 } <br/>
        { `${ city ? city + ', ' : '' }${ state_province ? state_province + ' - ' : '' }${postal_code}`} <br/>
        { country }
      </div>
    </div>
	)
}

Address.propTypes = {
	isShipping : PropTypes.bool.isRequired
}

export default Address