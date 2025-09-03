import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GridRow, GridHeader } from '../Commons'

const TableHeaderFilters = ({
  currentFilters = [],
  flagsColumnVisible,
  invoiceAllColumnVisible,
  orderTypeColumnVisible,
  toggleFilters,
  queryFilters,
  quickfilters,
  viewFields,
}) => {
  const firstRun = useRef([true, true])
  const [filters, setFilters] = useState({})

  useEffect(
    () => {
      initiateHeaderFilterValuesFromCurrentFilters()
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      let filtersNext = { ...filters }
      Object.keys( filters ).forEach( filterInputKey => {
        let matches = currentFilters.filter( f => f.field === filterInputKey )
        let matchesExist = matches.length > 0
        if( !matchesExist ){
          filtersNext[filterInputKey] = ''
        }
      } )
      setFilters(filtersNext)
    },
    [currentFilters]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      const queryFiltersExists = Object.keys( queryFilters ).length > 0
      if (queryFiltersExists) {
        initiateHeaderFilterValuesFromCurrentFilters()
      }
    },
    [queryFilters]
  )

  function initiateHeaderFilterValuesFromCurrentFilters () {
    let quickfilters_keys = Object.keys( quickfilters )
    let queryFilters_keys = Object.keys( queryFilters )
    queryFilters_keys = queryFilters_keys.filter( 
      ({ field }) => !quickfilters_keys.includes( field ) && filters[ field ] === undefined
    )
    if( queryFilters_keys.length ){
      let filtersNext = {}
      queryFilters_keys.forEach(
        queryFilter_key => {
          let filter = queryFilters[ queryFilter_key ]
          if( filter.length === 1 ){
            filter = filter[0]
            let {
              field, value , oper
            } = filter
            // @todo check oper more carefully, for instance if it includes prefix or suffx 
            filtersNext[ field ] = (oper === '=' ? value : oper + value)
          }  
        }
      )
      setFilters(filtersNext)
    }
  }

  function handleFilterInput (event, field) {
    let filtersNext = {...filters}
    filtersNext[field] = event.target.value
    setFilters(filtersNext)
  }

  function handleDropdownFilters (event, field) {
    let value = event.target.value
    let oper = '='
    let isSelectedOptionAny = value === '-1'
    toggleFilters(
      {
        [field]: isSelectedOptionAny ? [] : [{ field, oper, value }]
      }, 
      true
    )
    let filtersNext = {...filters}
    filtersNext[field] = event.target.value
    setFilters(filtersNext)
  }

  function handleFilterOnBlur (event, field) {
    let value = ( filters[field] && filters[field].trim() ) || ''
    handleFilterOnSubmit( event, field, value, false )
  }

  function handleFilterOnSubmit (event, field, valueProvided = '', refresh = true) {
    event.preventDefault()
    let value = refresh ? event.target.querySelector('input').value : valueProvided
    let oper = '='
    let isValueEmpty = value.length === 0

    if( isValueEmpty ){
      let matches = currentFilters.filter( f => f.field === field )
      if( matches.length ) {
        toggleFilters({ [ field ] : [ ] }, refresh)
      }
      return
    }

    let [ value2, oper2 ] = checkBeginningOperators( value, oper )
    value = value2
    oper = oper2

    let [ value3, oper3 ] = checkEndingOperator( value, oper )
    value = value3
    oper = oper3

    toggleFilters({ 
      [field]: [ { field, oper, value } ] },
      refresh
    )
  }

  function checkEndingOperator (value, oper) {
    let isEndsWithOperator = value.length && value.slice(-1) === '*'
    if ( isEndsWithOperator ){
      if ( oper[0] === '[' ) {
        oper += '*]'
      } else {
        oper = '*]'
      }
      value = value.slice(0,-1)
    }
    return [value, oper]
  }

  function checkBeginningOperators (value, oper) {
    let operators = ['>','<','=','*','!']
    let isBeginsWithOperator = value && operators.indexOf(value[0]) > -1
    if( isBeginsWithOperator ){
      oper = value[0]
      value = value.slice(1)
      if ( oper === "*" ) oper = '[*'
      if (value.length && operators.indexOf(value[0]) !== -1) {
        oper += value[0]
        value = value.slice(1)
      }
    }
    return [value, oper]
  }

  function getHeaderTableDataJSX (viewFields = []) {
    let filterFields = []
    viewFields.forEach( 
      (field, fieldIndex) => {
        if( field.filterable && !quickfilters[field] ){
          // we only use field.field in this if block
          let field_ = field
          field = field.field

          if (field === 'order_status') {
            let match = currentFilters.filter( c => c.field === 'order_status' )[0]
            filterFields.push(
              <GridHeader key={field + "filter"}>
                <div>
                  <select
                    className="form-control input-sm"
                    onChange={ event => handleDropdownFilters( event, field ) }
                    value={ match ? match.value : '-1' }
                  >
                    <option value="-1"></option>
                    <option value="0">On Hold</option>
                    <option value="1">Normal</option>
                    <option value="2">Rush</option>
                  </select>
                </div>
              </GridHeader>
            )
          } else if(field_.data_type === 'boolean') {
            
            let match = currentFilters.filter( c => c.field === field )[0]

            filterFields.push(
              <GridHeader key={field + "filter"}>
                <div>
                  <select
                    className="form-control input-sm"
                    onChange={ event => handleDropdownFilters( event, field ) }
                    value={ match ? match.value : '-1' }
                  >
                    <option value="-1"></option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </GridHeader>
            )
          }else{

            filterFields.push(
            <GridHeader key={field + "filter"}>
              <form autoComplete="off" onSubmit={ event => handleFilterOnSubmit(event, field) }>
                <input
                  className="form-control input-sm"
                  type="text"
                  value={ filters[ field ] || ''  }
                  onChange={ event => handleFilterInput( event, field ) }
                  onBlur={ event => handleFilterOnBlur(event, field) }
                />
              </form>
            </GridHeader>
            )
          }
        } else {
          filterFields.push(
            <GridHeader key={field.field + "filter"}></GridHeader>
          )
        }
      })
    return filterFields
  }

  return (
    <GridRow className="uppercase table-header-filter" style={{ whiteSpace : "nowrap" }}>
      <GridHeader key="headerIndexFilter"/>
      {
        orderTypeColumnVisible &&
        <GridHeader key="headerFixedSecondFilter" />
      }
      {
        flagsColumnVisible &&
        <GridHeader key="flagsHeaderFilter" />
      }
      {
        invoiceAllColumnVisible &&
        <GridHeader key="headerFixedThirdFilter" />
      }
      { 
        getHeaderTableDataJSX(viewFields) 
      }
      <GridHeader key="lastColumnFilter" />
    </GridRow>
  )
}

TableHeaderFilters.propTypes = {
  className: PropTypes.string,
  viewFields : PropTypes.array.isRequired,
  quickfilters : PropTypes.object.isRequired,
  currentFilters : PropTypes.array.isRequired,
  toggleFilters : PropTypes.func.isRequired,
  orderTypeColumnVisible : PropTypes.bool,
  flagsColumnVisible : PropTypes.any,
  invoiceAllColumnVisible : PropTypes.bool,
  resource : PropTypes.string,
  queryFilters : PropTypes.object
}

export default TableHeaderFilters