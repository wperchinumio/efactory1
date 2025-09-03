import React, { useRef, useEffect } from 'react'
import history from '../../../history'
import SettingsBar from './SettingsBar'
import SettingsInfo from './SettingsInfo'
import SettingsTable from './SettingsTable'
import SettingsSaveAsPopup from './SettingsSaveAsPopup'
import SettingsApproveDeletePopup from './SettingsApproveDeletePopup'
import SettingsShowErrorPopup from './SettingsShowErrorPopup'
import global from 'window-or-global'

const Settings = props => {
  const firstRun = useRef(true, true, true)
  useEffect(
    () => {
      props.settingActions.clearSaveData()
    },
    []
  )

  const { 
    error,
    loadingSaveAs,
    loadedSave,
    loadedSaveAs,
    loadedDeleteView
  } = props.settings

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (loadedSave || loadedSaveAs || loadedDeleteView) {
        history.push(props.rootPath)
        props.settingActions.discardChanges()
      }
    },
    [loadedSave, loadedSaveAs, loadedDeleteView]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (loadingSaveAs) {
        return global.App.blockUI({
          target: '.page-content',
          //boxed: true,
          overlayColor: '#335a77',
          animate: true
        })
      }
      global.App.unblockUI('.page-content')
    },
    [loadingSaveAs]
  )

  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      if (error) {
        global.$('#error_popup').modal('show')
        props.settingActions.handleError()
      }
    },
    [error]
  )

  let { 
    changeFieldsOrder,
    setActiveSelectedRow,
    setActiveAvailableRow,
    removeFromAvailable,
    discardChanges,
    toggleSaveAsPopupVisibility,
    saveAsAsync,
    saveAsync,
    deleteViewAsync,
    updateSelectedFieldsField,
    removeFromSelected 
  } = props.settingActions

  let { id, name } = props.details

  let isOneOfDefaultViews = [ 0, -1 ].includes( +id )

  return (
    <div className="gridsettings">
      <SettingsBar
        settings={props.settings}
        viewName={ name }
        discardChanges={discardChanges}
        toggleSaveAsPopupVisibility={toggleSaveAsPopupVisibility}
        saveAsync={saveAsync}
        rootPath={props.rootPath}
        isOneOfDefaultViews={ isOneOfDefaultViews }
      />
      <SettingsInfo />
      <div className="gridsettings-table-wrapper">
        <SettingsTable
          settings={props.settings}
          details={props.details}
          initialOrder={props.initialOrder}
          changedOrder={props.changedOrder}
          removeFromSelected={removeFromSelected}
          updateSelectedFieldsField={updateSelectedFieldsField}
          removeFromAvailable={removeFromAvailable}
          changeFieldsOrder={changeFieldsOrder}
          setActiveSelectedRow={setActiveSelectedRow}
          setActiveAvailableRow={setActiveAvailableRow}
          dispatch={props.dispatch}
          activeSelectedRowId={props.activeSelectedRowId}
          activeAvailableRowId={props.activeAvailableRowId}
        />
      </div>
      <SettingsSaveAsPopup
        settings={props.settings}
        saveAsAsync={saveAsAsync}
      />
      <SettingsApproveDeletePopup
        settings={props.settings}
        saveAsAsync={saveAsAsync}
        deleteViewAsync={deleteViewAsync}
      />
      <SettingsShowErrorPopup  
        errorDescription={props.settings.errorDescription} 
      />
    </div>
  )
}

export default Settings