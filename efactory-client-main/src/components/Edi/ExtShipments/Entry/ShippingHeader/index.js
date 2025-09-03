import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import formatOrderId from '../../../../_Helpers/FormatOrderId'

momentLocalizer(moment)

const ShippingHeader = ({
	ediState,
	ediActions,
	globalApiData,
}) => {
	const carriers = globalApiData['carriers'] || []

  function onFieldValueChange (event) {
  	let field = event.target.getAttribute("data-field");
  	let { value } = event.target
		let { addedShipmentData } = ediState

    ediActions.setRootReduxStateProp_multiple({
      addedShipmentData : {
        ...addedShipmentData,
        [ field ] : value
      },
      is_form_values_dirty : true
    })
  }

  function onCarrierChanged (event) {
    let { value } = event.target
		let { addedShipmentData } = ediState

    ediActions.setRootReduxStateProp_multiple({
      addedShipmentData : {
        ...addedShipmentData,
        shipping_carrier : value,
        shipping_service : ''  
      },
      is_form_values_dirty : true
    })
  }

  function setShipDateFieldValue (dateObj) {
    ediActions.setRootReduxStateProp_multiple({
      addedShipmentData : {
        ...ediState.addedShipmentData,
        ship_date : moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
      },
      is_form_values_dirty : true
    })
  }

  function onBillThirdFieldChange (event) {
  	let { value } = event.target
		let { addedShipmentData } = ediState
    ediActions.setRootReduxStateProp_multiple({
      addedShipmentData : {
        ...addedShipmentData,
        bill_third : value === "yes" ? true : false
      },
      is_form_values_dirty : true
    })
  }

	let {
		addedShipmentData,
		is_new_shipment_added
	} = ediState
	
	let {
		order_number,
		account_number,
		reference_number,
		ship_date,
		shipping_carrier,
		shipping_service,
		bill_to_account,
		bill_third,
		pro_number,
		bol_number,
		ship_id,
		location,
		customer_number
	} = addedShipmentData

	
  return (
  	<div>
    	<div className="shipping">
        <div className="addr-type">
          <i className="fa fa-book"></i> SHIPPING HEADER
          {
	        	is_new_shipment_added &&
	        	<div className="pull-right order-type">
		        	<span className="order-type-number">
		        		DRAFT #: 
		        	</span> 
		        	&nbsp;
		        	<span style={{ color: "orangered" }}>
		        		{ formatOrderId( ship_id, false, 5 ) }
		        	</span>
		        </div>
	        }
        </div>
      </div>
      <div className="form-group padding-5" style={{marginBottom: "3px"}}>
        <div className="row">
            <div className="col-md-6">
              <label className="control-label" >
                Order #:
              </label>
              <input 
                type="text"
                className="form-control input-sm"
                disabled={ true }
                value={ order_number ? order_number : "" }
                data-field="order_number"
                onChange={ onFieldValueChange }
              />
            </div>
            <div className="col-md-4">
              <label className="control-label" >
                Account #:
              </label>
              <input 
                type="text"
                className="form-control input-sm"
                disabled={ true }
                value={ account_number ? account_number : "" }
                data-field="account_number"
                onChange={ onFieldValueChange }
              />
            </div>
            <div className="col-md-2">
              <label className="control-label" >
                WH:
              </label>
              <input 
                type="text"
                className="form-control input-sm"
                disabled={ true }
                value={ location ? location : "" }
                data-field="location"
                onChange={ onFieldValueChange }
              />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
              <label className="control-label" >
                {
									customer_number === 'AMZ'?
									<span>ARN #:</span>
									:	customer_number === 'BGL'?
									<span>Trailer #:</span>
									:	customer_number === 'DSG'?
									<span>Pick Up Conf. #:</span>
									:	<span>Reference #:</span>
								}
              </label>
              <input 
                type="text"
                className="form-control input-sm uppercase"
                value={ reference_number ? reference_number : "" }
                data-field="reference_number"
                onChange={ onFieldValueChange }
              />
            </div>
            <div className="col-md-6">
              <label className="control-label">
                Ship Date:
              </label>
              <DatePicker
                format="MM/DD/YYYY"
                name="ship_date"
                onChange={ dateObj => setShipDateFieldValue(dateObj) }
                time={ false }
                value={ ship_date ? moment(ship_date).toDate() : undefined }
              />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
              <label className="control-label" >
                Shipping Carrier:
              </label>
              <select 
              	name="" id="" 
              	className="form-control input-sm"
              	value={ shipping_carrier ? shipping_carrier : "" }
                onChange={ onCarrierChanged }
              >
                <option></option>
                {
                  Object.keys(carriers).map( carrier => {
                    return  <option
                              value={carrier}
                              key={carrier} >
                              { carrier }
                            </option>
                  } )
                }
              </select>
            </div>
            <div className="col-md-6">
              <label className="control-label" >
                Shipping Service:
              </label>
              <select 
              	name="" id="" 
              	className="form-control input-sm"
              	value={ shipping_service ? shipping_service : "" }
                data-field="shipping_service"
                onChange={ onFieldValueChange }
              >
              	<option></option>
                {
                  ( shipping_carrier &&
                    carriers &&
                    carriers[shipping_carrier] ) &&
                    carriers[shipping_carrier].map( aCarrierField => {
                    return  <option
                              value={aCarrierField}
                              key={aCarrierField} >
                              { aCarrierField }
                            </option>
                  } )
                }
              </select>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
              <label className="control-label" >
                Bill To Account:
              </label>
              <input 
                type="text"
                className="form-control input-sm"
                value={ bill_to_account ? bill_to_account : "" }
                data-field="bill_to_account"
                onChange={ onFieldValueChange }
              />
            </div>
            <div className="col-md-6">
              <label className="control-label" >
                Bill 3rd Party:
              </label>
              <div className="input-sm">
                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
                  Yes
                  <input 
                  	type="radio" 
                  	value="yes" 
                    checked={ bill_third ? true : false }
                    onChange={ onBillThirdFieldChange }
                  />
                  <span></span>
                </label>
                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
                  No
                  <input 
                  	type="radio" 
                  	value="no" 
                    checked={ !( bill_third ? true : false ) }
                    onChange={ onBillThirdFieldChange }
                  />
                  <span></span>
                </label>
              </div>
            </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label className="control-label" >
              Pro #:
            </label>
            <input 
              type="text"
              className="form-control input-sm uppercase"
              value={ pro_number ? pro_number : "" }
              data-field="pro_number"
              onChange={ onFieldValueChange }
            />
          </div>
          <div className="col-md-6">
            <label className="control-label" >
              BOL #:
            </label>
            <input 
              type="text"
              className="form-control input-sm uppercase"
              value={ bol_number ? bol_number : "" }
              data-field="bol_number"
              onChange={ onFieldValueChange }
            />
          </div>
        </div>
      </div>    	
  	</div>
  )
}

export default ShippingHeader