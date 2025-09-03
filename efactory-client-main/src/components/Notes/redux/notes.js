import Fetcher from '../../../util/Request'
import { showToaster, showSpinner, hideSpinner } from '../../_Helpers/actions'

// CONSTANTS
const
  namespace = 'notes',
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`


// REDUCER
const initialState = {
  notes: [],
  selectedNote: false,
  selectedNoteId: false
}

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

export function initializeReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}



/* ----------------- NOTES ACTIONS START ----------------- */

export function getNotesAsync( note_id = false ){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    fetcher.fetch(
      '/api/notes', 
      { 
        method : 'get' 
      }
    ).then( 
      response => {
        dispatch( hideSpinner() )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            notes : response.data,
            selectedNote : note_id 
                           ? true 
                           : response.data.length > 0 
                             ? response.data[0]['id'] 
                               ? true 
                               : false
                             :  false,
            selectedNoteId : note_id 
                             ? note_id 
                             : response.data.length > 0 
                             ? response.data[0]['id'] 
                               ? response.data[0]['id']
                               : false
                             :  false

          }
        })

      }
    ).catch( 
      error => {
        dispatch( hideSpinner() )
      }
    )
  }
}

export function addNoteAsync(note_data){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    fetcher.fetch( 
      '/api/notes', 
      { 
        method : 'post', 
        data : note_data 
      }
    ).then( 
      response => {
        dispatch( hideSpinner() )
        showToaster({
          isSuccess : true,
          message : 'Added note successfully!'
        })( dispatch, getState )
        dispatch( getNotesAsync())
      }
    ).catch( 
      error => {
        dispatch(hideSpinner())
      }
    )
  }
}

export function deleteNoteAsync(note_data){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    fetcher.fetch(
      '/api/notes/' + note_data.id, 
      { 
        method : 'del' 
      }
    ).then(
      () => {
        dispatch( hideSpinner() )

        dispatch( getNotesAsync())

        showToaster({
          isSuccess : true,
          message : 'Deleted note successfully!'
        })( dispatch, getState )
      }
    ).catch( 
      error => {
        dispatch( hideSpinner() )
        dispatch( getNotesAsync())
      }
    )
  }
}

export function saveNoteAsync(note_data){
  return function( dispatch, getState ) {
    dispatch(showSpinner())
    const fetcher = new Fetcher()
    fetcher.fetch(
      '/api/notes/' + note_data.id, 
      { 
        method : 'put', 
        data : note_data 
      }
    ).then( 
      response => {
        dispatch( hideSpinner() )

        showToaster({
          isSuccess : true,
          message : 'Saved note successfully!'
        })( dispatch, getState )

        dispatch( getNotesAsync( note_data.id ))
      }
    ).catch( 
      error => {
        dispatch( hideSpinner() )
      }
    )
  }
}
