import React, { useEffect, useCallback, useRef } from 'react'

const EditOthersModal = ({
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
          others : {
            shipping_instructions: addedShipmentData.shipping_instructions,
            pl_comments: addedShipmentData.pl_comments
          }
        }
      })
    },
    [ediState]
  )

  useEffect(
    () => {
      global.$('#ext-edit-others').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#ext-edit-others').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function saveFormValues (event) {
    let { modalValues, addedShipmentData } = ediState
    let { others } = modalValues
    let {
      shipping_instructions,
      pl_comments
    } = others
    ediActions.setRootReduxStateProp_multiple({  
      addedShipmentData : {
        ...addedShipmentData,
        shipping_instructions,
        pl_comments
      },
      is_form_values_dirty : true
    })
  }

  function onInputValueChange (event) {
    let { value, name } = event.target
    let { modalValues } = ediState
    let { others } = modalValues
    ediActions.setRootReduxStateProp_multiple({
      modalValues : {
        ...modalValues,
        others : {
          ...others,
          [ name ] : value
        }
      }
    })
  }

  let { modalValues } = ediState
  let { others } = modalValues
  let {
    shipping_instructions = '',
    pl_comments = '',
  } = others

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="ext-edit-others"
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
                    <div className="col-md-6">
                      <label className="control-label">Shipping Instructions:</label>
                      <textarea
                        className="form-control input-sm"
                        name="shipping_instructions"
                        rows="6"
                        value={ shipping_instructions ? shipping_instructions : '' }
                        onChange={ onInputValueChange }
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="control-label">Comments:</label>
                      <textarea
                        className="form-control input-sm"
                        name="pl_comments"
                        rows="6"
                        value={ pl_comments ? pl_comments : '' }
                        onChange={ onInputValueChange }
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
              onClick={ event => saveFormValues() }>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditOthersModal