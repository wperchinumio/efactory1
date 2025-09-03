import React from 'react'
import AddressForm from './AddressForm'

export default function BillingAddressReusable ({
  cloneShippingAddress,
  onFieldValueChange,
  values
}) {
  return (
    <div className="col-lg-5 col-md-12">
      <div>
        <div>
          <span className="font-blue-soft" style={{ fontWeight : '600' }} >
            Billing Address
          </span>
        </div>
        <hr className="border-grey-salsa" style={{ marginTop : '0px' }} />
        <div style={{ height : '50px' }}>
          <div className="pull-right">
            <button
              type="button"
              className="btn green-soft btn-sm"
              id="clone-address"
              onClick={ cloneShippingAddress }
            >
              Copy Shipping Address
            </button>
          </div>
        </div>
        <AddressForm
          onFieldValueChange={onFieldValueChange}
          values={values}
        />
      </div>
    </div>
  )
}