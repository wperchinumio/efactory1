import React, { useEffect } from 'react'
import global from 'window-or-global'
import Selected from './SettingsTableSelected'
import Available from './SettingsTableAvailable'
import MoveButtons from './SettingsTableMoveButtons'

const SettingsTable = props => {
  useEffect(
    () => {
      global.App.initSlimScroll(global.$(".table-responsive"))
      global.$('.table-clickable').off('click').on('click', '.clickable-row', function(event) {
        global.$(this).addClass('active').siblings().removeClass('active')
        if (global.$('.table-clickable.clickable-selecteds').find('.clickable-row.active').length) {
          global.$('#moveForward').removeClass('disabled')
        } else {
          global.$('#moveForward').addClass('disabled')
        }
        if (global.$('.table-clickable.clickable-availables').find('.clickable-row.active').length) {
          global.$('#moveBackward').removeClass('disabled')
        } else {
          global.$('#moveBackward').addClass('disabled')
        }
      })
      return () => {
        global.App.destroySlimScroll(global.$(".table-responsive"))
      }
    },
    []
  )

  let { selectedFields, availableFields } = props.settings
  let { 
    changeFieldsOrder,
    setActiveSelectedRow,
    setActiveAvailableRow,
    activeSelectedRowId,
    activeAvailableRowId,
    removeFromSelected,
    removeFromAvailable,
    updateSelectedFieldsField,
    dispatch
  } = props
  return (
    <table className="move-columns gridsettings-container-table">
      <tbody>
        <tr>
          <Selected
            selectedFields={selectedFields}
            changedOrder={props.changedOrder}
            changeFieldsOrder={changeFieldsOrder}
            setActiveSelectedRow={setActiveSelectedRow}
            activeSelectedRowId={activeSelectedRowId}
            dispatch={dispatch}
            updateSelectedFieldsField={updateSelectedFieldsField}
          />
          <MoveButtons
            activeSelectedRowId={activeSelectedRowId}
            activeAvailableRowId={activeAvailableRowId}
            changedOrder={props.changedOrder}
            removeFromSelected={removeFromSelected}
            removeFromAvailable={removeFromAvailable}
            selectedFields={selectedFields}
            availableFields={availableFields}
          />
          <Available
            availableFields={availableFields}
            setActiveAvailableRow={setActiveAvailableRow}
            activeAvailableRowId={activeAvailableRowId}
            dispatch={dispatch}
            changedOrder={props.changedOrder}
            selectedFields={selectedFields}
          />
        </tr>
      </tbody>
    </table>
  )
}

export default SettingsTable