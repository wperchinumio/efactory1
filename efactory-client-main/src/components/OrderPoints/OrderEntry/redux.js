import Fetcher                    from '../../../util/Request'
import { formatNumber }           from '../../_Helpers/FormatNumber'
import { defineAction }           from 'redux-define'
import {
  showToaster, hideSpinner, showSpinner
}                                 from '../../_Helpers/actions'
import moment                     from 'moment'
import { setRootReduxStateProp as grid_setRootReduxStateProp }    from '../../Grid/redux'

const namespace = 'ORDERPOINTS-refactored'
const subActions = ['SUCCESS', 'ERROR']

/* ############### ACTION CONSTANTS ############### */
const
  /* for async actions , includes subactions */
  SAVE_ORDER_AS_DRAFT = defineAction( 'SAVE_ORDER_AS_DRAFT', subActions, namespace ),
  SAVE_ENTRY = defineAction( 'SAVE_ENTRY', subActions, namespace ),
  CLONE_TEMPLATE = defineAction( 'CLONE_TEMPLATE', subActions, namespace ),
  READ_ORDER_FROM_FAST = defineAction( 'READ_ORDER_FROM_FAST', subActions, namespace ),
  READ_ORDER_FROM_DRAFT = defineAction( 'READ_ORDER_FROM_DRAFT', subActions, namespace ),
  CANCEL_ORDER = defineAction( 'CANCEL_ORDER', subActions, namespace ),
  PUT_ON_HOLD = defineAction( 'PUT_ON_HOLD', subActions, namespace ),
  TRANSFER_ORDER = defineAction( 'TRANSFER_ORDER', subActions, namespace ),
  UPDATE_ENTRY = defineAction( 'UPDATE_ENTRY', subActions, namespace ),
  FETCH_INVENTORY_ITEMS = defineAction( 'FETCH_INVENTORY_ITEMS', subActions, namespace ),
  VALIDATE_ADDRESS = defineAction( 'VALIDATE_ADDRESS', subActions, namespace ),
  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE = `${namespace}/SET_ROOT_REDUX_STATE`,
  STORE_TEMPLATE_TO_CLONE = `${namespace}/STORE_TEMPLATE_TO_CLONE`,
  UPDATE_TEMPLATE = `${namespace}/UPDATE_TEMPLATE`,
  INITIALIZE_STATE = `${namespace}/INITIALIZE_STATE`,
  UPDATE_ORDER_DETAILS = `${namespace}/UPDATE_ORDER_DETAILS`,
  REMOVE_SELECTED_ITEM_ROWS = `${namespace}/REMOVE_SELECTED_ITEM_ROWS`

// reducer
const initialState = {
  orderHeader : {
    order_status: 1, // Normal
    ordered_date: moment().format('YYYY-MM-DD')
  },
  shippingAddress : {
    country : 'US',
  },
  shipping : {
    shipping_carrier : '',
    shipping_service : '',
    packing_list_type : '',
    freight_account : '',
    consignee_number : '',
    terms : '',
    international_code : '',
    fob : '',
    payment_type : '',
  },
  billingAddress : {},
  amounts : {
    order_subtotal: 0,
    shipping_handling: 0,
    balance_due_us: 0,
    amount_paid: 0,
    total_due: 0,
    net_due_currency: 0,
    international_handling: 0,
    international_declared_value: 0,
    sales_tax: 0,
    insurance: 0
  },
  extraFields : {},
  extraFieldsLabels : {},

  modalValues : {
    shipping : {},
    billingAddress : {},
    amounts : {},
    extraFields : {}
  },
  //

  loading : false,
  loadingPlaceOrder : false,


  //new
  order_detail : [],
  order_detailHashTable : {},// of order_detail
  // available entryPageTypes: 'create_new', 'edit_order', 'edit_template', 'edit_draft'
  entryPageType : 'create_new',
  selectedItemRows : [],  //new Set(),
  dirty : false,
  activateAddress : false,
  addressForAccept : {
    correct_address : {}
  },

  inventoryItems : [],
  itemPagination : 1,
  itemPageSize : 100,
  item_filter : '',
  maxLineNumber : 0,
  findItemValue : '',
  aTemplateToClone : {},
  cloneTemplate : {},
  omit_zero_qty : true,
  nextLocationAccount : '',
  warehouses : '',
  newOrderInitialized : false,
  custom_field_2_item_numbers : []
}

export default function reducer( state = initialState, action ) {
  switch (action.type) {
    case SAVE_ORDER_AS_DRAFT:
      return {
        ...state,
        loading : true,
        error: null
      }
    case SAVE_ORDER_AS_DRAFT.SUCCESS:
      return {
        ...state,
        loading : false,
        entryPageType : 'edit_draft',
        dirty : false
      }
    case SAVE_ORDER_AS_DRAFT.ERROR:
      return {
        ...state,
        loading : false,
        error: action.data
      }
    case SAVE_ENTRY:
      return {
        ...state,
        error: null,
        loadingPlaceOrder : true
      }
    case SAVE_ENTRY.SUCCESS:
      return {
        ...state,
        entryPageType : 'create_new',
        loadingPlaceOrder : false,
        dirty : false
      }
    case SAVE_ENTRY.ERROR:
      return {
        ...state,
        loadingPlaceOrder : false,
        error: action.data
      }
    case UPDATE_ENTRY:
      return {
        ...state,
        updateOrderFailed : false,
        loading : true,
        error: null
      }
    case UPDATE_ENTRY.SUCCESS:
      return {
        ...state,
        updateOrderFailed : false,
        order_detail : action.data.order_detail,
        loading : false,
        dirty : false
      }
    case UPDATE_ENTRY.ERROR:
      return {
        ...state,
        updateOrderFailed : true,
        loading : false,
        error: action.data
      }
    case CANCEL_ORDER:
      return {
        ...state,
        error: null
      }
    case CANCEL_ORDER.SUCCESS:
      return {
        ...state,
      }
    case CANCEL_ORDER.ERROR:
      return {
        ...state,
        error: action.data
      }
    case PUT_ON_HOLD:
      return {
        ...state,
        error: null
      }
    case PUT_ON_HOLD.ERROR:
      return {
        ...state,
        putOnHoldFailed : true,
        error: action.data
      }
      case TRANSFER_ORDER:
      return {
        ...state,
        transferOrderFailed : false,
        error: null
      }
      case TRANSFER_ORDER.ERROR:
      return {
        ...state,
        transferOrderFailed : true,
        error: action.data
      }
    case READ_ORDER_FROM_FAST:
      return {
        ...state,
        error: null
      }
    case READ_ORDER_FROM_FAST.SUCCESS:

      return {
        ...state,
        ...action.data
      }
    case READ_ORDER_FROM_FAST.ERROR:
      return {
        ...state,
        error: action.data
      }
    case CLONE_TEMPLATE:
      return {
        ...state,
        error: null
      }
    case CLONE_TEMPLATE.SUCCESS:
      return {
        ...state,
        ...action.data
      }
    case CLONE_TEMPLATE.ERROR:
      return {
        ...state,
        error: action.data
      }
    case STORE_TEMPLATE_TO_CLONE:
      return {
        ...state,
        aTemplateToClone: action.data
      }
    case UPDATE_TEMPLATE:
      return {
        ...state,
        ...action.data
      }
    case READ_ORDER_FROM_DRAFT:
      return {
        ...state,
        error: null
      }
    case READ_ORDER_FROM_DRAFT.SUCCESS:

      return {
        ...state,
        ...action.data
      }
    case READ_ORDER_FROM_DRAFT.ERROR:
      return {
        ...state,
        error: action.data
      }
    case FETCH_INVENTORY_ITEMS:
      return {
        ...state,
        error: null
      }
    case FETCH_INVENTORY_ITEMS.SUCCESS:
      return {
        ...state,
        ...action.data
      }
    case FETCH_INVENTORY_ITEMS.ERROR:
      return {
        ...state,
        error: action.data
      }
    case VALIDATE_ADDRESS:
      return {
        ...state,
        activateAddress : true,
      }
    case VALIDATE_ADDRESS.SUCCESS:
      return {
        ...state,
        activateAddress : false,
        addressForAccept : action.data
      }
    case VALIDATE_ADDRESS.ERROR:
      return {
        ...state,
        activateAddress : false
      }
    case REMOVE_SELECTED_ITEM_ROWS:
    case UPDATE_ORDER_DETAILS:
      let { entryPageType } = state
      let stateToChange = {}
      let newOrderDetailArray = action.data.order_detail
      if( entryPageType !== 'edit_order' && newOrderDetailArray.length ){

        let order_subtotal = newOrderDetailArray.reduce( (p,n) => { // A

          return p + +n.quantity * +n.price
        }, 0 )
        let {
          amount_paid = 0,
          shipping_handling = 0, // B
          sales_tax = 0, // C
          international_handling = 0 // D
        } = state.amounts
        let total_due = +order_subtotal + +shipping_handling + +sales_tax + +international_handling
        let net_due_currency = +total_due - +amount_paid
        stateToChange = {
          amounts : {
            ...state.amounts,
            order_subtotal,
            total_due,
            net_due_currency
          }
        }
      }

      return {
        ...state,
        ...action.data,
        dirty : true,
        ...stateToChange
      }

    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_STATE:
      return {
        ...initialState
      }
    default:
      return state
  }
}

var handleReadOrderResponse;

export function generateOrderNumber(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action: "generate_number"
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let { orderHeader } = getState().orderPoints.entry

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            orderHeader : {
              ...orderHeader,
              order_number : response.data.number
            },
            dirty     : true
          }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())
      })
  }
}

export const newOrderInitialized = ( init = true ) => ( dispatch, getState ) => {
  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : { newOrderInitialized : init }
  })
}

export const approveLocationAccountChange = () => ( dispatch, getState ) => {
  let { orderHeader, nextLocationAccount } = getState().orderPoints.entry

  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : {
      order_detail : [],
      orderHeader : {
        ...orderHeader,
        accountNumberLocation : nextLocationAccount
      },
      dirty : true
    }
  })
}

export const clearBrowseItemsFilters = () => ( dispatch, getState ) => {
  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : {
      omit_zero_qty : true,
      item_filter : '',
      warehouses : ''
    }
  })
  return Promise.resolve()
}

export const updateOrderDetails = (
  order_detail = []
) => ( dispatch, getState ) => {
  dispatch({
    type : UPDATE_ORDER_DETAILS,
    data : { order_detail }
  })
  return Promise.resolve()
}

export const createHashTableFromOrderDetail = (
  order_detail = [],
  custom_field_2_item_numbers
) => ( dispatch, getState ) => {
  let { entry } = getState().orderPoints
  let { maxLineNumber } = entry
  if( entry.entryPageType === 'edit_order' && maxLineNumber === 0  ){ // if maxLineNumber not set
    order_detail.forEach( 
      v => { 
        if (v.is_kit_component) return
        maxLineNumber = (+v.line_number < 1000 && +v.line_number > maxLineNumber) ? +v.line_number : +maxLineNumber 
      } 
    )
  }
  let order_detailHashTable = {}
  order_detail.forEach( (o_d, index) => {
    let hashKey = `${o_d.item_number}${o_d.is_kit_component ? '__is_kit' : ''}${ o_d.voided ? '___voided' : '' }`
    if( !o_d.voided && custom_field_2_item_numbers.includes( o_d.item_number ) ){
      hashKey = `${o_d.item_number}__cf2item__${index}`
    }
    order_detailHashTable[ hashKey ] = o_d
  } )

  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : { order_detailHashTable, maxLineNumber }
  })
}

export const updateInventoryItems = (
  inventoryItems = {}
) => ( dispatch, getState ) => {

  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : { inventoryItems }
  })

}

export function processItems(){
  return function(dispatch, getState) {

    let { entry } = getState().orderPoints
    let {
      order_detail,
      order_detailHashTable,
      inventoryItems,
      entryPageType
    } = entry
    order_detailHashTable = { ...order_detailHashTable }
    let is_pagetype_editorder = entryPageType === 'edit_order'

    /*let real_line_num = 0;
    if (order_detail.length) {
      var l_idx = order_detail.length - 1;
      for (;l_idx >= 0; l_idx--) {
        if (order_detail[ l_idx ]['line_number'] < 1000) {
          real_line_num = order_detail[ l_idx ]['line_number'];
          break;
        }
      }
    }
    */

    let real_line_num = order_detail.length?
      Math.max.apply(Math, order_detail.filter(e => e.line_number < 1001).map(function(o) { return o.line_number; })):
      0;
    
    let maxLineNumber = real_line_num

    Object.values( inventoryItems ).forEach( ( item, index ) => {

      let is_quantity_not_zero = +item.quantity !== 0
      let item_in_hash_table = order_detailHashTable[item.item_number]
      let itemExists = item_in_hash_table ? true : false

      if( is_quantity_not_zero && itemExists ){  // update existing item

          //order_detailHashTable[item.item_number]['quantity'] = item.quantity
          order_detailHashTable = {
            ...order_detailHashTable,
            [ item.item_number ] : {
              ...order_detailHashTable[item.item_number],
              quantity : item.quantity,
              price : item.price? item.price: 0,
              voided : false
            }
          }

      } else if( is_quantity_not_zero && !itemExists ) { // add a new item
          let newItem = {
            detail_id : 0,
            line_number : ++maxLineNumber,
            item_number : item.item_number,
            description : item.description,
            quantity : item.quantity,
            price : item.price? item.price: 0,
            do_not_ship_before : moment().format('YYYY-MM-DD'), //today
            ship_by : moment().add(1,'days').format('YYYY-MM-DD'), // tomorrow
            custom_field1 : "",
            custom_field2 : "",
            custom_field3 : "",
            custom_field4 : "",
            custom_field5 : "",
            comments : "",
            voided : false
          }
          let new_key = item.item_number

          order_detailHashTable = {
            ...order_detailHashTable,
            [ new_key ] : {
              ...newItem
            }
          }

      } else if ( !is_quantity_not_zero && itemExists ){ // delete an existing item

        if (is_pagetype_editorder && order_detailHashTable[item.item_number]['detail_id'] !== 0 ){ // void the item in the order

          order_detailHashTable = {
            ...order_detailHashTable,
            [ item.item_number ] : {
              ...order_detailHashTable[item.item_number],
              quantity : 0,
              voided : true
            }
          }

          // order_detailHashTable[item.item_number]['voided'] = true

        } else{ // delete the item from cart in draft

          delete order_detailHashTable[item.item_number]

        }

      }

    })

    let newOrderDetail = [], index = 0

    for(let key in order_detailHashTable){

      if (order_detailHashTable.hasOwnProperty(key)) {
        let itemData = order_detailHashTable[key]

        if( !is_pagetype_editorder ){ // change the line_number only when draft
          itemData['line_number'] = ++index
        }

        newOrderDetail.push( itemData )
      }
    }

    newOrderDetail = newOrderDetail.sort((a, b) => {
      let aLine = a.line_number > 1000 ? a.line_number / 1000 : a.line_number;
      let bLine = b.line_number > 1000 ? b.line_number / 1000 : b.line_number;
      return aLine - bLine;
    });

    dispatch({
      type : UPDATE_ORDER_DETAILS,
      data : { order_detail : newOrderDetail }
    })

    return Promise.resolve(newOrderDetail)

  }
}

export function setFindItemValue( filterValue ){
  return function(dispatch, getState) {
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { findItemValue : filterValue }
    })
  }
}

export function setItemFilterValue( filterValue, omit_zero_qty_received ){
  return function(dispatch, getState) {
    if( omit_zero_qty_received === undefined ){
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : { item_filter : filterValue }
      })
    }
    return fetchInventoryItems({ omit_zero_qty_received, filterValue })( dispatch, getState )
  }
}

export function setItemPagination( pageNumber ){
  return function(dispatch, getState) {
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { itemPagination : pageNumber }
    })
    fetchInventoryItems({ withSetPagination : true })( dispatch, getState )
  }
}

export function setItemsModalFilterField( fieldObj = {} ){
  return function(dispatch, getState) {
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { ...fieldObj }
    })
    fetchInventoryItems()( dispatch, getState )
  }
}

export function determineCustomField2Items(order_detail){
  return function( dispatch, getState ){
    let item_numbers = []
    let custom_field_2_item_numbers = []
    order_detail.forEach( o_d => {
      let { item_number, voided, custom_field2 } = o_d

      if( voided || custom_field_2_item_numbers.includes( item_number ) ) return

      if( custom_field2 || item_numbers.includes( item_number ) ){
        custom_field_2_item_numbers.push( item_number )
      }
    } )
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        custom_field_2_item_numbers
      }
    })

    return custom_field_2_item_numbers
  }
}

export function fetchInventoryItems({
  withSetPagination = false,
  omit_zero_qty_received,
  filterValue
} = {}){
  return function(dispatch, getState) {

    dispatch({ type : FETCH_INVENTORY_ITEMS })

    let state = getState()
    let { itemPagination, itemPageSize, item_filter, order_detail } = state.orderPoints.entry

    if( !withSetPagination ){
      itemPagination = 1
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : { itemPagination }
      })
    }
    let custom_field_2_item_numbers = determineCustomField2Items(order_detail)( dispatch, getState )
    createHashTableFromOrderDetail( order_detail, custom_field_2_item_numbers )( dispatch, getState )

    let {
      warehouses,
      omit_zero_qty
    } = state.orderPoints.entry

    if( omit_zero_qty_received !== undefined ){
      omit_zero_qty = omit_zero_qty_received
    }

    let and = []
    if( warehouses ){
      warehouses = warehouses.split('-')
      let inv_region = warehouses[0]
      let inv_type = warehouses[1]
      and = [
        {
          field: "inv_type",
          oper: "=",
          value: inv_type
        },
        {
          field: "inv_region",
          oper: "=",
          value: inv_region
        }
      ]
    }
    and.push({
      field: "omit_zero_qty",
      oper: "=",
      value: omit_zero_qty
    })

    if( item_filter || filterValue ){
      and.push({
        field: "name",
        oper: "=",
        value: filterValue ? filterValue : item_filter
      })
    }
    const fetcher = new Fetcher()

    return fetcher.fetch('/api/inventory', {
      method : 'post',
      data : {
        resource : "inventory-status-for-cart",
        action :"read",
        page_size : itemPageSize,
        page_num : itemPagination ,
        sort: [{
          item_number : "asc" // temp
        }],
        filter: { and }
      }
    })
    .then(( response ) => {
      let { order_detailHashTable } = getState().orderPoints.entry
      let modalItems = {}
      response.data.rows.forEach( p => {
        // insert received values [ description, item_number, qty_net ]
        let item = { ...p, quantity : '', price : '' }
        let item_number = p.item_number
        let itemInHashTable = order_detailHashTable[ item_number ]
        // check if added items has, so that we will take some fields values
        if( itemInHashTable ){

          let { quantity, price } = itemInHashTable
          let exist_in_cart = custom_field_2_item_numbers.includes( item_number )
          if( exist_in_cart ){
            item.exist_in_cart = true
          }else{
            item.quantity = quantity
            item.price = formatNumber(price)
          }
        }
        modalItems[ item_number ] = item
      } )

      dispatch({
        type : FETCH_INVENTORY_ITEMS.SUCCESS,
        data : {
          inventoryItems: modalItems,
          totalNumberOfItems : response.data.total
        }
      })
      return { isSuccess : true, inventoryItems : response.data.rows }
    })
    .catch(( error ) => {

      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return { isSuccess : false, message : error['error_message'] }
    })

  }
}

export function setDirty( dirty ){
  return function(dispatch, getState) {

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { dirty }
    })

  }
}

export function removeSelectedItems(){
  return function(dispatch, getState) {

    let { entry } = getState().orderPoints
    let { order_detail, entryPageType, selectedItemRows } = entry
    let orderDetailCopy = [ ...order_detail ]
    orderDetailCopy = orderDetailCopy.map( i => ({ ...i }) )

    let selectedItemRowsCopy = [ ...selectedItemRows ] // new Set( selectedItemRows.values() )

    if( selectedItemRows.length ){

      orderDetailCopy = orderDetailCopy.filter( item => {

        let itemId = [item.item_number, item.line_number].join("-")

        let indexAt = selectedItemRowsCopy.findIndex( item_ => item_ === itemId )
        selectedItemRowsCopy = [
          ...selectedItemRowsCopy.slice( 0, indexAt ),
          ...selectedItemRowsCopy.slice( indexAt + 1 )
        ]

        if( entryPageType === 'edit_order' && selectedItemRows.includes(itemId) && item.detail_id !== 0 ) {
          item.voided = true
          item.quantity = item.quantity_org || item.quantity  // set the original quantity back when the item in the order is voided
          return item

        } else if( selectedItemRows.includes(itemId) ){

          return false

        } else {

          return item

        }

      })

    }
    
    // Re-assign the line_number once a line is removed from the cart for new line only (when detail_id is 0)
    let max_line = orderDetailCopy.length?
      Math.max.apply(Math, orderDetailCopy.filter(e => e.line_number < 1001 && e.detail_id > 0).map(function(o) { return o.line_number; })):
      0;
    max_line++;

    if( orderDetailCopy.length < order_detail.length ){
      orderDetailCopy = orderDetailCopy.map( ( o_d, index ) => ({
        ...o_d,
        line_number : o_d.detail_id > 0? o_d.line_number: max_line++
      }) )
    }
    dispatch({
      type : REMOVE_SELECTED_ITEM_ROWS,
      data : {
        selectedItemRows : selectedItemRowsCopy,
        order_detail : orderDetailCopy
      }
    })

    return Promise.resolve()
  }
}

export function setSelectedItemsRows( item ){
  return function(dispatch, getState) {
    if( !item ){
      return console.error(`setSelectedItemsRows expected a valid item_number, received <${item.split("-")[0]}>`)
    }

    let { selectedItemRows } = getState().orderPoints.entry
    selectedItemRows = [ ...selectedItemRows ]
    let indexAt = selectedItemRows.findIndex( item_ => item_ === item )

    if( indexAt !== -1  ){
      selectedItemRows = [
        ...selectedItemRows.slice( 0, indexAt ),
        ...selectedItemRows.slice( indexAt + 1 )
      ]
    }else{
      selectedItemRows = [ ...selectedItemRows, item ]
    }
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { selectedItemRows }
    })

  }
}

export function setSelectedItemsRowsAll( selectAll = true ){
  return function(dispatch, getState) {

    let selectedItemRows = []

    if( selectAll ) {
      getState().orderPoints.entry.order_detail.forEach( anItem => {
        if( !anItem.voided && !anItem.is_kit_component ){
          let { item_number, line_number } = anItem
          selectedItemRows = [ ...selectedItemRows, `${item_number}-${line_number}` ]
        }
      } )
    }

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { selectedItemRows }
    })

  }
}

export function updateOrderDetail( itemIndex, propsToChange = {} ){
  return function(dispatch, getState) {

    let state = getState()
    let { order_detail } =  state.orderPoints.entry
    order_detail = [ ...order_detail ]
    order_detail = [
      ...order_detail.slice(0,itemIndex),
      {
        ...order_detail[itemIndex],
        ...propsToChange
      },
      ...order_detail.slice(+itemIndex + 1),
    ]

    dispatch({
      type : UPDATE_ORDER_DETAILS,
      data : {
        order_detail
      }
    })

  }
}

export const saveOrderAsDraft = () => (dispatch, getState) => {

    dispatch({ type : SAVE_ORDER_AS_DRAFT })

    let {
      orderHeader,
      shippingAddress : shipping_address,
      billingAddress  : billing_address,
      order_detail,
      amounts,
      extraFields,
      shipping
    } = getState().orderPoints.entry

    let {
      order_number = '',
      accountNumberLocation = '',
      order_status = 1,
      ordered_date = moment().format('YYYY-MM-DD'),
      po_number = '',
      customer_number = '',
      shipping_instructions = '',
      packing_list_comments = '',
      acknowledgement_email = ''
    } = orderHeader

    let account_number = '' , location = ''

    if(accountNumberLocation.trim() !== ''){
      account_number = accountNumberLocation.replace(/\.\w+/,'')
      location = accountNumberLocation.replace(/\d+\./,'')
    }

    let {
      shipping_carrier = '',
      shipping_service = '',
      freight_account = '',
      consignee_number = '',
      packing_list_type = 0,
      terms = '',
      fob = '',
      payment_type = '',
      international_code = 0,
    } = shipping

    international_code = international_code === null ? 0 : international_code

    let {
      order_subtotal,
      shipping_handling,
      balance_due_us,
      amount_paid,
      total_due,
      net_due_currency,
      international_handling,
      international_declared_value,
      sales_tax,
      insurance
    } = amounts

    let {
      custom_field1,
      custom_field2,
      custom_field3,
      custom_field4,
      custom_field5
    } = extraFields

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action :"create",
          version : 2,
          to_draft : true,
          data : {
            order_header: {
              // first form aka order
              order_number,
              account_number,
              location,
              order_status,
              payment_type,
              ordered_date,
              po_number,
              customer_number,
              acknowledgement_email,
              shipping_instructions,
              packing_list_comments,

              // shipping address
              shipping_address,
              // billing address
              billing_address,

              // shipping sidebar values
              shipping_carrier,
              shipping_service,
              freight_account,
              consignee_number,
              packing_list_type,
              terms,
              fob,
              international_code,

              // sidebar amounts values
              order_subtotal,
              shipping_handling,
              balance_due_us,
              amount_paid,
              total_due,
              net_due_currency,
              international_handling,
              international_declared_value,
              sales_tax,
              insurance,

              // sidebar extra fields values
              custom_field1,
              custom_field2,
              custom_field3,
              custom_field4,
              custom_field5

            },
            order_detail
          }
        }
      })
      .then(( response ) => {
        dispatch({
          type : SAVE_ORDER_AS_DRAFT.SUCCESS,
          data : response.data
        })

        handleReadOrderResponse({
          response,
          fromDraft : true,
          order_id : response.data.draft_order.order_header.order_id,
          dispatch,
          isDraftOrder : true
        })

        grid_setRootReduxStateProp( 'badgeCounterValues', {
          ...getState().grid.badgeCounterValues,
          '/orderpoints/drafts' : response.data.total_drafts
        } )( dispatch, getState )


        showToaster({
          isSuccess : true,
          message : 'Saved draft successfully!'
        })( dispatch, getState )

        return { isSuccess : true, draft_id : response.data.order_id }
      })
      .catch(( error ) => {
        let { error_message = 'An error occured' } = error
        dispatch({
          type : SAVE_ORDER_AS_DRAFT.ERROR,
          data : error_message
        })
        return { isSuccess : false, message : error['error_message'] }
      })

}


export const saveEntry = () => (dispatch, getState) => {

    dispatch(showSpinner())

    dispatch({ type : SAVE_ENTRY })
    let {
      orderHeader,
      shippingAddress : shipping_address,
      order_detail,
      shipping,
      billingAddress : billing_address,
      amounts,
      extraFields,
      activeEditedDraftId = 0,
    } = getState().orderPoints.entry

    let {
      order_id = activeEditedDraftId,
      order_number = '',
      accountNumberLocation = '',
      order_status = 1,
      ordered_date = moment().format('YYYY-MM-DD'),
      po_number = '',
      customer_number = '',
      shipping_instructions = '',
      packing_list_comments = '',
      acknowledgement_email = ''
    } = orderHeader

    let account_number = '' , location = ''

    if(accountNumberLocation.trim() !== ''){
      account_number = accountNumberLocation.replace(/\.\w+/,'')
      location = accountNumberLocation.replace(/\d+\./,'')
    }

    let {
      shipping_carrier = '',
      shipping_service = '',
      freight_account = '',
      consignee_number = '',
      packing_list_type = 0,
      terms = '',
      fob = '',
      payment_type = '',
      international_code = 0
    } = shipping
    international_code = international_code === null ? 0 : international_code

    let {
      order_subtotal,
      shipping_handling,
      balance_due_us,
      amount_paid,
      total_due,
      net_due_currency,
      international_handling,
      international_declared_value,
      sales_tax,
      insurance
    } = amounts

    let {
      custom_field1,
      custom_field2,
      custom_field3,
      custom_field4,
      custom_field5
    } = extraFields
    /* amounts sidebar form values ends */

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action :"create",
          to_draft : false,
          data : {
            order_header: {
              // first form aka order
              order_id,
              order_number,
              account_number,
              location,
              order_status,
              payment_type,
              ordered_date,
              po_number,
              customer_number,
              acknowledgement_email,
              shipping_instructions,
              packing_list_comments,

              // shipping address
              shipping_address,
              // billing address
              billing_address,

              // shipping sidebar values
              shipping_carrier,
              shipping_service,
              freight_account,
              consignee_number,
              packing_list_type,
              terms,
              fob,
              international_code,

              // sidebar amounts values
              order_subtotal,
              shipping_handling,
              balance_due_us,
              amount_paid,
              total_due,
              net_due_currency,
              international_handling,
              international_declared_value,
              sales_tax,
              insurance,

              // sidebar extra fields values
              custom_field1,
              custom_field2,
              custom_field3,
              custom_field4,
              custom_field5

            },
            order_detail
          }
        }
      })
      .then(( response ) => {
        grid_setRootReduxStateProp( 'badgeCounterValues', {
          ...getState().grid.badgeCounterValues,
          '/orderpoints/drafts' : response.data.total_drafts
        } )( dispatch, getState )
        dispatch({
          type : SAVE_ENTRY.SUCCESS,
          data : response.data
        })
        showToaster({
          isSuccess : true,
          message : 'Saved entry successfully!'
        })( dispatch, getState )
        dispatch(hideSpinner())
        return { isSuccess : true, order_number: response.data.order_number }
      })
      .catch(( error ) => {
        let { error_message = 'An error occured' } = error
        dispatch({
          type : SAVE_ENTRY.ERROR,
          data : error_message
        })
        dispatch(hideSpinner())
        return { isSuccess : false, message : error_message }
      })

}
/**
 * initializes redux state for Entry
 */
export const initializeEntryReduxState = () => ( dispatch, getState ) => {
  dispatch({ type : INITIALIZE_STATE })
}

export function setSidebarBillingAddressValues( values = {} ){
  return function(dispatch, getState) {

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { sidebarBillingAddressValues : values }
    })

  }
}
export function setSidebarAmountsValues( values = {} ){
  return function(dispatch, getState) {

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { sidebarAmountsValues : values }
    })

  }
}
export function setSidebarExtraFieldsLabels( values = {} ){
  return function(dispatch, getState) {

    let initial_values = {
        header_cf_1 : 'Custom Field 1',
        header_cf_2 : 'Custom Field 2',
        header_cf_3 : 'Custom Field 3',
        header_cf_4 : 'Custom Field 4',
        header_cf_5 : 'Custom Field 5',
        detail_cf_1 : 'Custom Field 1',
        detail_cf_2 : 'Custom Field 2',
        detail_cf_5 : 'Custom Field 5'
    }
    let newValues = {}

    Object.keys( values ).forEach( valueKey => {
      newValues[valueKey] = values[valueKey] ? values[valueKey] : initial_values[valueKey]
    } )

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { extraFieldsLabels : newValues }
    })

  }
}

export function storeTemplateToClone(aTemplate) {
  return function(dispatch, getState){
    dispatch({ type: STORE_TEMPLATE_TO_CLONE, data: aTemplate})
  }
}

export function updateTemplate(){
  return function(dispatch, getState){
    dispatch({
      type: UPDATE_TEMPLATE,
      data: {
        entryPageType : 'edit_template'
      }
    })
  }
}

export function cloneTemplateToDraft(){
  return function(dispatch, getState) {

    let { aTemplateToClone } = getState().orderPoints.entry
    let { order_id } = aTemplateToClone

    dispatch({ type: CLONE_TEMPLATE })

    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action:'clone_template',
          order_id
        }
      })
      .then(( response ) => {
        // todo
        dispatch({
          type: CLONE_TEMPLATE.SUCCESS,
          data: {
            cloneTemplateToDraft: true
          }
        })
        grid_setRootReduxStateProp( 'badgeCounterValues', {
          ...getState().grid.badgeCounterValues,
          '/orderpoints/drafts' : response.data.total_drafts
        } )( dispatch, getState )
        handleReadOrderResponse({
          response,
          fromDraft : true,
          order_id : response.data.draft_order.order_header.order_id,
          dispatch,
          isDraftOrder : true
        })
        return { isSuccess: true }
      })
      .catch(( error ) => {
        dispatch({
          type: CLONE_TEMPLATE.ERROR,
          data: error['error_message']
        })
        return { isSuccess : false, message: error['error_message'] }
      })
  }
}
handleReadOrderResponse = ({
  response,
  fromDraft,
  order_id,
  dispatch,
  isDraftOrder = false
}) => {

  let {
    order_number,
    account_number,
    location,
    order_status,
    ordered_date,
    po_number,
    customer_number,
    acknowledgement_email,
    shipping_instructions,
    packing_list_comments
  } = isDraftOrder ? response.data.draft_order.order_header : response.data.order_header

  order_status = fromDraft ?
    order_status :
    !( +order_status === 0 || +order_status === 1 || +order_status === 2 ) ? 1 : order_status

  let orderHeader = {
    order_number,
    order_status,
    ordered_date,
    po_number,
    customer_number,
    acknowledgement_email,
    shipping_instructions,
    packing_list_comments
  }
  if( account_number && location ){
    orderHeader.accountNumberLocation = `${account_number}.${location}`
  }else{
    orderHeader.accountNumberLocation = ''
  }

  let { shipping_address : shippingAddress } = isDraftOrder ? response.data.draft_order.order_header : response.data.order_header

  let {
    shipping_carrier,
    shipping_service,
    freight_account,
    consignee_number,
    packing_list_type,
    terms,
    fob,
    payment_type,
    international_code
  } = isDraftOrder ? response.data.draft_order.order_header : response.data.order_header
  let shipping = {
    shipping_carrier,
    shipping_service,
    freight_account,
    consignee_number,
    packing_list_type,
    terms,
    fob,
    payment_type,
    international_code
  }

  let { billing_address : billingAddress } = isDraftOrder ? response.data.draft_order.order_header : response.data.order_header

  let {
    order_subtotal,
    shipping_handling,
    balance_due_us,
    amount_paid,
    total_due,
    net_due_currency,
    international_handling,
    international_declared_value,
    sales_tax,
    insurance,
  } = isDraftOrder ? response.data.draft_order.order_header : response.data.order_header

  let amounts = {
    order_subtotal,
    shipping_handling,
    balance_due_us,
    amount_paid,
    total_due,
    net_due_currency,
    international_handling,
    international_declared_value,
    sales_tax,
    insurance,
  }

  let {
    custom_field1,
    custom_field2,
    custom_field3,
    custom_field4,
    custom_field5
  } = isDraftOrder ? response.data.draft_order.order_header : response.data.order_header

  let extraFields = {
    custom_field1,
    custom_field2,
    custom_field3,
    custom_field4,
    custom_field5
  }

  let { order_detail } = isDraftOrder ? response.data.draft_order : response.data

  order_detail = order_detail.map( item => {
    item.quantity_org = item.quantity // will be used when the item in the order is voided to set it to its original quantity
    return item
  })

  dispatch({
    type : fromDraft ? READ_ORDER_FROM_DRAFT.SUCCESS : READ_ORDER_FROM_FAST.SUCCESS,
    data : {
      orderHeader,
      shippingAddress,
      order_detail,
      shipping,
      billingAddress,
      amounts,
      extraFields,
      entryPageType : fromDraft ? 'edit_draft' : 'edit_order',
      activeEditedOrderId : !fromDraft ? order_id : null,
      activeEditedDraftId : fromDraft ? order_id : null
    }
  })
  return { isSuccess : true }
}

export function readOrderFrom({ order_id, location, fromDraft = false }){
  return function(dispatch, getState) {
    dispatch(showSpinner())
    dispatch({ type : fromDraft ? READ_ORDER_FROM_DRAFT : READ_ORDER_FROM_FAST })
    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action:'read',
          order_id,
          location,
          from_draft : fromDraft
        }
      })
      .then(( response ) => {
        dispatch(hideSpinner())
        handleReadOrderResponse({
          response,
          fromDraft,
          order_id,
          dispatch
        })
        return { isSuccess : true } //furkan
      })
      .catch(( error ) => {
        dispatch(hideSpinner())
        dispatch({
          type : fromDraft ? READ_ORDER_FROM_DRAFT.ERROR : READ_ORDER_FROM_FAST.ERROR,
          data : error['error_message']
        })
        return { isSuccess : false, message : error['error_message'] }
      })

  }
}

export function cloneOrder({ order_number, account_number }){
  return function(dispatch, getState) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action:'clone_order',
          account_number,
          order_number
        }
      })
      .then(( response ) => {
        dispatch(hideSpinner())
        grid_setRootReduxStateProp( 'badgeCounterValues', {
          ...getState().grid.badgeCounterValues,
          '/orderpoints/drafts' : response.data.total_drafts
        } )( dispatch, getState )
        handleReadOrderResponse({
          response,
          fromDraft : true,
          order_id : response.data.draft_order.order_header.order_id,
          dispatch,
          isDraftOrder : true
        })
        return { isSuccess : true }
      })
      .catch(( error ) => {
        dispatch( hideSpinner() )
        let { error_message = 'An error occured.' } = error || {}
        return { isSuccess : false, message : error_message }
      })

  }
}

export const cancelOrder = ({ order_id = '', location = '' }) => ( dispatch, getState ) => {

  dispatch({ type : CANCEL_ORDER })

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/orderpoints', {
      method : 'post',
      data : {
        action :"cancel_order",
        location,
        order_id
      }
    })
    .then(( response ) => {
      dispatch({
        type : CANCEL_ORDER.SUCCESS,
        data : response.data
      })
      showToaster({
        isSuccess : true,
        message : 'Order canceled successfully!'
      })( dispatch, getState )
      return { isSuccess : true }
    })
    .catch( error => {

      let { error_message = 'An error occurred' } = error || {}

      dispatch({
        type : CANCEL_ORDER.ERROR,
        data : error_message
      })

      return { isSuccess : false, message : error_message }
    })
}

export const putOnHold = ({
  order_id = '', location = '', reason = '', on = true
}) => ( dispatch, getState ) => {

  dispatch({ type : PUT_ON_HOLD })

  const fetcher = new Fetcher()

  let data = {
    action : on ? 'on_hold' : 'off_hold',
    location,
    order_id
  }

  if( on ) data.reason = reason

  return fetcher
    .fetch('/api/orderpoints', {
      method : 'post',
      data
    })
    .then( response => {

      showToaster({
        isSuccess : true,
        message : `Order put ${ on ? 'on' : 'off' } hold successfully!`
      })( dispatch, getState )

      return { isSuccess : true }

    })
    .catch( error => {

      let { error_message = 'An error occured' } = error || {}

      dispatch({
        type : PUT_ON_HOLD.ERROR,
        data : error_message
      })
      return { isSuccess : false, message : error_message }
    })
}

export const transferOrder = ({
  order_id = '', source_warehouse = '', destination_warehouse = ''
}) => ( dispatch, getState ) => {

  dispatch({ type : TRANSFER_ORDER })

  const fetcher = new Fetcher()

  let data = {
    action : 'transfer-order',
    order_id,
    source_warehouse,
    destination_warehouse
  }

  dispatch(showSpinner())

  return fetcher
    .fetch('/api/orderpoints', {
      method : 'post',
      data
    })
    .then( response => {

      showToaster({
        isSuccess : true,
        message : `Order transferred successfully!`
      })( dispatch, getState )

      dispatch(hideSpinner())

      return { isSuccess : true }

    })
    .catch( error => {

      let { error_message = 'An error occured' } = error || {}

      dispatch({
        type : TRANSFER_ORDER.ERROR,
        data : error_message
      })

      dispatch(hideSpinner())
      return { isSuccess : false, message : error_message }
    })
}

export const updateEntry = ({ fromDraft = false }) => ( dispatch, getState ) => {

  dispatch({ type : UPDATE_ENTRY })

  let {
    activeEditedOrderId,
    activeEditedDraftId,
    order_detail,
    billingAddress : billing_address,
    shippingAddress : shipping_address,
    shipping,
    amounts,
    extraFields,
    orderHeader
  } = getState().orderPoints.entry

  orderHeader = { ...orderHeader }

  let credentials = {}

  if( !fromDraft ){
    credentials.order_id = activeEditedOrderId
  }else{
    credentials.order_id = activeEditedDraftId
  }

  let { international_code, packing_list_type } = shipping

  shipping.international_code = isNaN(international_code) ? 0 : international_code
  shipping.packing_list_type = isNaN(packing_list_type) ? 0 : packing_list_type

  let account_number = '' , location = ''
  let { accountNumberLocation } = orderHeader
  if(accountNumberLocation.trim() !== ''){
    account_number = accountNumberLocation.replace(/\.\w+/,'')
    location = accountNumberLocation.replace(/\d+\./,'')
  }
  delete orderHeader.accountNumberLocation

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/orderpoints', {
      method : 'post',
      data : {
        action : 'update',
        from_draft : fromDraft,
        data : {
          order_header : {
            ...credentials,
            ...orderHeader,
            account_number,
            location,
            shipping_address,
            billing_address,
            ...shipping,
            ...amounts,
            ...extraFields
          },
          order_detail
        }
      }
    })
    .then(( response ) => {

      dispatch({
        type : UPDATE_ENTRY.SUCCESS,
        data : response.data
      })
      showToaster({
        isSuccess : true,
        message : 'Updated entry successfully!'
      })( dispatch, getState )
      return { isSuccess : true }
    })
    .catch(( error ) => {

      let { error_message = 'An error occured' } = error || {}

      dispatch({
        type : UPDATE_ENTRY.ERROR,
        data : error_message
      })
      return { isSuccess : false, message : error_message }
    })
}

export function activateAddress(){
  return function(dispatch, getState){

    dispatch({
      type : VALIDATE_ADDRESS
    })

    let {
      address1 = '',
      address2 = '',
      city = '',
      state_province = '',
      postal_code = ''
    } = getState().orderPoints.entry.shippingAddress

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'validate_address',
          data : {
            address1,
            address2,
            city,
            state_province,
            postal_code
          }
        }
      })
      .then( response => {
        dispatch({
          type : VALIDATE_ADDRESS.SUCCESS,
          data : response.data
        })
        if( !response.data.warnings && !response.data.errors ){
          showToaster({
            isSuccess : true,
            message : 'Validated address successfully!'
          })( dispatch, getState )
        }
        return { isSuccess : true, data : response.data }
      })
      .catch( error => {
        dispatch({
          type : VALIDATE_ADDRESS.ERROR,
          data : error['error_message']
        })
        return { isSuccess : false }
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
    dispatch({ type: SET_ROOT_REDUX_STATE, data : { [ field ] : value } })
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
