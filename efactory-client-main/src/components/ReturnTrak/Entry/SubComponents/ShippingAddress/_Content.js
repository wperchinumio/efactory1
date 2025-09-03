import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Select2React from '../../../../_Shared/Components/Select2React'
import ValidateAddressModal from '../../../../_Shared/Components/ValidateAddress'
import { isNullOrEmpty } from '../../../../_Shared/Functions'
import rmaConfig from '../../../Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'
import * as addressActions from '../../../../OrderPoints/AddressBook/redux'

const RmaShippingAddress = props => {
  function showGoogleMap () {
    let { 
      address1 = '',
      city = '',
      state_province = '',
      postal_code = '',
      country = ''
    } = props.shipping_address
    
    if (address1) {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(address1)}`+
        `%20${encodeURIComponent(city)}%20${encodeURIComponent(state_province)}`+
        `%20${encodeURIComponent(postal_code)}%20${encodeURIComponent(country)}`
      )
    }
  }

  /* VALIDATE ADDRESS STARTS HERE */
  function onCorrectAddressFieldChange (event, field) {
    let { rmaEntryActions, correct_address, dirty } = props
    let { value = '' } = event.target
    value = value.trim()
    let { setRootReduxStateProp } = rmaEntryActions
    setRootReduxStateProp({
      field: 'correct_address',
      value: {
        ...correct_address,
        [field]: value
      }
    })
    if (!dirty) {
      setRootReduxStateProp({ field: 'dirty', value: true })
    }
  }
  /*
   * being passed to validate address modal,
   * gets called when accept button clicked
   */

  function onValidateAddressAccept () {
    let { shipping_address, correct_address, rmaEntryActions, dirty } = props
    let { setRootReduxStateProp } = rmaEntryActions
    setRootReduxStateProp({
      field: 'shipping_address',
      value: { ...shipping_address, ...correct_address }
    })
    setRootReduxStateProp({ field: 'dirty', value: true })
    if (!dirty) {
      setRootReduxStateProp({ field: 'dirty', value: true })
    }
  }

  function validateAddress () {
    let { shipping_address, addressActions, rmaEntryActions } = props
    let {
      address1 = '',
      address2 = '',
      city = '',
      postal_code = '',
      state_province = ''
    } = shipping_address

    addressActions.validateAddressAsync({
      address1, address2, city, postal_code, state_province
    }).then( ({ isSuccess, data }) => {
      if(isSuccess){
        let { setRootReduxStateProp } = rmaEntryActions
        let { errors = '', warnings = '', correct_address } = data
        let isErrorsOrWarnings = errors || warnings
        setRootReduxStateProp({
          field: 'correct_address',
          value: correct_address
        }).then( () => {
          if (isErrorsOrWarnings ){
            return global.$('#validate-address-addressbook').modal('show')
          }else{
            onValidateAddressAccept()
          }
        } )
      }
    } )
  }

  /* VALIDATE ADDRESS ENDS HERE */

  function handleInputChange (field, value) {
    let { setShippingAddressValue } = props.rmaEntryActions
    setShippingAddressValue({ field, value })
    let { setRootReduxStateProp } = props.rmaEntryActions
    if (!props.dirty ){
      setRootReduxStateProp({ field: 'dirty', value: true })
    }
  }

  /* this method gets called on country change handler on the render method */
  function changeShippingValuesOnCountryChange (value) {
    let { shipping = {} } = props.rmaSettingsData.general
    let {
      setShippingValues,
      setOthersValue
    } = props.rmaEntryActions

    if (value === 'US' ){
      let { domestic = {} } = shipping
      setShippingValues({
        ...domestic,
        shipping_carrier: domestic.carrier,
        shipping_service: domestic.service,
        terms: domestic.terms
      }, false)
      setOthersValue({ field: 'comments', value: domestic.comments })
    }else if (value !== '' ){
      let { international = {} } = shipping
      setShippingValues({
        ...international,
        shipping_carrier: international.carrier,
        shipping_service: international.service,
        terms: international.terms
      }, false)
      setOthersValue({ field: 'comments', value: international.comments })
    }else{
      setShippingValues({}, false)
      setOthersValue({ field: 'comments', value: '' }) // dont merge
    }
    let { setRootReduxStateProp } = props.rmaEntryActions
    if (!props.dirty ){
      setRootReduxStateProp({ field: 'dirty', value: true })
    }
  }

  let { 
    shipping_address, 
    globalApi, 
    correct_address, 
    validatedAddressFields, 
    rmaHeader,
    rmaSettingsData
  } = props

  let { email_settings_rt = {} } = rmaSettingsData

  let isEmailRequired = email_settings_rt[ 'issue' ] ||
                        email_settings_rt[ 'receive' ] ||
                        email_settings_rt[ 'ship' ] ||
                        email_settings_rt[ 'cancel' ]

  let {
    address1,
    address2,
    attention,
    city,
    company,
    country,
    email,
    phone,
    postal_code,
    state_province
  } = shipping_address

  let {
    rma_type = '',
  } = rmaHeader

  let {
    countries,
    states
  } = globalApi.globalApiData

  let isToShipButtonBlue = false

  let isRmaTypeSelected = rma_type ? true : false

  if (isRmaTypeSelected ){
    isToShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
  }

  return (
    <div className="col-lg-6 col-md-12">
      <div className="shipping">
        <div className="addr-type"><i className="fa fa-truck"></i> RMA Address
        </div>
        <div className="form-group padding-5" style={{marginBottom: "3px"}}>
          <div className="row">
            <div className="col-md-12">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(company) && isNullOrEmpty(attention)
              })}>Company:</label>
              <input
                type="text"
                className="form-control input-sm"
                value={ company ? company : '' }
                onChange={ event => handleInputChange( 'company', event.target.value ) }
              />
            </div>
            <div className="col-md-12">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(company) && isNullOrEmpty(attention)
              })}>Attention:</label>
              <input
                type="text"
                className="form-control input-sm"
                value={ attention ? attention : '' }
                onChange={ event => handleInputChange( 'attention', event.target.value ) }
              />
            </div>
            <div className="col-md-8">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(address1) && isToShipButtonBlue
              })}>Address 1:</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control input-sm"
                  value={ address1 ? address1 : '' }
                  onChange={ event => handleInputChange( 'address1', event.target.value ) }
                />
                <div className="input-group-btn">
                  <button
                    type="button"
                    className="btn btn-topbar dropdown-toggle btn-sm"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    tabIndex="-1"
                    style={{paddingLeft: "7px", paddingRight: "7px"}}
                    disabled={ !( address1 && String(address1).trim().length ) }
                  >
                    <i className="fa fa-angle-down"></i>
                  </button>
                  <ul className="dropdown-menu pull-right">
                    <li>
                      <a onClick={ showGoogleMap }>
                        <i className="fa fa-map-marker"></i> View Map
                      </a>
                    </li>
                    <li className={ classNames({ 'disabled' : country !== 'US' }) } >
                      <a
                        className={ classNames({ 'disabled-link' : country !== 'US' }) }
                        onClick={ event => {
                          if (country === 'US' ){
                            validateAddress()
                          }
                        } }>
                      <i className="fa fa-check"></i> Validate Address </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <label className="control-label">Address 2:</label>
              <input
                type="text"
                className="form-control input-sm"
                value={ address2 ? address2 : '' }
                onChange={ event => handleInputChange( 'address2', event.target.value ) }
              />
            </div>
            <div className="col-md-8">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(city) && isToShipButtonBlue
              })}>City:</label>
              <input
                type="text"
                className="form-control input-sm"
                value={ city ? city : '' }
                onChange={ event => handleInputChange( 'city', event.target.value ) }
              />
            </div>
            <div className="col-md-4">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(postal_code) && (country === 'US' || country === 'CA') && isToShipButtonBlue
              })}>Postal Code:</label>
              <div className="">
                <input
                  type="text"
                  className="form-control input-sm"
                  value={ postal_code ? postal_code : '' }
                  onChange={ event => handleInputChange( 'postal_code', event.target.value ) }
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(state_province) && (country === 'US' || country === 'CA' || country === 'AU') && isToShipButtonBlue
              })}>State:</label>
              {
                ['US','CA','AU'].includes(country)
                ?
                <Select2React
                  options={ states && country ? states[country] : {} }
                  selected={ states && state_province ? state_province : '' }
                  isoFormat={true}
                  height={'30px'}
                  onChangeHandler={ value => handleInputChange( 'state_province', value ) }
                />
                :
                <div className="">
                  <input
                    type="text"
                    className="form-control input-sm"
                    value={ state_province ? state_province : '' }
                    onChange={ event => handleInputChange( 'state_province', event.target.value ) }
                  />
                </div>
              }
            </div>
            <div className="col-md-6">
              <label className={classNames({
                'control-label': true,
                'label-req' : isNullOrEmpty(country) && isToShipButtonBlue
              })}>Country:</label>
              <Select2React
                options={ countries ? countries : {}  }
                selected={ countries ? country : '' }
                isoFormat={true}
                height={'30px'}
                onChangeHandler={ value => {
                  handleInputChange( 'country', value )
                  handleInputChange( 'state_province', '' )
                  changeShippingValuesOnCountryChange(value)
                }  }
                topOptions={[ 'US', 'CA', 'AU' ]}
              />
            </div>
            <div className="col-md-6">
              <label className="control-label">Phone:</label>
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-phone"></i>
                </span>
                <input
                  type="text"
                  className="form-control input-sm"
                  value={ phone ? phone : '' }
                  onChange={ event => handleInputChange( 'phone', event.target.value ) }
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className={classNames({
                'control-label': true,
                'label-req' : isEmailRequired && isNullOrEmpty(email)
              })}>Email:</label>
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  type="text"
                  className="form-control input-sm"
                  value={ email ? email : '' }
                  onChange={ event => handleInputChange( 'email', event.target.value ) }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ValidateAddressModal
        enteredAddr={ {
          address1,
          address2,
          city,
          state_province,
          postal_code
        } }
        onCorrectAddressFieldChange={
          (event,field) => onCorrectAddressFieldChange(event,field)
        }
        correctAddr={ correct_address || {} }
        states={ states ? states['US'] : {} }
        errors={validatedAddressFields.errors || ''}
        warnings={ validatedAddressFields.warnings || '' }
        id="validate-address-addressbook"
        onAccept={ event => onValidateAddressAccept() }
      />
    </div>
  )
}

RmaShippingAddress.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired,
  rmaSettingsData: PropTypes.shape({
    general: PropTypes.shape({
      auto_number: PropTypes.shape({
        manual: PropTypes.any,
        prefix: PropTypes.any,
        suffix: PropTypes.any,
        starting_number: PropTypes.any,
        minimum_number_of_digits: PropTypes.any
      }),
      expiration_days: PropTypes.any,
      shipping: PropTypes.shape({
        domestic: PropTypes.shape({
          carrier: PropTypes.any,
          service: PropTypes.any,
          packing_list_type: PropTypes.any,
          freight_account: PropTypes.any,
          consignee_number: PropTypes.any,
          comments: PropTypes.any,
          int_code: PropTypes.any,
          terms: PropTypes.any
        }),
        international: PropTypes.shape({
          carrier: PropTypes.any,
          service: PropTypes.any,
          packing_list_type: PropTypes.any,
          freight_account: PropTypes.any,
          consignee_number: PropTypes.any,
          comments: PropTypes.any,
          int_code: PropTypes.any,
          terms: PropTypes.any
        })
      })
    }),
    email_settings_rt: PropTypes.shape({
      issue: PropTypes.bool,
      receive: PropTypes.bool,
      ship: PropTypes.bool,
      cancel: PropTypes.bool
    })
  }),
  shipping_address: PropTypes.shape({
    address1: PropTypes.string,
    address2: PropTypes.string,
    attention: PropTypes.string,
    city: PropTypes.string,
    company: PropTypes.string,
    country: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    postal_code: PropTypes.string,
    state_province: PropTypes.string
  })
}

export default connect(
  state => ({
    correct_address: state.returnTrak.entry.correct_address,
    dirty: state.returnTrak.entry.dirty,
    rmaHeader: state.returnTrak.entry.rmaHeader,
    globalApi: state.common.globalApi,
    others: state.returnTrak.entry.others,
    rmaSettingsData: state.returnTrak.settings.rmaSettingsData,
    shipping_address: state.returnTrak.entry.shipping_address,
    validatedAddressFields: state.addressBook.allAddresses.validatedAddressFields,
  }),
  dispatch => ({
    addressActions: bindActionCreators( addressActions, dispatch )
  })
)(RmaShippingAddress)