import Fetcher                from '../../../util/Request'
import { defineAction }       from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }        from '../../_Helpers/actions'

const
  namespace = 'OP/SETTINGS',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  READ_GENERAL_SETTINGS = defineAction( 'READ_GENERAL_SETTINGS', subActions, namespace ),
  READ_OP_SETTINGS = defineAction( 'READ_OP_SETTINGS', subActions, namespace ),
  READ_OP_SHIPPING_SETTINGS = defineAction( 'READ_OP_SHIPPING_SETTINGS', subActions, namespace ),
  READ_OP_CUSTOM_FIELDS_SETTINGS = defineAction( 'READ_OP_CUSTOM_FIELDS_SETTINGS', subActions, namespace ),
  UPDATE_GENERAL_SETTINGS = defineAction( 'UPDATE_GENERAL_SETTINGS', subActions, namespace ),
  SAVE_SHIPPING_SETTINGS = defineAction( 'SAVE_SHIPPING_SETTINGS', subActions, namespace ),
  SAVE_CUSTOM_FIELDS_SETTINGS = defineAction( 'SAVE_CUSTOM_FIELDS_SETTINGS', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  INITIALIZE_REDUX_STATE = defineAction( 'INITIALIZE_REDUX_STATE', namespace ),
  SET_ROOT_REDUX_STATE = defineAction( 'SET_ROOT_REDUX_STATE', namespace ),

  /* initial state for this part of the redux state */
  initialState = {
    activeTab : 'shipping',
    order : {
      manual : false,
      minimum_number_of_digits : '',
      prefix : '',
      starting_number : '',
      suffix : ''
    },
    loading : false,
    opCustomFieldsSettingsData : {},
    opShippingSettingsData : {},
    opSettingsData : {
      shipping : {},
      custom_fields : [],
      order : []
    }
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case READ_GENERAL_SETTINGS.SUCCESS:
    case READ_OP_SETTINGS.SUCCESS:
    case READ_OP_SHIPPING_SETTINGS.SUCCESS:
    case READ_OP_CUSTOM_FIELDS_SETTINGS.SUCCESS:
    case UPDATE_GENERAL_SETTINGS:
    case UPDATE_GENERAL_SETTINGS.ERROR:
    case UPDATE_GENERAL_SETTINGS.SUCCESS:
    case SAVE_SHIPPING_SETTINGS:
    case SAVE_SHIPPING_SETTINGS.ERROR:
    case SAVE_SHIPPING_SETTINGS.SUCCESS:
    case SAVE_CUSTOM_FIELDS_SETTINGS:
    case SAVE_CUSTOM_FIELDS_SETTINGS.ERROR:
    case SAVE_CUSTOM_FIELDS_SETTINGS.SUCCESS:
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

export function updateOpShippingSettings(){
  return function( dispatch, getState ){
    let { opShippingSettingsData } = getState().orderPoints.settings

    dispatch(showSpinner())

    dispatch({
      type : SAVE_SHIPPING_SETTINGS,
      data : { loading : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'update_shipping_settings',
          data : opShippingSettingsData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SAVE_SHIPPING_SETTINGS.SUCCESS,
          data : { loading : false, opShippingSettingsData : response.data, }
        })

        showToaster({
          isSuccess : true,
          message : 'Updated successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : SAVE_SHIPPING_SETTINGS.ERROR,
          data : {
            error : error_message,
            loading : false
          }
        })

        return { isSuccess : false }

      })
  }
}

export function readOpShippingSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : { action : 'read_shipping_settings' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_OP_SHIPPING_SETTINGS.SUCCESS,
          data : { opShippingSettingsData : response.data }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function readOpCustomFieldsSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : { action : 'read_custom_fields' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_OP_CUSTOM_FIELDS_SETTINGS.SUCCESS,
          data : { opCustomFieldsSettingsData : response.data }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function updateOpCustomFieldsSettings(){
  return function( dispatch, getState ){
    let { opCustomFieldsSettingsData } = getState().orderPoints.settings

    dispatch(showSpinner())

    dispatch({
      type : SAVE_CUSTOM_FIELDS_SETTINGS,
      data : { loading : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'update_custom_field',
          data : opCustomFieldsSettingsData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SAVE_CUSTOM_FIELDS_SETTINGS.SUCCESS,
          data : { loading : false, opCustomFieldsSettingsData : response.data, }
        })

        showToaster({
          isSuccess : true,
          message : 'Updated successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : SAVE_CUSTOM_FIELDS_SETTINGS.ERROR,
          data : {
            error : error_message,
            loading : false
          }
        })

        return { isSuccess : false }

      })
  }
}

export function updateGeneralSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({
      type : UPDATE_GENERAL_SETTINGS,
      data : {  loading : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : {
          action : 'update_general',
          data : {
            ...getState().orderPoints.settings.order
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : UPDATE_GENERAL_SETTINGS.SUCCESS,
          data : {  order : response.data, loading : false }
        })

        showToaster({
          isSuccess : true,
          message : 'Updated successfully!'
        })( dispatch, getState )

      })
      .catch( error => {

        dispatch(hideSpinner())

        dispatch({
          type : UPDATE_GENERAL_SETTINGS.SUCCESS,
          data : { loading : false }
        })

      })
  }
}

export function readOpSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : { action : 'read_settings' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_OP_SETTINGS.SUCCESS,
          data : { opSettingsData : response.data }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function readGeneralSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/orderpoints', {
        method : 'post',
        data : { action : 'read_general' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_GENERAL_SETTINGS.SUCCESS,
          data : {  order : response.data }
        })

      })
      .catch( error => {

        dispatch(hideSpinner())

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
