import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import ButtonLoading from '../../_Shared/Components/ButtonLoading'

const CustomFields = props => {
  useEffect(
    () => {
      props.settingsActions.readOpCustomFieldsSettings()
    },
    []
  )

  function setFormField({ field, value }) {
    props.settingsActions.setRootReduxStateProp({
      field: 'opCustomFieldsSettingsData',
      value: {
        ...props.opCustomFieldsSettingsData,
        [field]: value
      }
    })
  }

  let { opCustomFieldsSettingsData, loading, settingsActions } = props
  let {
    header_cf_1 = '',
    header_cf_2 = '',
    header_cf_3 = '',
    header_cf_4 = '',
    header_cf_5 = '',
    detail_cf_1 = '',
    detail_cf_2 = '',
    detail_cf_5 = '',
  } = opCustomFieldsSettingsData
  return (
    <div className="tab-pane active" id="email_settings">
      <div className="col-lg-8">
        <p className="font-blue-dark">You can rename the custom field titles as needed.<br/> <span className="small">[Please note, this is for Order Entry screen only]</span></p>      
        <form autoComplete="off" className="form-horizontal">
          <div>
            <span style={{fontWeight: "600"}} className="font-blue-soft">General</span>
          </div>
          <hr className="border-grey-salsa" style={{marginTop: "0"}} />
          <div className="col-md-6">
            <span className="orderpoints-section-title">Order header section</span>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 1</label>
              <div className="col-md-8">
                <input
                  value={ header_cf_1 ? header_cf_1 : '' }
                  onChange={ event => setFormField({ field : 'header_cf_1', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 2</label>
              <div className="col-md-8">
                <input
                  value={ header_cf_2 ? header_cf_2 : '' }
                  onChange={ event => setFormField({ field : 'header_cf_2', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 3</label>
              <div className="col-md-8">
                <input
                  value={ header_cf_3 ? header_cf_3 : '' }
                  onChange={ event => setFormField({ field : 'header_cf_3', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 4</label>
              <div className="col-md-8">
                <input
                  value={ header_cf_4 ? header_cf_4 : '' }
                  onChange={ event => setFormField({ field : 'header_cf_4', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 5</label>
              <div className="col-md-8">
                <input
                  value={ header_cf_5 ? header_cf_5 : '' }
                  onChange={ event => setFormField({ field : 'header_cf_5', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <span className="orderpoints-section-title">Order detail section</span>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 1</label>
              <div className="col-md-8">
                <input
                  value={ detail_cf_1 ? detail_cf_1 : '' }
                  onChange={ event => setFormField({ field : 'detail_cf_1', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 2</label>
              <div className="col-md-8">
                <input
                  value={ detail_cf_2 ? detail_cf_2 : '' }
                  onChange={ event => setFormField({ field : 'detail_cf_2', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Custom Field 5</label>
              <div className="col-md-8">
                <input
                  value={ detail_cf_5 ? detail_cf_5 : '' }
                  onChange={ event => setFormField({ field : 'detail_cf_5', value : event.target.value }) }
                  type="text"
                  className="form-control input-md"
                />
              </div>
            </div>
          </div>
        </form>
        <p className="col-md-12">
          <ButtonLoading
            className="btn green-soft pull-right"
            type="button"
            handleClick={ event => settingsActions.updateOpCustomFieldsSettings() }
            name={'Save Changes'}
            loading={loading}
          />
        </p>
      </div>
    </div>
  )
}

CustomFields.propTypes = {
  opCustomFieldsSettingsData: PropTypes.shape({
    header_cf_1: PropTypes.any,
    header_cf_2: PropTypes.any,
    header_cf_3: PropTypes.any,
    header_cf_4: PropTypes.any,
    header_cf_5: PropTypes.any,
    detail_cf_1: PropTypes.any,
    detail_cf_2: PropTypes.any,
    detail_cf_5: PropTypes.any
  }),
  settingsActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    opCustomFieldsSettingsData : state.orderPoints.settings.opCustomFieldsSettingsData,
    loading : state.orderPoints.settings.loading
  })
)(CustomFields)