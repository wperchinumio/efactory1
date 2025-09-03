import React from 'react'
import PropTypes from 'prop-types'

const BooleanFilter = ({
  checked,
  field,
  iconClassName,
  onQuickFilterChange,
  title,
}) => {
  function handleCheckbox () {
    onQuickFilterChange({
      [ field ] : [ { field , oper : '=', value : !checked } ]
    })
  }

  return (
    <div className="btn-group">
      <button
        className="btn btn-xs gridview-filter-btn"
        type="button"
        onClick={ handleCheckbox }
      >
        <i className={iconClassName}></i>
        <span className=""> { title } </span>
        <span className="filter-value selected-filter"></span>
        <input
          type="checkbox"
          style={{ margin : "0px" }}
          checked={ checked ? true : false }
          onChange={ () => {  } }
        />
      </button>
    </div>
  )
}

BooleanFilter.propTypes = {
  field: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onQuickFilterChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  iconClassName: PropTypes.string.isRequired
}

export default BooleanFilter