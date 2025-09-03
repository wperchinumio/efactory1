import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Options = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  
  const handleMonthsChange = useCallback(
    event => {
      let months = []
      let { days } = propsRef.current.monthlyFrequency.options
      let optionsToMap = event.target.selectedOptions;
      for( let i = 0; i < optionsToMap.length; i++ ){
        months.push( +optionsToMap[i].value )
      }
      propsRef.current.scheduleActions.setFrequencyInput('monthly', { months, days })
    },
    []
  )

  const handleDayChange = useCallback(
    event => {
      let { months } = propsRef.current.monthlyFrequency.options
      propsRef.current.scheduleActions.setFrequencyInput('monthly', { months, days: [+event.target.value] })
    },
    []
  )

  useEffect(
    () => {
      let months = global.$(".select2-multiple")
      let day = global.$(".select2-allow-clear")
      months.select2({ placeholder: "Months", width: '100%' })
      day.select2({ placeholder: "Day", width: '100%' })
      months.on("change", handleMonthsChange ) // option.value
      day.on("change", handleDayChange )
      return () => {
        let months = global.$(".select2-multiple")
        let day = global.$(".select2-allow-clear")
        months.off("change", handleMonthsChange ) // option.value
        day.off("change", handleDayChange )
      }
    },
    []
  )
  
  function toggleCheckbox (value) {
    if (value === undefined) {
      console.error( 'toggleCheckbox expected a valid value' )
    }
    let { days } = props.dailyFrequency.options
    if (days.indexOf(value) !== -1 ){
      days = [ ...days.slice( 0, days.indexOf(value) ), ...days.slice( days.indexOf(value) + 1 ) ]
    } else {
      days = days.concat(value)
    }
    props.scheduleActions.setFrequencyInput('daily', { "days": days })
  }

  let { 
    dailyFrequency, 
    activeFrequency, 
    monthlyFrequency,
    showOnlyTab
  } = props

  let showDaily = true , showMonthly = true
  if (showOnlyTab ) showDaily = showOnlyTab === 'daily'
  if (showOnlyTab ) showMonthly = showOnlyTab === 'monthly'

  return (
    <div className="row">
      <div className="col-md-3 col-sm-3 col-xs-3">
        <ul className="nav nav-tabs tabs-left nav-themed">
          {
            showDaily && 
            <li 
              className={ classNames({
                bold : true,
                active : activeFrequency === 'daily'
              }) }
              onClick={ event => props.scheduleActions.setScheduleField({ activeFrequency: 'daily' }) }
            >
              <a href="#daily" data-toggle="tab" aria-expanded="false"> Daily </a>
            </li>   
          }
          {
            showMonthly &&
            <li 
              className={ classNames({
                bold : true,
                active : activeFrequency === 'monthly'
              }) }
              onClick={ event => props.scheduleActions.setScheduleField({ activeFrequency: 'monthly' }) }
            >
              <a href="#monthly" data-toggle="tab" aria-expanded="false"> Monthly </a>
            </li>
          }
        </ul>
      </div>
      <div className="col-md-9 col-sm-9 col-xs-9">
        <div className="tab-content">
          {  
            showDaily &&
            <div className={ classNames({
              'tab-pane fade' : true,
              'active in' : activeFrequency === 'daily'
            }) } id="daily">
              <div className="portlet light bordered rs_options">
                <div className="portlet-title">
                  <div className="caption">
                    <span className="caption-subject font-red-soft bold uppercase"><i className="icon-social-dribbble"></i> Options</span>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row padding-5">
                    {
                      [
                        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
                      ].map( ( aDay, index ) => (
                        <label key={`checkbx${index}`}
                          className="mt-checkbox noselect mt-checkbox-outline col-md-3">
                          <input type="checkbox" value={index}
                            checked={ dailyFrequency && dailyFrequency.options.days.indexOf(index) !== -1 }
                            onChange={ event => toggleCheckbox(index) } />
                            { aDay }
                          <span></span>
                        </label>
                      ) )
                    }
                  </div>
                </div>
              </div>
            </div>
          }
          {
            showMonthly &&
            <div className={ classNames({
              'tab-pane fade' : true,
              'active in' : activeFrequency === 'monthly'
            }) } id="monthly">
              <div className="portlet light bordered rs_options">
                <div className="portlet-title">
                  <div className="caption">
                    <span className="caption-subject font-red-soft bold uppercase"><i className="icon-social-dribbble"></i> Options</span>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="form-group">
                    <div className="select2-bootstrap-append">
                      <select
                        className="form-control select2-multiple"
                        value={ (monthlyFrequency && monthlyFrequency.options.months) || [] }
                        onChange={ event => {} }
                        multiple >
                        <option></option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="select2-bootstrap-append">
                      <select
                        className="form-control select2 select2-allow-clear"
                        value={ (monthlyFrequency && monthlyFrequency.options.days[0]) || 1 }
                        onChange={()=>{}}
                        placeholder="Day">
                        <option></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                        <option value="-1">Last Day</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } 
        </div>
      </div>
    </div>
  )
}

Options.propTypes = {
  dailyFrequency: PropTypes.shape({
    type: PropTypes.string.isRequired,
    options: PropTypes.shape({
      days: PropTypes.array.isRequired
    })
  }),
  monthlyFrequency: PropTypes.shape({
    type: PropTypes.string.isRequired,
    options: PropTypes.shape({
      months: PropTypes.array.isRequired,
      days: PropTypes.array.isRequired
    })
  }),
  activeFrequency: PropTypes.oneOf([ 'daily', 'monthly' ]),
  scheduleActions: PropTypes.object.isRequired
}

export default Options