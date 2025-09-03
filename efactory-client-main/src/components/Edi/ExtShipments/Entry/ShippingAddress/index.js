import React from 'react'

const ShippingAddress = ({
	ediState,
	ediActions
}) => {
	function onFieldValueChange (event) {
  	let field = event.target.getAttribute("data-field");
  	let { value } = event.target
		let { addedShipmentData } = ediState
		let { shipping_address = {} } = addedShipmentData

    ediActions.setRootReduxStateProp_multiple({
      addedShipmentData : {
        ...addedShipmentData,
        shipping_address : {
        	...shipping_address,
        	[ field ] : value
        }
      },
      is_form_values_dirty : true
    })
  }

	let {
		addedShipmentData
	} = ediState

	let {
		shipping_address = {}
	} = addedShipmentData

	let {
    company = '',
    attention = '',
    address1 = '',
    address2 = '',
    city = '',
    email = '',
    phone = '',
    state_province = '',
    country = '',
    postal_code = ''
  } = shipping_address


  return (
		<div className="shipping">
		  <div className="addr-type">
		    <i className="fa fa-truck">
		    </i> Shipping Address
		  </div>
		  <div className="form-group padding-5" style={{marginBottom: "3px"}}>
		    <div className="row">
		      <div className="col-md-12">
		        <label className="control-label">
		          Company:
		        </label>
		        <input 
		          type="text"
		          name="company"
		          value={ company ? company : '' }
		          onChange={ onFieldValueChange }
		          className="form-control input-sm"
		          data-field="company"
		        />
		      </div>
		      <div className="col-md-12">
		        <label className="control-label">
		          Attention:
		        </label>
		        <input 
		          type="text"
		          value={ attention ? attention : '' }
		          onChange={ onFieldValueChange }
		          name="attention"
		          className="form-control input-sm"
		          data-field="attention"
		        />
		      </div>
		      <div className="col-md-8">
		        <label className="control-label">
		          Address 1:
		        </label>
		        <div className="input-group">
		          <input 
		            type="text"
		            name="address1"
		            value={ address1 ? address1 : '' }
		            onChange={ onFieldValueChange }
		            className="form-control input-sm"
		            data-field="address1"
		          />
		        </div>
		      </div>
		      <div className="col-md-4">
		        <label className="control-label">
		          Address 2:
		        </label>
		        <input 
		          type="text"
		          value={ address2 ? address2 : '' }
		          onChange={ onFieldValueChange }
		          name="address2"
		          className="form-control input-sm"
		          data-field="address2"
		        />
		      </div>
		      <div className="col-md-8">
		        <label className="control-label">
		          City:
		        </label>
		        <input 
		          type="text"
		          name="city"
		          value={ city ? city : '' }
		          onChange={ onFieldValueChange }
		          className="form-control input-sm"
		          data-field="city"
		        />
		      </div>
		      <div className="col-md-4">
		        <label className="control-label">
		          Postal Code:
		        </label>
	          <input 
	            type="text"
	            name="postal_code"
	            value={ postal_code ? postal_code : '' }
	            onChange={ onFieldValueChange }
	            className="form-control input-sm"
	            data-field="postal_code"
	          />
		      </div>
		      <div className="col-md-6">
		        <label className="control-label">
		          State:
		        </label>
	          <input 
	            type="text"
	            name="state_province"
	            value={ state_province ? state_province : '' }
	            onChange={ onFieldValueChange }
	            className="form-control input-sm"
	            data-field="state_province"
	          />
		      </div>
		      <div className="col-md-6">
		        <label className="control-label">Country:</label>
		        <input 
	            type="text"
	            name="country"
	            value={ country ? country : '' }
	            onChange={ onFieldValueChange }
	            className="form-control input-sm"
	            data-field="country"
	          />
		      </div>
		      <div className="col-md-6">
		        <label className="control-label">Phone:</label>
		        <div className="input-group">
		          <span className="input-group-addon">
		            <i className="fa fa-phone"></i>
		          </span>
		          <input 
		            type="text"
		            name="phone"
		            value={ phone ? phone : '' }
		            onChange={ onFieldValueChange }
		            className="form-control input-sm"
		            data-field="phone"
		          />
		        </div>
		      </div>
		      <div className="col-md-6">
		        <label className="control-label">Email:</label>
		        <div className="input-group">
		          <span className="input-group-addon">
		            <i className="fa fa-envelope"></i>
		          </span>
		          <input 
		            type="text"
		            value={ email ? email : '' }
		            onChange={ onFieldValueChange }
		            name="email"
		            className="form-control input-sm"
		            data-field="email"
		          />
		        </div>
		      </div>
		    </div>
		  </div>
		</div>
  )
}

export default ShippingAddress