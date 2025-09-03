import {
  showToaster,
  showSpinner,
  hideSpinner
}                       from '../../_Helpers/actions'

// CONSTANTS
const
  GET_LIST = 'GET_LIST',
  GET_LIST_SUCCESS = 'GET_LIST_SUCCESS',
  GET_LIST_FAIL = 'GET_LIST_FAIL',
  UPLOAD_FILE = 'UPLOAD_FILE',
  UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS', // get disk
  UPLOAD_FILE_FAIL = 'UPLOAD_FILE_FAIL',
  DOWNLOAD_FILE = 'DOWNLOAD_FILE',
  DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS',
  DOWNLOAD_FILE_FAIL = 'DOWNLOAD_FILE_FAIL',
  CREATE_FOLDER = 'CREATE_FOLDER',
  CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS',
  CREATE_FOLDER_FAIL = 'CREATE_FOLDER_FAIL',
  CLEAR_GET_LIST_DATA = 'CLEAR_GET_LIST_DATA',
  SET_GET_LIST_PARAMS = 'SET_GET_LIST_PARAMS',
  DELETE_FOLDER = 'DELETE_FOLDER',  // get disk
  DELETE_FOLDER_SUCCESS = 'DELETE_FOLDER_SUCCESS',
  DELETE_FOLDER_FAIL = 'DELETE_FOLDER_FAIL',
  RENAME_FOLDER = 'RENAME_FOLDER',
  RENAME_FOLDER_SUCCESS = 'RENAME_FOLDER_SUCCESS',
  RENAME_FOLDER_FAIL = 'RENAME_FOLDER_FAIL',
  SET_CHECKED_ROWS = 'SET_CHECKED_ROWS',
  SET_CHECKED_ROWS_ALL = 'SET_CHECKED_ROWS_ALL',
  SET_DOCUMENTS_PAGINATION = 'SET_DOCUMENTS_PAGINATION',
  SET_SELECTED_FOLDER_ID_TREEVIEW = 'SET_SELECTED_FOLDER_ID_TREEVIEW',
  LOAD_SUBFOLDERS_TREEVIEW = 'LOAD_SUBFOLDERS_TREEVIEW',
  LOAD_SUBFOLDERS_TREEVIEW_SUCCESS = 'LOAD_SUBFOLDERS_TREEVIEW_SUCCESS',
  LOAD_SUBFOLDERS_TREEVIEW_FAIL = 'LOAD_SUBFOLDERS_TREEVIEW_FAIL',
  MOVE_FILE = 'MOVE_FILE',
  MOVE_FILE_SUCCESS = 'MOVE_FILE_SUCCESS',
  MOVE_FILE_FAIL = 'MOVE_FILE_FAIL',
  SET_DOCUMENT_SORT = 'SET_DOCUMENT_SORT',
  GET_DISK_USAGE = 'GET_DISK_USAGE',
  GET_DISK_USAGE_SUCCESS = 'GET_DISK_USAGE_SUCCESS',
  GET_DISK_USAGE_FAIL = 'GET_DISK_USAGE_FAIL',
  SET_ROOT_STATE_DOCUMENTS = 'SET_ROOT_STATE_DOCUMENTS'

// REDUCER
const initialState = {
    list : false,
    loadinglist: false,
    loadedlist:false,
    loadlistError:false,
    checkedRows:{},
    page_number: 1,
    page_size : 50,
    document_sort : { order_modifiedat : 'desc' },
    error : false,
    selectedFolderId : null,
    selectedFolderListId : null,
    disk_usage : {
      total: '',
      recycle: ''
    },
    replaceIfExist : false,
    watchVideoData : {
      id : '', // used as source
      company_code : '',
      list_id     : '',
      mime : '', // used as mime_type
      name : ''
    }
}

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case GET_LIST:
      return {
        ...state,
        loadinglist : true,
        loadedlist:false,
        error:false
      }
    case GET_LIST_SUCCESS:
      return {
        ...state,
        loadinglist : false,
        loadedlist  : true,
        list : action.data,
        checkedRows : {}
      }
    case GET_LIST_FAIL:
      return {
        ...state,
        loadinglist : false,
        loadedlist  : false,
        error : action.data
      }
    case MOVE_FILE:
      return {
        ...state,
        movingFile : true,
        movedFile:false,
        error:false
      }
    case MOVE_FILE_SUCCESS:
      return {
        ...state,
        movingFile : false,
        movedFile  : action.data,
        checkedRows : {}
      }
    case MOVE_FILE_FAIL:
      return {
        ...state,
        movingFile : false,
        movedFile  : false,
        error : action.data
      }
    case UPLOAD_FILE:
      return {
        ...state,
        uploadingFile : true,
        uploadedFile:false,
        error:false
      }
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        uploadingFile : false,
        uploadedFile  : true,
        checkedRows : {}
      }
    case UPLOAD_FILE_FAIL:
      return {
        ...state,
        uploadingFile : false,
        uploadedFile  : false,
        error : action.data
      }
    case LOAD_SUBFOLDERS_TREEVIEW:
      return {
        ...state,
        loadingSubfolders : true,
        loadedSubfolders:false,
        error:false
      }
    case LOAD_SUBFOLDERS_TREEVIEW_SUCCESS:
      return {
        ...state,
        loadingSubfolders : false,
        loadedSubfolders  : action.data,
        ...action.data
      }
    case LOAD_SUBFOLDERS_TREEVIEW_FAIL:
      return {
        ...state,
        loadingSubfolders : false,
        loadedSubfolders  : false,
        error : action.data
      }
    case DOWNLOAD_FILE:
      return {
        ...state,
        downloadingFile : true,
        downloadedFile:false,
        error:false
      }
    case DOWNLOAD_FILE_SUCCESS:
      return {
        ...state,
        downloadingFile : false,
        downloadedFile  : true
      }
    case DOWNLOAD_FILE_FAIL:
      return {
        ...state,
        downloadingFile : false,
        downloadedFile  : false,
        error : action.data
      }
    case CREATE_FOLDER:
      return {
        ...state,
        loadinglist : true,
        loadedlist:false,
        error:false
      }
    case CREATE_FOLDER_SUCCESS:
      return {
        ...state,
        loadinglist : false,
        loadedlist  : true,
        list : action.data,
        checkedRows : {}
      }
    case CREATE_FOLDER_FAIL:
      return {
        ...state,
        loadinglist : false,
        loadedlist  : false,
        error : action.data
      }
    case DELETE_FOLDER:
      return {
        ...state,
        loadinglist : true,
        loadedlist : false,
        error : false
      }
    case DELETE_FOLDER_SUCCESS:
      return {
        ...state,
        loadinglist : false,
        loadedlist : true,
        list : action.data,
        checkedRows : {}
      }
    case DELETE_FOLDER_FAIL:
      return {
        ...state,
        loadinglist : false,
        loadedlist : false,
        error : action.data
      }
    case RENAME_FOLDER:
      return {
        ...state,
        loadinglist : true,
        loadedlist : false,
        error : false
     }
    case RENAME_FOLDER_SUCCESS:
      return {
        ...state,
        loadinglist : false,
        loadedlist : true,
        list : action.data,
        checkedRows : {}
      }
    case RENAME_FOLDER_FAIL:
      return {
        ...state,
        loadinglist : false,
        loadedlist : false,
        error : action.data
      }
    case SET_CHECKED_ROWS:
      return {
        ...state,
        ...action.data
      }
    case SET_CHECKED_ROWS_ALL:
      return {
        ...state,
        ...action.data
      }
    case CLEAR_GET_LIST_DATA:
      return {
        ...state,
        list : false,
        loadinglist: false,
        loadedlist:false,
        error:false,
        checkedRows : {}
      }
    case SET_DOCUMENTS_PAGINATION:
      return {
        ...state,
        ...action.data,
        checkedRows : {}
      }
    case SET_GET_LIST_PARAMS:
      return {
        ...state,
        ...action.data
      }
    case SET_SELECTED_FOLDER_ID_TREEVIEW:
      return {
        ...state,
        ...action.data
    }
    case SET_DOCUMENT_SORT:
      return {
        ...state,
        document_sort : action.data,
        checkedRows : {}
      }
    case GET_DISK_USAGE:
      return {
        ...state,
        loadingDiskUsage : true,
        loadedDiskUsage:false,
        error:false
      }
    case GET_DISK_USAGE_SUCCESS:
      return {
        ...state,
        loadingDiskUsage : false,
        loadedDiskUsage  : true,
        disk_usage : action.data
      }
    case GET_DISK_USAGE_FAIL:
      return {
        ...state,
        loadingDiskUsage : false,
        loadedDiskUsage  : false,
        error : action.data
      }
    case SET_ROOT_STATE_DOCUMENTS:
      return {
        ...state,
        ...action.data
      }
    default:
      return state;
  }
};


// ACTIONS

/* --- SET ROOT VARIABLES ACTION START ------------ */
export function setRootStatePropertyDocuments( data = {} ){
  return function(dispatch, getState) {

    dispatch({
      type : SET_ROOT_STATE_DOCUMENTS,
      data
    })

    return Promise.resolve()
  }
}
/* --- SET ROOT VARIABLES ACTION END ------------ */

/* ----------------- GET LIST ACTIONS START ----------------- */
import Fetcher from '../../../util/Request';

export function clearGetlistData() {
  return {
    type : CLEAR_GET_LIST_DATA
  }
};
export function setPagination(page_number) {
  return {
    type : SET_DOCUMENTS_PAGINATION,
    data : { page_number }
  }
}
// set get list params
// ex. data = { list_id, parent_id }
const setListParams = data => ( dispatch, getState ) =>  {
  dispatch({ type : SET_GET_LIST_PARAMS, data })
}
export { setListParams }

const getlistAsync = ( filter = '' ) => ( dispatch, getState ) =>  {
  const fetcher = new Fetcher();
  let { list_id, parent_id, page_number, page_size, document_sort } = getState().documents.documents;
  let sort_by = document_sort['order_name'] ? 'name' : (document_sort['order_modifiedat'] ? 'modifiedat': 'size')
  let sort_dir = document_sort['order_name'] ? document_sort.order_name : (document_sort['order_modifiedat'] ? document_sort.order_modifiedat: document_sort.order_size)
  dispatch({ type : GET_LIST });
  dispatch(showSpinner())
  fetcher
    .fetch('/api/documents', {
       method : 'post',
       data : { action :"list", list_id, parent_id, filter, page_number, page_size, sort_by, sort_dir }
     })
    .then( response => {
      //dispatch( setPagination(all[1], response.data.total) )
      dispatch(hideSpinner())
      dispatch({ type : GET_LIST_SUCCESS, data : response.data }); // { type :"",views : ...}
      dispatch( setPagination(response.data.page_number) )
    })
    .catch( error =>  {
      dispatch(hideSpinner())
      let { error_message = 'An error occurred' } = error || {}
      dispatch({ type : GET_LIST_FAIL, data : error_message })
    } );
}
export {getlistAsync}
/* ----------------- GET LIST ACTIONS END ----------------- */

/* ----------------- UPLOAD DOCUMENT ACTIONS START ----------------- */
import config                       from '../../../util/config';
import {getAuthData}                from '../../../util/storageHelperFuncs';
export function uploadDocument( file ){
  return function(dispatch, getState) {

    dispatch({ type : UPLOAD_FILE })
    let { list_id, parent_id } = getState().documents.documents;
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
      func : 'document_upload', list_id, parent_id
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
        dispatch({ type : UPLOAD_FILE_SUCCESS, data : xhr.response.data })
        getlistAsync()(dispatch,getState)
        getDiskUsage()(dispatch,getState)
        onRequestEnd()
      }else{
        onRequestEnd()
        let response = JSON.parse(xhr.response)
        let { error_message } = response
        showToaster({
          isSuccess : false,
          message : error_message
        })( dispatch, getState )
      }
    }
    xhr.onerror = function () {

      let { error_message } = xhr.response
      showToaster({
        isSuccess : false,
        message : error_message
      })( dispatch, getState )
      dispatch({ type : UPLOAD_FILE_FAIL, data : error_message })
      onRequestEnd()
    }

    global.$('#upload-file-dialog').css({ display : 'block' })
    xhr.send(formData)
  }
}
/* ----------------- UPLOAD DOCUMENT ACTIONS END ----------------- */

/* ----------------- DOWNLOAD DOCUMENT ACTIONS START ----------------- */

import downloadSource from '../../_Helpers/DownloadSource';

export function downloadDocument( id ){
  return function(dispatch, getState) {

    dispatch(showSpinner())

    dispatch({ type : DOWNLOAD_FILE })

    downloadSource(
      `/api/documents/${id}`,
      undefined,
      {
        onSuccessAction : () => {
          dispatch(hideSpinner())
          dispatch({ type : DOWNLOAD_FILE_SUCCESS })
        },
        onErrorAction : () =>  {
          dispatch(hideSpinner())
          showToaster({
            isSuccess : false,
            message : 'File not found!'
          })( dispatch, getState )
          return dispatch({ type : DOWNLOAD_FILE_FAIL })
        }
      }
    );
  }
}
/* ----------------- DOWNLOAD DOCUMENT ACTIONS END ----------------- */

/* ----------------- CREATE FOLDER ACTIONS START ----------------- */
export function createFolder(name = ''){
  return function(dispatch,getState) {
    const fetcher = new Fetcher()
    let { list_id, parent_id } = getState().documents.documents;
    dispatch({ type : CREATE_FOLDER })
    let params = { action : 'create_folder', list_id, name, parent_id }
    fetcher
      .fetch('/api/documents', {
         method : 'post',
         data : params
       })
      .then((response) => {
        dispatch({
          type : CREATE_FOLDER_SUCCESS,
          data : response.data
        })
        getlistAsync()(dispatch,getState);
      }).catch( e => {})
  }
}
/* ----------------- CREATE FOLDER ACTIONS END ----------------- */

/* ----------------- DELETE FOLDER ACTIONS START ----------------- */
export function deleteFolder() {
  return function( dispatch, getState ) {

    let { checkedRows } = getState().documents.documents
    const fetcher = new Fetcher()
    dispatch({ type : DELETE_FOLDER })
    let params = { action : 'delete', ids : Object.keys(checkedRows) }
    fetcher
      .fetch('/api/documents', {
        method : 'post',
        data : params
      })
      .then(( response ) => {
        dispatch({
          type : DELETE_FOLDER_SUCCESS,
          data : response.data
        })
        getDiskUsage()(dispatch,getState)
        getlistAsync()( dispatch, getState )
      })
      .catch(( error ) => {
        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : DELETE_FOLDER_FAIL,
          data : error_message
        })
      })
  }
}
/* ----------------- DELETE FOLDER ACTIONS END ----------------- */

/* ----------------- RENAME FOLDER ACTIONS START ----------------- */
export function renameFolder( name = '' ) {
  return function( dispatch, getState ) {
    let { checkedRows } = getState().documents.documents
    if( Object.keys( checkedRows ).length !== 1 ){
      return console.error('only one checkedRow accepted for renameFolder actionCreator')
    }
    let id = Object.keys(checkedRows)[0]
    let { list } = getState().documents.documents.list
    for( var i = 0; i < list.length; i++ ) {
      if( list[i].id === id ) {
        name = list[i].is_folder ? name : name + list[i].name.substr(list[i].name.lastIndexOf('.'))
      }
    }
    const fetcher = new Fetcher()
    dispatch({ type: RENAME_FOLDER })
    let params = { action: 'rename', id, name }
    fetcher
      .fetch('/api/documents', {
        method : 'post',
        data : params
      })
      .then((response) => {
        dispatch({
          type : RENAME_FOLDER_SUCCESS,
          data : response.data
        })
        getlistAsync()(dispatch, getState)
      })
      .catch( error => {
        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : RENAME_FOLDER_FAIL,
          data : error_message
        })
      })
  }
}
/* ----------------- RENAME FOLDER ACTIONS END ----------------- */

/* ----------------- CHECKED ROWS ACTIONS START ----------------- */
export function toggleCheckedRow( id, empty = false ) {
  return function( dispatch, getState ) {

    if( empty ) return dispatch({ type : SET_CHECKED_ROWS, data : { checkedRows : {} } })

    let { checkedRows } = getState().documents.documents
    let checkedRowsCopy = { ...checkedRows }
    if( checkedRowsCopy[id] ) {
      delete checkedRowsCopy[id]
    }else{
      checkedRowsCopy[id] = true
    }
    dispatch({
      type : SET_CHECKED_ROWS,
      data : { checkedRows : checkedRowsCopy }
    })
  }
}
export function toggleAllRowsChecked( checkType = '' ) {
  return function( dispatch, getState ) {
    if( checkType === '' ) return console.error('toggleAllRowsChecked expected' +
                                                'checkType to be one of <all> or <none>' +
                                                'received nothing');
    let checkedRows = {}
    if( checkType === 'all' ){
      let { list } = getState().documents.documents.list
      if( list && list.length ){
        list.forEach( l => { checkedRows[ l.id ] = true } )
      }
    }
    dispatch({
      type : SET_CHECKED_ROWS,
      data : { checkedRows }
    })
  }
}
/* ----------------- CHECKED ROWS ACTIONS END ----------------- */

/* ----------------- SET SELECTED FOLDER ACTION START ----------------- */
export function setSelectedFolderId( parent_id = null, list_id = null ) {
  return function( dispatch, getState ) {
    dispatch({
      type : SET_SELECTED_FOLDER_ID_TREEVIEW,
      data : {
        selectedFolderId : parent_id,
        selectedFolderListId : list_id
      }
    })
  }
}
/* ----------------- SET SELECTED FOLDER ACTION END ----------------- */

/* ----------------- SET SELECTED FOLDER ACTION START ----------------- */
export function loadSubfolders({
  parent_id = null,
  list_id = '',
  path = []
}) {
  return function( dispatch, getState ) {
    dispatch({ type : LOAD_SUBFOLDERS_TREEVIEW })

    const fetcher = new Fetcher()

    return fetcher
      .fetch('/api/documents', {
        method : 'post',
        data : {
           action: 'get_folders',
           parent_id,
           list_id
        }
      })
      .then((response) => {
        dispatch({
          type : LOAD_SUBFOLDERS_TREEVIEW_SUCCESS,
          data : {
            subfolders : response.data,
            path
          }
        })
      })
      .catch( error => {
        let { error_message = 'An error occurred' } = error || {}
        dispatch({
          type : LOAD_SUBFOLDERS_TREEVIEW_FAIL,
          data : error_message
        })
      })

  }
}
/* ----------------- SET SELECTED FOLDER ACTION END ----------------- */

/* ----------------- MOVE FOLDER ACTION START ----------------- */
export function moveFolder() {
  return function( dispatch, getState ) {

    dispatch({ type : MOVE_FILE })

    const fetcher = new Fetcher()

    let {
      selectedFolderId,
      selectedFolderListId : list_id,
      checkedRows,
      replaceIfExist : overwrite
    } = getState().documents.documents

    fetcher
      .fetch('/api/documents', {
        method : 'post',
        data : {
           action: 'move',
           ids : Object.keys(checkedRows),
           parent_id : isNaN(selectedFolderId) ? selectedFolderId : null,
           list_id,
           overwrite
        }
      })
      .then((response) => {
        dispatch({
          type : MOVE_FILE_SUCCESS,
          data : response.data
        })
        getlistAsync()(dispatch, getState)
      })
      .catch( error => {
        dispatch({
          type : MOVE_FILE_FAIL,
          data : error['error_message']
        })
      })

  }
}

/* ----------------- EXPORT DOCUMENTS ACTION START ----------------- */
export function exportDocuments() {
  return function( dispatch, getState ) {

    dispatch(showSpinner())

    dispatch({ type : DOWNLOAD_FILE })

    let { checkedRows,list,documents } = getState().documents.documents

    documents = list.list.map(document=> {
      if(Object.keys(checkedRows).includes(document.id))
      {
        return {
          id: document.id,
          name:document.name,
          is_folder : document.is_folder,
          mime: document.mime,
          created_at:document.created_at
        };
      }
      return null;
    }).filter(x=>x);

    let data = {
      list_id : list.list[0].list_id,
      documents
    }
    downloadSource('/api/documents', JSON.stringify(data), {
      onSuccessAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Downloaded successfully!'
        })( dispatch, getState )
      },
      onErrorAction : (response) => {
        var decodedString = String.fromCharCode.apply(null, new Uint8Array(response));
        var obj = JSON.parse(decodedString);
        var error_message = obj['error_message'];
        dispatch(hideSpinner())
        showToaster({
          isSuccess : false,
          message : error_message
        })( dispatch, getState )
      }
    })
  }
}
/* ----------------- EXPORT DOCUMENTS ACTION END ----------------- */

/* ----------------- SET DOCUMENT SORT ACTION START ----------------- */
export function setDocumentSort( sort = {} ) {
  return function( dispatch, getState ) {
    dispatch({
      type : SET_DOCUMENT_SORT,
      data : sort
    })
    getlistAsync()( dispatch, getState )
  }
}
/* ----------------- SET DOCUMENT SORT ACTION END ----------------- */

/* ----------------- GET DISK USAGE ACTION START ----------------- */
export function getDiskUsage() {
  return function( dispatch, getState ) {
    dispatch({ type : GET_DISK_USAGE })
    const fetcher = new Fetcher()
    fetcher
      .fetch('/api/documents', {
        method : 'post',
        data : {
          action : "disk_usage"
        }
      })
      .then(( response ) => {
        dispatch({
          type : GET_DISK_USAGE_SUCCESS,
          data : response.data
        })
      })
      .catch( error  => {
        dispatch({
          type : GET_DISK_USAGE_FAIL,
          data : error['error_message']
        })
      })
  }
}
/* ----------------- GET DISK USAGE ACTION END ----------------- */
