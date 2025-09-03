import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
momentLocalizer(moment)

const PoHeader = props => {
  useEffect(
    () => {
      global.$('#dcl_order_number').focus()
    },
    []
  )

  function onInputFieldChanged (event) {
    let { name, value } = event.target
    if (name === 'dcl_order_number') {
      value = value.trim()
      if (isNaN(value)) return 
    }
    props.poReceiptActions.setRootReduxStateProp_multiple({
      [name]: value,
      form_dirty: true
    }) 
  }

  function onSearchClicked () {
    props.poReceiptActions.searchPoReceipt() 
  }

  function setReceiptDateValue (dateObj) {
    props.poReceiptActions.setRootReduxStateProp_multiple({
      receipt_date: moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
    }) 
  }

  function onFormSubmitted (event) {
    event.preventDefault()
    let { dcl_order_number } = props.poReceiptState
    if (dcl_order_number.length) {
      onSearchClicked()
    }
  }

  let { 
    dcl_order_number,  
    searchingPoReceipt,
    receipt_date,
    supplier,
    searched
  } = props.poReceiptState

  return (
    <div>
      <div className="row no-margins" >
        <div className="col-lg-6 col-md-12">
          <div className="shipping">
            <div className="addr-type"><i className="fa fa-book"></i> PO RECEIPT
            </div>
            <div className="form-group padding-5" style={{marginBottom: "3px"}}>
              <div className="row">
                <div className="col-md-6">
                  <label className={ classNames({
                    'control-label': true,
                    'label-req': dcl_order_number.length === 0
                  }) }>
                    DCL PO #:
                  </label>
                  <div className="">
                    <form onSubmit={ onFormSubmitted } autoComplete="off">
                      <input 
                        type="text"
                        id="dcl_order_number"
                        name="dcl_order_number"
                        className="form-control input-sm"
                        value={ dcl_order_number ? dcl_order_number : '' }
                        onChange={ onInputFieldChanged }
                      />
                    </form>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="control-label" style={{ width : '100%' }}>
                    &nbsp;
                  </label>
                  <ButtonLoading
                    className="btn green-soft btn-sm pull-right"
                    type="button"
                    disabled={ !(  dcl_order_number.length ) }
                    iconClassName=""
                    handleClick={ onSearchClicked }
                    name={ 'SEARCH' }
                    loading={ searchingPoReceipt }
                  />  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row no-margins" >
        <div 
          className="col-lg-6 col-md-12 po-table-filter-inputs" 
          style={{ marginBottom: "5px", marginTop: "30px" }}
        >
            <div className="row padding-5">
              <div className="col-md-6">
                <label className={ classNames({
                  'control-label': true,
                  'label-req': supplier.length === 0
                }) }>
                  Supplier PL:
                </label>
                <div className="">
                  <input 
                    type="text"
                    name="supplier"
                    disabled={!searched}
                    className="form-control input-sm"
                    value={ supplier ? supplier : '' }
                    onChange={ onInputFieldChanged }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="control-label">Receipt date: </label>
                <DatePicker
                  format="MM/DD/YYYY"
                  name="receipt_date"
                  disabled={!searched}
                  onChange={ setReceiptDateValue }
                  time={false}
                  value={ receipt_date ? moment(receipt_date).toDate()  : moment().toDate() }
                />
              </div>
            </div>
        </div>
      </div>
    </div>  
  )
}

PoHeader.propTypes = {
  poReceiptState: PropTypes.object.isRequired,
  poReceiptActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    poReceiptState: state.services.utilities.poReceipt
  })
)(PoHeader)