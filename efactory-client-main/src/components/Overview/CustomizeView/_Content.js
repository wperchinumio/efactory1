import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Bar from './Bar'
import * as Sections from './Sections'
import * as customizeOverviewActions from '../redux/customizeOverview'

const OverviewCustomizeView = props => {
  const [item_dragging_index, setItem_dragging_index] = useState('')
  const [no_drag, setNo_drag] = useState(false)
  
  useEffect(
    () => {
      return () => {
        let { customizeOverviewActions, customizeOverviewState } = props
        customizeOverviewActions.setRootReduxStateProp_multiple({
          saved_view: true,
          current_areas: [...customizeOverviewState.current_areas_for_overview]
        })
      }
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

  function determineIsMoreThanHalf (event) {
    let targetRect = event.currentTarget.getBoundingClientRect()
    let { y, height } = targetRect
    let isMoreThanHalf = event.clientY > y + ( height / 2 )
    return isMoreThanHalf
  }

  function onDragStart (event) {
    if (no_drag) {
      event.preventDefault()
      return false
    }
    event.dataTransfer.setData('text/plain', 'node')
    event.dataTransfer.effectAllowed = "copyMove"
    event.target.style.cursor = 'move'
    let index = event.target.getAttribute('data-index')
    setItem_dragging_index(index)
  }

  function onDragLeave (event) {}

  function onDragEnd (event) {
    event.target.style.cursor = 'default'
    setItem_dragging_index('')
  }

  function onDrop (event) {}

  function onDragEnter (event) {
    event.preventDefault()
  }

  function onDragOver (event) {
    event.preventDefault()
    let isMoreThanHalf = determineIsMoreThanHalf( event )
    let closest = global.$(event.target).closest('.DraggableRow')
    if (closest.length) {
      let drag_enter_index = closest[0].getAttribute('data-index')
      let { current_areas } = props.customizeOverviewState
      if (drag_enter_index && item_dragging_index && drag_enter_index !== item_dragging_index) {
        if (isMoreThanHalf) {
          if (+item_dragging_index < +drag_enter_index) {
            current_areas = array_move( current_areas, item_dragging_index, drag_enter_index )
          } else {
            return
          }
        } else {
          if (+item_dragging_index < +drag_enter_index) {
            return
          } else {
            current_areas = array_move(current_areas, item_dragging_index, drag_enter_index)
          }
        }
        props.customizeOverviewActions.setRootReduxStateProp_multiple({
          saved_view: false,
          current_areas: [ ...current_areas ]
        })
        setItem_dragging_index(drag_enter_index)
      }
    }
  }


  function onMouseOver (event) {
    let closest = global.$(event.target).closest('.no-drag')
    if (closest.length) {
      if (!no_drag) {
        setNo_drag(true)
      }
    } else {
      if (no_drag) {
        setNo_drag(false)
      }
    }
  }

  let { customizeOverviewState, customizeOverviewActions } = props
  let { current_areas = [] } = customizeOverviewState
  return (
    <div onMouseOver={ onMouseOver } className="draggable-part-overview">
      <Bar
        customizeOverviewState={ customizeOverviewState }
        customizeOverviewActions={ customizeOverviewActions }
      />
      <div className="container-page-bar-fixed">
        <div style={{ marginTop : '-10px' }}>
          {
            current_areas.map(
              ({ name, visible, areas : sub_areas }, index) => {
                return <div
                  key={ `DraggableRow${name}` }
                  data-index={ index }
                  className={ classNames({
                    'DraggableRow' : true,
                    'isBeingDragged' : item_dragging_index && +item_dragging_index === +index
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
                      customizeOverviewState={ customizeOverviewState }
                      customizeOverviewActions={ customizeOverviewActions }
                      sub_areas={ sub_areas }
                      fulfillments={ props.fulfillment.fulfillments }
                    />
                  }
                  {
                    name === 'fulfillment' &&
                    <Sections.Fulfillment
                      visible={ visible }
                      customizeOverviewState={ customizeOverviewState }
                      customizeOverviewActions={ customizeOverviewActions }
                    />
                  }
                  {
                    name === '30days' &&
                    <Sections.ThirtyDays
                      visible={ visible }
                      customizeOverviewState={ customizeOverviewState }
                      customizeOverviewActions={ customizeOverviewActions }
                    />
                  }
                  {
                    name === 'inventory' &&
                    <Sections.Inventory
                      visible={ visible }
                      customizeOverviewState={ customizeOverviewState }
                      customizeOverviewActions={ customizeOverviewActions }
                    />
                  }
                  {
                    name === '50orders' &&
                    <Sections.FiftyOrders
                      visible={ visible }
                      customizeOverviewState={ customizeOverviewState }
                      customizeOverviewActions={ customizeOverviewActions }
                    />
                  }
                  {
                    name === '30days_rmas' &&
                    <Sections.ThirtyDaysRMAs
                      visible={ visible }
                      customizeOverviewState={ customizeOverviewState }
                      customizeOverviewActions={ customizeOverviewActions }
                    />
                  }
                </div>
              }
            )
          }
        </div>
      </div>
    </div>
  )
}

OverviewCustomizeView.propTypes = {
  customizeOverviewActions: PropTypes.object.isRequired,
  customizeOverviewState: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    customizeOverviewState : state.overview.customizeOverview,
    fulfillment : state.overview.fulfillment
  }),
  dispatch => ({
    customizeOverviewActions : bindActionCreators( customizeOverviewActions, dispatch )
  })
)(OverviewCustomizeView)