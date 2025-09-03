import Fetcher from '../../../../util/Request'
import { showToaster, showSpinner, hideSpinner } from '../../../_Helpers/actions'
import moment from 'moment'

const
  namespace = 'po',
  
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
    account_number  : '',
    location        : '',
    reference_transaction_number  : '',
    reference_order_number        : '',
    order_date                    : moment( new Date() ).format('YYYY-MM-DD'),
    expected_delivery_date        : moment( new Date() ).format('YYYY-MM-DD'),
    lines                         : [
      // { 
      //   line_number : 1,  // from calculation
      //   item_number : 'aaaaa12', // from inventory api
      //   description : '', // from inventory api
      //   quantity : 233 // from user,
      // }
    ],
    lines_hashmap                 : {
      // [ item_number ] : quantity
    },
    addItemSearchFilterValue      : '',
    fetchInventoryParams          : {
      page_num      : 1,
      filter        : { and : [
        { field : 'omit_zero_qty', oper  : '=', value : true }
      ] },
      modalSearchFilter : '',
      modal_selected_wh_filter : ''
    },

    total : 0,
    rows : [
      // {
      //   description : 'asdasd',
      //   item_number : 'asd1233',
      //   row_id      : 1,
      //   quantity    : lines_hashmap[ item_number ] || 0
      // }
    ],
    checkedRows : {}, // { item_number : true }
    new_po_notification   : false,
    savingPoNotification  : false,
    form_dirty            : false
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

export function savePoNotification(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({ type: SET_ROOT_REDUX_STATE, data : {
      savingPoNotification : true
    } })

    let {
      account_number,
      location,
      reference_transaction_number,
      reference_order_number,
      order_date,
      expected_delivery_date,
      lines
    } = getState().services.utilities.po

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/ponotification', {
        method : 'post',
        data : {
          action        : 'save',
          data : {
            account_number,
            location,
            reference_transaction_number,
            reference_order_number,
            order_date,
            expected_delivery_date,
            lines
          }
        }
      })
      .then( response => {

        dispatch({ type : INITIALIZE_REDUX_STATE })
        dispatch({ type : SET_ROOT_REDUX_STATE, data : {
          new_po_notification   : true,
          savingPoNotification  : false
        } })
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Added notification successfully!'
        })( dispatch, getState )
        return Promise.resolve()
      })
      .catch( error => {

        dispatch(hideSpinner())

        dispatch({ type: SET_ROOT_REDUX_STATE, data : {
          savingPoNotification : false
        } })
        return Promise.resolve()

      })
  }
}

export function fetchInventoryItems( skipHashMapping = true ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    let { po } = getState().services.utilities
    
    let { 
      fetchInventoryParams = {},
      addItemSearchFilterValue
    } = po

    let {
      page_num,
      filter,
      modalSearchFilter
    } = fetchInventoryParams

    if( !addItemSearchFilterValue ){
      filter.and = filter.and.filter( f => f.field !== 'name'  )
    }

    if( modalSearchFilter ){
      filter.and = [
        ...filter.and,
        {
          field: "name",
          oper: "=",
          value: modalSearchFilter
        }
      ]
    }
    
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action        : "read",
          resource      : "inventory-status-for-cart",
          page_size     : 100,
          sort          : [{ item_number : "asc" }],
          page_num,
          filter   
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let { rows = [], total = 0 } = response.data

        // hashmapping skipped when user searches an item from cart
        // this means modal being opened is not intented
        // so that we can skip the process to show the modal
        if( skipHashMapping ){
          return Promise.resolve({
            isSuccess : true,
            rows      : rows,
            total     : total
          })
        }

        // first create a hashmap of lines array
        // so that we will get quanity values of the added items
        // to show on opened modal quantity fields
        let { lines = [] } = po
        let lines_hashmap = {} 
        lines.forEach( l => {
          lines_hashmap[ l.item_number ] = l.quantity
        } )

        rows = rows.map( r => ({
          ...r,
          quantity : lines_hashmap[ r.item_number ] || 0
        }) )

        setRootReduxStateProp_multiple({
          rows, 
          lines_hashmap,
          total
        })( dispatch, getState )


      })
      .catch( error => {

        dispatch(hideSpinner())
        return {
          isSuccess : false,
          items : [],
          totalItems : 0
        }
      })
  }
}