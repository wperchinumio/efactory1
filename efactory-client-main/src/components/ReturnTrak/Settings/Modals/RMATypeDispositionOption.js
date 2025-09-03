import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const EditTypeDispositionOption = props => {
  const firstRun = useRef([true, true])
  const [optionData, setOptionData] = useState({})

  const onDispositionModalOpen = useCallback(
    () => {
      setOptionData(props.currentEditedOption)
    },
    []
  )

  useEffect(
    () => {
      global.$('#disposition_modal').on('shown.bs.modal', onDispositionModalOpen)
      return () => {
        global.$('#disposition_modal').off('shown.bs.modal', onDispositionModalOpen)
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      setOptionData(props.currentEditedOption)
    },
    [props.currentEditedOption]
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (props.updatedRmaTypeDisposition) {
        props.settingsActions.readRmaTypesDispositions()
        global.$('#rmatype_disposition_modal').modal('hide')
      }
    },
    [props.updatedRmaTypeDisposition]
  )

  function updateOptionField ({field, value}) {
    setOptionData({...optionData, [field]: value})
  }

  function saveChanges () {
    let { code ,title, show } = optionData
    props.settingsActions.updateRmaTypeDisposition({ code ,title, show })
  }

  let { updatingRmaTypeDisposition = false } = props
  let {
    code = '',
    title = '',
    original_title = '',
    show = false
  } = optionData
  let isTypeOption = code.includes('T')
  return (
    <div 
      className="modal modal-themed fade" 
      id="rmatype_disposition_modal" 
      tabIndex="-1" 
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
            ></button>
            <h4 className="modal-title">
              {
                isTypeOption ? 'RMA Type Option' : 'Disposition Option'
              }
            </h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off">
              <div className="form-body">
                <div className="form-group">
                  <label>
                    Title:
                  </label>
                  <input
                    type="text"
                    value={ show ? title : original_title }
                    disabled={ !show }
                    onChange={ event => updateOptionField({ field : 'title', value : event.target.value }) }
                    className="form-control"
                  />
                  <span className="small text-muted">
                    Original title for { code }: <i> { original_title } </i>
                  </span>
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={ show }
                      onChange={ event => updateOptionField({ field : 'show', value : !show }) }
                      value="1"
                    />
                    Display
                    <span></span>
                  </label>
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
              handleClick={ event => saveChanges() }
              name={'Save Changes'}
              loading={updatingRmaTypeDisposition}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

EditTypeDispositionOption.propTypes = {
  currentEditedOption: PropTypes.shape({
    code: PropTypes.string,
    title: PropTypes.string,
    original_title: PropTypes.string,
    show: PropTypes.bool
  }),
  updatingRmaTypeDisposition: PropTypes.bool,
  updatedRmaTypeDisposition: PropTypes.bool,
  settingsActions: PropTypes.object.isRequired
}

export default EditTypeDispositionOption