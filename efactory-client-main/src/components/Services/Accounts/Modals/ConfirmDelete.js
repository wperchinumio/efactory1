import React from 'react'
import PropTypes from 'prop-types'

const ConfirmDeleteModal = props => {
  function onSubmit (event) {
    event.preventDefault()
    props.accountActions.deleteUser().then(
      () => {
        global.$('#confirm-delete').modal('hide')
        global.$('#edit-user').modal('hide')
      }
    ).catch( e => {} )
  }

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="confirm-delete"
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
            <h4 className="modal-title">Delete User </h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal" onSubmit={ onSubmit }>
              <div className="row">
                <div className="col-md-12">
                  Are you sure you want to delete the user?
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
              className="btn red-soft"
              onClick={ onSubmit }
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

ConfirmDeleteModal.propTypes = {
  accountActions: PropTypes.object.isRequired
}

export default ConfirmDeleteModal