import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import { defaultRanges, letterMatchesLabel, defaultLetterRanges } from './dateDefinitions'

momentLocalizer(moment)

const DateFilter = ({
  field,
  iconClassName,
  onQuickFilterChange,
  startDate,
  title,
}) => {
  console.log('iconClassName:', iconClassName)
  const focused = useRef(null)
  const [open, setOpen] = useState(false)

  function determineChosenLabel (startDate) {
    startDate = startDate.split('-')
    return `${startDate[1]}/${startDate[2]}/${startDate[0]}`
  }

  function handleApply (dateObj) {
    let startDate = moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
    onQuickFilterChange({
      [field]: [{
        field,
        oper: '=',
        value: startDate
      }]
    })
  }

  function convertLetterToDate (letterFormat) {
    let indexMatched
    defaultLetterRanges.some( ( l, index ) => {
      if( letterFormat === l ) indexMatched = index
      return letterFormat === l
    } )
    if( !indexMatched ){
      console.error('No letter matched on defaultLetterRanges array')
      return {}
    }
    let label = letterMatchesLabel[indexMatched]
    return {
      convertedStartDate : defaultRanges[label][0]
    }
  }

  if( [ 'Y', 'M', 'D' ].filter( keyword => startDate.includes(keyword) ).length ){
    let { convertedStartDate } = convertLetterToDate( startDate )
    if( convertedStartDate ){
      startDate = convertedStartDate
    }else{
      console.error( 'convertLetterToDate method returned invalid date values'+
                     ', for now filter changed to Today not to crash the app. ' )
      startDate = defaultRanges['Today'][0]
    }
  }

  startDate = moment(startDate).format('YYYY-MM-DD')
  let labelText = determineChosenLabel( startDate )

  return (
    <div 
      className="btn-group single-date-quick-filter"
      onFocus={ event => { focused.current = true } }
      onBlur={ event => { 
        setTimeout( 
          () => {
            if( !focused.current ){
              setOpen(false)
            }
          },
          100
        )
        focused.current = false
      } }
    >
      <button 
        id={`quickfilter-daterange-${field}`}
        className="btn btn-xs gridview-filter-btn"
        onClick={ event => {
          setOpen(!open ? 'calendar' : false)
        }}
        style={{ borderRadius : '2px' }}
      >
        <i className={ iconClassName } />
        <span className={ classNames({ "font-red-soft bold" : labelText !== '' }) }>
          { title }
        </span>
        <span className="filter-value">
          { labelText }
        </span>
        <b className="fa fa-angle-down"></b>
      </button>

      <DatePicker 
        format="MM/DD/YYYY"
        name="startDate"
        onChange={ dateObj => handleApply(dateObj) }
        time={ false }
        value={ startDate ? moment(startDate).toDate()  : moment().toDate() }
        open={ open }
        onToggle={ isOpen => setOpen(isOpen) }
      />
    </div>
  )
}

DateFilter.propTypes = {
  chosenLabel: PropTypes.string,
  field: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onQuickFilterChange: PropTypes.func.isRequired,
  iconClassName: PropTypes.string
}

DateFilter.defaultProps = {
  startDate: moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD'),
  iconClassName: 'fa fa-calendar'
}

export default DateFilter