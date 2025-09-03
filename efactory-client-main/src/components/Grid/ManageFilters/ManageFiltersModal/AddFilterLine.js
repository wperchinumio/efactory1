import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
momentLocalizer(moment)
import Select2React from '../../../_Shared/Components/Select2React'

const ranges = ['0D','-1D', '0W', '-1W', '-10D','-30D','-90D','0M','-1M','0Y']

const OthersMain = (props) => {
  const availableFieldsRef = useRef(null)

  /*
    if field is date type
    - add 0D, 30D etc to oper options
    - hide last field when one of those selected
  */
  function onFilterObjectChanged (filterObject) {
    props.onFilterObjectChanged(filterObject, props.dataToBePassed)
  }

  /*
    On field change, we should change the oper to '='
  */
  function onFieldChanged (value) {
    let { filterObject } = props
    if( value !== filterObject.field ){
      filterObject = {
        field : value,
        value : '',
        oper  : '='
      }
      onFilterObjectChanged( filterObject )
    }
  }

  function onOperChanged (event) {
    let { value } = event.target
    let { filterObject } = props
    if( isMatchRanges( value ) ){
      filterObject = {
        field : filterObject.field,
        oper  : '=',
        value
      }
    }else{
      filterObject = {
        field : filterObject.field,
        value : '',
        oper  : value
      }
    }
    onFilterObjectChanged( filterObject )
  }

  function onValueChanged (event) {
    let { value } = event.target
    let { filterObject } = props
    filterObject = {
      field : filterObject.field,
      oper  : filterObject.oper,
      value
    }
    onFilterObjectChanged( filterObject )
  }

  function handleDateFieldInput (dateObj) {
    let date = moment(
      dateObj ? dateObj : new Date()
    ).format('YYYY-MM-DD')
    let { filterObject } = props
    onFilterObjectChanged({
      field : filterObject.field,
      oper  : filterObject.oper,
      value : date
    })
  }

  function removeLine () {
    props.removeLine( props.dataToBePassed )
  }

  function isFieldDateType (field) {
    let { availableFields } = props
    let fieldType = ''
    availableFields.some( f => {
      if( f.field === field ){
        fieldType = f.data_type
        return true
      }
      return false
    } )
    return fieldType === 'date' || fieldType === 'datetime'
  }

  function isMatchRanges (keyword) {
    return ranges.includes( keyword )
  }

  function getOperDateOptions () {
    return [
      <option disabled key="date-field-0">_________</option>,
      <option value="0D" key="date-field-1"> Today </option>,
      <option value="-1D" key="date-field-2"> Yesterday </option>,
      <option value="0W" key="date-field-3"> This Week </option>,
      <option value="-1W" key="date-field-4"> Last Week </option>,
      <option value="-10D" key="date-field-5"> Last 10 Days </option>,
      <option value="-30D" key="date-field-6"> Last 30 Days </option>,
      <option value="-90D" key="date-field-7"> Last 90 Days </option>,
      <option value="0M" key="date-field-8"> This Month </option>,
      <option value="-1M" key="date-field-9"> Last Month </option>,
      <option value="0Y" key="date-field-10"> This Year </option>
    ]
  }

  let {
    availableFields,
    filterObject
  } = props

  if( !availableFieldsRef.current ){
    availableFieldsRef.current = {}
    availableFields.forEach(f => {
      availableFieldsRef.current[ f.field ] = f.title
    })
  }

  let {
    field, value, oper
  } = filterObject

  let fieldDateType = isFieldDateType( field )

  if( fieldDateType && isMatchRanges( value ) ){
    oper = value
    value = ''
  }

  return (
    <div style={{padding: "0 5px"}}>
      <div className="form-group filter-line">
        <div className="col-md-4">
          <Select2React
            className="form-control imput-sm"
            options={ availableFieldsRef.current }
            selected={ field }
            onChangeHandler={ onFieldChanged }
            height="33px"
            placeholder="Select... "
            boxHeight="240px"
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            name='oper'
            value={ oper }
            onChange={ onOperChanged }
          >
            <option value="=">Is Equals To...</option>
            <option value="<>">Is Not Equal To...</option>
            <option value="==" data-no-field="true">Is Blank</option>
            <option value="!=" data-no-field="true">Is Not Blank</option>
            <option value="*]">Start With...</option>
            <option value="[*">Ends With...</option>
            <option value="[**]">Contains...</option>
            <option value=">">Is Greater Than...</option>
            <option value=">=">Is Greater Than or Equal To...</option>
            <option value="<">Is Less Than...</option>
            <option value="<=">Is Less Than or Equal To...</option>
            {
              fieldDateType &&
              getOperDateOptions()
            }
          </select>
        </div>
        <div className="col-md-4">
          <div className="input-group input-group-sm">
            <div
              className={ classNames({
                'input-group-control' : true,
                'invisible': ['==','!='].includes( oper ) || isMatchRanges( oper )
              }) }
            >
              {
                fieldDateType ?
                <DatePicker
                  format="MM/DD/YYYY"
                  name="value"
                  onChange={ dateObj => handleDateFieldInput( dateObj ) }
                  time={false}
                  value={ value
                          ? moment(value).toDate()
                          : moment().toDate() }
                />
                :
                <input
                  className="form-control input-md"
                  type="text"
                  name='value'
                  value={ value }
                  onChange={ onValueChanged }
                  style={{ borderRadius : '4px' }}
                />
              }
            </div>
            <div className="input-group-btn btn-right">
              <button
                type="button"
                className="btn btn-xs" style={{marginLeft: "5px"}}
                onClick={ removeLine }
              ><i className="fa fa-minus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OthersMain.propTypes = {
  availableFields       : PropTypes.array.isRequired,
  dataToBePassed        : PropTypes.any,
  filterObject          : PropTypes.shape({
    field : PropTypes.string,
    oper  : PropTypes.string,
    value : PropTypes.any
  }).isRequired,
  onFilterObjectChanged : PropTypes.func.isRequired,
  removeLine            : PropTypes.func.isRequired
}

export default OthersMain