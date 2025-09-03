import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { path } from 'ramda'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import * as addEditAddressActions_ from '../redux'
import OrderDetails from '../../../DetailPages/OrderDetail/_Content'
import BillingAddressReusable from '../reusables/BillingAddress'
import ShippingAddressReusable from '../reusables/ShippingAddress'
import {TopBar, AddressTitle} from '../partials'

const AddAddress = ({
  location
}) => {
  const dispatch = useDispatch()
  const addEditAddressActions = bindActionCreators(addEditAddressActions_, dispatch)
  const editAddressData = useSelector(path(['addressBook', 'addEditAddress', 'editAddressData']))
  const activeAddress = useSelector(path(['addressBook', 'allAddresses', 'activeAddress']))
  const {
    title,
    billingAddress,
    shippingAddress,
    dirty,
    id
  } = editAddressData
  const [validated, setValidated] = useState(false)

  useEffect(
    () => {
      focusCompanyField()
      initiateInputValuesForEdit()
      return () => {
        addEditAddressActions.resetReduxState()
      }
    },
    []
  )

  function initiateInputValuesForEdit () {
    const {
      id,
      title,
      is_validated,
      ship_to,
      bill_to,
    } = activeAddress
    addEditAddressActions.mergeReduxStateWith({
      editAddressData: {
        billingAddress: { ...bill_to },
        id,
        shippingAddress: { ...ship_to },
        title,
      }
    })
    setValidated(is_validated)
  }

  function focusCompanyField () {
    let node = global.$('#sh_company-ShippingAddress')
    setTimeout(
      () => {
        if( !node || !node[0] ){
          return 
        }
        node[0].focus()
      },
      0
    )
  }

  function handleSubmit () {
    let address = {
      title,
      id,
      is_validated : validated,
      ship_to : shippingAddress,
      bill_to : billingAddress
    }
    addEditAddressActions.postEditAddress(address)
  }

  function onAddressTitleChange (value) {
    addEditAddressActions.mergeReduxStateWith({
      editAddressData: {
        ...editAddressData,
        title: value,
        dirty: true
      }
    })
  }

  function onBillingFieldValueChange (field, value) {
    addEditAddressActions.mergeReduxStateWith({
      editAddressData: {
        ...editAddressData,
        billingAddress: {
          ...billingAddress,
          [field]: value
        },
        dirty: true
      }
    })
  }

  function onShippingFieldValueChange (field, value) {
    addEditAddressActions.mergeReduxStateWith({
      editAddressData: {
        ...editAddressData,
        shippingAddress: {
          ...shippingAddress,
          [field]: value
        },
        dirty: true
      }
    })
  }

  function cloneShippingAddress () {
    addEditAddressActions.mergeReduxStateWith({
      editAddressData: {
        ...editAddressData,
        billingAddress: {
          ...shippingAddress
        },
        dirty: true
      }
    })
  }

  function setValidatedAddressValues (values) {
    addEditAddressActions.mergeReduxStateWith({
      editAddressData: {
        ...editAddressData,
        shippingAddress: {
          ...shippingAddress,
          ...values
        },
        dirty: true
      }
    })
    setValidated(true)
  }

  let orderDetailVisible = location.search.includes("?orderNum=")

  const submitDisabled = !( dirty && Boolean(title) )
  return (
    <div id="edit_address">
      <div style={{ display: orderDetailVisible ? 'none' : 'block' }}>
        
        <TopBar
          submitDisabled={submitDisabled}
          handleSubmit={handleSubmit}
          title='ORDERPOINTS - ADDRESS BOOK - EDIT'
          submitLabel='SAVE'
        />

        <div className="container-page-bar-fixed" style={{ margin : '0' }}>
          <form role="form" className="form-horizontal" autoComplete="off">
            <AddressTitle
              addressTitle={title}
              onAddressTitleChange={onAddressTitleChange}
            />
            <br/><br/>
            <div className="row">
              <ShippingAddressReusable
                values={shippingAddress}
                onFieldValueChange={onShippingFieldValueChange}
                setValidatedAddressValues={setValidatedAddressValues}
              />
              <BillingAddressReusable
                values={billingAddress}
                onFieldValueChange={onBillingFieldValueChange}
                cloneShippingAddress={cloneShippingAddress}
              />
            </div>
          </form>
        </div>
      </div>
      {
        orderDetailVisible &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
    </div>
  )
}

export default withRouter(AddAddress)