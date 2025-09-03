import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TimePickerAmPm from '../../_Shared/Components/TimePickerAmPm'
import Datepicker from '../../_Shared/Components/Datepicker'

const ShipConfirmOnDemand = props => {
  const [environment, setEnvironment] = useState('')
  const [ids, setIds] = useState('')
  const [product_group, setProduct_group] = useState(props.isPoReceipt ? 'ALL' : '')
  const [currentTimeIsoFormat_from, setCurrentTimeIsoFormat_from] = useState('')
  const [currentTimeShownFormat_from, setCurrentTimeShownFormat_from] = useState('')
  const [currentTimeIsoFormat_to, setCurrentTimeIsoFormat_to] = useState('')
  const [currentTimeShownFormat_to, setCurrentTimeShownFormat_to] = useState('')
  const [from_date, setFrom_date] = useState('')
  const [to_date, setTo_date] = useState('')
  const [inventory_type, setInventory_type] = useState('')
  
  function importClicked (event) {
    if (props.isPoReceipt) {
      props.settingsActions.add3PLPOReceiptOnDemand({ 
        environment, 
        product_group, 
        from_date, 
        from_time : '00:00', 
        to_date, 
        to_time : '00:00',
        ids,
        inventory_type
      }).then( resetForm ).catch( e => {} )
    } else {
      props.settingsActions.add3PLShipConfirmOnDemand({ 
        environment, product_group, from_date, from_time: currentTimeIsoFormat_from, to_date, to_time: currentTimeIsoFormat_to, ids, inventory_type
      }).then( resetForm ).catch( e => {} )
    }
  }

  function resetForm () {
    setEnvironment('')
    setIds('')
    setProduct_group(props.isPoReceipt? 'ALL': '')
    setCurrentTimeIsoFormat_from('')
    setCurrentTimeShownFormat_from('')
    setCurrentTimeIsoFormat_to('')
    setCurrentTimeShownFormat_to('')
    setFrom_date('')
    setTo_date('')
    setInventory_type('')
  }

  function onDeliveryIdsChange (event) {
    setIds(event.target.value)
  }

  function onEnvironmentChange (event) {
    setEnvironment(event.target.value)
  }

  function onProductGroupChange (event) {
    setProduct_group(event.target.value)
  }

  function inventoryTypeChange (event) {
    setInventory_type(event.target.value)
    setIds('')
  }

  function onSubmit (event) {
    event.preventDefault()
  }

  function onTimeChange_from (shownFormat_from, isoFormat_from) {
    setCurrentTimeShownFormat_from(shownFormat_from)
    setCurrentTimeIsoFormat_from(isoFormat_from)
  }

  function onDateChange_from (date) {
    setFrom_date(date)
  }

  function onTimeChange_to (shownFormat_to, isoFormat_to) {
    setCurrentTimeShownFormat_to(shownFormat_to)
    setCurrentTimeIsoFormat_to(isoFormat_to)
  }

  function onDateChange_to (date) {
    setTo_date(date)
  }

  function isImportDisabled () {
    if (!props.isPoReceipt) {
      if (!(environment && product_group) ) return true
      if (ids) return false
      if (from_date && to_date && currentTimeIsoFormat_from && currentTimeIsoFormat_to) return false
      return true
    } else {
      if (!(environment && inventory_type) ) return true
      if (ids ) return false
      if (from_date && to_date ) return false
      return true
    }
  }

  let { isPoReceipt } = props
  let is_import_disabled = isImportDisabled()  
  return (
    <div>
      <div className="col-lg-10 col-md-12">
        {
          isPoReceipt &&
          <p style={{ marginTop: '0px' }}>
            For Purchase Orders, enter a list of "TRANSACTION ID" separated by comma in the <b>Transaction IDs</b> field if you need to re-send PO Receipt of these items, or leave it blank and set <b>From Date</b> and <b>To Date</b> to re-send any type of inventory transaction between the two dates.<br/>
          Scheduler will re-send these transactions within 10/15 minutes.
          </p>          
        }
        {
          !isPoReceipt &&
          <p style={{ marginTop: '0px' }}>
            Enter a list of "DELIVERY ID" separated by comma in the <b>Delivery IDs</b> field if you need to re-send Ship Confirm of these orders, or leave it blank and set <b>From Date</b> and <b>To Date</b> to re-send Ship Confirm of any orders shipped between the two dates.<br/>
          Scheduler will re-send these Ship Confirm within 10/15 minutes.
          </p>          
        }
        <form 
          role="form" autoComplete="off" className="form-horizontal"
          onSubmit={ onSubmit }
        >
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              Environment:
            </label>
            <div className="col-md-3">
              <select 
                className="form-control"
                value={ environment }
                onChange={ onEnvironmentChange }
              >
                <option value=""></option>
                <option 
                  value="PROD"
                >
                  PROD
                </option>
                <option 
                  value="UAT"
                >
                  UAT
                </option>
                <option 
                  value="QA"
                >
                  QA
                </option>
                <option 
                  value="DEV"
                >
                  DEV
                </option>
              </select>
            </div>
          </div>
          {
            !isPoReceipt &&
            <div className="form-group">
              <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
                Product Group:
              </label>
              <div className="col-md-3">
                <select 
                  className="form-control"
                  value={ product_group }
                  onChange={ onProductGroupChange }
                >
                  <option 
                    value=""
                  >
                    
                  </option>
                  <option 
                    value="ALL"
                  >
                    ALL
                  </option>
                  <option 
                    value="NORTONCORE"
                  >
                    NORTONCORE
                  </option>
                  <option 
                    value="YELLOWBOX"
                  >
                    YELLOWBOX
                  </option>
                </select>
              </div>
            </div>
          }
          {
            isPoReceipt &&
            <div className="form-group">
              <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
                Transaction Type:
              </label>
              <div className="col-md-3">
                <select 
                  className="form-control"
                  value={ inventory_type }
                  onChange={ inventoryTypeChange }
                >
                  <option 
                    value=""
                  >
                    
                  </option>
                  <option 
                    value="PR"
                  >
                    PO Receipts
                  </option>
                  <option 
                    value="MR"
                  >
                    Miscellaneous Receipts
                  </option>
                  <option 
                    value="MI"
                  >
                    Miscellaneous Issues
                  </option>
                  <option 
                    value="ST"
                  >
                    Sub Inventory Transfers 
                  </option>
                  <option 
                    value="RR"
                  >
                    RMA Receipts
                  </option>
                </select>
              </div>
            </div>
          }
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              From Date:
            </label>
            <div className="col-md-6">
              <div style={{ float: 'left', marginRight: '10px', width: '186px !important' }}>
                <Datepicker 
                  id="scheduler-ship-conf-demand1"
                  onDateChange={ onDateChange_from }
                  dateValue={ from_date }
                  resetPickerWithDateValueGiven={ false }
                /> 
              </div>
              {
                !isPoReceipt &&
                <div style={{ float: 'left' }}>
                  <TimePickerAmPm 
                    onTimeChange={ onTimeChange_from }
                    currentTimeIsoFormat={ currentTimeIsoFormat_from }
                    currentTimeShownFormat={ currentTimeShownFormat_from }
                    id="three-pl1"
                  />  
                </div>
              }
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              To Date:
            </label>
            <div className="col-md-6">
              <div style={{ float: 'left', marginRight: '10px', width: '186px !important' }}>
                <Datepicker 
                  id="scheduler-ship-conf-demand2"
                  onDateChange={ onDateChange_to }
                  dateValue={ to_date }
                  resetPickerWithDateValueGiven={ false }
                /> 
              </div>
              {
                !isPoReceipt &&
                <div style={{ float: 'left' }}>
                  <TimePickerAmPm 
                    onTimeChange={ onTimeChange_to }
                    currentTimeIsoFormat={ currentTimeIsoFormat_to }
                    currentTimeShownFormat={ currentTimeShownFormat_to }
                    id="three-pl2"
                  />  
                </div>
              }
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              { isPoReceipt ? 'Transaction IDs:' : 'Delivery IDs:' } 
            </label>
            <div className="col-md-6">
              <textarea 
                rows="4" 
                value={ ids }
                onChange={ onDeliveryIdsChange }
                className="form-control"
              >
              </textarea>
              <button
                disabled={ is_import_disabled }
                className="btn green-soft" 
                onClick={ importClicked }
                style={{ float:'right', marginTop:'20px' }}
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

ShipConfirmOnDemand.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired,
  isPoReceipt: PropTypes.any
}

export default ShipConfirmOnDemand