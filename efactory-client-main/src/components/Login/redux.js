import Fetcher          from '../../util/Request'
import moment           from 'moment'
import downloadSource   from '../_Helpers/DownloadSource'
import config           from '../../util/config'
import {getAuthData}    from '../../util/storageHelperFuncs';
const
  namespace = 'auth',
  // subActions = ['SUCCESS', 'ERROR'],

  /************ CONSTANTS ************/

  /* for async actions , includes subactions */
  //EXAMPLE_ASYNC = defineAction( 'EXAMPLE_ASYNC', subActions, namespace ),

  /* for normal actions , doesn t include subactions */
  SET_ROOT_REDUX_STATE  = `SET_ROOT_REDUX_STATE__${namespace}`,
  INITIALIZE_REDUX_STATE  = `INITIALIZE_REDUX_STATE__${namespace}`,

  /* initial state for this part of the redux state */
  initialState = {
    available_accounts : [],
    online_customer_rows : [],
    license_summary_rows : [],
    online_customer_date : '',
    total_online_customer_rows : 0,
    total_license_summary_rows : 0,
    ip_address_detail : {},
    admin_roles : [],
    loadingAdminPage : false,
    month : moment().subtract(1, 'month').format('MM'),
    year : moment().subtract(1, 'month').format('YYYY'),
    loading : false,
    loadedSummaries : false,
    announcements_overview_articles : [],
    announcements_overview_articles_active_row : {},
    announcements_overview_articles_active_row_id : '',

    announcements_archive_articles : [],
    announcements_archive_articles_active_row : {},
    announcements_archive_articles_active_row_id : '',

    announcements_articles : [],
    announcements_articles_active_row : {},
    announcements_articles_active_row_id : '',
    preview_data : {},
    edit_article_data : {
      selected_customers : ['*']
    },
    edit_article_dirty : false,
    isSuccessToaster : '',
    toasterMessage : '',
    user_stats : [],
    user_stats_date : '',
    loadedUserStats : false
    // isChangeUserRedirected : false
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
      return {
        ...initialState
      }
    default:
      return state

  }

}

// ACTIONS


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

export function initializeGridReduxState(){
  return function( dispatch, getState ){
    dispatch({ type: INITIALIZE_REDUX_STATE })
    return Promise.resolve()
  }
}

export function logout(){
  return function( dispatch, getState ){
    dispatch({ type: 'LOGOUT' })
    return Promise.resolve()
  }
}

export function logoutWithoutDeletingToken(){
  return function( dispatch, getState ){
    dispatch({ type: 'LOGOUT_WITHOUT_DELETE_TOKEN' })
    return Promise.resolve()
  }
}

export function loginAsync(
  username = '', 
  password = '', 
  rememberUsername = false,
  dcl_user = false,
  force_logout = false
){
  return function ( dispatch, getState){
    
    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/authentication', {
        method : 'post',
        data : {
          func : 'login',
          username,
          password,
          dcl_user,
          force_logout
        }
      })
      .then( response => {

        if( rememberUsername ){

          localStorage.setItem('rememberUsername', username )

        }else{

          localStorage.removeItem('rememberUsername' )

        }

        return Promise.resolve( response )

      })
      .catch( error => {
        
        let { 
          error_message = 'An error occurred',
          anotherUserLoggedIn = false
        } = error || {}

        return Promise.reject({ error_message, anotherUserLoggedIn })

      })
    }
}

export function selectUserAsync( account = '' ){
  return function (dispatch){
    
    const fetcher = new Fetcher()

    return fetcher.fetch('/api/authentication', {
      method : 'post',
      data : {
        func : 'loginForAccount',
        account
      }
    })
    .then( response => {
      
      return Promise.resolve( response )

    })
    .catch( error => {
      
      let { error_message = 'An error occurred' } = error || {}
      
      return Promise.reject( error_message )

    })
  }
}

export function checkAuth(){
  return function ( dispatch, getState ){
    const fetcher = new Fetcher()
    return fetcher
      .fetch('/api/authentication', {
        method: 'post',
        data: {
          func: 'isAuth'
        }
      }).then(
        response => {
          localStorage.setItem(
            'is_local', 
            response.data 
             ? response.data.is_local
               ? 'true'
               : 'false' 
             : 'false'
          )
          return Promise.resolve({
            isAuth: true
          })
        }
      )
      .catch(
        error => {
          error = error ? error : {}  
          localStorage.setItem(
            'is_local', 
            error.data 
             ? error.data.is_local
               ? 'true'
               : 'false' 
             : 'false'
          )
          return Promise.resolve({
            isAuth: false
          })
        }
      )
    }
}

export function listAccounts(){
  return function ( dispatch, getState ){
    
    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/authentication', {
        method : 'post',
        data : {
          func : 'loadAccounts'
        }
      })
      .then(
        response => {
          logoutWithoutDeletingToken()( dispatch, getState )
          let authToken = localStorage.getItem( 'authToken' )
          authToken = JSON.parse( authToken )
          let authTokenToStore = JSON.stringify( { 
            api_token : authToken.api_token,
            available_accounts : response.data.available_accounts,
            admin_roles : response.data.admin_roles || [] ,
          } )
          localStorage.setItem( 'authToken', authTokenToStore )
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          return Promise.reject()
        }
      )
    }
}

export function listOnlineCustomers(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        online_customer_rows : [],
        online_customer_date : '',
        total_online_customer_rows : 0,
        loadingAdminPage : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          resource : 'online_customers',
          action : 'read'
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              online_customer_rows : response.data.rows,
              online_customer_date : response.data.date,
              total_online_customer_rows : response.data.rows.length,
              loadingAdminPage : false
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loadingAdminPage : false
            }
          })
          return Promise.reject()
        }
      )
    }
}

export function getIpDetails( ip_address ){
  return function ( dispatch, getState ){

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loadingAdminPage : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/global', {
        method : 'post',
        data : {
          action: 'ip_location',
          ip_address
        }
      })
      .then(
        response => {

          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loadingAdminPage : false
            }
          })

          let { latitude, longitude } = response.data
          return Promise.resolve({
            latitude, longitude
          })
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loadingAdminPage : false
            }
          })
          return Promise.reject()
        }
      )
    }
}

export function listLicenseSummaries( month, year ){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        license_summary_rows : [],
        total_license_summary_rows : 0,
        month,
        year,
        loading : true,
        loadedSummaries : false
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          resource : 'efactory_license_summary',
          action : 'read',
          month,
          year
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              license_summary_rows : response.data.rows,
              license_summary_date : response.data.date,
              total_license_summary_rows : response.data.rows.length,
              loading : false,
              loadedSummaries : true
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              loadedSummaries : false
            }
          })
          return Promise.reject()
        }
      )
    }
}

export function downloadLicenseSummary(){
  return function ( dispatch, getState ){

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    let setNotLoading = () => dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : false
      }
    })
    
    let { month, year } = getState().auth

    downloadSource(
      '/api/account', 
      JSON.stringify({
        action : 'export',
        resource :'efactory_license_summary',
        month, 
        year
      }), 
      {
        onSuccessAction : setNotLoading,
        onErrorAction   : setNotLoading
      },
      false
    )

    }
}

export function downloadUserStats(){
  return function ( dispatch, getState ){

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    let setNotLoading = () => dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : false
      }
    })

    downloadSource(
      '/api/account', 
      JSON.stringify({
        action : 'export',
        resource :'user_stat'
      }), 
      {
        onSuccessAction : setNotLoading,
        onErrorAction   : setNotLoading
      },
      false
    )

    }
}


/*=====================================
=            ANNOUNCEMENTS            =
=====================================*/

export function readOverviewArticles(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        announcements_overview_articles : [],
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'overview',
          action : 'read'
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              announcements_overview_articles : response.data.articles,
              loading : false,
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function readArchiveArticles(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        announcements_archive_articles : [],
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'archive',
          action : 'read'
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              announcements_archive_articles : response.data.articles,
              loading : false,
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function readArticles(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        announcements_articles : [],
        loading : true,
        announcements_articles_active_row : {},
        announcements_articles_active_row_id : '',
        preview_data : {}
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'articles',
          action : 'read'
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              announcements_articles : response.data.articles,
              loading : false,
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function fetchArticlePreviewData( id ){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        preview_data : {},
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'preview',
          id
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              preview_data : response.data,
              loading : false,
            }
          })
          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}


export function duplicateArticle( id ){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'duplicate',
          id
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              preview_data : response.data,
              loading : false,
            }
          })

          readArticles()( dispatch, getState )

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function newArticle(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'new'
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              edit_article_data : {
                ...response.data,
                selected_customers : ['*'],
                is_draft : true
              },
              loading : false,
            }
          })

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}


export function editArticle( id ){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'read',
          id
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              edit_article_data : response.data,
              loading : false,
            }
          })

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function deleteArticle( id ){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'delete',
          id
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })

          readArticles()( dispatch, getState )

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function saveArticle(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    let data = getState().auth.edit_article_data

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'save',
          data
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              isSuccessToaster : true,
              toasterMessage : `Successfully ${ data.is_draft ? 'saved draft' : 'published article'}!`,
              edit_article_data : response.data,
              edit_article_dirty : false
            }
          })

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          let { error_message = 'An error occured' } = error || {}
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              isSuccessToaster : false,
              toasterMessage : error_message
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function deleteAttachment( id, attachment_id,  ){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/announcements', {
        method : 'post',
        data : {
          resource : 'article',
          action : 'delete_attachment',
          attachment_id, 
          id : +id
        }
      })
      .then(
        response => {
          let { edit_article_data } = getState().auth
          let { attachments = [] } = edit_article_data
          
          attachments = attachments.filter( ({ id }) => id !== attachment_id )

          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              isSuccessToaster : true,
              toasterMessage : `Successfully deleted attachment!`,
              edit_article_data : {
                ...edit_article_data,
                attachments
              }
            }
          })

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          let { error_message = 'An error occured' } = error || {}
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              isSuccessToaster : false,
              toasterMessage : error_message
            }
          })
          return Promise.resolve()
        }
      )
    }
}

export function uploadDocument( file ){
  return function(dispatch, getState) {

    
    let { id } = getState().auth.edit_article_data

    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    formData.append("file", file)

    let abortRequest 
    let onRequestEnd 
    let makePercentageChanges
    let showServerIsProcessingMessage
    
    if( navigator.userAgent.includes('Firefox') ){
      xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable){ 
          var percentComplete = (event.loaded / event.total) * 100
          percentComplete = Math.floor( percentComplete )
          makePercentageChanges( percentComplete )
        } else {
          console.warn("Unable to compute progress information since the total size is unknown")
        }
      }, false)
    }

    xhr.open('POST', `${config.host}/api/upload`, true)
    let token = getAuthData().api_token
    
    xhr.setRequestHeader('X-Access-Token', token );
    xhr.setRequestHeader('X-Upload-Params', JSON.stringify({
      func : 'announcement_upload', id
    }) );
    
    let divToChangeWidth        = global.$('#uploading-bar')
    let spanToChangePercentage  = global.$('#uploading-percentage')

    makePercentageChanges = ( percentage ) => {
      if( divToChangeWidth && spanToChangePercentage ){
        divToChangeWidth.css({ width : `${percentage}%` })
        spanToChangePercentage.html(`${percentage}%`)
        if( percentage === 100 ){
          showServerIsProcessingMessage()
        }
      }else{
        console.error(
          'Updating percentage values failed because ' +
          'elements with the ids #uploading-bar and #uploading-percentage ' +
          'doesn t exist.'
        )
      }
    }

    showServerIsProcessingMessage = () => {
      global.$('#upload-file-dialog').addClass('server-processing')
    }

    abortRequest = () => {
      xhr.abort()
      onRequestEnd()
    }

    onRequestEnd = () => {
      global.$('#dismiss-uploading').off('click', abortRequest )
      global.$('#upload-file-dialog').css({ display : 'none' })
      global.$('#upload-file-dialog').removeClass('server-processing')
      divToChangeWidth.css({ width : '0' })
      spanToChangePercentage.html('0%')
    }

    if ( !navigator.userAgent.includes('Firefox') ) {
      xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable){ 
          var percentComplete = (event.loaded / event.total) * 100
          percentComplete = Math.floor( percentComplete )
          makePercentageChanges( percentComplete )
        } else {
          console.warn("Unable to compute progress information since the total size is unknown")
        }
      }, false)
    }
    // for Firefox:

    // xhr.addEventListener('progress', function(e) {
    //     console.log('progress');
    // }, false)

    global.$('#dismiss-uploading').on('click', abortRequest )

    xhr.onload = function () {

      if (this.status >= 200 && this.status < 300) {
        let response = JSON.parse(xhr.response)
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            isSuccessToaster : true,
            toasterMessage : 'Successfully uploaded file!',
            edit_article_data : {
              ...getState().auth.edit_article_data,
              attachments : response.data && response.data.attachments
            }
          }
        })
        onRequestEnd()
      }else{
        onRequestEnd()
        let response = JSON.parse(xhr.response)
        let { error_message } = response
        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            isSuccessToaster : false,
            toasterMessage : error_message
          }
        })
      }
    }
    xhr.onerror = function () {
      
      let { error_message } = xhr.response
      dispatch({
        type : SET_ROOT_REDUX_STATE,
        data : {
          isSuccessToaster : false,
          toasterMessage : error_message
        }
      })
      onRequestEnd()
    }

    global.$('#upload-file-dialog').css({ display : 'block' })
    xhr.send(formData)
  }
}

export function readUserStats(){
  return function ( dispatch, getState ){
    
    dispatch({ 
      type : SET_ROOT_REDUX_STATE,
      data : {
        loading : true,
        user_stats : [],
        user_stats_date : '',
        loadedUserStats : false
      }
    })

    const fetcher = new Fetcher()      

    return fetcher
      .fetch('/api/account', {
        method : 'post',
        data : {
          resource : 'user_stat',
          action : 'read'
        }
      })
      .then(
        response => {
          
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              user_stats : response.data.rows,
              user_stats_date : response.data.date,
              loadedUserStats : true
            }
          })

          return Promise.resolve()
        }
      )
      .catch(
        error => {
          let { error_message = 'An error occured' } = error || {}
          dispatch({
            type : SET_ROOT_REDUX_STATE,
            data : {
              loading : false,
              isSuccessToaster : false,
              toasterMessage : error_message,
              loadedUserStats : false
            }
          })
          return Promise.resolve()
        }
      )
    }
}

/*=====  End of ANNOUNCEMENTS  ======*/
