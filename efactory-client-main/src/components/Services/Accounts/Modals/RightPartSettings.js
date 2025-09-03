import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import createTreeViewDataAccounts from './createTreeViewDataAccounts'

const RightPartSettings = props => {
  const firstRun = useRef(true)
  const onTreeViewChange = useCallback(
    (event, data) => {
      let { selected } = data
      selected = selected.filter( s => !s.startsWith('j'))
      props.onTreeViewChange(selected)
    },
    []
  )

  useEffect(
    () => {
      let { id, accounts_availability, accounts_visibility } = props
      createTreeView(accounts_availability, accounts_visibility)
      global.$(`#accounts-tree-${id}`).on('changed.jstree', onTreeViewChange)
      global.$(`#accounts-tree-${id}`).jstree('close_all')
      return () => {
        global.$(`#accounts-tree-${id}`).off('changed.jstree', onTreeViewChange)
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
        refreshTreeView(props.accounts_availability, props.accounts_visibility)
        setTimeout(() => global.$(`#accounts-tree-${props.id}`).jstree('close_all'), 300)
      }
    },
    [props.refresh]
  )

  function refreshTreeView (accounts_availability, accounts_visibility) {
    let { id } = props
    global.$(`#accounts-tree-${id}`).off( 'changed.jstree', onTreeViewChange)
    global.$(`#accounts-tree-${id}`).jstree(true).destroy()
    createTreeView( accounts_availability, accounts_visibility)
    global.$(`#accounts-tree-${id}`).on( 'changed.jstree', onTreeViewChange)
    global.$(`#accounts-tree-${id}`).jstree('close_all')
  }

  function createTreeView (accounts_availability, accounts_visibility) {
    global.$(`#accounts-tree-${props.id}`).jstree({
      plugins: ["wholerow", "checkbox", "types"],
      core: {
        themes: {
          responsive: false,
          icons:false
        },    
        data: createTreeViewDataAccounts(accounts_availability, accounts_visibility)
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

  function onFieldValueChange (event) {
    let { name, checked } = event.currentTarget
    props.onFieldChange([name], checked)
  }

  let {
    id,
    web_service_only,
    active,
    is_master
  } = props

  return (
    <div className="col-md-6">
      <span className="sbold text-primary">
        Access
      </span>
      <div style={{ padding: "10px", marginTop: "5px"}}>
        <div>
          <label className="mt-checkbox">
            <input 
              type="checkbox"
              disabled={ is_master }
              name="web_service_only"
              checked={ web_service_only } 
              onChange={ onFieldValueChange }
            /> Web Services Only
            <span></span>
          </label>
        </div>
        <div>
          <label className="mt-checkbox" style={{marginBottom: 0}}>
            <input 
              type="checkbox" 
              disabled={ is_master }
              name="active"
              checked={ active }
              onChange={ onFieldValueChange }
            /> Active
            <span></span>
          </label>
        </div>
      </div>
      <span className="sbold text-primary">
        Account Visibility
      </span>
      <div style={{border:"1px solid #ddd", padding: "10px", marginTop: "5px", maxHeight: "202px", height: "202px", overflowY: "scroll"}}>
        <div id={`accounts-tree-${id}`} />
      </div>
    </div>
  )
}

RightPartSettings.propTypes = {
  onTreeViewChange: PropTypes.func.isRequired,
  is_master: PropTypes.any,
  web_service_only: PropTypes.any,
  active: PropTypes.any,
  accounts_visibility: PropTypes.array,
  accounts_availability: PropTypes.array,
  onFieldChange: PropTypes.func,
  id: PropTypes.string.isRequired,
}

export default RightPartSettings