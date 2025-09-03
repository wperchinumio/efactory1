import Fetcher                from '../../../../../util/Request'
import { defineAction }       from 'redux-define'
import { showToaster,
         showSpinner,
         hideSpinner }        from '../../../../_Helpers/actions'

const
  namespace = 'RMA/MAIL-TEMPLATES',
  subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  READ_TEMPLATES = defineAction( 'READ_TEMPLATES', subActions, namespace ),
  READ_TEMPLATE = defineAction( 'READ_TEMPLATE', subActions, namespace ),
  UPDATE_TEMPLATE = defineAction( 'UPDATE_TEMPLATE', subActions, namespace ),
  LOAD_DEFAULT_TEMPLATE = defineAction( 'LOAD_DEFAULT_TEMPLATE', subActions, namespace ),
  EMAIL_SAMPLE = defineAction( 'EMAIL_SAMPLE', subActions, namespace ),
  /* for normal actions , doesn t include subactions */
  SET_ACTIVE_TEMPLATE = defineAction( 'SET_ACTIVE_TEMPLATE', namespace ),
  SET_ACTIVE_TAB = defineAction( 'SET_ACTIVE_TAB', namespace ),
  UPDATE_TEMPLATE_HTML = defineAction( 'UPDATE_TEMPLATE_HTML', namespace ),
  SET_EMAIL_VALUE = defineAction( 'SET_EMAIL_VALUE', namespace ),
  RESET_STATE = defineAction( 'RESET_STATE', namespace ),
  /* initial state for this part of the redux state */
  initialState = {
    activeRmaType: 'T01',
    activeTemplate : {},
    activeTab : 'orderLevel',
    emailAccountWarehouse : '',
    emailValue : '',
    stringToInsert : '',
    templates : [],
    loadingEmailSample : false
  }

/************ REDUCER ************/

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case EMAIL_SAMPLE:
    case EMAIL_SAMPLE.SUCCESS:
    case EMAIL_SAMPLE.ERROR:
    case LOAD_DEFAULT_TEMPLATE.ERROR:
    case READ_TEMPLATE.SUCCESS:
    case READ_TEMPLATES.SUCCESS:
    case READ_TEMPLATE.ERROR:
    case READ_TEMPLATES.ERROR:
    case SET_ACTIVE_TEMPLATE:
    case SET_ACTIVE_TAB:
    case UPDATE_TEMPLATE.SUCCESS:
    case UPDATE_TEMPLATE.ERROR:
    case UPDATE_TEMPLATE_HTML:
    case SET_EMAIL_VALUE:
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

export function emailSample(){
  return function( dispatch, getState ){
    let { mailTemplates } = getState().returnTrak

    let {
      activeRmaType : rma_type,
      activeTab,
      activeTemplate,
      emailValue,
      emailAccountWarehouse
    } = mailTemplates

    if( !rma_type ) return console.error(' rma_type is required to email the sample ')

    dispatch(showSpinner())

    let account_number = emailAccountWarehouse.replace(/\.[a-zA-z]+/, '')
    let warehouse = emailAccountWarehouse.replace(/[0-9]+\./, '')

    dispatch({
      type : EMAIL_SAMPLE,
      data : { loadingEmailSample : true }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'email_template',
          rma_type,
          type : activeTab,
          email : emailValue,
          html : activeTemplate[ activeTab ]['html'],
          account_number,
          warehouse
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : EMAIL_SAMPLE.SUCCESS,
          data : { loadingEmailSample : false }
        })

        showToaster({
          isSuccess : true,
          message : 'Sent an email with the template successfully!'
        })( dispatch, getState )

        setEmailValue('')( dispatch, getState )
      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : EMAIL_SAMPLE.ERROR,
          data : { loadingEmailSample : false, error : error_message }
        })

        return { isSuccess : false }

      })
  }
}

export function setEmailValue({ field, value }){
  return function( dispatch, getState ){
    dispatch({ type : SET_EMAIL_VALUE, data : {
      [ field ] : value
    } })
  }
}

export function loadDefaultTemplate(){
  return function( dispatch, getState ){
    let { mailTemplates } = getState().returnTrak
    let {
      activeRmaType : rma_type,
      activeTab
    } = mailTemplates

    if( !rma_type ) return console.error(' rma_type is required to update template ')

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'read_default_template',
          rma_type,
          type : activeTab
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        updateTemplateData({
          field : 'html',
          value : response.data.html
        })( dispatch, getState )

        showToaster({
          isSuccess : true,
          message : 'Loaded default template successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : LOAD_DEFAULT_TEMPLATE.ERROR,
          data : { error : error_message }
        })

      })
  }
}

export function updateTemplate(){
  return function( dispatch, getState ){
    let { mailTemplates } = getState().returnTrak
    let {
      activeRmaType : rma_type,
      activeTemplate
    } = mailTemplates

    if( !rma_type ) return console.error(' rma_type is required to update template ')

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'update_template',
          rma_type,
          data : activeTemplate
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : UPDATE_TEMPLATE.SUCCESS,
          data : { activeTemplate : response.data }
        })

        showToaster({
          isSuccess : true,
          message : 'Updated template successfully!'
        })( dispatch, getState )

        readTemplates()( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : UPDATE_TEMPLATE.ERROR,
          data : { error : error_message }
        })

      })
  }
}

export function updateTemplateData({ field, value }){
  return function( dispatch, getState ){
    let {
      activeTab,
      activeTemplate
    } = getState().returnTrak.mailTemplates

    activeTemplate = {
      ...activeTemplate,
      [ activeTab ] : {
        ...activeTemplate[ activeTab ],
        [field] : value
      }
    }

    dispatch({ type : UPDATE_TEMPLATE_HTML, data : { activeTemplate } })
  }
}

export function setActiveTab( activeTab ){
  return function( dispatch, getState ){
    dispatch({ type : SET_ACTIVE_TAB, data : { activeTab } })
  }
}

export function setActiveTemplate({ rma_type, showingToaster = false }){
  return function( dispatch, getState ){

    dispatch({
      type : SET_ACTIVE_TEMPLATE,
      data : { activeRmaType : rma_type }
    })

    readSingleTemplate( showingToaster )( dispatch, getState )

  }
}

export function readSingleTemplate( showingToaster = false ){
  return function( dispatch, getState ){

    let { activeRmaType : rma_type } = getState().returnTrak.mailTemplates

    if( !rma_type ) return console.error(' rma_type is required to read template ')

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'read_template',
          rma_type
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_TEMPLATE.SUCCESS,
          data : { activeTemplate : response.data }
        })

      })
      .catch( error => {
        dispatch(hideSpinner())

        let { error_message = '' } = error || {}
        dispatch({
          type : READ_TEMPLATE.ERROR,
          data : { error : error_message }
        })

      })
  }
}

export function readTemplates(){
  return function(dispatch, getState) {
    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/returntrak', {
        method : 'post',
        data : {
          action : 'read_templates'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : READ_TEMPLATES.SUCCESS,
          data : { templates : response.data }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

        let { error_message = '' } = error || {}

        dispatch({
          type : READ_TEMPLATES.ERROR,
          data : { error : error_message }
        })
      })
  }
}

export function resetState( activeTab ){
  return function( dispatch, getState ){
    dispatch({ type : RESET_STATE })
  }
}
