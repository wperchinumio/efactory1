import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Shipping from '../../../../_Shared/Components/Shipping'
import ButtonLoading from '../../../../_Shared/Components/ButtonLoading'

const RmaGeneration = props => {
  useEffect(
    () => {
      props.settingsActions.readRmaShippingSettings()
    },
    []
  )

  function onFieldChange ({ fieldPath, value }) {
    let { rmaShippingSettingsData, settingsActions } = props
    rmaShippingSettingsData = { ...rmaShippingSettingsData }
    settingsActions.setRootReduxStateProp({
      field: 'rmaShippingSettingsData',
      value: {
        ...rmaShippingSettingsData,
        [fieldPath[0]]: {
          ...rmaShippingSettingsData[fieldPath[0]],
          [fieldPath[1]]: value,
          service: fieldPath[1] === 'carrier' ? '' : ( fieldPath[1] === 'service' ? value : rmaShippingSettingsData[ fieldPath[0] ]['service'])
        }
      }
    })
  }

  let {
    settingsActions,
    loading,
    rmaShippingSettingsData
  } = props

  let {
    updateRmaShippingSettings
  } = settingsActions

  return (
    <div className="tab-pane active" id="rma_generation">
      <form autoComplete="off" className="form-horizontal">
        <div className="row no-margins">
          <div className="col-lg-10 col-md-12 col">
            <p>
              You can set up the default shipping setting for domestic or international replacement orders.
            </p>
          </div>
        </div>
        <div className="row no-margins">
          <Shipping
            settingsActions={settingsActions}
            data={rmaShippingSettingsData}
            onFieldChange={onFieldChange}
          />
        </div>
        <div className="row no-margins">
          <p className="col-lg-10 col-md-12">
            <ButtonLoading
              className="btn green-soft pull-right"
              type="button"
              disabled={ false }
              handleClick={ event => updateRmaShippingSettings() }
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
    loading: state.returnTrak.settings.loading,
    rmaShippingSettingsData: state.returnTrak.settings.rmaShippingSettingsData
  })
)(RmaGeneration)