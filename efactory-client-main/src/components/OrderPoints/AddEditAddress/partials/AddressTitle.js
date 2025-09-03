import React from 'react'
import TextInput from '../../../_Shared/Components/TextInput'

export default function AddressTitle ({
  addressTitle,
  onAddressTitleChange
}) {
  return (
    <div className="row">
      <div className="col-md-10">
        <label>
          Address Title
        </label>
        <div className="input-group">
          <span className="input-group-addon">
            <i className="fa fa-bookmark" />
          </span>
          <TextInput
            value={addressTitle || ''}
            setValue={onAddressTitleChange}
            className="form-control"
            placeholder="Assign a name to this Shipping &amp; Billing Address combination"
          />
        </div>
      </div>
    </div>
  )
}