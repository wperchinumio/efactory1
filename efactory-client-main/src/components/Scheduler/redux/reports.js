import Fetcher                from '../../../util/Request'
import {
  showSpinner,
  hideSpinner,
  showToaster
}                             from '../../_Helpers/actions'
import downloadSource 				from '../../_Helpers/DownloadSource';
// CONSTANTS

const namespace = 'scheduler'

const
  SET_ROOT_REDUX_STATE  = `${namespace}/SET_ROOT_REDUX_STATE`,
  SCHEDULER_READ_TASKS = `${namespace}/SCHEDULER_READ_TASKS`,
  SCHEDULER_READ_TASKS_SUCCESS = `${namespace}/SCHEDULER_READ_TASKS_SUCCESS`,
  SCHEDULER_READ_TASKS_FAIL = `${namespace}/SCHEDULER_READ_TASKS_FAIL`,
  GET_SCHEDULE_TO_DELETE = `${namespace}/GET_SCHEDULE_TO_DELETE`,
  DELETE_SCHEDULER_TASK = `${namespace}/DELETE_SCHEDULER_TASK`,
  DELETE_SCHEDULER_TASK_SUCCESS = `${namespace}/DELETE_SCHEDULER_TASK_SUCCESS`,
  DELETE_SCHEDULER_TASK_FAIL = `${namespace}/DELETE_SCHEDULER_TASK_FAIL`,
  UPDATE_SCHEDULER_TASK = `${namespace}/UPDATE_SCHEDULER_TASK`,
  UPDATE_SCHEDULER_TASK_SUCCESS = `${namespace}/UPDATE_SCHEDULER_TASK_SUCCESS`,
  UPDATE_SCHEDULER_TASK_FAIL = `${namespace}/UPDATE_SCHEDULER_TASK_FAIL`

// REDUCER
const initialState = {
  loading : false,
  readTasksSuccess : false,
  readTasksFail : false,
  allTasks : [],
  error : false,
  deletingTask : false,
  deletedTask : false,
  deleteTaskError : false,
  updatingTask : false,
  updatedTask : false,
  updateTaskError : false,
  custom_reports : [],
  fetched_custom_reports : false
};

export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SCHEDULER_READ_TASKS:
      return {
        ...state,
        loading : true,
        readTasksSuccess : false,
        readTasksFail : false
      }
    case SCHEDULER_READ_TASKS_SUCCESS:
      return {
        ...state,
        loading : false,
        readTasksSuccess : true,
        readTasksFail : false,
        allTasks :  action.data
      }
    case SCHEDULER_READ_TASKS_FAIL:
      return {
        ...state,
        loading : false,
        readTasksSuccess : false,
        readTasksFail : true,
        error : action.data
      }
    case GET_SCHEDULE_TO_DELETE:
      return {
        ...state,
        taskToDelete:action.data
      }
    case DELETE_SCHEDULER_TASK:
      return {
        ...state,
        deletingTask : true,
        deletedTask : false,
        deleteTaskError : false
      }
    case DELETE_SCHEDULER_TASK_SUCCESS:
      return {
        ...state,
        deletingTask : false,
        deletedTask : true,
        deleteTaskError : false
      }
    case DELETE_SCHEDULER_TASK_FAIL:
      return {
        ...state,
        deletingTask : false,
        deletedTask : false,
        deleteTaskError : action.data
      }
    case UPDATE_SCHEDULER_TASK:
      return {
        ...state,
        updatingTask : true,
        updatedTask : false,
        updateTaskError : false
      }
    case UPDATE_SCHEDULER_TASK_SUCCESS:
      return {
        ...state,
        updatingTask : false,
        updatedTask : true,
        updateTaskError : false,
        ...action.data
      }
    case UPDATE_SCHEDULER_TASK_FAIL:
      return {
        ...state,
        updatingTask : false,
        updatedTask : false,
        updateTaskError : action.data
      }
    case SET_ROOT_REDUX_STATE:
      return {
        ...state,
        ...action.data
      }
    default:
      return state;

  }

};



// ACTIONS

export function setRootReduxStateProp_multiple( keysToUpdate = {} ){
  return function( dispatch, getState ){
    dispatch({
      type: SET_ROOT_REDUX_STATE,
      data : { ...keysToUpdate }
    })
    return Promise.resolve()
  }
}

/* ----------------- GET VIEWS ACTIONS START ----------------- */
export function readTasks(){
  return function(dispatch) {
    const fetcher = new Fetcher();

    dispatch({ type : SCHEDULER_READ_TASKS });

    fetcher
      .fetch('/api/scheduler', {
        method : 'post',
        data : {
          "action": "read_tasks"
        }
      })
      .then((response) => {
        dispatch({
          type : SCHEDULER_READ_TASKS_SUCCESS,
          data : response.data
        })
      })
      .catch((error) => {
        dispatch({
          type : SCHEDULER_READ_TASKS_FAIL,
          data : error && error['error_message']
        })
      })
  }
}
/* ---------------------- GET VIEWS ACTIONS END ----------------------*/

export function getScheduleToDelete( id ) {
  return function( dispatch, getState ) {
    dispatch({
      type: GET_SCHEDULE_TO_DELETE,
      data: id
    })
  }
}

/* ----------------- DELETE SCHEDULE ACTIONS START -------------------*/
export function deleteScheduler( id ) {
  return function( dispatch, getState ) {
    const fetcher = new Fetcher()
    dispatch({ type : DELETE_SCHEDULER_TASK })
    let params = { action : 'delete_task', id : id }
    fetcher
      .fetch('/api/scheduler', {
        method : 'post',
        data : params
      })
      .then(( response ) => {
        dispatch({
          type : DELETE_SCHEDULER_TASK_SUCCESS,
          data : response.data
        })
        readTasks()( dispatch, getState )
      })
      .catch(( error ) => {
        dispatch({
          type : DELETE_SCHEDULER_TASK_FAIL,
          data : error && error['error_message']
        })
      })
  }
}
/* ----------------- DELETE SCHEDULE ACTIONS END -------------------*/

/* ----------------- UPDATE SCHEDULE ACTIONS START -------------------*/
export function updateScheduler( row, index ) {
  return function( dispatch, getState ) {
    const fetcher = new Fetcher()
    dispatch({ type : UPDATE_SCHEDULER_TASK })
    let { id } = row

    let allTasks = getState().scheduler.reports.allTasks
    allTasks = [ ...allTasks ]
    //allTasks[index].active = !allTasks[index].active

    let params = {
      action : 'toggle_task',
      id : id,
      enable : !allTasks[index].active
    }

    fetcher
      .fetch('/api/scheduler', {
        method : 'post',
        data : params
      })
      .then(( response ) => {
        allTasks[index].active = response.data
        dispatch({
          type : UPDATE_SCHEDULER_TASK_SUCCESS,
          data : { allTasks }
        })
        readTasks()( dispatch, getState )
      })
      .catch(( error ) => {
        dispatch({
          type : UPDATE_SCHEDULER_TASK_FAIL,
          data : error && error['error_message']
        })
      })
  }
}

export function listCustomReports() {
  return function( dispatch, getState ) {

    dispatch({
      type : SET_ROOT_REDUX_STATE,
      data : { custom_reports : [], fetched_custom_reports : false }
    })

    dispatch(showSpinner())

    const fetcher = new Fetcher()

    // let allTasks = getState().scheduler.reports.allTasks

    fetcher
      .fetch('/api/scheduler', {
        method : 'post',
        data : {
          action : 'list_custom_reports',
        }
      })
      .then( ({ data : custom_reports }) => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            custom_reports,
            fetched_custom_reports : true
          }
        })
      })
      .catch( error => {

        dispatch(hideSpinner())

        dispatch({
          type : SET_ROOT_REDUX_STATE,
          data : {
            fetched_custom_reports : true
          }
        })
      })
  }
}

export function downloadView(format, report_type_id) {
  return ( dispatch, getState ) => {
    dispatch(showSpinner())

    let data = {
      format,
      report_type_id
    }

    data = JSON.stringify(data)
    return downloadSource('/api/scheduler', data, {
      onSuccessAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : true,
          message : 'Downloaded successfully!'
        })( dispatch, getState )
      },
      onErrorAction : () => {
        dispatch(hideSpinner())
        showToaster({
          isSuccess : false,
          message : 'An error occurred while downloading!'
        })( dispatch, getState )
      }
    })

  }
}

export function showErrorToaster( message = '' ){
  return function( dispatch, getState ){
    showToaster({
      isSuccess : false,
      message
    })( dispatch, getState )
  }
}


/* ----------------- UPDATE SCHEDULE ACTIONS START -------------------*/
