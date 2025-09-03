import Fetcher from '../../../util/Request'
import { showSpinner, hideSpinner } from '../../_Helpers/actions'
import { setUserData } from '../../../util/storageHelperFuncs'

const
  namespace = 'EDI-CUSTOMIZE',
  /************ CONSTANTS ************/
  /* for async actions , includes subactions */
  SET_ROOT_REDUX_STATE = `${namespace}/SET_ROOT_REDUX_STATE`,
  /* initial state for this part of the redux state */
  initialState = {
    current_areas : [],
    current_areas_for_edi : [],
    saved_view : true
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {
  switch(action.type) {
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


export function setRootReduxStateProp_multiple( keysToUpdate = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { ...keysToUpdate }
    })
    return Promise.resolve()
  }
}

export function fetchDefaultEdiLayout(){
  return function( dispatch, getState ){

    dispatch( showSpinner() )

    const fetcher = new Fetcher()

    fetcher.fetch(
      '/api/edi', 
      {
        method : 'post',
        data : {
          action : 'get_default_overview'
        }
      }
    ).then( 
      response => {

        dispatch( hideSpinner() )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            current_areas : response.data.overview_layout.areas,
            saved_view : false
          }
        })
        setTimeout( () => {
          let event = new Event('edi_layout_changed')
          global.document.dispatchEvent(event)
        }, 0 )
      }).catch( 
        error => {          
          dispatch( hideSpinner() )
      })
  }
}

export function saveEdiLayout(){
  return function( dispatch, getState ){
    dispatch( showSpinner() )
    const fetcher = new Fetcher()

    return fetcher.fetch(
      '/api/edi', 
      {
        method : 'post',
        data : {
          action : 'save_overview',
          data : {
            overview_layout: {
              areas : getState().ediCustomize.current_areas
            }
          }
        }
      }
    ).then( 
      response => {
        dispatch( hideSpinner() )
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            current_areas : response.data.overview_layout.areas,
            current_areas_for_edi : response.data.overview_layout.areas,
            saved_view : true
          }
        })
        setTimeout( () => {
          let event = new Event('edi_layout_changed')
          global.document.dispatchEvent(event)
        }, 0 )
        setUserData( 'edi_overview_layout', { areas : response.data.overview_layout.areas } )
      }).catch( 
        error => {          
          dispatch( hideSpinner() )
      })
  }
}