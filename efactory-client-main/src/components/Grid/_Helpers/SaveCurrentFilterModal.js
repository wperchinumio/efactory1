import React, { useRef, useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../_Shared/Components/ButtonLoading'

const SaveCurrentFilterModal = ({
  filter,
  gridActions,
  view,
}) => {
  const inputNodeToFocus = useRef(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleModalOpening = useCallback(
    () => {
      setName('')
      setDescription('')
      setTimeout(
        () => {
          inputNodeToFocus.current.focus()
        },
        500
      )
    },
    []
  ) 

  useEffect(
    () => {
      global.$('#modal-save-current-filter').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#modal-save-current-filter').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function saveCurrentFilter (event) {
    event.preventDefault()
    setSaving(true)

    gridActions.createFilter({
      name, description, view, filter
    }).then(
      () => {
        global.$('#modal-save-current-filter').modal('hide')
        setName('')
        setDescription('')
        setSaving(false)
        gridActions.reloadView(name)
      }
    ).catch( 
      () => {
        setSaving(false)
      }
    )
  }

  return (
    <form 
      role="form" 
      autoComplete="off" 
      className="form-horizontal"
      onSubmit={ saveCurrentFilter }
    >
      <div
        className="modal modal-themed fade"
        data-backdrop="static"
        id="modal-save-current-filter"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ width: '80%', marginLeft: '10%' }}>
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true">
              </button>
              <h4 className="modal-title">
                Confirm
              </h4>
            </div>
            <div className="modal-body" style={{marginBottom: "20px"}}>
              <div className="form-group">
                <label className="col-md-3">
                  Filter Name:
                </label>
                <div className="col-md-9">
                  <input
                    className="form-control input-md"
                    type="text"
                    name="name"
                    value={ name }
                    ref={ inputNodeToFocus }
                    onChange={ event => setName(event.target.value) }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3">
                  Description:
                </label>
                <div className="col-md-9">
                  <textarea 
                    rows="3"
                    className="form-control input-md"
                    name="description"
                    value={ description }
                    onChange={ event => setDescription(event.target.value) }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop : '-40px' }} >
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal"
              >
                Cancel
              </button>
              &nbsp;
              <ButtonLoading
                className="btn green-soft"
                handleClick={ saveCurrentFilter }
                name={'Save Current Filter'}
                loading={ saving }
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

SaveCurrentFilterModal.propTypes = {
  gridActions: PropTypes.object.isRequired,
  filter: PropTypes.object,
  view: PropTypes.string.isRequired
}

export default SaveCurrentFilterModal