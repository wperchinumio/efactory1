import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../../../_Shared/Components/ButtonLoading'

const EmailSample = props => {
  const inputElement = useRef(null)
  const firstRun = useRef(true)
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (!props.shipNotificationState.loadingEmailSample) {
        setTimeout( () => {
          inputElement.current.select()
          inputElement.current.focus()
        }, 0 )
      }
    },
    [props.shipNotificationState.loadingEmailSample]
  )

  function handleInput (event) {
    let field = event.currentTarget.getAttribute('data-field')
    let { value } = event.currentTarget
    props.shipNotificationActions.setRootReduxStateProp_multiple({ [field]: value })
  }

  function onSendEmailClicked (event) {
    event.preventDefault()
    let { email_value } = props.shipNotificationState
    email_value = email_value.trim()
    if( email_value.length ){
      props.shipNotificationActions.emailSample({ email_value })
    }
  }

  let {
    email_value, 
    loadingEmailSample,
    order_number
  } = props.shipNotificationState

  return (
    <div className="well" style={{paddingBottom: "40px", paddingTop: "10px"}}>
      <h4 style={{fontWeight:300}}>
        Need to test this Ship Confirmation email template? Send a sample to your email address.
      </h4>
      <form
        autoComplete="off"
        onSubmit={onSendEmailClicked}
      >
        <div className="form-group">
          <div className="row">
            <div className="col-md-6">
              <label>
                Email Address:
              </label>
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-envelope" />
                </span>
                <input
                  type="text"
                  data-field="email_value"
                  ref={inputElement}
                  value={email_value}
                  className="form-control"
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label>
                Order #:
              </label>
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-envelope" />
                </span>
                <input
                  type="text"
                  data-field="order_number"
                  placeholder="(Optional)"
                  ref={inputElement}
                  value={order_number}
                  className="form-control"
                  onChange={handleInput}
                />
              </div>
            </div>
          </div>
        </div>
        <span className="font-red" style={{ position : 'relative', top : '7px' }} />
        <ButtonLoading
          className="btn btn-topbar btn-sm pull-right"
          type="button"
          disabled={!email_value}
          handleClick={onSendEmailClicked}
          iconClassName={'fa fa-send'}
          name={'Email sample'}
          loading={loadingEmailSample}
        />
      </form>
    </div>
  )
}

EmailSample.propTypes = {
  shipNotificationState: PropTypes.object.isRequired,
  shipNotificationActions: PropTypes.object.isRequired,
}

export default EmailSample