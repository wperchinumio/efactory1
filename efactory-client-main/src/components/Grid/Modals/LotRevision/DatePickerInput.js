import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
momentLocalizer(moment)

const DatePickerInput = props => {
  const [open, setOpen] = useState(false)

  function handleApply (dateObj) {
    let startDate = dateObj ? moment(dateObj).format('YYYY-MM-DD') : ''
    let { field, onDateValueChange } = props
    onDateValueChange( field, startDate )
  }

  let { startDate, loaded } = props

  return (
    <div 
      className="input-group date form_datetime form_datetime bs-datetime"
    >
      {
        loaded && 
        <DatePicker 
          format="MM/DD/YYYY"
          name="startDate"
          onChange={handleApply}
          time={false}
          defaultCurrentDate={ startDate ? moment(startDate).toDate() : moment().toDate() }
          value={ startDate ? moment(startDate).toDate() : null }
          open={ open }
          onToggle={ isOpen => setOpen(isOpen) }
        />
      }
    </div>
  )
}

DatePickerInput.propTypes = {
  field: PropTypes.string.isRequired,
  onDateValueChange: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired
}

DatePickerInput.defaultProps = {
  startDate : moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
}

export default DatePickerInput