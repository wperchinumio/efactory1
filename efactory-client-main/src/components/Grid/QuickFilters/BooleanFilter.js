import React from 'react'
import PropTypes from 'prop-types'

const BooleanFilter = props => {
  function handleCheckbox () {
    let { field, checked, onQuickFilterChange } = props
    if (field === 'qty_short') {
      if ( checked ){
        onQuickFilterChange({
          [ field ] : []
        })
      } else {
        onQuickFilterChange({
          [ field ] : [ { 
            field , 
            oper : '<', 
            value : 0
          } ]
        })
      }
    } else if ( field === 'qty_variance' ) {
      if ( checked ){
        onQuickFilterChange({
          [ field ] : []
        })
      } else {
        onQuickFilterChange({
          [ field ] : [ { 
            field , 
            oper : '<>', 
            value : 0
          } ]
        })
      }
    } else {
      onQuickFilterChange({
        [ field ] : [ { 
          field , 
          oper : '=', 
          value : !checked 
        } ]
      })
    }
  }

  let { 
    checked, 
    title, 
    iconClassName, 
    noIcon,
    disabled
  } = props
    
  return (
    <div className="btn-group">
      <button
        className="btn btn-xs gridview-filter-btn no-animation"
        type="button"
        onClick={ handleCheckbox }
        disabled={ disabled }
      >
        { !noIcon && <i className={iconClassName}></i> } 
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
  field               : PropTypes.string.isRequired,
  title               : PropTypes.string.isRequired,
  onQuickFilterChange : PropTypes.func.isRequired,
  checked             : PropTypes.any,
  iconClassName       : PropTypes.string,
  noIcon              : PropTypes.bool,
  disabled            : PropTypes.any
}

export default BooleanFilter