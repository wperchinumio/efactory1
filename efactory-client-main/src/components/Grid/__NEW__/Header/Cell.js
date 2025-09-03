import React, { useCallback, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import calculateCellWidth from '../_helpers/calculateCellWidth'
import ColumnResize from './ColumnResize'

const HeaderCell = ({
  alias,
  align,
  changeFieldWidth,
  checkBeginningOperators,
  checkEndingOperator,
  columns,
  currentSort = {},
  field,
  filterable,
  fixColumn,
  fixedColumns,
  header_filters,
  headerDoubleLinePattern,
  id,
  isColumnsFixed,
  isLastCell,
  notFixable,
  notResizable,
  onHeaderFilterValueChange,
  onHeaderFilterSubmitted,
  onSortChange,
  resetGrid,
  shouldStretch,
  sortable,
  updateReorderedColumns,
  unFixColumn,
  width,
}) => {
  const firstRun = useRef([true, true])

  const beingDragged = useRef(null)
  const parentId = useRef('key' + createGuid())
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const [filterValue, setFilterValue] = useState('')
  const checkClickEvent = useCallback(
    function (event) {
      const clickInsideCell = global.$(event.target).closest('#'+parentId.current).length
      if (!clickInsideCell) {
        setHeaderMenuOpen(false)
        global.$(document).off('click', checkClickEvent )
      }
    },
    []
  )

  useEffect(
    () => {
      return () => {
        global.$(document).off('click', checkClickEvent )
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (resetGrid) {
        setFilterValue('')
      }
    },
    [resetGrid]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (header_filters[field]) {
        setFilterValue(header_filters[field])
      }
    },
    [header_filters, field]
  )
  
  function createGuid () {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
  }

  function onMenuTogglerClicked (event) {
    if (!headerMenuOpen) {
      global.$(document).on('click', checkClickEvent )
    } else {
      global.$(document).off('click', checkClickEvent )
    }
    setHeaderMenuOpen( headerMenuOpen => !headerMenuOpen )
  }

  function changeValueAndSubmit (field, value, oper) {
    onHeaderFilterValueChange(field, value, oper)
    setTimeout(
      () => {
        onHeaderFilterSubmitted()
      }, 0
    )
  }

  function applyFilter () {
    let value = filterValue.trim()
    let oper = '='
    if( !value.length ){
      return changeValueAndSubmit( field, '', '=' )
    }
    let [ value2, oper2 ] = checkBeginningOperators( value, oper )
    value = value2
    oper = oper2
    let [ value3, oper3 ] = checkEndingOperator( value, oper )
    value = value3
    oper = oper3
    changeValueAndSubmit( field, value, oper )
  }

  function handleFilterOnSubmit (event) {
    event.preventDefault()
    applyFilter()
  }

  function handleDropdownFilterInput (event) {
    let filterValue = event.target.value
    setFilterValue(filterValue)
    changeValueAndSubmit( field, filterValue , '=' )
  }

  function handleFilterInput (event) {
    setFilterValue(event.target.value)
  }

  function clearFilterInputValue (event) {
    setFilterValue('')
    changeValueAndSubmit( field, '' , '=' )
  }
  
  function setDragImage (event) {
    let wrapper = document.createElement('div')
    wrapper.className = 'draggable-appearance'
    wrapper.innerHTML = alias
    let hiddenContainer = document.querySelector('#hidden-resize-image-container')
    hiddenContainer.appendChild( wrapper )
    event.dataTransfer.setDragImage( wrapper, -10, -10 )
  }

  function onDragStart (event) {
    event.dataTransfer.setData('text/plain', 'node')
    setDragImage( event )
    event.dataTransfer.effectAllowed = "move"
    let { leftSideDisabled, rightSideDisabled, fieldBeingDraggedIndex } = determineDisabledDrops()
    global.window.__EFACTORY_REACT_DND__ = {
      fieldBeingDragged : field,
      fieldBeingDraggedIndex,
      leftSideDisabled,
      rightSideDisabled
    }
    beingDragged.current = true
  }
  
  function determineDisabledDrops () {
    let fieldBeingDraggedIndex
    columns.some( (column,index) => {
      if( column.field === field ){
        fieldBeingDraggedIndex = index
        return true
      }
      return false
    })
    if( fieldBeingDraggedIndex === undefined ) {
      return console.error(`${field} not found on columns array.`)
    }
    let leftSideDisabled = findNextNotFixedFieldIfExist( fieldBeingDraggedIndex )
    let rightSideDisabled = findPrevNotFixedFieldIfExist( fieldBeingDraggedIndex )
    return {
      leftSideDisabled,
      rightSideDisabled,
      fieldBeingDraggedIndex
    }
  }

  function findPrevNotFixedFieldIfExist (index) {
    columns = columns.slice( 0, index )
    columns.reverse()
    let matchedPrevField = ' '
    columns.some( (column,index) => {
      if( !fixedColumns.includes( column.field ) ){
        matchedPrevField = column.field
        return true
      }
      return false
    })
    return matchedPrevField
  }

  function findNextNotFixedFieldIfExist (index) {
    let columnsSliced = columns.slice( index + 1 )
    let matchedNextField = ' '
    columnsSliced.some( (column,index) => {
      if( !fixedColumns.includes( column.field ) ){
        matchedNextField = column.field
        return true
      }
      return false
    })
    return matchedNextField
  }

  function onDragEnter (event) {}

  function onDragOver (event) {
    event.preventDefault()
    if( !beingDragged.current ){
      toggleDroppableClassNames( event )
    }
  }

  function toggleDroppableClassNames (event) {
    let isLeft    = determineMousePositionDirection( event ) === 'left'
    let { leftSideDisabled = '', rightSideDisabled = '' } = global.window.__EFACTORY_REACT_DND__
    if( isLeft && leftSideDisabled === field ) return 
    if( !isLeft && rightSideDisabled === field ) return 
    let className = isLeft ? 'left-side-droppable' : 'right-side-droppable'
    let currentClassName = event.currentTarget.className
    if( !currentClassName.includes( className ) ){
      currentClassName = currentClassName.replace('left-side-droppable','')
      currentClassName = currentClassName.replace('right-side-droppable','')
      event.currentTarget.className = `${currentClassName} ${className}`
    }
  }

  function determineMousePositionDirection (event) {
    let targetRect = event.currentTarget.getBoundingClientRect()
    let { width, left } = targetRect
    let middlePositionOfTargetRect = left + ( width / 2 )
    let mousePosition = event.screenX
    return mousePosition < middlePositionOfTargetRect ? 'left' : 'right'
  }

  function onDragLeave (event) {
    let currentClassName = event.currentTarget.className
    currentClassName = currentClassName.replace('left-side-droppable','')
    event.currentTarget.className = currentClassName.replace('right-side-droppable','')
  }

  function onDrag (event) {}

  function onDragEnd (event) {
    document.querySelector('#hidden-resize-image-container').innerHTML = ''
    beingDragged.current = false
  }

  function onDrop (event) {
    let currentClassName = event.currentTarget.className
    let isDropToLeft  = currentClassName.includes('left-side-droppable')
    let isDropToRight = currentClassName.includes('right-side-droppable')
    currentClassName = currentClassName.replace('left-side-droppable','')
    currentClassName = currentClassName.replace('right-side-droppable','')
    event.currentTarget.className = currentClassName
    if( isDropToLeft || isDropToRight ){
      let { fieldBeingDraggedIndex } = global.window.__EFACTORY_REACT_DND__
      let dropZoneFieldIndex
      columns.some( (column,index) => {
        if( column.field === field ){
          dropZoneFieldIndex = index
          return true
        }
        return false
      })
      if( dropZoneFieldIndex === undefined ) return console.error(`${field} not found on columns array.`)
      let injectIndexAt = isDropToLeft ? dropZoneFieldIndex : dropZoneFieldIndex + 1
      let draggedInjectedColumns = [
        ...columns.slice( 0, injectIndexAt ),
        columns[ fieldBeingDraggedIndex ],
        ...columns.slice( injectIndexAt )
      ]
      fieldBeingDraggedIndex = dropZoneFieldIndex > fieldBeingDraggedIndex ? fieldBeingDraggedIndex : fieldBeingDraggedIndex + 1
      draggedInjectedColumns = [
        ...draggedInjectedColumns.slice( 0, fieldBeingDraggedIndex ),
        ...draggedInjectedColumns.slice( fieldBeingDraggedIndex + 1 ),
      ]
      updateReorderedColumns( draggedInjectedColumns )
    }
  }
    
  function emptyHandler () {}

  function createFlexStyleWithPrefixes (width) {
    return {
      width : `${width}px`,
      WebkitBoxFlex : width,
      MsFlexPositive : width,
      flexGrow : width,
      MsFlexNegative : 1,
      flexShrink : 1,
    }
  }  

  function isGridFiltersHidden () {
    return id === 'main-grid-row-detailheader' || id === 'fixed-columns-grid-row-detailheader'
  }

  function onSortClicked (event) {
    if( sortable && onSortChange ){
      let isCurrentlyNotDescSorted = currentSort[ field ] !== 'desc'
      onSortChange({ [ field ] : isCurrentlyNotDescSorted ? 'desc' : 'asc' })
    }
  }

  function getDoubleLinedAlias (alias, headerDoubleLinePattern) {
    let matched = alias.match( new RegExp( headerDoubleLinePattern, 'i' ) )
    if( !matched || !matched[ 0 ] ) return alias
    let secondLine = alias.replace( matched[ 0 ], '' )
    return (
      <span>
        { matched[ 0 ] } 
        <br/>
        <span className="title-second-line"> { secondLine } </span>
      </span>
    ) 
  }

  let widthStyleObj = {}
  width = calculateCellWidth( width, sortable )
  if( shouldStretch ){
    widthStyleObj = createFlexStyleWithPrefixes( width )
  }else{
    widthStyleObj = { width : width }
  }
  let gridFiltersHidden = isGridFiltersHidden()
  return (
    <div 
      className={ classNames({
        'grid-header-cell' : true,
        'last-header-cell' : isLastCell
      }) }
      style={ widthStyleObj } 
      id={ parentId.current }
    >
      <div 
        className={ classNames({ 
          'grid-header-title' : true,
          'menu-open'         : headerMenuOpen,
          'sortable'          : sortable,
          'sorted'            : currentSort[ field ],
          'not-sortable'      : !sortable,
          'double-lined-title': headerDoubleLinePattern ? true : false,
          'not-fixable'       : notFixable,
          'not-resizable'     : notResizable
        }) }
        draggable={ isColumnsFixed ? false : true }
        onDrag={ isColumnsFixed ? emptyHandler : onDrag }
        onDragStart={ isColumnsFixed ? emptyHandler : onDragStart }
        onDragEnd={ isColumnsFixed ? emptyHandler : onDragEnd }
        onDragEnter={ isColumnsFixed ? emptyHandler : onDragEnter }
        onDragOver={ isColumnsFixed ? emptyHandler : onDragOver }
        onDragLeave={ isColumnsFixed ? emptyHandler : onDragLeave }
        onDrop={ isColumnsFixed ? emptyHandler : onDrop }
      > 
        <div className="droppable-left">
          <i className="fa fa-arrow-down" aria-hidden="true"></i>
          <i className="fa fa-arrow-up" aria-hidden="true"></i>
        </div>
        {
          sortable &&
          <div 
            className="sort"
            onClick={ onSortClicked }
          >
            <i className={ classNames({
              'fa' : true,
              'fa-long-arrow-down' : currentSort[ field ] !== 'asc',
              'fa-long-arrow-up' : currentSort[ field ] === 'asc'
            }) } aria-hidden="true"></i>
          </div>
        }
        <div 
          className={ classNames({
            'title noselect' : true,
            [ `text-${ align ? align : 'temp' }` ] : align
          }) }
          onClick={ onSortClicked }
        >
          { 
            headerDoubleLinePattern 
            ? getDoubleLinedAlias( alias, headerDoubleLinePattern )
            : alias 
          }
        </div>
        <div 
          className="menu-toggler" 
          onClick={ notFixable ? emptyHandler : onMenuTogglerClicked }
        >
          <i className="fa fa-chevron-down" aria-hidden="true"/>
        </div>
        <div className="grid-header-menu" >
          <div 
            className="line"
            onClick={ event => {
              if( isColumnsFixed ){
                unFixColumn( field )
              }else{
                fixColumn( field )
              }
            } }
          >
            { isColumnsFixed ? 'Unfix Column' : 'Fix Column' }
          </div>
        </div>
        <ColumnResize
          changeFieldWidth={ changeFieldWidth }
          width={ width }
          field={ field }
          sortable={ sortable }
        />
        <div className="droppable-right">
          <i className="fa fa-arrow-down" aria-hidden="true"></i>
          <i className="fa fa-arrow-up" aria-hidden="true"></i>
        </div>
      </div>
      {
        !gridFiltersHidden && 
        <div className="grid-header-filter table-header-filter">
          {
            filterable
            ? field !== 'order_status'
              ? <form autoComplete="off" onSubmit={ handleFilterOnSubmit }>
                  <input
                    className="form-control input-sm"
                    type="text"
                    value={ filterValue || ''  }
                    onChange={ handleFilterInput }
                  />
                  {
                    filterValue.trim().length > 0 &&
                    <span 
                      className="clear-header-input"
                      onClick={ clearFilterInputValue }
                    >
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  }
                </form>
              : <form autoComplete="off">
                  <select
                    className="form-control input-sm"
                    onChange={ handleDropdownFilterInput }
                    value={ filterValue || ''  }
                  >
                    <option value=""></option>
                    <option value="0">On Hold</option>
                    <option value="1">Normal</option>
                    <option value="2">Rush</option>
                  </select>
                </form>
             :  <span></span>
          }
        </div>
      }
    </div>
  )
}

HeaderCell.propTypes = {
  width: PropTypes.any,
  id: PropTypes.string.isRequired,
  alias: PropTypes.string,
  field: PropTypes.string,
  filterable: PropTypes.bool,
  sortable: PropTypes.bool,
  changeFieldWidth: PropTypes.func,
  updateReorderedColumns: PropTypes.func,
  shouldStretch: PropTypes.bool.isRequired,
  onHeaderFilterValueChange: PropTypes.func.isRequired,
  onHeaderFilterSubmitted: PropTypes.func.isRequired,
  currentSort: PropTypes.object,
  onSortChange: PropTypes.func,
  isLastCell: PropTypes.any,
  resetGrid: PropTypes.any,
  header_filters: PropTypes.any,
  notFixable: PropTypes.any,
  notResizable: PropTypes.any,
}

export default HeaderCell