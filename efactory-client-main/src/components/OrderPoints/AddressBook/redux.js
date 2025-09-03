import Fetcher from '../../../util/Request'
import { showToaster, showSpinner, hideSpinner } from '../../_Helpers/actions'
import downloadSource from '../../_Helpers/DownloadSource'
import config from '../../../util/config'
import {getAuthData} from '../../../util/storageHelperFuncs'

const namespace = 'address-book'
const MERGE_REDUX_STATE_WITH  = `${namespace}---MERGE_REDUX_STATE_WITH`
const RESET_REDUX_STATE  = `${namespace}---RESET_REDUX_STATE`

const initialState = {
  activeAddress: '',
  activePagination: 1,
  addresses: [],
  dirty: false,
  filterValue: '',
  importingAddress: false,
  loading: {},
  page_size: 100,
  total: 0,
  validatedAddressFields: {},
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


export function setRootReduxStateProp( field, value ){
  return function( dispatch, getState ){
    dispatch({
      type: MERGE_REDUX_STATE_WITH,
      data : { [ field ] : value }
    })
    return Promise.resolve()
  }
}

export function setRootReduxStateProp_multiple( keysToUpdate = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: MERGE_REDUX_STATE_WITH,
      data : { ...keysToUpdate }
    })
    return Promise.resolve()
  }
}

export function initializeReduxState(){
  return function( dispatch, getState ) {
    dispatch({ type : RESET_REDUX_STATE })
  }
}

export function addAddressAsync( addressObject ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'create_address',
          data : addressObject
        }
      })
      .then( response => {
        showToaster({
          isSuccess : true,
          message : 'Added address successfully!'
        })( dispatch, getState )
        return { isSuccess : true }
      })
      .catch( error => {
        let { 
          error_message = 'An error occured',
          error_dialog
        } = error || {}
        showToaster({
          isSuccess : false,
          message : error_message,
          isNoTimeout : Boolean(error_dialog)
        })( dispatch, getState )
        return { isSuccess: false }
      }).finally(
      () => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function getAddressesAsync(){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    let {
      activePagination,
      page_size,
      filter
    } = getState().addressBook.allAddresses
    const fetcher = new Fetcher()
    return fetcher.fetch(
      '/api/orderpoints', 
      {
        method : 'post',
        data : {
          action : 'read_addresses',
          page_num : activePagination,
          page_size,
          filter
        }
      }
    ).then( 
      response => {
        let {
          rows = [],
          total = 0
        } = response.data || {}
        dispatch({
          type: MERGE_REDUX_STATE_WITH,
          data : {
            addresses : rows,
            total     : total
          }
        })
        return { isSuccess : true, rows }
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
        return { isSuccess: false }
    }).finally(
      () => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function updateAddressAsync( address ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher.fetch(
      '/api/orderpoints', 
      {
        method : 'post',
        data : {
          action : 'update_address',
          data : address
        }
      }
    ).then(
      response => {
        showToaster({
          isSuccess : true,
          message : 'Updated address successfully!'
        })( dispatch, getState )
        return { isSuccess : true }
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
        return { isSuccess : false }
    }).finally(
      () => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function duplicateAddressAsync( addressObject ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher.fetch(
      '/api/orderpoints', 
      {
        method : 'post',
        data : {
          action : 'create_address',
          data : addressObject
        }
      }
    ).then( response => {
      getAddressesAsync()( dispatch, getState )
      showToaster({
        isSuccess : true,
        message : 'Duplicated address successfully!'
      })( dispatch, getState )
    }).catch( error => {
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

export const downloadAddressesAsync = () => {   
  return ( dispatch, getState ) => {

    dispatch(showSpinner())

    let {     
      filter
    } = getState().addressBook.allAddresses

    let data = {                     
      action : 'export',
      page_num : 1,
      page_size : 100000,
      filter
    }    

    data = JSON.stringify(data)
    return downloadSource( '/api/orderpoints', data, {
      onSuccessAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Downloaded successfully!'
        })( dispatch, getState )
      },
      onErrorAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : false,
          message : 'An error occurred while downloading!'
        })( dispatch, getState )
      }
    })

  }
}

export function deleteAddressAsync(id){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher.fetch(
      '/api/orderpoints', 
      {
        method : 'post',
        data : {
          action : 'delete_address',
          id
        }
      }
    ).then(
      response => {
        getAddressesAsync()( dispatch, getState )
        showToaster({
          isSuccess : true,
          message : 'Deleted address successfully!'
        })( dispatch, getState )
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
      }
    ).finally(
      () => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function validateAddressAsync( addressFieldsToValidate = {} ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    dispatch({
      type: MERGE_REDUX_STATE_WITH,
      validatedAddressFields: {}
    })
    const fetcher = new Fetcher()
    return fetcher.fetch(
      '/api/orderpoints',
      {
        method : 'post',
        data : {
          action : 'validate_address',
          data : {
            address1 : '',
            address2 : '',
            city : '',
            postal_code : '',
            state_province : '',
            ...addressFieldsToValidate,
          }
        }
      }
    ).then( 
      response => {
        dispatch({
          type : MERGE_REDUX_STATE_WITH,
          validatedAddressFields : {
            ...response.data
          }
        })
        if( !response.data.warnings && !response.data.errors ){
          showToaster({
            isSuccess : true,
            message : 'Validated address successfully!'
          })( dispatch, getState )
        }
        return { isSuccess : true, data : response.data }
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
        return { isSuccess : false }
      }
    ).finally(
      () => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function importAddress( file, action ){
  return function(dispatch, getState) {

    dispatch(showSpinner())

    dispatch({ 
      type : MERGE_REDUX_STATE_WITH,
      data : {
        importingAddress : true,
        importedAddresses  : false
      }
    })
    
    let formData = new FormData()
    formData.append("file", file)
    
    let xhr = new XMLHttpRequest()
    xhr.open('POST', `${config.host}/api/upload`, true)

    let token = getAuthData().api_token

    xhr.setRequestHeader('X-Access-Token', token )
    xhr.setRequestHeader('X-Upload-Params', JSON.stringify({
      func : 'address_upload', action
    }) )
    let isError = false
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        showToaster({
          isSuccess : true,
          message : 'Imported addresses successfully!'
        })( dispatch, getState )

        dispatch({ 
          type : MERGE_REDUX_STATE_WITH,
          data : {
            importingAddress : false,
            importedAddresses  : true
          }
        })
        setTimeout( () => {
          dispatch({ 
            type : MERGE_REDUX_STATE_WITH,
            data : {
              importingAddress : false,
              importedAddresses  : false
            }
          })
        }, 0 )
        dispatch(hideSpinner())
        getAddressesAsync()( dispatch, getState )
        //getlistAsync()(dispatch,getState);
      }else{
        if( isError ) return
        isError = true
        dispatch({ 
          type : MERGE_REDUX_STATE_WITH,
          data : {
            importingAddress : false,
          }
        })
        let response = JSON.parse(xhr.response)
        let { error_message } = response
        showToaster({
          isSuccess : false,
          message : error_message
        })( dispatch, getState )
        dispatch(hideSpinner())
      }
    }
    xhr.onerror = function () {
      if( isError ) return
      let response = JSON.parse(xhr.response)
      let { error_message } = response
      
      showToaster({
        isSuccess : false,
        message : error_message
      })( dispatch, getState )
      
      dispatch({ 
        type : MERGE_REDUX_STATE_WITH,
        data : {
          importingAddress : false,
        }
      })
      dispatch(hideSpinner())
    }
    xhr.send(formData)
  }
}
