import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const RmaEditOption = props => {
  const firstRun = useRef(true)

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.updatedCustomField) {
        props.settingsActions.readCustomFields()
        global.$('#edit_option_modal').modal('hide')
      }
    },
    [props.updatedCustomField]
  )

  function saveCustomFieldChanges () {
    props.settingsActions.updateCustomFieldData()
  }

  let {
    title = '',
    type = '',
    required = false,
    show = false,
    list = []
  } = props.activeCustomFieldData

  return (
    <div 
      className="modal modal-themed fade" 
      id="edit_option_modal" 
      tabIndex="-1" 
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 className="modal-title">Edit custom field</h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off">
              <div className="form-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={ event => props.settingsActions.setActiveCustomFieldValue({
                      field : 'title',
                      value : event.target.value
                    }) }
                    className="form-control"
                  />
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={ show }
                      onChange={ event => props.settingsActions.setActiveCustomFieldValue({
                        field : 'show',
                        value : event.target.checked
                      }) }
                      value="1"
                    />
                    Display
                    <span></span>
                  </label>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={required}
                      value="required"
                      onChange={ event => props.settingsActions.setActiveCustomFieldValue({
                        field : 'required',
                        value : event.target.checked
                      }) }
                    />
                    Required
                    <span></span>
                  </label>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label className="mt-radio mt-radio-outline" style={{paddingRight: "30px"}}>
                    <i className="fa fa-edit" />
                    { ' ' }
                    Text
                    <input
                      type="radio"
                      value="text"
                      checked={ type === 'text' }
                      onChange={ event => props.settingsActions.setActiveCustomFieldValue({
                        field : 'type',
                        value : 'text'
                      }) }
                      name="type"
                    />
                    <span></span>
                  </label>&nbsp;&nbsp;
                  <label className="mt-radio mt-radio-outline">
                    <i className="fa fa-list-ul" />
                    { ' ' }
                    Selection
                    <input
                      type="radio"
                      value="selection"
                      checked={ type === 'selection' }
                      onChange={ event => props.settingsActions.setActiveCustomFieldValue({
                        field : 'type',
                        value : 'selection'
                      }) }
                      name="type"
                    />
                    <span></span>
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <span style={{fontSize: "13px"}}>
                      Please enter one option per line (see Help Section for advanced options)
                    </span>
                  </label>
                  <textarea
                    className="form-control input-md"
                    rows="8"
                    value={ list.join('\n') }
                    onChange={ event => props.settingsActions.setActiveCustomFieldValue({
                      field : 'list',
                      value : event.target.value.split('\n')
                    }) }
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal"
            >
            Close
            </button>
            { ' ' }
            <ButtonLoading
              className="btn green-soft"
              type="button"
              handleClick={saveCustomFieldChanges}
              name={'Save Changes'}
              loading={props.updatingCustomField}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

RmaEditOption.propTypes = {
  activeCustomFieldData: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired,
  updatingCustomField: PropTypes.bool.isRequired,
  updatedCustomField: PropTypes.bool.isRequired
}

export default RmaEditOption