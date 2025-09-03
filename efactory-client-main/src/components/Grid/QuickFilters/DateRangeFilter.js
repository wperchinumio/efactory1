import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import DateRangePicker from '../../_Shared/Components/daterangepicker'
import { defaultRanges, defaultLetterRanges, letterMatchesLabel } from './dateDefinitions'

const QuickFilters = props => {
  const config = useRef(generateDateRangePickerConfig(props.allowClear))

  /**
    This is the daterangepicker's
    apply button event handler

    We can get the fields
    'startDate', 'endDate', 'chosenLabel'
  **/

  function handleApply (event, picker) {
    let chosenLabel = picker.chosenLabel
    let { field } = props

    if (chosenLabel === 'Clear') {
      return props.onQuickFilterChange({ [field]: [] })
    }
    let chosenLabelPredefined = checkChosenLabel(chosenLabel)
    if (chosenLabelPredefined) {
      props.onQuickFilterChange({
        [field]: [{ field, oper : '=', value : chosenLabelPredefined }]
      })
    } else {
      let startDate = picker.startDate.format('YYYY-MM-DD')
      let endDate =  picker.endDate.format('YYYY-MM-DD')
      props.onQuickFilterChange({
        [field]: [{
            field,
            oper : '>=',
            value : startDate
          },
          {
            field,
            oper : '<=',
            value : endDate
          },
        ]
      })
    }
  }

  function checkChosenLabel (chosenLabel) {
    switch( chosenLabel ) {
      case 'Today':
        return '0D'
      case 'Yesterday':
        return '-1D'
      case 'This Week':
        return '0W'
      case 'Last Week':
        return '-1W'
      case 'Last 10 Days':
        return '-10D'
      case 'Last 30 Days':
        return '-30D'
      case 'Last 90 Days':
        return '-90D'
      case 'This Month':
        return '0M'
      case 'Last Month':
        return '-1M'
      case 'This Year':
        return '0Y'
      default:
        return false
    }
  }

  /**
    This is the text next to filter button
    its value might be Today, Last Year or custom range
    if the label is custom range it returns the format "startDate - endDate"
    otherwise it returns label, ex. "Today"
  **/
  function determineChosenLabel (startDate, endDate) {
    let labelText
    switch( true ) {
      case startDate === defaultRanges['Today'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Today'][1].format('YYYY-MM-DD') :
        labelText = 'Today'
        break
      case startDate === defaultRanges['Yesterday'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Yesterday'][1].format('YYYY-MM-DD'):
        labelText = 'Yesterday'
        break
      case startDate === defaultRanges['This Week'][0].format('YYYY-MM-DD') && endDate === defaultRanges['This Week'][1].format('YYYY-MM-DD'):
        labelText = 'This Week'
        break
      case startDate === defaultRanges['Last Week'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Last Week'][1].format('YYYY-MM-DD'):
        labelText = 'Last Week'
        break
      case startDate === defaultRanges['Last 10 Days'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Last 10 Days'][1].format('YYYY-MM-DD'):
        labelText = 'Last 10 Days'
        break
      case startDate === defaultRanges['Last 30 Days'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Last 30 Days'][1].format('YYYY-MM-DD'):
        labelText = 'Last 30 Days'
        break
      case startDate === defaultRanges['Last 90 Days'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Last 90 Days'][1].format('YYYY-MM-DD'):
        labelText = 'Last 90 Days'
        break
      case startDate === defaultRanges['This Month'][0].format('YYYY-MM-DD') && endDate === defaultRanges['This Month'][1].format('YYYY-MM-DD') :
        labelText = 'This Month'
        break
      case startDate === defaultRanges['Last Month'][0].format('YYYY-MM-DD') && endDate === defaultRanges['Last Month'][1].format('YYYY-MM-DD'):
        labelText = 'Last Month'
        break
      case startDate === defaultRanges['This Year'][0].format('YYYY-MM-DD') && endDate === defaultRanges['This Year'][1].format('YYYY-MM-DD') :
        labelText = 'This Year'
        break
      case startDate === '2019-1-1' :
        labelText = ''
        break
      default:
        labelText = `${formatTo( startDate, 'user' )} - ${formatTo( endDate, 'user' )}`
    }
    return labelText
  }

  function formatTo (date = 'YYYY-MM-DD', toFormat = 'user') {
    if (typeof date === 'object') {
      date = date.format('YYYY-MM-DD')
    }
    date = date.split('-')
    if (toFormat === 'daterange') {
      return `${date[1]}-${date[2]}-${date[0]}`
    }
    if (toFormat === 'user') {
      return `${date[1]}/${date[2]}/${date[0]}`
    }
  }

  function convertLetterToDate (letterFormat) {
    let indexMatched
    defaultLetterRanges.some(
      (l, index) => {
        if (letterFormat === l) {
          indexMatched = index
        }
        return letterFormat === l
      }
    )
    if (indexMatched === undefined) {
      console.error('No letter matched on defaultLetterRanges array')
      return {}
    }
    let label = letterMatchesLabel[ indexMatched ]
    return {
      convertedStartDate: defaultRanges[label][0],
      convertedEndDate: defaultRanges[label][1],
      label
    }
  }

  let { 
    field, 
    title, 
    startDate, 
    endDate, 
    iconClassName,
    disabled = false
  } = props

  let labelText
  if ( [ 'Y', 'M', 'W', 'D' ].filter( keyword => startDate.includes(keyword) ).length ) {
    let { convertedStartDate, convertedEndDate, label } = convertLetterToDate( startDate )
    if ( convertedStartDate || convertedEndDate ) {
      startDate = convertedStartDate
      endDate = convertedEndDate
      labelText = label
    } else {
      console.error( 'convertLetterToDate method returned invalid date values'+
                     ', for now filter changed to Today not to crash the app. ' )
      startDate = defaultRanges['Today'][0]
      endDate = defaultRanges['Today'][1]
    }
  } else {
    labelText = determineChosenLabel( startDate, endDate )
  }

  return (
    <div className="btn-group">

      <DateRangePicker
        {...config.current}
        onApply={handleApply}
        startDate={ formatTo(startDate, 'daterange') }
        endDate={ formatTo(endDate, 'daterange' ) }
      >
        <button 
          id={`quickfilter-daterange-${field}`}
          disabled={ disabled }
          className="btn btn-xs gridview-filter-btn no-animation"
          onClick={ e => { 
            let header = global.$('.table-container-header') 
            setTimeout( () => {
              header.hide(0).show(0) 
            }, 1000 )
          } }
        >
          <i className={iconClassName}></i>
          <span className={ classNames({ "font-red-soft bold" : labelText !== '' }) }>
            { title }
          </span>
          <span className="filter-value">
            { labelText }
          </span>
          <b className="fa fa-angle-down"></b>
        </button>
      </DateRangePicker>
    </div>
  )
}

/**
  helper function to generate date range picker config
  for more details about config visit http://www.daterangepicker.com/

  it takes allowClear as a param which determines clear is visible
  within available options like Today, Yesterdat etc.
**/

function generateDateRangePickerConfig (allowClear = true) {
  let ranges = {}
  if (allowClear) {
    ranges['Clear'] = ['1-1-2019', moment().add(1, 'days') ]
  }

  ranges = { ...ranges, ...defaultRanges }

  return {
    opens: (global.App.isRTL() ? 'left' : 'right'),
    startDate: allowClear ? '1-1-2019' : moment().subtract(30, 'days'),
    endDate: moment().format('YYYY-MM-DD'),
    showDropdowns: true,
    showWeekNumbers: true,
    ranges,
    buttonClasses: ['btn'],
    applyClass: 'green',
    cancelClass: 'default',
    format: 'MM-DD-YYYY',
    maxDate : moment().endOf('year'),
    minDate : '1-1-2019', // Use string, so timezone is ignored
    linkedCalendars : false,
    locale: {
      applyLabel: 'Apply',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom Range',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
    }
  }
}

QuickFilters.propTypes = {
  chosenLabel : PropTypes.string,
  field : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  allowClear : PropTypes.bool,
  onQuickFilterChange : PropTypes.func.isRequired,
  iconClassName : PropTypes.string,
  disabled : PropTypes.any
}

QuickFilters.defaultProps = {
  startDate : '2019-1-1',
  endDate : moment().add(1, 'days').format('YYYY-MM-DD'),
  allowClear : true,
  iconClassName : 'fa fa-calendar'
}

export default QuickFilters