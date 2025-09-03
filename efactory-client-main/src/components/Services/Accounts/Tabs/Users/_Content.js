import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import EditUserModal from '../../Modals/EditUser'
import AddUserModal from '../../Modals/AddUser'
import ChangeUsernameModal from '../../Modals/ChangeUsername'
import ChangePasswordModal from '../../Modals/ChangePassword'
import ConfirmDeleteModal from '../../Modals/ConfirmDelete'
import PasswordPolicyModal from '../../Modals/PasswordPolicyModal'
import AdditionalLicensesModal from '../../Modals/AdditionalLicenses'
import AdditionalLicensesModal2 from '../../Modals/AdditionalLicenses2'

const AccountTab2 = props => {
  useEffect(
    () => {
      props.accountActions.readUsers()
    },
    []
  )

  function editUser (event) {
    event.preventDefault()
    let user_id = event.target.getAttribute('data-user-id')
    props.accountActions.readUser( user_id ).then(
      () => {
        global.$('#edit-user').modal('show')
      }
    ).catch( e => {} )
  }

  function addUser (event) {
    event.preventDefault()
    props.accountActions.readAccountsAvailability().then(
      () => {
        setTimeout( () => {
          global.$('#add-user').modal('show')
        }, 0 )
      }
    ).catch( e => {} )
  }

  let { accountState, accountActions } = props
  let { users = [] } =  accountState
  return (
    <div>
      <div className="col-md-12">
        <p>List of users and licenses used.</p>
        <div className="table-responsive">
          <table className="accounts table table-striped table-hover">
            <thead>
            <tr className="uppercase noselect table-header-1 cart-row" style={{height: "37px"}}>
              <th style={{verticalAlign: "middle", textAlign: "right",  width:"50px"}}>#</th>
              <th style={{verticalAlign: "middle"}}>Username</th>
              <th style={{verticalAlign: "middle"}}>Account Visibility</th>
              <th style={{verticalAlign: "middle", textAlign: "center", width:"100px"}}>Basic</th>
              <th style={{verticalAlign: "middle", textAlign: "center", width:"100px"}}>Standard</th>
              <th style={{verticalAlign: "middle", textAlign: "center", width:"100px"}}>ReturnTrak</th>
              <th style={{verticalAlign: "middle", textAlign: "center", width:"150px", borderLeft:"3px double #bbbbbb"}}>Web Services<br/>Only</th>
              <th style={{verticalAlign: "middle", textAlign: "center", width:"130px"}}>Actions</th>
            </tr>
            </thead>
            <tbody>
              {
                users.map( ( user, index ) => {
                  let {
                    username,
                    //active, todo
                    licenses = [],
                    user_id,
                    accounts_visibility,
                    web_service_only,
                    is_master,
                    active
                  } = user
                  let basic = false
                  let standard = false
                  let returntrak = false
                  if( Array.isArray( licenses ) ){
                    licenses.forEach( l => {
                      let { 
                        license_id = '',
                        used = false
                      } = l 
                      switch( license_id ){
                        case 1:
                          basic = used
                          break
                        case 2:
                          standard = used
                          break
                        case 3: 
                          returntrak = used
                          break
                        default:
                      }
                    } )
                  }
                  return (
                    <tr key={`user-${user_id}`}>
                      <td className="text-right">{ is_master && <span className="pull-left"><i className="fa fa-user"></i></span>}{ index + 1 }</td>
                      <td className={ classNames({
                          'text-primary': true,
                          'sbold':!is_master,
                          'bold':is_master,
                          'user-inactive':!active,
                        }) }>
                        { username }
                      </td>
                      <td className="sbold">
                        { accounts_visibility }
                      </td>
                      <td className="text-center">
                        <label className="mt-checkbox">
                            <input type="checkbox" disabled="disabled" checked={ basic } onChange={ e => {} } />
                            <span></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <label className="mt-checkbox">
                            <input type="checkbox" disabled="disabled" checked={ standard } onChange={ e => {} } />
                            <span></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <label className="mt-checkbox">
                            <input type="checkbox" disabled="disabled" checked={ returntrak } onChange={ e => {} } />
                            <span></span>
                        </label>
                      </td>
                      <td className="text-center" style={{borderLeft:"3px double #bbbbbb"}}>
                        <label className="mt-checkbox">
                            <input type="checkbox" disabled="disabled" checked={ web_service_only } onChange={ e => {} } />
                            <span></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <a 
                          href="" 
                          className="btn grey-gallery btn-xs" 
                          type="button"
                          data-user-id={ user_id }
                          onClick={ editUser }
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  )
                } )
              }
            </tbody>
          </table>
        </div>
        <a 
          href="" 
          className="btn green-soft" 
          onClick={ addUser }
        >Add User</a>
      </div>
      <EditUserModal 
        accountActions={ accountActions }
        accountState={ accountState }
      />
      <AddUserModal 
        accountActions={ accountActions }
        accountState={ accountState }
      />
      <ChangeUsernameModal
        accountActions={ accountActions }
        username={ accountState.user.username || '' }
      />
      <ChangePasswordModal
        accountActions={ accountActions }
        username={ accountState.user.username || '' }
      />
      <AdditionalLicensesModal 
        accountActions={ accountActions }
        accountState={ accountState }
      />
      <AdditionalLicensesModal2
        accountActions={ accountActions }
        accountState={ accountState }
      />
      <ConfirmDeleteModal 
        accountActions={ accountActions }
      />
      <PasswordPolicyModal />
    </div>
  )
}

AccountTab2.propTypes = {
  accountActions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
}

export default AccountTab2