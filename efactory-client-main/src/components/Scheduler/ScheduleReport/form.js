import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as modalActions from '../redux/modal'
import Options from './options'
import DeliveryOptions from './deliveryOptions'
import DateTimePicker from './dateTimePicker'

const ScheduleReportForm = props => {
  let { setScheduleField } = props.modalActions
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
    report_type_id,
    start_time,
    showOnlyTab
  } = props

  return (
    <div>
      <RowXs9>
        <DateTimePicker
          currentDateTimeValue={ start_time ? start_time : undefined }
          defaultDate={ start_time ? false : true }
          defaultTime={ start_time ? false : true }
          id={'start'}
          labelName={'Start'}
          onDateTimeChange={ dateTime => setScheduleField({ start_time : dateTime }) }
          formStyle={{ paddingBottom: "10px" }}
        />
      </RowXs9>
      <Options
        scheduleActions={props.modalActions}
        activeFrequency={activeFrequency}
        dailyFrequency={dailyFrequency}
        monthlyFrequency={monthlyFrequency}
        showOnlyTab={showOnlyTab}
      />
      <RowXs9>
        <div className="form-group">
          <label className="mt-checkbox mt-checkbox-outline col-md-3">
            <input
              type="checkbox"
              checked={ expireChecked }
              onChange={ event => setScheduleField({ expireChecked : !expireChecked }) }/>
              Expire
            <span></span>
          </label>
        </div>
          <DateTimePicker
            disabled={!expireChecked}
            currentDateTimeValue={ expireChecked ? expire_on : undefined }
            id={'expired'}
            labelName={'Expired'}
            onDateTimeChange={ dateTime => setScheduleField({ expire_on : dateTime }) }
            formStyle={{marginTop: "-20px"}}
          />
      </RowXs9>
      <RowXs9>
        <div className="form-group">
          <label className="mt-checkbox noselect mt-checkbox-outline col-md-3">
            <input
              type="checkbox"
              checked={active}
              onChange={ event => setScheduleField({ active : !active }) }
            />Enabled
            <span></span>
          </label>
        </div>
      </RowXs9>
      <RowXs9>
        <div className="form-group col-md-3" style={{paddingLeft: 0}}>Format:</div>
        <form className="form-inline" autoComplete="off" onSubmit={ e => e.preventDefault() }>
          {
            !(
              +report_type_id === 1000 || +currentTask.report_type_id === 1000 || +report_type_id === 1001 || +currentTask.report_type_id === 1001 || +report_type_id === 1002 || +currentTask.report_type_id === 1002 ||+report_type_id === 1003 || +currentTask.report_type_id === 1003 || +report_type_id === 1004 || +currentTask.report_type_id === 1004 || +report_type_id === 1005 || +currentTask.report_type_id === 1005 || +report_type_id === 1006 || +currentTask.report_type_id === 1006 || +report_type_id === 1007 || +currentTask.report_type_id === 1007 || +report_type_id === 1008 || +currentTask.report_type_id === 1008 || +report_type_id === 1009 || +currentTask.report_type_id === 1009 || +report_type_id === 1010 || +currentTask.report_type_id === 1010 || +report_type_id === 1011 || +currentTask.report_type_id === 1011
            ) &&
            <div className="form-group">
              <label
                className="mt-radio noselect mt-radio-outline"
                style={{paddingRight: "20px"}}>Excel
                <input type="radio" value="excel" name="format"
                  checked={ format === 'excel' }
                  onChange={ event => setScheduleField({ format : 'excel' }) }/>
                <span></span>
              </label>&nbsp;&nbsp;
              <label className="mt-radio mt-radio-outline" style={{paddingRight: "20px"}}> Csv
                <input type="radio" value="csv" name="format"
                  checked={ format === 'csv' }
                  onChange={ event => setScheduleField({ format : 'csv' }) }/>
                <span></span>
              </label>&nbsp;&nbsp;
              <label className="mt-radio mt-radio-outline" style={{paddingRight: "20px"}}> Zip
                <input type="radio" value="zip" name="format"
                  checked={ format === 'zip' }
                  onChange={ event => setScheduleField({ format : 'zip' }) }/>
                <span></span>
              </label>&nbsp;&nbsp;
              {
                ( +report_type_id >= 1000 || +currentTask.report_type_id >= 1000 ) &&
                <label className="mt-radio mt-radio-outline"> XML
                  <input type="radio" value="xml" name="format"
                    checked={ format === 'xml' }
                    onChange={ event => setScheduleField({ format : 'xml' }) }/>
                  <span></span>
                </label>
              }
            </div>
          }
          {
            (  +report_type_id === 1000 || +currentTask.report_type_id === 1000 || +report_type_id === 1001 || +currentTask.report_type_id === 1001 || +report_type_id === 1002 || +currentTask.report_type_id === 1002 || +report_type_id === 1004 || +currentTask.report_type_id === 1004 || +report_type_id === 1005 || +currentTask.report_type_id === 1005 || +report_type_id === 1006 || +currentTask.report_type_id === 1006 || +report_type_id === 1007 || +currentTask.report_type_id === 1007 || +report_type_id === 1008 || +currentTask.report_type_id === 1008 || +report_type_id === 1009 || +currentTask.report_type_id === 1009 || +report_type_id === 1010 || +currentTask.report_type_id === 1010 || +report_type_id === 1011 || +currentTask.report_type_id === 1011) &&
            <div className="form-group">
              <label
                className="mt-radio noselect mt-radio-outline"
                style={{paddingRight: "20px"}}>XML
                <input type="radio" value="xml" name="format"
                  checked={ format === 'xml' }
                  onChange={ event => setScheduleField({ format : 'xml' }) }/>
                <span></span>
              </label>&nbsp;&nbsp;
            </div>
          }
          {
            ( +report_type_id === 1003 || +currentTask.report_type_id === 1003 || +report_type_id === 1001 || +currentTask.report_type_id === 1001 ) &&
            <div className="form-group">
              <label
                className="mt-radio noselect mt-radio-outline"
                style={{paddingRight: "20px"}}>TXT
                <input type="radio" value="txt" name="format"
                  checked={ format === 'txt' }
                  onChange={ event => setScheduleField({ format : 'txt' }) }/>
                <span></span>
              </label>&nbsp;&nbsp;
            </div>
          }
        </form>
      </RowXs9>
      <DeliveryOptions
        scheduleActions={props.modalActions}
        ftp={delivery_options && delivery_options.ftp}
        email={delivery_options && delivery_options.email}
      />
    </div>
  )
}

ScheduleReportForm.propTypes = {
  active: PropTypes.bool,
  activeFrequency: PropTypes.oneOf([ 'daily', 'monthly' ]),
  dailyFrequency: PropTypes.shape({
    type: PropTypes.string.isRequired,
    options: PropTypes.shape({
      days: PropTypes.array.isRequired
    })
  }),
  delivery_options: PropTypes.shape({
    email: PropTypes.shape({
      to: PropTypes.string
    }),
    ftp: PropTypes.shape({
      url: PropTypes.string,
      username: PropTypes.string,
      password: PropTypes.string,
      home_dir: PropTypes.string,
      protocol: PropTypes.oneOf([ 'ftp', 'sftp' ])
    })
  }),
  expireChecked: PropTypes.bool,
  expire_on: PropTypes.string,
  format: PropTypes.oneOf([ 'excel', 'csv', 'xml', 'txt', 'zip' ]),

  monthlyFrequency: PropTypes.shape({
    type: PropTypes.string.isRequired,
    options: PropTypes.shape({
      months: PropTypes.array.isRequired,
      days: PropTypes.array.isRequired
    })
  }),
  start_time: PropTypes.string,
  showOnlyTab: PropTypes.oneOf(['daily', 'monthly', false])
}

function RowXs9 ({ children }) {
  return (
    <div className="row">
      <div className="col-xs-push-3 col-xs-9">
        { children }
      </div>
    </div>
  )
}

export default connect(
  state => ({
    schedule: state.scheduler.modal
  }),
  dispatch => ({
    modalActions: bindActionCreators( modalActions, dispatch )
  })
)(ScheduleReportForm)
