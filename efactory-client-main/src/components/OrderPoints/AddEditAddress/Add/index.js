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
  const addAddressData = useSelector(path(['addressBook', 'addEditAddress', 'addAddressData']))
  const {
    title,
    billingAddress,
    shippingAddress,
    // dirty
  } = addAddressData
  const [validated, setValidated] = useState(false)

  useEffect(
    () => {
      focusCompanyField()
      return () => {
        addEditAddressActions.resetReduxState()
      }
    },
    []
  )

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
      is_validated : validated,
      ship_to : shippingAddress,
      bill_to : billingAddress
    }
    addEditAddressActions.postAddAddress(address).then( 
      ({ isSuccess }) => {
        if( isSuccess){
          focusCompanyField()
          setValidated(false)
        }
      }
    )
  }

  function onAddressTitleChange (value) {
    addEditAddressActions.mergeReduxStateWith({
      addAddressData: {
        ...addAddressData,
        title: value
      }
    })
  }

  function onBillingFieldValueChange (field, value) {
    addEditAddressActions.mergeReduxStateWith({
      addAddressData: {
        ...addAddressData,
        billingAddress: {
          ...billingAddress,
          [field]: value
        }
      }
    })
  }

  function onShippingFieldValueChange (field, value) {
    addEditAddressActions.mergeReduxStateWith({
      addAddressData: {
        ...addAddressData,
        shippingAddress: {
          ...shippingAddress,
          [field]: value
        }
      }
    })
  }

  function cloneShippingAddress () {
    addEditAddressActions.mergeReduxStateWith({
      addAddressData: {
        ...addAddressData,
        billingAddress: {
          ...shippingAddress
        }
      }
    })
  }

  function setValidatedAddressValues (values) {
    addEditAddressActions.mergeReduxStateWith({
      addAddressData: {
        ...addAddressData,
        shippingAddress: {
          ...shippingAddress,
          ...values
        }
      }
    })
    setValidated(true)
  }

  let orderDetailVisible = location.search.includes("?orderNum=")

  const submitDisabled = !Boolean(title)
  return (
    <div id="edit_address">
      <div style={{ display: orderDetailVisible ? 'none' : 'block' }}>
        
        <TopBar
          submitDisabled={submitDisabled}
          handleSubmit={handleSubmit}
          title='ORDERPOINTS - ADDRESS BOOK - ADD'
          submitLabel='ADD'
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