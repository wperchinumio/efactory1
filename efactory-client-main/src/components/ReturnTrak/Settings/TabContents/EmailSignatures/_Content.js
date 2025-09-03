import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { getUserData } from '../../../../../util/storageHelperFuncs'
import FroalaEditor from '../../../../_Shared/Froala'
import ButtonLoading from '../../../../_Shared/Components/ButtonLoading'

const EmailSignatures = props => {
  const onlyAccount = useRef(null)
  useEffect(
    () => {
      if (onlyAccount.current) {
        props.settingsActions.setEmailSignatureValue({ 
          field:'accountNumberWarehouse', 
          value: onlyAccount.current
        })
      }
      return () => {
        props.settingsActions.setEmailSignatureValue({ field:'accountNumberWarehouse', value: '' })
      }
    },
    []
  )

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
    let { accountNumberWarehouse = '' } = props.settings
    return (
      <select
        className="input-sm" style={{minWidth: "200px"}}
        value={ accountNumberWarehouse }
        onChange={ event => handleInputChange( 'accountNumberWarehouse' ,event.target.value ) }
      >
        {
          accounts.length !== 1 &&
          <option value='' />
        }
        { accounts }
      </select>
    )
  }

  function handleInputChange (field, value) {
    props.settingsActions.setEmailSignatureValue({ field, value })
  }

  function copySample1ToClipboard () {
    let sample = "<p><strong>RMA Department<br>c/o DCL Logistics<br></strong>48819 Kato Road<br>Fremont, CA 94539</p>"
    handleInputChange( 'receiving_address', sample )
  }

  function copySample2ToClipboard () {
    let sample = "<p><strong>The CompanyName Support Team</strong><br><a href=\"http://company.com\" target=\"_blank\">company.com</a><br>1-222-3333<br><span style=\"font-size: 13px;\">Weekdays 6AM-7PM (Pacific)</span></p>" +
      "<p style=\"font-size: 13px\"><strong>Please note: Do not reply to this email.</strong> Should you have any questions please contact us at:1-222-3333 or send us an email via <a href='http://company.com/contactus' target='_blank'>http://company.com/contactus</a>." +
      "</p>" +
      "<p style=\"font-size: 12px\">This e-mail message was sent from a notification-only address that cannot accept incoming e-mail. The information contained in this message is privileged, confidential, and protected from disclosure. This message is intended for the individual or entity addressed herein. If you are not the intended recipient, please do not read, copy, use or disclose this communication to others; please delete it from your system.</p>"
    handleInputChange( 'contact_info', sample )
  }

  let{
    accountNumberWarehouse = '',
    contact_info = '',
    receiving_address = '',
    updatingEmailSignature
  } = props.settings

  return (
    <div className="tab-pane active" id="email_signatures">
      <div className="row no-margins">
        <div className="col-md-10">
          <p> Customize the receiving warehouse address and the contact info based
          on the RMA warehouse and use the 2
          keywords <strong>[WH_RECEIVING_ADDRESS]</strong> and  <strong>[WH_CONTACT_INFO]
          </strong> in email templates.
          </p>
          <div className="op-review">
            <label className="control-label">Account # - RMA Warehouse:</label><br/>
            {
              createAccounts()
            }
          </div>
          <div className="col-md-8">
          </div>
        </div>
      </div>

      <div className="row no-margins">
        <div className="col-md-5">
          <div className={ classNames({
            'disable-email-template-editing': !accountNumberWarehouse,
            'hidden': accountNumberWarehouse ? true : false
          }) }>&nbsp;</div>
          <p style={{marginBottom:"3px", fontWeight: 600}}>Receiving warehouse address</p>
          <FroalaEditor
            value={ receiving_address ? receiving_address : '' }
            onChangeHandler={ value => handleInputChange( 'receiving_address', value ) }
          />
          <div>
            <button
              className="btn dark btn-xs"
              type="button"
              style={{marginTop: "5px"}}
              onClick={ event => copySample1ToClipboard() }
            >
              <i className="fa fa-copy"></i> Load this sample
            </button>
            <span className="pull-right">Keyword: <strong>[WH_RECEIVING_ADDRESS]</strong></span>
          </div>
          <p className="font-yellow-casablanca" style={{marginBottom: "5px", marginTop: "5px", fontStyle: "italic"}}>
            Sample:
          </p>
          <div style={{paddingLeft: "20px"}}>
            <span style={{fontWeight: 600}}>
              <b>RMA Department<br/>
              c/o DCL, Inc.</b><br/>
              48819 Kato Road<br/>
              Fremont, CA 94539
            </span>
            <br/>
          </div>
        </div>
        <div className="col-md-5">
          <div className={ classNames({
            'disable-email-template-editing' : !accountNumberWarehouse,
            'hidden' : accountNumberWarehouse ? true : false
          }) }>&nbsp;</div>
          <p style={{marginBottom:"3px", fontWeight: 600}}>Contact info</p>
          <FroalaEditor
            value={ contact_info ? contact_info : '' }
            onChangeHandler={ value => handleInputChange( 'contact_info', value ) }
          />
          <div>
            <button className="btn dark btn-xs" type="button" style={{marginTop: "5px"}}
                    onClick={()=>copySample2ToClipboard()}
            >
              <i className="fa fa-copy"></i> Load this sample
            </button>
            <span className="pull-right">Keyword: <strong>[WH_CONTACT_INFO]</strong></span>
          </div>
          <p className="font-yellow-casablanca" style={{marginBottom: "5px", marginTop: "5px", fontStyle: "italic"}}>
            Sample:
          </p>
          <div style={{paddingLeft: "20px"}}>
            <span>
              <b>The CompanyName Support Team</b><br/>
              <a href="#">company.com</a><br/>
              1-222-3333<br/>
              <span style={{fontSize: "13px"}}>Weekdays 6AM-7PM (Pacific)</span>
              <p style={{fontSize: "13px"}}><strong>Please note: Do not reply to this email.</strong> Should you have any questions please contact us at:1-222-3333 or send us an email via <a href="#">http://company.com/contactus</a>.
              </p>
              <span style={{fontSize: "12px"}}>This e-mail message was sent from a notification-only address that cannot accept incoming e-mail. The information contained in this message is privileged, confidential, and protected from disclosure. This message is intended for the individual or entity addressed herein. If you are not the intended recipient, please do not read, copy, use or disclose this communication to others; please delete it from your system.</span>
            </span>
            <br/>
          </div>
        </div>
      </div>
      <div className="col-md-10 no-margins" style={{paddingBottom:"10px"}}>
        <ButtonLoading
          className="btn green-soft pull-right"
          type="button"
          loading={ updatingEmailSignature }
          name={'Save Changes'}
          disabled={ !accountNumberWarehouse }
          handleClick={props.settingsActions.updateEmailSignature}
        />
      </div>
    </div>
  )
}

export default connect(
  state => ({
    settings : state.returnTrak.settings
  })
)(EmailSignatures)