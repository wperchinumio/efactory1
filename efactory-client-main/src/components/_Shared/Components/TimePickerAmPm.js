import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TimePickerAmPm = props => {
  const timeBlocksContainerRef = useRef(null)

  let { 
    disabled, 
    id, 
    currentTimeShownFormat,
    currentTimeIsoFormat
  } = props

  return (
    <div
      className="input-icon time-blocks-container noselect"
      ref={timeBlocksContainerRef}
    >
      <i className="fa fa-clock-o"></i>
      <input
        type="text"
        className="form-control timepicker"
        style={{width: "120px"}}
        disabled={disabled}
        value={ currentTimeShownFormat }
        onChange={ event => {} }
        onFocus={ event => global.$(timeBlocksContainerRef.current).addClass('open') }
        onBlur={ event => setTimeout( () => { global.$(timeBlocksContainerRef.current).removeClass('open') }, 500 ) }
        id={`${id}-timepicker`}
      />
      <div
        className="time-blocks"
        onClick={ event => {
          let classname = event.target.className
          if( classname.includes('t-block') && !classname.includes('disabled') ){
            let currentTimeShownFormat = event.target.getAttribute('data-currentTimeShownFormat')
            let currentTimeIsoFormat = event.target.getAttribute('data-currentTimeIsoFormat')
            props.onTimeChange( currentTimeShownFormat, currentTimeIsoFormat )
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
            return <div 
              className={ classNames({
                't-b-column': true,
                't-pm': row === 2
              })} 
              key={`t-b-col-${column[0]}`}
            >
              { 
                column.map( timeBlock => {
                  return (
                    <p 
                      className={ classNames({
                        't-block': true,
                        'disabled': false,
                        'selected': currentTimeIsoFormat === timeBlock[1]
                      })}
                      data-currentTimeShownFormat={ timeBlock[0] }
                      data-currentTimeIsoFormat={ timeBlock[1] }
                      key={`t-b-col-${timeBlock}`} 
                    >
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
  )
}

TimePickerAmPm.propTypes = {
  currentTimeIsoFormat: PropTypes.string,
  currentTimeShownFormat: PropTypes.string,
  onTimeChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
}

export default TimePickerAmPm