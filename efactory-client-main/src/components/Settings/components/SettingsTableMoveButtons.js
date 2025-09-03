import React from 'react'

const SettingsTableMoveButtons = props => {
  return (
    <td>
      <div className="move-columns">
        { 
          props.activeSelectedRowId !== '' &&
          <button
            type="button"
            className="btn grey-mint"
            id="moveForward"
            onClick={ event => props.removeFromSelected(false) }
          >
            <i className="fa fa-angle-right pull-left"/> Move
          </button>
        }
        {
          props.activeSelectedRowId === '' &&
          <button
            type="button"
            className="btn grey-mint disabled"
            id="moveForward"
            disabled={true}
          >
            <i className="fa fa-angle-right pull-left"/> Move
          </button>
        }
        { 
          props.selectedFields.length > 0 && 
          <button
            type="button"
            className="btn grey-mint"
            onClick={ event => props.removeFromSelected(true) }
          >
            <i className="fa fa-angle-double-right pull-left"/> Move All
          </button>
        }
        { 
          props.selectedFields.length === 0 && 
          <button
            type="button"
            className="btn grey-mint"
            disabled={true}
          >
            <i className="fa fa-angle-double-right pull-left"/> Move All
          </button>
        }
        <div className="btn-spacer" />
        { 
          props.activeAvailableRowId !== '' &&
          <button 
            type="button"
            className="btn grey-mint"
            id="moveBackward"
            onClick={ event => props.removeFromAvailable(false) }
          >
            <span className="md-click-circle md-click-animate"
            style={{height: "120px", width: "120px", top: "-32px", left: "-19px"}}>
            </span>
            <i className="fa fa-angle-left pull-left"/> Move
          </button>
        }
        { 
          props.activeAvailableRowId === '' &&
          <button 
            type="button"
            className="btn grey-mint disabled"
            id="moveBackward"
            disabled={true}
          >
            <span className="md-click-circle md-click-animate"
            style={{height: "120px", width: "120px", top: "-32px", left: "-19px"}}>
            </span>
            <i className="fa fa-angle-left pull-left"/> Move
          </button>
        }
        { 
          props.changedOrder.length !== props.availableFields.length && 
          <button 
            type="button"
            className="btn grey-mint"
            onClick={ event => props.removeFromAvailable(true) }
          >
            <i className="fa fa-angle-left pull-left"/> Move All
          </button>
        }
        { 
          props.changedOrder.length === props.availableFields.length &&
          <button 
            type="button"
            className="btn grey-mint"
            disabled={true}
          >
            <i className="fa fa-angle-double-left pull-left"/> Move All
          </button>
        }
      </div>
    </td>
  )
}

export default SettingsTableMoveButtons