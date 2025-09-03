import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const ExtraFieldsModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props

  const handleModalOpening = useCallback(
    () => {
      let { extraFields, modalValues, reviewActions } = propsRef.current
      reviewActions.setRootReduxStateProp_multiple({
        modalValues : {
          ...modalValues,
          extraFields : {
            ...extraFields
          }
        }
      })
    },
    []
  )

  useEffect(
    () => {
      global.$('#op-extra-fields').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#op-extra-fields').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function saveFormValues () {
    let { modalValues, reviewActions } = props
    let { extraFields } = modalValues
    reviewActions.setRootReduxStateProp_multiple({ extraFields, dirty : true })
  }

  function onInputValueChange (event) {
    let { value, name } = event.target
    let { modalValues , reviewActions } = props
    let { extraFields } = modalValues
    reviewActions.setRootReduxStateProp_multiple({
      modalValues: {
        ...modalValues,
        extraFields: {
          ...extraFields,
          [name]: value
        }
      }
    })
  }

  let { extraFieldsLabels, modalValues } = props
  let { extraFields } = modalValues
  let {
    header_cf_1 = 'CUSTOM FIELD 1',
    header_cf_2 = 'CUSTOM FIELD 2',
    header_cf_3 = 'CUSTOM FIELD 3',
    header_cf_4 = 'CUSTOM FIELD 4',
    header_cf_5 = 'CUSTOM FIELD 5'
  } = extraFieldsLabels
  let {
    custom_field1 = '',
    custom_field2 = '',
    custom_field3 = '',
    custom_field4 = '',
    custom_field5 = ''
  } = extraFields
  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="op-extra-fields"
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
            <h4 className="modal-title">Edit Extra Fields</h4>
          </div>
          <div className="modal-body">
            <div className="col-xs-12">
              <div className="shipping">
                <div className="addr-type">
                  <i className="fa fa-fire"></i>
                  { ' ' }
                  Edit Extra Fields
                </div>
                <div className="form-group" style={{marginBottom: "3px"}}>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="control-label">
                        { header_cf_1 }
                      </label>
                      <input 
                        type="text" 
                        name="custom_field1" 
                        value={ custom_field1 }
                        onChange={ onInputValueChange }
                        className="form-control input-sm" 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">
                        { header_cf_2 }
                      </label>
                      <input 
                        type="text" 
                        name="custom_field2" 
                        value={ custom_field2 }
                        onChange={ onInputValueChange }
                        className="form-control input-sm" 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">
                        { header_cf_3 }
                      </label>
                      <input 
                        type="text" 
                        name="custom_field3" 
                        value={ custom_field3 }
                        onChange={ onInputValueChange }
                        className="form-control input-sm" 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">
                        { header_cf_4 }
                      </label>
                      <input 
                        type="text" 
                        name="custom_field4" 
                        value={ custom_field4 }
                        onChange={ onInputValueChange }
                        className="form-control input-sm" 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">
                        { header_cf_5 }
                      </label>
                      <input 
                        type="text" 
                        name="custom_field5" 
                        value={ custom_field5 }
                        onChange={ onInputValueChange }
                        className="form-control input-sm" 
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

ExtraFieldsModal.propTypes = {
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    extraFields: state.orderPoints.entry.extraFields,
    extraFieldsLabels: state.orderPoints.entry.extraFieldsLabels,
    modalValues: state.orderPoints.entry.modalValues
  })
)(ExtraFieldsModal)