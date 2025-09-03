import React, { useCallback, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import raf from '../../_Helpers/requestAnimationFrameHelper'
import calculateCellWidth from './_helpers/calculateCellWidth'
import SingleTable from './SingleTable'
import classNames from 'classnames'

const FixableGrid = (props) => {
  const firstRun = useRef([true, true, true, true, true])

  const [fixedColumns, setFixedColumns] = useState([])
  const [columns, setColumns] = useState([ ...props.columns ])
  const columnsRef = useRef(null)
  columnsRef.current = columns
  const [shouldStretch, setShouldStretch] = useState(false)
  const [scrollbarWidth, setScrollbarWidth] = useState(15)
  const [headerFilters, setHeaderFilters] = useState([])
  const headerFiltersRef = useRef(headerFilters)
  headerFiltersRef.current = headerFilters
  const [headerFiltersRemoved, setHeaderFiltersRemoved] = useState([])
  const headerFiltersRemovedRef = useRef(headerFiltersRemoved)
  headerFiltersRemovedRef.current = headerFiltersRemoved
  /*
    determine if the grid should stretch
    check wrapper divs width and the grids width
    if there is a difference, change shouldStretch to true
  */
  const determineIfGridShouldStretch = useCallback(
    () => {
      let { id } = props
      let totalWidth = columnsRef.current.reduce( ( prev, next ) => {
        let { width, sortable } = next
        return { total : prev.total + ( width ? calculateCellWidth( width, sortable ) : 0 ) }
      }, { total : 0 } )[ 'total' ]
      let difference = global.$(`#grids-wrapper-${id}`).width() - totalWidth
      let shouldStretch = difference > 0 ? true : false
      setShouldStretch(shouldStretch)
      return shouldStretch
    },
    [columns]
  )

  const resizeHandler = useCallback(
    event => {
      configureGridHeight()
      let shouldStretch = determineIfGridShouldStretch()
      if( !shouldStretch ){
        setLeftScroll()
      }
    },
    [columns]
  )

  const determineIfGridShouldStretchAfterColResize = useCallback(
    () => {
      let shouldStretch = determineIfGridShouldStretch()
      if( !shouldStretch ){
        setLeftScroll()
      }
    },
    []
  )

  useEffect(
    () => {
      configureGridHeight()
      determineIfGridShouldStretch()
      global.window.__EFACTORY_REACT_DND__ = {}
      window.addEventListener('resize', resizeHandler , false)
      calculateScrollBarWidth()
      global.document.addEventListener( 'FixableGridColResized', determineIfGridShouldStretchAfterColResize, false )
      return () => {
        global.window.__EFACTORY_REACT_DND__ = undefined
        window.removeEventListener('resize', resizeHandler , false)
        global.document.removeEventListener( 'FixableGridColResized', determineIfGridShouldStretchAfterColResize, false )
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
      if (props.heightToSubtract) {
        configureGridHeight()
      }
    },
    [props.heightToSubtract]   
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      let fixedColumnsNext = props.columns.filter( c => c.fixed_column )
      fixedColumnsNext = fixedColumnsNext.map( f => f.field )
      setColumns(props.columns)
      setFixedColumns(fixedColumnsNext)
      global.$(`#main-grid-${props.id} .grid-header`).css({ 
        "-webkit-transform":"translate3d(0px,0px,0px)",
        "-ms-transform":"translate3d(0px,0px,0px)",
        "transform":"translate3d(0px,0px,0px)"
      })
      let gridBodyNode = document.querySelector(`#main-grid-${props.id} .grid-body`)
      if( gridBodyNode ) {
        gridBodyNode.scrollLeft = 0
      }
    },
    [props.columns]   
  )

  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      resizeHandler({})
    },
    [props.resizedFromOutside]
  )

  useEffect(
    () => {
      if (firstRun.current[3]) {
        firstRun.current[3] = false
        return
      }
      if (fixedColumns.length === 1) {
        raf(
          () => {
            document.getElementById(`fixed-columns-grid-${props.id}body`).scrollTop = document.getElementById(`main-grid-${props.id}body`).scrollTop
          }
        )
      }
    },
    [fixedColumns.length]
  )

  useEffect(
    () => {
      if (firstRun.current[4]) {
        firstRun.current[4] = false
        return
      }
      determineIfGridShouldStretch()
    },
    [columns]
  )

  function setLeftScroll () {
    let leftScrolled = global.$(`#main-grid-${props.id}body`).scrollLeft()
    let headerNode = document.getElementById( `main-grid-${props.id}header` )
    raf( () => {
      headerNode.style.webkitTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.style.MozTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.style.msTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.style.OTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.style.transform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
    } )
  }
  
  function calculateScrollBarWidth () {
    // Create the measurement node
    let scrollDiv = document.createElement('div')
    scrollDiv.className = 'scrollbar-measure'
    document.body.appendChild(scrollDiv)
    // Get the scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    setScrollbarWidth(scrollbarWidth)
    // Delete the DIV 
    document.body.removeChild(scrollDiv)
  }

  /*
    if no staticHeight is given, calculate the dynamic height for the fixable grid
  */ 
  function configureGridHeight () {
    let { staticHeight, heightToSubtract, id } = props
    if( staticHeight === undefined ){
      global.$(`#grids-wrapper-${ id }`).css({ height : `${window.innerHeight - heightToSubtract}px` })
    }
  }

  function onColumnFixedChanged (fixedColumns) {
    let { onColumnFixedChanged } = props
    if( onColumnFixedChanged && typeof onColumnFixedChanged === 'function' ){
      onColumnFixedChanged( fixedColumns )
    }
  }

  function fixColumn (field) {
    setFixedColumns( fixedColumns => {
      let fixedColumnsNext = [ ...fixedColumns, field ]
      onColumnFixedChanged(fixedColumnsNext)
      return fixedColumnsNext
    } )
  }

  function unFixColumn (field) {
    setFixedColumns(
      fixedColumns => {
        let fixedColumnsNext = fixedColumns.filter( c => c !== field )
        onColumnFixedChanged(fixedColumnsNext)
        return fixedColumnsNext
      }
    )
  }

  function changeFieldWidth (field, width) {
    setColumns( 
      columns => columns.map( 
        col => ({ ...col, width : col.field === field ? width : col.width }) 
      )
    )
  }

  function updateReorderedColumns (columns) {
    let { onColumnsReordered } = props
    if( onColumnsReordered && typeof onColumnsReordered === 'function' ){
      onColumnsReordered( columns )
    }
    setColumns(columns)
  }

  function onHeaderFilterValueChange (field, value, oper) {
    let headerFiltersNext = [...headerFiltersRef.current]
    let headerFiltersRemovedNext = [...headerFiltersRemovedRef.current]
    headerFiltersNext = headerFiltersNext.filter( f => f.field !== field )
    if( value ){
      headerFiltersNext = [ ...headerFiltersNext, { field, value, oper } ]
      headerFiltersRef.current = headerFiltersNext
      
    }else{
      headerFiltersRemovedNext = [ ...headerFiltersRemovedNext, field ]
      headerFiltersRemovedRef.current = headerFiltersRemovedNext
    }
    setHeaderFilters(headerFiltersNext)
    setHeaderFiltersRemoved(headerFiltersRemovedNext)
  }

  function onHeaderFilterSubmitted () {
    props.onHeaderFilterChanged( headerFiltersRef.current, headerFiltersRemovedRef.current )
    setHeaderFiltersRemoved([])
  }

  let { 
    staticHeight, 
    id, 
    rows,
    defaultColumnsConfig,
    currentSort = {},
    onSortChange,
    onRowClicked,
    headerDoubleLinePattern,
    resetGrid,
    header_filters = {},
    isWithCheckboxes,
    multiple_selected_active_rows,
    onRowCheckboxStatusChanged,
    onCheckAllItemsStatusChanged
  } = props

  return (
    <div 
      className={ classNames({  
        'grids-wrapper'  : true,
        'should-stretch' : shouldStretch,
        'header-double-line' : headerDoubleLinePattern ? true : false
      }) }
      id={ `grids-wrapper-${ id }` }
      style={ staticHeight !== undefined ? { height : `${staticHeight}px` } : {} }
    >
      {
        ( 
          defaultColumnsConfig.columns.length > 0 || 
          fixedColumns.length > 0 
        ) &&
        <SingleTable 
          fixedColumns={ fixedColumns }
          columns={ columns }
          rows={ rows }
          id={`fixed-columns-grid-${id}`}
          fixColumn={ fixColumn }
          unFixColumn={ unFixColumn }
          isColumnsFixed={ true }
          changeFieldWidth={ changeFieldWidth }
          updateReorderedColumns={ updateReorderedColumns }
          shouldStretch={ shouldStretch }
          scrollbarWidth={ scrollbarWidth }
          onHeaderFilterValueChange={ onHeaderFilterValueChange }
          onHeaderFilterSubmitted={ onHeaderFilterSubmitted }
          defaultColumnsConfig={ defaultColumnsConfig }
          currentSort={ currentSort }
          onSortChange={ onSortChange }
          onRowClicked={ onRowClicked }
          headerDoubleLinePattern={ headerDoubleLinePattern }
          resetGrid={ resetGrid }
          header_filters={ header_filters }
          isWithCheckboxes={ isWithCheckboxes }
          multiple_selected_active_rows={ multiple_selected_active_rows }
          onRowCheckboxStatusChanged={ onRowCheckboxStatusChanged }
          onCheckAllItemsStatusChanged={ onCheckAllItemsStatusChanged }
        />
      }
      <SingleTable 
        fixedColumns={ fixedColumns }
        columns={ columns }
        rows={ rows }
        id={`main-grid-${id}`}
        fixColumn={ fixColumn }
        unFixColumn={ unFixColumn }
        isColumnsFixed={ false }
        changeFieldWidth={ changeFieldWidth }
        updateReorderedColumns={ updateReorderedColumns }
        shouldStretch={ shouldStretch }
        scrollbarWidth={ scrollbarWidth }
        onHeaderFilterValueChange={ onHeaderFilterValueChange }
        onHeaderFilterSubmitted={ onHeaderFilterSubmitted }
        currentSort={ currentSort }
        onSortChange={ onSortChange }
        isDefaultColumnsExistForFixedGrid={ 
          defaultColumnsConfig 
          ? defaultColumnsConfig.columns 
            ? defaultColumnsConfig.columns.length > 0
            : false
          : false
        }
        onRowClicked={ onRowClicked }
        headerDoubleLinePattern={ headerDoubleLinePattern }
        resetGrid={ resetGrid }
        header_filters={ header_filters }
        isWithCheckboxes={ isWithCheckboxes }
        multiple_selected_active_rows={ multiple_selected_active_rows }
        onRowCheckboxStatusChanged={ onRowCheckboxStatusChanged }
        onCheckAllItemsStatusChanged={ onCheckAllItemsStatusChanged }
      />
    </div>
  )
}

FixableGrid.propTypes = {
  columns: PropTypes.any,
  currentSort: PropTypes.object,
  defaultColumnsConfig: PropTypes.shape({
    columns: PropTypes.arrayOf( PropTypes.string ).isRequired,
    data: PropTypes.object.isRequired
  }),
  headerDoubleLinePattern: PropTypes.string,
  heightToSubtract: PropTypes.any,
  id: PropTypes.string.isRequired,
  onColumnsReordered: PropTypes.func,
  onHeaderFilterChanged: PropTypes.func,
  onRowClicked: PropTypes.func,
  onSortChange: PropTypes.func,
  resizedFromOutside: PropTypes.any,
  resetGrid: PropTypes.any,
  rows: PropTypes.any,
  staticHeight: PropTypes.any,
  header_filters: PropTypes.object,
  isWithCheckboxes: PropTypes.any,
  multiple_selected_active_rows: PropTypes.any,
  onRowCheckboxStatusChanged: PropTypes.func,
  onCheckAllItemsStatusChanged: PropTypes.func,
  onColumnFixedChanged: PropTypes.func,
}

export default FixableGrid