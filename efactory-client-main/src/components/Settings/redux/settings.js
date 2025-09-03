import { showToaster,
         showSpinner,
         hideSpinner }        from '../../_Helpers/actions'

// CONSTANTS
const
  GET_DETAILS = 'GET_DETAILS',
  GET_DETAILS_SUCCESS = 'GET_DETAILS_SUCCESS',
  GET_DETAILS_FAIL = 'GET_DETAILS_FAIL',
  CHANGE_FIELDS_ORDER = 'CHANGE_FIELDS_ORDER',
  SET_ACTIVE_ROW = 'SET_ACTIVE_ROW',
  SET_ACTIVE_AVAILABLE_ROW = 'SET_ACTIVE_AVAILABLE_ROW',
  REMOVE_FROM_SELECTED = 'REMOVE_FROM_SELECTED',
  REMOVE_FROM_AVAILABLE = 'REMOVE_FROM_AVAILABLE',
  DISCARD_CHANGES = 'DISCARD_CHANGES',
  TOGGLE_SAVE_AS_POPUP_VISIBILITY = 'TOGGLE_SAVE_AS_POPUP_VISIBILITY',
  SAVE_AS = 'SAVE_AS',
  SAVE_AS_SUCCESS = 'SAVE_AS_SUCCESS',
  SAVE_AS_FAIL = 'SAVE_AS_FAIL',
  SAVE = 'SAVE',
  SAVE_SUCCESS = 'SAVE_SUCCESS',
  SAVE_FAIL = 'SAVE_FAIL',
  DELETE_VIEW = 'DELETE_VIEW',
  DELETE_VIEW_SUCCESS = 'DELETE_VIEW_SUCCESS',
  DELETE_VIEW_FAIL = 'DELETE_VIEW_FAIL',
  UPDATE_SELECTED_FIELDS_FIELD = 'UPDATE_SELECTED_FIELDS_FIELD',
  HANDLE_ERROR = 'HANDLE_ERROR',
  CLEAR_SAVE_DATA = 'CLEAR_SAVE_DATA',
  SEND_INQUIRY = 'SEND_INQUIRY',
  SEND_INQUIRY_SUCCESS = 'SEND_INQUIRY_SUCCESS',
  SEND_INQUIRY_FAIL = 'SEND_INQUIRY_FAIL',
  SET_ROOT_REDUX = `SETTINGS@SET_ROOT_REDUX`

// REDUCER
const initialState = {
    loadingDetails : false,
    settingsVisible:false,
    loadedDetails : {},
    changedOrder : [],
    activeSelectedRowId : '',
    activeAvailableRowId : '',
    selectedFields : [],
    availableFields : [],
    saveasPopupVisibility : false,
    loadedSaveAs : false,
    sendingInquiry : false,
    messageSent : false,
    viewFields : [], // TODO : (useless) this will be the updated viewFields, so that settings bar can compare with initial fields
    partners : []
};
// helpers
let updateSelectedFieldsAccordingToChangedOrder = (changedOrder, selectedFields) => {
  return changedOrder.map((changedOrderField)=>{
    let matchedField;
    selectedFields.some((selectedField)=>{
      if(changedOrderField === selectedField.field){
        matchedField = selectedField;
        return true;
      }
      return false;
    });
    return matchedField;
 });
}
let getSelectedField = (availableFields, fieldKey) => {
  let field = availableFields.filter(availableField => fieldKey === availableField.field)[0];
  return {
    field : field.field,
    alias : null,
    width : field.min_width,
    min_width : field.min_width,
    title : field.title
  }
}
export default function reducer(state = initialState, action) {

  switch(action.type) {

    case GET_DETAILS:
      return Object.assign({}, state, {
        loadingDetails : true,
        settingsVisible:false,
        loadedDetails : {},
        loadDetailsError:false
      });
    case GET_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        loadingDetails : false,
        settingsVisible: true,
        changedOrder : action.data.fields.map(field=>field.field),
        loadedDetails : action.data,
        selectedFields : action.data.fields,
        availableFields : action.data.available_fields
      });
    case GET_DETAILS_FAIL:
      return Object.assign({}, state, {
        loadingDetails : false,
        settingsVisible: false,
        error : true,
        errorDescription : action.data.error
      });
    case SAVE_AS:
      return Object.assign({}, state, {
        loadingSaveAs : true,
        loadedSaveAs : false,
        loadSaveAsError:false
      });
    case SAVE_AS_SUCCESS:
      return Object.assign({}, state, {
        loadingSaveAs : false,
        loadedSaveAs : action.data
      });
    case SAVE_AS_FAIL:
      return Object.assign({}, state, {
        loadingSaveAs : false,
        loadedSaveAs : false,
        error : true,
        errorDescription : action.data.error
      });
    case SAVE:
      return Object.assign({}, state, {
        loadingSave : true,
        loadedSave : false,
        loadSaveError:false
      });
    case SAVE_SUCCESS:
      return Object.assign({}, state, {
        loadingSave : false,
        loadedSave : true
      });
    case SAVE_FAIL:
      return Object.assign({}, state, {
        loadingSave : false,
        loadedSave : false,
        error : true,
        errorDescription : action.data.error
      });
    case DELETE_VIEW:
      return Object.assign({}, state, {
        loadingDeleteView : true,
        loadedDeleteView : false,
        loadDeleteViewError:false
      });
    case DELETE_VIEW_SUCCESS:
      return Object.assign({}, state, {
        loadingDeleteView : false,
        loadedDeleteView : action.data
      });
    case DELETE_VIEW_FAIL:
      return Object.assign({}, state, {
        loadingDeleteView : false,
        loadedDeleteView : false,
        error : true,
        errorDescription : action.data.error
      });
    case CHANGE_FIELDS_ORDER:
      return Object.assign({}, state, {
        selectedFields : updateSelectedFieldsAccordingToChangedOrder(action.data, state.selectedFields),
        changedOrder : action.data
      });
    case SET_ACTIVE_ROW :
      return Object.assign({}, state, {
        activeSelectedRowId : action.data
      });
    case SET_ACTIVE_AVAILABLE_ROW :
      return Object.assign({}, state, {
        activeAvailableRowId : action.data
      });
    case REMOVE_FROM_SELECTED :
      let updatedChangedOrder, updatedChangedOrderIndex, updatedSelectedFields;
      if(!action.data.all){
        updatedChangedOrder = state.changedOrder.filter( ( orderField, orderFieldIndex ) => {
          if( orderField !== state.activeSelectedRowId ){
            return true;
          }else{
            updatedChangedOrderIndex = orderFieldIndex;
            return false;
          }
        });
        updatedSelectedFields = state.selectedFields.filter(selectedField => selectedField.field !== state.activeSelectedRowId);
      }else{
        updatedChangedOrder = []
        updatedSelectedFields = [];
      }
      return Object.assign({}, state, {
        changedOrder : updatedChangedOrder,
        selectedFields : updatedSelectedFields,
        activeSelectedRowId : state.changedOrder[updatedChangedOrderIndex + 1] || state.changedOrder[updatedChangedOrderIndex - 1] || '',
        activeAvailableRowId : state.activeSelectedRowId,
      });
    case REMOVE_FROM_AVAILABLE :
      let updatedChangedOrder2=[], updatedSelectedFields2=[];
      if(!action.data.all){
        updatedChangedOrder2 = [...state.changedOrder, state.activeAvailableRowId];
        updatedSelectedFields2 = [...state.selectedFields, getSelectedField(state.availableFields, state.activeAvailableRowId)];
      }else{
        state.availableFields.forEach(item=>{
          updatedChangedOrder2.push(item.field);
          updatedSelectedFields2.push({
            field : item.field,
            alias : null,
            width : item.min_width,
            title : item.title
          })
        })
      }
      let activeFirstAvailable = '';
      state.availableFields.some( availableField => {
        let matched = updatedChangedOrder2.filter( changedOrderField => changedOrderField === availableField.field );
        if(matched.length === 0){
          activeFirstAvailable = availableField.field;
          return true;
        }
        return false;
      })
      return Object.assign({}, state, {
        changedOrder : updatedChangedOrder2,
        selectedFields : updatedSelectedFields2 ,
        activeAvailableRowId : activeFirstAvailable,
        activeSelectedRowId : state.activeAvailableRowId
      });
    case DISCARD_CHANGES :
      return Object.assign({}, state, {
        loadingDetails : false,
        settingsVisible:false,
        loadedDetails : {},
        loadDetailsError:false,
        changedOrder : [],
        activeSelectedRowId : '',
        activeAvailableRowId : '',
        selectedFields : [],
        availableFields : [],
        saveasPopupVisibility : false,
        viewFields : [],
        sendingInquiry : false,
        loadedSave : false,
        loadedSaveAs : false,
        loadedDeleteView : false
      });
    case TOGGLE_SAVE_AS_POPUP_VISIBILITY :
      return Object.assign({}, state, {
        saveasPopupVisibility : !state.saveasPopupVisibility
      });
    case UPDATE_SELECTED_FIELDS_FIELD :
      let matchedFieldIndexNumber,
          matchedField;
      state.selectedFields.some( (field, index) => {
        if(field.field === action.data.field){
          matchedFieldIndexNumber = index;
          matchedField = field;
        }
        return false;
      } );
      matchedField[action.data.fieldKey] = action.data.fieldKeyValue;
      return Object.assign({}, state, {
        selectedFields : [
          ...state.selectedFields.slice(0, matchedFieldIndexNumber),
          matchedField,
          ...state.selectedFields.slice(matchedFieldIndexNumber + 1)
          ]
      });
    case HANDLE_ERROR :
      return Object.assign({}, state, {
        error : false
      });

    case CLEAR_SAVE_DATA:
      return Object.assign({}, state, {
        loadingSave : false,
        loadedSave : false,
        loadSaveError:false
      })
    case SEND_INQUIRY:
    case SEND_INQUIRY_FAIL:
    case SEND_INQUIRY_SUCCESS:
    case SET_ROOT_REDUX:
      return {
        ...state,
        ...action.data
      }
    default:
      return state;

  }

};


// ACTIONS

/* ----------------- GET DETAILS ACTIONS START ----------------- */
import Fetcher from '../../../util/Request';

export const getDetails = () => ({
  type : GET_DETAILS
});
export const getDetailsSuccess = data => ({
  type : GET_DETAILS_SUCCESS,
  data
});
export const getDetailsFail = data => ({
  type : GET_DETAILS_FAIL,
  data
})

export function getDetailsAsync(pageName, viewId){
  return function(dispatch) {

    const fetcher = new Fetcher();

    dispatch(getDetails());

    return fetcher
      .fetch('/api/views', {
         method : 'post',
         data : {
          action : 'detail',
          view : pageName,
          id : viewId
         }
       })
      .then((response) => {
        dispatch( getDetailsSuccess(response.data))
        return Promise.resolve( response.data )
      })
      .catch( error => {

        dispatch(getDetailsFail({
         error : error && error['error_message']
        }))
        return Promise.reject(error)
      })
  }
}
/* ----------------- GET DETAILS ACTIONS END ----------------- */

/* ----------------- FIELDS ORDER ACTIONS START ----------------- */
export function changeFieldsOrder(order){
  return function( dispatch, getState ){
    dispatch({ 
      type : CHANGE_FIELDS_ORDER,
      data : order
    })
    return Promise.resolve()
  }
}
export function setActiveSelectedRow(id){
  return function( dispatch, getState ){
    dispatch({ 
      type : SET_ACTIVE_ROW,
      data : id
    })
  }
}
export function setActiveAvailableRow(id){
  return function( dispatch, getState ){
    dispatch({ 
      type : SET_ACTIVE_AVAILABLE_ROW,
      data : id
    })
  }
}
export const removeFromSelected = (all = false) => ({
  type : REMOVE_FROM_SELECTED,
  data : { all }
});
export const removeFromAvailable = (all = false) => ({
  type : REMOVE_FROM_AVAILABLE,
  data : { all }
});
export function discardChanges(){
  return function( dispatch, getState ){
    dispatch({ type : DISCARD_CHANGES })
  }
}

export function handleError(){
  return function( dispatch, getState ){
    dispatch({ type : HANDLE_ERROR })
  }
}
/* ----------------- FIELDS ORDER ACTIONS END ----------------- */


/* ----------------- SAVE AS ACTIONS START ----------------- */
export const saveAs = () => ({
  type : SAVE_AS
});
export const saveAsSuccess = data => ({
  type : SAVE_AS_SUCCESS,
  data
});
export const saveAsFail = data => ({
  type : SAVE_AS_FAIL,
  data
});
export function saveAsAsync(previousDetails, title, fields){
  return function(dispatch) {

    const fetcher = new Fetcher();

    dispatch(saveAs());

    fetcher
      .fetch('/api/views', {
         method : 'post',
         data : {
           "action": "new",
           "data" : {
             "type": previousDetails.type,
             "name": title,
             "fields": fields,
             "filter": previousDetails.filter,
             "rows_per_page": previousDetails.rows_per_page
           }
         }
       })
      .then((response) => {
        dispatch( saveAsSuccess(response.data) );
      })
      .catch((error) => {
        return dispatch(saveAsFail({
           error : error && error['error_message']
          }))
      });
  }
}
/* ----------------- SAVE AS ACTIONS END ----------------- */


/* ----------------- SAVE ACTIONS START ----------------- */
export const save = () => ({
  type : SAVE
});
export const saveSuccess = data => ({
  type : SAVE_SUCCESS,
  data
});
export const saveFail = data => ({
  type : SAVE_FAIL,
  data
});
export function saveAsync(previousDetails, fields){
  return function(dispatch) {

    const fetcher = new Fetcher();

    dispatch(save());

    fetcher
      .fetch('/api/views', {
         method : 'put',
         data : {
           "action": "update",
           'id' : previousDetails.id,
           "data" : {
             "type": previousDetails.type,
             "name": previousDetails.name,
             "fields": fields,
             "filter": previousDetails.filter,
             "rows_per_page": previousDetails.rows_per_page
           }
         }
       })
      .then((response) => {
        dispatch( saveSuccess(response.data) );
      })
      .catch((error) => {
        return dispatch(saveFail({
           error : error && error['error_message']
          }))
      });
  }
}
/* ----------------- SAVE ACTIONS END ----------------- */


/* ----------------- DELETE VIEW ACTIONS START ----------------- */
export const deleteViewSuccess = data => ({
  type : DELETE_VIEW_SUCCESS,
  data
});
export const deleteViewFail = data => ({
  type : DELETE_VIEW_FAIL,
  data
});
export function deleteViewAsync(previousDetails){
  return function(dispatch) {

    const fetcher = new Fetcher();

    dispatch({ type : DELETE_VIEW });

    fetcher
      .fetch('/api/views', {
         method : 'del',
         data : {
           "action": "delete",
           "id": previousDetails.id,
           "type": previousDetails.type
        }
       })
      .then((response) => {
        dispatch( deleteViewSuccess(response.data) );
      })
      .catch((error) => {
        return dispatch(deleteViewFail({
           error : error && error['error_message']
          }))
      });
  }
}
/* ----------------- DELETE VIEW ACTIONS END ----------------- */

/* ----------------- UPDATE SELECTED FIELD ACTIONS START ----------------- */
export function updateSelectedFieldsField(field, fieldKey, fieldKeyValue){
  return function( dispatch, getState ){
    dispatch({ 
      type : UPDATE_SELECTED_FIELDS_FIELD,
      data : {
        field,
        fieldKey,
        fieldKeyValue
      }
    })
  }
}
/* ----------------- UPDATE SELECTED FIELD ACTIONS END ----------------- */


/* ----------------- UI RELATED ACTIONS START ----------------- */
export function toggleSaveAsPopupVisibility(){
  return function( dispatch, getState ){
    dispatch({ type : TOGGLE_SAVE_AS_POPUP_VISIBILITY })
  }
}
/* ----------------- UI RELATED ACTIONS END ----------------- */

/* ----------------- CLEAR SAVING DATA ACTION START ----------------- */

/* clear data of save actions, since settings component checks
 * if someone saved or not. For instance resize or drag and drop
 * saves and this  shouldn t affect redirect logic of settings
 * this method will be called in constructor of settings
 *
 **/

import config             from '../../../util/config'
import { getAuthData }    from '../../../util/storageHelperFuncs'

export const clearSaveData = () => ({
  type : CLEAR_SAVE_DATA
});
/* ----------------- CLEAR SAVING DATA ACTION END ----------------- */


export function uploadDocument({
  type,
  message,
  file
}){
  return function(dispatch, getState) {
    dispatch({ type : SEND_INQUIRY, data : {
      messageSent : false,
      sendingInquiry : true
    } })
    dispatch(showSpinner())
    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    if( file ){
      formData.append("file", file)
    }
    xhr.open('POST', `${config.host}/api/upload`, true)
    let token = getAuthData().api_token
    xhr.setRequestHeader('X-Access-Token', token )
    xhr.setRequestHeader('X-Upload-Params',
      JSON.stringify({
        func : 'feedback_upload',
        type,
        message
      })
    )
    xhr.onload = function () {
      dispatch(hideSpinner())
      if (this.status >= 200 && this.status < 300) {
        dispatch({ type : SEND_INQUIRY_SUCCESS, data : {
          messageSent : true,
          sendingInquiry : false
        }  })
        showToaster({
          isSuccess : true,
          message : 'Your feedback has been sent successfully!'
        })( dispatch, getState )
      }else{
        showToaster({
          isSuccess : false,
          message : 'An error occurred!'
        })( dispatch, getState )
        dispatch({ type : SEND_INQUIRY_FAIL, data : {
          sendingInquiry : false
        } })
      }
    }
    xhr.onerror = function () {
      dispatch({ type : SEND_INQUIRY_FAIL, data : {
        sendingInquiry : false
      } })
    }
    xhr.send(formData)
  }
}

export function getTradingPartners(){
  return function( dispatch, getState ) {

    const fetcher = new Fetcher()

    fetcher
      .fetch('/api/edi', {
        method : 'post',
        data : {
          resource : 'edi-partners'
        }
      }).then( 
        response => {
          dispatch({
            type : SET_ROOT_REDUX,
            data : {
              partners : response.data.partners
            }
          })
        }
      ).catch( e => {} )
  }
}