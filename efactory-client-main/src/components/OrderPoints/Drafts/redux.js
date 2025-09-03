import Fetcher from '../../../util/Request'
import { 
  setRootReduxStateProp as grid_setRootReduxStateProp
} from '../../Grid/redux'

const namespace = 'add-edit-address'
const FETCH_ALL_DRAFTS = `FETCH_ALL_DRAFTS${namespace}`
const FETCH_ALL_DRAFTS_SUCCESS = `FETCH_ALL_DRAFTS_SUCCESS${namespace}`
const FETCH_ALL_DRAFTS_FAIL = `FETCH_ALL_DRAFTS_FAIL${namespace}`
const DELETE_DRAFTS = `DELETE_DRAFTS${namespace}`
const DELETE_DRAFTS_SUCCESS = `DELETE_DRAFTS_SUCCESS${namespace}`
const DELETE_DRAFTS_FAIL = `DELETE_DRAFTS_FAIL${namespace}`
const SET_SELECTED_ROWS = `SET_SELECTED_ROWS${namespace}`
const TOGGLE_TEMPLATE = `TOGGLE_TEMPLATE${namespace}`
const TOGGLE_TEMPLATE_SUCCESS = `TOGGLE_TEMPLATE_SUCCESS${namespace}`
const TOGGLE_TEMPLATE_FAIL = `TOGGLE_TEMPLATE_FAIL${namespace}`
const MERGE_REDUX_STATE_WITH  = `${namespace}---MERGE_REDUX_STATE_WITH`
const RESET_REDUX_STATE  = `${namespace}---RESET_REDUX_STATE`

const initialState = {
  allDrafts : [],
  error:false,
  filterInput: '',
	loadingDrafts : false,
  loadedDrafts:false,
  loadDraftsError : false,
  selectedDraftRows : {},
  togglingTemplate : false,
  toggledTemplate : false,
  toggleTemplateError : false
}

// reducer
export default function reducer( state = initialState, action ) {
	switch( action.type ){
		case FETCH_ALL_DRAFTS:
      return {
        ...state,
        loadingDrafts : true,
        loadedDrafts:false,
        loadDraftsError : false,
        allDrafts : [],
        error:false
      }
    case FETCH_ALL_DRAFTS_SUCCESS:
      return {
        ...state,
        loadingDrafts : false,
        loadedDrafts  : true,
        allDrafts : action.data,
        selectedDraftRows : {}
      }
    case FETCH_ALL_DRAFTS_FAIL:
      return {
        ...state,
        loadingDrafts : false,
        loadDraftsError : true,
        error : action.data
      }
    case DELETE_DRAFTS:
      return {
        ...state,
        deletingDrafts : true,
        deletedDrafts:false,
        deleteDraftsError : false,
        error:false
      }
    case DELETE_DRAFTS_SUCCESS:
      return {
        ...state,
        deletingDrafts : false,
        deletedDrafts:true,
        selectedDraftRows : {}
      }
    case DELETE_DRAFTS_FAIL:
      return {
        ...state,
        deletingDrafts : false,
        deleteDraftsError : true,
        error: action.data
      }
    case SET_SELECTED_ROWS:
      return {
        ...state,
        ...action.data
      }
    case TOGGLE_TEMPLATE:
      return {
        ...state,
        togglingTemplate : true,
        toggledTemplate : false,
        toggleTemplateError: false
      }
    case TOGGLE_TEMPLATE_SUCCESS:
      return {
        ...state,
        toggleTemplate : false,
        toggledTemplate : action.data,
        toggleTemplateError: false,
        selectedDraftRows : {}
      }
    case TOGGLE_TEMPLATE_FAIL:
      return {
        ...state,
        toggleTemplate : false,
        toggledTemplate : true,
        toggleTemplateError: action.data
      }
    case MERGE_REDUX_STATE_WITH:
      return {
        ...state,
        ...action.data
      }
    case RESET_REDUX_STATE:
      return {
        ...initialState
      }
		default:
			return state;
	}
}

export function mergeReduxStateWith( objectToMerge = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: MERGE_REDUX_STATE_WITH,
      data : { ...objectToMerge }
    })
  }
}

export function resetReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: RESET_REDUX_STATE })
  }
}

export function fetchDrafts(){
  return function(dispatch, getState) {
    
  	dispatch({ type : FETCH_ALL_DRAFTS })

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action :"list_drafts"
        }
      })
      .then(( response ) => {
        grid_setRootReduxStateProp( 'badgeCounterValues', {
          ...getState().grid.badgeCounterValues,
          '/orderpoints/drafts' : response.data.total_drafts
        } )( dispatch, getState )
        dispatch({
          type : FETCH_ALL_DRAFTS_SUCCESS,
          data : response.data.draft_orders
        })
      })
      .catch(( error ) => {
        dispatch({
          type : FETCH_ALL_DRAFTS_FAIL,
          data : error['error_message']
        })
      })

  }
}

export function setSelectedDraftRows( orderId ){
  return function(dispatch, getState) {

    let { selectedDraftRows } = getState().orderPoints.drafts
    selectedDraftRows = { ...selectedDraftRows }
    if( selectedDraftRows.hasOwnProperty(orderId) ) delete selectedDraftRows[orderId]
    else selectedDraftRows[orderId] = true
    dispatch({ 
      type : SET_SELECTED_ROWS,
      data : { selectedDraftRows }
    })

  }
}

export function setSelectedDraftRowsAll( selectAll = true ){
  return function(dispatch, getState) {

    let selectedDraftRowsNew = {}

    if( selectAll ) {
      getState().orderPoints.drafts.allDrafts.forEach( aDraft => {
        selectedDraftRowsNew[aDraft.order_id] = true
      } )
    }

    dispatch({ 
      type : SET_SELECTED_ROWS,
      data : { selectedDraftRows : selectedDraftRowsNew }
    })

  }
}


export function deleteDrafts(){
  return function(dispatch, getState) {
    
    dispatch({ type : DELETE_DRAFTS })

    const fetcher = new Fetcher()

    let { selectedDraftRows } = getState().orderPoints.drafts

    fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action :"delete_draft",
          order_ids : Object.keys(selectedDraftRows).map( id => +id )
        }
      })
      .then(( response ) => {
        dispatch({
          type : DELETE_DRAFTS_SUCCESS,
          data : response.data
        })
        fetchDrafts()(dispatch, getState)
      })
      .catch(( error ) => {
        dispatch({
          type : DELETE_DRAFTS_FAIL,
          data : error['error_message']
        })
      })

  }
}

export function toggleTemplate() {
  return function(dispatch, getState) {
    
    dispatch({ type : TOGGLE_TEMPLATE })

    let { selectedDraftRows, allDrafts } = getState().orderPoints.drafts
    let orderId = Object.keys(selectedDraftRows)[0]
    let isTemplate
    allDrafts.forEach(function(element) {
      if(element.order_id === +orderId) {
        isTemplate = !element.is_template
      }
    })
    let param = { 
        action : 'toggle_template',
        order_id : +orderId,
        is_template : isTemplate
      }

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : param
      })
      .then(( response ) => {
        dispatch({
          type : TOGGLE_TEMPLATE_SUCCESS,
          data : response.data
        })
        fetchDrafts()(dispatch, getState)
      })
      .catch(( error ) => {
        dispatch({
          type : TOGGLE_TEMPLATE_FAIL,
          data : error['error_message']
        })
      })
  }
}
