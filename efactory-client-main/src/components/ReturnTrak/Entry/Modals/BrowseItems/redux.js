//import moment                 from 'moment'
import Fetcher                from '../../../../../util/Request'
import { defineAction }       from 'redux-define'
import { showSpinner,
         hideSpinner }        from '../../../../_Helpers/actions'
import tableConfig            from '../../../Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'
import {
  setRootReduxStateProp as setRootReduxStatePropEntry
}                             from '../../redux'

const
  namespace = 'RMA/ENTRY/ITEMS',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  FETCH_INVENTORY_ITEMS = defineAction( 'FETCH_INVENTORY_ITEMS', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE = defineAction( 'SET_ROOT_REDUX_STATE', namespace ),
  UPDATE_ITEM_FIELD_VALUE = defineAction( 'UPDATE_ITEM_FIELD_VALUE', namespace ),

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

    case FETCH_INVENTORY_ITEMS.SUCCESS:
    case SET_ROOT_REDUX_STATE:
    case UPDATE_ITEM_FIELD_VALUE:
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

    let { entry, inventory } = getState().returnTrak
    let { activeCartButton, rma_detail, rmaHeader } = entry
    let { to_receive = [], to_ship = [] } = rma_detail
    let { rma_type } = rmaHeader
    let { items } = inventory
    let isToShipButtonBlue = tableConfig[ rma_type ][1][1] ? true : false
    items.forEach( item => {
      let quantity = +item.quantity
      let { item_number, description, price = '0.00' } = item
      price = (+price).toFixed(2)
      let unit_price = price
      if( quantity > 0 ){
        if( item.isInTheCart ){
          if( activeCartButton === 'auth' ){

            //let indexOfAuth = +hashMapOfCurrentCartItems[ item_number ][ 'itemIndex' ]
            let indexOfAuth = -1
            to_receive.some( ( item,index ) => {
              if( item.item_number === item_number && !item.serialnumber ){
                indexOfAuth = index
                return true
              }
              return false
            } )

            if( indexOfAuth === -1 ) return console.error('although to_receive button is blue, no item matched')
            
            to_receive = [
              ...to_receive.slice(0,indexOfAuth),
              {
                ...to_receive[indexOfAuth],
                quantity : +to_receive[ indexOfAuth ]['quantity'] + +quantity
              },
              ...to_receive.slice( indexOfAuth + 1 )
            ]

            if( isToShipButtonBlue ){
              // @todo create a hashmap for to_ship too
              let indexOfShip = -1
              to_ship.some( ( item,index ) => {
                if( item.item_number === item_number ){
                    indexOfShip = index
                    return true
                  }
                  return false
                } 
              )
              if( indexOfShip !== -1 ){
                to_ship = [
                  ...to_ship.slice(0,indexOfShip),
                  {
                    ...to_ship[indexOfShip],
                    quantity : +to_ship[ indexOfShip ]['quantity'] + +quantity
                  },
                  ...to_ship.slice( indexOfShip + 1 )
                ]
              }else{
                let lastShipItem = to_ship[ to_ship.length - 1 ]
                let maxLineNumber = lastShipItem ? +lastShipItem[ 'line_number' ] : 0
                to_ship = [ ...to_ship, {
                  detail_id: 0,  // or 0 if new line
                  line_number: maxLineNumber + 1,
                  item_number,
                  description,
                  quantity,
                  unit_price,
                  /*do_not_ship_before : moment().format('YYYY-MM-DD'), //today
                  ship_by : moment().add(1,'days').format('YYYY-MM-DD'), // tomorrow
                  comments: '',
                  custom_field1: '',
                  custom_field2: '',
                  custom_field5: '',*/
                  voided: false
                } ]
              }
            }
            // update both quantities if rma_type is SO, or only auth
          }else{
            // update ship quantity
            to_ship = to_ship.map( item => {
              if( item.item_number !== item_number ) return item
              item.unit_price = (+unit_price).toFixed(2)
              return {
                ...item,
                quantity
              }
            } )
          }
        }else{// item was not in the cart
          if( activeCartButton === 'auth' ){
            let lastAuthItem = to_receive[ to_receive.length - 1 ]
            let maxLineNumber = lastAuthItem ? +lastAuthItem[ 'line_number' ] : 0
            to_receive = [ ...to_receive, {
              detail_id: 0,  // or 0 if new line
              line_number: maxLineNumber + 1,
              item_number,
              description,
              quantity,
              serialnumber: '',
              voided: false
            } ]
            if( isToShipButtonBlue ){
              let indexOfShip = -1
              to_ship.some( ( item,index ) => {
                if( item.item_number === item_number ){
                    indexOfShip = index
                    return true
                  }
                  return false
                } 
              )
              if( indexOfShip !== -1 ){
                to_ship = [
                  ...to_ship.slice(0,indexOfShip),
                  {
                    ...to_ship[indexOfShip],
                    quantity : +to_ship[ indexOfShip ]['quantity'] + +quantity
                  },
                  ...to_ship.slice( indexOfShip + 1 )
                ]
              }else{
                let lastShipItem = to_ship[ to_ship.length - 1 ]
                let maxLineNumber = lastShipItem ? +lastShipItem[ 'line_number' ] : 0
                to_ship = [ ...to_ship, {
                  detail_id: 0,  // or 0 if new line
                  line_number: maxLineNumber + 1,
                  item_number,
                  description,
                  quantity,
                  unit_price,
                  /*do_not_ship_before : moment().format('YYYY-MM-DD'), //today
                  ship_by : moment().add(1,'days').format('YYYY-MM-DD'), // tomorrow
                  comments: '',
                  custom_field1: '',
                  custom_field2: '',
                  custom_field5: '',*/
                  voided: false
                } ]
              }
              
            }
            // add to both if rma_type is SO, or only auth
          }else{
            // add to ship with quantity
            let lastShipItem = to_ship[ to_ship.length - 1 ]
            let maxLineNumber = lastShipItem ? +lastShipItem[ 'line_number' ] : 0
            to_ship = [
              ...to_ship,
              {
                detail_id: 0,  // or 0 if new line
                line_number: maxLineNumber + 1,
                item_number,
                description,
                quantity,
                unit_price: (+unit_price).toFixed(2),
                /*do_not_ship_before : moment().format('YYYY-MM-DD'), //today
                ship_by : moment().add(1,'days').format('YYYY-MM-DD'), // tomorrow
                comments: '',
                custom_field1: '',
                custom_field2: '',
                custom_field5: '',*/
                voided: false
              }
            ]
          }
        }
      }else{ // quantity is 0

        if( activeCartButton === 'auth' ) return 

        if( item.isInTheCart ){

          // let indexOfAuth = -1
          // to_receive.some( (item,index) => {
          //   if( item.item_number === item_number ){
          //     indexOfAuth = index
          //     return true
          //   }
          //   return false
          // } )
          // if( indexOfAuth === -1 ) return console.error('although to_receive button is blue, no item matched')
          // let authItemToRemove = to_receive[ indexOfAuth ]
          // if( authItemToRemove.detail_id === 0 ){
          //   to_receive = [
          //     ...to_receive.slice(0,indexOfAuth),
          //     ...to_receive.slice(indexOfAuth + 1 ).map( item => {
          //       return {
          //         ...item,
          //         line_number : +item.line_number - 1
          //       }
          //     } )
          //   ]
          // }else{
          //   authItemToRemove.voided = true
          // }

          //if( isToShipButtonBlue ){
            // @todo create a hashmap for to_ship too
            let indexOfShip = -1
            to_ship.some( (item,index) => {
              if( item.item_number === item_number ){
                indexOfShip = index
                return true
              }
              return false
            } )
            if( indexOfShip === -1 ) return console.error('although to_ship button is blue, no item matched')
            let shipItemToRemove = to_ship[ indexOfShip ]

            if( shipItemToRemove.detail_id === 0 ){
              to_ship = [
                ...to_ship.slice(0,indexOfShip),
                ...to_ship.slice(indexOfShip + 1 ).map( item => {
                  return {
                    ...item,
                    line_number : +item.line_number - 1
                  }
                } )
              ]
            }else{
              shipItemToRemove.voided = true
            }
          //}
        }
      }
    } )

    setRootReduxStatePropEntry({
      field : 'rma_detail',
      value : { to_ship, to_receive }
    })( dispatch, getState )

    setRootReduxStatePropEntry({
      field : 'dirty',
      value : true
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
export function updateItemFieldValue({ index, field, value }){
  return function( dispatch, getState ){

    let { items } = getState().returnTrak.inventory
    index = +index
    dispatch({
      type: UPDATE_ITEM_FIELD_VALUE,
      data : { items : [
        ...items.slice( 0, index ),
        {
          ...items[index],
          [ field ] : value
        },
        ...items.slice( index + 1),
      ] }
    })
  }
}

export function fetchInventoryItems( skipHashMapping = true ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()
    let { returnTrak } = getState()
    let {
      currentPagination,
      omit_zero_qty,
      searchFilter,
      warehouse
    } = returnTrak.inventory
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
          
          let { activeCartButton, rma_detail } = getState().returnTrak.entry

          let itemsInCart = rma_detail[ `${ activeCartButton === 'auth' ? 'to_receive' : 'to_ship' }` ] || []

          let hashMapOfCurrentCartItems = Object.create(null)

          itemsInCart.forEach( (item,index) => {
            if( !item.serialnumber ){
              hashMapOfCurrentCartItems[ item.item_number ] = { ...item, itemIndex : index}
            }
          } )

          setRootReduxStateProp({
            field : 'hashMapOfCurrentCartItems',
            value : hashMapOfCurrentCartItems
          })( dispatch, getState )

          items = items.map( item => {
            item.quantity = 0
            if( !hashMapOfCurrentCartItems[ item.item_number ] ) return item
            if( activeCartButton === 'auth' ){
              item.quantity = hashMapOfCurrentCartItems[ item.item_number ][ 'received_quantity' ]
            }else{
              item.quantity = hashMapOfCurrentCartItems[ item.item_number ][ 'quantity' ]
              item.unit_price = hashMapOfCurrentCartItems[ item.item_number ][ 'unit_price' ]
              item.price = hashMapOfCurrentCartItems[ item.item_number ][ 'unit_price' ]
            }
            /*
              when browse items modal 'save' clicked,
              we filter items with qty > 0
              but we also need to determine if an item which is already in the cart
              has a value of 0, so that we delete it or make voided = true
              next line makes it clear that this item was in the cart
              so that we will check if its qty > 0 or not
            */
            item.isInTheCart = true
            return item
          } )
        }

        dispatch({
          type : FETCH_INVENTORY_ITEMS.SUCCESS,
          data : {
            items,
            totalItems : response.data.total
          }
        })
        // used in add item input field of cart
        return {
          isSuccess : true,
          items : response.data.rows,
          totalItems : response.data.total
        }

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
