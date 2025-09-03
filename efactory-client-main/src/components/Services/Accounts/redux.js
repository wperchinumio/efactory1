import Fetcher                					from '../../../util/Request'
//import { defineAction }       					from 'redux-define'
import {
  showToaster,
  showSpinner,
  hideSpinner
}        					                      from '../../_Helpers/actions'

const
  namespace = 'accounts',
  // subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE 	= `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
    activeTab : 'users',
    licenses  : [],
    estimate_monthly_charge : '',
    users : [],
    user : {
      user_id             : '',
      username            : '',
      accounts_visibility  : [],
      accounts_availability : [],
      apps                : [],
      web_service_only    : false,
      active              : true,
      force_logout        : false
    },
    add_user : {
      username: '',
      password: '',
      apps: [],
      web_service_only: false,
      accounts_visibility: [],
      accounts_availability : [],
      active: true
    },
    additional_licenses : []
  }

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- REDUCER ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      return {
        ...initialState
      }
    default:
      return state

  }

}


/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ACTIONS ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

/*
  this is a common purpose action creator which updates this part
  of the redux state tree, rather than creating different action
  creators, this one might be used to change a single property
  of this part of the redux tree
*/
export function setRootReduxStateProp( field, value ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { [ field ] : value }
    })
    return Promise.resolve()
  }
}

export function setRootReduxStateProp_multiple( keysToUpdate = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { ...keysToUpdate }
    })
    return Promise.resolve()
  }
}

export function initializeGridReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */



/*==============================================
=                 'X'  SECTION                 =
==============================================*/


export function readLicenses(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'read',
          resource  : 'licenses'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            licenses                : response.data.licenses,
            estimate_monthly_charge : response.data.estimate_monthly_charge
          }
        })

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function readUsers(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'read',
          resource  : 'users'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            users                   : response.data.users
          }
        })

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}


export function readUser( user_id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'read',
          resource  : 'user',
          user_id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            user : {
              ...response.data.user,
              apps : response.data.user.apps.map( i => String(i) )
            }
          }
        })

        return Promise.resolve()

      })
      .catch( error => {

        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}


export function changeUsername( username ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { user = {} } = getState().account
    let { user_id } = user
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'change_username',
          resource  : 'user',
          data : {
            user_id,
            username
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            user : {
              ...user,
              username
            }
          }
        })

        readUsers()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Changed username successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {

        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}

export function changePassword( password ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { user = {} } = getState().account
    let { user_id } = user
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'change_password',
          resource  : 'user',
          data : {
            user_id,
            password
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            user : {
              ...user,
              password
            }
          }
        })

        showToaster({
          isSuccess : true,
          message : 'Changed password successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {

        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}

export function saveEditUserChanges( show_additional_licenses ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { user = {} } = getState().account
    let { 
      user_id,
      apps,
      web_service_only,
      accounts_visibility,
      active,
      force_logout 
    } = user
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'edit',
          resource  : 'user',
          show_additional_licenses,
          data : {
            user_id,
            apps : apps.map( app => { return +app } ),
            web_service_only,
            accounts_visibility,
            active ,
            force_logout
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            additional_licenses : response.data.additional_licenses
          }
        })

        if( !response.data.additional_licenses.length ){
          showToaster({
            isSuccess : true,
            message : 'Saved changes successfully!'
          })( dispatch, getState )
          readUsers()( dispatch, getState )
        }

        return Promise.resolve( response.data.additional_licenses )

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function addUser( show_additional_licenses ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { add_user = {} } = getState().account
    let { 
      apps,
      username,
      password,
      web_service_only,
      accounts_visibility,
      active 
    } = add_user
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'add',
          resource  : 'user',
          show_additional_licenses,
          data : {
            apps : apps.map( app => { return +app } ),
            username,
            password,
            web_service_only,
            accounts_visibility,
            active 
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            additional_licenses : response.data.additional_licenses
          }
        })

        if( !response.data.additional_licenses.length ){
          showToaster({
            isSuccess : true,
            message : 'Added account successfully!'
          })( dispatch, getState )
          readUsers()( dispatch, getState )
        }

        return Promise.resolve( response.data.additional_licenses )

      })
      .catch( error => {

        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}


export function deleteUser(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { user_id } = getState().account.user
    
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'remove',
          resource  : 'user',
          user_id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        readUsers()( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {

        dispatch(hideSpinner())
        
        return Promise.reject()

      })
  }
}


export function changeMyPassword( old_password, new_password ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())
    
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action        : 'change_my_password',
          resource      : 'user',
          old_password,
          new_password
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Changed password successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {

        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}

export function readAccountsAvailability(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action    : 'read',
          resource  : 'accounts_availability'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            add_user : {
              ...getState().account.add_user,
              accounts_availability : response.data.accounts_availability
            }
          }
        })

        return Promise.resolve()

      })
      .catch( error => {
        
        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}


/*=====  End of 'X' ACTIONS  ======*/



