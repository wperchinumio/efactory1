import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'

const DateTimePicker = props => {
  const firstRun = useRef(true)
  const datePicker = useRef(null)
  useEffect(
    () => {
      let { dateValue, onDateChange, id } = props
      datePicker.current = global.$(`#${id}-datepicker`)
      datePicker.current.datepicker({
        rtl: false,
        orientation: "left",
        autoclose: true,
        startDate :  moment( new Date() ).subtract(5,'years').format('MM-DD-YYYY')
      })
      datePicker.current.datepicker('update', dateValue ).on('changeDate', 
        event => {
          let calculatedDate = moment(event.date).format('YYYY-MM-DD')
          onDateChange( calculatedDate )
        }
      )
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.resetPickerWithDateValueGiven) {
        datePicker.current.datepicker('update', props.dateValue)
      }
    },
    [props.resetPickerWithDateValueGiven]
  )

  let { disabled, id, dateValue } = props
  return (
    <div
      className={
        classNames({
          'date-picker input-group input-medium date' : true,
          'no-date-value': dateValue ? false : true
        })
      }
      id={`${id}-datepicker`}
      data-date-start-date="+0d"
    >
      <input
        type="text"
        className="form-control"
        disabled={disabled}
      />
      <span className="input-group-btn">
        <button
          className="btn default"
          type="button"
          disabled={disabled}
        >
          <i className="fa fa-calendar"></i>
        </button>
      </span>
    </div>
  )
}

DateTimePicker.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  dateValue: PropTypes.string,
  resetPickerWithDateValueGiven: PropTypes.bool
}

export default DateTimePicker