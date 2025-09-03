import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { getUserData } from '../../../../../util/storageHelperFuncs'
import Select2React from '../../../../_Shared/Components/Select2React'
import rmaConfig from '../../../Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'

const RmaHeader = props => {
  const firstRun = useRef([true, true])
  const onlyAccountsRef = useRef(null)
  const rmaNumberNode = useRef(null)

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (props.newRmaClicked) {
        initializeComponent()
      }
    },
    [props.newRmaClicked]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (props.entryPageType === 'new_rma') {
        initializeComponent()
      }
    },
    [props.rmaSettingsData]
  )

  /*
    this method is needed to reinitialize when 'new order'
    button is clicked
  */
  function initializeComponent () {
    if (onlyAccountsRef.current) {
      if (onlyAccountsRef.current['receive']) {
        props.rmaEntryActions.setRmaHeaderValue({ 
          field: 'accountReceivingWarehouse',
          value: onlyAccountsRef.current['receive']
        })
      }
    }
  }

  function createOptions () {
    let { custom_fields = [] } = props.rmaSettingsData
    let { rmaHeader } = props
    return custom_fields.map( ( customField, cIndex ) => {
      let {
        index,
        list,
        required,
        title,
        type
      } = customField
      let listObject = {}
      if (type === 'selection') {
        list.forEach( l => {
          if (l.includes('||')) {
            l = l.split('||')
            listObject[ l[0] ] = l[1]
          }else{
            listObject[ l ] = l
          }
        })
      }
      let field = `option${index}`
      let value = rmaHeader[ field ] ? rmaHeader[ field ] : ''

      return (
        <div
          className="col-md-6"
          key={ `custom-op-key-${index}` }
        >
          <label className={classNames({
            'control-label': true,
            'label-req' : !value && required
          })}>
            { `${title}:` }
          </label>
          <div className="">
            {
              type === 'text' ?
                <input
                  type="text"
                  className="form-control input-sm"
                  value={ value }
                  onChange={ event => handleInputChange( field , event.target.value ) }
                />
              :
                <Select2React
                  className="form-control imput-sm"
                  options={ listObject }
                  selected={ value }
                  onChangeHandler={ value => handleInputChange( field , value ) }
                  height="30px"
                  placeholder="Select... "
                />
            }
          </div>
        </div>
      )
    })
  }

  function isToShipButtonBlue (rma_type_received) {
    let { rma_type }      = props.rmaHeader
    rma_type = rma_type_received !== undefined ? rma_type_received : rma_type
    let isRmaTypeSelected = rma_type ? true : false
    return  isRmaTypeSelected 
            ? rmaConfig[ rma_type ][1][1] 
              ? true 
              : false 
            : false
  }

  function isToReceiveButtonBlue (rma_type_received) {
    let { rma_type }      = props.rmaHeader
    rma_type = rma_type_received !== undefined ? rma_type_received : rma_type
    let isRmaTypeSelected = rma_type ? true : false
    return  isRmaTypeSelected 
            ? rmaConfig[ rma_type ][1][0] 
              ? true 
              : false 
            : false
  }

  function createAccounts (type = 'receive') { // type also can be 'ship'
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
    let { rmaHeader = {} } = props
    if (accounts.length === 1) {
      onlyAccountsRef.current = onlyAccountsRef.current ? onlyAccountsRef.current : {}
      onlyAccountsRef.current[type] = firstAccount
    }
    let value, field
    if (type === 'receive') {
      let { accountReceivingWarehouse = '' } = rmaHeader
      value = accountReceivingWarehouse ? accountReceivingWarehouse : ''
      field = 'accountReceivingWarehouse'
    }else if (type === 'ship' ) {
      let { accountShippingWarehouse = '' } = rmaHeader
      value = accountShippingWarehouse ? accountShippingWarehouse : ''
      field = 'accountShippingWarehouse'
    }
    let toShipButtonBlue = isToShipButtonBlue()

    return (
      <select
        className="form-control input-sm"
        disabled={ type === 'ship' ? !toShipButtonBlue : false }
        value={ accounts.length === 1 &&
                !(type === 'ship' && !toShipButtonBlue)  
                ? firstAccount 
                : value 
              }
        onChange={ event => handleInputChange( field, event.target.value ) }
      >
        {
          (
            accounts.length !== 1  ||
            (type === 'ship' && !toShipButtonBlue)
          ) &&
          <option value=""></option>
        }
        { accounts }
      </select>
    )
  }

  function handleInputChange (field, value) {
    let { setRmaHeaderValue, setRootReduxStateProp, updateCartAsRmaTypeChange } = props.rmaEntryActions
    setRmaHeaderValue({ field, value })
    if (field === 'rma_type' && value) {
      if (isToShipButtonBlue( value )) {
        if (onlyAccountsRef.current && onlyAccountsRef.current['ship']) {
          setRmaHeaderValue({ field : 'accountShippingWarehouse', value : onlyAccountsRef.current['ship'] })  
        }
      }else{
        setRmaHeaderValue({ field : 'accountShippingWarehouse', value : '' })  
      }

      if (!isToReceiveButtonBlue( value )) {
        setRmaHeaderValue({ field : 'disposition', value : '' })
      }

      let { to_ship, to_receive } = props.rma_detail
      updateCartAsRmaTypeChange({ newRmaType : value, to_ship, to_receive })
    }

    if (field === 'rma_type' && !value) {
      setRmaHeaderValue({ field : 'accountShippingWarehouse', value : '' })
      setRmaHeaderValue({ field : 'disposition', value : '' })
    }

    if (!props.dirty) {
      setRootReduxStateProp({ field : 'dirty', value : true })
    }
  }

  function generateRmaNumber (event) {
    props.rmaEntryActions.generateRmaNumber().then(
      () => {
        setTimeout(
          () => rmaNumberNode.current.focus(),
          50
        )
      }
    ).catch(() => {})
  }

  let {
    rmaHeader,
    rmaSettingsData,
    entryPageType,
    rma_id
  } = props
  let {
    rma_types = [],
    dispositions = []
  } = rmaSettingsData
  let {
    rma_number = '',
    rma_type = '',
    disposition = ''
  } = rmaHeader
  let rmaHeaderTitle = ''
  let rmaHeaderNumber = ''
  switch( entryPageType) {
    case 'new_rma':
      rmaHeaderTitle = 'NEW RMA'
      rmaHeaderNumber = ''
      break
    case 'edit_rma':
      rmaHeaderTitle = 'RMA #:'
      rmaHeaderNumber = rma_number
      break
    case 'edit_draft':
      rmaHeaderTitle = 'DRAFT #:'
      rmaHeaderNumber = 'D' + ( String(rma_id).length > 4 ? rma_id : '0'.repeat( 4 - String(rma_id).length ) + rma_id )
      break
    default:
      break
  }

  let isRmaTypeSelected = rma_type ? true : false
  let isAuthButtonRed = false
  if (isRmaTypeSelected) {
    isAuthButtonRed = rmaConfig[ rma_type ][1][0] ? true : false
  }
  let toShipButtonBlue = false
  if (isRmaTypeSelected) {
    toShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
  }
  return (
    <div className="col-lg-6 col-md-12">
      <div className="shipping">
        <div className="addr-type"><i className="fa fa-book"></i> RMA
          <div className="pull-right order-type">
            <span className="order-type-number">
              { rmaHeaderTitle }
            </span>
            { ' ' }
            { rmaHeaderNumber }
          </div>
        </div>
        <div className="form-group padding-5" style={{marginBottom: "3px"}}>
          <div className="row">
            <div className="col-md-4">
              <label className={classNames({
                'control-label': true,
                'label-req' : !rmaHeader.accountReceivingWarehouse
              })}>Account # - RMA WH:</label>
              {
                createAccounts('receive')
              }
            </div>
            <div className="col-md-8">
              <label className={classNames({
                       'control-label': true,
                       'label-req' : !rma_type
              })}>RMA Type:</label>
              <div className="input-group">
                <span className="input-group-addon" style={{padding: "6px", minWidth:"50px", textAlign: "right"}}>
                  <span style={{fontSize: "10px"}}>
                    <i className={ classNames({
                      'fa fa-arrow-down' : true,
                      'font-grey-salsa': !rma_type,
                      'font-red-soft' : rma_type && rmaConfig[ rma_type ][1][0],
                      'font-dark' : rma_type && !rmaConfig[ rma_type ][1][0]
                    }) }></i>&nbsp;
                    <i className={ classNames({
                      'fa fa-arrow-up' : true,
                      'font-grey-salsa': !rma_type || !rmaConfig[ rma_type ][1][1],
                      'font-blue-soft' : rma_type && rmaConfig[ rma_type ][1][1]
                    }) }></i>
                  </span>&nbsp;&nbsp;<span style={{fontWeight: 900}}>T</span>
                </span>
                <select
                  className="form-control input-sm"
                  value={ rma_type ? rma_type : '' }
                  onChange={ event => handleInputChange( 'rma_type', event.target.value ) }
                >
                  <option value=""></option>
                  {
                    rma_types.map( rmaType => {
                      let { code, title } = rmaType
                      return (
                        <option
                          value={ code }
                          key={`rma-type-key-opt-${code}`}
                        >
                          { `${ code } - ${ title } ` }
                        </option>
                      )
                    } )
                  }
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <label
                className={classNames('control-label',{
                  'label-req' : !rmaHeader.accountShippingWarehouse && toShipButtonBlue
                })}
              >
                Account # - Ship WH:
              </label>
              { createAccounts('ship') }
            </div>
            <div className="col-md-8">
              <label className={classNames({
                'control-label': true,
                'label-req' : !disposition && isAuthButtonRed
              })}>Disposition:</label>
              <div className="input-group">
                <span className="input-group-addon" style={{padding: "6px", minWidth:"50px", textAlign: "right"}}>
                  <span style={{fontWeight: 900}}>D</span>
                </span>
                <select
                  className="form-control input-sm"
                  value={ disposition ? disposition : '' }
                  disabled={ !isAuthButtonRed }
                  onChange={ event => handleInputChange( 'disposition', event.target.value ) }
                >
                  <option value=""></option>
                  {
                    dispositions.map( disposition => {
                      let { code, title } = disposition
                      return (
                        <option
                          value={ code }
                          key={`rma-type-key-opt-${code}`}
                        >
                          { `${ code } - ${ title } ` }
                        </option>
                      )
                    } )
                  }
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className={classNames({
                'control-label': true,
                'label-req' : !rma_number && rmaSettingsData.general.auto_number.manual === true
              })}>RMA #:</label>
              <div className={ rmaSettingsData.general.auto_number.manual === false ? 'input-group' : '' }>
                <input
                  type="text"
                  className={classNames({
                    'form-control input-sm' : true,
                    'input-default' : entryPageType !== 'edit_rma' &&  rmaSettingsData.general.auto_number.manual === false
                  })}
                  maxLength={25}
                  ref={rmaNumberNode}
                  value={ rma_number ? rma_number : '' }
                  onChange={ event => handleInputChange( 'rma_number', event.target.value ) }
                />
                {
                  rmaSettingsData.general.auto_number.manual === false &&
                  <span className="input-group-btn">
                    <button 
                      className="btn btn-topbar btn-sm" 
                      disabled={ rma_number }
                      onClick={ generateRmaNumber }
                      type="button" 
                      title="Assign Next RMA #" 
                      style={{padding: "6px 8px"}}
                    ><i className="fa fa-angle-double-right" style={{fontSize: "14px"}}></i> 
                    </button>
                  </span>
                }
              </div>
            </div>
            { createOptions() }
          </div>
        </div>
      </div>
    </div>
  )
}

RmaHeader.propTypes = {
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
    custom_fields: PropTypes.array, // detailed on Options component
    rma_types: PropTypes.arrayOf( PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }) ),
    dispositions: PropTypes.arrayOf( PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }) )
  })
}

export default connect(
  state => ({
    dirty: state.returnTrak.entry.dirty,
    rmaSettingsData: state.returnTrak.settings.rmaSettingsData,
    rmaHeader: state.returnTrak.entry.rmaHeader,
    rma_detail: state.returnTrak.entry.rma_detail,
    entryPageType: state.returnTrak.entry.entryPageType,
    savedEntry: state.returnTrak.entry.savedEntry,
    rma_id: state.returnTrak.entry.rma_id,
    newRmaClicked: state.returnTrak.entry.newRmaClicked
  })
)(RmaHeader)