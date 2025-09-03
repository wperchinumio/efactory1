import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Bar from './Bar'
import * as Sections from './Sections'
import * as customizeEdiActions from './redux'

const EdiCustomizeView = ({
  customizeEdiActions,
  customizeEdiState,
  ediState,
}) => {
  const [itemDraggingIndex, setItemDraggingIndex] = useState('')
  const [noDrag, setNoDrag] = useState(false)
  
  useEffect(
    () => {
      customizeEdiActions.setRootReduxStateProp_multiple({
        saved_view : true,
        current_areas : [ ...customizeEdiState.current_areas_for_edi ]
      })
    },
    []
  )

  function array_move (arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1
      while (k--) {
        arr.push(undefined)
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
    return arr
  }

  function determineIsMoreThanHalf ( event ) {
    let targetRect    = event.currentTarget.getBoundingClientRect()
    let { y, height } = targetRect
    let isMoreThanHalf = event.clientY > y + ( height / 2 )
    return isMoreThanHalf
  }

  function onDragStart (event) {
    if( noDrag ){
      event.preventDefault()
      return false
    }
    event.dataTransfer.setData('text/plain', 'node')
    event.dataTransfer.effectAllowed = "copyMove"
    event.target.style.cursor = 'move'
    let index = event.target.getAttribute('data-index')
    setItemDraggingIndex(index)
  }

  function onDragLeave (event) {}

  function onDragEnd (event) {
    event.target.style.cursor = 'default'
    setItemDraggingIndex('')
  }

  function onDrop (event) {}
  
  function onDragEnter (event) {
    event.preventDefault()
  }

  function onDragOver (event) {
    event.preventDefault()
    let isMoreThanHalf = determineIsMoreThanHalf( event )
    let closest = global.$(event.target).closest('.DraggableRow')
    if( closest.length ) {
      let drag_enter_index = closest[0].getAttribute('data-index')
      let { current_areas } = customizeEdiState
      if( drag_enter_index && itemDraggingIndex && drag_enter_index !== itemDraggingIndex ){
        if( isMoreThanHalf ){
          if( +itemDraggingIndex < +drag_enter_index  ){
            current_areas = array_move( current_areas, itemDraggingIndex, drag_enter_index )
          }else{
            return
          }
        }else{
          if( +itemDraggingIndex < +drag_enter_index  ){
            return 
          }else{
            current_areas = array_move( current_areas, itemDraggingIndex, drag_enter_index )
          }
        }

        customizeEdiActions.setRootReduxStateProp_multiple({
          saved_view: false,
          current_areas: [ ...current_areas ]
        })

        setItemDraggingIndex(drag_enter_index)
      }
    }
  }


  function onMouseOver (event) {
    let closest = global.$(event.target).closest('.no-drag')
    if( closest.length ) {
      if( !noDrag ){
        setNoDrag(true)
      }
    }else{
      if( noDrag ){
        setNoDrag(false)
      }
    }
  }

  let {
    current_areas = []
  } = customizeEdiState

  return (
    <div onMouseOver={ onMouseOver } className="draggable-part-edi">

      <Bar 
        customizeEdiState={ customizeEdiState }
        customizeEdiActions={ customizeEdiActions }
      />

      <div className="container-page-bar-fixed">
        <div style={{ marginTop : '-10px' }}>
          {
            current_areas.map( ( { name, visible, areas : sub_areas }, index ) => {

              return <div
                key={ `DraggableRow${name}` }
                data-index={ index }
                className={ classNames({
                  'DraggableRow' : true, 
                  'isBeingDragged' : itemDraggingIndex && +itemDraggingIndex === +index
                }) }
                draggable={ true }
                onDragStart={ onDragStart }
                onDragLeave={ onDragLeave }
                onDragEnd={ onDragEnd }
                onDrop={ onDrop }
                onDragEnter={ onDragEnter }
                onDragOver={ onDragOver }
              >
                {
                  name === 'tiles' &&
                  <Sections.Tiles 
                    visible={ visible } 
                    customizeEdiState={ customizeEdiState }
                    customizeEdiActions={ customizeEdiActions }
                    sub_areas={ sub_areas }
                    ediState={ ediState } 
                  />
                }
                {
                  name === 'summary' &&
                  <Sections.Summary 
                    visible={ visible } 
                    customizeEdiState={ customizeEdiState }
                    customizeEdiActions={ customizeEdiActions }
                  />
                }
                {
                  name === '30days' &&
                  <Sections.Edi30Days 
                    visible={ visible } 
                    customizeEdiState={ customizeEdiState }
                    customizeEdiActions={ customizeEdiActions }
                  />
                }
              </div>
            } )
          }
        </div>
      </div>
    </div>
  )
}

EdiCustomizeView.propTypes = {
  customizeEdiActions: PropTypes.object.isRequired,
  customizeEdiState: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    customizeEdiState : state.ediCustomize,
    ediState : state.edi
  }),
  dispatch => ({
    customizeEdiActions : bindActionCreators( customizeEdiActions, dispatch )
  })
)(EdiCustomizeView)