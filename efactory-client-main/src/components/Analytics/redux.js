import Fetcher                					from '../../util/Request'
import {
  showToaster,
  showSpinner,
  hideSpinner
}        					                      from '../_Helpers/actions'
import {getAuthData}                    from '../../util/storageHelperFuncs';
import downloadSource                   from '../../components/_Helpers/DownloadSource';

const
	namespace = 'analytics',

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE 	= `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
		/*reportData1 : {},
    reportData2 : {},
    reportData3 : {},
    reportData4 : {},
    reportData5 : {},*/
    exportReportClicked: false,
    bars: null,
		filter 		 : {
		},
    loading : false,
    loaded  : false,
    valueField : 'orders',
    compareYears : false,
    showTrendLine : false,
    currentSortedField : 'name',
    sortType           : 'ascending',
    shipmentTypeDays : {
      stats     : 'shipment_times_days',
      filter    : {
        and: []
      },
      page_num  : 1,
      page_size : 100,
      sort      : [{ order_number: 'asc' }]
    },
    isReportDetailShown : false,
    detail1_rows : [],
    detail1_total : 0,
    days_formatted : '',
    location_to_display : '',
    account_to_display : '',
    download_params_and : [],
    global_analytics : false,
    // for admin shipment times
    selected_customer : '',
    selected_customer_data : {}
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

export function showErrorToaster( message = '' ){
  return function( dispatch, getState ){
    showToaster({
      isSuccess : false,
      message
    })( dispatch, getState )
  }
}

export function runReport( stats = 'domestic', id ){
  return function( dispatch, getState ) {

    let startedAt = ( new Date() ).getTime()

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        [ `loading${id}` ] : true,
        [ `loaded${id}` ]  : false
      }
    })

    let { 
      filter = {}, 
      valueField,
      selected_customer,
      global_analytics
    } = getState().analytics

    let filterReshaped  = { and : [] }

    Object.keys( filter ).forEach( f => {
    	filterReshaped.and = [
    		...filterReshaped.and,
    		...filter[ f ]
    	]
    } )

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/analytics', {
        method : 'post',
        data : {
          stats,
          global_analytics,
          filter : filterReshaped,
          policy_code : selected_customer ? selected_customer : undefined
        }
      })
      .then( response => {
        let endedAt = ( new Date() ).getTime()

        let { data = { chart: [] } } = response

        if (data.chart) {
          data.chart = data.chart.map( d => ({
            ...d,
            value : d[ valueField ]
          }) )
        }

        let changeState = () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              [ `reportData${id}` ] : data,
              [ `loading${id}` ] : false,
              [ `loaded${id}` ]  : true
            }
          })
        }

        let difference = endedAt - startedAt
        
        if( difference < 1000 ){
          setTimeout( changeState , 1000 - difference )
        }else{
          changeState()
        }

      })
      .catch( error => {

        let endedAt = ( new Date() ).getTime()

        let changeState = () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              [ `loading${id}` ] : false,
              [ `loaded${id}` ]  : false
            }
          })
        }

        let difference = endedAt - startedAt

        if( difference < 700 ){
          setTimeout( changeState , 700 - difference )
        }else{
          changeState()
        }

      })
  }
}

export function runReportCycleCount( id ){
  return function( dispatch, getState ) {

    let startedAt = ( new Date() ).getTime()

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        [ `loading${id}` ] : true,
        [ `loaded${id}` ]  : false
      }
    })

    let { 
      filter = {}, 
      valueField,
      // selected_customer
    } = getState().analytics

    let filterReshaped  = { and : [] }

    Object.keys( filter ).forEach( f => {
      filterReshaped.and = [
        ...filterReshaped.and,
        ...filter[ f ]
      ]
    } )

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action : 'read',
          fields : [ '*' ],
          filter : filterReshaped,
          page_num : 1,
          page_size : 1000,
          resource : 'inventory-cyclecount-chart',
          sort : [ { cycle_count_date : 'desc' } ]
        }
      })
      .then( response => {

        let endedAt = ( new Date() ).getTime()

        let { data = { chart: [] } } = response

        data.chart = data.chart.map( d => ({
          ...d,
          value : d[ valueField ]
        }) )

        let changeState = () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              [ `reportData${id}` ] : data,
              [ `loading${id}` ] : false,
              [ `loaded${id}` ]  : true
            }
          })
        }

        let difference = endedAt - startedAt
        
        if( difference < 1000 ){
          setTimeout( changeState , 1000 - difference )
        }else{
          changeState()
        }

      })
      .catch( error => {

        let endedAt = ( new Date() ).getTime()

        let changeState = () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              [ `loading${id}` ] : false,
              [ `loaded${id}` ]  : false
            }
          })
        }

        let difference = endedAt - startedAt

        if( difference < 700 ){
          setTimeout( changeState , 700 - difference )
        }else{
          changeState()
        }

      })
  }
}

export function runReportRateCards( id ){
  return function( dispatch, getState ) {

    let startedAt = ( new Date() ).getTime()

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        [ `loading${id}` ] : true,
        [ `loaded${id}` ]  : false
      }
    })

    let { 
      filter = {}, 
    } = getState().analytics

    let filterReshaped  = { and : [] }

    Object.keys( filter ).forEach( f => {
      filterReshaped.and = [
        ...filterReshaped.and,
        ...filter[ f ]
      ]
    } )

    if (!filterReshaped.and.find(f => f.field === 'carrier'))
    {
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            [ `reportData${id}` ] : null,
            [ `loading${id}` ] : false,
            [ `loaded${id}` ]  : false
          }
        })
      return;
    }

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/transportation', {
        method : 'post',
        data : {
          action : 'read',
          fields : [ '*' ],
          filter : filterReshaped,
          page_num : 1,
          page_size : 1000000,
          resource : 'rate-cards',
          sort : [ { cycle_count_date : 'desc' } ]
        }
      })
      .then( response => {

        let endedAt = ( new Date() ).getTime()

        let { data = { chart: [] } } = response


        let changeState = () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              [ `reportData${id}` ] : data,
              [ `loading${id}` ] : false,
              [ `loaded${id}` ]  : true
            }
          })
        }

        let difference = endedAt - startedAt
        
        if( difference < 1000 ){
          setTimeout( changeState , 1000 - difference )
        }else{
          changeState()
        }

      })
      .catch( error => {

        let endedAt = ( new Date() ).getTime()

        let changeState = () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              [ `loading${id}` ] : false,
              [ `loaded${id}` ]  : false
            }
          })
        }

        let difference = endedAt - startedAt

        if( difference < 700 ){
          setTimeout( changeState , 700 - difference )
        }else{
          changeState()
        }

      })
  }
}

export function exportReportRateCards( id ){
  return function( dispatch, getState ) {
      var xhr = new XMLHttpRequest();
    
      xhr.open('GET', '/api/transportation', true)
    
      xhr.setRequestHeader("X-Access-Token", getAuthData().api_token)
    
      let { 
        filter = {}, 
      } = getState().analytics

      let filterReshaped  = { and : [] }

      Object.keys( filter ).forEach( f => {
        filterReshaped.and = [
          ...filterReshaped.and,
          ...filter[ f ]
        ]
      } )

      var headerParams = 
      {
          action : 'export',
          format: 'excel_rate_cards',
          fields : [ '*' ],
          filter : filterReshaped,
          page_num : 1,
          page_size : 1000000,
          resource : 'rate-cards',
          sort : [ { service : 'desc' } ]
      }

      downloadSource(
        `/api/transportation`,
        JSON.stringify(headerParams),
        {
          onSuccessAction : () => {
            //dispatch(hideSpinner())
            //dispatch({ type : DOWNLOAD_FILE_SUCCESS })
          },
          onErrorAction : () =>  {
            //dispatch(hideSpinner())
            showToaster({
              isSuccess : false,
              message : 'File not found!'
            })( dispatch, getState )
            //return dispatch({ type : DOWNLOAD_FILE_FAIL })
          }
        }
      );
  }
}

export function fetchShipmentTypeDays({ and, page_num, days_formatted }){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { 
      shipmentTypeDays = {}, 
      days_formatted : days_formatted_,
      selected_customer
    } = getState().analytics

    shipmentTypeDays = { ...shipmentTypeDays }

    if( and ) shipmentTypeDays.filter.and = and

    if( page_num ) shipmentTypeDays.page_num = page_num

    if( selected_customer ) shipmentTypeDays.policy_code = selected_customer

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/analytics', {
        method : 'post',
        data : shipmentTypeDays
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            isReportDetailShown : true,
            detail1_rows : response.data.rows,
            detail1_total : response.data.total,
            shipmentTypeDays,
            days_formatted : days_formatted || days_formatted_,
            download_params_and : and && and.filter( ({ field }) => field !== 'client_id' )
          }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function fetchIncidentDetail(id){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/analytics', {
        method : 'post',
        data : { stats: 'incident_detail_id', id}
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            isReportDetailShown : true,
            incident_detail : response.data,
          }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

/*
Request:

{
 "action": "read",
 "resource": "selected_customer",
 "policy_code": "IMK"
}
Response:
{
    "data": {
        "EX": [
            {
                "ZCLC": [
                    "19350"
                ]
            }
        ],
        "FR": [
            {
                "ZFRC": [
                    "19350"
                ]
            }
        ],
        "LA": [
            {
                "ZLAC": [
                    "19350",
                    "19351"
                ]
            }
        ],
        "LN": [
            {
                "ZLNC": [
                    "19350"
                ]
            }
        ]
    },
    "error_message": "",
    "internal_version": "1.1o"
}
*/
// for admin shipment times page
export function readSelectedCustomerData( policy_code ){
  return function( dispatch, getState ) {

    let { 
      selected_customer_data = {}
    } = getState().analytics

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        selected_customer : policy_code,
      }
    })

    if( selected_customer_data.hasOwnProperty( policy_code ) ) return

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          resource  : 'customer',
          action    : 'read',
          policy_code
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            selected_customer_data : {
              ...selected_customer_data,
              [ policy_code ] : response.data
            },
          }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())

      })
  }
}