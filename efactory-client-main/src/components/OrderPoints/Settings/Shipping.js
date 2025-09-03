import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Shipping from '../../_Shared/Components/Shipping'
import ButtonLoading from '../../_Shared/Components/ButtonLoading'

const RmaGeneration = props => {
  useEffect(
    () => {
      props.settingsActions.readOpShippingSettings()
    }, 
    []
  )

  function onFieldChange ({fieldPath, value}) {
    let { opShippingSettingsData } = props
    props.settingsActions.setRootReduxStateProp({
      field : 'opShippingSettingsData',
      value : {
        ...opShippingSettingsData,
        [fieldPath[0]]: {
          ...opShippingSettingsData[fieldPath[0]],
          [fieldPath[1]]: value,
          service : fieldPath[1] === 'carrier' 
            ? ''
            : ( fieldPath[1] === 'service' ? value : opShippingSettingsData[ fieldPath[0] ]['service'])
        }
      }
    })
  }

  let {
    settingsActions,
    loading,
    opShippingSettingsData
  } = props

  let {
    updateOpShippingSettings
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
            data={opShippingSettingsData}
            onFieldChange={ ({ fieldPath, value }) =>  onFieldChange({ fieldPath, value })  }
          />
        </div>
        <div className="row no-margins">
          <p className="col-lg-10 col-md-12">
            <ButtonLoading
              className="btn green-soft pull-right"
              type="button"
              handleClick={ event => updateOpShippingSettings() }
              name={'Save Changes'}
              loading={loading}
            />
          </p>
        </div>
      </form>
    </div>
  )
}
RmaGeneration.propTypes = {
  settingsActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    loading : state.orderPoints.settings.loading,
    opShippingSettingsData : state.orderPoints.settings.opShippingSettingsData
  })
)(RmaGeneration)