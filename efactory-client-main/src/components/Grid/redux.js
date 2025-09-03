import Fetcher from '../../util/Request'
import { showToaster, showSpinner, hideSpinner } from '../_Helpers/actions'
import { cacheViewApiResponse, getCachedViewApiResponseIfExist } from '../../util/storageHelperFuncs'
import downloadSource from '../_Helpers/DownloadSource'
import config from '../../util/config'
import {getAuthData} from '../../util/storageHelperFuncs'
import global from 'window-or-global'

const
  namespace = 'grid',
  // subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  //EXAMPLE_ASYNC = defineAction( 'EXAMPLE_ASYNC', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE 	= `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
  	activeRow 			: {},
		activeRowIndex 	: '',
		fetchRowsParams : {
			action 		: 'read',
			fields  	: ['*'],
			filter 		: { and : [] },
			page_num  : 1,
			page_size : 100,
			resource  : '',
			url       : '',
			sort      : [],
      filter_id : null
    },
    // temp__ _detailGrid
    fetchRowsParams_detailGrid : {
			action 		: 'read',
			fields  	: ['*'],
			filter 		: { and : [] },
			page_num  : 1,
			page_size : 100,
			resource  : '',
			url       : '',
			sort      : [],
      filter_id : null
		},
		fetchedViews_detailGrid 		: false,
    filter_list     : [],
    initialFilters 	: { and : [] },
    initialFilters_detailGrid 	: { and : [] },
		queryFilters 		: {},
    rows 				 		: [],
    rows_detailGrid : [],
		totalPages   		: 0,
		totalRows    		: 0,
    selectedViewFields 	: [],
    selectedViewFields_detailGrid 	: [],
    views 			 		: [],
    views_detailGrid: [],
    loadingRows     : true,
    loadingRows_detailGrid     : true,
    loadedRows      : false,
    loadedRows_detailGrid      : false,

    badgeCounterValues : {},
    manageFilters : {
      headerConfig : {

      },
      isHeaderConfigSet : false,
      filters           : [],
      loadedListFilters : false,
      resource          : '',
      selectedViewId    : ''
    },
    manageFilters_detailGrid : {
      headerConfig : {

      },
      isHeaderConfigSet : false,
      filters           : [],
      loadedListFilters : false,
      resource          : '',
      selectedViewId    : ''
    },
    lotRevision : {
      lot_master : {},
      settings   : {
        lot_code1 : [],
        lot_code2 : [],
        lot_code3 : [],
        lot_code4 : [],
        lot_code5 : []
      }
    },
    dg_data : {
      item_number:'',
      description:'',
      account_wh:'',
      battery_category:'',
      battery_configuration:'',
      battery_type:'',
      qty_per_packag:'',
      units_per_carton:'',
      units_per_master_carton:'',
      battery_spec_quantity:'',
      battery_spec_unit_of_measure:'',
      net_weight_in_grams:''
    },
    edi_documents : {},
    active_document : '',
    loadingEdiDocument : false,
    loadingGetEdiDocument : false,
    multiple_selected_active_rows : []
  }

/************ REDUCER ************/

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- REDUCER ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      if (action.queryFilters) {
        return {
          ...initialState,
          queryFilters: state.queryFilters,
          badgeCounterValues: state.badgeCounterValues,
          manageFilters: state.manageFilters,
          manageFilters_detailGrid: state.manageFilters_detailGrid
        }
      }
      return {
        ...initialState,
        badgeCounterValues: state.badgeCounterValues,
        manageFilters: state.manageFilters,
        manageFilters_detailGrid: state.manageFilters_detailGrid
      }
    default:
      return state

  }

}

function repaintDocument( dispatch, getState, reset_selected_rows ){
	let repaintNode = global.$('.repaint-node')
  if( repaintNode ){
    repaintNode.hide().show(0)
  }
  if( reset_selected_rows ){
    global.$('.header-index-col.checked-checkbox').removeClass('checked-checkbox')
    global.$('.index-col-wrapper-cell.checked-checkbox').removeClass('checked-checkbox')
    setRootReduxStateProp_multiple({
      activeRow       : {},
      activeRowIndex  : '',
      multiple_selected_active_rows : []
    })( dispatch, getState )
  }
}

// helper
const updateBadgeCounters = ( state, response, { dispatch, getState } ) => {
  let pathnamesWithBadge = [ '/orders/open', '/orders/onhold', '/orders/backorders', '/orders/prerelease', '/returntrak/rmas/open', '/edi/documents/orders-to-resolve', '/edi/documents/orders-to-approve', '/edi/documents/orders-to-ship' ]
  let currentPathname = global.window.location.pathname || ''

  if( pathnamesWithBadge.includes( currentPathname ) ){
    setBadgeCounterValues( { [ currentPathname ] : response.data.total } )( dispatch, getState )
  }

}

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ACTIONS ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

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

export function initializeGridReduxState(queryFilters = false){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE, queryFilters })
    return Promise.resolve()
  }
}

/*================================================
=            ROWS Relacted Actions            =
================================================*/

export function fetchRowsWithChangedParams( fetchRowsParams_received = {} ){
  return function( dispatch, getState ){

  	const fetcher = new Fetcher()

  	let { fetchRowsParams } = getState().grid

  	let fetchRowsParams_merged = { ...fetchRowsParams, ...fetchRowsParams_received }

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loadingRows : true,
        fetchRowsParams : fetchRowsParams_merged,
        activeRow       : {},
        activeRowIndex  : '',
        totalPages: 0,
        totalRows: 0
      }
    })


  	let {
  		action, fields, filter, page_num, page_size, resource, url, sort, filter_id
  	} = fetchRowsParams_merged

    let data = {
      action, fields, filter, page_num, page_size, resource, sort
    }

    if( filter_id ) data.filter_id = filter_id

    return fetcher.fetch(
    	url ,
    	{
	      method : 'post',
	      data
    	}
    )
    .then( response => {
			// check if received rows api resource match the current resource
			// this is to prevent wrong rows being displayed, since fields might
			// not match view data

      let totalPages = Math.ceil( response.data.total / page_size )
			if( getState().grid.fetchRowsParams.resource === response.data.resource ){
				dispatch({
					type : SET_ROOT_REDUX_STATE,
					data : {
						rows 						: response.data.rows,// change to rows
						totalRows 			: response.data.total,
						totalPages,
						loadingRows 		: false
					}
				})
			}
			repaintDocument( dispatch, getState, true )
		} )
		.catch( error => {
      dispatch({ type : SET_ROOT_REDUX_STATE, data : { loadingRows : false } })
		} )

  }
}

export function fetchRowsWithChangedParams_detailGrid( fetchRowsParams_received = {} ){
  return function( dispatch, getState ){

  	const fetcher = new Fetcher()

  	let { fetchRowsParams_detailGrid } = getState().grid

  	let fetchRowsParams_merged = { ...fetchRowsParams_detailGrid, ...fetchRowsParams_received }

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loadingRows_detailGrid : true,
        fetchRowsParams_detailGrid : fetchRowsParams_merged,
        rows_detailGrid : []
      }
    })


  	let {
  		action, fields, filter, page_num, page_size, resource, url, sort
  	} = fetchRowsParams_merged

    let data = {
      action, fields, filter, page_num, page_size, resource, sort
    }

    // if( filter_id ) data.filter_id = filter_id

    return fetcher.fetch(
    	url ,
    	{
	      method : 'post',
	      data
    	}
    )
    .then( response => {
			// check if received rows api resource match the current resource
			// this is to prevent wrong rows being displayed, since fields might
			// not match view data

			if( getState().grid.fetchRowsParams_detailGrid.resource === response.data.resource ){
				dispatch({
					type : SET_ROOT_REDUX_STATE,
					data : {
						rows_detailGrid 			 : response.data.rows,// change to rows
						loadingRows_detailGrid : false
					}
				})
			}
			repaintDocument( dispatch, getState )
		} )
		.catch( error => {
      dispatch({ type : SET_ROOT_REDUX_STATE, data : { loadingRows_detailGrid : false } })
		} )

  }
}

export function fetchRowsAfterViewApiReturns_detailGrid({
	action, fields, filter, page_num, page_size, resource, url, sort, filter_id
}){
  return function( dispatch, getState ){

  	const fetcher = new Fetcher()
    return fetcher.fetch(
    	url ,
    	{
	      method : 'post',
	      data : {
	        action,
          fields,
          filter,
          page_num,
          page_size,
          resource,
          sort,
          filter_id
	      }
    	}
    )
    .then( response => {
			// check if received rows api resource match the current resource
			// this is to prevent wrong rows being displayed, since fields might
			// not match view data
			if( getState().grid.fetchRowsParams_detailGrid.resource === response.data.resource ){

        // temp for EDI history page

        // if( response.data.resource === 'edi-850-history' ){
          // dispatch({
          //   type : SET_ROOT_REDUX_STATE,
          //   data : {
          //     rows 				: [
          //       {
          //         "id":9995886,
          //         "partner" : 'DCL-test',
          //         "order_number":"166636",
          //         "received_date":"2017-09-13T13:14:58",
          //         "po_number":"9876576",
          //         "po_total":"2",
          //         "processing_status" : "test",
          //         "processing_date":"2017-09-13T13:14:58",
          //         "account_number":"10501",
          //         "dcl_customer" : "test dcl_customer",
          //         "row_id":1
          //      },
          //     ],
          //     totalRows 	: 1,
          //     totalPages 	: Math.ceil( 1 / page_size ),
          //     loadingRows : false,
          //     loadedRows  : true,
          //     fetchedViews: true
          //   }
          // })
        //}else{
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              rows_detailGrid 	     : response.data.rows,// change to rows
              loadingRows_detailGrid : false,
              loadedRows_detailGrid  : true,
              fetchedViews_detailGrid: true
            }
          })
        //}
			}
			repaintDocument( dispatch, getState )
		} )
		.catch( error => {
      dispatch({ type : SET_ROOT_REDUX_STATE, data : { loadingRows_detailGrid : false } })
		} )

  }
}

export function fetchRowsAfterViewApiReturns({
	action, fields, filter, page_num, page_size, resource, url, sort, filter_id,
  badgeUpdate, only_query_filters
}){
  return function( dispatch, getState ){

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        totalPages: 0,
        totalRows: 0
      }
    })

  	const fetcher = new Fetcher()
    return fetcher.fetch(
    	url ,
    	{
	      method : 'post',
	      data : {
	        action,
          fields,
          filter,
          page_num,
          page_size,
          resource,
          sort,
          filter_id
	      }
    	}
    )
    .then( response => {
			// check if received rows api resource match the current resource
			// this is to prevent wrong rows being displayed, since fields might
			// not match view data
			if( getState().grid.fetchRowsParams.resource === response.data.resource ){
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            rows 				: response.data.rows,// change to rows
            totalRows 	: response.data.total,
            totalPages 	: Math.ceil( response.data.total / page_size ),
            loadingRows : false,
            loadedRows  : true,
            fetchedViews: true
          }
        })
			}
      if( badgeUpdate ){
        updateBadgeCounters( getState(), response, { dispatch, getState } )
      }
			repaintDocument( dispatch, getState, true )
		} )
		.catch( error => {
      dispatch({ type : SET_ROOT_REDUX_STATE, data : { loadingRows : false } })
		} )

  }
}

export function processViewData_detailGrid({
	response,
  dispatch,
  getState,
  callRowsApi = false
}){
	let state = getState()
	/* prepare fetchRecords params STARTS */
	let responseData 				 = response.data[0]
	let {
    type,
    url,
    views,
  } = responseData
	/* selectedView will be sth like { fields : [], filter : {}, rows_per_page : 100, sort : [] } */
	let selectedView
	views 				 			 		= views.map( view => { // view === { name: "Test234", id: 186, selected: false, view : ===selectedView }
		if( view.selected ) selectedView = view.view
		return {
			id 			 : view.id,
			name 		 : view.name,
			selected : view.selected
		}
	} )
	let filters = [ ...selectedView.filter.and ]
	/* prepare fetchRecords params ENDS */
  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : {
      views_detailGrid : views,
      selectedViewFields_detailGrid  : selectedView.fields,
      initialFilters_detailGrid      : selectedView.filter,
      fetchRowsParams_detailGrid     : {
        action      : 'read',
        fields      : ['*'],
        filter      : { and : filters },
        page_num    : 1,
        page_size   : selectedView.rows_per_page,
        resource    : type,
        url         : url,
        sort        : [ selectedView.sort[0] ? { [ selectedView.sort[0]['field'] ] : selectedView.sort[0]['dir'] } : {} ],
        filter_id   : ''
      },
      rows_detailGrid     : [],
      fetchedViews_detailGrid        : true,
      loadingRows_detailGrid         : false,
      manageFilters_detailGrid       : {
        ...state.grid.manageFilters_detailGrid,
        selectedViewId    : selectedView.id
      }
    }
  })
	/* call fetchRows STARTS */
  // if( callRowsApi ){
  //   fetchRowsAfterViewApiReturns_detailGrid({
  //     action    : 'read',
  //     fields    : ['*'],
  //     filter    : { and : filters },
  //     page_num  : 1,
  //     page_size : selectedView.rows_per_page,
  //     resource  : type,
  //     url       : url,
  //     sort      : [ selectedView.sort[0] ? { [ selectedView.sort[0]['field'] ] : selectedView.sort[0]['dir'] } : {} ],
  //     filter_id   : ''
  //   })( dispatch, getState )
  // }


	// save view fields


}

function processViewData({
	response,
  dispatch,
  getState,
  callRowsApi = true,
  keep_filter_id = false,
  badgeUpdate = true,
  only_query_filters = false,
  queryFiltersInUrl = false
}){
	let state = getState()
	/* prepare fetchRecords params STARTS */
	let responseData 				 = response.data[0]
	let {
    type,
    url,
    views,
    filters : filter_list
  } = responseData
	/* selectedView will be sth like { fields : [], filter : {}, rows_per_page : 100, sort : [] } */
	let selectedView
	views 				 			 		= views.map( view => { // view === { name: "Test234", id: 186, selected: false, view : ===selectedView }
		if( view.selected ) selectedView = view.view
		return {
			id 			 : view.id,
			name 		 : view.name,
			selected : view.selected
		}
	} )
	let filters = [ ...selectedView.filter.and ]
	let { queryFilters } = state.grid

  if( only_query_filters ){
    filters = []
    if( Object.keys(queryFilters).length > 0 ){
      badgeUpdate = false
      Object.values( queryFilters ).forEach(
        queryFilter => { filters = [ ...filters, ...queryFilter ] }
      )
    }
  }else{
    if( Object.keys(queryFilters).length > 0 ){
      badgeUpdate = false
      filters = filters.filter( filter => !queryFilters[ filter.field ] )
      Object.values( queryFilters ).forEach(
        queryFilter => { filters = [ ...filters, ...queryFilter ] }
      )
    }
  }



  selectedView.sort = selectedView.sort ? selectedView.sort : []
	/* prepare fetchRecords params ENDS */

  dispatch({
    type : SET_ROOT_REDUX_STATE,
    data : {
      views,
      filter_list,
      selectedViewFields  : selectedView.fields,
      initialFilters      : selectedView.filter,
      fetchRowsParams     : {
        action      : 'read',
        fields      : ['*'],
        filter      : { and : filters },
        page_num    : 1,
        page_size   : selectedView.rows_per_page,
        resource    : type,
        url         : url,
        sort        : [ selectedView.sort[0] ? { [ selectedView.sort[0]['field'] ] : selectedView.sort[0]['dir'] } : {} ],
        filter_id   : keep_filter_id
                      ? state.grid.fetchRowsParams.filter_id
                        ? state.grid.fetchRowsParams.filter_id
                        : isNaN(keep_filter_id) ? '' : keep_filter_id
                      : ''
      },
      rows                : callRowsApi ? [] : state.grid.rows,
      fetchedViews        : callRowsApi ? false : true,
      loadingRows         : callRowsApi ? true : false,
      activeRow           : '',
      activeRowIndex      : '',
      manageFilters       : {
        ...state.grid.manageFilters,
        selectedViewId    : selectedView.id
      },
      queryFilters        : (only_query_filters && !queryFiltersInUrl) ? {} : queryFilters
    }
  })
	/* call fetchRows STARTS */
  if( callRowsApi ){
    fetchRowsAfterViewApiReturns({
      action    : 'read',
      fields    : ['*'],
      filter    : { and : filters },
      page_num  : 1,
      page_size : selectedView.rows_per_page,
      resource  : type,
      url       : url,
      sort      : [ selectedView.sort[0] ? { [ selectedView.sort[0]['field'] ] : selectedView.sort[0]['dir'] } : {} ],
      filter_id   : keep_filter_id
                      ? state.grid.fetchRowsParams.filter_id
                        ? state.grid.fetchRowsParams.filter_id
                        : isNaN(keep_filter_id) ? '' : keep_filter_id
                      : '',
      badgeUpdate,
      only_query_filters
    })( dispatch, getState )
  }


	// save view fields


}




/*=====  End of ROWS Relacted Actions  ======*/



/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */



/*=====================================
=            VIEW Related Actions     =
=====================================*/

export function fetchView(
  resource,
  keep_filter_id = false,
  only_query_filters = false,
  queryFiltersInUrl = false
)
  {
  return function( dispatch, getState ){
  	let viewCached = getCachedViewApiResponseIfExist( resource )

  	if( viewCached ){
  		processViewData({ response : viewCached,  dispatch, getState, keep_filter_id, only_query_filters, queryFiltersInUrl })
  	}

    if( viewCached ){
      setTimeout( () => {
        const fetcher = new Fetcher()
        fetcher.fetch('/api/views', {
          method : 'post',
          data : {
            action : 'list',
            views  : [ resource ]
          }
        })
        .then( response => {
          // Cached Views has "key" property in their filters.
          // Views retrieved from server do not have "key" property in their filters.
          // That causes iscachedViewChanged variable to be false
          // So new view and new data are fetched from server and filters are gone
          // To prevent this, below code removes "key" property from all filters. 

          // --- Start "key" remove
          let {
            views,
          } = viewCached.data[0]

          views.forEach(view => {
            if (view.view) {
            let filters = [ ...view.view.filter.and ]

            filters.forEach(filter => {
              delete filter.key;
            })
          }
          })

          // --- End "key" remove

          let isCachedViewChanged = JSON.stringify(viewCached) !== JSON.stringify( response )
          if( isCachedViewChanged ){
            // @TODO check if rows api params changed eg. sort, filter
            // now directly accept as row api params changed
            processViewData({ response : { ...response }, loading : false, dispatch, getState, keep_filter_id, only_query_filters, queryFiltersInUrl })
            cacheViewApiResponse( resource, { ...response } )
          }
        })
        .catch( e => {})
      }, 0 )
    }else{
      const fetcher = new Fetcher()
        fetcher.fetch('/api/views', {
          method : 'post',
          data : {
            action : 'list',
            views  : [ resource ]
          }
        })
        .then( response => {
          processViewData({ response,  dispatch, getState, keep_filter_id, only_query_filters, queryFiltersInUrl })
          cacheViewApiResponse( resource, response )
        })
        .catch( e => {} )
    }

  }
}

export function fetchView_detailGrid( resource, keep_filter_id = false ){
  return function( dispatch, getState ){

    let resource2 = resource + '-detail'

    let viewCached = getCachedViewApiResponseIfExist( resource2 )

  	if( viewCached ){
      processViewData_detailGrid({ response : viewCached,  dispatch, getState })

      setTimeout( () => {
        const fetcher1 = new Fetcher()
        fetcher1.fetch('/api/views', {
          method : 'post',
          data : {
            action : 'list',
            views  : [ resource2 ]
          }
        })
        .then( response => {

          let isCachedViewChanged = JSON.stringify(viewCached) !== JSON.stringify( response )

          if( isCachedViewChanged ){
            // @TODO check if rows api params changed eg. sort, filter
            // now directly accept as row api params changed
            processViewData_detailGrid({ response, loading : false, dispatch, getState, keep_filter_id })
            cacheViewApiResponse( resource2, response )
          }
        }).catch( e => {} )

      }, 0 )
    }else{
      const fetcher = new Fetcher()
        fetcher.fetch('/api/views', {
          method : 'post',
          data : {
            action : 'list',
            views  : [ resource2 ]
          }
        })
        .then( response => {

          processViewData_detailGrid({ response, loading : false, dispatch, getState })
          cacheViewApiResponse( resource2, response )


        }).catch( e => {} )
    }

  }
}

export function selectView({ view, id }){
  return function( dispatch, getState ) {

  	dispatch(showSpinner())

    const fetcher = new Fetcher()
    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { fetchedViews : false }
    })
    fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action : 'select',
          view  : view,
          id : id
        }
      })
      .then( response => {
        let { filter_id } = getState().grid.fetchRowsParams

      	dispatch(hideSpinner())
        processViewData({
          response,
          callRowsApi : true ,
          dispatch, getState,
          keep_filter_id : filter_id ? true : false
        })
  			cacheViewApiResponse( view, response )
        repaintDocument( dispatch, getState, true )
      })
      .catch( e => {})
  }
}

export function reloadView( createdViewName ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { fetchedViews : false }
    })

    let { fetchRowsParams } = getState().grid

    fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action : 'list',
          views  : [ fetchRowsParams.resource ]
        }
      })
      .then( response => {
        dispatch(hideSpinner())
        let { fetchRowsParams } = getState().grid
        let filterIdToSelect = response.data[0].filters.filter(
          f => f.name === createdViewName
        )[0]['id']
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            fetchRowsParams : {
              ...fetchRowsParams,
              filter_id : filterIdToSelect
            }
          }
        })
        processViewData({
          response,
          callRowsApi : true ,
          dispatch,
          getState,
          keep_filter_id : true,
          badgeUpdate : false
        })
        cacheViewApiResponse( fetchRowsParams.resource, response )
        repaintDocument( dispatch, getState )
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

/*=== End of VIEW Related Actions ===*/

export function setQueryFilters( queryFilters ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { queryFilters }
    })
    return Promise.resolve()
  }
}

export function activateRow({ activeRow, activeRowIndex }){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { activeRow, activeRowIndex }
    })
    return Promise.resolve()
  }
}

export function setBadgeCounterValues( counterValues = {} ){
  return function( dispatch, getState ){

    let { badgeCounterValues = {} } = getState().grid
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : {
        badgeCounterValues : {
          ...badgeCounterValues,
          ...counterValues
        }
      }
    })
    return Promise.resolve()
  }
}


export const downloadView = (format) => {
  return ( dispatch, getState ) => {

    dispatch(showSpinner())

    let {
      url, fields, filter, page_num, page_size, resource, sort, filter_id
    } = getState().grid.fetchRowsParams

    let data = {
      fields, filter, page_num, page_size, resource, sort,
      action : 'export',
      format
    }

    if( filter_id ) data.filter_id = filter_id

    data = JSON.stringify(data)
    return downloadSource( url, data, {
      onSuccessAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Downloaded successfully!'
        })( dispatch, getState )
      },
      onErrorAction : (response, statusText) => {
        var error_message = 'An error occurred while downloading!'
        if (statusText === 'Bad Request') {
          const bytesString = String.fromCharCode.apply(null, new Uint8Array(response));
          const server_response = JSON.parse(bytesString);
          error_message = server_response.error_message;
        }
        dispatch(hideSpinner())
        showToaster({
          isSuccess : false,
          message : error_message
        })( dispatch, getState )
      }
    })

  }
}

/*==============================================
=            FILTER RELATED ACTIONS            =
==============================================*/


export function selectFilterFromFilterList( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'select',
          resource  : 'filter',
          id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let { grid } = getState()

        fetchView( grid.fetchRowsParams.resource )( dispatch , getState )

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function unsetFilter(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { grid } = getState()

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'unset',
          resource  : 'filter',
          view      : grid.fetchRowsParams.resource
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        fetchView( grid.fetchRowsParams.resource )( dispatch , getState )

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function listFilters(){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    let { grid } = getState()

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'list',
          resource  : 'filter',
          view      : grid.manageFilters.resource
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            manageFilters : {
              ...grid.manageFilters,
              filters           : response.data || [],
              loadedListFilters :  true
            }
          }
        })

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function deleteFilter( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'delete',
          resource  : 'filter',
          id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        listFilters()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Successfully deleted filter!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function getAvailableFields( pageName, viewId ){
  return function(dispatch) {

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/views', {
         method : 'post',
         data : {
          action : 'detail',
          view : pageName,
          id : viewId
         }
       })
      .then( response => {
        return Promise.resolve( response.data )
      })
      .catch( error => {
        return Promise.reject(error)
      })
  }
}

export function createFilter( data ){
  return function( dispatch, getState ) {

    let {
      view,
      name,
      description,
      filter
    } = data

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'create',
          resource  : 'filter',
          view,
          data : {
            name,
            description,
            filter
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        listFilters()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Successfully created filter!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function getFilterDetail( id ){
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'get',
          resource  : 'filter',
          id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        // response.data includes fields
        // name, description, filter
        return Promise.resolve( response.data )

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function updateFilter( data ){
  return function( dispatch, getState ) {

    let {
      id,
      name,
      description,
      filter
    } = data

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/views', {
        method : 'post',
        data : {
          action    : 'update',
          resource  : 'filter',
          id,
          data : {
            name,
            description,
            filter
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        listFilters()( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Successfully edited filter!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


/*=====  End of FILTER RELATED ACTIONS  ======*/

/*=====  Start of DG Data  ======*/
export function getDGData(){
  return function( dispatch, getState ) {

    let {
      item_number,
      account_wh
    } = getState().grid.activeRow // temp

    dispatch(showSpinner())

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        dg_data:{
          item_number:'',
          description:'',
          account_wh:'',
          battery_category:'',
          battery_configuration:'',
          battery_type:'',
          qty_per_package:'',
          units_per_carton:'',
          units_per_master_carton:'',
          battery_spec_quantity:'',
          battery_spec_unit_of_measure:'',
          net_weight_in_grams:''
        },
      }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action      : 'get_dg_data',
          item_number,
          account_wh
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            dg_data:{
              ...response.data
            }
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


export function postDGData(allWarehouses){
  return function( dispatch, getState ) {

    let {
      dg_data = {}
    } = getState().grid  // temp

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action  : 'post_dg_data',
          data    : {
            ...dg_data,
            account_wh:allWarehouses ? '' : dg_data.account_wh
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Successfully updated dg data!'
        })( dispatch, getState )

        return Promise.resolve({
          success : true
        })

      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.resolve({
            success : false
          })
      })
  }
}

/*=====  Start of DG Data  ======*/


/*=====  Start of LOT REVISION  ======*/

export function getLotRevision(){
  return function( dispatch, getState ) {

    let {
      lot_ser,
      inv_type,
      item_number
    } = getState().grid.activeRow // temp

    dispatch(showSpinner())

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        lotRevision : {
          lot_master : {},
          settings   : {
            lot_code1 : [],
            lot_code2 : [],
            lot_code3 : [],
            lot_code4 : [],
            lot_code5 : []
          }
        },
      }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action      : 'get_lot_revision',
          lot_ser,
          inv_type,
          item_number
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            lotRevision : {
              ...response.data // keys are lot_master and settings
            }
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

export function postLotRevision(){
  return function( dispatch, getState ) {

    let {
      lot_master = {}
    } = getState().grid.lotRevision // temp

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/inventory', {
        method : 'post',
        data : {
          action  : 'post_lot_revision',
          data    : {
            ...lot_master
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Successfully updated lot revision!'
        })( dispatch, getState )

        return Promise.resolve()

      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.reject()
      })
  }
}

export function getEdiDocuments( order_number, po_number ){
  return function( dispatch, getState ) {

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loadingGetEdiDocument : true
      }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource      : 'edi-documents',
          order_number,
          po_number
        }
      })
      .then( response => {

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            edi_documents : response.data,
            loadingGetEdiDocument : false
          }
        })

        return Promise.resolve({ edi_documents : response.data })

      })
      .catch( error => {
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            loadingGetEdiDocument : false
          }
        })
        return Promise.reject()
      })
  }
}

export const getEdiDocument = (
  url,
  headerParams,
  { onSuccessAction, onErrorAction  }
) => {

  var xhr = new XMLHttpRequest();

  xhr.open('GET', `${config.host}${url[0] === '/' ? url : '/'+url}`, true)

  xhr.setRequestHeader("X-Access-Token", getAuthData().api_token)

  if( headerParams ) xhr.setRequestHeader("X-Download-Params", headerParams)

  xhr.onload = function () {
    if (this.status === 200) {
      onSuccessAction( this.response )
    }else{
      onErrorAction();
    }
  };
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send();
}

export function readEdiDocument( {
  document_type,
  reference_id,
  format_type,
  document_id,
} = {} ){
  return function( dispatch, getState ) {

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loadingEdiDocument : true
      }
    })

    let data = {
      resource : 'read-document',
      document_type,
      reference_id,
      format_type,
      document_id,
      export : 'false'
    }

    data = JSON.stringify(data)

    return getEdiDocument(
      '/api/edi',
      data, {
        onSuccessAction : response => {
          global.$('#document-content-display').html( response )
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loadingEdiDocument : false
            }
          })
        },
        onErrorAction : () => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loadingEdiDocument : false
            }
          })
          showToaster({
            isSuccess : false,
            message : 'An error occurred while downloading!'
          })( dispatch, getState )
        }
      }
    )

  }
}


export const downloadDocument = ({
  document_type,
  reference_id,
  format_type,
  document_id,
}) => {
  return ( dispatch, getState ) => {

    dispatch(showSpinner())

    let data = {
      resource : 'read-document',
      document_type,
      reference_id,
      format_type,
      document_id,
      export : 'true'
    }

    data = JSON.stringify(data)
    return downloadSource( '/api/edi', data, {
      onSuccessAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Downloaded successfully!'
        })( dispatch, getState )
      },
      onErrorAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : false,
          message : 'An error occurred while downloading!'
        })( dispatch, getState )
      }
    })

  }
}

export function authorizeSelectedOrders( order_numbers_arr = [] ){
  return function( dispatch, getState ) {

    if( !(Array.isArray( order_numbers_arr ) && order_numbers_arr.length) ){
      console.error('authorizeSelectedOrders expected first param to be an array with more than 0 order_numbers. Instead received: ', order_numbers_arr)
      return Promise.reject()
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          action    : 'approve_orders',
          params_array  : order_numbers_arr
        }
      }).then(
        response => {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : true,
            message : 'Authorized the selected orders!'
          })( dispatch, getState )
          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.reject()
        }
      )
  }
}

export function rejectSelectedOrders( order_numbers_arr = [] ){
  return function( dispatch, getState ) {

    if( !(Array.isArray( order_numbers_arr ) && order_numbers_arr.length) ){
      console.error('rejectSelectedOrders expected first param to be an array with more than 0 order_numbers. Instead received: ', order_numbers_arr)
      return Promise.reject()
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          action    : 'reject_orders',
          params_array  : order_numbers_arr
        }
      }).then(
        response => {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : true,
            message : 'Rejected the selected orders!'
          })( dispatch, getState )
          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.reject()
        }
      )
  }
}

export function revalidateSelectedOrders( message_ids_arr = [] ){
  return function( dispatch, getState ) {

    if( !(Array.isArray( message_ids_arr ) && message_ids_arr.length) ){
      console.error('revalidateSelectedOrders expected first param to be an array with more than 0 message_ids. Instead received: ', message_ids_arr)
      return Promise.reject()
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          action    : 'revalidate_orders',
          params_array  : message_ids_arr
        }
      }).then(
        response => {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : true,
            message : 'Rejected the selected orders!'
          })( dispatch, getState )
          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.reject()
        }
      )
  }
}

export function deleteSelectedOrders( message_ids_arr = [] ){
  return function( dispatch, getState ) {

    if( !(Array.isArray( message_ids_arr ) && message_ids_arr.length) ){
      console.error('deleteSelectedOrders expected first param to be an array with more than 0 message_ids. Instead received: ', message_ids_arr)
      return Promise.reject()
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          action    : 'delete_orders',
          params_array  : message_ids_arr
        }
      }).then(
        response => {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : true,
            message : 'Rejected the selected orders!'
          })( dispatch, getState )
          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.reject()
        }
      )
  }
}

export function undoRejected( order_numbers_arr = [] ){
  return function( dispatch, getState ) {

    if( !(Array.isArray( order_numbers_arr ) && order_numbers_arr.length) ){
      console.error('undoRejected expected first param to be an array with more than 0 order_numbers. Instead received: ', order_numbers_arr)
      return Promise.reject()
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          action    : 'undo_reject',
          params_array  : order_numbers_arr
        }
      }).then(
        response => {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : true,
            message : 'Un-rejected the selected rejected order!'
          })( dispatch, getState )
          return Promise.resolve()
      }).catch(
        error => {
          dispatch(hideSpinner())
          return Promise.reject()
        }
      )
  }
}





// {
  // resource : "read-document",
  // document_type : "I",
  // reference_id : "7E2AB20B-346B-4165-8973-6FB7E542052A",
  // format_type : "ENV",
  // document_id : "85837663",
  // export : true // only for export...
// }


// Document type:
// I = Invoice
// A = ASN
// O = Order


// Response:
// {
//     "data": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Invoice #: 85837663</title>\n</head>\n<body>\n<code><span>Invoice #: </span>85837663</br></br><table style=\"\" cellpadding=\"3\"><tr><td><span>Partner:</span></td><td>TRG</td><td>&nbsp;</td><td><span>Sender Qual:</span></td><td>14</td></tr><tr><td><span>PO #:</span></td><td>0085-1198479-0588</td><td>&nbsp;</td><td><span>Sender ID:</span></td><td>066537507DCLLIF</td></tr><tr><td><span>DCL Order #:</span></td><td>TRG1198479-0588</td><td>&nbsp;</td><td><span>Receiver Qual:</span></td><td>08</td></tr><tr><td><span>Doc Type:</span></td><td>Invoice - 810</td><td>&nbsp;</td><td><span>Receiver ID:</span></td><td>6111470100</td></tr><tr><td><span>Doc Sent:</span></td><td>6/27/2017 11:00:22 PM</td><td>&nbsp;</td><td><span>ISA Number:</span></td><td>000000194</td></tr><tr><td><span>Doc Acknowledged:</span></td><td>6/27/2017 10:19:42 PM</td><td>&nbsp;</td><td><span>GS Number:</span></td><td>194</td></tr><tr><td><span>Shipped On:</span></td><td>6/27/2017 1:14:03 PM</td><td>&nbsp;</td><td><span>TS Number:</span></td><td>858376630</td></tr><tr><td><span>DCL Customer:</span></td><td>LFX</td><td>&nbsp;</td><td><span>TS Sequence:</span></td><td>1</td></tr><tr><td><span>Gross Amount:</span></td><td>489.72</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><span>Allowances:</span></td><td>0.00</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><span>Charges:</span></td><td>0.00</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><span>Net Amount:</span></td><td>489.72</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td><span>Freight:</span></td><td>69.30</td><td>&nbsp;</td><td>&nbsp;</td></tr></table></code></body>\n</html>\n",
//     "error_message": "",
//     "internal_version": "1.1v"
// }

//////////////////////////////////////////////////////////////////////////////

// {
//   data: {
//     po: {
//       reference_id    : "TRG1198479-0588",
//       document_type   : "O",
//       document_id     : "TRG1198479-0588"
//     },
//     asn : [
//       {
//         reference_id    : "7E2AB20B-346B-4165-8973-6FB7E542052A",
//         document_type   : "A",
//         document_id     : "85837663"
//       },
//       {
//         "reference_id": "A35A3DDF-F213-4FB0-9878-EEDAA0BB33FF",
//         "document_type": "A",
//         "document_id": "85779279"
//       },
//       {
//         "reference_id": "8D31CA5B-FC1B-42C0-A9C2-D2CB8769F732",
//         "document_type": "A",
//         "document_id": "85755122"
//       }
//     ],

//     invoice: [
//       {
//         "reference_id": "520961BC-ED87-49B5-8DE1-E08E90B48671",
//         "document_type": "I",
//         "document_id": "85837663"
//       },
//       {
//         "reference_id": "CDF3178F-A15A-4F09-ABB8-2315779DFB19",
//         "document_type": "I",
//         "document_id": "85779279"
//       },
//       {
//         "reference_id": "5D89FD9B-E4B1-4B9A-A985-F5106A150264",
//         "document_type": "I",
//         "document_id": "85755122"
//       }
//     ]
//   }
// }
