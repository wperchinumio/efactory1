import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import global from 'window-or-global'
import * as scheduleActions from '../redux/modal'
import Form from './form'
import Popup from '../../_Shared/Popup'

const ScheduleReport = props => {
  const firstRun = useRef([true, true])
  const handleModalOpening = useCallback(
    () => {
      global.$(".draggable-modal").css({ top: '0px', left: '0px' })
    },
    []
  )

  const handleModalClosing = useCallback(
    () => {
      clearForm()
      let modalBackdrop = document.querySelector('.modal-backdrop')
      if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop)
      }
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#schedule_report').on('show.bs.modal', handleModalOpening)
      global.$('#schedule_report').on('hidden.bs.modal', handleModalClosing)
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      return () => {
        global.$('#schedule_report').off('show.bs.modal', handleModalOpening)
        global.$('#schedule_report').off('hidden.bs.modal', handleModalClosing)
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (props.modal.submittedSchedule) {
        global.$('#schedule_report').modal('hide')
        clearForm()
      }
    },
    [props.modal.submittedSchedule]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (props.modal.submitScheduleError) {
        setTimeout( () => {
          global.$('#schedule_popup').modal('show')
          props.scheduleActions.clearSubmitSchedule()
        }, 0)
      }
    },
    [props.modal.submitScheduleError]
  )

  function clearForm () {
    global.$('a[href="#daily"]').tab('show')
    props.scheduleActions.clearStore()
  }
  
  function handleSubmit () {
    const { isGrid, scheduleActions } = props
    scheduleActions.submitSchedule({ isGrid })
  }

  let {
    active,
    activeFrequency,
    currentTask,
    dailyFrequency,
    delivery_options,
    expireChecked,
    expire_on,
    format,
    monthlyFrequency,
    start_time,
    currentTaskIndex,
    report_type_id
  } = props.modal

  return (
    <div>
      <div 
        className="modal modal-themed fade draggable-modal" 
        id="schedule_report" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden={true}
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header rs_title_bar">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="modal-title soft-red">
                <span>
                  <i className="fa fa-calendar-check-o" /> 
                </span>
                &nbsp;
                <span className="vertical-align-middle">
                  Schedule report  
                </span>
              </h4>
            </div>
            <div className="modal-body" style={{paddingBottom: 0}}>
              <Form 
                refs="theform"
                active={active}
                activeFrequency={activeFrequency}
                dailyFrequency={dailyFrequency}
                delivery_options={delivery_options}
                currentTask={ currentTask }
                expireChecked={expireChecked}
                expire_on={expire_on}
                format={format}
                monthlyFrequency={monthlyFrequency}
                report_type_id={ report_type_id }
                start_time={start_time}  
                showOnlyTab={props.showOnlyTab}       
              />
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn dark btn-outline" 
                data-dismiss="modal" 
                onClick={clearForm}
              >Cancel</button>
              <button
                type="button"
                className="btn green"
                onClick={ handleSubmit }
              >
                <i className="fa fa-calendar-check-o" /> 
                { currentTaskIndex !== undefined ? 'Update': 'Add to scheduler' }
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        props.modal.submitScheduleError &&
        <Popup
          title={ 'Error' }
          description={ props.modal.submitScheduleError }
          modalId="schedule_popup"
          isError={true}
          zIndexFix={true}
        />
      }
    </div>
  )
}

ScheduleReport.propTypes = {
  isGrid: PropTypes.bool
}

ScheduleReport.defaultProps = {
  isGrid: false
}

export default connect(
  state => ({
    modal: state.scheduler.modal,
    submittedSchedule: state.scheduler.modal.submittedSchedule    
  }),
  dispatch => ({
    scheduleActions: bindActionCreators( scheduleActions, dispatch )
  })
)(ScheduleReport)