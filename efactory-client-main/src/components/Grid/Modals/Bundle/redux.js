import Fetcher from '../../../../util/Request'
import { showSpinner, hideSpinner } from '../../../_Helpers/actions'
import { defineAction } from 'redux-define'

const
  namespace = 'BUNDLE',
  subActions = ['SUCCESS', 'ERROR'],
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,
  FETCH_INVENTORY_ITEMS = defineAction( 'FETCH_INVENTORY_ITEMS', subActions, namespace ),

  /* initial state for this part of the redux state */
  initialState = {
    omit_zero_qty       : false,
    show_bundle_only    : false,
    main_warehouse      : '',
    query_warehouse     : '',
    bundle_item_id      : 0,
    bundle_item_number  : '',
    bundle_upc          : '',
    bundle_type         : '',
    account_number      : '',
    bundle_pl           : '1',
    bundle_description  : '',
    bundle_detail       : {},
    inventoryItems      : {},
    itemPageSize        : 100,
    itemPagination      : 1,
    totalNumberOfItems  : 0,
    item_filter         : '',
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
    default:
      return state
  }
}

export function getBundleData(edit, bundle_item_id, warehouse) {
  let w = /*edit? account_wh:*/ warehouse;
  let warehouses = w.split('.')

  let main_warehouse = edit? warehouse.replace(/\s/g, ''): warehouses[1] + "-" + warehouses[0]
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {...initialState}
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action      : 'get_bundle_data',
          bundle_item_id,
          warehouse:   main_warehouse.split('-')[0]
        }
      })
      .then( response => {
        dispatch(hideSpinner())
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            ...initialState,
            bundle_item_id      : response.data.bundle_item_id,
            bundle_item_number  : response.data.bundle_item_number,
            bundle_upc          : response.data.bundle_upc,
            bundle_type         : response.data.bundle_type,
            bundle_pl           : response.data.bundle_pl,
            bundle_description  : response.data.bundle_description,
            bundle_detail       : response.data.bundle_detail,
            account_number      : response.data.account_number,
            main_warehouse: main_warehouse,
            query_warehouse: main_warehouse,
            show_bundle_only: (edit && Object.keys(response.data.bundle_detail).length !== 0)? true: false
          }
        })

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
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

export const saveBundle = () => ( dispatch, getState ) => {
  let state = getState()
  let { bundle_detail,
        bundle_item_number,
        bundle_item_id,
        bundle_upc,
        bundle_type,
        account_number,
        bundle_pl,
        bundle_description,
        main_warehouse } = state.bundle

  dispatch(showSpinner())

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/inventory', {
      method : 'post',
      data : {
        action      : 'save_bundle_data',
        data: {
          bundle_detail,
          bundle_item_number,
          bundle_item_id,
          bundle_upc,
          bundle_type,
          account_number,
          bundle_pl,
          bundle_description,
          warehouse: main_warehouse.split('-')[0]
        }
      }
    })
    .then( response => {
      dispatch(hideSpinner())

      return Promise.resolve()

    })
    .catch( error => {
      dispatch(hideSpinner())
      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return Promise.reject()
    })

}

export const expireBundle = (bundle_item_id, inv_type) => ( dispatch, getState ) => {
  dispatch(showSpinner())

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/inventory', {
      method : 'post',
      data : {
        action      : 'expire_bundle',
        data: {
          bundle_item_id,
          warehouse: inv_type.split('-')[0].trim()
        }
      }
    })
    .then( response => {
      dispatch(hideSpinner())

      return Promise.resolve()

    })
    .catch( error => {
      dispatch(hideSpinner())
      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return Promise.reject()
    })

}

export const postASNEdit = (dcl_po, dcl_po_line, order_type, new_date) =>  ( dispatch, getState ) => {
  dispatch(showSpinner())

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/inventory', {
      method : 'post',
      data : {
        action      : 'edit_asn_line',
        data: {
          dcl_po,
          dcl_po_line,
          order_type,
          new_date
        }
      }
    })
    .then( response => {
      dispatch(hideSpinner())

      return Promise.resolve()

    })
    .catch( error => {
      dispatch(hideSpinner())
      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return Promise.reject()
    })

}

export const cancelASNLine = (dcl_po, dcl_po_line, order_type) => ( dispatch, getState ) => {
  dispatch(showSpinner())

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/inventory', {
      method : 'post',
      data : {
        action      : 'cancel_asn_line',
        data: {
          dcl_po,
          dcl_po_line,
          order_type
        }
      }
    })
    .then( response => {
      dispatch(hideSpinner())

      return Promise.resolve()

    })
    .catch( error => {
      dispatch(hideSpinner())
      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return Promise.reject()
    })

}

export const closeShortASNLine = (dcl_po, dcl_po_line, order_type) => ( dispatch, getState ) => {
  dispatch(showSpinner())

  const fetcher = new Fetcher()

  return fetcher
    .fetch('/api/inventory', {
      method : 'post',
      data : {
        action      : 'close_short_asn_line',
        data: {
          dcl_po,
          dcl_po_line,
          order_type
        }
      }
    })
    .then( response => {
      dispatch(hideSpinner())

      return Promise.resolve()

    })
    .catch( error => {
      dispatch(hideSpinner())
      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return Promise.reject()
    })

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

export function setBundleItemValue( field, value ){
  return function(dispatch) {
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { [field] : value }
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

export function setItemsModalFilterField( fieldObj = {} ){
  return function(dispatch, getState) {
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { ...fieldObj }
    })
    fetchInventoryItems()( dispatch, getState )
  }
}

export const updateInventoryItems = (
  inventoryItems = {}
) => ( dispatch, getState ) => {

  let state = getState()
  let { bundle_detail } = state.bundle

  var filtered_bundle_detail = Object.keys(inventoryItems).filter( sku => inventoryItems[sku].quantity > 0).reduce((obj, key) => {
    obj[key] = inventoryItems[key];
    return obj;
  }, {});

  Object.keys(bundle_detail).forEach(key => {
      if (!inventoryItems[key]) {
        // Add the missing 
        filtered_bundle_detail[key] = bundle_detail[key];
      }
  });

  // var bundle_detail = inventoryItems.filter(i => i.quantity > 0);
  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : { 
      inventoryItems,
      bundle_detail: filtered_bundle_detail
     }
  })

}

export function fetchInventoryItems({
  withSetPagination = false,
  filterValue
} = {}){
  return function(dispatch, getState) {

    dispatch(showSpinner())
    dispatch({ type : FETCH_INVENTORY_ITEMS })

    let state = getState()
    let { itemPagination, itemPageSize, item_filter, bundle_detail } = state.bundle

    if( !withSetPagination ){
      itemPagination = 1
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : { itemPagination }
      })
    }
    //let custom_field_2_item_numbers = determineCustomField2Items(order_detail)( dispatch, getState )
    //createHashTableFromOrderDetail( order_detail, custom_field_2_item_numbers )( dispatch, getState )

    let {
      query_warehouse,
      omit_zero_qty,
      show_bundle_only,
      bundle_item_id,
      account_number
    } = state.bundle

/*    if( omit_zero_qty_received !== undefined ){
      omit_zero_qty = omit_zero_qty_received
    }
*/
    let and = []
    if( query_warehouse ){
      query_warehouse = query_warehouse.split('-')
      let inv_region = query_warehouse[0]
      let inv_type = query_warehouse[1]
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
    and.push({
      field: "omit_bundles",
      oper: "=",
      value: true
    })
    and.push({
      field: "show_bundle_only",
      oper: "=",
      value: show_bundle_only
    })
    and.push({
      field: "bundle_item_id",
      oper: "=",
      value: bundle_item_id
    })
    and.push({
      field: "account_number",
      oper: "=",
      value: account_number
    })
    

    if(!show_bundle_only && (item_filter || filterValue )){
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
      dispatch(hideSpinner())
      let modalItems = {}
      response.data.rows.forEach( p => {
        let item = { ...p, quantity : '', line_num : '', item_pl : 1 }
        let item_number = p.item_number

        if (bundle_detail[item_number]) {
          item.quantity = bundle_detail[item_number].quantity;
          item.line_num = bundle_detail[item_number].line_num;
          item.item_pl = bundle_detail[item_number].item_pl;
        }
        if (!show_bundle_only || (show_bundle_only && bundle_detail[item_number] )) {
          modalItems[ item_number ] = item
        }
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
      dispatch(hideSpinner())

      dispatch({
        type : FETCH_INVENTORY_ITEMS.ERROR,
        data : error['error_message']
      })
      return { isSuccess : false, message : error['error_message'] }
    })

  }
}