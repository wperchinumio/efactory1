import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Cell from './Cell'
import { getDefaultBodyCells } from '../_helpers/Renderer'

const GridRow = ({
  columns,
  defaultColumnsConfig,
  fixedColumns,
  id,
  isColumnsFixed,
  index,
  isWithCheckboxes,
  multiple_selected_active_rows = [],
  onRowCheckboxStatusChanged,
  onRowClicked,
  onRowMouseEnter,
  onRowMouseLeave,
  row,
  shouldStretch,
}) => {
  function handleRowClick (event) {
    event.preventDefault()
    let { row_id, header_id } = row
    if( isWithCheckboxes ){
      let closestCheckboxNode = global.$(event.target).closest('.index-col-wrapper-cell')
      if( closestCheckboxNode.length ){
        let closest = global.$( closestCheckboxNode[0] )
        if( closest.hasClass('checked-checkbox') ){
          // remove from checked indexes
          closest.removeClass('checked-checkbox')
          setTimeout( () => {
            onRowCheckboxStatusChanged({ row_id, header_id, row, index }, 'remove')
          }, 0 )
        }else{
          // add to checked indexes
          closest.addClass('checked-checkbox')
          setTimeout( () => {
            onRowCheckboxStatusChanged({ row_id, header_id, row, index }, 'add')
          }, 0 )
        }
        return
      }
    }
    const classAttr = event.currentTarget.getAttribute('class')
    let isSelected = classAttr && classAttr.includes('selected')
    if( isSelected ) return
    onRowClicked({ row_id, header_id, row, index })
  }

  return (
    <div
      className={ classNames({
        'grid-row'      : true,
        'selected-row'  : isWithCheckboxes 
                          ? multiple_selected_active_rows.length > 1
                            ? false 
                            : ( false ) 
                          : ( false ) 
      }) }
      data-row-id={ row.row_id }
      data-row-header-id={ row.header_id }
      onClick={ handleRowClick }
      onMouseEnter={ onRowMouseEnter }
      onMouseLeave={ onRowMouseLeave }
    >

      {
        defaultColumnsConfig && 
        defaultColumnsConfig.columns && 
        defaultColumnsConfig.columns.length > 0 &&
        getDefaultBodyCells( 
          defaultColumnsConfig.columns, 
          id, 
          {
            ...defaultColumnsConfig.data,
            row,
            index
          },
          isWithCheckboxes,
          multiple_selected_active_rows.length ? multiple_selected_active_rows.includes( index ) : false
        )
      }

      {
        columns.map( 
          col => {
            if( 
              ( isColumnsFixed && !fixedColumns.includes( col.field ) )
              || 
              ( !isColumnsFixed && fixedColumns.includes( col.field ) )
            ) { return null }
            return (
              <Cell 
                col={ col }
                row={ row }
                key={`RowCell-${col.field}`}
                shouldStretch={ shouldStretch }
              /> 
            )
          } 
        )
      }
    </div>
  )
}

GridRow.propTypes = {
  columns: PropTypes.arrayOf( PropTypes.shape({
    width: PropTypes.any,
    alias: PropTypes.string,
    field: PropTypes.string
  }) ),
  row: PropTypes.object,
  isColumnsFixed: PropTypes.bool,
  fixedColumns: PropTypes.array,
  gridActions: PropTypes.object.isRequired,
  shouldStretch: PropTypes.bool.isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onRowCheckboxStatusChanged: PropTypes.func,
  onRowMouseEnter: PropTypes.func.isRequired,
  onRowMouseLeave: PropTypes.func.isRequired,
  id: PropTypes.string,
  index: PropTypes.any
}

export default GridRow