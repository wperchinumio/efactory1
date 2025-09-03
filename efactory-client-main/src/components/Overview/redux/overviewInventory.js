import {
    showToaster,
    showSpinner,
    hideSpinner
  }                                from '../../_Helpers/actions'

// CONSTANTS
const
  GET_INVENTORY = 'overview/inventory/GET_INVENTORY',
  GET_INVENTORY_SUCCESS = 'overview/inventory/GET_INVENTORY_SUCCESS',
  GET_INVENTORY_FAIL = 'overview/inventory/GET_INVENTORY_FAIL',
  UPDATE_FILTERS = 'overview/inventory/UPDATE_FILTERS'


// REDUCER
const initialState = {
    items : [],
    loading: false,
    loaded:false,
    error:false,
    filters : {
      hasKey : true,
      isShort : false,
      needReorder : false
    }
}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case GET_INVENTORY:
      return {
        ...state,
        loading : true,
        loaded:false,
        error:false
      }
    case GET_INVENTORY_SUCCESS:
      return {
        ...state,
        loading : false,
        loaded  : true,
        items : action.data
      }
    case GET_INVENTORY_FAIL:
      return {
        ...state,
        loading : false,
        error : action.data
      }
    case UPDATE_FILTERS :
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }

}


// ACTIONS
import Fetcher from '../../../util/Request'

export function updateInventoryFilters( filters = {}, refreshInventory = true ){
  return function(dispatch, getState) {
    dispatch({
      type : UPDATE_FILTERS,
      data : { filters }
    })
    if( refreshInventory ){
      getInventoryAsync()( dispatch, getState )
    }
  }
}

export function getInventoryAsync( showingToaster = false, forceShowingLoadingSpinner = false ){
  return function(dispatch, getState) {

    if( forceShowingLoadingSpinner ){
      dispatch( showSpinner() )
    }

    const fetcher = new Fetcher()

    dispatch({ type : GET_INVENTORY })

    let { filters } = getState().overview.inventory

    fetcher
      .fetch('/api/overview', {
        method : 'post',
        data : [{
          overview_id: 1005,
          filters
        }]
      })
      .then( response => {
        
        if( forceShowingLoadingSpinner ){
          dispatch( hideSpinner() )
        }

        dispatch({
          type : GET_INVENTORY_SUCCESS,
          data : response["1005"]['data']
        })
        
        if( showingToaster ){
          showToaster({
            isSuccess : true,
            message : 'Fetched fulfillments successfully!'
          })( dispatch, getState )
        }
      })
      .catch( error => {

        if( forceShowingLoadingSpinner ){
          dispatch( hideSpinner() )
        }
        
        let { error_message = 'An error occurred' } = error || {}
        
        dispatch({
          type : GET_INVENTORY_FAIL,
          data : error_message
        })
        
      })
  }
}


