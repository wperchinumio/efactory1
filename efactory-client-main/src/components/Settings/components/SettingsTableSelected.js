import React, { useRef, useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'

const SettingsTableSelected = props => {
  const firstRun = useRef(true)
  const propsRef = useRef(null)
  propsRef.current = props
  const sortableNode = useRef(null)
  const changedOrder_prevProps = useRef(props.changedOrder)
  const [filterInput, setFilterInput] = useState('')
  const [activeMoveModalFieldOrderValue, setActiveMoveModalFieldOrderValue] = useState('')
  const [activeMoveModalField, setActiveMoveModalField] = useState('')

  const handleSortUpdate = useCallback(
    (event, ui) => {
      global.$('.editable').editable('destroy')
      event.preventDefault()
      sortableNode.current.off("sortupdate", handleSortUpdate )
      let orderOfFields = global.$("table.row-sortable tbody").sortable("toArray")
      props.changeFieldsOrder( orderOfFields )
      sortableNode.current.on("sortupdate", handleSortUpdate )
    },
    []
  )

  const checkClickEvent = useCallback(
    () => {
      if (!global.$(event.target).closest('.view-move-row').length ) {
        if (activeMoveModalField) {
          setActiveMoveModalField('')
        }
      }
    },
    []
  )
  
  useEffect(
    () => {
      sortableNode.current = global.$("table.row-sortable tbody")
      sortableNode.current.sortable({
        cursor: 'move',
        change: function( event, ui ) {}
      })
      sortableNode.current.on("sortupdate", handleSortUpdate )
      return () => {
        sortableNode.current.off("sortupdate", handleSortUpdate )
      }
    },
    []
  )

  useEffect(
    () => {
      activateEditable()
    }
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return 
      }
      if (activeMoveModalField) {
        global.$(document).on('click', checkClickEvent)
        return
      }
      global.$(document).off('click', checkClickEvent)
    },
    [activeMoveModalField]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return 
      }
      if (changedOrder_prevProps.current.length === props.changedOrder.length - 1) {
        global.$('#shouldScroll').stop().animate({ scrollTop: global.$('#shouldScroll tbody').height() }, "slow")
      }
      changedOrder_prevProps.current = props.changedOrder
    },
    [props.changedOrder]
  )

  function activateEditable () {
    global.$('.editable-text').editable({
      success: function(response, value){
        propsRef.current.updateSelectedFieldsField( this.getAttribute('data-fieldname'), 'alias', value)
      }
    })

    global.$('.editable-size').editable({
      validate: function(value) {
        let trimmedValue = value.trim()
        if (trimmedValue === '') return 'This field is required'
        if (!(/^\+?(0|[1-9]\d*)$/.test( trimmedValue ) ) ) return 'This field must be an integer value'
        let activeField = this.getAttribute('data-fieldname')
        let fieldMinWidth = propsRef.current.selectedFields.filter( f => f.field === activeField )[0]['min_width']
        if (fieldMinWidth > +value ) return `Width can not be lower than ${fieldMinWidth} for this field.`
      },
      success: function(response, value){
        value = parseInt(value, 10)
        if (isNaN(value) || value <= 0){
          return "Please enter a valid integer number"
        }
        propsRef.current.updateSelectedFieldsField( this.getAttribute('data-fieldname'), 'width', value)
      }
    })
  }

  function updateChangedOrder (orderOfFields) {
    global.$('.editable').editable('destroy')
    sortableNode.current.off("sortupdate", handleSortUpdate )
    props.changeFieldsOrder( orderOfFields )
    sortableNode.current.on("sortupdate", handleSortUpdate )
    setActiveMoveModalField('')
  }

  function handleFilterInput (event) {
    setFilterInput(event.target.value.trim())
  }

  function filterSelectedFields (selectedFields) {
    if (filterInput.trim().length){
      let filterKeyword = filterInput.trim().toLowerCase()
      selectedFields = selectedFields.filter(
        selectedField => {
          return selectedField.title.toLowerCase().includes(filterKeyword) ||
               (selectedField.alias && selectedField.alias.toLowerCase().includes(filterKeyword))
        }
      )
    }
    return selectedFields
  }

  function mapRows (selectedFields) {
    let orderOfFields = selectedFields.map( f => f.field )
    return selectedFields.map( 
      (field, index) => {
        return (
          <tr
            className={
              "odd gradeX clickable-row clickable-selecteds ui-sortable-handle" + (props.activeSelectedRowId === field.field ?" active" : "")
            }
            key={`selected-${index}`}
            id={field.field}
            onClick={ ()=>{
             props.setActiveSelectedRow(field.field)
            } }
          >
            <td>
              <i className="fa fa-bars" />
              <span
                className={ classNames({
                  'view-move-row' : true,
                  'active' : activeMoveModalField === field.field
                }) }
                style={{
                  marginLeft: '10px',
                  position : 'relative',
                  color   : activeMoveModalField === field.field ? 'black' : '#b3b3b3'
                }}
              >
                <i
                  style={{
                    transform: 'rotate(90deg)',
                    cursor : 'pointer'
                  }}
                  className="fa fa-exchange"
                  onClick={
                    event => {
                      setActiveMoveModalField(activeMoveModalField === field.field ? '' : field.field)
                      setActiveMoveModalFieldOrderValue('')
                    }
                  }
                />
                <span
                  className={ classNames({
                    'move-row-modal': true,
                    'open': activeMoveModalField === field.field
                  }) }
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '5px',
                    border: '1px solid #e6e6e6',
                    padding: '3px 7px',
                    display: activeMoveModalField === field.field ? 'block' : 'none',
                    backgroundColor: '#dde0e2',
                    borderRadius: '3px'
                  }}
                >
                  <div className="move-modal-desc">
                    Change position
                  </div>
                  <div className="move-modal-controls">
                    <div className="left-side">
                      <button
                        className="btn button-top"
                        disabled={ index === 0 }
                        onClick={ event => {
                          if (index === 0 ) return
                          updateChangedOrder( [
                            field.field,
                            ...orderOfFields.slice( 0, index ),
                            ...orderOfFields.slice( +index + 1 )
                          ] )
                        }  }
                      >
                        MOVE TO TOP
                      </button>
                    </div>
                    <div className="move-modal-or"> or </div>
                    <div className="right-side">
                      <form
                        autoComplete="off"
                        style={{ display: 'inline' }}
                        onSubmit={ event => {
                          event.preventDefault()
                          let value = activeMoveModalFieldOrderValue
                          if (value.length && index + 1 !== +value && +value > 0) {
                            value = +value
                            let currentOrderOfFields = [
                              ...orderOfFields.slice( 0, index ),
                              ...orderOfFields.slice( +index + 1 )
                            ]
                            value -= 1
                            updateChangedOrder( [
                              ...currentOrderOfFields.slice( 0, value ),
                              field.field,
                              ...currentOrderOfFields.slice( value )
                            ] )
                          }
                        } }
                      >
                        <input
                          type="text"
                          placeholder="MOVE TO .."
                          className="move-position"
                          value={ activeMoveModalFieldOrderValue ? activeMoveModalFieldOrderValue : '' }
                          onChange={ event => {
                            let { value } = event.target
                            value = value.trim()
                            if (!isNaN( value ) && +value <= orderOfFields.length) {
                              setActiveMoveModalFieldOrderValue(value)
                            }
                          } }
                        />
                        <button
                          className="btn arrow-button"
                          type="submit"
                        >
                          APPLY
                      </button>
                      </form>
                    </div>
                  </div>
                </span>
              </span>
            </td>
            <td> { index + 1 } </td>
            <td className="bold text-nowrap"> {field.title} </td>
            <td className="text-center">
              <a 
                className="editable-size editable editable-click"
                data-fieldname={field.field}
                data-type="text"
              >
                {field.width}
              </a>
            </td>
            <td>
              <a 
                className="editable-text editable editable-click"
                data-type="text" 
                data-original-title="" 
                title=""
                data-fieldname={field.field}
                style={{backgroundColor: "rgba(0, 0, 0, 0)"}}
              >
                  {field.alias}
              </a>
            </td>
          </tr>
        )
      }
    )
  }

  let selectedFields = filterSelectedFields(props.selectedFields)
  return (
    <td className="w50">
      <div className="portlet light bordered">
        <div className="portlet-title">
          <div className="caption caption-md font-dark">
            <i className="fa fa-table font-blue-madison" />
            <span className="caption-subject bold uppercase font-blue-madison">
              Selected fields: <span>{ ' ' }</span>
              <strong className="font-dark">{ selectedFields.length }</strong>
            </span>
          </div>
          <div className="inputs">
            <div className="portlet-input input-inline input-medium">
              <div className="input-icon right">
                <i className="icon-magnifier" />
                <input
                  type="text"
                  value={filterInput}
                  onChange={handleFilterInput}
                  className="form-control input-circle ng-valid ng-dirty ng-valid-parse ng-touched ng-empty"
                  placeholder="filter" />
              </div>
            </div>
          </div>
        </div>
        <div className="portlet-body">
          <div className="table-responsive" id="shouldScroll">
            <table className="table table-striped table-hover order-column row-sortable table-clickable clickable-selecteds">
              <thead>
                <tr className="uppercase bg-dark">
                  <th className="font-blue">  </th>
                  <th className="font-blue"> # </th>
                  <th className="font-blue"> Field </th>
                  <th className="font-blue text-center text-nowrap"> Size </th>
                  <th className="font-blue"> Alias </th>
                </tr>
                </thead>
                <tbody className="ui-sortable">
                { mapRows(selectedFields) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </td>
  )
}

export default SettingsTableSelected