import React, { useRef, useState, useCallback, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PasswordPolicyInfo from './PasswordPolicyInfo'
import * as accountActions from '../redux'

const ChangeMyPasswordModal = props => {
  const inputNode = useRef(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypeNewPassword, setRetypeNewPassword] = useState('')

  const onModalOpened = useCallback(
    event => {
      setOldPassword('')
      setNewPassword('')
      setRetypeNewPassword('')
      setTimeout( () => inputNode.current.focus(), 500 )
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#change-my-password-user').on('show.bs.modal', onModalOpened)
      return () => {
        global.$('#change-my-password-user').off('show.bs.modal', onModalOpened)
      }
    },
    []
  )

  function onSubmit (event) {
    event.preventDefault()
    if (!(newPassword && retypeNewPassword && newPassword === retypeNewPassword)) {
      return
    }
    props.accountActions.changeMyPassword( oldPassword, newPassword ).then(
      () => global.$('#change-my-password-user').modal('hide')
    ).catch( e => {} )
  }

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="change-my-password-user"
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
                    <label htmlFor="first_name" className="col-md-4 control-label">Old Password:</label>
                    <div className="col-md-8">
                      <input
                        type="password"
                        className="form-control"
                        ref={inputNode}
                        required="required"
                        name="oldPassword"
                        value={ oldPassword ? oldPassword : '' }
                        onChange={event => setOldPassword(event.target.value) }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="first_name" className="col-md-4 control-label">New Password:</label>
                    <div className="col-md-8">
                      <input
                        type="password"
                        className="form-control"
                        required="required"
                        name="newPassword"
                        value={ newPassword ? newPassword : '' }
                        onChange={event => setNewPassword(event.target.value) }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="first_name" className="col-md-4 control-label">Retype Password:</label>
                    <div className="col-md-8">
                      <input
                        type="password"
                        className="form-control"
                        required="required"
                        name="retypeNewPassword"
                        value={ retypeNewPassword ? retypeNewPassword : '' }
                        onChange={event => setRetypeNewPassword(event.target.value) }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div 
                    className={ classNames({
                      'font-red text-right' : true,
                      'invisible' : !( newPassword && retypeNewPassword && newPassword !== retypeNewPassword )
                    }) }
                    style={{ fontSize: '12px', paddingRight: '10px' }}
                  >
                    Passwords don't match! 
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
              disabled={ !(newPassword && retypeNewPassword && newPassword === retypeNewPassword) }
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

ChangeMyPasswordModal.propTypes = {
  accountActions: PropTypes.object.isRequired
}

export default connect(
  null,
  dispatch => ({
    accountActions: bindActionCreators( accountActions, dispatch )
  })
)(ChangeMyPasswordModal)