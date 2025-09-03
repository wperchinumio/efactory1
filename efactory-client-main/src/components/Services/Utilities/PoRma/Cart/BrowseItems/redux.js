import moment                 from 'moment'
import Fetcher                from '../../../../../../util/Request'
import { showSpinner,
         hideSpinner }        from '../../../../../_Helpers/actions'
import {
  setRootReduxStateProp_multiple as setRootReduxStatePropMultiple_PoRma
}                             from '../../redux'

const
  namespace = 'RMA/ENTRY/ITEMS',
  /************ CONSTANTS ************/
  SET_ROOT_REDUX_STATE = `${namespace}/SET_ROOT_REDUX_STATE`,
  /* initial state for this part of the redux state */
  initialState = {
    currentPagination : 1,
    items : [],
    searchFilter : '',
    totalItems : 0,
    omit_zero_qty : true,
    warehouse : '',
    hashMapOfCurrentCartItems : {}
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    default:
      return state

  }

}


/************ ACTIONS ************/

/*
  quantity > 0
    isInTheCart
      isAuth
        // item_in_cart serial empty ? add qty to this one
        // else add new item
        update both quantities if rma_type is SO, or only auth
        // update value to sum 
        // if not exist create and update qty to sum
      not
        update ship quantity
    not
      isAuth
        add to both if rma_type is SO, or only auth
      not
        add to ship with quantity

  not
    ///// remove below
    isInTheCart
      isAuth
        remove from both detail arrays if rma_type is so, or remove from auth only
        isOrderDetail === 0 ? voided = true : delete
      not
        remove from ship
        isOrderDetail === 0 ? voided = true : delete

*/

export function addItemsToCart(){
  return function( dispatch, getState ){

    let { poRma, inventory } = getState().services.utilities

    let { po_cart_items } = poRma
 
    let { items } = inventory
    
    let ts_base = ( new Date() ).getTime()

    items.forEach( ( item, index ) => {
      let { item_number, description, quantity } = item
      quantity = +quantity
      if( quantity > 0 ){
        po_cart_items = [ ...po_cart_items, {
          e1_line_number : null,
          line_number : null,
          auth_qty : 0,
          condition_code : 'C1', 
          item_number,
          item_description : description,
          qty_now : quantity,
          voided: false,
          received_qty : 0,
          received_date : moment().format('MM/DD/YYYY'),
          recv_sn : '',
          ts : ts_base + index
        } ]
      }
    } )

    setRootReduxStatePropMultiple_PoRma({
      po_cart_items
    })( dispatch, getState )

  }
}

/*
  this method updates an items field value

  being called when user updates a field on browse items modal

  index param is the index of the field
  field is the field name, ex 'quantity'
  value is value to set to field
*/
export function updateItemFieldValue({ index, value }){
  return function( dispatch, getState ){

    let { items } = getState().services.utilities.inventory
    index = +index
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { items : [
        ...items.slice( 0, index ),
        {
          ...items[index],
          quantity : value
        },
        ...items.slice( index + 1),
      ] }
    })
  }
}

export function fetchInventoryItems( skipHashMapping = true ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    let {
      currentPagination,
      omit_zero_qty,
      searchFilter,
      warehouse
    } = getState().services.utilities.inventory
    
    let and = []
    if( warehouse ){
      warehouse = warehouse.split('-')
      let inv_region = warehouse[0]
      let inv_type = warehouse[1]
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

    if( searchFilter ){
      and.push({
        field: "name",
        oper: "=",
        value: searchFilter
      })
    }
    
    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          resource : "inventory-status-for-cart",
          action :"read",
          page_size : 100, // @todo make this dynamic
          page_num : currentPagination, // @todo make this dynamic
          sort: [{
            item_number : "asc" // temp
          }],
          filter: { and }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let items = response.data.rows

        if( !skipHashMapping ){
          
          let { poRma } = getState().services.utilities

          let hashMapOfCurrentCartItems = Object.create(null)

          poRma.po_cart_items.forEach( (item,index) => {
            if( item.voided ) return
            hashMapOfCurrentCartItems[ item.item_number ] = { ...item, itemIndex : index}
          } )

          setRootReduxStateProp({
            field : 'hashMapOfCurrentCartItems',
            value : hashMapOfCurrentCartItems
          })( dispatch, getState )

          items = items.map( item => {
            item.quantity = 0
            if( hashMapOfCurrentCartItems[ item.item_number ] ){
              item.qty_now = hashMapOfCurrentCartItems[ item.item_number ][ 'qty_now' ]
              item.isInTheCart = true
            }
            return item
          } )
        }

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            items,
            totalItems : response.data.total
          }
        })
        // used in add item input field of cart
        return Promise.resolve({
          isSuccess : true,
          items : response.data.rows,
          totalItems : response.data.total
        })

      })
      .catch( error => {
        
        dispatch(hideSpinner())
        return Promise.resolve({
          isSuccess : false,
          items : [],
          totalItems : 0
        })
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
  }
}


export function initializeReduxState(){
  return function( dispatch, getState ){

    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { ...initialState }
    })
  }
}
