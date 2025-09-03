import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import TimePickerAmPm from '../../_Shared/Components/TimePickerAmPm'

const AddImportSchedulerModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const [product_group, setProduct_group] = useState('')
  const [environment, setEnvironment] = useState('')
  const [currentTimeIsoFormat, setCurrentTimeIsoFormat] = useState('00:00')
  const [currentTimeShownFormat, setCurrentTimeShownFormat] = useState('12:00 AM')
  const [disabled, setDisabled] = useState(false)
  const [id, setId] = useState('')
  const [one_time, setOne_time] = useState(false)
  
  const handleModalOpening = useCallback(
    () => {
      let { formDataInitial, isAdd } = propsRef.current
      if (!isAdd) {
        setProduct_group(formDataInitial.product_group)
        setEnvironment(formDataInitial.environment)
        setCurrentTimeIsoFormat(formDataInitial.currentTimeIsoFormat)
        setCurrentTimeShownFormat(formDataInitial.currentTimeShownFormat)
        setId(formDataInitial.id)
        setDisabled(false)
        setOne_time(false)
      } else {
        setProduct_group('')
        setEnvironment('')
        setCurrentTimeIsoFormat('00:00')
        setCurrentTimeShownFormat('12:00 AM')
        setDisabled(false)
        setOne_time(false)
      }
      global.$(".draggable-modal").css({ top: '0px', left: '0px' })
    },
    []
  )

  useEffect(
    () => {
      global.$("#add-import-scheduler").on( 'show.bs.modal', handleModalOpening)
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      return () => {
        global.$("#add-import-scheduler").off( 'show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function onTimeChange (shownFormat, isoFormat) {
    setCurrentTimeShownFormat(shownFormat)
    setCurrentTimeIsoFormat(isoFormat)
  }

  function onProductGroupChange (event) {
    setProduct_group(event.target.value)
  }

  function onEnvironmentChange (event) {
    setEnvironment(event.target.value)
  }

  function onAddSchedulerClicked () {
    let { settingsActions, isRmaImport } = props
    if (!isRmaImport ){
      settingsActions.add3PLScheduler({
        product_group,
        environment,
        time: currentTimeIsoFormat,
        one_time
      }).then(  
        () => {
          global.$('#add-import-scheduler').modal('hide')
          setProduct_group('')
          setEnvironment('')
          setCurrentTimeIsoFormat('00:00')
          setCurrentTimeShownFormat('12:00 AM')
          setDisabled(false)
          setOne_time(false)
        }
      ).catch( () => {} )
    } else {
      settingsActions.addRma3PLScheduler({
        product_group,
        environment,
        time: currentTimeIsoFormat,
        one_time
      }).then(  
        () => {
          global.$('#add-import-scheduler').modal('hide')
          setProduct_group('')
          setEnvironment('')
          setCurrentTimeIsoFormat('00:00')
          setCurrentTimeShownFormat('12:00 AM')
          setDisabled(false)
          setOne_time(false)
        }
      ).catch( () => {} )
    }
  }

  function onUpdateSchedulerClicked () {
    let { settingsActions, isRmaImport } = props

    if (!isRmaImport ){
      settingsActions.update3PLScheduler({
        product_group,
        environment,
        time: currentTimeIsoFormat,
        id
      }).then(  
        () => {
          global.$('#add-import-scheduler').modal('hide')
          setProduct_group('')
          setEnvironment('')
          setCurrentTimeIsoFormat('00:00')
          setCurrentTimeShownFormat('12:00 AM')
          setDisabled(false)
        }
      ).catch( () => {} )
    } else {
      settingsActions.updateRma3PLScheduler({
        product_group,
        environment,
        time: currentTimeIsoFormat,
        id
      }).then(  
        () => {
          global.$('#add-import-scheduler').modal('hide')
          setProduct_group('')
          setEnvironment('')
          setCurrentTimeIsoFormat('00:00')
          setCurrentTimeShownFormat('12:00 AM')
          setDisabled(false)
        }
      ).catch( () => {} )
    }
  }

  let { isAdd } = props
  return (
    <div
      className="modal modal-themed fade draggable-modal"
      data-backdrop="static"
      id="add-import-scheduler"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">
              { isAdd ? 'Add Schedule' : 'Edit Schedule' }
            </h4>
          </div>
          <div className="modal-body">
            <form role="form" autoComplete="off" className="form-horizontal">
              <div className="form-group">
                <label className="col-md-3" style={{ marginTop : '7px' }}>
                  Environment:
                </label>
                <div className="col-md-6">
                  <select 
                    className="form-control"
                    value={ environment }
                    onChange={ onEnvironmentChange }
                  >
                    <option value=""></option>
                    <option 
                      value="PROD"
                    >
                      PROD
                    </option>
                    <option 
                      value="UAT"
                    >
                      UAT
                    </option>
                    <option 
                      value="QA"
                    >
                      QA
                    </option>
                    <option 
                      value="DEV"
                    >
                      DEV
                    </option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3" style={{ marginTop : '7px' }}>
                  Product Group:
                </label>
                <div className="col-md-6">
                  <select 
                    className="form-control"
                    value={ product_group }
                    onChange={ onProductGroupChange }
                  >
                    <option 
                      value=""
                    >
                    </option>
                    <option 
                      value="ALL"
                    >
                      ALL
                    </option>
                    <option 
                      value="NORTONCORE"
                    >
                      NORTONCORE
                    </option>
                    <option 
                      value="YELLOWBOX"
                    >
                      YELLOWBOX
                    </option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3" style={{ marginTop : '7px' }}>
                  Time:
                </label>
                <div className="col-md-6">
                  <TimePickerAmPm 
                    onTimeChange={ onTimeChange }
                    currentTimeIsoFormat={ currentTimeIsoFormat }
                    currentTimeShownFormat={ currentTimeShownFormat }
                    disabled={ disabled }
                    id="three-pl"
                  />  
                </div>
              </div>
              {
                isAdd &&
                <div className="form-group">
                  <div className="col-md-3">&nbsp;</div>
                  <label 
                    className="mt-checkbox noselect mt-checkbox-outline col-md-3"
                    style={{ marginLeft: '14px' }}
                  >
                      <input
                        type="checkbox"
                        checked={ one_time }
                        onChange={ event => setOne_time(event.target.checked) }
                      />One Time Only
                      <span></span>
                  </label>
                </div>  
              }
            </form>
          </div>
          <div className="modal-footer" style={{ marginTop : '-20px' }} >
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal" 
              >
                Cancel
              </button>
              <a
                type="button"
                className="btn green-soft"
                disabled={ !currentTimeIsoFormat || !product_group || !environment }
                onClick={ isAdd ? onAddSchedulerClicked : onUpdateSchedulerClicked }
              >
                { isAdd ? 'Add' : 'Update' }
              </a>
          </div>
        </div>
      </div>
    </div>
  )
}

AddImportSchedulerModal.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired,
  isAdd: PropTypes.any,
  formDataInitial : PropTypes.shape({
    product_group: PropTypes.any,
    environment: PropTypes.any,
    currentTimeIsoFormat: PropTypes.any,
    currentTimeShownFormat: PropTypes.any,
    id: PropTypes.any,
  }),
  isRmaImport: PropTypes.any
}

export default AddImportSchedulerModal