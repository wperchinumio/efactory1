import Fetcher from '../../../../util/Request'
import { showToaster, showSpinner, hideSpinner } from '../../../_Helpers/actions'

const
  namespace = 'ftp-batches',
  
  SET_ROOT_REDUX_STATE 	= `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  initialState = {
  	batches : [],
    filters : {
      received_date : [
        {
          field : 'received_date',
          oper : '=',
          value : '0D'
        }
      ],
      with_error : [
        {
          field : 'with_error',
          oper : '=',
          value : true
        }
      ]
    },
    page_num : 1,
    total : 0,
    sort : [{ received_date: 'desc' }]
  }

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

export function listBatches(){
  return function ( dispatch, getState ){

    dispatch( showSpinner() )

    const fetcher = new Fetcher()      

    let {
      filters,
      page_num,
      sort
    } = getState().services.utilities.ftpBatchActivity

    let and = []
    Object.values(filters).forEach( f => {
      and = [ ...and, ...f ]
    } )

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'list_batches',
          filter: {
            and
          },
          page_num,
          page_size : 100,
          sort
        }
      }).then(
        response => {

          dispatch( hideSpinner() )
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              batches : response.data.rows,
              total : response.data.total
            }
          })
        }
      ).catch(
        error => {
          dispatch( hideSpinner() )
        }
      )
    }
}

export function getBatchEmail( id ){
  return function ( dispatch, getState ){
    dispatch( showSpinner() )
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        batchEmail : ''
      }
    })
    const fetcher = new Fetcher()      

    return fetcher.fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'get_batch_email',
          id
        }
      }
    ).then(
      response => {
        dispatch(hideSpinner())
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            batchEmail : response.data.email
          }
        })
      }
    ).catch(
      error => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function showErrorToaster( error_message ){
  return function( dispatch, getState ){
    showToaster({
      isSuccess : false,
      message : error_message
    })( dispatch, getState )
  }
}

export function toggleToasterVisibility( show = true ){
  return function( dispatch, getState ){
    dispatch( show ? showSpinner() : hideSpinner() )
  }
}