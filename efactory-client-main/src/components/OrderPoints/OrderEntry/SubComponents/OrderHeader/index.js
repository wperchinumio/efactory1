import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import formatOrderId from '../../../../_Helpers/FormatOrderId'
import { getUserData } from '../../../../../util/storageHelperFuncs'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import { connect } from 'react-redux'
momentLocalizer(moment)

const OrderHeader = props => {
  const onlyAccount = useRef(null)
  const firstRun = useRef([true, true, true])
  useEffect(
    () => {
      if (onlyAccount.current) {
        setOnlyAccountSelected()
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (props.dirty && !props.updateOrderFailed) {
        props.reviewActions.setDirty(true)
      }
    },
    [props.dirty]
  )

  let { accountNumberLocation = '' } = props.orderHeader || {}

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (accountNumberLocation) {
        accountNumberLocation = accountNumberLocation.replace(/\.[A-Za-z_]+/,'')
        if (accountNumberLocation) {
          let calc_account_regions = getUserData('calc_account_regions') || {}
          let calc_account_regions_keys = Object.keys( calc_account_regions )
          calc_account_regions_keys = calc_account_regions_keys.filter( key => key.includes( accountNumberLocation ))
          if (!calc_account_regions_keys.length) {
            props.reviewActions.setRootReduxStateProp({
              field: 'orderHeader',
              value: {
                ...props.orderHeader,
                accountNumberLocation: ''
              }
            })
          }
        }
      }
    },
    [accountNumberLocation]
  )

  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      if (props.newOrderInitialized && onlyAccount.current) {
        setOnlyAccountSelected()
        props.reviewActions.newOrderInitialized(false)
      }
    },
    [props.newOrderInitialized]
  )

  function cartHasItems () {
    let { order_detail = [] } = props
    return order_detail.length > 0
  }

  function setOnlyAccountSelected () {
    let { setRootReduxStateProp } = props.reviewActions
    setRootReduxStateProp({
      field: 'orderHeader',
      value: {
        ...props.orderHeader,
        accountNumberLocation: onlyAccount.current
      }
    })
  }

  function handleLocationAccountChange (newValue) {
    let { reviewActions } = props
    if (cartHasItems()) {
      reviewActions.setRootReduxStateProp_multiple({
        nextLocationAccount : newValue
      }).then( () => {
        global.$('#confirm-location-account-change').modal('show')
      } )
    }else{
      let { orderHeader } = props
      reviewActions.setRootReduxStateProp_multiple({
        orderHeader : {
          ...orderHeader,
          accountNumberLocation: newValue
        },
        dirty: true
      })
    }
  }

  function setOrderedDateValue (dateObj) {
    let { orderHeader, reviewActions } = props
    reviewActions.setRootReduxStateProp_multiple({
      orderHeader : {
        ...orderHeader,
        ordered_date: moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
      },
      dirty: true
    })
  }

  function generateOrderNumber (event) {
    props.reviewActions.generateOrderNumber().then(
      () => {  
        setTimeout( () => { global.$('#order-number-to-focus')[0].focus() }, 50 )
      }
    ).catch( () => {} )
  }

  function createAccounts () {
    let accounts = []
    let firstAccount
    let calc_account_regions = getUserData('calc_account_regions') || {}
    let calc_account_regions_keys = Object.keys( calc_account_regions )
    calc_account_regions_keys.sort( (a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    calc_account_regions_keys.forEach( accountObj => {
      firstAccount = accountObj
      accounts.push(
        <option key={accountObj} value={accountObj}>
          { calc_account_regions[accountObj] }
        </option>
      )
    })

    if (accounts.length === 1) {
      onlyAccount.current = firstAccount
    }

    let { accountNumberLocation } = props.orderHeader

    if (!accountNumberLocation) {
      accountNumberLocation = ''
    }

    return <select
      name="accountNumberLocation"
      className="form-control input-sm"
      value={ accountNumberLocation }
      onChange={ event => handleLocationAccountChange( event.target.value ) }
    >
      {
        accounts.length !== 1 &&
        <option value=""></option>
      }
      {
        accounts
      }
    </select>
  }

  function onInputValueChange (event) {
    let { value, name } = event.target
    let { orderHeader, reviewActions } = props
    reviewActions.setRootReduxStateProp_multiple({
      orderHeader : {
        ...orderHeader,
        [name]: value
      },
      dirty : true
    })
  }

  let {
    entryPageType, 
    activeEditedDraftId, 
    orderHeader,
    orderSettings = {},
  } = props

  let orderLabel = '', displayedOrderId = ''
  switch( entryPageType) {
    case 'create_new':
      orderLabel = 'New Order'
      break
    case 'edit_order':
      orderLabel = 'Order #:'
      displayedOrderId = orderHeader.order_number
      break;
    case 'edit_template':
      orderLabel = 'Template #:'
      displayedOrderId = formatOrderId(activeEditedDraftId, true)
      break
    case 'edit_draft':
      orderLabel = 'Draft #:'
      displayedOrderId = formatOrderId(activeEditedDraftId, false)
      break
    default:
  }

  let {
    ordered_date,
    order_number,
    customer_number,
    po_number,
    order_status,
    shipping_instructions,
    packing_list_comments
  } = orderHeader

  return (
    <div className="col-lg-6 col-md-12">
      <div className="shipping">
        <div className="addr-type"><i className="fa fa-book"></i> ORDER HEADER
          <div className="pull-right order-type">
            <span className="order-type-number">
              { orderLabel }
            </span>
            { ' ' }
            { displayedOrderId }
          </div>
        </div>
        <div className="form-group padding-5" style={{marginBottom: "3px"}}>
          <div className="row">
            <div className="col-md-6">
              <label
                className={classNames({
                  'control-label': true,
                  'label-req' : !orderHeader.accountNumberLocation
                })}
              >
                Account # - Warehouse:
              </label>
              {
                props.entryPageType === 'edit_order'
                ?
                <input 
                  name="accountNumberLocation"
                  type="text"
                  value={ accountNumberLocation ? accountNumberLocation : '' }
                  onChange={ onInputValueChange }
                  disabled={ entryPageType === 'edit_order' }
                  className="form-control input-sm"
                />
                :
                createAccounts()
              }
            </div>
            <div className="col-md-6">
              <label 
                className={ classNames({
                  'control-label': true,
                  'label-req' : !order_number && orderSettings.manual === true 
                })}
              >
                Order #:
              </label>
              <div 
                className={ 
                  orderSettings.manual === false 
                  ? 'input-group' 
                  : '' 
                }
              >
                <input 
                  type="text"
                  name="order_number"
                  value={ order_number ? order_number : '' }
                  onChange={ onInputValueChange }
                  disabled={entryPageType === 'edit_order'}
                  id="order-number-to-focus"
                  className={ classNames({
                    'form-control input-sm' : true,
                    'input-default' : entryPageType !== 'edit_order' && orderSettings.manual === false
                  })}
                />
                {
                  orderSettings.manual === false
                  &&
                  <span className="input-group-btn">
                    <button 
                      className="btn btn-topbar btn-sm" 
                      disabled={ order_number }
                      onClick={ generateOrderNumber }
                      type="button" 
                      title="Assign Next Order #" 
                      style={{padding: "6px 8px"}}
                    >
                      <i 
                        className="fa fa-angle-double-right" 
                        style={{ fontSize: '14px' }}
                      ></i> 
                    </button>
                  </span>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="control-label">Customer #:</label>
              <div className="">
                <input 
                  name="customer_number"  
                  value={ customer_number ? customer_number : '' }
                  onChange={ onInputValueChange }
                  type="text" 
                  className="form-control input-sm"
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="control-label">PO #:</label>
              <div className="">
                <input 
                  name="po_number"  
                  value={ po_number ? po_number : '' }
                  onChange={ onInputValueChange }
                  type="text" 
                  className="form-control input-sm"
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="control-label">Order Status:</label>
              <div className="input-group">
              <span className="input-group-addon">
                <i className="fa fa-tachometer"></i>
              </span>
                <select 
                  name="order_status"
                  value={ order_status ? order_status : '' }
                  onChange={ onInputValueChange }
                  className="form-control input-sm"
                >
                  <option value="0">On Hold</option>
                  <option value="1">Normal</option>
                  <option value="2">Rush</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label className="control-label">PO Date:</label>
              <DatePicker
                format="MM/DD/YYYY"
                name="ordered_date"
                onChange={ dateObj => setOrderedDateValue(dateObj) }
                time={false}
                value={ ordered_date ? moment(ordered_date).toDate()  : moment().toDate() }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="control-label">Shipping Instructions:</label>
              <textarea 
                value={ shipping_instructions ? shipping_instructions : '' }
                onChange={ onInputValueChange }
                name="shipping_instructions" 
                className="form-control input-sm" 
                rows="6"
              />
            </div>
            <div className="col-md-6">
              <label className="control-label">Comments:</label>
              <textarea 
                value={ packing_list_comments ? packing_list_comments : '' }
                onChange={ onInputValueChange }
                name="packing_list_comments" 
                className="form-control input-sm" 
                rows="6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OrderHeader.propTypes = {
  name: PropTypes.string,
  entryPageType: PropTypes.oneOf([ 'create_new', 'edit_order', 'edit_template', 'edit_draft' ]),
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    entryPageType: state.orderPoints.entry.entryPageType,
    orderHeader: state.orderPoints.entry.orderHeader,
    activeEditedDraftId: state.orderPoints.entry.activeEditedDraftId,
    updateOrderFailed: state.orderPoints.entry.updateOrderFailed,
    order_detail: state.orderPoints.entry.order_detail,
    newOrderInitialized: state.orderPoints.entry.newOrderInitialized,
    orderSettings: state.orderPoints.settings.opSettingsData 
                            ? state.orderPoints.settings.opSettingsData.order 
                              ? state.orderPoints.settings.opSettingsData.order 
                              : {}
                            : {}
  })
)(OrderHeader)