import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import AddressBookModal from '../../Modals/AddressBookModal'
import ValidateAddressModal from '../../../../_Shared/Components/ValidateAddress'
import { isNullOrEmpty } from '../../../../_Shared/Functions'
import Select2React from '../../../../_Shared/Components/Select2React'

const ShippingAddress = props => {
  const companyField = useRef(null)
  const attentionField = useRef(null)
  
  const handleModalOpening = useCallback(
    () => {
      global.$(".draggable-modal").css({ top : '0px', left : '0px' })
    },
    []
  )

  useEffect(
    () => {
      global.$('.draggable-modal').draggable({ handle: ".modal-header"})
      global.$('.draggable-modal').on( 'show.bs.modal', handleModalOpening)
      return () => {
        global.$('.draggable-modal').off( 'show.bs.modal', handleModalOpening) 
      }
    },
    []
  )

  useEffect(
    () => {
      if (props.dirty) {
        props.reviewActions.setRootReduxStateProp({ field : 'dirty', value : true })
      }
    },
    [props.dirty]
  )

  function showGoogleMap (event) {
    let { 
      address1 = '',
      city = '',
      state_province = '',
      postal_code = '',
      country = ''
    } = props.shippingAddress
    
    if (address1) {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(address1)}`+
        `%20${encodeURIComponent(city)}%20${encodeURIComponent(state_province)}`+
        `%20${encodeURIComponent(postal_code)}%20${encodeURIComponent(country)}`
      )
    }
  }

  function handleValidateAddressAccept (is_from_modal = true, data = {}) {
    let { shippingAddress, addressForAccept, reviewActions } = props
    let { correct_address = {} } = is_from_modal? addressForAccept: data
    reviewActions.setRootReduxStateProp_multiple({
      shippingAddress: {
        ...shippingAddress,
        ...correct_address,
        country: 'US',
      },
      dirty: true
    })
    global.$('#address-verify-modal').modal('hide')
  }

  /*
    filters company, attention and title fields of addressbook items
  */
  function filter2Fields ({ value = '', type = '' }) {
    if( type === '' ){
      return console.error('type is required for filter2Fields method')
    }
    if( value.length ){
      let { addressActions } = props
      addressActions.setRootReduxStateProp_multiple({
        activePagination: 1,
        filter: {
          field: type,
          value
        }
      }).then(
        () => {
          addressActions.getAddressesAsync().then(
            ({ rows }) => {
              handleFilteredAddresses( rows, value )
            }
          ).catch( e => {} )
        }
      )
    }
  }

  function handleFilteredAddresses (addresses = [], value = '') {
    if( addresses.length === 1 ){
      let matchedAddress = addresses[0]
      let { ship_to, bill_to } = matchedAddress
      props.reviewActions.setRootReduxStateProp_multiple({
        shippingAddress: { ...ship_to },
        billingAddress: { ...bill_to }
      })
    }else{
      let { addressActions } = props
      addressActions.setRootReduxStateProp_multiple({
        activePagination: 1,
        filter: null
      }).then(
        () => {
          global.$('#address-book').modal('show')
        }
      )
    }
  }

  /* VALIDATE ADDRESS STARTS HERE */
  function onCorrectAddressFieldChange (event, field) {
    let { reviewActions, addressForAccept } = props
    let { correct_address = {} } = addressForAccept
    let { value = '' } = event.target
    value = value.trim()
    let { setRootReduxStateProp } = reviewActions
    setRootReduxStateProp({
      field: 'addressForAccept',
      value: {
        ...addressForAccept,
        correct_address: {
          ...correct_address,
          [field]: value
        }
      }
    })
  }

  function validateAddress () {
    props.reviewActions.activateAddress().then( ({ isSuccess, data }) => {
      if(isSuccess){
        let { errors = '', warnings = '' } = data
        let isErrorsOrWarnings = errors || warnings
        if( isErrorsOrWarnings ){
          return global.$('#validate-address-addressbook').modal('show')
        }else{
          handleValidateAddressAccept(false, data)
        }
      }
    } )
  }

  /* VALIDATE ADDRESS ENDS HERE */
  function handleInputChange (field, value) {
    let { shippingAddress, reviewActions } = props
    reviewActions.setRootReduxStateProp_multiple({
      shippingAddress: {
        ...shippingAddress,
        country: field === 'country' ? value : shippingAddress.country,
        state_province: field === 'country' ? '' : value
      },
      dirty: true
    })
  }

  function onInputValueChange (event) {
    let { value, name } = event.target
    let { shippingAddress, reviewActions } = props
    reviewActions.setRootReduxStateProp_multiple({
      shippingAddress: {
        ...shippingAddress,
        [name]: value
      },
      dirty: true
    })
  }

  let {
    countries,
    states,
    entryPageType,
    reviewActions,
    addressForAccept,
    shippingAddress,
    addressActions
  } = props

  let { errors, warnings, correct_address } = addressForAccept || {}

  let {
    company = '',
    attention = '',
    address1 = '',
    address2 = '',
    city = '',
    email = '',
    phone = '',
    state_province = '',
    country = '',
    postal_code = '',
    international_code = ''
  } = shippingAddress

  return (
    <div className="col-lg-6 col-md-12">
      <AddressBookModal
        reviewActions={reviewActions}
        addressActions={addressActions}
      />
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
        errors={errors || ''}
        warnings={ warnings || '' }
        id="validate-address-addressbook"
        onAccept={ event => handleValidateAddressAccept() }
      />
      <div className="shipping">
        <div className="addr-type">
          <i className="fa fa-truck">
          </i> Shipping Address
          <div className="pull-right">
            <a
              href="#address-book"
              className="addr-edit"
              data-toggle="modal"
              tabIndex="-1"
            >
              <i className="fa fa-book"></i> Address Book...
            </a>
          </div>
        </div>
        <div className="form-group padding-5" style={{marginBottom: "3px"}}>
          <div className="row">
            <div className="col-md-12">
              <label 
                className={classNames({
                  'control-label': true,
                  'label-req' : shippingAddress  // furkan
                                ? isNullOrEmpty(company) && isNullOrEmpty(attention) 
                                : true
                })}
              >
                Company:
              </label>
              <form autoComplete="off" onSubmit={ event => {
                event.preventDefault();
                let company = companyField.current.value
                company = company ? company.trim() : ''
                filter2Fields({ value : company, type : 'company' })
              } }>
                <input 
                  type="text"
                  name="company"
                  value={ company ? company : '' }
                  onChange={ onInputValueChange }
                  ref={companyField}
                  className="form-control input-sm"
                />
              </form>
            </div>
            <div className="col-md-12">
              <label 
                className={classNames({
                  'control-label': true,
                  'label-req' : shippingAddress 
                                ? isNullOrEmpty(company) && isNullOrEmpty(attention) 
                                : true
                })}
              >
                Attention:
              </label>
              <form autoComplete="off" onSubmit={ event => {
                event.preventDefault()
                let attention = attentionField.current.value
                attention = attention ? attention.trim() : ''
                filter2Fields({ value : attention, type : 'attention' })
              } }>
                <input 
                  type="text"
                  value={ attention ? attention : '' }
                  onChange={ onInputValueChange }
                  name="attention"
                  ref={attentionField}
                  className="form-control input-sm"
                />
              </form>
            </div>
            <div className="col-md-8">
              <label 
                className={classNames({
                  'control-label': true,
                  'label-req' : shippingAddress ? isNullOrEmpty(address1) : true
                })}
              >
                Address 1:
              </label>
              <div className="input-group">
                <input 
                  type="text"
                  name="address1"
                  value={ address1 ? address1 : '' }
                  onChange={ onInputValueChange }
                  className="form-control input-sm"
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
                      <a onClick={ showGoogleMap }><i className="fa fa-map-marker"></i> View Map </a>
                    </li>
                    <li
                      className={ classNames({
                        'disabled' : !( country === 'US' || international_code === 0 )
                      }) }
                    >
                      <a
                        onClick={ validateAddress }
                      >
                        <i className="fa fa-check"></i>
                        Validate Address
                      </a>

                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <label className="control-label">
                Address 2:
              </label>
              <input 
                type="text"
                value={ address2 ? address2 : '' }
                onChange={ onInputValueChange }
                name="address2"
                className="form-control input-sm"
              />
            </div>
            <div className="col-md-8">
              <label 
                className={classNames({
                  'control-label': true,
                  'label-req' : shippingAddress ? isNullOrEmpty(city) : true
                })}
              >
                City:
              </label>
              <input 
                type="text"
                name="city"
                value={ city ? city : '' }
                onChange={ onInputValueChange }
                className="form-control input-sm"
              />
            </div>
            <div className="col-md-4">
              <label 
                className={classNames({
                  'control-label': true,
                  'label-req' : shippingAddress ? isNullOrEmpty(postal_code) && (country === 'US' || country === 'CA') : true
                })}
              >
                Postal Code:
              </label>
              <div className="">
                <input 
                  type="text"
                  name="postal_code"
                  value={ postal_code ? postal_code : '' }
                  onChange={ onInputValueChange }
                  className="form-control input-sm"
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className={classNames({
                'control-label': true,
                'label-req' : shippingAddress ? isNullOrEmpty(state_province) && (country === 'US' || country === 'CA' || country === 'AU') : true
              })}>State:</label>
              {
                ['US','CA','AU'].includes(country) && entryPageType !== 'edit_order'
                &&
                <Select2React 
                  options={ states && country ? states[country] : {} }
                  selected={ states && state_province ? state_province : '' }
                  isoFormat={true}
                  height={'30px'}
                  onChangeHandler={ value => handleInputChange( 'state_province', value ) }
                />
              }
              <input 
                type="text"
                name="state_province"
                value={ state_province ? state_province : '' }
                onChange={ onInputValueChange }
                className="form-control input-sm"
                style={{ 
                  display : ['US','CA','AU'].includes(country) && entryPageType !== 'edit_order' 
                            ? 'none' 
                            : 'block' 
                }}
              />
            </div>
            <div className="col-md-6">
              <label className={classNames({
                'control-label': true,
                'label-req' : shippingAddress ? isNullOrEmpty(country) : true
              })}>Country:</label>
              {
                entryPageType !== 'edit_order' &&
                <Select2React 
                  options={ countries ? countries : {}  }
                  selected={ countries ? country : '' }
                  isoFormat={true}
                  height={'30px'}
                  onChangeHandler={ value => handleInputChange( 'country', value ) }
                  topOptions={[ 'US', 'CA', 'AU' ]} 
                />
              }
              <input 
                type="text"
                value={ country ? country : '' }
                onChange={ onInputValueChange }
                name="country"
                className="form-control input-sm"
                style={{ display : entryPageType !== 'edit_order' ? 'none' : 'block' }}
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
                  name="phone"
                  value={ phone ? phone : '' }
                  onChange={ onInputValueChange }
                  className="form-control input-sm"
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="control-label">Email:</label>
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-envelope"></i>
                </span>
                <input 
                  type="text"
                  value={ email ? email : '' }
                  onChange={ onInputValueChange }
                  name="email"
                  className="form-control input-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ShippingAddress.propTypes = {
  entryPageType: PropTypes.oneOf([
    'create_new', 'edit_order', 'edit_template', 'edit_draft'
  ]),
  reviewActions: PropTypes.object.isRequired,
  addressActions: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    countries: state.common.globalApi.globalApiData.countries,
    entryPageType: state.orderPoints.entry.entryPageType,
    states: state.common.globalApi.globalApiData.states,
    globalApi: state.common.globalApi,
    addressForAccept: state.orderPoints.entry.addressForAccept,
    allAddresses: state.addressBook.allAddresses,
    shippingAddress: state.orderPoints.entry.shippingAddress
  })
)(ShippingAddress)