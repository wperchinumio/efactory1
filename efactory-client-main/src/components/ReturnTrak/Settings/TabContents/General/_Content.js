import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import RmaNumberGeneration from './RmaNumberGeneration'
import General from './General'
import ButtonLoading from '../../../../_Shared/Components/ButtonLoading'

const RmaGeneration = props => {
  useEffect(
    () => {
      props.settingsActions.readRmaGeneralSettings()
    },
    []
  )

  let {
    settingsActions,
    loading
  } = props
  let { updateRmaGeneralSettings } = settingsActions
  return (
    <div className="tab-pane active" id="rma_generation">
      <form autoComplete="off" className="form-horizontal">
        <div className="row no-margins">
          <div className="col-lg-8 col-md-12">
            <p>
              You have the choice to <b>manually</b> enter the rma number or have the system <b>automatically</b> generate and assign a unique rma number.
              You can also set up the expiration days of your RMAs.
            </p>
            <div className="note note-warning">
              <p> <b>Be careful</b> if you switch from manual to automatic rma number generation: make sure new rma numbers do not match with pre-existing rma numbers or order numbers (duplicated rma/order numbers are not allowed).</p>
            </div>
          </div>
        </div>
        <div className="row no-margins">
          <RmaNumberGeneration
            settingsActions={settingsActions}
          />
        </div>
        <div className="row no-margins">
          <General
            settingsActions={settingsActions}
          />
        </div>
        <div className="row no-margins">
          <p className="col-lg-8 col-md-12">
            <ButtonLoading
              className="btn green-soft pull-right"
              type="button"
              disabled={ false }
              handleClick={ event => updateRmaGeneralSettings() }
              name={'Save Changes'}
              loading={loading}
            />
          </p>
        </div>
      </form>
    </div>
  )
}

export default connect(
  state => ({
    updatingRmaGeneralSettings: state.returnTrak.settings.updatingRmaGeneralSettings,
    loading: state.returnTrak.settings.loading
  })
)(RmaGeneration)