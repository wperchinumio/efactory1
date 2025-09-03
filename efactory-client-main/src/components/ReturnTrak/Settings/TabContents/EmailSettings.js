import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const EmailSettings = props => {
  useEffect(
    () => {
      props.settingsActions.readEmailSettings()
    },
    []
  )

  function setFormField ({field = '', value = ''}) {
    props.settingsActions.setEmailSettingsField({field, value})
  }

  let {
    from_name = '',
    subject_issue = '',
    subject_receive = '',
    subject_ship = '',
    subject_cancel = '',
    bcc_email = '',
    support_email = '',
    ws_issue = false,
    ws_receive = false,
    ws_ship = false,
    ws_cancel = false,
    rt_issue = false,
    rt_receive = false,
    rt_ship = false,
    rt_cancel = false
  } = props.emailSettings

  let { savingEmailSettings } = props

  return (
    <div className="tab-pane active" id="email_settings">
      <div className="col-lg-5">
        <p> Customize email notifications and the basic email settings. Please note that the '<span style={{fontWeight: 600}}>From Email Address</span>' cannot be changed and it is set as <i>returns@notifications.dclcorp.com</i>.</p>
        <form autoComplete="off" className="form-horizontal">
          <div>
            <span style={{fontWeight: "600"}} className="font-blue-soft">Email Notifications</span>
          </div>
          <hr className="border-grey-salsa" style={{marginTop: "0"}} />
          <div className="form-group" style={{marginBottom: 0}}>
            <label className="col-md-5 control-label">ReturnTrak generated RMAs</label>
            <div className="col-md-7" style={{marginTop: "10px"}}>
              <label className="mt-checkbox mt-checkbox-outline" style={{marginRight: "25px"}}>
                <input
                  type="checkbox"
                  checked={ rt_issue }
                  onChange={ event => setFormField({ field: 'rt_issue', value: !rt_issue }) }
                />
                Issue
                <span></span>
              </label>
              <label className="mt-checkbox mt-checkbox-outline" style={{marginRight: "25px"}}>
                <input
                  type="checkbox"
                  checked={ rt_receive }
                  onChange={ event => setFormField({ field: 'rt_receive', value: !rt_receive }) }
                />
                Receive
                <span></span>
              </label>
              <label className="mt-checkbox mt-checkbox-outline" style={{marginRight: "25px"}}>
                <input
                  type="checkbox"
                  checked={ rt_ship }
                  onChange={ event => setFormField({ field: 'rt_ship', value: !rt_ship }) }
                />
                Ship
                <span></span>
              </label>
              <label className="mt-checkbox mt-checkbox-outline">
                <input
                  type="checkbox"
                  checked={ rt_cancel }
                  onChange={ event => setFormField({ field: 'rt_cancel', value: !rt_cancel }) }
                />
                Cancel
                <span></span>
              </label>
            </div>
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <label className="col-md-5 control-label">Web Service generated RMAs</label>
            <div className="col-md-7" style={{marginTop: "10px"}}>
              <label className="mt-checkbox mt-checkbox-outline" style={{marginRight: "25px"}}>
                <input
                  type="checkbox"
                  checked={ ws_issue }
                  onChange={ event => setFormField({ field: 'ws_issue', value: !ws_issue }) }
                />
                Issue
                <span></span>
              </label>
              <label className="mt-checkbox mt-checkbox-outline" style={{marginRight: "25px"}}>
                <input
                  type="checkbox"
                  checked={ ws_receive }
                  onChange={ event => setFormField({ field: 'ws_receive', value: !ws_receive }) }
                />
                Receive
                <span></span>
              </label>
              <label className="mt-checkbox mt-checkbox-outline" style={{marginRight: "25px"}}>
                <input
                  type="checkbox"
                  checked={ ws_ship }
                  onChange={ event => setFormField({ field: 'ws_ship', value: !ws_ship }) }
                />
                Ship
                <span></span>
              </label>
              <label className="mt-checkbox mt-checkbox-outline">
                <input
                  type="checkbox"
                  checked={ ws_cancel }
                  onChange={ event => setFormField({ field: 'ws_cancel', value: !ws_cancel }) }
                />
                Cancel
                <span></span>
              </label>
            </div>
          </div>
          <div>
            <span style={{fontWeight: "600"}} className="font-blue-soft">General</span>
          </div>
          <hr className="border-grey-salsa" style={{marginTop: "0"}} />
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">From Name:</span></label>
            <div className="col-md-7">
              <input
                value={from_name}
                onChange={ event => setFormField({ field: 'from_name', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
              <span className="small text-muted">Example: RMA Department</span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">Subject for 'issue' emails:</span></label>
            <div className="col-md-7">
              <input
                value={subject_issue}
                onChange={ event => setFormField({ field: 'subject_issue', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">Subject for 'receive' emails:</span></label>
            <div className="col-md-7">
              <input
                value={subject_receive}
                onChange={ event => setFormField({ field: 'subject_receive', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">Subject for 'ship' emails:</span></label>
            <div className="col-md-7">
              <input
                value={subject_ship}
                onChange={ event => setFormField({ field: 'subject_ship', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">Subject for 'cancel' emails:</span></label>
            <div className="col-md-7">
              <input
                value={subject_cancel}
                onChange={ event => setFormField({ field: 'subject_cancel', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label">BCC email address:</label>
            <div className="col-md-7">
              <input
                value={bcc_email}
                onChange={ event => setFormField({ field: 'bcc_email', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
              <span className="small text-muted">If needed, send a copy of any email to the address above.</span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label">Support email address:</label>
            <div className="col-md-7">
              <input
                value={support_email}
                onChange={ event => setFormField({ field: 'support_email', value: event.target.value }) }
                type="text"
                className="form-control input-md"
              />
              <span className="small text-muted">Email address to notify in case of any issue.</span>
            </div>
          </div>
          <p>
            <ButtonLoading
              className="btn green-soft pull-right"
              type="button"
              disabled={ false }
              handleClick={props.settingsActions.saveEmailSettings}
              name={'Save Changes'}
              loading={savingEmailSettings}
            />
          </p>
        </form>
      </div>
    </div>
  )
}

EmailSettings.propTypes = {
  settingsActions: PropTypes.object.isRequired,
  emailSettings: PropTypes.object.isRequired,
  savingEmailSettings: PropTypes.bool.isRequired
}

export default connect(
  state => ({
    emailSettings: state.returnTrak.settings.emailSettings,
    savingEmailSettings: state.returnTrak.settings.savingEmailSettings
  })
)(EmailSettings)