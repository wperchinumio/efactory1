import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import HeaderCell from './Cell'
import { getDefaultHeaderCells } from '../_helpers/Renderer'

const GridHeaderWrapper = ({
  changeFieldWidth,
  columns,
  currentSort,
  defaultColumnsConfig,
  fixColumn,
  fixedColumns,
  header_filters,
  headerDoubleLinePattern,
  id = '',
  isColumnsFixed,
  isWithCheckboxes,
  onCheckAllItemsStatusChanged,
  onHeaderFilterValueChange,
  onHeaderFilterSubmitted,
  onSortChange,
  resetGrid,
  shouldStretch,
  scrollbarWidth,
  unFixColumn,
  updateReorderedColumns,
}) => {
  useEffect(
    () => {
      if ( !isColumnsFixed ) {
        global.$(`#${id}header`).css({
          "-webkit-transform":"translate3d(0px,0px,0px)",
          "-ms-transform":"translate3d(0px,0px,0px)",
          "transform":"translate3d(0px,0px,0px)"
        })
      }
    },
    [shouldStretch]
  )

  function checkEndingOperator (value, oper) {
    let isEndsWithOperator = value.length && value.slice(-1) === '*'
    if ( isEndsWithOperator ){
      if ( oper[0] === '[' ) oper += '*]'
      else oper = '*]'
      value = value.slice(0,-1)
    }
    return [ value, oper ]
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

    return [ value, oper ]
  }

  function getLastCellIndex () {
    let columns_not_fixed = columns.filter( ({ field }) => !fixedColumns.includes( field )  )
    let field_last = columns_not_fixed[ columns_not_fixed.length - 1 ] ? columns_not_fixed[ columns_not_fixed.length - 1 ][ 'field' ] : -1
    if( !field_last ){
      console.error('no field found')
      return -1
    }
    let index = columns.findIndex( ({ field }) => field_last === field  )
    return index
  }

  function isGridFiltersHidden () {
    return id === 'main-grid-row-detail' || id === 'fixed-columns-grid-row-detail'
  }

  let lastCellIndex = ''
  if( !isColumnsFixed ) lastCellIndex = getLastCellIndex()
  
  let gridFiltersHidden = isGridFiltersHidden()

  return (
    <div 
      className="grid-header" 
      id={ id + 'header' }
      style={ shouldStretch && !id.includes('fixed-columns') ? { width : `calc( 100% - ${scrollbarWidth}px )` } : {} }
    >
      {
        defaultColumnsConfig && 
        defaultColumnsConfig.columns && 
        defaultColumnsConfig.columns.length > 0 &&
        getDefaultHeaderCells( 
          defaultColumnsConfig.columns, 
          id, 
          headerDoubleLinePattern ? true : false,
          gridFiltersHidden,
          isWithCheckboxes,
          onCheckAllItemsStatusChanged
        )
      }
      {
        columns.length > 0 && columns.map( 
          ( col, index ) =>  {
            if( 
              ( isColumnsFixed && !fixedColumns.includes( col.field ) )
              || 
              ( !isColumnsFixed && fixedColumns.includes( col.field ) )
            ) { return null }
            return (
              <HeaderCell 
                { ...col }
                col={ col }
                key={`HeaderCell-${col.field}`}
                isColumnsFixed={ isColumnsFixed }
                fixColumn={ fixColumn }
                unFixColumn={ unFixColumn }
                changeFieldWidth={ changeFieldWidth }
                columns={ columns }
                updateReorderedColumns={ updateReorderedColumns }
                fixedColumns={ fixedColumns }
                shouldStretch={ shouldStretch }
                id={ id + 'header' }
                onHeaderFilterValueChange={ onHeaderFilterValueChange }
                onHeaderFilterSubmitted={ onHeaderFilterSubmitted }
                checkEndingOperator={ checkEndingOperator }
                checkBeginningOperators={ checkBeginningOperators }
                currentSort={ currentSort }
                onSortChange={ onSortChange }
                isLastCell={ index === lastCellIndex }
                headerDoubleLinePattern={ headerDoubleLinePattern }
                resetGrid={ resetGrid }
                header_filters={ header_filters }
              />
            )
          }  
        )
      }
      {
        columns.length === 0 &&
        <div 
          className="grid-header-cell last-header-cell"
          style={{ width: '100%' }}
        >
          <div className="grid-header-title">
            <div className="title noselect text-left"></div>
          </div>
          <div className="grid-header-filter table-header-filter">
            <span></span>
          </div>
        </div>
      }
      {
        !isColumnsFixed &&
        !shouldStretch &&
        <div 
          className="grid-header-cell header-cell-scroll-fix"
          style={{  width: `${scrollbarWidth}px` }}
        >
          <div 
            className={ classNames({
              'grid-header-title' : true,
              'double-lined-title': headerDoubleLinePattern ? true : false
            }) }
          >
            <div className="title noselect text-left"></div>
          </div>
          {
            !gridFiltersHidden &&
            <div className="grid-header-filter table-header-filter">
              <span></span>
            </div>
          }
        </div>
      }
      {
        !isColumnsFixed &&
        shouldStretch &&
        <div 
          className="grid-header-cell header-cell-scroll-fix"
          style={{ position: 'absolute', right: `-${scrollbarWidth}px`, width: `${scrollbarWidth}px` }}
        >
          <div 
            className={ classNames({
              'grid-header-title' : true,
              'double-lined-title': headerDoubleLinePattern ? true : false
            }) }
          >
            <div className="title noselect text-left"></div>
          </div>
          {
            !gridFiltersHidden &&
            <div className="grid-header-filter table-header-filter">
              <span></span>
            </div>
          }
        </div>
      }
      <div id="hidden-resize-image-container" />
    </div>
  )
}

GridHeaderWrapper.propTypes = {
  columns: PropTypes.arrayOf( PropTypes.shape({
    width: PropTypes.any,
    alias: PropTypes.string,
    field: PropTypes.string
  }) ).isRequired,
  id: PropTypes.string,
  isColumnsFixed: PropTypes.bool,
  fixColumn: PropTypes.func,
  unFixColumn: PropTypes.func,
  fixedColumns: PropTypes.array,
  changeFieldWidth: PropTypes.func,
  updateReorderedColumns: PropTypes.func,
  shouldStretch: PropTypes.bool.isRequired,
  scrollbarWidth: PropTypes.any.isRequired,
  onHeaderFilterValueChange: PropTypes.func.isRequired,
  onHeaderFilterSubmitted: PropTypes.func.isRequired,
  defaultColumnsConfig: PropTypes.shape({
    columns: PropTypes.arrayOf( PropTypes.string ),
    data: PropTypes.object
  }),
  currentSort: PropTypes.object,
  onSortChange: PropTypes.func,
  headerDoubleLinePattern: PropTypes.string,
  resetGrid: PropTypes.any,
  header_filters: PropTypes.object.isRequired,
  isWithCheckboxes: PropTypes.any,
  onCheckAllItemsStatusChanged: PropTypes.func
}

export default GridHeaderWrapper