import Fetcher                from '../../../util/Request'
import { defineAction }       from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }        from '../../_Helpers/actions'

const
  namespace = 'RMA/GENERAL-SETTINGS',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  READ_EMAIL_SETTINGS = defineAction( 'READ_EMAIL_SETTINGS', subActions, namespace ),
  READ_EMAIL_SIGNATURE = defineAction( 'READ_EMAIL_SIGNATURE', subActions, namespace ),
  READ_CUSTOM_FIELDS = defineAction( 'READ_CUSTOM_FIELDS', subActions, namespace ),
  READ_SINGLE_CUSTOM_FIELD = defineAction( 'READ_SINGLE_CUSTOM_FIELD', subActions, namespace ),
  READ_RMA_TYPES_DISPOSITIONS = defineAction( 'READ_RMA_TYPES_DISPOSITIONS', subActions, namespace ),
  READ_RMA_SETTINGS = defineAction( 'READ_RMA_SETTINGS', subActions, namespace ),
  SAVE_EMAIL_SETTINGS = defineAction( 'SAVE_EMAIL_SETTINGS', subActions, namespace ),
  SAVE_GENERAL_SETTINGS = defineAction( 'SAVE_GENERAL_SETTINGS', subActions, namespace ),
  SAVE_SHIPPING_SETTINGS = defineAction( 'SAVE_SHIPPING_SETTINGS', subActions, namespace ),
  UPDATE_CUSTOM_FIELD = defineAction( 'UPDATE_CUSTOM_FIELD', subActions, namespace ),
  UPDATE_EMAIL_SIGNATURE = defineAction( 'UPDATE_EMAIL_SIGNATURE', subActions, namespace ),
  UPDATE_RMA_TYPE_DISPOSITION = defineAction( 'UPDATE_RMA_TYPE_DISPOSITION', subActions, namespace ),
  UPDATE_RMA_GENERATION_SETTINGS = defineAction( 'UPDATE_RMA_GENERATION_SETTINGS', subActions, namespace ),
  READ_RMA_GENERAL_SETTINGS = defineAction( 'READ_RMA_GENERAL_SETTINGS', subActions, namespace ),
  READ_RMA_SHIPPING_SETTINGS = defineAction( 'READ_RMA_SHIPPING_SETTINGS', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_EMAIL_SETTINGS_FIELD = defineAction( 'SET_EMAIL_SETTINGS_FIELD', namespace ),
  SET_ACTIVE_TAB = defineAction( 'SET_ACTIVE_TAB', namespace ),
  SET_ACTIVE_SINGLE_CUSTOM_FIELD_INDEX = defineAction( 'SET_ACTIVE_SINGLE_CUSTOM_FIELD_INDEX', namespace ),
  SET_ACTIVE_CUSTOM_FIELD = defineAction( 'SET_ACTIVE_CUSTOM_FIELD', namespace ),
  SET_RMA_GENERATION_FIELD_VALUE = defineAction( 'SET_RMA_GENERATION_FIELD_VALUE', namespace ),
  SET_EMAIL_SIGNATURE_VALUE = defineAction( 'SET_EMAIL_SIGNATURE_VALUE', namespace ),
  RESET_STATE = defineAction( 'RESET_STATE', namespace ),
  SET_ROOT_REDUX_STATE = defineAction( 'SET_ROOT_REDUX_STATE', namespace ),

  /* initial state for this part of the redux state */
  initialState = {
    accountNumberWarehouse : '',
    activeCustomFieldData : {},
    activeCustomFieldIndex : null,
    activeTab : 'rmaTypes',
    contact_info : '',
    customFields : [],
    emailSettings : {},
    rmaGeneralSettingsData : {},
    rmaTypeDispositionData : {},
    rmaSettingsData : {
      custom_fields : [],
      dispositions : [],
      general : {
        auto_number : {},
        expiration_days : '',
        shipping : {
          domestic : {},
          international : {}
        },
      },
      rma_types : []
    },
    rmaShippingSettingsData : {},
    receiving_address : '',
    savingEmailSettings : false,
    updatingCustomField : false,
    updatedCustomField : false,
    loading : false,
    updatingRmaTypeDisposition : false,
    updatedRmaTypeDisposition : false,
    updatingEmailSignature : false,
    updatingRmaGeneralSettings : false
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case READ_CUSTOM_FIELDS.ERROR:
    case READ_CUSTOM_FIELDS.SUCCESS:
    case READ_EMAIL_SETTINGS.ERROR:
    case READ_EMAIL_SETTINGS.SUCCESS:
    case READ_EMAIL_SIGNATURE.SUCCESS:
    case READ_RMA_GENERAL_SETTINGS.SUCCESS:
    case READ_RMA_SETTINGS.SUCCESS:
    case READ_RMA_SHIPPING_SETTINGS.SUCCESS:
    case READ_RMA_TYPES_DISPOSITIONS.SUCCESS:
    case READ_SINGLE_CUSTOM_FIELD.ERROR:
    case READ_SINGLE_CUSTOM_FIELD.SUCCESS:
    case SAVE_EMAIL_SETTINGS:
    case SAVE_EMAIL_SETTINGS.ERROR:
    case SAVE_EMAIL_SETTINGS.SUCCESS:
    case SAVE_GENERAL_SETTINGS:
    case SAVE_GENERAL_SETTINGS.ERROR:
    case SAVE_GENERAL_SETTINGS.SUCCESS:
    case SAVE_SHIPPING_SETTINGS:
    case SAVE_SHIPPING_SETTINGS.ERROR:
    case SAVE_SHIPPING_SETTINGS.SUCCESS:
    case SET_ACTIVE_CUSTOM_FIELD:
    case SET_ACTIVE_SINGLE_CUSTOM_FIELD_INDEX:
    case SET_ACTIVE_TAB:
    case SET_EMAIL_SETTINGS_FIELD:
    case SET_EMAIL_SIGNATURE_VALUE:
    case SET_ROOT_REDUX_STATE:
    case SET_RMA_GENERATION_FIELD_VALUE:
    case UPDATE_CUSTOM_FIELD:
    case UPDATE_CUSTOM_FIELD.ERROR:
    case UPDATE_CUSTOM_FIELD.SUCCESS:
    case UPDATE_EMAIL_SIGNATURE:
    case UPDATE_EMAIL_SIGNATURE.SUCCESS:
    case UPDATE_EMAIL_SIGNATURE.ERROR:
    case UPDATE_RMA_GENERATION_SETTINGS:
    case UPDATE_RMA_GENERATION_SETTINGS.ERROR:
    case UPDATE_RMA_GENERATION_SETTINGS.SUCCESS:
    case UPDATE_RMA_TYPE_DISPOSITION.SUCCESS:
    case READ_RMA_TYPES_DISPOSITIONS:
    case READ_CUSTOM_FIELDS:
      return {
        ...state,
        ...action.data
      }
    case RESET_STATE:
      return initialState
    default:
      return state

  }

}


/************ ACTIONS ************/

/*
  this method is used to update fields :
  'accountNumberWarehouse', 'contact_info', 'receiving_address'
*/
export function setEmailSignatureValue({ field, value }){
  return function( dispatch, getState ){

    if( field === 'accountNumberWarehouse' ){
      if( value === '' ){
        return dispatch({
          type: SET_EMAIL_SIGNATURE_VALUE,
          data : {
            accountNumberWarehouse : '',
            contact_info : '',
            receiving_address : ''
          }
        })
      }else{
        dispatch({
          type: SET_EMAIL_SIGNATURE_VALUE,
          data : {
            accountNumberWarehouse : value,
            contact_info : '',
            receiving_address : ''
          }
        })
        return readEmailSignature()( dispatch, getState )
      }
    }

    dispatch({
      type: SET_EMAIL_SIGNATURE_VALUE,
      data : { [ field ] : value }
    })
  }
}

export function updateEmailSignature(){
  return function( dispatch, getState ){

    let { settings } = getState().returnTrak

    let { accountNumberWarehouse } = settings

    if( !accountNumberWarehouse ){
      return console.error(
        `readEmailSignature action creator expects `+
        `<accountNumberWarehouse> to be a valid value `+
        `instead read <${ accountNumberWarehouse }> `+
        `from redux state`
      )
    }

    dispatch(showSpinner())

    dispatch({
      type : UPDATE_EMAIL_SIGNATURE,
      data : { updatingEmailSignature : true }
    })

    let account_number = accountNumberWarehouse.replace(/\.[a-zA-z]+/, '')
    let warehouse = accountNumberWarehouse.replace(/[0-9]+\./, '')

    let {
      receiving_address,
      contact_info
    } = settings

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_email_signature',
          data : {
            account_number,
            warehouse,
            receiving_address,
            contact_info
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : UPDATE_EMAIL_SIGNATURE.SUCCESS,
          data : { updatingEmailSignature : false }
        })

        showToaster({
          isSuccess : true,
          message : 'Updated successfully!'
        })( dispatch, getState )

      })
      .catch( error => {

        dispatch(hideSpinner())
        dispatch({
          type : UPDATE_EMAIL_SIGNATURE.ERROR,
          data : { updatingEmailSignature : false }
        })

      })
  }
}

export function readEmailSignature(){
  return function( dispatch, getState ){

    let { accountNumberWarehouse } = getState().returnTrak.settings

    if( !accountNumberWarehouse ){
      return console.error(
        `readEmailSignature action creator expects `+
        `<accountNumberWarehouse> to be a valid value `+
        `instead read <${ accountNumberWarehouse }> `+
        `from redux state`
      )
    }

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    let account_number = accountNumberWarehouse.replace(/\.[a-zA-z]+/, '')
    let warehouse = accountNumberWarehouse.replace(/[0-9]+\./, '')


    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action:'read_email_signature',
          account_number,
          warehouse
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_EMAIL_SIGNATURE.SUCCESS,
          data : {
            contact_info : response.data['contact_info'],
            receiving_address : response.data['receiving_address'],
          }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function updateRmaShippingSettings(){
  return function( dispatch, getState ){
    let { rmaShippingSettingsData } = getState().returnTrak.settings

    dispatch(showSpinner())

    dispatch({
      type : SAVE_SHIPPING_SETTINGS,
      data : { loading : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_shipping_settings',
          data : rmaShippingSettingsData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SAVE_SHIPPING_SETTINGS.SUCCESS,
          data : { loading : false, rmaShippingSettingsData : response.data, }
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

export function readRmaGeneralSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'read_general' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_RMA_GENERAL_SETTINGS.SUCCESS,
          data : { rmaGeneralSettingsData : response.data }
        })
        /*
          promise return following
          so that returntrak entry shipping
          fills the shipping sidebar with these values
        */
        return {
          rmaGeneralSettingsData : response.data
        }
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}

export function readRmaSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'read_settings' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_RMA_SETTINGS.SUCCESS,
          data : { rmaSettingsData : response.data }
        })
        /*
          promise return following
          so that returntrak entry shipping
          fills the shipping sidebar with these values
        */
        // @todo
        return Promise.resolve({
          rmaSettingsData : response.data
        })
      })
      .catch( error => {
        
        dispatch(hideSpinner())

        return Promise.reject()

      })
  }
}

export function readRmaShippingSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'read_shipping_settings' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_RMA_SHIPPING_SETTINGS.SUCCESS,
          data : { rmaShippingSettingsData : response.data }
        })
        /*
          promise return following
          so that returntrak entry shipping
          fills the shipping sidebar with these values
        */
        // @todo
        return {
          rmaGeneralSettingsData : response.data
        }
      })
      .catch( error => {

        dispatch(hideSpinner())

      })
  }
}


export function updateRmaTypeDisposition({ title, show, code }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({
      type : UPDATE_RMA_TYPE_DISPOSITION,
      data : { updatingRmaTypeDisposition : true, updatedRmaTypeDisposition: false }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_rma_type_disposition',
          data : {
            code,
            title,
            show
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : UPDATE_RMA_TYPE_DISPOSITION.SUCCESS,
          data : { updatingRmaTypeDisposition : false, updatedRmaTypeDisposition: true }
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
          type : UPDATE_RMA_TYPE_DISPOSITION.ERROR,
          data : {
            error : error_message,
            updatingRmaTypeDisposition : false,
            updatedRmaTypeDisposition : false
          }
        })

      })
  }
}

export function readRmaTypesDispositions(){
  return function( dispatch, getState ){

    dispatch({
      type : READ_RMA_TYPES_DISPOSITIONS,
      data : { updatedRmaTypeDisposition : false }
    })

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'read_rma_types_dispositions' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_RMA_TYPES_DISPOSITIONS.SUCCESS,
          data : { rmaTypeDispositionData : response.data }
        })

      })
      .catch( error => {

        dispatch(hideSpinner())
      })
  }
}

export function updateCustomFieldData(){
  return function( dispatch, getState ){

    let { activeCustomFieldData } = getState().returnTrak.settings

    dispatch(showSpinner())

    dispatch({
      type : UPDATE_CUSTOM_FIELD,
      data : { updatingCustomField : true, updatedCustomField: false }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_custom_field',
          data : activeCustomFieldData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : UPDATE_CUSTOM_FIELD.SUCCESS,
          data : { updatingCustomField : false, updatedCustomField: true }
        })

        showToaster({
          isSuccess : true,
          message : 'Updated custom field successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : UPDATE_CUSTOM_FIELD.ERROR,
          data : {
            error : error_message,
            updatingCustomField : false,
            updatedCustomField: false
          }
        })

      })
  }
}

export function setActiveCustomFieldValue({ field, value }){
  return function( dispatch, getState ){

    let { activeCustomFieldData } = getState().returnTrak.settings

    dispatch({
      type: SET_ACTIVE_CUSTOM_FIELD,
      data : {
        activeCustomFieldData : {
          ...activeCustomFieldData,
          [ field ] : value
        } }
    })
  }
}

export function setActiveCustomFieldIndex({ index }){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ACTIVE_SINGLE_CUSTOM_FIELD_INDEX,
      data : { activeCustomFieldIndex : index }
    })
    readSingleCustomField()( dispatch, getState )
  }
}

export function readSingleCustomField(){
  return function( dispatch, getState ){

    let { activeCustomFieldIndex } = getState().returnTrak.settings

    if( activeCustomFieldIndex === null ) return console.error('activeCustomFieldIndex can not be null!')

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'read_custom_field',
          index : activeCustomFieldIndex
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_SINGLE_CUSTOM_FIELD.SUCCESS,
          data : { activeCustomFieldData : response.data }
        })

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : READ_SINGLE_CUSTOM_FIELD.ERROR,
          data : { error : error_message }
        })

      })
  }
}

export function updateRmaGeneralSettings(){
  return function( dispatch, getState ){
    let { rmaGeneralSettingsData } = getState().returnTrak.settings

    dispatch(showSpinner())

    dispatch({
      type : SAVE_GENERAL_SETTINGS,
      data : { loading : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_general',
          data : rmaGeneralSettingsData
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SAVE_GENERAL_SETTINGS.SUCCESS,
          data : { loading : false, rmaGeneralSettingsData : response.data, }
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
          type : SAVE_GENERAL_SETTINGS.ERROR,
          data : {
            error : error_message,
            loading : false,
            savingEmailSettings : false
          }
        })

        return { isSuccess : false }

      })
  }
}

export function saveEmailSettings(){
  return function( dispatch, getState ){
    let { emailSettings } = getState().returnTrak.settings

    dispatch(showSpinner())

    dispatch({
      type : SAVE_EMAIL_SETTINGS,
      data : { savingEmailSettings : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_email_settings',
          data : emailSettings
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SAVE_EMAIL_SETTINGS.SUCCESS,
          data : { savingEmailSettings : false }
        })

        showToaster({
          isSuccess : true,
          emailSettings : response.data,
          message : 'Saved email settings successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : SAVE_EMAIL_SETTINGS.ERROR,
          data : {
            error : error_message,
            savingEmailSettings : false
          }
        })

        return { isSuccess : false }

      })
  }
}

export function setEmailSettingsField({ field = '', value = '' }){
  return function( dispatch, getState ){

    let { emailSettings } = getState().returnTrak.settings

    dispatch({ type: SET_EMAIL_SETTINGS_FIELD, data : {
      emailSettings : {
        ...emailSettings,
        [ field ] : value
      }
    } })

  }
}

export function readCustomFields(){
  return function( dispatch, getState ){

    dispatch({
      type : READ_CUSTOM_FIELDS,
      data : { updatedCustomField : false }
    })

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'read_custom_fields' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_CUSTOM_FIELDS.SUCCESS,
          data : { customFields : response.data }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
        dispatch({ type : READ_CUSTOM_FIELDS.ERROR })
      })
  }
}

export function readEmailSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : { action : 'read_email_settings' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_EMAIL_SETTINGS.SUCCESS,
          data : { emailSettings : response.data }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())

        dispatch({ type : READ_EMAIL_SETTINGS.ERROR })

      })
  }
}

export function setActiveTab( activeTab ){
  return function( dispatch, getState ){
    dispatch({ type : SET_ACTIVE_TAB, data : { activeTab } })
  }
}

export function resetState( activeTab ){
  return function( dispatch, getState ){
    dispatch({ type : RESET_STATE })
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
