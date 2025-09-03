import Fetcher                from '../../../util/Request'
import { defineAction }       from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }        from '../../_Helpers/actions'
import { 
  setRootReduxStateProp as grid_setRootReduxStateProp 
}                             from '../../Grid/redux'

const
  namespace = 'RMA/DRAFTS',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  LIST_DRAFTS = defineAction( 'LIST_DRAFTS', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  INITIALIZE_REDUX_STATE = `${namespace}/INITIALIZE_REDUX_STATE`,
  SET_ROOT_REDUX_STATE = `${namespace}/SET_ROOT_REDUX_STATE`,
  /* initial state for this part of the redux state */
  initialState = {
    drafts : [],
    filterValue : '',
    loadedDrafts : false,
    checkedDrafts : {
      allChecked : false,
      checkedDraftIds : {}
    }
  }

/************ REDUCER ************/


export default function reducer(state = initialState, action) {

  switch(action.type) {

    case INITIALIZE_REDUX_STATE:
      return { ...initialState }

    case LIST_DRAFTS.SUCCESS:
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

/* ----------------- SYNC ACTIONS STARTS ----------------- */

export function deleteDrafts( rma_ids = [] ){
  return function( dispatch, getState ){

    if( !Array.isArray( rma_ids ) ) return console.error()

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'delete_draft',
          rma_ids
        }
      })
      .then( response => { // ex. response.data = { rma_id : 1 }

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {}
        })

        showToaster({
          isSuccess : true,
          message : 'Deleted drafts successfully!'
        })( dispatch, getState )

        setRootReduxStateProp({ field : 'checkedDrafts', value : { 
          allChecked : false,
          checkedDraftIds : {}
        } })( dispatch, getState )

        listDrafts()( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}


export function listDrafts(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'list_drafts' }
      })
      .then( response => {

        grid_setRootReduxStateProp( 'badgeCounterValues', {
          ...getState().grid.badgeCounterValues,
          '/returntrak/drafts' : response.data.length
        } )( dispatch, getState )

        dispatch(hideSpinner())

        dispatch({
          type : LIST_DRAFTS.SUCCESS,
          data : { 
            drafts : response.data,
            loadedDrafts : true
          }
        })

      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function initializeReduxState(){
  return function( dispatch, getState ) {
    dispatch({ type : INITIALIZE_REDUX_STATE })
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