import Fetcher from '../../../util/Request'
import { showToaster, showSpinner, hideSpinner } from '../../_Helpers/actions'

const
  namespace = 'SHIP-NOTIFICATIONS',
  // subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE  = `${namespace}/SET_ROOT_REDUX_STATE__`,
  INITIALIZE_REDUX_STATE  = `${namespace}/INITIALIZE_REDUX_STATE__`,

  /* initial state for this part of the redux state */
  initialState = {
    activeTab     : 'emailSettings',
    emailSettings : {},
    savingEmailSettings : false,

    activeTab_mt  : 'orderLevel',
    order_templates : [],
    html : '',
    account_number : '',
    active : false,

    email_value : '',
    loadingEmailSample : false,
    editor_value_changed : false,
    order_number : '',
    initialRequest : false,

    templates : [],
    active_template : {
      id : 0,
      is_draft : false
    },

    receipt_accounts : [],
    updatingAccountEmail : false,
    receipt_account_being_edited : {}

  }

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- REDUCER ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    case INITIALIZE_REDUX_STATE:
      return {
        ...initialState,
        //badgeCounterValues : state.badgeCounterValues
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

export function resetState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}

export function toggleToasterVisibility( show = true ){
  return function( dispatch, getState ){
    dispatch( show ? showSpinner() : hideSpinner() )
  }
}

export function showErrorToaster( error_message ){
  return function( dispatch, getState ){
    showToaster({
      isSuccess : false,
      message : error_message
    })( dispatch, getState )
  }
}

/* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */



/*==============================================
=                   SECTION                    =
==============================================*/

export function readEmailSettings(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { action : 'read_order_notification_settings' }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { emailSettings : response.data }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}


export function saveEmailSettings(){
  return function( dispatch, getState ){
    
    let { emailSettings } = getState().shipNotification

    dispatch(showSpinner())

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        savingEmailSettings : true
      }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : {
          action : 'update_order_notification_settings',
          data : emailSettings
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            savingEmailSettings : false,
            emailSettings : response.data
          }
        })

        showToaster({
          isSuccess : true,
          message : 'Saved email settings successfully!'
        })( dispatch, getState )

      })
      .catch( error => {
        
        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            savingEmailSettings : false
          }
        })
      })
  }
}

export function readOrderTemplates( update_order_templates_only = false ){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { action : 'read_order_templates' }
      })
      .then( response => {

        dispatch(hideSpinner())

        let {
          accounts = []
        } = response.data

        accounts = accounts.map( account => {
          return {
            ...account,
            templates : account.templates && account.templates.length 
              ? account.templates
              : [ { id : 0, is_draft : false } ]
          }
        } )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            order_templates : accounts
          }
        })

        if( !update_order_templates_only ){
          if( accounts.length > 0 ){
            let firstTemplate = accounts[ 0 ] || {}

            let {
              account_number,
              templates = []
            } = firstTemplate

            let active_template = templates[ 0 ]

            let {
              id
            } = active_template

            readOrderTemplateWithParams({ 
              account_number,
              id,
              initialRequest : true
            })( dispatch, getState )

            dispatch({
              type : SET_ROOT_REDUX_STATE,
              data : { 
                templates,
                active_template
              }
            })
          }
        }
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function readOrderDefaultTemplate(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action : 'read_order_default_template'
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            html : response.data.html,
            editor_value_changed : true
          }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function readOrderTemplateWithParams({ account_number, id, initialRequest }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action : 'read_order_template',
          account_number,
          id
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let data = {
          ...response.data ,
          account_number,
          editor_value_changed : false,
        }

        if( initialRequest ) data.initialRequest = true

        dispatch({ type : SET_ROOT_REDUX_STATE, data })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}


export function updateOrderTemplateWithParams({ account_number, html, active }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    let {
      active_template = {},
      order_templates = [],
      templates
    } = getState().shipNotification

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'update_order_template',
          data    : {
            account_number,
            html,
            active,
            id : active_template[ 'id' ],
            is_draft : active_template[ 'is_draft' ]
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        showToaster({
          isSuccess : true,
          message : 'Email template saved successfully!'
        })( dispatch, getState )

        readOrderTemplates( true )( dispatch, getState )

        let templates_

        if( active_template[ 'id' ] === 0 ){
          
          active_template = {
            ...active_template,
            id : response.data.id
          }

          order_templates = order_templates.map(
            ( account, index ) => {
              let {
                account_number : account_number_, 
                templates
              } = account
              if( account_number !== account_number_ ) return account
              templates = templates.map(  
                template => ({ 
                  ...template, 
                  id : template.id === 0 ? response.data.id : template.id 
                })
              )
              templates_ = templates
              return {
                ...account, 
                templates
              }
            }
          )
        }

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            ...response.data,
            editor_value_changed : false,
            active_template,
            order_templates,
            templates : templates_ || templates
          }
        })
      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function emailSample({ email_value }){
  return function( dispatch, getState ){

    let {
      html,
      account_number,
      order_number
    } = getState().shipNotification

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'email_order_template',
          email : email_value,
          html,
          order_number,
          account_number
        }
      })
      .then( response => {

        dispatch(hideSpinner())
        
        showToaster({
          isSuccess : true,
          message : 'Successfully sent!'
        })( dispatch, getState )

      })
      .catch( error => {
        dispatch(hideSpinner())
      })
  }
}

export function deleteOrderTemplate(){
  return function( dispatch, getState ){

    let {
      account_number,
      active_template
    } = getState().shipNotification

    let {
      id
    } = active_template

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'delete_order_template',
          id,
          account_number
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let {
          accounts = []
        } = response.data

        accounts = accounts.map( account => {
          return {
            ...account,
            templates : account.templates && account.templates.length 
              ? account.templates
              : [ { id : 0, is_draft : false } ]
          }
        } )
        
        let index = accounts.findIndex( ({ account_number : acc_ }) => acc_ === account_number ) 
        
        let active_account = accounts[ index ]

        let {
          templates = []
        } = active_account

        let {
          id
        } = templates[ 0 ] || {}

        readOrderTemplateWithParams({ 
          account_number,
          id
        })( dispatch, getState )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            templates,
            active_template : templates[ 0 ] || {},
            order_templates : accounts
          }
        })
        
        showToaster({
          isSuccess : true,
          message : 'Successfully deleted!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function createNewOrderTemplateDraft(){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    let {
      account_number,
      templates,
      order_templates
    } = getState().shipNotification

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'new_order_template',
          account_number
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let {
          active,
          html,
          is_draft,
          id,
        } = response.data        

        let templates_ = [
          ...templates,
          {
            id,
            is_draft
          }
        ]

        order_templates = order_templates.map( account => ({
          ...account,
          templates : account.account_number === account_number 
            ? templates_
            : account.templates
        }) )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            templates : templates_,
            active_template : {
              id,
              is_draft
            },
            order_templates,
            account_number,
            active,
            html
          }
        })
        
        showToaster({
          isSuccess : true,
          message : 'Successfully created!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}

export function promoteOrderTemplate(){
  return function( dispatch, getState ){

    let {
      account_number,
      active_template
    } = getState().shipNotification

    let {
      id
    } = active_template

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'promote_order_template',
          id,
          account_number
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        let {
          accounts = []
        } = response.data

        accounts = accounts.map( account => {
          return {
            ...account,
            templates : account.templates && account.templates.length 
              ? account.templates
              : [ { id : 0, is_draft : false } ]
          }
        } )
        
        let index = accounts.findIndex( ({ account_number : acc_ }) => acc_ === account_number ) 
        
        let active_account = accounts[ index ]

        let {
          templates = []
        } = active_account

        let {
          id
        } = templates[ 0 ] || {}

        readOrderTemplateWithParams({ 
          account_number,
          id
        })( dispatch, getState )

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : { 
            templates,
            active_template : templates[ 0 ] || {},
            order_templates : accounts
          }
        })
        
        showToaster({
          isSuccess : true,
          message : 'Successfully promoted to master!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        dispatch(hideSpinner())
        return Promise.reject()
      })
  }
}


export function readReceiptEmail({ receipt_email_type }){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({
      type : SET_ROOT_REDUX_STATE, 
      data : {
        receipt_accounts : []
      }
    })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'read_receipt_email',
          type : receipt_email_type
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE, 
          data : {
            receipt_accounts : response.data
          }
        })

      })
      .catch( error => {
        
        dispatch(hideSpinner())
      })
  }
}

export function updateReceiptEmail({ type } = {}){
  return function( dispatch, getState ){

    dispatch(showSpinner())

    dispatch({
      type : SET_ROOT_REDUX_STATE, 
      data : {
        updatingAccountEmail : true
      }
    })

    let {
      account_number,
      location,
      email
    } = getState().shipNotification.receipt_account_being_edited || {}

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/notification', {
        method : 'post',
        data : { 
          action  : 'update_receipt_email',
          data : {
            type,
            account_number,
            location,
            email
          }
        }
      })
      .then( response => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE, 
          data : {
            receipt_accounts : response.data.receipt_accounts,
            updatingAccountEmail : false
          }
        })

        showToaster({
          isSuccess : true,
          message : 'Email address saved successfully!'
        })( dispatch, getState )

        return Promise.resolve()

      })
      .catch( error => {
        
        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE, 
          data : {
            updatingAccountEmail : false
          }
        })

        return Promise.reject()

      })
  }
}

/*=====  End of FILTER RELATED ACTIONS  ======*/