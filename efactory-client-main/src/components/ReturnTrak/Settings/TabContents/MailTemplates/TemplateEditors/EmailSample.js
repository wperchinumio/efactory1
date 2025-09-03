import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getUserData } from '../../../../../../util/storageHelperFuncs'
import { connect } from 'react-redux'
import ButtonLoading from '../../../../../_Shared/Components/ButtonLoading'

const EmailSample = props => {
  const firstRun = useRef(true)
  const onlyAccount = useRef(null)
  const inputElement = useRef(null)

  useEffect(
    () => {
      if (onlyAccount.current) {
        props.templateActions.setEmailValue({ field:'emailAccountWarehouse', value: onlyAccount.current })
      }
      return () => {
        props.templateActions.resetState()
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setTimeout( 
        () => {
          inputElement.current.select()
          inputElement.current.focus()
        },
        0
      )
    },
    [props.loadingEmailSample]
  )

  function handleEmailInput (event) {
    const { value } = event.target
    props.templateActions.setEmailValue({ field: 'emailValue', value })
  }

  function onSendEmailClicked (event) {
    event.preventDefault()
    let { emailValue } = props
    emailValue = emailValue.trim()
    if (emailValue.length) {
      props.templateActions.emailSample()
    }
  }

  function handleLocationAccountChange (event) {
    const { value } = event.target
    props.templateActions.setEmailValue({ field: 'emailAccountWarehouse', value })
  }

  function createAccounts () {
    let accounts = []
    let firstAccount
    let calc_account_regions = getUserData('calc_account_regions') || {}
    let calc_account_regions_keys = Object.keys( calc_account_regions )
    calc_account_regions_keys.sort( (a, b) => {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    })
    calc_account_regions_keys.forEach( accountObj => {
      firstAccount = accountObj
      accounts.push(
        <option key={accountObj} value={accountObj}>{ calc_account_regions[accountObj] }</option>
      )
    })

    if (accounts.length === 1) {
      onlyAccount.current = firstAccount
    }

    let { emailAccountWarehouse = '' } = props

    return (
      <div className="input-group">
        <span className="input-group-addon">
            <i className="fa fa-industry"></i>
        </span>
        <select
          className="form-control"
          value={ emailAccountWarehouse }
          onChange={handleLocationAccountChange}
        >
          {
            accounts.length !== 1 &&
            <option value=""></option>
          }
          {
            accounts
          }
        </select>
      </div>
    )
  }

  let { emailValue, loadingEmailSample, emailAccountWarehouse } = props

  return (
    <div className="well" style={{paddingBottom: "40px", paddingTop: "10px"}}>
      <h4 style={{fontWeight:300}}>Need to test this RMA email template? Send a sample to your email address.</h4>
      <form
        autoComplete="off"
        onSubmit={onSendEmailClicked}
      >
        <div className="form-group">
          <div className="row">
            <div className="col-md-6">
              <label>Email Address</label>
              <div className="input-group">
                <span className="input-group-addon">
                    <i className="fa fa-envelope"></i>
                </span>
                <input
                  type="text"
                  ref={inputElement}
                  value={emailValue}
                  className="form-control"
                  onChange={handleEmailInput}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="control-label">Account # - RMA Warehouse:</label><br/>
              { createAccounts() }
            </div>
          </div>
        </div>
        <span
          className="font-red"
          style={{ position: 'relative', top: '7px' }}
        />
        <ButtonLoading
          className="btn btn-topbar btn-sm pull-right"
          type="button"
          disabled={
            emailValue.trim().length === 0 ||
            emailAccountWarehouse === ''
          }
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
  emailValue: PropTypes.string.isRequired,
  templateActions: PropTypes.object.isRequired,
  loadingEmailSample: PropTypes.bool.isRequired
}

export default connect(
  state => ({
    emailValue: state.returnTrak.mailTemplates.emailValue,
    loadingEmailSample: state.returnTrak.mailTemplates.loadingEmailSample,
    emailAccountWarehouse: state.returnTrak.mailTemplates.emailAccountWarehouse
  })
)(EmailSample)