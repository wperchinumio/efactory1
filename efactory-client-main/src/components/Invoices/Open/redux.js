import Fetcher from '../../../util/Request'
import { defineAction } from 'redux-define'
import moment from 'moment'
import { showToaster, showSpinner, hideSpinner } from '../../_Helpers/actions'
import downloadSource from '../../_Helpers/DownloadSource'

const
  namespace = 'invoice-open',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  LIST_INVOICES = defineAction( 'LIST_INVOICES', subActions, namespace ),
  PAY_SELECTED_INVOICES = defineAction( 'PAY_SELECTED_INVOICES', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  EXAMPLE_SYNC = defineAction( 'EXAMPLE_SYNC', namespace ),
  INITIALIZE_PAY_MODAL = defineAction( 'INITIALIZE_PAY_MODAL', namespace ),
  INITIALIZE_REDUX_STATE = defineAction( 'INITIALIZE_REDUX_STATE', namespace ),
  SET_ROOT_REDUX_STATE = defineAction( 'SET_ROOT_REDUX_STATE', namespace ),

  /* initial state for this part of the redux state */
  initialState = {
    activeTab : 'check',
    checkedRows : {},
    filter : { and : [
      {
        field: "only_open",
        oper: "=",
        value: true
      }
    ] },
    invoices : [],
    loading : false,
    page_num : 1,
    page_size : 100,
    paying : false,
    payment: {
      cc : {
        type: 'cc',
        first_name : '',
        last_name : '',
        address : '',
        postal_code : '', // only if "type" = "check"
        cc_number : '', // only if "type" = "cc"
        exp_month : '01', // only if "type" = "cc"
        exp_year : moment().format('YY'), // only if "type" = "cc"
        csc : '', // only if "type" = "cc" (Card Security Code)
        comments : ''
      },
      check : {
        type: 'check',
        first_name : '',
        last_name : '',
        address : '',
        postal_code : '', // only if "type" = "check"
        account_type : '', // or "business", only if "type" = "check"
        account_number : '', // only if "type" = "check"
        routing_number : '', // only if "type" = "check"
        company: '', // only if "type" = "check"
        comments: ''
      }
    },
    searchFilter : '',
    sort : [{
      invoice_date : 'asc'
    }],
    total : 0,
    total_gross_amount : '',
    total_open_amount : '',
    itemDetail : {},
    itemDetailBeingFetched : false,
    fetchItemDetailData : {
      item_number : '',
      warehouse : '',
      account_wh: '',
      weeks :false
    },
    rmaDetail : {},
    rmaDetailBeingFetched : false,
    fetchRmaDetailData : {
      rma_number : '',
      weeks : '',
      account_number : ''
    },
    orderDetail : {},
    tpDetail : {},
    navigationHidden : false,
    activeEditItemTab : 'shipping',
    editItemData      : {
      shipping : {},
      export   : {},
      dg       : {},
      edi      : [],
      updateParams : {
        account_wh  : '10501.FR',
        item_number : '1001-001-DEMO',
        key_item    : false,
        desc1       : ''
      }
    }
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {
    case EXAMPLE_SYNC:
    case LIST_INVOICES.SUCCESS:
    case PAY_SELECTED_INVOICES.SUCCESS:
    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      return {
        ...initialState
      }
    case INITIALIZE_PAY_MODAL:
      return {
        ...state,
        payment : {
          ...initialState.payment
        },
        activeTab : 'check'
      }
    default:
      return state
  }
}


/************ ACTIONS ************/
export function initializePayModal(){
  return function(dispatch, getState) {
    dispatch({ type : INITIALIZE_PAY_MODAL })
  }
}

export function downloadDocument( id ){
  return function(dispatch, getState) {

    dispatch(showSpinner())

    downloadSource(
      `/api/documents/${id}`,
      undefined,
      {
        onSuccessAction : () => {
          dispatch(hideSpinner())
        },
        onErrorAction : () =>  {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : false,
            message : 'File not found!'
          })( dispatch, getState )
        }
      },
      true
    )
  }
}

export function paySelectedInvoices(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({ type : SET_ROOT_REDUX_STATE, data : { paying : true } })

    let {
      activeTab,
      payment,
      checkedRows
    } = getState().invoices.open
    payment = payment[ activeTab ]

    let invoices = []
    Object.keys(checkedRows).forEach( id => {
      let amount_to_pay = checkedRows[id]
      if( activeTab === 'cc' ){
        amount_to_pay = ( amount_to_pay * (1 + 3.25 / 100) ).toFixed(2)
      }
      invoices.push({ id,  amount : amount_to_pay })
    } )

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/invoicing', {
        method : 'post',
        data : {
          action:'pay',
          data : {
            payment,
            invoices
          }
        }
      })
      .then( response => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Payment placed successfuly'
        })( dispatch, getState )
        initializeReduxState()(dispatch,getState)
        listInvoices()(dispatch,getState)
        return Promise.resolve(true)
      })
      .catch( error => {
        dispatch(hideSpinner())
        dispatch({ type : SET_ROOT_REDUX_STATE, data : { paying : false } })
        return Promise.resolve(false)
      })
  }
}

export function listInvoices( changeLoadingState = false ){
  return function( dispatch, getState ){

    if( changeLoadingState ){
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : { loading : true }
      })
    }

    let {
      filter = { and : [] },
      page_num,
      searchFilter = '',
      sort
    } = getState().invoices.open
    searchFilter = searchFilter.trim()
    filter = { ...filter }
    if( searchFilter.length ){
      filter.and = [
        ...filter.and,
        {
          field: 'filter',
          oper : '=',
          value : searchFilter
        }
      ]
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/invoicing', {
        method : 'post',
        data : {
          action:'list',
          page_size : 100,
          page_num,
          sort,
          filter
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        if( changeLoadingState ){
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
        }
        
        let {
          total,
          total_gross_amount,
          total_open_amount,
          rows : invoices
        } = response.data

        dispatch({
          type : LIST_INVOICES.SUCCESS,
          data : { total, total_gross_amount, total_open_amount, invoices }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

        if( changeLoadingState ){
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
        }

      })
  }
}

/*
  this action creator updates a root property,
  rather than creating seperate action creators
  simple changes might be done via this method
*/
export function setRootReduxStateProp({ field, value }){
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
  }
}

export function fetchOrderDetail( order_num = '', account_num = '', noCache = false){
  return function(dispatch, getState) {

    if( !order_num ) return console.error(`fetchOrderDetail expected order_num to be sent as param.`)
    
    let { orderDetail } = getState().invoices.open
    
    if( !noCache && account_num && Array.isArray( orderDetail ) && orderDetail.length > 1 ){
      orderDetail = orderDetail.filter( o => o.account_number === account_num )[ 0 ]
      if( orderDetail.order_number === order_num ){
        return dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { orderDetail }
        })
      }
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { orderDetail : { ...getState().invoices.open.orderDetail, noResponse : false } }
    })

    fetcher.fetch('/api/fulfillment', {
      method : 'post',
      data : {
        action : 'read',
        resource : 'order',
        page_num : 1,
        page_size : 1,
        sort: [{
          order_date : 'desc'
        }],
        filter : {
          and : [{ order_num }, { account_num }],
          or : []
        },
        fields : ['*'],
        policy_code : getState().analytics.selected_customer
      }
    })
    .then( response => {
      dispatch(hideSpinner())
      let stateToChange = {}
      let { rows = [] } = response.data
      if( rows.length === 1 ) {
        stateToChange.orderDetail = rows[0]
      }else if( rows.length === 0 ){
        stateToChange.orderDetail = { noResponse: true }
      }else{
        stateToChange.orderDetail = rows
      }
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : stateToChange
      })
      return Promise.resolve()
    })
    .catch( error => {
      
      dispatch(hideSpinner())
      return Promise.resolve()
    } )
  }
}

// fetchData keys must be on of [location, weeks, item_number]
export function fetchItemDetail( fetchData = {} ){
  return function( dispatch, getState ){
    
    let { fetchItemDetailData, itemDetail } = getState().invoices.open
    
    fetchItemDetailData = { ...fetchItemDetailData }
    
    Object.keys( fetchData ).forEach( key => {
      fetchItemDetailData[ key ] = fetchData[ key ]
    } )

    if( Object.keys( fetchItemDetailData ).length !== 4 ){
      return console.error(
        `fetchItemDetail expected 4 keys for fetchItemDetailData `+
        `instead received <${Object.keys( fetchItemDetailData ).join()}> `+
        `as keys.`
      )
    }

    dispatch({ 
      type : SET_ROOT_REDUX_STATE, 
      data : { fetchItemDetailData, itemDetail : { ...itemDetail, noResponse : false } } 
    })

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action: 'item_detail',
          ...fetchItemDetailData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            itemDetail : response.data.detail.item_number ? 
            response.data : 
            { noResponse : true } 
          }
        })
        return Promise.resolve()
      })
      .catch( error => {

        dispatch(hideSpinner())
        return Promise.resolve()
      })

  }
}


// fetchData keys must be on of [account_number, weeks, rma_number]
export function fetchRmaDetail( fetchData = {} ){
  return function( dispatch, getState ){
    
    let { fetchRmaDetailData, rmaDetail } = getState().invoices.open
    
    fetchRmaDetailData = { ...fetchRmaDetailData }
    
    Object.keys( fetchData ).forEach( key => {
      fetchRmaDetailData[ key ] = fetchData[ key ]
    } )

    if( Object.keys( fetchRmaDetailData ).length !== 3 ){
      return console.error(
        `fetchRmaDetail expected 4 keys for fetchRmaDetailData `+
        `instead received <${Object.keys( fetchRmaDetailData ).join()}> `+
        `as keys.`
      )
    }

    dispatch({ 
      type : SET_ROOT_REDUX_STATE, 
      data : { 
        fetchRmaDetailData, 
        rmaDetail : { ...rmaDetail, noResponse : false }
      } 
    })

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action: 'read',
          resource: 'rma',
          ...fetchRmaDetailData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            rmaDetail : response.data.rma_header && response.data.rma_header.rma_number 
                        ? response.data 
                        : { noResponse : true },
            loadedRmaDetail : true
          }
        })
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            rmaDetail : { noResponse : true },
            loadedRmaDetail : true
          }
        })

        let { error_message = 'An error occurred' } = error || {}

        if( error_message === 'RMA not found' ) {
          return Promise.resolve()  
        }
        return Promise.resolve()
      })

  }
}

export function expireRma( rma_id ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action: 'expire',
          rma_id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({ isSuccess : true, message : 'Expired RMA successfully!' })( dispatch, getState )
        fetchRmaDetail()( dispatch, getState )
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())
        return Promise.resolve()
      })

  }
}

export function resetAcknowledged( rma_id ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action: 'reset_ack',
          rma_id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({ isSuccess : true, message : 'Resetted \'Acknowledged\' successfully!' })( dispatch, getState )
        fetchRmaDetail()( dispatch, getState )
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())
        return Promise.resolve()
      })

  }
}

export function cancelRma( rma_id ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action: 'cancel',
          rma_id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({ isSuccess : true, message : 'Canceled RMA successfully!' })( dispatch, getState )
        fetchRmaDetail()( dispatch, getState )
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())
        return Promise.resolve()
      })

  }
}

export function resendEmail( rma_id, email ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action: 'issue_rma_email',
          rma_id,
          email
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({ isSuccess : true, message : 'Sent email successfully!' })( dispatch, getState )
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())
        return Promise.resolve()
      })

  }
}

export function resendEmail_ship_confirmation({
  order_number, 
  account_number,
  ship_to_email,
  bill_to_email
}){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action: 'resend_ship_confirmation',
          order_number, 
          account_number,
          ship_to_email,
          bill_to_email
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({ 
          isSuccess : true, message : 'Sent email successfully!' 
        })( dispatch, getState )
        
        return Promise.resolve()
      })
      .catch( error => {
        
        dispatch(hideSpinner())
        
        return Promise.reject()
      })

  }
}

/*
editItemData      : {
  shipping : {},
  export   : {},
  dg       : {},
  edi      : [],
  updateParams : {
    //resource    : '',
    account_wh  : '10501.FR',//todo
    item_number : '1001-001-DEMO',
    key_item    : false,
    desc1       : ''
  }
}
*/

export function editCustomFields({
  rma_id,
  dataToUpdate = {}
}){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : "update_custom_fields",
          rma_id,
          data : {
            ...dataToUpdate
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({ 
          isSuccess : true, 
          message : 'Saved changes successfully!' 
        })( dispatch, getState )

        fetchRmaDetail()( dispatch, getState )
        
        return Promise.resolve({
          success : true
        })
      })
      .catch( error => {
        
        dispatch(hideSpinner())

        return Promise.resolve({
          success : false
        })
      })

  }
}

export function saveEditItemChanges( allWh ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    let { editItemData, itemDetail } = getState().invoices.open

    let {
      upc, weight, dimension, serial_no, serial_format, lot_format, lot_days
    } = editItemData.shipping

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action        : 'update',
          resource      : 'item',
          account_wh    : allWh ? '' : editItemData.updateParams.account_wh,
          item_number   : editItemData.updateParams.item_number,
          key_item      : editItemData.updateParams.key_item,
          data      : {
            shipping : {
              upc, weight, dimension, serial_no, serial_format, lot_format, lot_days
            },
            export : {
              ...editItemData.export
            },
            dg : {
              ...editItemData.dg
            },
            edi : [
              ...editItemData.edi
            ]
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            itemDetail : {  
              ...itemDetail,
              detail : {
                ...itemDetail.detail,
                cat3: response.data.key_item ? "KEY" : ""
              },
              shipping : response.data.shipping,
              export : response.data.export,
              dg : response.data.dg,
            }
          }
        })

        showToaster({ 
          isSuccess : true, 
          message : 'Saved changes successfully!' 
        })( dispatch, getState )

        return Promise.resolve({
          success : true
        })
      })
      .catch( error => {
        
        dispatch(hideSpinner())

        return Promise.resolve({
          success : false
        })
      })

  }
}

export function fetchTPDetail( tp_code ){
  return function( dispatch, getState ){

    if( !tp_code ) return console.error(`fetchTPDetail expected tp_code to be sent as param.`)

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        tpDetail : {}
      }
    })

    fetcher.fetch('/api/edi', {
      method : 'post',
      data : {
        resource : 'edi_tp_details',
        tp_code
      }
    })
    .then( response => {
      dispatch(hideSpinner())
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : { 
          tpDetail : { 
            ...response.data,
            noResponse : false 
          } 
        }
      })
      return Promise.resolve()
    })
    .catch( error => {
      
      dispatch(hideSpinner())
      return Promise.resolve()
    } )

  }
}