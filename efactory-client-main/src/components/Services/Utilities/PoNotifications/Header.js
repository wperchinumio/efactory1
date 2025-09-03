import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import classNames from 'classnames'
import { getUserData } from '../../../../util/storageHelperFuncs'
momentLocalizer(moment)

const PoHeader = props => {
  const firstRun = useRef(true)
  const onlyAccountRef = useRef(null)

  useEffect(
    () => {
      if (onlyAccountRef.current) {
        props.poActions.setRootReduxStateProp_multiple({
          account_number: onlyAccountRef.current.replace(/\.\w+/,'') ,
          location: onlyAccountRef.current.replace(/[0-9]+\./,'')
        })
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.po.new_po_notification && onlyAccountRef.current) {
        props.poActions.setRootReduxStateProp_multiple({
          account_number: onlyAccountRef.current.replace(/\.\w+/,'') ,
          location: onlyAccountRef.current.replace(/[0-9]+\./,''),
          new_po_notification: false
        })
      }
    },
    [props.po.new_po_notification]
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

    if (accounts.length === 1 && ( !onlyAccountRef.current || props.po.new_po_notification )){
      onlyAccountRef.current = firstAccount 
    }
    
    let { account_number, location = '' } = props.po
    let accountWarehouse                  = account_number && location ? `${account_number}.${location}` : ''
    return (
      <select
        className="form-control input-sm"
        value={ accounts.length === 1 ? firstAccount : accountWarehouse }
        onChange={ handleAccountWhChange }
      >
        {
          accounts.length !== 1 &&
          <option value=""></option>
        }
        { accounts }
      </select>
    )
  }

  function handleAccountWhChange (event) {
    let selected = event.target.value
    if (!selected) {
      props.poActions.setRootReduxStateProp_multiple({
        account_number: '',
        location: '',
        form_dirty: true
      })
    } else {
      props.poActions.setRootReduxStateProp_multiple({
        account_number: selected.replace(/\.\w+/,'') ,
        location: selected.replace(/[0-9]+\./,''),
        form_dirty: true
      })
    }
  }

  function handleDateFieldInput (field, dateObj) {
    let date = moment(  
      dateObj ? dateObj : new Date()
    ).format('YYYY-MM-DD')
    props.poActions.setRootReduxStateProp_multiple({
      [field]: date,
      form_dirty: true
    })
  }

  function onInputFieldChanged (event) {
    props.poActions.setRootReduxStateProp_multiple({
      [event.target.name]: event.target.value,
      form_dirty: true
    }) 
  }

  let {
    reference_transaction_number = '',
    reference_order_number = '',
    order_date = '',
    expected_delivery_date = '',
    account_number,
    location
  } = props.po

  return (
    <div className="col-lg-6 col-md-12">
      <div className="shipping">
        <div className="addr-type"><i className="fa fa-book"></i> PO NOTIFICATIONS
        </div>
        <div className="form-group padding-5" style={{marginBottom: "3px"}}>
          <div className="row">
            <div className="col-md-6">
              <label 
                className={ classNames({
                  'control-label' : true,
                  'label-req' : !account_number && !location
                }) }
              >
                Account # - Warehouse:
              </label>
              { createAccounts() }
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label 
                className={ classNames({
                  'control-label' : true,
                  'label-req' : !reference_transaction_number
                }) }
              >Ref. Transaction #:</label>
              <input 
                type="text" 
                className="form-control input-sm" 
                value={ reference_transaction_number ? reference_transaction_number : '' }
                name="reference_transaction_number"
                onChange={ onInputFieldChanged }
              />
            </div>
            <div className="col-md-6">
              <label 
                className={ classNames({
                  'control-label' : true,
                  'label-req' : !reference_order_number
                }) }
              >Ref. Purchase Order #:</label>
              <input 
                type="text" 
                className="form-control input-sm" 
                value={ reference_order_number ? reference_order_number : '' }
                name="reference_order_number"
                onChange={ onInputFieldChanged }
              />
            </div>
            <div className="col-md-6">
              <label 
                className={ classNames({
                  'control-label' : true,
                  'label-req' : !expected_delivery_date
                }) }
              >
                Expected at DCL:
              </label>
              <DatePicker
                format="MM/DD/YYYY"
                name="expected_delivery_date"
                onChange={ dateObj => handleDateFieldInput( 'expected_delivery_date', dateObj) }
                time={false}
                value={expected_delivery_date ? moment(expected_delivery_date).toDate()  : moment().toDate()}
              />
            </div>
            <div className="col-md-6">
              <label 
                className={ classNames({
                  'control-label' : true,
                  'label-req' : !order_date
                }) }
              >
                Order Date:
              </label>
              <DatePicker
                format="MM/DD/YYYY"
                name="order_date"
                onChange={ dateObj => handleDateFieldInput( 'order_date', dateObj) }
                time={false}
                value={ order_date ? moment(order_date).toDate()  : moment().toDate() }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PoHeader.propTypes = {
  name: PropTypes.string,
  po: PropTypes.shape({
    account_number: PropTypes.string,
    location: PropTypes.string,
    reference_transaction_number: PropTypes.string,
    reference_order_number: PropTypes.string,
    order_date: PropTypes.string,
    expected_delivery_date: PropTypes.string,
    lines: PropTypes.array
  }),
  poActions: PropTypes.object.isRequired
}

export default PoHeader