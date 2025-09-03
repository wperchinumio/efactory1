import { path } from 'ramda'
import Fetcher from '../../../util/Request'
import { hideSpinner, showSpinner, showToaster } from '../../_Helpers/actions'

const namespace = 'add-edit-address'
const MERGE_REDUX_STATE_WITH  = `${namespace}---MERGE_REDUX_STATE_WITH`
const RESET_REDUX_STATE  = `${namespace}---RESET_REDUX_STATE`

const initialState = {
  addAddressData: {
    title: '',
    billingAddress: {},
    shippingAddress: {
      country: 'US'
    }
  },
  editAddressData: {
    id: '',
    title: '',
    billingAddress: {},
    shippingAddress: {},
    dirty: false
  },
}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case MERGE_REDUX_STATE_WITH:
      return {
        ...state,
        ...action.data
      }
    case RESET_REDUX_STATE:
      return {
        ...initialState
      }
    default:
      return state

  }

}

export function mergeReduxStateWith( objectToMerge = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: MERGE_REDUX_STATE_WITH,
      data : { ...objectToMerge }
    })
  }
}

export function resetReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: RESET_REDUX_STATE })
  }
}

export function postAddAddress( address ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher.fetch('/api/orderpoints', {
      method : 'post',
      data : {
        action : 'create_address',
        data : address
      }
    }).then(
      response => {
        showToaster({
          isSuccess: true,
          message: 'Added address successfully!'
        })( dispatch, getState )
        dispatch({ type: RESET_REDUX_STATE })
        return Promise.resolve({isSuccess: true})
      }
    ).catch(
      error => {
        let { 
          error_message = 'An error occured',
          error_dialog
        } = error || {}
        showToaster({
          isSuccess : false,
          message : error_message,
          isNoTimeout : Boolean(error_dialog)
        })( dispatch, getState )
        return Promise.resolve({isSuccess: false})
      }
    ).finally(
      () => {
        dispatch(hideSpinner())
      }
    )
  }
}


export function postEditAddress( address ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'update_address',
          data : address
        }
      }).then( 
        response => {
          showToaster({
            isSuccess: true,
            message: 'Updated address successfully!'
          })( dispatch, getState )
          const editAddressData = path(['addressBook', 'addEditAddress', 'editAddressData'], getState())
          dispatch({
            type: MERGE_REDUX_STATE_WITH,
            data : {
              editAddressData: {
                ...editAddressData,
                dirty: false
              }
            }
          })
      }).catch( 
        error => {
        
          let { 
            error_message = 'An error occured',
            error_dialog
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : Boolean(error_dialog)
          })( dispatch, getState )
      }).finally(
        () => {
          dispatch(hideSpinner())
        }
      )
  }
}