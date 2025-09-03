import React, { useEffect, useCallback, useRef } from 'react'

const EditBillingAddressModal = ({
  ediState,
  ediActions
}) => {
  const ediStateRef = useRef(null)
  ediStateRef.current = ediState
  
  const handleModalOpening = useCallback(
    () => {
      let { addedShipmentData, modalValues } = ediStateRef.current
      ediActions.setRootReduxStateProp_multiple({
        modalValues : {
          ...modalValues,
          billingAddress : {
            ...addedShipmentData.billing_address
          }
        }
      })
    },
    [ediState]   
  )

  useEffect(
    () => {
      global.$('#ext-edit-billing-address').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#ext-edit-billing-address').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function saveFormValues (event) {
    let { addedShipmentData, modalValues } = ediState
    let { billingAddress } = modalValues
    ediActions.setRootReduxStateProp_multiple({  
      addedShipmentData : {
        ...addedShipmentData,
        billing_address : {
          ...billingAddress
        }
      },
      is_form_values_dirty : true
    })
  }


  function onInputValueChange (event) {
    let { value, name } = event.target
    let { modalValues } = ediState
    let { billingAddress } = modalValues
    ediActions.setRootReduxStateProp_multiple({
      modalValues : {
        ...modalValues,
        billingAddress : {
          ...billingAddress,
          [ name ] : value
        }
      }
    })
  }

  let { modalValues } = ediState
  let { billingAddress } = modalValues
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
      id="ext-edit-billing-address"
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
          </div>
          <div className="modal-body">
            <div className="col-xs-12">
              <div className="shipping">
                <div className="addr-type">
                  <i className="fa fa-location-arrow"></i>
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
                        data-field="company"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="control-label">Attention:</label>
                      <input
                        type="text"
                        name="attention"
                        data-field="attention"
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
                        data-field="address1"
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
                        data-field="address2"
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
                        data-field="city"
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
                          data-field="postal_code"
                          className="form-control input-sm"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">State:</label>
                      <input
                        type="text"
                        value={ state_province }
                        onChange={ onInputValueChange }
                        name="state_province"
                        data-field="state_province"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Country:</label>
                      <input 
                        type="text"
                        value={ country }
                        onChange={ onInputValueChange }
                        name="country"
                        data-field="country"
                        className="form-control input-sm"
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
                          value={ phone }
                          onChange={ onInputValueChange }
                          name="phone"
                          data-field="phone"
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
                          data-field="email"
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
              onClick={ saveFormValues }>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditBillingAddressModal