import {
    showToaster,
    showSpinner,
    hideSpinner
  }                                from '../../_Helpers/actions'

// CONSTANTS
const
  GET_LATEST_50_ORDERS = 'GET_LATEST_50_ORDERS',
  GET_LATEST_50_ORDERS_SUCCESS = 'GET_LATEST_50_ORDERS_SUCCESS',
  GET_LATEST_50_ORDERS_FAIL = 'GET_LATEST_50_ORDERS_FAIL' ;


// REDUCER
const initialState = {
    orders : [],
    loading: false,
    loaded:false,
    error:false
};

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case GET_LATEST_50_ORDERS:
      return {
        ...state,
        loading : true,
        loaded:false,
        error:false
      }
    case GET_LATEST_50_ORDERS_SUCCESS:
      return {
        ...state,
        loading : false,
        loaded  : true,
        orders : action.data
      }
    case GET_LATEST_50_ORDERS_FAIL:
      return {
        ...state,
        loading : false,
        loaded  : false,
        error : action.data
      }
    default:
      return state;

  }

};

// ACTIONS
import Fetcher from '../../../util/Request';

export const getLatest50Orders = () => ({
  type : GET_LATEST_50_ORDERS
});
export const getLatest50OrdersSuccess = data => ({
  type : GET_LATEST_50_ORDERS_SUCCESS,
  data
});
export const getLatest50OrdersFail = data => ({
  type : GET_LATEST_50_ORDERS_FAIL,
  data
})

export function getLatest50OrdersAsync( typeOfOrders = 'received', showingToaster = false, forceShowingLoadingSpinner = false ){
	return function( dispatch, getState ) {

    if( forceShowingLoadingSpinner ){
      dispatch( showSpinner() )
    }

    const fetcher = new Fetcher()

    dispatch({ type : GET_LATEST_50_ORDERS })

    fetcher.fetch('/api/overview', {
        method : 'post',
        data : typeOfOrders === 'received' ? [{overview_id: 1003}] : [{overview_id: 1004}]
    })
    .then( response => {

      if( forceShowingLoadingSpinner ){
        dispatch( hideSpinner() )
      }

      dispatch({
        type : GET_LATEST_50_ORDERS_SUCCESS,
        data : typeOfOrders === 'received' ?
                  response['1003']['data'] :
                  response['1004']['data']
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
        type : GET_LATEST_50_ORDERS_FAIL,
        data : error_message
      })
      dispatch(getLatest50OrdersFail({ error }))
    })
	}
}
