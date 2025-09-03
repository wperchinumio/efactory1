import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import createTreeViewData from './createTreeViewData'

const InterfaceTreeview = props => {
  const firstRun = useRef(true)

  const onTreeViewChange = useCallback(
    (event, data) => {
      let { selected } = data
      selected = selected.filter( s => !s.startsWith('j') )
      props.onTreeViewChange(selected)
    },
    []
  )

  useEffect(
    () => {
      let { id, apps } = props
      createTreeView(apps)
      global.$(`#apps-tree-${id}`).on('changed.jstree', onTreeViewChange)
      return () => {
        global.$(`#apps-tree-${id}`).off('changed.jstree', onTreeViewChange)
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
      if (props.refresh) {
        refreshTreeView(props.apps)
      }
    },
    [props.refresh]
  )

  function refreshTreeView (apps) {
    let { id } = props
    global.$(`#apps-tree-${id}`).off( 'changed.jstree', onTreeViewChange )
    global.$(`#apps-tree-${id}`).jstree(true).destroy()
    createTreeView( apps )
    global.$(`#apps-tree-${id}`).on( 'changed.jstree', onTreeViewChange )
  }

  function createTreeView (apps = []) {
    let { id, is_master } = props
    global.$(`#apps-tree-${id}`).jstree({
      plugins: ["wholerow", "checkbox", "types"],
      core: {
        animation: false,
        themes: {
          responsive: false
        },
        data: createTreeViewData(apps, is_master),
        expand_selected_onload: false
      },
      types: {
        default: {
          icon: "fa fa-folder icon-state-warning icon-lg"
        },
        file: {
          icon: "fa fa-file icon-state-warning icon-lg"
        }
      }
    })
  }

  let { id } = props
  return (
    <div className="col-md-6">
      <span className="sbold text-primary">
        Permissions
      </span>
      <div style={{
        border:"1px solid #ddd", 
        padding: "10px", 
        marginTop: "5px", 
        maxHeight: '300px',
        overflowY: "scroll",
        height: '300px'
        }}
      >
        <div id={`apps-tree-${id}`}>
        </div>
      </div>
    </div>
  )
}

InterfaceTreeview.propTypes = {
  refresh: PropTypes.any,
  is_master: PropTypes.any,
  onTreeViewChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

export default InterfaceTreeview