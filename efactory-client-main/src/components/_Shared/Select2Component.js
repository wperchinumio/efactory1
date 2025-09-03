import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const Select2Component = props => {
  const firstRun = useRef(true)

  useEffect(
    () => {
      initializeSelect2()
      let { id, afterSelect2NodeId } = props
      let select2Node = global.$(`#${id}`)
      select2Node.on("change", props.onSelect2ValueChange )
      if( afterSelect2NodeId ){
        let select2NodeFollowingNode = global.$(`#${afterSelect2NodeId}`)
        select2Node.on('select2:close', () => {
          select2NodeFollowingNode.focus()
        } )
      }
      return () => {
        let select2Node = global.$(`#${props.id}`)
        select2Node.off("change", props.onSelect2ValueChange )
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      let select2Node = global.$(`#${props.id}`)
      select2Node.val(props.value).trigger("change")
    },
    [props.value]
  )

  function initializeSelect2 () {
    let select2Node = global.$(`#${props.id}`)
    global.$.fn.select2.defaults.set("theme", "bootstrap")
    select2Node.select2({
      placeholder: "Select",
      width: 'auto',
      allowClear: true
    })
  }

  let {
    id,
    placeholder = '',
    children,
    className = '',
    value,
    disabled = false
  } = props

  return (
    <select 
      className={ className }
      id={id} 
      data-placeholder={ placeholder }
      value={ value }
      onChange={()=>{}}
      disabled={disabled}
    >
      { children }
    </select>
  )
}

Select2Component.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  afterSelect2NodeId: PropTypes.string
}

export default Select2Component