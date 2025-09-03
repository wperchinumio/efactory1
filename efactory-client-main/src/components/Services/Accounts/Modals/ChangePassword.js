import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import PasswordPolicyInfo from './PasswordPolicyInfo'

const ChangePasswordModal = props => {
  const inputNode = useRef(null)
  const propsRef = useRef(null)
  propsRef.current = props
  const [value, setValue] = useState('')

  const onModalOpened = useCallback(
    event => {
      setValue(propsRef.current.password || '')
      setTimeout(
        () => inputNode.current.focus(),
        500
      )
    },
    []
  )

  useEffect(
    () => {
      global.$('#change-password-user').on('show.bs.modal', onModalOpened)
      return () => {
        global.$('#change-password-user').off('show.bs.modal', onModalOpened)
      }
    },
    []
  )

  function onSubmit (event) {
    event.preventDefault()
    if (!value.length) {
      return
    }
    props.accountActions.changePassword( value.trim() ).then(
      () => global.$('#change-password-user').modal('hide')
    ).catch( e => {} )
  }

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="change-password-user"
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
            <h4 className="modal-title">Change Password</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal" onSubmit={ onSubmit }>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="first_name" className="col-md-4 control-label">New Password:</label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        ref={inputNode}
                        required="required"
                        value={ value ? value : '' }
                        onChange={ event => setValue(event.target.value) }
                      />
                    </div>
                  </div>
                </div>
                <PasswordPolicyInfo />
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
              disabled={!value.length}
              onClick={ onSubmit }
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ChangePasswordModal.propTypes = {
  accountActions: PropTypes.object.isRequired,
  password: PropTypes.string
}

export default ChangePasswordModal