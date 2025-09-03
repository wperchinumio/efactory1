import React, { useState } from 'react'
import { path } from 'ramda'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import * as addressActions_ from '../../AddressBook/redux'
import AddressForm from './AddressForm'
import ValidateAddressModal from '../../../_Shared/Components/ValidateAddress'

export default function ShippingAddressReusable ({
  cloneShippingAddress,
  onFieldValueChange,
  setValidatedAddressValues,
  values
}) {

  const dispatch = useDispatch()
  const addressActions = bindActionCreators(addressActions_, dispatch)
  const states = useSelector( path(['common', 'globalApi', 'globalApiData', 'states']) )
  const [ validatedAddress, setValidatedAddress ] = useState({})
  const [ validateErrors, setValidateErrors ] = useState('')
  const [ validateWarnings, setValidateWarnings ] = useState('')

  function getFieldsToValidate () {
    let {
      address1 = '',
      address2 = '',
      city = '',
      postal_code = '',
      state_province = ''
    } = values
    return {address1, address2, city, postal_code, state_province}
  }

  const fieldsToValidate = getFieldsToValidate()

  function validateAddress(){
    addressActions.validateAddressAsync(fieldsToValidate).then( 
      ({ isSuccess, data }) => {
        if(isSuccess){
          let {
            correct_address = {},
            errors,
            warnings,
          } = data
          correct_address.country = 'US'
          if ( errors || warnings ) {
            setValidatedAddress(correct_address)
            setValidateErrors(errors)
            setValidateWarnings(warnings)
            return global.$('#validate-address-addressbook').modal('show')
          }
          setValidatedAddressValues(correct_address)
        }
      }
    )
  }

  function acceptValidatedAddress () {
    setValidatedAddressValues(validatedAddress)
  }

  function onCorrectAddressFieldChange (value, field) {
    setValidatedAddress({
      ...validatedAddress,
      [field]: value
    })
  }

  return (
    <div className="col-lg-5 col-md-12">
      <div>
        <div>
          <span className="font-blue-soft" style={{ fontWeight : '600' }} >
            Shipping Address
          </span>
        </div>
        <hr className="border-grey-salsa" style={{ marginTop : '0px' }} />
        <div style={{ height : '50px' }} />
        <AddressForm
          onFieldValueChange={onFieldValueChange}
          values={values}
        />
        <div className="form-group" style={{marginBottom: 0}}>
          <div className="col-sm-12 text-right">
            <button
              type="button" className="btn red-soft btn-sm"
              id="validate-address"
              disabled={ values.country !== 'US' }
              onClick={ validateAddress }
            >
              <i className="fa fa-map"></i>
              Validate Address
            </button>
            <br/>
            <small className="font-grey-cascade">
              USA only&nbsp;
            </small>
          </div>
        </div>
      </div>
      <ValidateAddressModal
        correctAddr={validatedAddress}
        enteredAddr={fieldsToValidate}
        errors={validateErrors}
        id='validate-address-addressbook'
        onAccept={acceptValidatedAddress}
        onCorrectAddressFieldChange={onCorrectAddressFieldChange}
        states={states ? states['US'] : {}}
        warnings={validateWarnings}
      />
    </div>
  )
}

/*
<ValidateAddressModal
  enteredAddr={ {
    address1 : values['address1'],
    address2 : values['address2'],
    city : values['city'],
    state_province : values['state_province'],
    postal_code : values['postal_code'],
  } }
  onCorrectAddressFieldChange={ this.onCorrectAddressFieldChange }
  correctAddr={ this.props.validatedAddressFields.correct_address || {} }
  states={ states ? states['US'] : {} }
  errors={this.props.validatedAddressFields.errors || ''}
  warnings={ this.props.validatedAddressFields.warnings || '' }
  id="validate-address-addressbook"
  onAccept={ event => this.onValidateAddressAccept() }
/>
*/