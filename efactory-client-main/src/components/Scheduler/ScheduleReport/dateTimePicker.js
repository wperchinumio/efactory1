import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import invariant from 'invariant'
import classNames from 'classnames'

const DateTimePicker = props => {
  const firstRun = useRef(true)
  const timeBlocksContainer = useRef(null)
  const datePickerRef = useRef(null)
  const timePickerRef = useRef(null)
  const [date, setDate] = useState(getInitialStateValues().date)
  const [time, setTime] = useState(getInitialStateValues().time)
  const [timeToShow, setTimeToShow] = useState(getInitialStateValues().timeToShow)

  useEffect(
    () => {
      invariant(
        // means you can t give both default time/date AND currentDateTimeValue
        !( (props.defaultTime || props.defaultTime) && props.currentDateTimeValue ),
        'dateTimePicker took defaultTime or defaultDate and currentDateTimeValue ' +
        'this is not allowed since first two sets to now and latter one sets to '+
        'given dateTime'
      )
      let {
        id,
        onDateTimeChange,
        defaultTime,
        currentDateTimeValue
      } = props

      datePickerRef.current = global.$(`#${id}-datepicker`)
      timePickerRef.current = global.$(`#${id}-timepicker`)

      // initialize date picker with todays date
      datePickerRef.current
        .datepicker({
          rtl: false,
          orientation: "left",
          autoclose: true,
          startDate:  currentDateTimeValue ?
              moment( new Date() ).subtract(1,'years').format('MM-DD-YYYY') :
              moment( new Date() ).format('MM-DD-YYYY')
        })
      // initialize date picker to now or given date
      datePickerRef.current
        .datepicker('update', props.defaultDate ? new Date() : undefined )
        .on('changeDate', 
          event => {
            let calculatedDate = moment(event.date).format('YYYY-MM-DD')
            onDateTimeChange( `${calculatedDate}T${time}` )
            setDate(calculatedDate)
          }
        )
      if (defaultTime) {
        resetTimePicker()
      }
      if (currentDateTimeValue) {
        setDateAndTimeValues(currentDateTimeValue)
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      resetTimePicker(props.disabled)
    },
    [props.disabled]
  )

  function getInitialStateValues () {
    const { currentDateTimeValue } = props
    if (!currentDateTimeValue) {
      return { date: '', time: '', timeToShow: '' }
    }
    const date = currentDateTimeValue.slice(0,10)
    const time = currentDateTimeValue.slice(11)
    const timeToShow = moment(currentDateTimeValue).format('hh:mm A')
    return { date, time, timeToShow }
  }

  function parseIsoToTimeAndDate (isoFormat) {
    invariant(
      isoFormat.length === 19, // "1970-05-06T17:42:00"
      'parseIsoToTimeAndDate expected first param to have a lenght of 19 ' +
      `instead it received <${isoFormat}>`
    )
    return {
      date: isoFormat.slice(0,10),
      time: isoFormat.slice(11)
    }

  }

  function setDateAndTimeValues (dateTimeIsoFormat = '') {
    invariant(
      dateTimeIsoFormat.length === 19, // "1970-05-06T17:42:00"
      'setDateAndTimeValues expected first param to have a lenght of 19 ' +
      `instead it received <${dateTimeIsoFormat}>`
    )
    datePickerRef.current.datepicker( 'update', moment(dateTimeIsoFormat).format('MM-DD-YYYY') )
  }

  /* this method resets timepickers value to now + 10 minutes or empty */
  function resetTimePicker (empty = false) {
    let newDate = new Date()
    if (empty) {
      datePickerRef.current.datepicker('update', undefined )
      props.onDateTimeChange( '' )
      setDate('')
      setTime('')
    } else {
      datePickerRef.current.datepicker('update', moment(newDate).format('MM-DD-YYYY') )
      let isoFormat = moment( newDate ).add(10,'minutes').format('YYYY-MM-DDT')
      isoFormat += '00:00:00'
      props.onDateTimeChange(isoFormat)
      setDate(parseIsoToTimeAndDate(isoFormat).date)
      setTime(parseIsoToTimeAndDate(isoFormat).time)
      setTimeToShow('00:00 AM')
    }
  }

  let { disabled, formStyle, id, labelName } = props
  return (
    <form className="form-inline" style={ formStyle } autoComplete="off">
      <div className="form-group">
        <label htmlFor={id+'-datepicker'}>
          {labelName}:&nbsp;
        </label>
        <div
          className="date-picker input-group input-medium date"
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
      </div>
      <div className="form-group">
        <div className="col-md-1">
          <div
            className="input-icon time-blocks-container noselect"
            ref={timeBlocksContainer}
          >
            <i className="fa fa-clock-o"></i>
            <input
              type="text"
              className="form-control timepicker"
              style={{width: "120px"}}
              disabled={disabled}
              value={timeToShow}
              onChange={event => {}}
              onFocus={ event => global.$(timeBlocksContainer.current).addClass('open') }
              onBlur={ event => setTimeout( () => { global.$(timeBlocksContainer.current).removeClass('open') }, 500 ) }
              id={`${id}-timepicker`}
            />
            <div
              className="time-blocks"
              onClick={ event => {
                let classname = event.target.className
                if (classname.includes('t-block') && !classname.includes('disabled')) {
                  let timeIso = event.target.getAttribute('data-tblock-date-iso')
                  let timeToShowNext = event.target.getAttribute('data-tblock-date-showed')
                  if(timeIso.length === 5){
                    timeIso = `${timeIso}:00`
                    setTime(timeIso)
                    setTimeToShow(timeToShowNext)
                    props.onDateTimeChange(`${date}T${timeIso}`)
                  }
                }
              } }
            >
              <span className="t-b-header">AM</span>
              <span className="t-b-header">PM</span>

              {
                [
                  [ ['12:00 AM','00:00'], ['12:30 AM','00:30'], ['01:00 AM','01:00'], ['01:30 AM','01:30'], ['02:00 AM','02:00'], ['02:30 AM','02:30'], ['03:00 AM','03:00'], ['03:30 AM','03:30'], ['04:00 AM','04:00'], ['04:30 AM','04:30'], ['05:00 AM','05:00'], ['05:30 AM','05:30'] ],
                  [ ['06:00 AM','06:00'], ['06:30 AM','06:30'], ['07:00 AM','07:00'], ['07:30 AM','07:30'], ['08:00 AM','08:00'], ['08:30 AM','08:30'], ['09:00 AM','09:00'], ['09:30 AM','09:30'], ['10:00 AM','10:00'], ['10:30 AM','10:30'], ['11:00 AM','11:00'], ['11:30 AM','11:30'] ],
                  [ ['12:00 PM','12:00'], ['12:30 PM','12:30'], ['01:00 PM','13:00'], ['01:30 PM','13:30'], ['02:00 PM','14:00'], ['02:30 PM','14:30'], ['03:00 PM','15:00'], ['03:30 PM','15:30'], ['04:00 PM','16:00'], ['04:30 PM','16:30'], ['05:00 PM','17:00'], ['05:30 PM','17:30'] ],
                  [ ['06:00 PM','18:00'], ['06:30 PM','18:30'], ['07:00 PM','19:00'], ['07:30 PM','19:30'], ['08:00 PM','20:00'], ['08:30 PM','20:30'], ['09:00 PM','21:00'], ['09:30 PM','21:30'], ['10:00 PM','22:00'], ['10:30 PM','22:30'], ['11:00 PM','23:00'], ['11:30 PM','23:30'] ]
                ].map( (column, row) => {
                  return <div className={ classNames({
                    't-b-column': true,
                    't-pm': row === 2
                  })} key={`t-b-col-${column[0]}`}>
                    { 
                      column.map( timeBlock => {
                        return (
                          <p className={ classNames({
                                't-block': true,
                                'disabled': false,
                                'selected': time.slice(0,5) === timeBlock[1]
                              })}
                              data-tblock-date-showed={ timeBlock[0] }
                              data-tblock-date-iso={ timeBlock[1] }
                              key={`t-b-col-${timeBlock}`} >
                            { timeBlock[0] }
                          </p>
                        )
                      }) 
                    }
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

DateTimePicker.propTypes = {
  currentDateTimeValue: PropTypes.string,
  defaultDate: PropTypes.bool,
  defaultTime: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  onDateTimeChange: PropTypes.func.isRequired,
  formStyle: PropTypes.object.isRequired
}

DateTimePicker.defaultProps = {
  disabled: false,
  defaultTime: false,
  defaultDate: false
}

export default DateTimePicker