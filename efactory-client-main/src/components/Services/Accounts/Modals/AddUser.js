import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import InterfaceTreeview from './InterfaceTreeview'
import RightPartSettings from './RightPartSettings'

const AddUserModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const [refresh, setRefresh] = useState(false)

  const onModalClosed = useCallback(
    event => {
      props.accountActions.setRootReduxStateProp( 'add_user', {
        accounts_visibility: [],
        accounts_availability: [],
        active: false,
        apps: [],
        user_id: '',
        username: '',
        password: '',
        web_service_only: false,
      }).then( 
        () => {
          setRefresh(true)
          setTimeout(
            () => setRefresh(false),
            100
          )
        }
      )
    },
    []
  )

  const onModalShown = useCallback(
    event => {
      setRefresh(true)
      setTimeout(
        () => setRefresh(false),
        100
      )
    },
    []
  )

  useEffect(
    () => {
      global.$('#add-user').on('hide.bs.modal', onModalClosed)
      global.$('#add-user').on('show.bs.modal', onModalShown)
      return () => {
        global.$('#add-user').off('hide.bs.modal', onModalClosed)
        global.$('#add-user').off('show.bs.modal', onModalShown)
      }
    },
    []
  )

  function onTreeViewChange_apps (data) {
    let { accountState, accountActions } = propsRef.current
    accountActions.setRootReduxStateProp('add_user', {
      ...accountState.add_user,
      apps: data
    })
  }

  function onTreeViewChange_accounts (data) {
    let { accountState, accountActions } = propsRef.current
    accountActions.setRootReduxStateProp('add_user', {
      ...accountState.add_user,
      accounts_visibility: data
    })
  }

  function onFieldChange (field, value) {
    let { accountActions, accountState } = props
    let { add_user = {} } = accountState
    accountActions.setRootReduxStateProp( 'add_user', {
      ...add_user,
      [field]: value
    })
  }

  function onSaveChange (event) {
    let { accountActions } = props
    accountActions.addUser( true ).then( additional_licenses => {
      if( additional_licenses && additional_licenses.length ){
        global.$('#additional-license-user-2').modal('show')
      }else{
        global.$('#add-user').modal('hide')
      }
    } ).catch( e => {} )
  }

  let { accountState } = props

  let { 
    accounts_visibility = [],
    accounts_availability,
    active,
    apps = [],
    username,
    password,
    web_service_only
  } = accountState.add_user || {}

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="add-user"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Add User</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="first_name" className="col-md-4 control-label sbold" style={{textAlign: "left"}}>Username:</label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        required="required"
                        value={ username }
                        onChange={ event => onFieldChange('username', event.target.value) }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="last_name" className="col-md-4 control-label sbold" style={{textAlign: "left"}}>Password:</label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        required="required"
                        value={ password }
                        onChange={ event => onFieldChange('password', event.target.value) }
                      />&nbsp;
                      <a 
                        className="small" 
                        href="#password-policy-modal"
                        data-toggle="modal"
                      ><i className="fa fa-info-circle"></i> Password Policy</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <InterfaceTreeview 
                  id="add-user"
                  apps={ apps }
                  onTreeViewChange={ onTreeViewChange_apps }
                  refresh={ refresh }
                />
                <RightPartSettings 
                  id="add-user"
                  onFieldChange={ onFieldChange }
                  web_service_only={ web_service_only }
                  active={ active }
                  onTreeViewChange={ onTreeViewChange_accounts }
                  accounts_visibility={ accounts_visibility }
                  accounts_availability={ accounts_availability }
                  refresh={ refresh }
                />
              </div>
              <hr/>
            </form>
          </div>
          <div className="modal-footer" style={{ marginTop: '-40px' }} >
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal" >
              Cancel
            </button>
            <a
              type="button"
              className="btn green-soft"
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

AddUserModal.propTypes = {
  accountActions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
}

export default AddUserModal