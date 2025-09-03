import React from 'react'

const ColumnSort = ({
  activeSort,
  field
}) => {
  let className = 'fa fa-long-arrow-down';
  if( activeSort[field] ) className += ` active ${ activeSort[field] === 'asc' ?  'asc' : ''}`;
  return (
    <span className="column-sort">
      <i className={ className } aria-hidden="true" />
    </span>
  )
}

export default ColumnSort
