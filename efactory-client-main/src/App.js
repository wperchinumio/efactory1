import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  isPathnameAllowed,
  checkIfAuthTokenExists,
  findDefaultRoute,
  isUserAdmin,
} from './util/navigationHelpers'
import history from './history'
import { clearAuthData } from './util/storageHelperFuncs'
import * as authActions from './components/Login/redux'
import Routes from './routes'
import Login from './components/Login/_Content'
import Loading from './components/LoadingPage/_Content'
//import { useIntercom } from 'react-use-intercom';
import ReactGA from "react-ga4";
import config from './util/config'


const App = ({
  authActions,
  location
}) => {
  const [loading, setLoading] = useState(true)
  const [isUserLoggedIn, setUserLoggedIn] = useState(false)


  ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
  //ReactGA.send({ hitType: "pageview", page: window.location.pathname/* + window.location.search*/ });

  /*const {
    shutdown,
  } = useIntercom();
  */
  useEffect(
    () => {
      if (location.pathname === '/' || location.pathname === '/loading') {
        history.push('/overview') // pretend as if user wants to go to overview
      }
      requireLogin()
    },
    []
  )

/*  useEffect(
    () => {
      // Add Google Analytics
      ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
      ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }, [])
*/

  useEffect(
    () => {
      window.scrollTo(0,0)
    },
    [location.pathname]
  )

  useEffect(
    () => {
      if (loading) {
        // Workaround: shutdown has little bug. Once called, it does not trigger anymore hide/show events.
        // Better to render the button invisible.
        //shutdown();
        var elems = document.getElementsByClassName('intercom-lightweight-app');
        if (elems && elems.length > 0) {
          elems[0].style.opacity="0";
        }
        if (document.getElementById('intercom-container')) {
          document.getElementById('intercom-container').style.opacity="0";
        }
      }
      else if (!isUserLoggedIn) {
        //shutdown();
        elems = document.getElementsByClassName('intercom-lightweight-app');
        if (elems && elems.length > 0) {
          elems[0].style.opacity="0";
        }
        if (document.getElementById('intercom-container')) {
          document.getElementById('intercom-container').style.opacity="0";
        }
      }
    },
    [location.pathname]
  )

  function clearAuthDataRedirectToLogin () {
    clearAuthData()
    history.push('/login')
  }

  function logoutCurrentUser () {
    history.push('/login')
    authActions.logout()
    clearAuthData()
    setUserLoggedIn(false)
  }

  useEffect(
    () => {
      if (location.pathname === '/logout' ) {
        logoutCurrentUser()
      }

      if (location.pathname === '/logout-admin' ) {
        setUserLoggedIn(false)
        history.push('/admin/login-user')
      }
    },
    [location.pathname]
  )

  function requireLogin () {
    const tokenExists = checkIfAuthTokenExists()
    const isAdmin = tokenExists && isUserAdmin()

    authActions.checkAuth().then(
      ({ isAuth }) => {
        if (!tokenExists) {
          clearAuthDataRedirectToLogin()
          setLoading(false)
          return
        }

        if (isAdmin) { // todo
          if (!location.pathname.includes('admin')) {
            clearAuthDataRedirectToLogin()
          }
          setLoading(false)
          return
        }

        if (isAuth) {
          let { pathname, search } = location
          let pathnameAllowed = isPathnameAllowed(pathname)
          if (!pathnameAllowed || pathname === "/") {
            pathname = findDefaultRoute()
          }
          history.push( `${pathname}${search}` )
          setUserLoggedIn(true)
        } else {
          clearAuthDataRedirectToLogin()
        }
        setLoading(false)
      }
    )
  }

  function onUserSuccessfullyLoggedIn () {
    let { pathname, search } = location
    let pathnameAllowed = isPathnameAllowed(pathname)
    if (!pathnameAllowed || pathname === "/" || pathname === "/login") {
      pathname = findDefaultRoute()
    }
    history.push( `${pathname}${search}` )
    setUserLoggedIn(true)
  }

  if (loading) {
    return <Loading />
  }

  if (!isUserLoggedIn) {
    return <Login onUserSuccessfullyLoggedIn={onUserSuccessfullyLoggedIn} />
  }

  return (
    <Routes />
  )
}

export default withRouter(
  connect(
    null,
    dispatch => ({
      authActions : bindActionCreators( authActions, dispatch )
    })
  )(App)
)
