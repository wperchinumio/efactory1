import Fetcher                    from '../../../util/Request'
import { setBadgeCounterValues }  from '../../Grid/redux'
import { defineAction }           from 'redux-define'
import {
    showSpinner,
    hideSpinner
  }                                from '../../_Helpers/actions'

const
  namespace = 'OVERVIEW-FULFILLMENT',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  GET_FULFILLMENTS = defineAction( 'GET_FULFILLMENTS', subActions, namespace ),
  GET_ACTIVITIES = defineAction( 'GET_ACTIVITIES', subActions, namespace ),
  SET_ROOT_REDUX_STATE = `${namespace}/SET_ROOT_REDUX_STATE`,

  /* initial state for this part of the redux state */
  initialState = {
    fulfillments        : [],
    fulfillment30Days   : [],
    last30DaysRMAs      : [],
    loading             : false,
    loaded              : false,
    error               : false,
    is_initially_called : false,
    last_time_initially_called : '',
    dont_show_zero_qty  : true
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case GET_FULFILLMENTS:
      return {
        ...state,
        loading : true,
        loaded:false,
        error:false
      }
    case GET_FULFILLMENTS.SUCCESS:
      return {
        ...state,
        loading : false,
        loaded  : true,
        ...action.data
      }
    case GET_FULFILLMENTS.ERROR:
      return {
        ...state,
        loading : false,
        ...action.data
      }

    case GET_ACTIVITIES:
      return {
        ...state,
        loading : true,
        loaded:false,
        error:false
      }
    case GET_ACTIVITIES.SUCCESS:
      return {
        ...state,
        loading : false,
        loaded  : true,
        ...action.data
      }
    case GET_ACTIVITIES.ERROR:
      return {
        ...state,
        loading : false,
        ...action.data
      }
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


const calculateBadgeValues = data => {
  let holdCounter           = 0,
      riskCounter           = 0,
      openCounter           = 0,
      backOrdersCounter     = 0,
      openRMAsCounter       = 0,
      op_drafts             = 0,
      rma_drafts            = 0


  data.forEach((item)=>{
      holdCounter += item.ff_hold
      riskCounter += item.risk
      openCounter += item.total_open_orders
      backOrdersCounter += item.back_orders
      openRMAsCounter += item.open_rmas
      op_drafts += item.op_drafts
      rma_drafts += item.rma_drafts
  })

  return {
    "/orders/open"          : openCounter,
    "/orders/onhold"        : holdCounter,
    "/orders/backorders"    : backOrdersCounter,
    "/orders/prerelease"    : riskCounter,
    "/returntrak/rmas/open" : openRMAsCounter,
    '/orderpoints/drafts'   : op_drafts,
    '/returntrak/drafts'    : rma_drafts
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

export function showLoadingSpinner(){
  return function( dispatch, getState ){
    dispatch( showSpinner() )
  }
}

export function hideLoadingSpinner(){
  return function( dispatch, getState ){
    dispatch( hideSpinner() )
  }
}

export function getFulfillmentsAsync(
  updateBadges = false,
  showingToaster = false,
  forceShowingLoadingSpinner
){
  return function(dispatch, getState) {

    let { is_initially_called } = getState().overview.fulfillment

    is_initially_called = forceShowingLoadingSpinner === false ? true : is_initially_called

    if( !is_initially_called || forceShowingLoadingSpinner ){
      showLoadingSpinner()( dispatch, getState )
    }

    const fetcher = new Fetcher()

    dispatch({ type : GET_FULFILLMENTS })

    return fetcher
      .fetch('/api/overview', { method : 'post', data : [{overview_id: 1001}] })
      .then( response => {
        dispatch({
          type : GET_FULFILLMENTS.SUCCESS,
          data : { fulfillments : response["1001"]['data'] }
        })
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            is_initially_called : true
          }
        })
        if( updateBadges ){
          // calculateBadgeValues returns { '/orders/open' : 123, open : 11 ... }
          let counterValues = calculateBadgeValues( response["1001"]['data'] )
          setBadgeCounterValues(counterValues)(dispatch, getState)
        }
        if( !is_initially_called || forceShowingLoadingSpinner ){
          hideLoadingSpinner()( dispatch, getState )
        }
      })
      .catch( error => {
        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : GET_FULFILLMENTS.ERROR,
          data : { error : error_message }
        })
        if( !is_initially_called || forceShowingLoadingSpinner ){
          hideLoadingSpinner()( dispatch, getState )
        }
      })
  }
}

export function getAnnouncementBadgeValue( updateBadges = false ){
  return function(dispatch, getState) {

    const fetcher = new Fetcher()

    dispatch({ type : GET_FULFILLMENTS })

    return fetcher
      .fetch('/api/overview', { method : 'post', data : [{overview_id: 1006}] })
      .then( response => {
        setBadgeCounterValues({
          '/announcements' : response[ '1006' ][ 'new_announcements' ]
        })(dispatch, getState)
      })
      .catch( error => {

        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : GET_FULFILLMENTS.ERROR,
          data : { error : error_message }
        })
      })
  }
}

export function getFulfillment30DaysAsync( { animation_visible } = {} ){
  return function( dispatch, getState ){

    if( animation_visible ){
      dispatch( showSpinner() )
    }

    const fetcher = new Fetcher()

    dispatch({ type : GET_ACTIVITIES })

    fetcher
      .fetch('/api/overview', {
        method : 'post',
        data : [{ overview_id: 1002 }]
      })
      .then( response => {

        if( animation_visible ){
          dispatch( hideSpinner() )
        }

        dispatch({
          type : GET_ACTIVITIES.SUCCESS,
          data : { fulfillment30Days : response["1002"]['data'] }
        })
      })
      .catch( error => {

        if( animation_visible ){
          dispatch( hideSpinner() )
        }

        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : GET_ACTIVITIES.ERROR,
          data : { error : error_message }
        })
      })
  }
}

export function getLast30DaysRMAsAsync( { animation_visible } = {} ){
  return function( dispatch, getState ){

    if( animation_visible ){
      dispatch( showSpinner() )
    }

    const fetcher = new Fetcher()

    dispatch({ type : GET_ACTIVITIES })

    fetcher
      .fetch('/api/overview', {
        method : 'post',
        data : [{ overview_id: 1007 }]
      })
      .then( response => {

        if( animation_visible ){
          dispatch( hideSpinner() )
        }

        dispatch({
          type : GET_ACTIVITIES.SUCCESS,
          data : { last30DaysRMAs : response["1007"]['data'] }
        })
      })
      .catch( error => {

        if( animation_visible ){
          dispatch( hideSpinner() )
        }

        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : GET_ACTIVITIES.ERROR,
          data : { error : error_message }
        })
      })
  }
}
