import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUserData } from '../../../../util/storageHelperFuncs'
import Select2React from '../../../_Shared/Components/Select2React'

const EditShippingModal = props => {
  const carriersMapped = useRef(null)
  const freightAccountsMapped = useRef(null)
  const freightAccountsOrdered = useRef(null)
  const internationalCodesMapped = useRef(null)
  const incotermsMapped = useRef(null)
  
  const plMappedRef = useRef(getPlMapped())
  const propsRef = useRef(null)
  propsRef.current = props

  const handleModalOpening = useCallback(
    () => {
      /* copy current shipping values to editModals redux state */
      let { setEditValues } = propsRef.current.rmaEntryActions
      setEditValues('editShipping')
    },
    []
  )

  useEffect(
    () => {
      global.$('#rma-edit-shipping').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#rma-edit-shipping').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function getPlMapped () {
    const plMappedNext = {}
    let plMappedData = getUserData('pl') || []
    plMappedData.forEach( pl => {
      plMappedNext[ pl ] = pl
    })
    return plMappedNext
  }

  function onFieldValueChange ({field, value}) {
    return props.rmaEntryActions.setEditValuesValue('editShipping', {field, value})
  }

  function saveFormValues () {
    let { editShipping, rmaEntryActions, dirty } = props
    rmaEntryActions.setShippingValues(editShipping)
    if (!dirty) {
      rmaEntryActions.setRootReduxStateProp({ field : 'dirty', value : true })
    }
  }

  let { editShipping } = props
  let {
    carriers = {},
    terms : incotermsMapped_,
    international_codes = [],
    freight_accounts = []
  } = props.globalApiData
  incotermsMapped_ = incotermsMapped_ ? incotermsMapped_ : []

  if (!carriersMapped.current || !Object.keys(carriersMapped.current).length) {
    carriersMapped.current = {}
    Object.keys( carriers ).forEach( c => {
      carriersMapped.current[ c ] = c
    } )
  }

  if (!freightAccountsMapped.current || !Object.keys(freightAccountsMapped.current).length) {
    freightAccountsMapped.current = {}
    freightAccountsOrdered.current = []
    freight_accounts.forEach( c => {
      freightAccountsOrdered.current.push(c.value)
      freightAccountsMapped.current[ c.value ] = c.name
    } )
  }

  if (!internationalCodesMapped.current || !Object.keys(internationalCodesMapped.current).length) {
    internationalCodesMapped.current = {}
    international_codes.forEach( c => {
      internationalCodesMapped.current[ c.value ] = c.name
    } )
  }

  if (!incotermsMapped.current || !Object.keys(incotermsMapped.current).length) {
    incotermsMapped.current = {}
    incotermsMapped_.forEach( c => {
      incotermsMapped.current[ c ] = c
    } )
  }

  let services = {}
  if (editShipping.shipping_carrier && Object.keys(carriers).length ) {
    carriers[ editShipping.shipping_carrier ].forEach( service => {
      services[ service ] = service
    } )
  }

  let {
    shipping_carrier,
    shipping_service,
    packing_list_type,
    freight_account,
    consignee_number,
    int_code,
    terms,
    fob,
    payment_type
  } = editShipping

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="rma-edit-shipping"
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
                      <Select2React
                        className="form-control"
                        options={ internationalCodesMapped.current }
                        selected={ int_code ? String(int_code)  : '' }
                        isoFormat={true}
                        onChangeHandler={ value => {
                          onFieldValueChange({ field : 'int_code', value })
                        } }
                        placeholder="Select... "
                        height="32px"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="control-label">Shipping Carrier:</label>
                      <Select2React
                        className="form-control"
                        options={ carriersMapped.current }
                        selected={ shipping_carrier ? shipping_carrier : '' }
                        onChangeHandler={ value => {
                          onFieldValueChange({ field : 'shipping_carrier', value }).then( () => {
                            onFieldValueChange({ field : 'shipping_service', value : '' })  
                          } )
                        } }
                        placeholder="Select... "
                        height="32px"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Shipping Service:</label>
                      <Select2React
                        className="form-control"
                        options={ services }
                        selected={ shipping_service ? shipping_service : '' }
                        onChangeHandler={ value => onFieldValueChange({
                          field : 'shipping_service',
                          value
                        }) }
                        placeholder="Select... "
                        height="32px"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Freight Account:</label>
                      <Select2React
                        className="form-control"
                        isoFormat={true}
                        options={ freightAccountsMapped.current }
                        selected={ freight_account }
                        onChangeHandler={ value => onFieldValueChange({
                          field : 'freight_account',
                          value
                        }) }
                        height="32px"
                        placeholder="Select... "
                        orderOfOptionKeys={freightAccountsOrdered.current}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Consignee #:</label>
                      <input
                        className="form-control"
                        placeholder="Consignee #"
                        type="text"
                        onChange={ event => onFieldValueChange({
                          field : 'consignee_number',
                          value : event.target.value
                        }) }
                        value={ consignee_number ? consignee_number : '' }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Incoterms:</label>
                      <Select2React
                        className="form-control"
                        options={ incotermsMapped.current }
                        selected={ terms ? terms : '' }
                        onChangeHandler={ value => onFieldValueChange({
                          field : 'terms',
                          value
                        }) }
                        placeholder="Select... "
                        height="32px"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">FOB Location:</label>
                      <input
                        className="form-control"
                        onChange={ event => onFieldValueChange({
                          field : 'fob',
                          value : event.target.value ? event.target.value : ''
                        }) }
                        type="text"
                        value={ fob ? fob : '' }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Payment Type:</label>
                      <input
                        className="form-control"
                        onChange={ event => onFieldValueChange({
                          field : 'payment_type',
                          value : event.target.value ? event.target.value : ''
                        }) }
                        type="text"
                        value={ payment_type ? payment_type : '' }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Packing List:</label>
                      <Select2React
                        className="form-control"
                        options={ plMappedRef.current }
                        selected={ packing_list_type ? packing_list_type : '' }
                        onChangeHandler={ value => onFieldValueChange({
                          field : 'packing_list_type',
                          value
                        }) }
                        placeholder="Select... "
                        height="32px"
                      />
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
              onClick={ event => saveFormValues() }>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

EditShippingModal.propTypes = {
  name: PropTypes.string,
  rmaEntryActions: PropTypes.object
}

export default connect(
  state => ({
    editShipping : state.returnTrak.entry.edit.editShipping,
    globalApiData : state.common.globalApi.globalApiData,
    dirty : state.returnTrak.entry.dirty
  })
)(EditShippingModal)