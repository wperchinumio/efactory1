import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import history from '../../history'
import { setAuthData } from '../../util/storageHelperFuncs'
import AnotherUserLoggedInModal from './AnotherUserLoggedIn'

const Login = props => {
  const componentLives = useRef(true)
  const passwordInputNode = useRef(null)
  const usernameParentNode = useRef(null)
  const passwordParentNode = useRef(null)
  const [username, setUsername] = useState(localStorage.getItem('rememberUsername') || '')
  const [password, setPassword] = useState('')
  const [errorMessageVisible, setErrorMessageVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [shakeEffect, setShakeEffect] = useState(false)
  const [useDomainCredentials, setUseDomainCredentials] = useState(true)
  const [rememberUsernameChecked, setRememberUsernameChecked] = useState(Boolean(localStorage.getItem('rememberUsername')))

  const show_useDomainCredentials = localStorage.getItem('is_local') === 'true' ? true : false
  
  useEffect(
    () => {
      document.querySelector('.page-content').style.height = `${global.window.innerHeight}px`
      if (username) {
        passwordInputNode.current.focus()
      }
      return () => {
        componentLives.current = false
      }
    },
    []
  )

  useEffect(
    () => {
      if (shakeEffect) {
        setTimeout(
          () => {
            if (componentLives.current) {
              setShakeEffect(false)
            }
          },
          2000
        )
      }
    },
    [shakeEffect]
  ) 

  function addEditedClass (selector) {
    if (selector === 'username' && !usernameParentNode.current.className.includes('edited')) {
      usernameParentNode.current.className += ' edited'
    }
    if (selector === 'password' && !passwordParentNode.current.className.includes('edited')) {
      passwordParentNode.current.className += ' edited'
    }
  }

  function removeHasErrorClass (selector) {
    if (selector === 'username') {
      usernameParentNode.current.className = usernameParentNode.current.className.replace(/has-error/g,'')
    }
    if (selector === 'password') {
      passwordParentNode.current.className = passwordParentNode.current.className.replace(/has-error/g,'')
    }
  }

  function addHasErrorClass (selector) {
    if (selector === 'username') {
      usernameParentNode.current.className += ' has-error'
    }
    if (selector === 'password') {
      passwordParentNode.current.className += ' has-error'
    }
  }

  function handleUsernameInput (event) {
    let parentClassname = usernameParentNode.current.className
    let { value } = event.target
    if ( value.length ){
      removeHasErrorClass('username')
    }else if ( !value.length && parentClassname.includes('edited') ){
      addHasErrorClass('username')
    } 
    setUsername(value)
    setErrorMessageVisible(false)
  }

  function handlePasswordInput (event) {
    let parentClassname = passwordParentNode.current.className
    let { value } = event.target
    if ( value.length ){
      removeHasErrorClass('password')
    }else if ( !value.length && parentClassname.includes('edited') ){
      addHasErrorClass('password')
    } 
    setPassword(value)
    setErrorMessageVisible(false)
  }

  function handleSubmit (event) {
    event.preventDefault()
    loginWithCredentials()
  }

  function loginWithCredentials (force_logout = false) {
    const usernamePasswordExists = username.trim().length && password.trim().length
    if (usernamePasswordExists) {
      global.App.blockUI({ animate: true })
      props.loginActions.loginAsync(
        username,
        password,
        rememberUsernameChecked,
        show_useDomainCredentials ? useDomainCredentials : false,
        force_logout
      ).then( 
        response => {
          global.App.unblockUI()
          handleLoginResponse(response)
        } 
      ).catch(
        ({ error_message, anotherUserLoggedIn }) => {
          global.App.unblockUI()
          setErrorMessageVisible(true)
          setErrorMessage(error_message)
          setShakeEffect(true)
          setTimeout(
            () => {
              if ( anotherUserLoggedIn ){
                global.$('#another-user-logged-in').modal('show')
              }
            },
            100
          )
        }
      )
    } else if (!username.trim().length) {
      addHasErrorClass('username')
      addHasErrorClass('password')
    } 
  }

  function forceLogout (interval) {
    clearInterval(interval)
    loginWithCredentials( true )
  }

  function handleForceLogoutTimeout () {
    setPassword('')
    setErrorMessageVisible(false)
    setTimeout(
      () => {
        if ( passwordInputNode.current && passwordInputNode.current.focus ){
          passwordInputNode.current.focus()
        }
      },
      100
    )
  }
  
  function handleLoginResponse (response) {
    if ( response.data.user_data.roles.includes('ADM') ){
      let responseToStore = { ...response } 
      let { available_accounts } = responseToStore.data
      setAuthData( responseToStore.data )
      props.loginActions.setRootReduxStateProp_multiple({
        available_accounts, 
        isAvailableAccounts : true,
        admin_roles : response.data.admin_roles || []
      }).then( () => {
        history.push('/admin/login-user')  
      })
    } else {
      setAuthData(response.data)
      props.onUserSuccessfullyLoggedIn()
    }
  }

  function onUsernameFieldBlurred (event) {
    handleBlur( 'username' )
  }

  function onPasswordFieldBlurred (event) {
    handleBlur( 'password' )
  }

  function handleBlur (type) { // type is one of 'username' or 'password'
    addEditedClass( type )
    let value = type === 'username' ? username : password
    let isEmpty = value.trim().length === 0
    if (isEmpty) {
      addHasErrorClass( type )
    } 
  }

  function handleRememberUsername (event) {
    setRememberUsernameChecked( v => !v )
  }

  return (
    <div className="login-container">
      <form name="loginform" id="loginform" onSubmit={handleSubmit} autoComplete="off">
        <div 
          className={ classNames({
            'login-form' : true,
            'animated shake' : shakeEffect
          }) }
        >  
          <div className="login-header">
            <h5>LOGIN TO EFACTORY<i className="fa fa-sign-in pull-right"></i>
              <small>Enter your credentials</small>
            </h5>
          </div>
          <div
            className="form-group form-md-line-input form-md-floating-label has-success"
            ref={usernameParentNode}
          >
            <div className="input-icon ">
              <input
                type="text"
                className={ classNames({
                  'form-control login': true,
                  'edited': username.length > 0
                }) }
                id="form_control_1"
                value={ username }
                onChange={ handleUsernameInput }
                onBlur={ onUsernameFieldBlurred }
              />
              <label htmlFor="form_control_1">
                Username
              </label>
              <i className="fa fa-user "></i>
            </div>
          </div>
          <div
            className="form-group form-md-line-input form-md-floating-label has-success "
            ref={passwordParentNode}
            style={{ marginBottom : '15px' }}
          >
            <div className="input-icon">
              <input
                type="password"
                className="form-control login"
                id="form_control_2 "
                value={ password }
                ref={passwordInputNode}
                onChange={ handlePasswordInput }
                onBlur={ onPasswordFieldBlurred }
              />
              <label htmlFor="form_control_2">
                Password
              </label>
              <i className="fa fa-lock "></i>
            </div>
          </div>
          <div className="login-footer ">
            <span className="caption-subject font-red sbold uppercase ">
              { errorMessageVisible ? errorMessage : '' }
            </span>
          </div>
          <div className="form-group ">
            <label className="mt-checkbox mt-checkbox-outline col-md-12" style={{color: "#555", fontSize: "13px"}}>
              <input
                type="checkbox"
                value="on"
                checked={ rememberUsernameChecked }
                onChange={ handleRememberUsername }
              />
              <span></span>
              Remember my username
            </label>
            {
              show_useDomainCredentials &&
              <label className="mt-checkbox mt-checkbox-outline col-md-12" style={{color: "#555", fontSize: "13px"}}>
                <input
                  type="checkbox"
                  value="on"
                  checked={ useDomainCredentials }
                  onChange={ event => setUseDomainCredentials(event.currentTarget.checked) }
                />
                <span></span>
                DCL User
              </label>
            }
            <button
              type="submit"
              className="btn btn-block bg-green-seagreen bg-font-green-seagreen "
            >
              Login <i className="icon-circle-right2 position-right "></i>
            </button>
          </div>
        </div>
        <AnotherUserLoggedInModal 
          proceed={ forceLogout }  
          handleForceLogoutTimeout={ handleForceLogoutTimeout }
        />
      </form>
    </div>
  )
}

Login.propTypes = {
  loginActions : PropTypes.object.isRequired,
  onUserSuccessfullyLoggedIn: PropTypes.func.isRequired
}

export default Login