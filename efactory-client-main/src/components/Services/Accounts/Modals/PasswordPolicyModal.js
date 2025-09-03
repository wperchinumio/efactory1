import React from 'react'
import PasswordPolicyInfo from './PasswordPolicyInfo'

const ChangePasswordModal = () => (
  <div
    className="modal modal-themed fade"
    data-backdrop="static"
    id="password-policy-modal"
    tabIndex="-1"
    role="dialog"
    aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true">
          </button>
          <h4 className="modal-title">Password Policy</h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <PasswordPolicyInfo />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn dark btn-outline"
            data-dismiss="modal" >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default React.memo(ChangePasswordModal)