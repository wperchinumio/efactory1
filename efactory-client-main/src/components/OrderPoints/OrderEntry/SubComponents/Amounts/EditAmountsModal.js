import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const EditAmountsModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const handleModalOpening = useCallback(
    () => {
      let { amounts, modalValues, reviewActions } = propsRef.current
      amounts = { ...amounts }
      Object.keys(amounts).forEach( a => {
        amounts[a] = (+amounts[a]).toFixed(2)
      } )
      reviewActions.setRootReduxStateProp_multiple({
        modalValues : {
          ...modalValues,
          amounts : {
            ...amounts
          }
        }
      })
    },
    []
  )

  useEffect(
    () => {
      global.$('#op-edit-amounts').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#op-edit-amounts').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function saveFormValues () {
    let { modalValues, reviewActions } = props
    let { amounts } = modalValues
    Object.keys(amounts).forEach( v => {
      if( isNaN( amounts[v] ) ){
        amounts[v] = '0.00'
      }else{
        amounts[v] = (+amounts[v]).toFixed(2)
      }
    } )
    reviewActions.setRootReduxStateProp_multiple({ amounts, dirty : true })
  }

  function updateAmountModalValues ({ field, value }) {
    let { reviewActions, modalValues, entryPageType } = props
    let { amounts } = modalValues
    amounts = { ...amounts }
    amounts[ field ] = isNaN(value) ? 0 : value
    if( entryPageType !== 'edit_order' ){
      if( [ 'shipping_handling', 'sales_tax', 'international_handling' ].includes(field) ){
        let {
          shipping_handling,
          sales_tax,
          international_handling,
          order_subtotal
        } = amounts
        amounts.total_due = +shipping_handling + +sales_tax + +international_handling + +order_subtotal
        amounts.net_due_currency = +amounts.total_due - +amounts.amount_paid
      }else if( field === 'amount_paid' ){
        amounts.net_due_currency = +amounts.total_due - +amounts.amount_paid
      }
    }
    Object.keys(amounts).forEach( v => {
      let val = amounts[v]
      if( v !== field && !isNaN(val) ){
        amounts[v] = (+amounts[v]).toFixed(2)
      }
    } )
    amounts[ field ] = value
    reviewActions.setRootReduxStateProp_multiple({ 
      modalValues : {
        ...modalValues,
        amounts
      }
    })
  }

  let { entryPageType, modalValues } = props
  let { amounts } = modalValues
  let {
    order_subtotal = 0,
    shipping_handling = 0,
    balance_due_us = 0,
    amount_paid = 0,
    total_due = 0,
    net_due_currency = 0,
    international_handling = 0,
    international_declared_value = 0,
    sales_tax = 0,
    insurance = 0
  } = amounts

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="op-edit-amounts"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true">
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Edit Amounts</h4>
          </div>
          <div className="modal-body">
            <div>
              <div className="shipping">
                <div className="addr-type" style={{marginBottom: "5px"}}>
                  <i className="fa fa-dollar"></i>
                  { ' ' }
                  Amounts
                </div>
                <form className="form-horizontal" autoComplete="off">
                  <div className="form-group">
                    <label className="col-md-7 control-label"><span className="ef-required">Order Amount:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ order_subtotal !== null ? order_subtotal : '' }
                        type="text"
                        name="order_subtotal"
                        className="col-md-6 form-control input-sm"
                        disabled={ entryPageType !== 'edit_order' }
                        onChange={ event => {
                          updateAmountModalValues({ field: 'order_subtotal', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required">S & H:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ shipping_handling !== null ? shipping_handling : '' }
                        type="text"
                        className="form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'shipping_handling', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required">Sales Taxes:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ sales_tax !== null ? sales_tax : '' }
                        type="text"
                        className="form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'sales_tax', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required">Discount/Add. Chgs.:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ international_handling !== null ? international_handling : '' }
                        type="text"
                        className="form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'international_handling', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required" style={{fontWeight: 900}}>Total Amount:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ total_due !== null ? total_due : '' }
                        type="text"
                        name="total_due"
                        className="col-md-6 form-control input-sm"
                        disabled={ entryPageType !== 'edit_order' }
                        onChange={ event => {
                          updateAmountModalValues({ field: 'total_due', value: event.target.value })
                        } }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-7 control-label"><span className="ef-required">Amount Paid:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ amount_paid !== null ? amount_paid : '' }
                        type="text"
                        name="amount_paid"
                        className="col-md-6 form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'amount_paid', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required" style={{fontWeight: 900}}>Net Due:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ net_due_currency !== null ? net_due_currency : '' }
                        type="text"
                        name="net_due_currency"
                        className="col-md-6 form-control input-sm"
                        disabled={ entryPageType !== 'edit_order' }
                        onChange={ event => {
                          updateAmountModalValues({ field: 'net_due_currency', value: event.target.value })
                        } }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-7 control-label"><span className="ef-required">Balance Due (US):</span></label>
                    <div className="col-md-5">
                      <input
                        value={ balance_due_us !== null ? balance_due_us : '' }
                        type="text"
                        name="balance_due_us"
                        className="col-md-6 form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'balance_due_us', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required">Int. Decl. Value:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ international_declared_value !== null ? international_declared_value : '' }
                        type="text"
                        name="international_declared_value"
                        className="col-md-6 form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'international_declared_value', value: event.target.value })
                        } }
                      />
                    </div>
                    <label className="col-md-7 control-label"><span className="ef-required">Insurance:</span></label>
                    <div className="col-md-5">
                      <input
                        value={ insurance !== null ? insurance : '' }
                        type="text"
                        name="insurance"
                        className="col-md-6 form-control input-sm"
                        onChange={ event => {
                          updateAmountModalValues({ field: 'insurance', value: event.target.value })
                        } }
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{paddingTop: 0}}>
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              disabled={false}
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

EditAmountsModal.propTypes = {
  reviewActions: PropTypes.object.isRequired,
  entryPageType: PropTypes.string.isRequired
}

export default connect(
  state => ({
    modalValues: state.orderPoints.entry.modalValues,
    amounts: state.orderPoints.entry.amounts,
    entryPageType: state.orderPoints.entry.entryPageType,
  })
)(EditAmountsModal)