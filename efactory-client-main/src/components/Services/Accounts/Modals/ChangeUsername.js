import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

const ChangeUsernameModal = props => {
  const inputNode = useRef(null)
  const [value, setValue] = useState('')

  const onModalOpened = useCallback(
    event => {
      setValue(props.username)
      setTimeout(() => inputNode.current.focus(), 500)
    },
    []
  )

  useEffect(
    () => {
      global.$(`#change-username-user`).on('show.bs.modal', onModalOpened)
      return () => {
        global.$(`#change-username-user`).off('show.bs.modal', onModalOpened)
      }
    },
    []
  )

  function onSubmit (event) {
    event.preventDefault()
    if (!value.length) {
      return
    }
    props.accountActions.changeUsername( value.trim() ).then(
      () => global.$('#change-username-user').modal('hide')
    ).catch( e => {} )
  }

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="change-username-user"
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
            <h4 className="modal-title">Change Username</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal" onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="first_name" className="col-md-4 control-label">New Username:</label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        required="required"
                        ref={inputNode}
                        value={ value ? value : '' }
                        onChange={ event => setValue(event.target.value) }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal" >
              Cancel
            </button>
            <button
              type="button"
              className="btn green-soft"
              disabled={ !value.length }
              onClick={ onSubmit }
            >
              Change Username
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ChangeUsernameModal.propTypes = {
  accountActions: PropTypes.object.isRequired,
  username: PropTypes.string
}

export default ChangeUsernameModal