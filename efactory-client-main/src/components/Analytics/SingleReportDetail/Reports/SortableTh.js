import React from 'react'
import classNames from 'classnames'

const SortableTh = ({
  currentSortedField,
  sortType,
  sortedField,
  title,
  sortTh,
  tableIndex,
  analyticsActions
}) => {
  return (
    <th
      className={ classNames({
        'vertical-align-top' : true,
        'text-right' : sortedField !== 'name'
      })}
    >
      <span className="column-sort noprint">
        <i 
          className={ classNames({
            'fa fa-long-arrow-down' : true,
            'active' : currentSortedField === sortedField && sortType === "descending" ? true : false
          }) } 
          aria-hidden="true"
        />
      </span>
      <span className="column-sort column-sort-up noprint">
        <i 
          className={ classNames({
            'fa fa-long-arrow-up' : true,
            'active' : currentSortedField === sortedField && sortType === "ascending" ? true : false,
          }) }
          aria-hidden="true"
        />
      </span>
      <a 
        onClick={ () => sortTh(tableIndex, sortedField, sortType, analyticsActions) }
      > {title} 
      </a>
    </th>
  )
}

export default SortableTh