import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

const GridResizeColumn = ({
  changeFieldWidth,
  field,
  sortable,
  width,
}) => {
  const parentNode = useRef(null)
  const instantMemoryObject = useRef(null)
  const widthRef = useRef(null)
  widthRef.current = width
  const sortableRef = useRef(null)
  sortableRef.current = sortable
  const fieldRef = useRef(null)
  fieldRef.current = field

  const onMouseMove = useCallback(
    event => {
      let { screenX } = event
      let { firstScreenX } = instantMemoryObject.current
      let difference = +firstScreenX - +screenX
      if( difference < 0 ){
        parentNode.current.style.right = difference + 'px'
        instantMemoryObject.current.right = difference
      }else{
        if( instantMemoryObject.current.limit > difference ){
          parentNode.current.style.right = difference + 'px'  
          instantMemoryObject.current.right = difference
        }
      }
    },
    []
  )

  const onMouseUp = useCallback(
    event => {
      window.removeEventListener('mousemove', onMouseMove , false )
      window.removeEventListener('mouseup', onMouseUp , false )
      parentNode.current.style.height = ''
      parentNode.current.style.right = '0px'
      global.$(parentNode.current).closest('.grids-wrapper').removeClass('resize-active')
      parentNode.current.className = 'grid-header-resize'
      let newWidth = widthRef.current - +instantMemoryObject.current.right - ( sortableRef.current ? 45 : 20 )
      changeFieldWidth( fieldRef.current, newWidth )
      // set width
      // remove mousemove and mouseup listeners
      // global.$('body').addClass('resize-active');
      // dispatch event for FixableGrid to know to determineIfGridShouldStretch
      let fixableGridColResized = new Event('FixableGridColResized')
      global.document.dispatchEvent( fixableGridColResized )
    },
    [field, sortable, width] 
  )

  const onMouseDown = useCallback(
    event => {
      event.preventDefault()
      instantMemoryObject.current = { 
        firstScreenX: event.screenX,
        limit: 0,
        right: 0
      }
      window.addEventListener('mousemove', onMouseMove, false)
      window.addEventListener('mouseup', onMouseUp, false)
      // make resize height 100% for grid body
      //let bodyHeight        = document.querySelector('.grid-body').getBoundingClientRect().height
      //let headerCellHeight  = document.querySelector('.grid-header-cell').getBoundingClientRect().height
      let bodyHeight = global.$(parentNode.current).closest('.grid').find('.grid-body').height()
      let headerCellHeight = global.$(parentNode.current).closest('.grid-header-cell').height()
      global.$(parentNode.current).closest('.grids-wrapper').addClass('resize-active')
      // document.querySelector( '.grids-wrapper' ).className = 'grids-wrapper resize-active'
      let height = +bodyHeight + +headerCellHeight
      parentNode.current.style.height = height + 'px'
      parentNode.current.className = 'grid-header-resize resize-active'
      let parentWidth = event.target.parentElement.getBoundingClientRect().width
      let limit = parentWidth -( sortableRef.current ?  100 : 75 )
      instantMemoryObject.current.limit = limit
      // @todo make grid cursor resize and maybe change some other styles
    },
    [sortable]
  )

  return (
    <div 
      className="grid-header-resize"
      ref={parentNode}
      onMouseDown={ onMouseDown }
    />
  )
}

GridResizeColumn.propTypes = {
  changeFieldWidth: PropTypes.func,
  width: PropTypes.any,
  field: PropTypes.string.isRequired,
  sortable: PropTypes.bool
}

export default GridResizeColumn