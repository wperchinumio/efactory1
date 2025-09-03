import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getMultiSelection } from '../../../util/storageHelperFuncs'
import { useForceUpdate } from '../../_Shared/hooks'

const DropdownFilter = props => {
  const firstRun = useRef(true)
  const forceUpdate = useForceUpdate()
  const [options, setOptions] = useState(sortOptionsAlphabetically(props.options))
  const [hasSameKey, setHasSameKey] = useState('')
  const [preSelectedOptions, setPreSelectedOptions] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOptionsValues, setSelectedOptionsValues] = useState([])
  
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setOptions(sortOptionsAlphabetically(props.options))
    },
    [props.options]
  )

  function isMultiSelection () {
    if (props.disableMultiSelection) {
      return false
    }
    if (props.options.length <= 2) {
      return false
    }
    const noMultiSelectionFields = [ 'flags', 'total', 'rma_status', /*'tbp_period',*/ 'carrier' ]
    if (noMultiSelectionFields.includes(props.field)) {
      return false
    }
    return getMultiSelection()
  }

  function sortOptionsAlphabetically (options = []) {
    if (props.field === 'order_condition' || props.nosort === true) {
      return options
    }
    if (!Array.isArray(options)) {
      console.error('sortOptionsAlphabetically expected options to be an array.')
    }
    options = options.sort( (a, b) => {
      if (a.key < b.key) return -1
      if (a.key > b.key) return 1
      return 0
    })
    return options
  }

  function getValuesOnly (array, field) {
    let result = []
    array.forEach(
      element => {
        if (field === 'inv_type_region' && element.includes('-')) {
          result.push(element.split('-')[1].trim() + '.' + element.split('-')[0].trim())
        }
        else if (field ==='account_wh' && element.includes('-')) {
          result.push(element.split('-')[0].trim() + '.' + element.split('-')[1].trim())
        }
        else if (element.includes('-') && field !== 'tbp_period') {
          result.push(element.split('-')[0].trim())
        }
        else {
          result.push(element)
        }
      }
    )
    return result
  }

  function prepareMenu () {
    let multiSelection = isMultiSelection()
    if (!multiSelection) {
      forceUpdate()
      return
    } 

    let { defaultOption, field } = props
    let selectedOptionsValues = getValuesOnly(selectedOptions, field)

    if (defaultOption && defaultOption.key === undefined && !defaultOption.value.includes(',')) defaultOption.key = defaultOption.value;
    let selectedOptionsNext = [...selectedOptions]
    if (defaultOption && defaultOption.key) {
      selectedOptionsNext = [defaultOption.key]
      selectedOptionsValues = [defaultOption.value]
    }

    setPreSelectedOptions(props.defaultOption ? selectedOptionsNext : [])
    setSelectedOptions(props.defaultOption ? selectedOptionsNext : [])
    setSelectedOptionsValues(props.defaultOption ? selectedOptionsValues : [])
  }

  function handleMultipleApply () {
    let { field } = props
    if (preSelectedOptions.length === 0) {
      props.onQuickFilterChange({ [field]: [] })
      setSelectedOptions([])
    } else {
      setSelectedOptions(preSelectedOptions)
      props.onQuickFilterChange({
        [field]: [{
          field,
          oper: '=',
          value: selectedOptionsValues.join()
        }]
      })
    }
  }

  let {
    title,
    field,
    iconClassName,
    keywordInsteadOfAll,
    disabled = false,
    allOptionHidden = false,
    width
  } = props

  if (field === 'order_type' || field === 'sub_warehouse') {
    width = getMultiSelection() ? '250px': '225px'
  }
  if (field === 'service') {
    width = getMultiSelection() ? '300px': '275px'
  }

  let selectedOption = props.defaultOption || {
    key : '',
    value : '',
    oper : ''
  } 

  let isSelectedOptionValueEmpty = selectedOption.key === ''

  let multiSelection = isMultiSelection()

  let filterValue = !isSelectedOptionValueEmpty
    ? selectedOption.key && keywordInsteadOfAll
      ? selectedOption.key.replace('Total - ', '')
      : hasSameKey
        ? hasSameKey
        : (selectedOption.key || 'MULTI')
    : ''
    return (
    <div className="btn-group" id={`dropdown-${field}`}>
      <button
        className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
        type="button"
        data-toggle="dropdown"
        aria-expanded="false"
        disabled={ disabled }
        onClick={ prepareMenu }
      >
        {
          iconClassName && 
          <i className={iconClassName}></i>
        }
        <span 
          className={ classNames({
            "font-red-soft bold" : !isSelectedOptionValueEmpty
          }) }
        >
          { title }
        </span>
        <span className="filter-value selected-filter">
          { filterValue }
        </span>
        <i className="fa fa-angle-down"></i>
      </button>
      <div className="dropdown-menu checkbox-menu allow-focus" role="menu" >
        <div>
          <ul 
            className={ classNames({
              "filterRR" : true,
              'stop-propagation': multiSelection
            }) }
            style={ width ? { width } : {} }
          >
            {
              !allOptionHidden &&
              field !== 'order_condition' &&
              <li
                className={ classNames({
                  "filterRR" : true,
                  "active" : isSelectedOptionValueEmpty
                }) }
                onClick={ (e) => {
                  if (hasSameKey) {
                    setHasSameKey('')
                  }
                  setSelectedOptions([])
                  props.onQuickFilterChange({ [field]: [] })
                  if (multiSelection) {
                    global.$(`#dropdown-${field}`).removeClass('open')
                  }
                }}
              >
                { keywordInsteadOfAll ? keywordInsteadOfAll : 'All' }
              </li>
            }
            { multiSelection && options.length > 2 &&  options.map( (option, index) => {
              return (
                <li key={`${option.key}-${index}-label`} className="filterRR" >
                  <label>
                    <input type="checkbox"
                    checked={preSelectedOptions.includes(option.key)}
                    onChange={
                      ()=>{
                        if (preSelectedOptions.includes(option.key)) {
                          setPreSelectedOptions(preSelectedOptions.filter(item => item !== option.key))
                          setSelectedOptionsValues(selectedOptionsValues.filter(item => item !== option.value))
                        } else {
                          setPreSelectedOptions([...preSelectedOptions, option.key])
                          setSelectedOptionsValues([...selectedOptionsValues, option.value])
                        }
                      }
                    }
                  />
                    {option.key}
                  </label>
                </li>
              )
            })}
            { 
              (!multiSelection || options.length === 1 || options.length === 2) && 
              options.map( (option, index) => {
                return (
                  <li
                    className={ classNames({
                      "filterRR" : true,
                      "active" :  !isSelectedOptionValueEmpty &&
                                  hasSameKey
                                  ? ( hasSameKey === option.key )
                                  : selectedOption.key === option.key
                    }) }
                    key={`${option.key}-${index}-label`}
                    onClick={ () => {
                      let matchedOptions = options.filter( o => o.value === option.value )
                      if (matchedOptions.length > 1) {
                        setHasSameKey(option.key)
                      }else if (hasSameKey) {
                        setHasSameKey('')
                      }
                      props.onQuickFilterChange({
                        [field]: [{
                          field,
                          oper: option.oper,
                          value: option.value
                        }]
                      })
                    }}
                  >
                    {option.key}
                  </li>
                )
              })
            }
            {
              !allOptionHidden &&
              field === 'order_condition' &&
              <li
                className={
                  classNames('filterRR', {
                    'active': isSelectedOptionValueEmpty
                  })
                }
                onClick={
                  () => {
                    if (hasSameKey ) {
                      setHasSameKey('')
                    }
                    props.onQuickFilterChange({ [field]: [] })
                  }
                }
              >
                { keywordInsteadOfAll }
              </li>
            }
        </ul>
        { 
          multiSelection &&
          <div style={{borderTop: "1px solid #cacaca"}}>
            <button
              type="button"
              className="btn btn-topbar btn-xs quickfilters_apply"
              onClick={handleMultipleApply}
            >
              <i className="fa fa-check"></i>Apply
            </button>
          </div>
        }
        </div>
      </div>
    </div>
  )
}

DropdownFilter.propTypes = {
  title : PropTypes.string.isRequired,
  options : PropTypes.array.isRequired,
  defaultOption : PropTypes.object,
  field : PropTypes.string.isRequired,
  onQuickFilterChange : PropTypes.func.isRequired,
  iconClassName : PropTypes.string,
  keywordInsteadOfAll : PropTypes.any,
  disabled : PropTypes.any,
  allOptionHidden : PropTypes.any,
  width : PropTypes.any
}

export default DropdownFilter