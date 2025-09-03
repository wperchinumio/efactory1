import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const General = props => {
  function setFormInputField ({field, value}) {
    props.settingsActions.setRootReduxStateProp({
      field: 'rmaGeneralSettingsData',
      value: {
        ...props.rmaGeneralSettingsData,
        [field]: value
      }
    })
  }

  let { expiration_days } = props.rmaGeneralSettingsData
  expiration_days = expiration_days ? expiration_days : ''

  return (
    <div className="col-lg-8 col-md-12">
      <div>
        <span style={{fontWeight: "600"}} className="font-blue-soft">General</span>
      </div>
      <hr className="border-grey-salsa" style={{marginTop: "0"}} />
      <div className="row">
        <div className="col-md-8">
        <div className="form-group">
        <label className="col-md-4 control-label">Expiration days:</label>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={expiration_days}
            onChange={ event => {
              let { value } = event.target
              value = value.trim()
              if( !isNaN(value) ){
                setFormInputField({
                  field : 'expiration_days',
                  value : +event.target.value
                })
              }
            } }
          />
          <span className="small text-muted">If left blank, DCL will automatically expire any open RMA older than 180 days.</span>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}

General.propTypes = {
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
)(General)