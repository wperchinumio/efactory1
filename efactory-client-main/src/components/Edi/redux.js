import Fetcher                    from '../../util/Request'
import {
  showToaster,
  showSpinner,
  hideSpinner
}        					                from '../_Helpers/actions'
import { setBadgeCounterValues }  from '../Grid/redux'

import config                     from '../../util/config';
import {getAuthData}              from '../../util/storageHelperFuncs';

const
	namespace = 'edi',

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE 	= `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
		dates : {},
    partners : [],
    is_initially_called : false,

    // ext shipments drafts
    loadedDrafts : true, // temp
    selectedDraftRows : {},
    filterValue : '',
    shipments : [],
    is_shipments_fetched : false,
    chart_30days : [],

    // ext shipments entry
    is_new_shipment_added : false,
    addedShipmentData : {},
    modalValues : {
      billingAddress : {},
      others : {}
    },
    is_form_values_dirty : false, // when form values change this becomes true
      // container related
      containerItems : [],
      addContainerData : {},
      is_edit_container : false,
      edit_container_index : '',
      serial_numbers_record_index : ''
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

export function initializeGridReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}

export function fetchEdiOverview( no_loading_effect = true ){
  return function( dispatch, getState ) {

    let { is_initially_called } = getState().grid

    if( !is_initially_called ){
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : {
          is_initially_called : true
        }
      })
    }

    if( !no_loading_effect ){
      dispatch(showSpinner())
    }

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'overview'
        }
      })
      .then( response => {

        if( !no_loading_effect ){
          dispatch(hideSpinner())
        }

        let {
          dates = {},
          partners = [],
          multi_values = {},
          chart_30days = []
        } = response.data

        let totals = partners.reduce(
          (
            {
              total_to_resolve_today,
              total_to_approve_today,
              total_to_ship_today
            },
            next
          ) => {
            return {
                total_to_resolve_today : total_to_resolve_today + next.today.to_resolve,
                total_to_approve_today : total_to_approve_today + next.today.to_approve,
                total_to_ship_today : total_to_ship_today + next.today.to_ship,
            }
          },
          {
            total_to_resolve_today : 0,
            total_to_approve_today : 0,
            total_to_ship_today    : 0
          }
        )

        setBadgeCounterValues({
          '/edi/documents/orders-to-resolve' : totals.total_to_resolve_today,
          '/edi/documents/orders-to-approve' : totals.total_to_approve_today,
          '/edi/documents/orders-to-ship'    : totals.total_to_ship_today
        })(dispatch, getState)

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            dates,
            partners,
            multi_values,
            chart_30days
          }
        })
      })
      .catch( error => {
        if( !no_loading_effect ){
          dispatch(hideSpinner())
        }
      })
  }
}

export function setSelectedDraftRows( ship_id ){
  return function(dispatch, getState) {

    let { selectedDraftRows } = getState().edi
    selectedDraftRows = { ...selectedDraftRows }
    if( selectedDraftRows.hasOwnProperty(ship_id) ) delete selectedDraftRows[ship_id]
    else selectedDraftRows[ship_id] = true
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { selectedDraftRows }
    })

  }
}

export function setSelectedDraftRowsAll( selectAll = true ){
  return function(dispatch, getState) {

    let selectedDraftRowsNew = {}

    if( selectAll ) {
      getState().edi.shipments.forEach( aDraft => {
        selectedDraftRowsNew[aDraft.ship_id] = true
      } )
    }

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { selectedDraftRows : selectedDraftRowsNew }
    })

  }
}


export function addShipment( order_number, account_number ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "add-shipment",
          data : {
            order_number,
            account_number
          }
        }
      })
      .then( response => {


        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            addedShipmentData : response.data,
            is_new_shipment_added : true,
            is_form_values_dirty : false
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


export function updateShipment(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "update-shipment",
          data : getState().edi.addedShipmentData
        }
      }).then(
        response => {
          showToaster({
            isSuccess : true,
            message : "Successfully saved draft."
          })( dispatch, getState )

          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              is_form_values_dirty : false
            }
          })

          dispatch(hideSpinner())

          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())

          return Promise.reject()
      })
  }
}


export function readShipments(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "read-shipments"
        }
      }).then(
        response => {

          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              shipments : response.data,
              is_shipments_fetched : true
            }
          })

          dispatch(hideSpinner())

          return Promise.resolve()
      }).catch(
        error => {

          dispatch(hideSpinner())

          return Promise.reject()
      })
  }
}


export function deleteShipments(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "delete-shipment",
          data : {
            ship_ids : Object.keys( getState().edi.selectedDraftRows ).map( id => +id )
          }
        }
      }).then(
        response => {

          showToaster({
            isSuccess : true,
            message : "Successfully deleted selected drafts."
          })( dispatch, getState )

          dispatch(hideSpinner())

          readShipments()( dispatch, getState )

          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())

          return Promise.reject()
      })
  }
}

export function readShipment( ship_id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "read-shipment",
          data : {
            ship_id
          }
        }
      })
      .then( response => {


        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            addedShipmentData : response.data,
            is_new_shipment_added : true
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

const processContainerItems = ( ediState, containerItems ) => {
  let {
    addedShipmentData,
    is_edit_container,
    edit_container_index
  } = ediState

  let {
    cartons
  } = addedShipmentData

  let containerBeingEdited = {}

  if( is_edit_container ){
    containerBeingEdited = cartons[ edit_container_index ]
    cartons = [
      ...cartons.slice( 0, edit_container_index ),
      ...cartons.slice( 1 + +edit_container_index ),
    ]
  }

  containerItems = containerItems.map(
    ( item, index ) => {

      let {
        line_num,
        bl_qty,
        quantity_in_carton
      } = item

      bl_qty = +bl_qty

      cartons.forEach( ({ items = [] }) => {

        items.forEach(
          ({ line_num : line_num2, quantity_in_carton }) => {
            if( line_num2 === line_num && +quantity_in_carton > 0 ){
              bl_qty -= +quantity_in_carton
            }
          }
        )

      } )

      let items_match = (
        containerBeingEdited.items && containerBeingEdited.items.length
      )
      ? containerBeingEdited.items.filter(
        ({ line_num : line_num2 }, index) => {
          return line_num === line_num2
        }
      )
      : []

      let serial_numbers = []

      if( items_match.length ){
        quantity_in_carton = items_match[ 0 ][ 'quantity_in_carton' ]
        serial_numbers = items_match[ 0 ][ 'serial_numbers' ]
      }

      return {
        ...item,
        bl_qty,
        quantity_in_carton,
        serial_numbers
      }
    }
  )

  return containerItems
  // set containerItems
}


export function readContainerItems( is_edit_container, items = [] ){
  return function( dispatch, getState ) {

    let ediState = getState().edi

    let {
      location,
      order_number,
      account_number
    } = ediState.addedShipmentData

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "read-order-items",
          data : {
            order_number,
            account_number,
            location
          }
        }
      })
      .then( response => {

        let containerItems = response.data

        containerItems = processContainerItems( ediState, containerItems )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            containerItems
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


export function uploadDocument( file, ship_id, type ){
  return function(dispatch, getState) {

    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    formData.append("file", file)

    let abortRequest
    let onRequestEnd
    let makePercentageChanges
    let showServerIsProcessingMessage

    if( navigator.userAgent.includes('Firefox') ){
      xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable){
          var percentComplete = (event.loaded / event.total) * 100
          percentComplete = Math.floor( percentComplete )
          makePercentageChanges( percentComplete )
        } else {
          console.warn("Unable to compute progress information since the total size is unknown")
        }
      }, false)
    }

    xhr.open('POST', `${config.host}/api/upload`, true)
    let token = getAuthData().api_token

    xhr.setRequestHeader('X-Access-Token', token );
    xhr.setRequestHeader('X-Upload-Params', JSON.stringify({
      func : 'shipment_upload', ship_id, type
    }) );

    let divToChangeWidth        = global.$('#uploading-bar')
    let spanToChangePercentage  = global.$('#uploading-percentage')

    makePercentageChanges = ( percentage ) => {
      if( divToChangeWidth && spanToChangePercentage ){
        divToChangeWidth.css({ width : `${percentage}%` })
        spanToChangePercentage.html(`${percentage}%`)
        if( percentage === 100 ){
          showServerIsProcessingMessage()
        }
      }else{
        console.error(
          'Updating percentage values failed because ' +
          'elements with the ids #uploading-bar and #uploading-percentage ' +
          'doesn t exist.'
        )
      }
    }

    showServerIsProcessingMessage = () => {
      global.$('#upload-file-dialog').addClass('server-processing')
    }

    abortRequest = () => {
      xhr.abort()
      onRequestEnd()
    }

    onRequestEnd = () => {
      global.$('#dismiss-uploading').off('click', abortRequest )
      global.$('#upload-file-dialog').css({ display : 'none' })
      global.$('#upload-file-dialog').removeClass('server-processing')
      divToChangeWidth.css({ width : '0' })
      spanToChangePercentage.html('0%')
    }

    if ( !navigator.userAgent.includes('Firefox') ) {
      xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable){
          var percentComplete = (event.loaded / event.total) * 100
          percentComplete = Math.floor( percentComplete )
          makePercentageChanges( percentComplete )
        } else {
          console.warn("Unable to compute progress information since the total size is unknown")
        }
      }, false)
    }
    // for Firefox:

    // xhr.addEventListener('progress', function(e) {
    //     console.log('progress');
    // }, false)

    global.$('#dismiss-uploading').on('click', abortRequest )

    xhr.onload = function () {

      if (this.status >= 200 && this.status < 300) {
        let response = JSON.parse(xhr.response)
        let { url } = response.data || {}
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            addedShipmentData : {
              ...getState().edi.addedShipmentData,
              [ type === 'PL' ? 'pl_url' : 'ci_url' ] : url
            },
          }
        })
        onRequestEnd()
      }else{
        onRequestEnd()
        let response = JSON.parse(xhr.response)
        let { error_message } = response
        showToaster({
          isSuccess : false,
          message : error_message
        })( dispatch, getState )
      }
    }
    xhr.onerror = function () {

      let { error_message } = xhr.response
      showToaster({
        isSuccess : false,
        message : error_message
      })( dispatch, getState )
      onRequestEnd()
    }

    global.$('#upload-file-dialog').css({ display : 'block' })
    xhr.send(formData)
  }
}

export function deleteShipmentDocument(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let {
      addedShipmentData,
      delete_pl_ci_type : type
    } = getState().edi

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "delete-shipdoc",
          data : {
            ship_id : addedShipmentData.ship_id,
            type
          }
        }
      })
      .then( response => {

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            addedShipmentData : {
              ...addedShipmentData,
              [ type === "PL" ? 'pl_url' : 'ci_url' ] : ''
            }
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


export function placeShipment( allow_partial = false, allow_missing_document = false ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'ext-shipments',
          action : "place-shipment",
          allow_partial,
          allow_missing_document,
          data : getState().edi.addedShipmentData
        }
      }).then(
        response => {

          dispatch(hideSpinner())

          let {
            is_shipping_document_missing,
            is_partial
          } = response.data

          if( !( allow_missing_document || !is_shipping_document_missing ) ){
            return Promise.resolve({ is_shipping_document_missing, is_partial })
          } else if ( !( allow_partial || !is_partial ) ){
            return Promise.resolve({ is_shipping_document_missing, is_partial })
          } else {
            showToaster({
              isSuccess : true,
              message : "Shipment placed successfully."
            })( dispatch, getState )

            dispatch({ type : INITIALIZE_REDUX_STATE })

            return Promise.resolve()
          }

      }).catch(
        error => {

          dispatch(hideSpinner())

          return Promise.reject()
      })
  }
}
