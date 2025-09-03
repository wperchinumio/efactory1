import Fetcher from '../../../util/Request'
import {
  getAuthData
}              from '../../../util/storageHelperFuncs'

import {
  showSpinner,
  hideSpinner
}              from '../../_Helpers/actions'

// CONSTANTS
const
  SET_ROOT_REDUX_STATE = `common@SET_ROOT_REDUX_STATE`,
  GET_GLOBAL_API = 'GET_GLOBAL_API',
  GET_GLOBAL_API_SUCCESS = 'GET_GLOBAL_API_SUCCESS',
  GET_GLOBAL_API_FAIL = 'GET_GLOBAL_API_FAIL',
  GLOBAL_TOASTER = 'GLOBAL_TOASTER',
  SHOW_LOADING_SPINNER = 'SHOW_LOADING_SPINNER',
  HIDE_LOADING_SPINNER = 'HIDE_LOADING_SPINNER'

// REDUCER
const initialState = {
  globalApiData : {},
  loadingGlobalApi: false,
  loadedGlobalApi:false,
  loadGlobalApiError:false,
  isSuccessToaster : true,
  toasterMessage : '',
  isNoTimeout : false,
  toasterIndex : 0,
  spinnerIndex : 0,
  email_for_profile : ''
}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case GET_GLOBAL_API:
      return {
        ...state,
        loadingGlobalApi: true,
        loadedGlobalApi:false,
        loadGlobalApiError:false
      }
    case GET_GLOBAL_API_SUCCESS:
      return {
        ...state,
        loadingGlobalApi: false,
        loadedGlobalApi:true,
        loadGlobalApiError:false,
        globalApiData : action.data
      }
    case GET_GLOBAL_API_FAIL:
      return {
        ...state,
        loadingGlobalApi: false,
        loadedGlobalApi:false,
        loadGlobalApiError:action.data
      }

    case SHOW_LOADING_SPINNER:
      return {
        ...state,
        spinnerIndex : state.spinnerIndex + 1
      }
    case HIDE_LOADING_SPINNER:
      return {
        ...state,
        spinnerIndex : state.spinnerIndex - 1
      }

    case GLOBAL_TOASTER:
      return {
        ...state,
        ...action.data
      }
    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    default:
      return state;

  }

};


// ACTIONS

/* ----------------- GET GLOBAL API ACTIONS START ----------------- */

export function setRootReduxStateProp_multiple( keysToUpdate = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { ...keysToUpdate }
    })
    return Promise.resolve()
  }
}

export const getGlobalApi = () => ({
  type : GET_GLOBAL_API
});
export const getGlobalApiSuccess = data => ({
  type : GET_GLOBAL_API_SUCCESS,
  data
});
export const getGlobalApiFail = data => ({
  type : GET_GLOBAL_API_FAIL,
  data
});
export function getGlobalApiAsync(for_admin = false){
  return function(dispatch) {
    const fetcher = new Fetcher();

    dispatch(getGlobalApi());

    fetcher
      .fetch('/api/global' + (for_admin? '?admin=1':''), {
        method : 'get'
      })
      .then((response) => {
        dispatch( getGlobalApiSuccess(response.data)); // { type :"",views : ...}
      })
      .catch((error) => {
        return dispatch(getGlobalApiFail({
          error : error && error['error_message']
        }))
      });
  }
}

let toasterIndex = 0
export function showToaster({
  isSuccess,
  message = '',
  isNoTimeout = false
}){
  return function( dispatch, getState ) {
    dispatch({
      type : GLOBAL_TOASTER,
      data : {
        isSuccessToaster : isSuccess,
        isNoTimeout,
        toasterMessage : message,
        toasterIndex : ++toasterIndex // to check from layout component for changes
      }
    })
  }
}


export function updateEmail( email ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          action  : 'update',
          resource: 'profile',
          data    : {
            email
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            email_for_profile : email
          }
        })

        let authToken = getAuthData()
        authToken.user_data.email = email
        authToken.user_data.is_valid_email_address = true
        authToken = JSON.stringify( authToken )
        localStorage.setItem( 'authToken', authToken )
        showToaster({
          isSuccess : true,
          message : 'Successfully updated e-mail!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        
        dispatch(hideSpinner())
        
        return Promise.resolve()
      })
  }
}
/* ----------------- GET GLOBAL API ACTIONS END ----------------- */
