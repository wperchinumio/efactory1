import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

const SaveAsPopup = props => {
  const textField = useRef(null)
  const [titleInputValue, setTitleInputValue] = useState('')

  const handleModalOpening = useCallback(
    () => {
      setTimeout( () => { textField.current.focus() } , 500 )
    },
    []
  )

  useEffect(
    () => {
      global.$('#save_view').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#save_view').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function handleTitleInput (event) {
    setTitleInputValue(event.target.value)
  }

  function handleFormSubmit (event) {
    event.preventDefault()
    global.$('#save_view').modal('hide')
    let trimmedTitleInputValue = titleInputValue.trim()
    if (trimmedTitleInputValue) {
      let { loadedDetails, selectedFields } = props.settings
      props.saveAsAsync( loadedDetails, trimmedTitleInputValue, selectedFields )
    }
  }

  return (
    <div 
      className="modal modal-themed fade"
      data-backdrop="static"
      id="save_view" 
      tabIndex="-1" 
      role="dialog" 
      aria-hidden={true}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form 
            role="form"
            autoComplete="off"
            onSubmit={handleFormSubmit}
          >
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="modal-title">Save View</h4>
            </div>
            <div className="modal-body">
              <div className="form-body">
                <div className="form-group">
                  <label>Title</label>
                  <div className="input-group">
                    <span className="input-group-addon">
                        <i className="fa fa-edit"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="Type the view title"
                      value={ titleInputValue }
                      onChange={handleTitleInput}
                      ref={textField}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Close</button>
              <button type="submit" className="btn green">Add view</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

SaveAsPopup.propTypes = {
  settings: PropTypes.object,
  saveAsAsync: PropTypes.func
}

export default SaveAsPopup