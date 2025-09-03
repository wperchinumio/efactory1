import moment                 from 'moment'
import Fetcher                from '../../../../util/Request'
//import { defineAction }       from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }        from '../../../_Helpers/actions'

const
  namespace = 'po_rma',
  //subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  //EXAMPLE_ASYNC = defineAction( 'EXAMPLE_ASYNC', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
    po_cart_items : [],
    header : {},
    searched : false,
    addItemSearchFilterValue : '',
    checked_cart_items : [],
    new_po_rma : false,
    received_date : moment().format('YYYY-MM-DD'),
    form_dirty : false
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

export function addItemToCart( itemObject = {} ){
  return function( dispatch, getState ){
    
    let { po_cart_items } = getState().services.utilities.poRma

    let firstIndex
    let matchedItems = po_cart_items.filter(
      ( item, index ) => {
        if( item.item_number === itemObject.item_number &&  !item.voided ){
          firstIndex = index
          return true
        }
        return false
      } 
    )

    // if item already exists
    if( matchedItems.length ) {
      return Promise.resolve({
        item_number: matchedItems[0].item_number,
        line_number : matchedItems[0].line_number,
        index : firstIndex
      })
    }

    itemObject = {
      e1_line_number : null,
      line_number : null,
      auth_qty : '',
      item_description : itemObject.description,
      item_number : itemObject.item_number,
      qty_now : 1,
      condition_code : 'C1',
      received_qty : 0,
      recv_sn : '',
      voided : false,
      ts : ( new Date() ).getTime()
    }

    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : {
        po_cart_items : [
          ...po_cart_items,
          itemObject
        ]
      }
    })
    
    return Promise.resolve({
      item_number : itemObject.item_number,
      line_number : itemObject.line_number,
      index : po_cart_items.length
    })
  }
}

export function searchPoRma({ field, value }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    // let { po } = getState().services.utilities
  

    const fetcher = new Fetcher()

    setRootReduxStateProp_multiple({
      po_cart_items : [],
      header : {},
      searched : false,
      checked_cart_items : [],
      form_dirty : false
    })( dispatch, getState )

    return fetcher
      .fetch('/api/po_rma', {
        method : 'post',
        data : {
          action        : "search",
          resource      : "po_rma",
          data : {
            [ field ] : value
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())
        
        let ts_base = ( new Date() ).getTime()

        let po_cart_items = response.data.rows.map( 
          ( item, index ) => {
            return { 
              ...item,
              qty_now : '', 
              condition_code : 'C1', 
              recv_sn : '',
              ts : ts_base + index
            }
          } 
        )
        setRootReduxStateProp_multiple({
          po_cart_items,
          header : response.data.header,
          searched : true          
        })( dispatch, getState )


      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}


export function sendPoRma(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    let { header, po_cart_items : lines, received_date } = getState().services.utilities.poRma
    let { om_number, rma_number } = header

    return fetcher
      .fetch('/api/po_rma', {
        method : 'post',
        data : {
          action        : "save",
          resource      : "po_rma",
          data : {
            om_number,
            rma_number,
            received_date,
            lines
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({ type : INITIALIZE_REDUX_STATE })

        dispatch({ type : SET_ROOT_REDUX_STATE, data : { new_po_rma : true } })

        showToaster({
          isSuccess : true,
          message : 'Sent RMA Receipt successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}