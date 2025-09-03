import React from 'react'
import PropTypes from 'prop-types'
import ConfirmModal from '../../../../../OrderPoints/OrderEntry/Modals/Confirm'

const EditorBottomControls = props => {
  function onEnabledChanged (event) {
    let { checked: value } = event.target
    props.templateActions.updateTemplateData({ field : 'active', value })
  }

  function handleLoadDefault () {
    if( props.value.trim().length ){
      global.$('#confirm-load-default').modal('show')
    }else{
      props.templateActions.loadDefaultTemplate()
    }
  }

  return (
    <div>
      <button 
        className="btn green-soft btn-sm" 
        type="button"
        onClick={handleLoadDefault}
        data-toggle="modal"
      >
        <i className="fa fa-cloud-upload"></i> Load default template
      </button>
      <div className="pull-right">
        <label className="mt-checkbox">
          <input
            type="checkbox"
            checked={props.enabled}
            onChange={onEnabledChanged}
          />
          Enabled
          <span></span>
        </label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button 
          className="btn btn-topbar btn-sm" 
          type="button"
          onClick={props.templateActions.updateTemplate}
        >
          <i className="fa fa-save"></i> 
          Save
        </button>
        <ConfirmModal 
          id="confirm-load-default"
          confirmationMessage="Are you sure you want to overwrite with the default email template?"
          onConfirmHandler={props.templateActions.loadDefaultTemplate}
        />
      </div>
    </div>
  )
}

EditorBottomControls.propTypes = {
  name: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  templateActions: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
}

export default EditorBottomControls