import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getUserData } from '../../../../util/storageHelperFuncs'
import DashboardStat from '../../Overview/DashboardStat'

const empty_arr = [1,1,1,1]

const empty_handler = () => {}

const Tiles = ({
  customizeEdiState,
  customizeEdiActions,
  ediState,
  visible,
}) => {
  const { dragged, draggable } = getInitialCounterValues()
  const [ countersDragged, setCountersDragged ] = useState(dragged)
  const [ countersDraggable, setCountersDraggable ] = useState(draggable)
  const [ itemBeingDraggedType, setItemBeingDraggedType ] = useState('')
  const [ itemBeingDraggedIndex, setItemBeingDraggedIndex ] = useState('')
  const customizeEdiStateRef = useRef(null)
  customizeEdiStateRef.current = customizeEdiState

  const onOverviewLayoutChange = useCallback(
    () => {
      let { current_areas = [] } = customizeEdiStateRef.current
      let area = current_areas.filter( ({ name }) => name === 'tiles' )[0]
      let countersDragged = [], countersDraggable = []
      let { areas = [] } = area
      areas = [ ...areas ]
      areas.forEach(
        ({ name, visible }) => {
          if( visible ){
            countersDragged.push({ name })
          }else{
            countersDraggable.push({ name })
          }
        }
      )
      setCountersDragged(countersDragged)
      setCountersDraggable(countersDraggable)
      setItemBeingDraggedType('')
      setItemBeingDraggedIndex('')
    },
    [customizeEdiState.current_areas]
  )

  useEffect(
    () => {
      global.document.addEventListener( 'edi_layout_changed', onOverviewLayoutChange, false )
      return () => {
        global.document.removeEventListener( 'edi_layout_changed', onOverviewLayoutChange, false )
      }
    },
    []  
  )

  function getInitialCounterValues () {
    let edi_layout = getUserData('edi_overview_layout')
    let { areas = [] } = edi_layout || {}
    let area = areas.filter( ({ name }) => name === 'tiles' )[0]
    let dragged = [] 
    let draggable = []
    area.areas.forEach(
      ({ name, visible }) => {
        if( visible ){
          dragged.push({ name })
        }else{
          draggable.push({ name })
        }
      }
    )
    return {
      dragged,
      draggable
    }
  }

  function array_move (arr, old_index, new_index) {
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
    let { current_areas = [] } = customizeEdiState
    current_areas = JSON.parse( JSON.stringify( current_areas ) )
    current_areas = current_areas.map(
      area => ({
        ...area,
        visible : area.name === 'tiles' ? !area.visible : area.visible
      })
    )
    customizeEdiActions.setRootReduxStateProp_multiple({
      saved_view : false,
      current_areas
    })
  }

// AVAILABLE COUNTERS
  function onDragEnter_availableCounters (event) {
    event.preventDefault()
    if( itemBeingDraggedIndex === '' ) return
    if( itemBeingDraggedType === 'available' ) return
    let counter_dragged = countersDragged[ itemBeingDraggedIndex ]
    let countersDraggedNext = [ ...countersDragged ]
    countersDraggedNext[ itemBeingDraggedIndex ] = undefined
    countersDraggedNext = countersDraggedNext.filter( ({ name } = {}) => name )
    let countersDraggableNext = [ ...countersDraggable, counter_dragged ]
    setCountersDragged(countersDraggedNext)
    setCountersDraggable(countersDraggableNext)
    setItemBeingDraggedType('available')
    setItemBeingDraggedIndex(countersDraggableNext.length - 1)
    setTilesVisibilty( counter_dragged[ 'name' ], false )
  }

// AVAILABLE COUNTER
  function onDragStart_availableCounter (event) {
    event.stopPropagation()
    event.dataTransfer.setData('text/plain', 'node')
    event.dataTransfer.effectAllowed = "copyMove"
    event.target.style.cursor = 'move'
    setItemBeingDraggedType('available')
    setItemBeingDraggedIndex(event.currentTarget.getAttribute('data-index'))
  }

  function onDragLeave_availableCounter (event) {
  }

  function onDragEnd_availableCounter (event) {
    event.target.style.cursor = 'default'
    setItemBeingDraggedIndex('')
  }

  function onDragEnter_availableCounter (event) {
    event.preventDefault()
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
    setItemBeingDraggedType('current')
    setItemBeingDraggedIndex(event.currentTarget.getAttribute('data-index'))
  }

  function onDragLeave_counterDragged (event) {
  }

  function onDragEnd_counterDragged (event) {
    setItemBeingDraggedIndex('')
    event.target.style.cursor = 'default'
  }

  function onDrop_counterDragged (event) {
    setItemBeingDraggedIndex('')
  }

  function onDrop_availableCounter (event) {
    setItemBeingDraggedIndex('')
  }
  
  function onDragEnter_counterDragged (event) {
    event.preventDefault()
    if( itemBeingDraggedIndex === '' ) {
      return
    }

    let countersDraggedNext = [...countersDragged]
    let countersDraggableNext = [...countersDraggable]

    let counter_dragged_index = event.currentTarget.getAttribute('data-index')
    let is_empty = event.currentTarget.getAttribute('data-is-empty') === 'true'

    if ( itemBeingDraggedType === 'available') {
      if( countersDraggedNext.length === 4  ) {
        return
      }
      let counter_draggable = countersDraggableNext[ itemBeingDraggedIndex ]
      countersDraggableNext = [ ...countersDraggableNext ]
      countersDraggableNext[ itemBeingDraggedIndex ] = undefined
      countersDraggableNext = countersDraggableNext.filter( ({ name } = {}) => name )
      countersDraggedNext = [
        ...countersDraggedNext.slice( 0, counter_dragged_index ),
        counter_draggable,
        ...countersDraggedNext.slice( counter_dragged_index ),
      ]

      setCountersDragged(countersDraggedNext)
      setCountersDraggable(countersDraggableNext)
      setItemBeingDraggedType('current')
      setItemBeingDraggedIndex(counter_dragged_index)

      setTilesVisibilty( counter_draggable[ 'name' ], true )

    } else {
      countersDraggedNext = array_move( countersDraggedNext, itemBeingDraggedIndex, counter_dragged_index )
      countersDraggedNext = countersDraggedNext.filter( ({ name } = {}) => name )

      if( is_empty && +counter_dragged_index + 1 > countersDraggedNext.length ){
        counter_dragged_index = countersDraggedNext.length - 1
      }
      setCountersDragged(countersDraggedNext)
      setItemBeingDraggedIndex(counter_dragged_index)
      
      let { current_areas = [] } = customizeEdiState
      current_areas = JSON.parse( JSON.stringify( current_areas ) )
      current_areas = current_areas.map(
        area => {
          if( area.name === 'tiles' ){
            let areas_sorted = []

            countersDraggedNext.forEach( ({ name }) => {
              areas_sorted.push({ name, visible : true })
            } )

            countersDraggableNext.forEach( ({ name }) => {
              areas_sorted.push({ name, visible : false })
            } )

            area.areas = areas_sorted
            return { ...area }
          }else{
            return area
          }
        }
      )
      customizeEdiActions.setRootReduxStateProp_multiple({
        saved_view : false,
        current_areas
      })
    }
  }

  function setTilesVisibilty ( name_to_change, visible_to_change ) {
    let { current_areas = [] } = customizeEdiState
    current_areas = JSON.parse( JSON.stringify( current_areas ) )
    current_areas = current_areas.map(
      area => {
        if( area.name === 'tiles' ){
          area.areas = area.areas.map( ({ name, visible }) => ({
            name,
            visible : name === name_to_change ? visible_to_change : visible
          }) )
          return { ...area }
        }else{
          return area
        }
      }
    )
    customizeEdiActions.setRootReduxStateProp_multiple({
      saved_view : false,
      current_areas
    })
  }

  function onDragOver_counterDragged (event) {
    event.preventDefault()
  }

  function onDropLast (event) {
    setItemBeingDraggedIndex('')
  }

  return (

    <div
      className="portlet light bordered my-10 overview-custom"
      style={{ padding: '0' }}
    >
      <div 
        className="portlet-title" 
        style={{ marginBottom: '0', paddingLeft: '20px', marginTop: '10px' }}
      >
        <div className="caption caption-md">
          <span>Component:</span> &nbsp;
          <span className="customize-overview-title">KEY PARAMETER DISPLAY</span>
        </div>

        <div className="actions" style={{ marginRight: '18px' }}>

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
      <div className="portlet-body no-drag" style={{ paddingTop: '0' }}>
        <div
          className="counters-dragged row no-margin counters-dragged"
          onDrop={ onDropLast }
        >
          {
            empty_arr.map(
              ( x, index ) => {
                let { name } = countersDragged[ index ] ? countersDragged[ index ] : {}
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
                    ediState={ ediState } 
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
          Available KPD:
        </div>
        <div
          className="counters-draggable"
          onDragEnter={ onDragEnter_availableCounters }
          onDrop={ onDropLast }
          style={{ minHeight: '62px' }}
        >
          <div className="counter-draggable-inner">
            {
              countersDraggable.map( ({ name } = {}, index) => {
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
                    ediState={ ediState } 
                    name={ name }
                    customization="1"
                  />
                </div>
              } )
            }  
          </div>
          {
            countersDraggable.length === 0 &&
            <div className="font-grey-silver no-tiles-message">
              Drop in this area the tiles you don't want to show in EDI
            </div>
          }
        </div>
      </div>
    </div>
  )
}

Tiles.propTypes = {
  visible: PropTypes.any,
  sub_areas: PropTypes.array.isRequired,
  customizeEdiActions: PropTypes.object.isRequired,
  customizeEdiState: PropTypes.object.isRequired,
  ediState: PropTypes.object.isRequired,
  fulfillments: PropTypes.arrayOf( PropTypes.object ),
}

export default Tiles