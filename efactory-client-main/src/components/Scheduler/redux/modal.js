import { showToaster }       from '../../_Helpers/actions'
// CONSTANTS
const
  CLEAR_STORE = 'CLEAR_STORE',
  SET_FREQUENCY_INPUT = 'SET_FREQUENCY_INPUT',
  SET_SCHEDULE_FIELD = 'SET_SCHEDULE_FIELD',
  SET_SCHEDULE_DELIVERY_FTP_FIELD = 'SET_SCHEDULE_DELIVERY_FTP_FIELD',
  SET_SCHEDULE_DELIVERY_EMAIL_FIELD = 'SET_SCHEDULE_DELIVERY_EMAIL_FIELD',
  SUBMIT_SCHEDULE = 'SUBMIT_SCHEDULE',
  SUBMIT_SCHEDULE_SUCCESS = 'SUBMIT_SCHEDULE_SUCCESS',
  SUBMIT_SCHEDULE_FAIL = 'SUBMIT_SCHEDULE_FAIL',
  CLEAR_SUBMIT_SCHEDULE = 'CLEAR_SUBMIT_SCHEDULE',
  EDIT_SCHEDULER_TASK = 'EDIT_SCHEDULER_TASK',
  SET_STANDARD_REPORT_FIELDS = 'SET_STANDARD_REPORT_FIELDS'

// REDUCER
const initialState = {
  active: true,
  activeFrequency : "daily",
  currentTask : {},
  dailyFrequency: {
    type: "daily",
    options: {
      "days": [0,1,2,3,4,5,6]
    }
  },
  delivery_options: {
    ftp: {
      url: '',
      username: '',
      password: '',
      home_dir: '',
      protocol: "ftp"
    },
    "email" : {
      "to": ''
    }
  },
  error : false,
  expire_on: '',
  expireChecked : false,
  format: "excel",
  monthlyFrequency: {
    type: "monthly",
    options: {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10, 11, 12],
      days: [1]
    }
  },
  report_type_id: 0,
  start_time: '',
  view_type: '',
  submittedSchedule : false
};
export default function reducer(state = initialState, action) {

  switch(action.type) {

    case SUBMIT_SCHEDULE:
      return { 
        ...state,
        submittingSchedule : true,
        submitScheduleError : false,
        submittedSchedule : false
       }

    case SUBMIT_SCHEDULE_SUCCESS:
      return { 
        ...state,
        submittingSchedule : false,
        submitScheduleError : false,
        submittedSchedule : true
       }

    case SUBMIT_SCHEDULE_FAIL:
      return { 
        ...state,
        submittingSchedule : false,
        submitScheduleError : action.data,
        submittedSchedule : false
       }

    case CLEAR_SUBMIT_SCHEDULE:
      return {
        ...state,
        error : false,
        error_message : null
      }
    case CLEAR_STORE:
      return initialState;

    case SET_FREQUENCY_INPUT:
    case SET_SCHEDULE_FIELD:
      return {
        ...state,
        ...action.data
      }
    case SET_SCHEDULE_DELIVERY_FTP_FIELD:
    case SET_SCHEDULE_DELIVERY_EMAIL_FIELD:
    case EDIT_SCHEDULER_TASK:
      return { ...state, ...action.data }
    case SET_STANDARD_REPORT_FIELDS:
      return {
        ...state,
        ...action.data
      }
    default:
      return state;

  }

};

// ACTIONS
export const editTask = ( index ) => {
  return ( dispatch, getState ) => {
    
    let allTasks = getState().scheduler.reports.allTasks
    let editedTask = allTasks[index]
    let {
      delivery_options,
      expire_on,
      format,
      start_time,
      view_type
    } = editedTask.task
    let activeFrequency = editedTask.task.frequency.type
    let active = editedTask.active
    let dailyFrequency = activeFrequency === 'daily' ? 
                          editedTask.task.frequency : {
                                type : "daily",
                                options : {
                                  days : [0, 1, 2, 3, 4, 5, 6]
                                }
                              }

    let monthlyFrequency = activeFrequency === 'monthly' ? 
                            editedTask.task.frequency : {
                              type: "monthly",
                              options: {
                                months: [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10, 11, 12],
                                days: [1]
                              }
                            }
    let expireChecked = expire_on ? true : false
    
    dispatch({
      type : EDIT_SCHEDULER_TASK,
      data : { 
        active,
        activeFrequency,
        currentTask : allTasks[index],
        currentTaskIndex : index,
        dailyFrequency,
        delivery_options,
        expire_on,        
        format,
        monthlyFrequency,
        start_time,
        expireChecked,
        view_type
      }
    });
  }
}

export const addStandardReport = ({ report_type_id = -1, activeFrequency = '', view_type = '' }) => {
  return ( dispatch, getState ) => {

    dispatch({
      type : SET_STANDARD_REPORT_FIELDS,
      data : {
        report_type_id,
        activeFrequency,
        view_type,
        creatingStandardReport : true
      }
    });
  }
};

export const addCustomReport = ({ report_type_id }) => {
  return ( dispatch, getState ) => {

    if( !report_type_id ) return console.error( "report_type_id is required for 'addCustomReport'. " )

    dispatch({
      type : SET_STANDARD_REPORT_FIELDS,
      data : {
        report_type_id,
        creatingStandardReport : true,
        format : 'xml'
      }
    });
  }
};

export const clearStore = ( type = '', options = {} ) => {
  return ( dispatch ) => {
    dispatch({
      type : CLEAR_STORE
    });
  }
};
export const setFrequencyInput = ( type = '', options = {} ) => {
  return ( dispatch, getState ) => {
    if( type === '' ) return console.error('setFrequencyInput action creator expected a valid type');
    dispatch({
      type : SET_FREQUENCY_INPUT,
      data : {
        [`${type}Frequency`] : { type, options }
      }
    });
  }
};
export const setScheduleField = ( data = {} ) => {
  return ( dispatch, getState ) => {
    return new Promise( (resolve, reject) => {
      dispatch({
        type : SET_SCHEDULE_FIELD,
        data
      })
      resolve()
    } )
  }
};

export const setScheduleDeliveryFtpField = ( ftp = {} ) => {
  return ( dispatch, getState ) => {
    let email = getState().scheduler.modal.delivery_options.email;
    dispatch({
      type : SET_SCHEDULE_DELIVERY_FTP_FIELD,
      data : { delivery_options : { ftp, email }  }
    });
  }
};

export const setScheduleDeliveryEmailField = ( email = {} ) => {
  return ( dispatch, getState ) => {
    let ftp = getState().scheduler.modal.delivery_options.ftp;
    dispatch({
      type : SET_SCHEDULE_DELIVERY_EMAIL_FIELD,
      data : { delivery_options : { ftp, email }  }
    });
  }
};

/*==========================================================================
=                             POST SCHEDULE ACTIONS                        =
==========================================================================*/

import Fetcher                from '../../../util/Request'
import { readTasks }          from './reports'
let determineApiTaskParams;
export function submitSchedule({ isGrid = false } = {}){
  return function( dispatch, getState ) {

    const fetcher = new Fetcher();

    dispatch({ type : SUBMIT_SCHEDULE });

    let state = getState()

    let task = determineApiTaskParams( state, isGrid );
    
    let isUpdate = state.scheduler.modal.currentTaskIndex !== undefined
    let params = {
      action: isUpdate ? 'update_task' : 'create_task',
      task
    }

    if( isUpdate ){
      params.id = state.scheduler.modal.currentTask.id
      params.task.report_type_id = state.scheduler.modal.currentTask.report_type_id
    } 

    fetcher
      .fetch('/api/scheduler', {
        method : 'post',
        data : params
      })
      .then((response) => {
        dispatch({
          type : SUBMIT_SCHEDULE_SUCCESS,
          data : response.data
        })
        if(isUpdate) readTasks()( dispatch, getState )
        if( isGrid ){
          showToaster({
            isSuccess : true,
            message : 'Schedule report added successfully!'
          })( dispatch, getState )
        }
      })
      .catch((error) => {
        let { error_message = 'An error occured!' } = error || {}
        dispatch({
          type : SUBMIT_SCHEDULE_FAIL,
          data : error_message
        })
      });
  }
}
export function clearSubmitSchedule(){
  return function( dispatch, getState ) {
    dispatch({
      type : CLEAR_SUBMIT_SCHEDULE
    })
  }
}
determineApiTaskParams = ( state, isGrid = false) => {
  let task = {};
  task.report_type_id = state.scheduler.modal.report_type_id ? parseInt(state.scheduler.modal.report_type_id, 10): 0
  task.view_type = state.scheduler.modal.view_type
  task.frequency = state.scheduler.modal[`${state.scheduler.modal.activeFrequency}Frequency`];
  task.start_time = state.scheduler.modal.start_time;

  // We need to figure our why sometime start_time has the format "YYYY-MM-DDT" @@@@@
  if (task.start_time && task.start_time.endsWith('T')) task.start_time += '00:00:00';

  if( state.scheduler.modal.expireChecked ){
    task.expire_on = state.scheduler.modal.expire_on;
    // We need to figure our why sometime expire_on has the format "YYYY-MM-DDT" @@@@@
    if (task.expire_on && task.expire_on.endsWith('T')) task.expire_on += '00:00:00';
  }
  task.format = state.scheduler.modal.format;
  task.active = state.scheduler.modal.active;
  task.delivery_options = state.scheduler.modal.delivery_options;

  if( isGrid ){
    let { filter, sort, resource } = state.grid.fetchRowsParams
    task.view_type = resource
    task.filter = filter
    task.sort = sort
  }

  return task;
}
/*====================  End of POST SCHEDULE ACTIONS  ==================*/
