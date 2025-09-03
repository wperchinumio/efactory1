import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RmaGenerationTemplate from '../../../../_Shared/Components/NumberGenerationTemplate'

const RmaNumberGeneration = props => {
  return (
    <RmaGenerationTemplate
      onFormDataChange={
        formData => props.settingsActions.setRootReduxStateProp({
          field : 'rmaGeneralSettingsData',
          value : formData
        })
      }
      formData={ props.rmaGeneralSettingsData }
      title={ 'RMA Number Generation' }
      className={'col-lg-8 col-md-12'}
    />
  )
}

RmaNumberGeneration.propTypes = {
  settingsActions: PropTypes.object.isRequired,
  rmaGeneralSettingsData : PropTypes.shape({
    expiration_days: PropTypes.any,
    manual: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    starting_number: PropTypes.any,
    minimum_number_of_digits: PropTypes.any
  }).isRequired
}

export default connect(
  state => ({
    rmaGeneralSettingsData: state.returnTrak.settings.rmaGeneralSettingsData
  })
)(RmaNumberGeneration)