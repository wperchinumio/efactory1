import React, { useState, useCallback, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserData } from '../../util/storageHelperFuncs'
import * as commonActions from '../Settings/redux/global'
import ChangeTheme from '../_Shared/Components/ChangeTheme'

const Profile = props => {
  const [emailValue, setEmailValue] = useState('')
  const handleModalOpening = useCallback(
    () => {
      let emailValueNext = getUserData('email') || ''
      props.commonActions.setRootReduxStateProp_multiple({ email_for_profile: emailValueNext })
      setEmailValue(emailValueNext)
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#profile').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#profile').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function showAccounts () {
    let accountRegions = getUserData('calc_account_regions') || {}
    accountRegions = Object.values( accountRegions ) 
    return Array.isArray(accountRegions) ? accountRegions.join(', ') : ''
  }

  function onEmailInputChanged (event) {
    let { value } = event.currentTarget
    value = value.trim()
    setEmailValue(value)
  }

  function onSubmit (event) {
    event.preventDefault()
    props.commonActions.updateEmail(emailValue)
  }

  let { email_for_profile } = props
  let is_local_admin = getUserData('is_local_admin')
  return (
    <div>
      <div 
        className="modal modal-themed fade" 
        id="profile" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden={true}
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header rs_title_bar">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="modal-title soft-red"><i className="fa fa-user" /> User profile</h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div 
                  className="col-md-8" 
                  style={{ borderRight: '4px double #ddd', minHeight: '360px' }}
                >
                  <h4 className="font-green-seagreen">User Detail</h4>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Username:
                    </div>
                    <div className="col-md-7 bold">
                      {getUserData('name')}
                    </div>
                  </div>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Company Name:
                    </div>
                    <div className="col-md-7 bold">
                      {getUserData('company_name')}
                    </div>
                  </div>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Company Code:
                    </div>
                    <div className="col-md-7 bold">
                      {getUserData('company_code')}
                    </div>
                  </div>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Policy Code:
                    </div>
                    <div className="col-md-7 bold">
                      {getUserData('policy_code')}
                    </div>
                  </div>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Policy Account #:
                    </div>
                    <div className="col-md-7 bold">
                      {getUserData('account')}
                    </div>
                  </div>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Policy Region:
                    </div>
                    <div className="col-md-7 bold">
                      {getUserData('region')}
                    </div>
                  </div>
                  <div className="row profile">
                    <div className="col-md-5 font-blue-dark">
                      Accounts Visibility:
                    </div>
                    <div className="col-md-7 bold">
                      { showAccounts() }
                    </div>
                  </div>
                  <div 
                    className="portlet light bordered" 
                    style={{ marginTop: '20px', marginBottom: '0' }}
                  >
                    <div className="portlet-body form">
                      <form role="form" autoComplete="off" onSubmit={ onSubmit }>
                        <div className="form-group">
                          <label>E-mail address</label>
                          <div className="input-group">
                            <span className="input-group-addon">
                              <i className="fa fa-envelope font-blue-hoki" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="E-mail address"
                              value={ emailValue }
                              readOnly={ is_local_admin }
                              onChange={ onEmailInputChanged }
                            />
                          </div>
                        </div>
                        <div className="form-actions" style={{padding: 0}}>
                          <button 
                            type="submit" 
                            className="btn blue-hoki pull-right"
                            disabled={ emailValue === email_for_profile || is_local_admin }
                          >
                            Update e-mail address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <ChangeTheme />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    email_for_profile: state.common.globalApi.email_for_profile
  }),
  dispatch => ({
    commonActions: bindActionCreators( commonActions, dispatch )
  })
)(Profile)