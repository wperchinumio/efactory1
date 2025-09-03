import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const InputTextFilter = ({
  activeFilterValue,
  field,
  iconClassName,
  isActive,
  onQuickFilterChange,
  title,
}) => {
  const firstRun = useRef(true)
  const toggleBtnEl = useRef(null)
  const inputBox = useRef(null)
  const [filterInput, setFilterInput] = useState('')

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (isActive) {
        setFilterInput(activeFilterValue)
      } else {
        setFilterInput('')
      }
    },
    [isActive]
  )

  function handleFilterInputChange (event) {
    event.preventDefault()
    setFilterInput(event.target.value)
  }

  function handleFilterOnSubmit (field) {
    
    toggleBtnEl.current.className = 'btn-group'
    onQuickFilterChange({
      [field]: filterInput.trim() 
      ? [{
          field,
          oper : '=',
          value : filterInput.trim()
      }]
      : []
    })
  }

  return (
    <div
      className="btn-group"
      ref={toggleBtnEl}
    >
      <button className="btn btn-xs gridview-filter-btn dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-expanded="false"
              onClick={
                event => {
                  inputBox.current.focus()
                  inputBox.current.select()
                }
              }
      >
        <i className={iconClassName}></i>
        <span className={ classNames({
          "font-red-soft bold": isActive
        }) }>
          { title }
        </span>
        <span className="filter-value selected-filter">
          { isActive && activeFilterValue }
        </span>
        <i className="fa fa-angle-down"></i>
      </button>

        <div className="dropdown-menu text-quick-filter" role="menu">
          <form 
            onSubmit={ 
              event => {
                event.preventDefault()
                handleFilterOnSubmit(field)
              }
            } 
            autoComplete="off"
          >
            <input
              value={filterInput}
              className='form-control input-sm'
              type='text'
              onChange={handleFilterInputChange}
              ref={inputBox}
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