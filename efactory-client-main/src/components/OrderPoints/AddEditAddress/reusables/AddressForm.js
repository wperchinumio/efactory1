import React from 'react'
import { curry, path } from 'ramda'
import { useSelector } from 'react-redux'
import Select2React from '../../../_Shared/Components/Select2React'
import TextInput from '../../../_Shared/Components/TextInput'

export default function AddressFormReusable ({
  onFieldValueChange,
  values
}) {
  const {countries, states} = useSelector( path(['common', 'globalApi', 'globalApiData']) )
  const oneOfMainCountries = ['CA', 'US', 'AU'].includes(values.country)

  return (
    <div className="address-form">
      <div className="form-group">
        <label  className="col-md-4 control-label">
          Country
        </label>
        <div className="col-sm-8">
          <Select2React 
            className="form-control"
            options={ countries ? countries : {}  }
            selected={ countries ? values['country'] : '' }
            isoFormat={true}
            onChangeHandler={curry(onFieldValueChange)('country')}
            topOptions={[ 'US', 'CA', 'AU' ]} 
          />
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">
          Company
        </label>
        <div className="col-sm-8">
          <div className="input-group">
            <TextInput
              value={values.company || ''}
              setValue={curry(onFieldValueChange)('company')}
              className="form-control"
              id={`sh_company-BillingAddress`}
            />
            <span className="input-group-addon">
              <i className="fa fa-industry" />
            </span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">
          Attention
        </label>
        <div className="col-sm-8">
          <div className="input-group">
            <TextInput
              value={values.attention || ''}
              setValue={curry(onFieldValueChange)('attention')}
              className="form-control"
            />
            <span className="input-group-addon">
              <i className="fa fa-user" />
            </span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">
          Address
        </label>
        <div className="col-sm-8">
          <TextInput
            value={values.address1 || ''}
            setValue={curry(onFieldValueChange)('address1')}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label" />
        <div className="col-sm-8">
          <TextInput
            value={values.address2 || ''}
            setValue={curry(onFieldValueChange)('address2')}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">
          City
        </label>
        <div className="col-sm-8">
          <TextInput
            value={values.city || ''}
            setValue={curry(onFieldValueChange)('city')}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">
          State:
        </label>
        <div className="col-sm-8">
          {
            oneOfMainCountries &&
            <Select2React 
              className="form-control"
              options={ states && values['country'] ? states[values['country']] : {} }
              selected={ values['state_province'] }
              isoFormat={true}
              onChangeHandler={curry(onFieldValueChange)('state_province')}
            />
          }
          {
            !oneOfMainCountries &&
            <TextInput
              value={values.state_province || ''}
              setValue={curry(onFieldValueChange)('state_province')}
              className="form-control"
            />
          }
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">Postal Code</label>
        <div className="col-sm-4">
          <TextInput
            value={values.postal_code || ''}
            setValue={curry(onFieldValueChange)('postal_code')}
            className="form-control"
            id={`sh_postal_code-BillingAddress`}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label className="col-sm-4 control-label">Phone</label>
        <div className="col-sm-8">
          <div className="input-group">
            <TextInput
              value={values.phone || ''}
              setValue={curry(onFieldValueChange)('phone')}
              className="form-control"
              id={`sh_postal_code-BillingAddress`}
            />
            <span className="input-group-addon">
              <i className="fa fa-phone" />
            </span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="col-sm-4 control-label">Email</label>
        <div className="col-sm-8">
          <div className="input-group">
            <TextInput
              value={values.email || ''}
              setValue={curry(onFieldValueChange)('email')}
              className="form-control"
              id={`sh_postal_code-BillingAddress`}
            />
            <span className="input-group-addon">
              <i className="fa fa-envelope" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}