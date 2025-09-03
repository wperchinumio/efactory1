import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from '../../../../../OrderPoints/OrderEntry/Modals/Confirm'

const EditorBottomControls = props => {
  function onEnabledChanged (event) {
    props.shipNotificationActions.setRootReduxStateProp_multiple({ 
      active: event.currentTarget.checked,
      editor_value_changed: true 
    })
  }

  function onSaveClicked (event) {
    let { account_number, html, active } = props.shipNotificationState
    props.shipNotificationActions.updateOrderTemplateWithParams({
      account_number, html, active
    })
  }

  function onLoadDefaultClicked (event) {
    props.shipNotificationActions.readOrderDefaultTemplate()
  }

  function handleLoadDefault (event) {
    if (props.value.trim().length) {
      global.$('#confirm-load-default').modal('show')
    } else {
      props.shipNotificationActions.readOrderDefaultTemplate()
    }
  }

  function promoteToMaster (event) {
    props.shipNotificationActions.promoteOrderTemplate()
  }

  let { enabled, editor_value_changed, active_template } = props
  return (
    <div>
      <div 
        className="btn-group"
        onClick={ handleLoadDefault }
      >
        <button type="button" className="btn green-soft btn-sm">
          <i className="fa fa-cloud-upload" />  Load default template
        </button>
      </div>
      <div className="pull-right">
        {
          !active_template[ 'is_draft' ] &&
          <label className="mt-checkbox">
            <input
              type="checkbox"
              checked={enabled}
              onChange={ event => onEnabledChanged(event) }
            />
            Enabled
            <span></span>
          </label>
        }
        {
          active_template[ 'is_draft' ] &&
          <button 
            className="btn btn-topbar btn-sm" 
            type="button"
            onClick={ promoteToMaster }
            disabled={ editor_value_changed }
          >
            Promote to master
          </button>
        }
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button 
          className="btn btn-topbar btn-sm" 
          type="button"
          disabled={ !editor_value_changed }
          onClick={ onSaveClicked }
        >
          <i className="fa fa-save"></i> 
          Save
        </button>
        <ConfirmModal 
          id="confirm-load-default"
          confirmationMessage="Are you sure you want to overwrite with the default email template?"
          onConfirmHandler={ onLoadDefaultClicked }
        />
      </div>
    </div>
  )
}

EditorBottomControls.propTypes = {
  enabled: PropTypes.bool.isRequired,
  shipNotificationState: PropTypes.object.isRequired,
  shipNotificationActions: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  active_template: PropTypes.object.isRequired
}

export default EditorBottomControls