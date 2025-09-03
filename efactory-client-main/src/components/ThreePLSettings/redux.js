import Fetcher                          from '../../util/Request'
// import { defineAction }                 from 'redux-define'
import {
  showToaster,
  showSpinner,
  hideSpinner
}                                        from '../_Helpers/actions'

const
  namespace = 'THREE-PL-SETTINGS',
  // subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
    activeTab: 'order_import',
    plData : [],
    plData_shipConfirm : [],
    plData_rma : [],
    order_import_activity : [],
    ship_confirm_activity: [],
    inventory_activity: [],
    rma_import_activity: [],
    order_import_order_data : '',
    order_import_ack_data : '',
    ship_confirm_ack_data : '',
    inventory_ack_data : '',
    rma_import_rma_data : ''
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
        ...initialState,
        //badgeCounterValues : state.badgeCounterValues
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
=                   SECTION                    =
==============================================*/


export function read3PLScheduler(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_3pl_orderimport_scheduler'
        }
      })
      .then( response => {

        let { data = [] } = response

        dispatch({
          type: SET_ROOT_REDUX_STATE,
          data : {
            plData : data
          }
        })

        dispatch(hideSpinner())

        // showToaster({
        //   isSuccess : true,
        //   message : 'Successfully edited filter!'
        // })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function readRma3PLScheduler(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_3pl_rmaimport_scheduler'
        }
      })
      .then( response => {

        let { data = [] } = response

        dispatch({
          type: SET_ROOT_REDUX_STATE,
          data : {
            plData_rma : data
          }
        })

        dispatch(hideSpinner())

        // showToaster({
        //   isSuccess : true,
        //   message : 'Successfully edited filter!'
        // })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function add3PLScheduler({
  environment,
  product_group,
  time,
  one_time
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_orderimport_scheduler',
          data : {
            environment,
            product_group,
            time,
            one_time
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Order Import Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function addRma3PLScheduler({ 
  environment,
  product_group,
  time,
  one_time
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_rmaimport_scheduler',
          data : {
            environment,
            product_group,
            time,
            one_time
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        readRma3PLScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'RMA Import Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function update3PLScheduler({
  environment,
  product_group,
  time,
  id
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'update_3pl_orderimport_scheduler',
          data : {
            environment,
            product_group,
            time,
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule updated successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function updateRma3PLScheduler({
  environment,
  product_group,
  time,
  id
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'update_3pl_rmaimport_scheduler',
          data : {
            environment,
            product_group,
            time,
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        readRma3PLScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule updated successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function delete3PLScheduler( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'delete_3pl_orderimport_scheduler',
          data : {
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule deleted successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function deleteRma3PLScheduler( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'delete_3pl_rmaimport_scheduler',
          data : {
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        readRma3PLScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule deleted successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function importOnDemand({ environment, ids, product_group }){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_orderimport_ondemand',
          data : {
            environment,
            ids,
            product_group
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Order Import Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}



export function importRmaOnDemand({ environment, ids, product_group }){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_rmaimport_ondemand',
          data : {
            environment,
            ids,
            product_group
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'RMA Import Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}



export function read3PLShipConfirmScheduler(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'read_3pl_shipconfirm_scheduler'
        }
      })
      .then( response => {

        let { data = [] } = response

        dispatch({
          type: SET_ROOT_REDUX_STATE,
          data : {
            plData_shipConfirm : data
          }
        })

        dispatch(hideSpinner())

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function read3PLPOReceiptScheduler(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'read_3pl_inventory_scheduler'
        }
      })
      .then( response => {

        let { data = [] } = response

        dispatch({
          type: SET_ROOT_REDUX_STATE,
          data : {
            plData_shipConfirm : data
          }
        })

        dispatch(hideSpinner())

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function add3PLShipConfirmScheduler({
  environment,
  product_group,
  time,
  one_time
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_shipconfirm_scheduler',
          data : {
            environment,
            product_group,
            time,
            one_time
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLShipConfirmScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Ship Confirm Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function add3PLPOReceiptScheduler({
  environment,
  product_group,
  time,
  one_time
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_inventory_scheduler',
          data : {
            environment,
            product_group,
            time,
            one_time
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLPOReceiptScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Inventory Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function update3PLShipConfirmScheduler({
  environment,
  product_group,
  time,
  id
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'update_3pl_shipconfirm_scheduler',
          data : {
            environment,
            product_group,
            time,
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLShipConfirmScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule updated successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function update3PLPOReceiptScheduler({
  environment,
  product_group,
  time,
  id
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'update_3pl_inventory_scheduler',
          data : {
            environment,
            product_group,
            time,
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLPOReceiptScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule updated successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function delete3PLShipConfirmScheduler( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'delete_3pl_shipconfirm_scheduler',
          data : {
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLShipConfirmScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule deleted successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function delete3PLPOReceiptScheduler( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'delete_3pl_inventory_scheduler',
          data : {
            id
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        read3PLPOReceiptScheduler()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Schedule deleted successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function add3PLShipConfirmOnDemand({
  environment,
  product_group,
  from_date,
  from_time,
  to_date,
  to_time,
  ids
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_shipconfirm_ondemand',
          data : {
            environment,
            product_group,
            from_date,
            from_time,
            to_date,
            to_time,
            ids
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Ship Confirm Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function add3PLPOReceiptOnDemand({
  environment,
  product_group,
  from_date,
  from_time,
  to_date,
  to_time,
  ids,
  inventory_type
}){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'add_3pl_inventory_ondemand',
          data : {
            environment,
            product_group,
            from_date,
            from_time,
            to_date,
            to_time,
            ids,
            inventory_type
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Inventory Scheduled!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}



export function readOrderImportActivity(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_symlog_orderimport_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              order_import_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readOrderImportActivity_detail(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_3pl_orderimport_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              order_import_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readShipConfirmActivity(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_symlog_shipconfirm_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              ship_confirm_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readShipConfirmActivity_detail(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_3pl_shipconfirm_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              ship_confirm_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readInventoryActivity(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_symlog_inventory_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              inventory_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readInventoryActivity_detail(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_3pl_inventory_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              inventory_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readRmaImportActivity(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_symlog_rmaimport_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              rma_import_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readRmaImportActivity_detail(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'read_3pl_rmaimport_activity'
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              rma_import_activity : response.data
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readOrderImportOrderData( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_order_symlog_orderimport',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              order_import_order_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readOrderImportOrderData_detail( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_order_3pl_orderimport',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              order_import_order_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readOrderImportAckData( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_symlog_orderimport',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              order_import_ack_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readOrderImportAckData_detail( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_3pl_orderimport',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              order_import_ack_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readShipConfirmAckData( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_symlog_shipconfirm',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              ship_confirm_ack_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readShipConfirmAckData_detail( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_3pl_shipconfirm',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              ship_confirm_ack_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}


export function readInventoryAckData( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_symlog_inventory',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              inventory_ack_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readInventoryAckData_detail( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_3pl_inventory',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              inventory_ack_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readRmaImportRmaData( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_ack_symlog_rmaimport',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              rma_import_rma_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

export function readRmaImportRmaData_detail( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action    : 'get_rma_3pl_rmaimport',
          id
        }
      }).then( 
        response => {

          dispatch(hideSpinner())

          dispatch({ 
            type : SET_ROOT_REDUX_STATE,
            data : {
              rma_import_rma_data : response.data.html
            } 
          })

          return Promise.resolve()
      }).catch( 
        error => {
        
          console.log(error)
          dispatch(hideSpinner())
          let { 
            error_message = 'An error occured',
            error_dialog = false
          } = error || {}
          showToaster({
            isSuccess : false,
            message : error_message,
            isNoTimeout : error_dialog ? true : false
          })( dispatch, getState )
          return Promise.reject()
      })
  }
}

/*=====  End of FILTER RELATED ACTIONS  ======*/
			
    