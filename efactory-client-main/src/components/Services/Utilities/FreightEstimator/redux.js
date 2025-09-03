import Fetcher from '../../../../util/Request'
import { defineAction } from 'redux-define'
import { showToaster, showSpinner, hideSpinner } from '../../../_Helpers/actions'

const
  namespace = 'services-utilities-freight',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  CALCULATE_FREIGHT = defineAction( 'CALCULATE_FREIGHT', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE = defineAction( 'SET_ROOT_REDUX_STATE', namespace ),
  INITIALIZE_REDUX_STATE = defineAction( 'INITIALIZE_REDUX_STATE', namespace ),
  /* initial state for this part of the redux state */
  initialState = {
  	activeTab : 'freight',

  	formData : {
      freight : {
        warehouse: '',
        zip_code: '',
        weight: '',
        pieces: '1'
      },
      package : {
        warehouse: '',
        zip_code: '',
        weight: '',
        pieces: '1',
        length: '',
        width: '',
        height: '',
        residential: false
      }
    },
    calculatedTabs : {},
  	results : {
      freight : [],
      package : []
    },
    calculatedValues : {
      freight : {},
      package : {}
    },
    loading : false,
    teamMembers : []
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case CALCULATE_FREIGHT:
    case CALCULATE_FREIGHT.ERROR:
    case CALCULATE_FREIGHT.SUCCESS:
    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      return initialState
    default:
      return state

  }

}


/************ ACTIONS ************/

export function calculateFreight(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({ type : SET_ROOT_REDUX_STATE, data : { loading : true } })

    let { 
      activeTab,
      formData,
      calculatedTabs,
      results,
      calculatedValues
    } = getState().services.utilities.freightEstimator
   
    let { warehouse, residential, ...otherFields } = formData[ activeTab ]
    Object.keys( otherFields ).forEach( 
      fKey => { 
        if( fKey !== 'zip_code' ){
          otherFields[fKey] = +otherFields[fKey] 
        }
      } 
    )

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'freight_estimator',
          type : activeTab,
          warehouse,
          residential,
          ...otherFields
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : CALCULATE_FREIGHT.SUCCESS,
          data : { 
            loading : false,
            results : {
              ...results,
              [ activeTab ] : response.data
            },
            calculatedTabs : {
              ...calculatedTabs,
              [ activeTab ] : true
            },
            calculatedValues : {
              ...calculatedValues,
              [ activeTab ] : {
                warehouse,
                residential,
                ...otherFields
              }
            }
          }
        })

        showToaster({
          isSuccess : true,
          message : 'Calculated successfully!'
        })( dispatch, getState )

      })
      .catch( error => {

        dispatch(hideSpinner())

        dispatch({
          type : CALCULATE_FREIGHT.ERROR,
          data : { loading : false }
        })

      })
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

export function initializeReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
  }
}

export function initializeFormData(){
  return function( dispatch, getState ){

    let { 
      activeTab, formData 
    } = getState().services.utilities.freightEstimator

    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { formData : { 
        ...formData,
        [ activeTab ] : {
          ...initialState['formData'][ activeTab ]
        }
      } }
    })
  }
}
			
export function fetchTeamMembers(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/member', {
        method : 'post',
        data : {
          action    : 'list'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            teamMembers : response.data
          }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}  