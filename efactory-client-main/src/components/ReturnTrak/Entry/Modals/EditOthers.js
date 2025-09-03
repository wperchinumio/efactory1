import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const EditAmountsModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props

  const handleModalOpening = useCallback(
    () => {
      /* copy current shipping values to editModals redux state */
      propsRef.current.rmaEntryActions.setEditValues('editOthers')
    },
    []
  ) 

  useEffect(
    () => {
      global.$('#rma-edit-others').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#rma-edit-others').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function saveFormValues () {
    let { editOthers, rmaEntryActions, dirty } = props
    rmaEntryActions.setOthersValues(editOthers)
    if (!dirty) {
      rmaEntryActions.setRootReduxStateProp({field: 'dirty', value: true})
    }
  }

  let {
    original_order_number = '',
    customer_number = '',
    shipping_instructions = '',
    comments = '',
    return_weight_lb = ''
  } = props.editOthers

  let { setEditValuesValue } = props.rmaEntryActions

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="rma-edit-others"
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
            <h4 className="modal-title">Edit Others</h4>
          </div>
          <div className="modal-body">
            <div className="col-xs-12">
              <div className="shipping">
                <div className="addr-type">
                  <i className="fa fa-fire"></i>
                  { ' ' }
                  Others
                </div>
                <div className="form-group" style={{marginBottom: "3px"}}>
                  <div className="row">

                    <div className="col-md-12">
                      <label className="control-label">Original Order #:</label>
                      <input
                        type="text"
                        className="form-control input-sm"
                        value={ original_order_number === null ? '' : original_order_number }
                        disabled={true}
                        onChange={ event => {
                          setEditValuesValue( 'editOthers' ,{
                            field : 'original_order_number',
                            value : event.target.value
                          })
                        } }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Customer Number:</label>
                      <input
                        type="text"
                        className="form-control input-sm"
                        value={ customer_number === null ? '' : customer_number }
                        onChange={ event => {
                          setEditValuesValue( 'editOthers' ,{
                            field : 'customer_number',
                            value : event.target.value
                          })
                        } }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Estimated Weight (lb):</label>
                      <input
                        type="text"
                        className="form-control input-sm"
                        value={ return_weight_lb === null ? '' : return_weight_lb }
                        onChange={ event => {
                          setEditValuesValue( 'editOthers' ,{
                            field : 'return_weight_lb',
                            value : event.target.value
                          })
                        } }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Shipping Instructions:</label>
                      <textarea
                        className="form-control input-sm"
                        name=""
                        rows="6"
                        value={ shipping_instructions === null ? '' : shipping_instructions }
                        onChange={ event => {
                          setEditValuesValue( 'editOthers' ,{
                            field : 'shipping_instructions',
                            value : event.target.value
                          })
                        } }
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Comments:</label>
                      <textarea
                        className="form-control input-sm"
                        name=""
                        rows="6"
                        value={ comments === null ? '' : comments }
                        onChange={ event => {
                          setEditValuesValue( 'editOthers' ,{
                            field : 'comments',
                            value : event.target.value
                          })
                        } }
                      ></textarea>
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
              data-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              disabled={false}
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={saveFormValues}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

EditAmountsModal.propTypes = {
  name: PropTypes.string,
  rmaEntryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    editOthers : state.returnTrak.entry.edit.editOthers,
    dirty : state.returnTrak.entry.dirty
  })
)(EditAmountsModal)