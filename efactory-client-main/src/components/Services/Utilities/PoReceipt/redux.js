import Fetcher                from '../../../../util/Request'
//import { defineAction }       from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }        from '../../../_Helpers/actions'
import moment                 from 'moment'

const
  namespace = 'po_receipt',
  //subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  //EXAMPLE_ASYNC = defineAction( 'EXAMPLE_ASYNC', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
    dcl_order_number  : '',
    searchingPoReceipt : false,
    new_po_receipt   : false,
    savingPoReceipt  : false,
    form_dirty            : false,
    supplier : '',
    receipt_date: moment().format('YYYY-MM-DD'),
    lot_required : false,
    rows : [],
    lines : [],
    searched : false,
    dcl_order_number_searched  : ''
  }

/************ REDUCER ************/

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


/************ ACTIONS ************/

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

export function initializeReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}

function createLinesFromRows( rows ){
  
  let lot_required = false
  
  let lines = rows.map( row => {
    let {
      line_number,
      item_number,
      inv_type,
      loc_number,
      open_qty,
      lot_required : lot_required_
    } = row

    lot_required = lot_required_

    return {
      line_number,
      item_number,
      inv_type,
      loc_number,
      open_qty,
      lot_number : '',
      container_id : '',
      qty : ''
    }
  } )

  return { lot_required, lines }
}

export function searchPoReceipt(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({ type: SET_ROOT_REDUX_STATE, data : {
      searchingPoReceipt : true
    } })

    let {
      dcl_order_number
    } = getState().services.utilities.poReceipt

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/po_receipt', {
        method : 'post',
        data : {
          resource      : 'po_receipt',
          action        : 'search',
          data : {
            dcl_order_number
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let rows = response.data

        let { lines, lot_required } = createLinesFromRows( rows )
        
        dispatch({ type : SET_ROOT_REDUX_STATE, data : {
          searchingPoReceipt  : false,
          rows,
          lines, 
          lot_required,
          dcl_order_number_searched : dcl_order_number,
          searched : true
        } })

      })
      .catch( error => {

        dispatch(hideSpinner())

        dispatch({ type: INITIALIZE_REDUX_STATE })

        dispatch({ type : SET_ROOT_REDUX_STATE, data : {
          dcl_order_number
        } })
      })
  }
}


export function sendPoReceipt(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({ type: SET_ROOT_REDUX_STATE, data : {
      savingPoReceipt : true
    } })

    let {
      dcl_order_number_searched,
      supplier,
      receipt_date,
      lot_required,
      lines
    } = getState().services.utilities.poReceipt

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/po_receipt', {
        method : 'post',
        data : {
          resource      : 'po_receipt',
          action        : 'save',
          data : {
            dcl_order_number : dcl_order_number_searched,
            supplier,
            lot_required,
            receipt_date,
            lines
          }
        }
      })
      .then( response => {

        dispatch({ type : INITIALIZE_REDUX_STATE })
        
        dispatch({ type : SET_ROOT_REDUX_STATE, data : {
          new_po_receipt   : true,
          savingPoReceipt  : false
        } })
        
        dispatch(hideSpinner())
        
        showToaster({
          isSuccess : true,
          message : 'Operation completed successfully'
        })( dispatch, getState )

      })
      .catch( error => {

        dispatch(hideSpinner())

        dispatch({ type: SET_ROOT_REDUX_STATE, data : {
          savingPoReceipt : false
        } })
      })
  }
}
