import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import InterfaceTreeview from './InterfaceTreeview'
import RightPartSettings from './RightPartSettings'

const EditUserModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const [refresh, setRefresh] = useState(false)

  const onModalShown = useCallback(
    event => {
      setRefresh(true)
      setTimeout(() => setRefresh(false), 100)
    },
    []
  )

  const onModalClosed = useCallback(
    event => {
      props.accountActions.setRootReduxStateProp('user', {
        user_id: '',
        username: '',
        accounts_visibility: [],
        accounts_availability: [],
        apps: [],
        web_service_only: false,
        active: false,
        is_master: false,
        force_logout: false
      }).then( () => {
        setRefresh(true)
        setTimeout(() => setRefresh(false), 100)
      })
    },
    []
  )

  useEffect(
    () => {
      global.$('#edit-user').on('show.bs.modal', onModalShown)
      global.$('#edit-user').on('hide.bs.modal', onModalClosed)
      return () => {
        global.$('#edit-user').off('show.bs.modal', onModalShown)
        global.$('#edit-user').off('hide.bs.modal', onModalClosed)
      }
    },
    []
  )

  function onTreeViewChangeApps (data) {
    let { accountState, accountActions } = propsRef.current
    accountActions.setRootReduxStateProp('user', {
      ...accountState.user,
      apps: data
    })
  }

  function onTreeViewChangeAccounts (data) {
    let { accountState, accountActions } = propsRef.current
    accountActions.setRootReduxStateProp('user', {
      ...accountState.user,
      accounts_visibility: data
    })
  }

  function onFieldChange (field, value) {
    let { accountActions, accountState } = props
    let { user = {} } = accountState
    accountActions.setRootReduxStateProp('user', {
      ...user,
      [field]: value
    })
  }

  function onSaveChange (event) {
    props.accountActions.saveEditUserChanges(true).then(
      additional_licenses => {
        if (additional_licenses && additional_licenses.length) {
          global.$('#additional-license-user').modal('show')
        } else {
          global.$('#edit-user').modal('hide')
        }
      }
    ).catch( e => {})
  }

  function onForceLogoutChange (event) {
    let { accountActions, accountState } = props
    let { user = {} } = accountState
    accountActions.setRootReduxStateProp('user', {
      ...user,
      force_logout: !user.force_logout
    })
  }

  let { 
    apps = [],
    web_service_only,
    active,
    accounts_visibility,
    accounts_availability,
    username,
    is_master,
    force_logout
  } = props.accountState.user || {}

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="edit-user"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Edit User</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-md-12 control-label" style={{textAlign: "left"}}>Username: 
                      <span className="bold" style={{paddingLeft: "10px"}}>{ username }</span>
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <a 
                      type="button" 
                      href="#change-username-user" 
                      className="btn dark" 
                      data-toggle="modal"
                    >
                      Change username...
                    </a>  
                    &nbsp;&nbsp;&nbsp;
                    <a type="button" href="#change-password-user" className="btn dark" data-toggle="modal">Change Password...</a>
                  </div>
                </div>
              </div>
              <div className="row">
                <InterfaceTreeview 
                  id="edit-user"
                  apps={ apps }
                  is_master={ is_master }
                  onTreeViewChange={ onTreeViewChangeApps }
                  refresh={ refresh }
                />
                <RightPartSettings 
                  id="edit-user"
                  onFieldChange={ onFieldChange }
                  web_service_only={ web_service_only }
                  active={ active }
                  onTreeViewChange={ onTreeViewChangeAccounts }
                  accounts_visibility={ accounts_visibility }
                  accounts_availability={ accounts_availability }
                  refresh={ refresh }
                  is_master={ is_master }
                />
              </div>
              <div>
                <label className="mt-checkbox" style={{marginTop: '10px', marginBottom: 0}}>
                  <input 
                    type="checkbox" 
                    disabled={ is_master }
                    name="active"
                    checked={ force_logout ? true : false }
                    value={ force_logout ? true : false }
                    onChange={ onForceLogoutChange }
                  /> Force Logout
                  <span></span>
                </label>
              </div>
              <hr/>
            </form>
          </div>
          <div className="modal-footer" style={{ marginTop : '-40px' }} >
              <button
                type="button"
                disabled={ is_master }
                className="btn btn-danger pull-left"
                href="#confirm-delete"
                data-toggle="modal"
              >
                Delete User
              </button>
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal" >
                Cancel
              </button>
              <a
                type="button"
                className="btn green-soft"
                data-toggle="modal"
                onClick={ onSaveChange }
              >
                Save Changes
              </a>
          </div>
        </div>
      </div>
    </div>
  )
}

EditUserModal.propTypes = {
  accountActions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
}

export default EditUserModal