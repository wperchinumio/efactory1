import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUserData } from '../../../../../util/storageHelperFuncs'

const EditShippingModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const plMapped = useRef(getPlMapped())
  const freightAccountsMapped = useRef(null)
  const freightAccountsOrdered = useRef(null)
  const internationalCodesMapped = useRef(null)

  const handleModalOpening = useCallback(
    () => {
      let { shipping, modalValues, reviewActions } = propsRef.current
      reviewActions.setRootReduxStateProp_multiple({
        modalValues : {
          ...modalValues,
          shipping : {
            ...shipping
          }
        }
      })
    },
    []
  )

  useEffect(
    () => {
      global.$('#op-edit-shipping').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#op-edit-shipping').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function getPlMapped () {
    let plMappedNext = {}
    let plMapped = getUserData('pl') || []
    plMapped.forEach( pl => {
      plMappedNext[ pl ] = pl
    })
    return plMappedNext
  }

  function saveFormValues () {
    let { modalValues, reviewActions } = props
    let { shipping } = modalValues
    reviewActions.setRootReduxStateProp_multiple({ shipping, dirty : true })
  }

  function getGlobalApiData (name) {
    let { globalApiData = {} } = props
    let value = globalApiData[name]
    return value || []
  }

  function onCarrierChanged (event) {
    let { value } = event.target
    let { modalValues, reviewActions } = props
    let { shipping } = modalValues
    reviewActions.setRootReduxStateProp_multiple({
      modalValues: {
        ...modalValues,
        shipping: {
          ...shipping,
          shipping_carrier: value,
          shipping_service: ''  
        }
      }
    })
  }

  function onInputValueChange (event) {
    let { value, name } = event.target
    let { modalValues , reviewActions } = props
    let { shipping } = modalValues
    reviewActions.setRootReduxStateProp_multiple({
      modalValues: {
        ...modalValues,
        shipping: {
          ...shipping,
          [name]: value
        }
      }
    })
  }

  const carriers = getGlobalApiData('carriers')
  
  let { 
    modalValues,
    entryPageType = 'new_order' 
  } = props

  let { shipping } = modalValues

  let {
    freight_accounts = [],
    terms: incotermsMapped ,
    international_codes = []
  } = props.globalApiData || {}

  incotermsMapped = incotermsMapped ? incotermsMapped : []
  
  let { 
    shipping_carrier = '',
    shipping_service = '',
    packing_list_type = '',
    freight_account = '',
    consignee_number = '',
    terms = '',
    international_code = '',
    fob = '',
    payment_type = '',
  } = shipping

  international_code = international_code || international_code === 0 
                       ? String(international_code)
                       : international_code

  if( !freightAccountsMapped.current || !Object.keys(freightAccountsMapped.current).length ){
    freightAccountsMapped.current = {}
    freightAccountsOrdered.current = []
    freight_accounts.forEach( c => {
      freightAccountsOrdered.current.push(c.value)
      freightAccountsMapped.current[ c.value ] = c.name
    } )
  }

  if( !internationalCodesMapped.current || !Object.keys(internationalCodesMapped.current).length ){
    internationalCodesMapped.current = {}
    international_codes.forEach( c => {
      internationalCodesMapped.current[ c.value ] = c.name
    } )
  }

  return (
    <div
      className="modal modal-themed fade"
      id="op-edit-shipping"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      data-backdrop="static"
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
            <h4 className="modal-title">Edit Shipping Info</h4>
          </div>
          <div className="modal-body">
            <div className="col-xs-12">
              <div className="shipping">
                <div className="addr-type">
                  <i className="fa fa-fire"></i>
                  { ' ' }
                  Edit Shipping Fields
                </div>
                <div className="form-group" style={{marginBottom: "3px"}}>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="control-label">International Code:</label>
                      <select 
                        name="international_code" 
                        value={ international_code ? international_code : '' }
                        onChange={ onInputValueChange }
                        className="form-control input-sm"
                      >
                        <option></option>
                        {
                          Object.keys(internationalCodesMapped.current).map( intCode => {
                            return  <option
                                      value={intCode}
                                      key={intCode} >
                                      { `${internationalCodesMapped.current[intCode]} - ${intCode}`  }
                                    </option>
                          } )
                        }
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="control-label">Shipping Carrier:</label>
                      <select 
                        name="shipping_carrier"
                        value={ shipping_carrier ? shipping_carrier : '' }
                        className="form-control input-sm"
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
                      <label className="control-label">Shipping Service:</label>
                      <select 
                        name="shipping_service"
                        value={ shipping_service ? shipping_service : '' }
                        onChange={ onInputValueChange }
                        className="form-control input-sm"
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
                    <div className="col-md-6">
                      <label className="control-label">Freight Account:</label>
                      {
                        entryPageType !== 'edit_order' &&
                        <select 
                          name="freight_account"
                          value={ freight_account ? freight_account : '' }
                          onChange={ onInputValueChange }
                          className="form-control input-sm"
                        >
                          <option></option>
                          {
                            freightAccountsOrdered.current.map( key => {
                              return  <option
                                        value={ key }
                                        key={ key } >
                                        { `${freightAccountsMapped.current[ key ]} - ${key}` }
                                      </option>
                            } )
                          }
                        </select>
                      }
                      {
                        entryPageType === 'edit_order' &&
                        <input 
                          type="text"
                          value={ freight_account ? freight_account : '' }
                          onChange={ onInputValueChange }
                          name="freight_account"
                          className="form-control input-sm"
                        />
                      }
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Consignee #:</label>
                      <input 
                        type="text"
                        name="consignee_number"
                        value={ consignee_number ? consignee_number : '' }
                        onChange={ onInputValueChange }
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Incoterms:</label>
                      <select 
                        name="terms"
                        value={ terms ? terms : '' }
                        onChange={ onInputValueChange }
                        className="form-control input-sm"
                      >
                        <option></option>
                        {
                          Object.keys(incotermsMapped).map( incoterm => {
                            return  <option
                                      value={incotermsMapped[incoterm]}
                                      key={incotermsMapped[incoterm]} >
                                      {incotermsMapped[incoterm]}
                                    </option>
                          } )
                        }
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">FOB Location:</label>
                      <input 
                        type="text"
                        value={ fob ? fob : '' }
                        onChange={ onInputValueChange }
                        name="fob"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Payment Type:</label>
                      <input 
                        type="text"
                        value={ payment_type ? payment_type : '' }
                        onChange={ onInputValueChange }
                        name="payment_type"
                        className="form-control input-sm"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Packing List:</label>
                      <select 
                        name="packing_list_type"
                        value={ packing_list_type ? packing_list_type : '' }
                        onChange={ onInputValueChange }
                        className="form-control input-sm"
                      >
                        <option></option>
                        {
                          Object.keys( plMapped.current ).map( pl => {
                            return  <option
                                      value={plMapped.current[ pl ]}
                                      key={plMapped.current[ pl ]} >
                                      {plMapped.current[ pl ]}
                                    </option>
                          } )
                        }
                      </select>
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
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={ event => saveFormValues() }
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

EditShippingModal.propTypes = {
  reviewActions: PropTypes.object.isRequired,
  entryPageType: PropTypes.any,
}

export default connect(
  state => ({
    shipping: state.orderPoints.entry.shipping,
    modalValues: state.orderPoints.entry.modalValues,
    globalApiData: state.common.globalApi.globalApiData
  })
)(EditShippingModal)