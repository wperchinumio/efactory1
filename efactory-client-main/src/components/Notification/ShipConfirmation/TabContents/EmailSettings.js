import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const EmailSettings = props => {
  useEffect(
    () => {
      props.shipNotificationActions.readEmailSettings()
    },
    []
  )

  function setFormField (event) {
    let field = event.currentTarget.getAttribute('data-fieldname')
    let value = field === 'consignee_only'  
                ? event.currentTarget.getAttribute('data-value') === 'true'
                : event.currentTarget.value
    let { emailSettings } = props.shipNotificationState
    props.shipNotificationActions.setRootReduxStateProp_multiple({
      emailSettings: {
        ...emailSettings,
        [field]: value
      }
    })
  }

  let {
    savingEmailSettings,
    emailSettings
  } = props.shipNotificationState

  let {
    consignee_only = false,
    from_name = '',
    subject = '',
    bcc_email = ''
  } = emailSettings

  return (
    <div className="tab-pane active" id="email_settings">
      <div className="col-lg-10">
        <p>
          An automatic email notification about a shipment to a customer, Ship Confirm Email, is sent by the DCL system based on the following:
        </p>
        <ol type='a'>
          <li>
            <p style={{margin: '7px 0'}}>An email address is provided by the customer as part of the order Consignee or Bill-To address information.</p>
          </li>
          <li>
            <p style={{margin: '7px 0'}}>The Email Settings and Email Templates items are completed and Enabled as part of this Set Up. The Email settings section is common for all customer accounts, however, the Email Templates section can be customized for each Account #. Please note that the email <b>From Name</b> can be customized but <b>Address</b> cannot be changed and it is set up as <i><u>dcl.shipping.department@dclcorp.com</u></i>.</p>
          </li>
          <li>
            <p style={{margin: '7px 0'}}>The emails are sent within 5 minutes after 2 hours of built-in delay from shipping (Manifesting) an order. For example, an email will be sent between 11:07 to 11:12 AM for the order Shipped (Manifested) at 9:07 AM. The 2 hour delay is built-in to allow DCL Quality Assurance group to be able to audit and remedy any possible issue and avoid incorrect email from going out to the end customer.</p>
          </li>
          <li>
            <p style={{margin: '7px 0'}}>The Email Templates section allows set up of multiple email templates at the same time, however, only one template can be Master (Active) at any given time. This facility is provided to allow preparation and approval of possible emails in advance that can be made active at the desired time by simply updating the status of the email to Master.</p>
          </li>
          <li>
            <p style={{margin: '7px 0'}}>Once this Email Notification part is set up, a User can also send this email manually from the Action drop down list of the Order Extended View – <b>Re-send Ship Confirmation</b> email. The email addresses can also be over-written and/or new ones added at this time.</p>
          </li>
        </ol>
        <br/>
        <form autoComplete="off" className="form-horizontal col-lg-8 col-md-9">
          <div>
            <span style={{fontWeight: "600"}} className="font-blue-soft">
              Email Notifications
            </span>
          </div>
          <hr className="border-grey-salsa" style={{marginTop: "0"}} />
          <div className="form-group" style={{marginBottom: 0}}>
            <label className="col-md-5 control-label">
              Email target:
            </label>
            <div className="col-md-7" style={{marginTop: "10px"}}>
              <label className="mt-radio" style={{marginRight: "25px", marginBottom: "0"}}>
                <input
                  type="checkbox"
                  checked={ consignee_only }
                  onChange={ setFormField }
                  data-fieldname={ 'consignee_only' }
                  data-value={ 'true' }
                />
                Consignee Email Address Only
                <span></span>
              </label>
            </div>
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <label className="col-md-5 control-label"></label>
            <div className="col-md-7" style={{marginTop: "10px"}}>
              <label className="mt-radio" style={{marginRight: "25px", marginBottom: "0"}}>
                <input
                  type="checkbox"
                  checked={ !consignee_only }
                  onChange={ setFormField }
                  data-fieldname={ 'consignee_only' }
                  data-value={ 'false' }
                />
                Consignee & Bill Email Addresses
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
                value={ from_name ? from_name : '' }
                onChange={ setFormField }
                data-fieldname={ 'from_name' }
                type="text"
                className="form-control input-md"
              />
              <span className="small text-muted">Example: DCL.Shipping.Department</span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">Subject:</span></label>
            <div className="col-md-7">
              <input
                value={ subject ? subject : '' }
                onChange={ setFormField }
                data-fieldname={ 'subject' }
                type="text"
                className="form-control input-md"
              />
             <span className="small text-muted">You can use any 'Order Level' keyword.</span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-5 control-label"><span className="ef-required">BCC email address:</span></label>
            <div className="col-md-7">
              <input
                value={ bcc_email ? bcc_email : '' }
                onChange={ setFormField }
                data-fieldname={ 'bcc_email' }
                type="text"
                className="form-control input-md"
              />
              <span className="small text-muted">If needed, send a copy of any email to the address above.</span>
            </div>
          </div>
          <p>
            <ButtonLoading
              className="btn green-soft pull-right"
              type="button"
              disabled={ false }
              handleClick={props.shipNotificationActions.saveEmailSettings}
              name={'Save Changes'}
              loading={ savingEmailSettings }
            />
          </p>
        </form>
      </div>
    </div>
  )
}

EmailSettings.propTypes = {
  shipNotificationState: PropTypes.object.isRequired,
  shipNotificationActions: PropTypes.object.isRequired,
}

export default EmailSettings