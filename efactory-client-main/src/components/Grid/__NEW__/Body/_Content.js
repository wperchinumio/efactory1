import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as gridActions from '../../redux'
import Row from './Row'
import raf from '../../../_Helpers/requestAnimationFrameHelper'

const GridBody = ({
  columns,
  defaultColumnsConfig,
  fixedColumns,
  gridActions,
  id,
  isColumnsFixed,
  isDefaultColumnsExistForFixedGrid,
  isWithCheckboxes,
  multiple_selected_active_rows,
  onRowCheckboxStatusChanged,
  onRowClicked,
  rows,
  shouldStretch,
  scrollbarWidth,
}) => {
  const headerNode = useRef(null)
  const mouseLeftTime = useRef(null)
  const [didMount, setDidMount] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(
    () => {
      headerNode.current = document.getElementById( `${id}header` )
      setDidMount(true)
    },
    []
  )

  useEffect(
    () => {
      // force update for calculateNoRowsBodyWidth to 
      // calculate correctly when columns resize
      if (rows.length === 0) {
        setForceUpdate( f => f + 1 )
      }
    },
    [columns]
  )

  function handleScroll (event) {
    let scrollStartedTime = (new Date()).getTime()
    id = id.replace('main','fixed-columns')
    let isFixedBodyScrolling = global.$(`#${id}body.grid-body-scrollbar-hidden`).attr('class') && global.$(`#${id}body.grid-body-scrollbar-hidden`).attr('class').includes('scroll-allowed')
    if ( scrollStartedTime - mouseLeftTime.current < 1000 && !isFixedBodyScrolling ){
      global.$('.scroll-allowed').removeClass('scroll-allowed')
      global.$(`#${id}body.grid-not-fixed-body`).addClass('scroll-allowed')
    }

    let scrollAllowed = event.target.className.includes('scroll-allowed')

    if( scrollAllowed ){
      handleScrollUpdates( event.target.scrollLeft, event.target.scrollTop )
    }
  }

  function handleScrollForFixed (event) {
    if( event.target.className.includes('scroll-allowed') ){
      handleScrollUpdatesFixed( event.target.scrollTop )
    }
  }

  function onMouseEnter (event) {
    if( !event.currentTarget.className.includes('scroll-allowed') ){
      event.currentTarget.className += ' scroll-allowed'
    }
  }

  function onMouseLeave (event) {
    event.currentTarget.className = event.currentTarget.className.replace(' scroll-allowed', '')
    mouseLeftTime.current = (new Date()).getTime()
  }

  function onMouseEnter_fixed (event) {
    if( !event.currentTarget.className.includes('scroll-allowed') ){
      global.$(`#${id.replace('fixed-columns','main')}body.grid-not-fixed-body`).removeClass('scroll-allowed')
      event.currentTarget.className += ' scroll-allowed'
    }
  }

  function onMouseLeave_fixed (event) {
    event.currentTarget.className = event.currentTarget.className.replace(' scroll-allowed', '')
  }

  function handleScrollUpdates ( leftScrolled, topScrolled ) {
    if( isDefaultColumnsExistForFixedGrid || fixedColumns.length ){
      raf( () => {
        document.getElementById(`${id.replace('main','fixed-columns')}body`).scrollTop = topScrolled
      } )
    }
    raf( () => {
      headerNode.current.style.webkitTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.current.style.MozTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.current.style.msTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.current.style.OTransform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
      headerNode.current.style.transform = `translate3d( -${ leftScrolled }px , 0px, 0px)`
    } )
  }

  function handleScrollUpdatesFixed (topScrolled) {
    raf(
      () => {
        document.getElementById(`${id.replace('fixed-columns','main')}body`).scrollTop = topScrolled
      }
    )
  }

  function handleRowClick ({ row_id, header_id, row, index }) {
    let $gridsWrapper = global.$(`#${id}body`).closest('.grids-wrapper')
    $gridsWrapper.find('.selected-row').removeClass('selected-row')
    $gridsWrapper.find(`div[data-row-id="${row_id}"]`).addClass('selected-row')
    if( typeof onRowClicked === 'function' ){
      setTimeout( () => {
        onRowClicked({ row_id, header_id, row, index })
      }, 0 )
    }
  }

  function onRowMouseEnter (event) {
    let classAttr = event.currentTarget.getAttribute('class')
    let isHovered = classAttr && classAttr.includes('row-hovered')
    if( isHovered ) {
      return
    }
    let $gridsWrapper = global.$(`#${id}body`).closest('.grids-wrapper')
    let rowId = event.currentTarget.getAttribute('data-row-id')
    $gridsWrapper.find(`div[data-row-id="${rowId}"]`).addClass('row-hovered')
  }

  function onRowMouseLeave (event) {
    let $gridsWrapper = global.$(`#${id}body`).closest('.grids-wrapper')
    $gridsWrapper.find('.row-hovered').removeClass('row-hovered')
  }

  function calculateNoRowsBodyWidth () {
    let lastHeaderCell  = global.$(`#${id}body`).parent().find('.grid-header .last-header-cell')
    if( lastHeaderCell ){
      let width = lastHeaderCell.width()
      let position = lastHeaderCell.position()
      let positionLeft = position ? position.left : 0
      let totalWidth = width + positionLeft
      return totalWidth
    }else{
      return 0
    }
  }

  return !isColumnsFixed ? (
    <div 
      className="grid-body grid-not-fixed-body"
      data-force-update={forceUpdate}
      id={ id + 'body' }
      onScroll={ handleScroll }
      onWheel={ onMouseEnter }
      onMouseEnter={ onMouseEnter }
      onTouchStart={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
      onMouseOver={ onMouseEnter }
    >
      {
        didMount && 
        rows.length > 0 &&
        rows.map( 
          ( row, index ) => {
            return (
              <Row 
                row={row}
                index={ index + 1 }
                key={`Row-${ row.row_id }`}
                id={ id }
                columns={ columns }
                isColumnsFixed={ isColumnsFixed }
                fixedColumns={ fixedColumns }
                gridActions={ gridActions }
                shouldStretch={ shouldStretch }
                onRowClicked={ handleRowClick }
                onRowMouseEnter={ onRowMouseEnter }
                onRowMouseLeave={ onRowMouseLeave }
                isWithCheckboxes={ isWithCheckboxes }
                multiple_selected_active_rows={ multiple_selected_active_rows }
                onRowCheckboxStatusChanged={ onRowCheckboxStatusChanged }
              /> 
            )
          } 
        )
      }

      {
        didMount && 
        rows.length === 0 &&
        <div 
          className="no-rows-available"
          style={{ width : calculateNoRowsBodyWidth(), height : '1px' }}
        ></div>
      }

      <div 
        className="grid-body-last-row"
        style={{ 
          paddingBottom : `${ 15 }px`,
          height: rows.length === 0 ? 'calc(100% - 1px)' : 'initial'
        }}
      ></div>

    </div>
    )
    :
    (
    <div 
      className="grid-body grid-body-scrollbar-hidden"
      id={ id + 'body' }
      onMouseEnter={ onMouseEnter_fixed }
      onTouchStart={ onMouseEnter_fixed }
      onWheel={ onMouseEnter_fixed }
      onMouseOver={ onMouseEnter_fixed }
      onMouseLeave={ onMouseLeave_fixed }
      onScroll={ handleScrollForFixed }
    >
      {
        didMount && 
        rows.map( 
          ( row, index ) => {
            return (
              <Row 
                row={row}
                index={ index + 1 }
                key={`Row-${ row.row_id }`}
                id={ id }
                columns={ columns }
                isColumnsFixed={ isColumnsFixed }
                fixedColumns={ fixedColumns }
                gridActions={ gridActions }
                onRowClicked={ handleRowClick }
                onRowMouseEnter={ onRowMouseEnter }
                onRowMouseLeave={ onRowMouseLeave }
                shouldStretch={ shouldStretch }
                defaultColumnsConfig={ defaultColumnsConfig }
                isWithCheckboxes={ isWithCheckboxes }
                multiple_selected_active_rows={ multiple_selected_active_rows }
                onRowCheckboxStatusChanged={ onRowCheckboxStatusChanged }
              /> 
            )
          } 
        )
      }

      <div 
        className="grid-body-last-row" 
        style={{ 
          paddingBottom : `${ 15 + scrollbarWidth }px`,
          height: rows.length === 0 ? 'calc(100% - 1px)' : 'initial'
        }}>
      </div>
    </div>
  )
}

GridBody.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.any,
      alias: PropTypes.string,
      field: PropTypes.string
    })
  ),
  rows: PropTypes.arrayOf( PropTypes.object ),
  id: PropTypes.string,
  isColumnsFixed: PropTypes.bool,
  fixedColumns: PropTypes.array,
  shouldStretch: PropTypes.bool.isRequired,
  scrollbarWidth: PropTypes.any.isRequired,
  defaultColumnsConfig: PropTypes.shape({
    columns: PropTypes.arrayOf( PropTypes.string ),
    data: PropTypes.object
  }),
  isDefaultColumnsExistForFixedGrid: PropTypes.bool,
  onRowClicked: PropTypes.func,
  isWithCheckboxes: PropTypes.any,
  multiple_selected_active_rows: PropTypes.any,
  onRowCheckboxStatusChanged: PropTypes.func
}

export default connect(
  state => ({
    temp_active_row_id: state.grid.temp_active_row_id
  }),
  dispatch => ({
    gridActions: bindActionCreators( gridActions, dispatch )
  })
)(GridBody)