import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getUserData } from '../../../../../util/storageHelperFuncs'
import DashboardStat from '../../../DashboardStats/DashboardStat'

const Tiles = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const [counters_dragged, setCounters_dragged] = useState(getInitialDraggedAndDraggables().dragged)
  const [counters_draggable, setCounters_draggable] = useState(getInitialDraggedAndDraggables().draggable)
  const [item_being_dragged_type, setItem_being_dragged_type] = useState('')
  const [item_being_dragged_index, setItem_being_dragged_index] = useState('')

  const onOverviewLayoutChange = useCallback(
    event => {
      let { current_areas = [] } = propsRef.current.customizeOverviewState
      let area = current_areas.filter( ({ name }) => name === 'tiles' )[0]
      let dragged = [], draggable = []
      let { areas = [] } = area
      areas = [ ...areas ]
      areas.forEach( 
        ({ name, visible }) => {
          if (visible) {
            dragged.push({ name })
          } else {
            draggable.push({ name })
          }
        } 
      )
      setCounters_dragged(dragged)
      setCounters_draggable(draggable)
      setItem_being_dragged_type('')
      setItem_being_dragged_index('')
    },
    []
  )

  useEffect(
    () => {
      global.document.addEventListener( 'overview_layout_changed', onOverviewLayoutChange, false )
      return () => {
        global.document.removeEventListener( 'overview_layout_changed', onOverviewLayoutChange, false )
      }
    },
    []
  )

  function getInitialDraggedAndDraggables () {
    let overview_layout = getUserData('overview_layout')
    let { areas = [] } = overview_layout || {}
    let area = areas.filter( ({ name }) => name === 'tiles' )[0]
    let dragged = []
    let draggable = []

    area.areas.forEach( 
      ({ name, visible }) => {
        if (visible) {
          dragged.push({ name })
        } else {
          draggable.push({ name })
        }
      } 
    )
    return { dragged, draggable }
  }

  function array_move (arr, old_index, new_index) {
    arr = [...arr]
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr
  }

  function onSwitchClicked (event) {
    let { customizeOverviewActions, customizeOverviewState } = props
    let { current_areas = [] } = customizeOverviewState
    current_areas = current_areas.map( 
      area => ({
        ...area,
        visible: area.name === 'tiles' ? !area.visible : area.visible
      })
    )
    customizeOverviewActions.setRootReduxStateProp_multiple({
      saved_view: false,
      current_areas
    })
  }

// AVAILABLE COUNTERS
  function onDragEnter_availableCounters (event) {
    event.preventDefault()
    if (item_being_dragged_index === '' ) {
      return
    }
    if (item_being_dragged_type === 'available' ) {
      return
    }
    let counter_dragged = counters_dragged[ item_being_dragged_index ]
    let counters_draggedNext = [ ...counters_dragged ]
    counters_draggedNext[ item_being_dragged_index ] = undefined
    counters_draggedNext = counters_draggedNext.filter( ({ name } = {}) => name )
    let counters_draggableNext = [ ...counters_draggable, counter_dragged ]
    setCounters_dragged(counters_draggedNext)
    setCounters_draggable(counters_draggableNext)
    setItem_being_dragged_type('available')
    setItem_being_dragged_index(counters_draggableNext.length - 1)

    setTilesVisibilty(counter_dragged[ 'name' ], false)
  }

// AVAILABLE COUNTER
  function onDragStart_availableCounter (event) {
    event.stopPropagation()
    event.dataTransfer.setData('text/plain', 'node')
    event.dataTransfer.effectAllowed = "copyMove"
    event.target.style.cursor = 'move'
    setItem_being_dragged_type('available')
    setItem_being_dragged_index(event.currentTarget.getAttribute('data-index'))
  }

  function onDragLeave_availableCounter (event) {
  }

  function onDragEnd_availableCounter (event) {
    event.target.style.cursor = 'default'
    setItem_being_dragged_index('')
  }

  function onDragEnter_availableCounter (event) {
    event.preventDefault()
    if (item_being_dragged_index === '' ) {
      return 
    }
  }

  function onDragOver_availableCounter (event) {
    event.preventDefault()
  }

// COUNTERS DRAGGED
  function onDragStart_counterDragged (event) {
    event.stopPropagation()
    event.dataTransfer.setData('text/plain', 'node')
    event.dataTransfer.effectAllowed = "copyMove"
    event.target.style.cursor = 'move'
    setItem_being_dragged_type('current')
    setItem_being_dragged_index(event.currentTarget.getAttribute('data-index'))
  }

  function onDragLeave_counterDragged (event) {
  }

  function onDragEnd_counterDragged (event) {
    setItem_being_dragged_index('')
    event.target.style.cursor = 'default'
  }

  function onDrop_counterDragged (event) {
    setItem_being_dragged_index('')
  }
  
  function onDrop_availableCounter (event) {
    setItem_being_dragged_index('')
  }

  function onDragEnter_counterDragged (event) {
    event.preventDefault()
    if (item_being_dragged_index === '' ) {
      return 
    }
    
    let counter_dragged_index = event.currentTarget.getAttribute('data-index')
    let is_empty = event.currentTarget.getAttribute('data-is-empty') === 'true'

    if (item_being_dragged_type === 'available'){

      if (counters_dragged.length === 4  ) return 

      let counter_draggable = counters_draggable[ item_being_dragged_index ]

      let counters_draggableNext = [ ...counters_draggable ]

      counters_draggableNext[ item_being_dragged_index ] = undefined

      counters_draggableNext = counters_draggableNext.filter( ({ name } = {}) => name )

      let counters_draggedNext = [ 
        ...counters_dragged.slice( 0, counter_dragged_index ),
        counter_draggable,
        ...counters_dragged.slice( counter_dragged_index ),
      ]

      setCounters_dragged(counters_draggedNext)
      setCounters_draggable(counters_draggableNext)
      setItem_being_dragged_type('current')
      setItem_being_dragged_index(counter_dragged_index)

      setTilesVisibilty( counter_draggable[ 'name' ], true )

    } else {
      let counters_draggedNext = array_move( counters_dragged, item_being_dragged_index, counter_dragged_index )
      counters_draggedNext = counters_draggedNext.filter( ({ name } = {}) => name )

      if (is_empty && +counter_dragged_index + 1 > counters_draggedNext.length) {
        counter_dragged_index = counters_draggedNext.length - 1
      }

      setCounters_dragged(counters_draggedNext)
      setItem_being_dragged_index(counter_dragged_index)
      let { customizeOverviewActions, customizeOverviewState } = props
      let { current_areas = [] } = customizeOverviewState
      current_areas = JSON.parse(JSON.stringify(current_areas))
      current_areas = current_areas.map( 
        area => {
          if (area.name === 'tiles') {
            let areas_sorted = []
            
            counters_draggedNext.forEach( ({ name }) => {
              areas_sorted.push({ name, visible : true })
            } )

            counters_draggable.forEach( ({ name }) => {
              areas_sorted.push({ name, visible : false })
            } )
            
            area.areas = areas_sorted
            return { ...area }
          } else {
            return area
          }
        } 
      )
      customizeOverviewActions.setRootReduxStateProp_multiple({
        saved_view : false,
        current_areas
      })
    }
  }

  function setTilesVisibilty (name_to_change, visible_to_change) {
    let { customizeOverviewActions, customizeOverviewState } = props
    let { current_areas = [] } = customizeOverviewState
    current_areas = current_areas.map(
      area => {
        if (area.name === 'tiles') {
          area = JSON.parse( JSON.stringify( area ) ) 
          area.areas = area.areas.map( ({ name, visible }) => ({
            name, 
            visible : name === name_to_change ? visible_to_change : visible
          }) )
          return { ...area }
        } else {
          return area
        }
      } 
    )
    customizeOverviewActions.setRootReduxStateProp_multiple({
      saved_view : false,
      current_areas
    })
  }

  function onDragOver_counterDragged (event) {
    event.preventDefault()
  }

  function onDropLast (event) {
    setItem_being_dragged_index('')
  }

  let { visible } = props
  return (
    <div className="portlet light bordered my-10 overview-custom">
      <div className="portlet-title" style={{ marginBottom: '-4px' }}>
        <div className="caption caption-md">
          <span>Component:</span> &nbsp; 
          <span className="customize-overview-title">KEY PARAMETER DISPLAY</span>
        </div>
        <div className="actions">
          <span className="rounded-slider-input">
            <span className="font-grey-gallery">
              Visible:
            </span> &nbsp;&nbsp;
            <div 
              className={ classNames({
                'bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-mini bootstrap-switch-id-test bootstrap-switch-animate' : true,
                'bootstrap-switch-off' : !visible,
                'bootstrap-switch-on' : visible
              }) }
              style={{width: '70px'}}
              onClick={ onSwitchClicked }
            >
              <div 
                className="bootstrap-switch-container" 
                style={{width: 102, marginLeft: visible ? '0px' : '-34px'}}
              >
                <span className="bootstrap-switch-handle-on bootstrap-switch-primary" style={{width: 34}}>
                  ON
                </span>
                <span className="bootstrap-switch-label" style={{width: 34}}>&nbsp;</span>
                <span className="bootstrap-switch-handle-off bootstrap-switch-default" style={{width: 34}}>
                  OFF
                </span>
                <input type="checkbox" defaultChecked className="make-switch" id="test" data-size="mini" />
              </div>
            </div>
          </span>
          <span 
            className="font-24 pull-right font-grey-gallery" 
            style={{ fontWeight : '500', marginTop: '-6px', marginLeft: '10px' }}
          >
            <i className="fa fa-bars"></i>
          </span>
        </div>
      </div>
      <div className="portlet-body no-drag" style={{ padding: '0px' }}>
        <div 
          className="counters-dragged row no-margin counters-dragged"
          onDrop={ onDropLast }
        >
          {
            [1,1,1,1].map( 
              ( x, index ) => {
                let { name } = counters_dragged[ index ] ? counters_dragged[ index ] : {}
                return <div 
                className="col-lg-3 col-md-3 col-sm-6 col-xs-12 counter-dragged"
                key={ `counter-dragged${name ? name : index}` }
                data-index={ index }
                data-is-empty={ name ? 'false' : 'true' }
                draggable={ name ? true : false }
                onDragStart={ !name ? empty_handler : onDragStart_counterDragged }
                onDragLeave={ !name ? empty_handler : onDragLeave_counterDragged }
                onDragEnd={ !name ? empty_handler : onDragEnd_counterDragged }
                onDrop={ !name ? empty_handler : onDrop_counterDragged }
                onDragEnter={ onDragEnter_counterDragged }
                onDragOver={ !name ? empty_handler : onDragOver_counterDragged }
              >
                {
                  name ? 
                  <DashboardStat
                    fulfillments={ props.fulfillments } 
                    name={ name }
                    customization="1"
                  />
                  : <div className="empty-dragged"></div>
                }
              </div>
              }
            )
          }
        </div>
        <div className="counters-draggable-title font-grey-cascade">
          AVAILABLE KPD:
        </div>
        <div 
          className="counters-draggable"
          onDragEnter={ onDragEnter_availableCounters }
          onDrop={ onDropLast }
          style={{ minHeight: '62px' }}
        >
          <div className="counter-draggable-inner">
            {
              counters_draggable.map( ({ name } = {}, index) => {
                return <div 
                  className="counter-draggable"
                  key={ `counter-draggable${name ? name : index}` }
                  data-index={ index }
                  draggable={ name ? true : false }
                  onDragStart={ onDragStart_availableCounter }
                  onDragLeave={ onDragLeave_availableCounter }
                  onDragEnd={ onDragEnd_availableCounter }
                  onDragEnter={ onDragEnter_availableCounter }
                  onDragOver={ onDragOver_availableCounter }
                  onDrop={ onDrop_availableCounter }
                >
                  <DashboardStat
                    fulfillments={ props.fulfillments } 
                    name={ name }
                    customization="1"
                  />
                </div>
              } )
            }
          </div> 
          {
            counters_draggable.length === 0 &&
            <div className="font-grey-silver no-tiles-message">
              Drop in this area the tiles you don't want to show in Overview
            </div>
          }
        </div>
      </div>
    </div>
  )
}

function empty_handler () {}

Tiles.propTypes = {
  visible : PropTypes.any,
  sub_areas: PropTypes.array.isRequired,
  customizeOverviewActions: PropTypes.object.isRequired,
  customizeOverviewState: PropTypes.object.isRequired,
  fulfillments: PropTypes.arrayOf( PropTypes.object ),
}

export default Tiles