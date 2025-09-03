import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const EditBillingAddressModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const handleModalOpening = useCallback(
    () => {
      let { billingAddress, modalValues, reviewActions } = propsRef.current
      reviewActions.setRootReduxStateProp_multiple({
        modalValues : {
          ...modalValues,
          billingAddress : {
            ...billingAddress
          }
        }
      })
    },
    []
  )
    
  useEffect(
    () => {
      global.$('#op-edit-billing-address').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#op-edit-billing-address').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function saveFormValues () {
    let { modalValues, reviewActions } = props
    let { billingAddress } = modalValues
    reviewActions.setRootReduxStateProp_multiple({ billingAddress, dirty : true })
  }

  function copyShippingAddressToBilling () {
    let { modalValues, reviewActions, shippingAddress } = props
    reviewActions.setRootReduxStateProp_multiple({
      modalValues: {
        ...modalValues,
        billingAddress: {
          ...shippingAddress
        }
      }
    })
  }

  function onCountryChange (event) {
    let { value } = event.target
    value = value.trim()
    let { modalValues ,reviewActions } = props
    let { billingAddress } = modalValues
    reviewActions.setRootReduxStateProp_multiple({
      modalValues: {
        ...modalValues,
        billingAddress: {
          ...billingAddress,
          country: value,
          state_province: ''
        }
      }
    })
  }

  function onCountryChange2 (event) {
    let { value } = event.target
    value = value.trim()
    let { modalValues ,reviewActions } = props
    let { billingAddress } = modalValues
    reviewActions.setRootReduxStateProp_multiple({
      modalValues : {
        ...modalValues,
        billingAddress : {
          ...billingAddress,
          country : value
        }
      }
    })
  }

  function onInputValueChange (event) {
    let { value, name } = event.target
    let { modalValues , reviewActions } = props
    let { billingAddress } = modalValues
    reviewActions.setRootReduxStateProp_multiple({
      modalValues : {
        ...modalValues,
        billingAddress : {
          ...billingAddress,
          [name] : value
        }
      }
    })
  }

  let {
    countries,
    entryPageType,
    modalValues,
    states
  } = props
  let { billingAddress } = modalValues
  /*
    we need to copy countries and delete US and CA since we want them to be at top
  */
  let countries2 = { ...countries }
  if( countries2 && Object.keys(countries2).length ){
    delete countries2['US']
    delete countries2['CA']
    delete countries2['AU']
  }
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
  } = billingAddress
  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="op-edit-billing-address"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Edit Billing Address</h4>
            <a
              type="button"
              className="view-map validate-address pull-right"
              onClick={copyShippingAddressToBilling}
            >
              Copy Shipping Address
            </a>
          </div>
          <div className="modal-body">
            <div className="col-xs-12">
              <div className="shipping">
                <div className="addr-type">
                  <i className="fa fa-truck"></i>
                  { ' ' }
                  Billing Address
                </div>
                <div className="form-group" style={{marginBottom: "3px"}}>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="control-label">Company:</label>
                      <input
                        type="text"
                        value={ company }
                        onChange={ onInputValueChange }
                        name="company"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="control-label">Attention:</label>
                      <input
                        type="text"
                        name="attention"
                        value={ attention }
                        onChange={ onInputValueChange }
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="control-label">Address 1:</label>
                      <input
                        type="text"
                        value={ address1 }
                        onChange={ onInputValueChange }
                        name="address1"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="control-label">Address 2:</label>
                      <input
                        type="text"
                        value={ address2 }
                        onChange={ onInputValueChange }
                        name="address2"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="control-label">City:</label>
                      <input
                        type="text"
                        value={ city }
                        onChange={ onInputValueChange }
                        name="city"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="control-label">Postal Code:</label>
                      <div className="">
                        <input
                          type="text"
                          value={ postal_code }
                          onChange={ onInputValueChange }
                          name="postal_code"
                          className="form-control input-sm"
                        />
                      </div>
                    </div>
                    {
                      entryPageType !== 'edit_order'
                      &&
                      (
                        country === 'CA'
                        ||
                        country === 'US'
                        ||
                        country === 'AU'
                      )
                      &&
                      <div className="col-md-6">
                        <label className="control-label">State:</label>
                        <select
                          name="state_province"
                          value={ state_province }
                          onChange={ onInputValueChange }
                          className="form-control input-sm"
                        >
                          <option value=''></option>
                          {
                            states &&
                            states[ country ] &&
                            Object.keys(states[country])
                            .map( aStateKey => {
                              return  <option value={aStateKey} key={`country-${aStateKey}`}>
                                        { states[ country ][aStateKey]  }
                                      </option>
                            } )
                          }
                        </select>
                      </div>
                    }
                    {
                      (
                      !(
                        country === 'CA'
                        ||
                        country === 'US'
                        ||
                        country === 'AU'
                      )
                      ||
                      entryPageType === 'edit_order'
                      )
                      &&
                      <div className="col-md-6">
                        <label className="control-label">State:</label>
                        <input
                          type="text"
                          value={ state_province }
                          onChange={ onInputValueChange }
                          name="state_province"
                          className="form-control input-sm"
                        />
                      </div>
                    }
                    {
                      entryPageType !== 'edit_order'
                      &&
                      <div className="col-md-6">
                        <label className="control-label">Country:</label>
                        <select 
                          name="country"
                          value={ country }
                          onChange={ onCountryChange }
                          className="form-control input-sm"
                        >
                          <option value=''> </option>
                          <option value='US'>United States</option>
                          <option value='CA'>Canada</option>
                          <option value='AU'>Australia</option>
                          <option disabled>-------</option>
                          {
                            countries2 && Object.keys(countries2).map( aCountryKey => {
                              return  <option value={aCountryKey} key={`country-${aCountryKey}`}>
                                        { countries2[ aCountryKey ] }
                                      </option>
                            } )
                          }
                        </select>
                      </div>
                    }
                    {
                      entryPageType === 'edit_order'
                      &&
                      <div className="col-md-6">
                        <label className="control-label">Country:</label>
                        <input 
                          type="text"
                          value={ country }
                          onChange={ onCountryChange2 }
                          name="country"
                          className="form-control input-sm"
                        />
                      </div>
                    }
                    <div className="col-md-6">
                      <label className="control-label">Phone:</label>
                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-phone"></i>
                        </span>
                        <input 
                          type="text"
                          value={ phone }
                          onChange={ onInputValueChange }
                          name="phone"
                          className="form-control input-sm"
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
                          value={ email }
                          onChange={ onInputValueChange }
                          name="email"
                          className="form-control input-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={false}
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={saveFormValues}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

EditBillingAddressModal.propTypes = {
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    billingAddress   : state.orderPoints.entry.billingAddress,
    shippingAddress  : state.orderPoints.entry.shippingAddress,
    modalValues      : state.orderPoints.entry.modalValues,
    countries        : state.common.globalApi.globalApiData.countries,
    entryPageType    : state.orderPoints.entry.entryPageType,
    states           : state.common.globalApi.globalApiData.states,
  })
)(EditBillingAddressModal)