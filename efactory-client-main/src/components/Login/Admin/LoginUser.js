import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import global from 'window-or-global'
import history from '../../../history'
import { clearAuthData, setAuthData } from '../../../util/storageHelperFuncs'

const AdminLoginUser = props => {
  const filterNode = useRef(null)
  const [filterValue, setFilterValue] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')

  useEffect(
    () => {
      global.App.initAjax()
      let buttonDisabled = document.querySelector(".buttonToDisable")
      buttonDisabled.setAttribute("disabled","true")
    },
    []
  )

  function handleSubmit (event) {
    event.preventDefault()
    global.App.blockUI({ animate: true })
    props.loginActions.selectUserAsync(selectedAccount).then(
      response => {
        global.App.unblockUI()
        setAuthData(response.data)
        props.loginActions.setRootReduxStateProp_multiple({
          isAvailableAccounts: false,
          available_accounts: []
        }).then(
          () => {
            props.onUserSuccessfullyLoggedIn()
            history.push('/overview')
          }
        )
      }
    ).catch(
      error_message => {
        global.App.unblockUI()
        clearAuthData()
        console.error(error_message)
        props.loginActions.setRootReduxStateProp_multiple({
          isAvailableAccounts: false,
          available_accounts: []
        }).then(
          () => {
            history.push('/login')
          }
        )
      }
    )
  }

  function handleScrollBehaviour () {
    let active = document.querySelector('.mt-element-list .selected')
    if (active) {
      let activeOffsetTop = active.offsetTop
      let activeHeight    = document.querySelector('.mt-element-list li').clientHeight
      let height = document.querySelector('.mt-element-list').clientHeight
      let optionsScrolled = document.querySelector('.mt-element-list').scrollTop
      if (activeOffsetTop > (height + optionsScrolled)) {
        document.querySelector('.mt-element-list').scrollTop = activeOffsetTop - height
      } else if (( activeOffsetTop - activeHeight * 2 ) < optionsScrolled) {
        document.querySelector('.mt-element-list').scrollTop = activeOffsetTop - activeHeight * 2
      }
    }
  }

  function keyDownHandler (event, available_accounts = []) {
    if (!available_accounts.length ) {
      return
    }
    available_accounts = [ ...available_accounts ]
    let selectedAccountNext
    switch(event.which) {
      case 40: // down
        event.preventDefault()
        if (selectedAccount) {
          let index
          available_accounts.some( (o,i,arr) => {
            if (o.username === selectedAccount) {
              index = arr.length - 1 === i ? i : i + 1
              return true
            }
            return false
          } )
          selectedAccountNext = available_accounts[ index ]['username']
        }else{
          selectedAccountNext = available_accounts[0]['username']
        }
        break
      case 38: // up
        if (selectedAccount) {
          event.preventDefault()
          let index
          available_accounts.some( (o,i,arr) => {
            if (o.username === selectedAccount) {
              index = i === 0 ? -1 : i - 1
              return true
            }
            return false
          } )
          if (index !== -1) {
            selectedAccountNext = available_accounts[index]['username']
          }
        }else{
          selectedAccountNext = available_accounts[0]['username']
        }
        break
      case 13: // enter
        if (selectedAccount) {
          handleSubmit(event)
        }
        break
      default:
    }
    if (selectedAccountNext) {
      setSelectedAccount(selectedAccountNext)
      handleScrollBehaviour()
    }
  }

  let { available_accounts = [] } = props    
  if (filterValue.length) {
    let filterValueLowerCase = filterValue.toLowerCase()
    available_accounts = available_accounts.filter(
      account => account.username.toLowerCase().includes(filterValueLowerCase) ||
                  account.company.toLowerCase().includes(filterValueLowerCase) || 
                  account.location.toLowerCase().includes(filterValueLowerCase) ||
                  (account.is_EDI ? 'edi' : '').includes(filterValueLowerCase)
    )
  }
  available_accounts = available_accounts.sort( ( a, b ) => {
    if (a.username < b.username ) return -1
    if (a.username > b.username ) return 1
    return 0
  })
  
  return (
    <form
      autoComplete="off"
      id="select-user-form"
      onSubmit={ event => {
        event.preventDefault()
        if (selectedAccount) {
          handleSubmit( event )
        }
      } }
    >
      <div className="login-header">
        <h5>
          LOGIN TO EFACTORY <i className="fa fa-sign-in pull-right" />
          <small>
            Select the account you want to access
          </small>
        </h5>
        <input
          type="text"
          className="form-control input-lg"
          placeholder="search..."
          autoFocus={true}
          ref={filterNode}
          value={ filterValue }
          onChange={ event => {
            let { value } = event.target
            let filterValueLowerCase = value.toLowerCase()
            let available_accounts = props.available_accounts.filter(
              account => account.username.toLowerCase().includes(filterValueLowerCase) ||
                        account.company.toLowerCase().includes(filterValueLowerCase)
            )
            setFilterValue(event.target.value)
            setSelectedAccount(available_accounts.length === 1 ? available_accounts[0]['username'] : '')
          }}
          onKeyDown={ event => keyDownHandler( event, available_accounts ) }
        />
      </div>

      <div className="mt-element-list" style={{height: "100%", overflowY: "scroll", border: "1px double #ccc", backgroundColor: "white"}}>
        <div className="mt-list-container list-news ext-1">
          <ul>
            {
              available_accounts.map( (user, index) => {
                return (
                  <li
                    className={ classNames({
                      'mt-list-item': true,
                      'selected': selectedAccount === user.username
                    }) }
                    key={index}
                    onClick={ event => {
                      setTimeout(
                        () => {
                          if (filterNode.current) {
                            filterNode.current.focus()
                          }
                        },
                        500
                      )
                      setSelectedAccount(user.username)
                    } }
                    onDoubleClick={ handleSubmit }
                  >
                    <div className="user-login">
                      <div className="user-login-username">{user.username}</div>
                      <div className="user-login-company">{user.company}</div>
                      <div className="user-login-counter">{index + 1}/{available_accounts.length}</div>
                      <div className="user-login-location">
                          {
                            user.is_EDI ? 
                              <div className="user-login-edi">EDI</div>
                            :''
                          }{user.location}
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className="login-footer" style={{height: "50px", marginTop:"20px"}}>
        <div className="col-md-3 col-md-push-9" style={{ padding: '0' }}>
          <button 
            type="button"
            disabled={ !selectedAccount }
            className="btn btn-block bg-green-seagreen bg-font-green-seagreen buttonToDisable"
            onClick={ handleSubmit }
          >
            PROCEED <i className="icon-circle-right2 position-right " />
          </button>
        </div>
      </div>
    </form>
  )
}

AdminLoginUser.propTypes = {
  available_accounts: PropTypes.array,
  loginActions: PropTypes.object.isRequired
}

export default AdminLoginUser