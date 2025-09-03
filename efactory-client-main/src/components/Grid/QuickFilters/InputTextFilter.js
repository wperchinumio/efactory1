import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const InputTextFilter = props => {
  const toggleButtonRef = useRef(null)
  const inputBoxRef = useRef(null)
  const [filterInput, setFilterInput] = useState('')

  useEffect(
    () => {
      if (props.isActive) {
        setFilterInput(props.activeFilterValue)
      } else {
        setFilterInput('')
      }
    },
    [props.isActive]
  )

  function handleFilterInputChange (event) {
    event.preventDefault()
    setFilterInput(event.target.value)
  }

  function handleFilterOnSubmit (event, field) {
    event.preventDefault()
    toggleButtonRef.current.className = 'btn-group'
    props.onQuickFilterChange({
      [ field ] : filterInput.trim() 
        ? [{
            field,
            oper : '=',
            value : filterInput.trim()
          }]
        : []
    })
  }

  let { title, field, iconClassName } = props

  return (
    <div
      className="btn-group"
      ref={toggleButtonRef}
    >
      <button 
        className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
        type="button"
        data-toggle="dropdown"
        aria-expanded="false"
        onClick={
          event => {
            inputBoxRef.current.focus()
            inputBoxRef.current.select()
          }
        }
      >
        <i className={iconClassName}></i>
        <span className={ classNames({
          "font-red-soft bold" : props.isActive
        }) }>
          { title }
        </span>
        <span className="filter-value selected-filter">
          { props.isActive && props.activeFilterValue }
        </span>
        <i className="fa fa-angle-down"></i>
      </button>
      <div className="dropdown-menu text-quick-filter" role="menu">
        <form onSubmit={ event => handleFilterOnSubmit(event, field) } autoComplete="off">
          <input
            value={filterInput}
            className="form-control input-sm"
            type="text"
            onChange={event=> handleFilterInputChange(event)}
            ref={inputBoxRef}
          />
        </form>
      </div>
    </div>
  )
}

InputTextFilter.propTypes = {
  title : PropTypes.string.isRequired,
  field : PropTypes.string.isRequired,
  onQuickFilterChange : PropTypes.func.isRequired,
  iconClassName : PropTypes.string.isRequired,
  isActive : PropTypes.bool.isRequired,
  activeFilterValue : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.any
  ])
}

export default InputTextFilter