import React, { useCallback, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import history from '../../../history'
import ApproveModal from '../OrderDetail/Modal'
import EditCustomFieldsModal from './EditCustomFieldsModal'
import getDeepProperty from '../../_Helpers/getDeepProperty'
import { getAuthData } from '../../../util/storageHelperFuncs'

const RmaDetailBar = ({
  fetchRmaDetail,
  gridActions,
  gridState,
  invoiceActions,
  location: { search, pathname },
  navigationHidden,
  rma_number,
  rmaDetail,
  rmaSettingsActions,
}) => {
  const isFirstRun = useRef([true, true])
  const [navigationHidden2, setNavigationHidden2] = useState(navigationHidden)
  const [emailInput, setEmailInput] = useState('')
  
  const handleModalOpening = useCallback(
    () => {
      setTimeout( () => {
        document.getElementById('resendEmailNode').focus()
      }, 500 )
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#modal-resend').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#modal-resend').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  useEffect(
    () => {
      if (isFirstRun.current[0]) {
        isFirstRun.current[0] = false
        return
      }
      if( navigationHidden ){
        invoiceActions.setRootReduxStateProp({
          field : 'navigationHidden',
          value : false
        })
        if( !navigationHidden2 ) {
          setNavigationHidden2(true)
        }
      }
    },
    [navigationHidden]
  )

  useEffect(
    () => {
      if (isFirstRun.current[1]) {
        isFirstRun.current[1] = false
        return
      }
      let emailInput = getDeepProperty( rmaDetail, [ 'rma_header', 'shipping_address', 'email' ], '' )
      setEmailInput(emailInput)
    },
    [rmaDetail]
  )

  function reload ( event ) {
    event.preventDefault()
    fetchRmaDetail()
  }

  function print ( event ) {
    event.preventDefault()
    global.window.print()
  }

  function getCurrentMaxNumberIndex () {
    let { totalRows, fetchRowsParams, totalPages  } = gridState
    let { page_num } = fetchRowsParams
    page_num    = +page_num

    if( page_num < totalPages ){
      return page_num * 100
    }else if( page_num === totalPages ){
      return totalRows
    }
  }

  function isNavButtonDisabled ( type = '' ) {

    let { activeRowIndex, fetchRowsParams, totalRows } = gridState
    let { page_num } = fetchRowsParams
    if( !activeRowIndex ) return true

    if( !totalRows ) return true

    activeRowIndex = +activeRowIndex

    if( type === 'prev' && ( +page_num - 1 ) * 100 + 1 === activeRowIndex ){
      return true
    }

    if( type === 'next' && activeRowIndex === getCurrentMaxNumberIndex() ){
      return true
    }
    return false
  }

  function onNavButtonClicked ( type ) {
    let { activeRowIndex, rows } = gridState
    let currentArrayIndex = ( activeRowIndex % 100 !== 0 ? activeRowIndex % 100 : 100 ) - 1
    let row = rows[ currentArrayIndex + ( type === 'prev' ? -1 : +1 ) ]
    history.push(`${pathname}?rmaNum=${encodeURIComponent(row.rma_number)}&accountNum=${row.account_number}`)
    gridActions.setRootReduxStateProp_multiple({
      activeRow   : row,
      activeRowIndex : +activeRowIndex + ( type === 'prev' ? -1 : +1 )
    })
  }

  function onNextButtonClicked () {
    let disabled = isNavButtonDisabled('next')
    if( !disabled ) onNavButtonClicked('next')
  }

  function onPrevButtonClicked () {
    let disabled = isNavButtonDisabled('prev')
    if( !disabled ) onNavButtonClicked('prev')
  }

  function closeModal () {
    invoiceActions.setRootReduxStateProp({
      field : 'rmaDetail',
      value : {}
    })
    invoiceActions.setRootReduxStateProp({
      field : 'navigationHidden',
      value : false
    })
    history.push(`${pathname.startsWith('/') ? pathname : '/' + pathname }`)
  }

  function approveCancel () {
    let { rma_id } = rmaDetail.rma_header || {}
    if( rma_id ){
      invoiceActions.cancelRma( rma_id )
    }else{
      console.error(' rma_id not found for approveCancel method ')
    }
  }

  function approveResendEmail () {
    let { rma_id } = rmaDetail.rma_header || {}
    if( rma_id ){
      invoiceActions.resendEmail( rma_id, emailInput )
    }else{
      console.error(' rma_id not found for approveResendEmail method ')
    }
  }

  function approveExpireRma () {
    let { rma_id } = rmaDetail.rma_header || {}
    if( rma_id ){
      invoiceActions.expireRma( rma_id )
    }else{
      console.error(' rma_id not found for approveExpireRma method ')
    }
  }

  function approveResetAcknowledged () {
    let { rma_id } = rmaDetail.rma_header || {}
    if( rma_id ){
      invoiceActions.resetAcknowledged( rma_id )
    }else{
      console.error(' rma_id not found for approveExpireRma method ')
    }
  }

  let authData = getAuthData()
  let { activeRowIndex, fetchRowsParams } = gridState
  let { page_num: currentPagination } = fetchRowsParams
  let minNumberOfPages, maxNumberOfPages

  if( !navigationHidden2 ){
    currentPagination = currentPagination ? +currentPagination : 1
    activeRowIndex = isNaN(activeRowIndex) ? -1 : +activeRowIndex

    minNumberOfPages = ( currentPagination - 1 ) * 100 + 1
    maxNumberOfPages = getCurrentMaxNumberIndex()
  }

  let requestCancellationDisabled = rmaDetail.rma_header ? !rmaDetail.rma_header.open : true
  let requestCustomFieldsDisabled = !rmaDetail.custom_fields || rmaDetail.custom_fields.length === 0

  let {
    rma_header = {}
  } = rmaDetail

  let { acknowledged } = rma_header

  return (
    <div className="portlet-title" data-refresh-on="refresh-ui" >
      <div className="pull-left actions hidden-print" style={{ marginRight : '20px' }}>
        <a style={{ textDecoration:" none",color:" white",display:'block'}}>
          <button
            className="btn btn-transparent red btn-circle btn-sm"
            onClick={ closeModal }
          >
            Close
          </button>
        </a>
      </div>
      <div className="caption">
        <span className="caption-subject font-green-seagreen sbold" style={{paddingRight:"10px"}}>
          RMA #:
        </span>
        <span className="caption-subject font-gray sbold" style={{paddingRight:"30px"}}>
          { 
            rmaDetail.noResponse 
            ? 'RMA NOT FOUND'
            : rma_number 
              ? rma_number.toUpperCase()
              : rma_number
          }
        </span>
      </div>
      <span className="noselect">&nbsp;</span>
      <div className="actions hidden-print">
        {
          !navigationHidden2 && !rmaDetail.noResponse &&
          <span className="order-page-navigation">
            <span className="page-num text-right">
              { minNumberOfPages }
            </span>
            <button
              className="btn btn-xs btn-topbar"
              disabled={ activeRowIndex === -1 || activeRowIndex === minNumberOfPages }
              onClick={ onPrevButtonClicked }
            >
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
              <span></span>
              previous
            </button>
            <span></span>
            <span className="current-page">
              { activeRowIndex ? activeRowIndex : '' }
            </span>
            <span></span>
            <button
              className="btn btn-xs btn-topbar"
              disabled={ activeRowIndex === -1 || activeRowIndex === maxNumberOfPages }
              onClick={ onNextButtonClicked }
            >
              next
              &nbsp;
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
            <span className="page-num">
              { maxNumberOfPages }
            </span>
          </span>
        }
        <div className="btn-group ">
          <a className="btn btn-topbar btn-sm btn-circle uppercase sbold" href="#" data-toggle="dropdown">
            <i className="icon-wrench"></i>
            Actions
            <i className="fa fa-angle-down"></i>
          </a>
          <ul className="dropdown-menu pull-right ">
            <li>
              <a
                className={classNames({
                  'disabled-link disable-target' : requestCancellationDisabled
                })}
                href={ requestCancellationDisabled ? '#' : '#modal-request-cancellation' }
                data-toggle={ requestCancellationDisabled ? '' : 'modal' }
              >
                <i className="fa fa-trash-o"></i> Request Cancellation
              </a>
            </li>

            <li>
              <a 
                className={classNames({
                  'disabled-link disable-target' : requestCancellationDisabled
                })}
                href={ requestCancellationDisabled ? '#' : '#modal-expire-rma' }
                data-toggle={ requestCancellationDisabled ? '' : 'modal' }
              >
                <i className="fa fa-calendar-times-o"></i> Expire RMA
              </a>
            </li>

            <li>
              <a href="#modal-resend" data-toggle="modal">
                <i className="fa fa-envelope"></i> Re-send 'Issued RMA' Email
              </a>
            </li>

            <li>
              <a
                className={classNames({
                  'disabled-link disable-target' :requestCustomFieldsDisabled
                })}
                href={ requestCustomFieldsDisabled ? '#' : '#edit-custom-fields' }
                data-toggle={ requestCustomFieldsDisabled ? '' : 'modal' }
              >
                <i className="fa fa-edit"></i> Edit Custom Fields
              </a>
            </li>

            {
                authData && authData.user_data && authData.user_data.is_local_admin &&
              <li>
                <a 
                  className={classNames({
                    'disabled-link disable-target' : !acknowledged
                  })}
                  href={ !acknowledged ? '#' : '#modal-reset-acknowledged' }
                  data-toggle={ !acknowledged ? '' : 'modal' }
                >
                  <i className="fa fa-mail-reply"></i> Reset 'Acknowledged'
                </a>
              </li>
            }
          </ul>
        </div>
        { ' ' }
        <a
          className="btn btn-circle btn-icon-only btn-dashboard tooltips "
          onClick={ print }
        >
          <i className="icon-printer"></i>
        </a>
        { ' ' }
        <a
          className="btn btn-circle btn-icon-only btn-dashboard tooltips"
          onClick={reload}
        >
          <i className="icon-reload"></i>
        </a>
        { ' ' }
        <a className="btn btn-circle btn-icon-only btn-dashboard fullscreen " href="#">
        </a>
      </div>

      <ApproveModal
        modalContent={'Are you sure you want to cancel this RMA?'}
        onApprove={ approveCancel }
        id="modal-request-cancellation"
      />

      <ApproveModal
        modalContent={'Are you sure you want to expire this RMA?'}
        onApprove={ approveExpireRma }
        id="modal-expire-rma"
      />

      <ApproveModal
        modalContent={'Are you sure you want to reset \'Acknowledged\'?'}
        onApprove={ approveResetAcknowledged }
        id="modal-reset-acknowledged"
      />

      <ApproveModal
        onApprove={ approveResendEmail }
        id="modal-resend"
        buttonApproveTitle={'SEND'}
      >
        <div className="col-md-12" style={{ padding : '0' }}>
          <label className="control-label">Re-send 'Issued RMA' Email</label>
          <input
            className="form-control input-md"
            spellCheck="false"
            id="resendEmailNode"
            value={ emailInput }
            style={{ marginBottom : '10px' }}
            onChange={ event => setEmailInput(event.target.value) }
          />
        </div>
      </ApproveModal>

      <EditCustomFieldsModal 
        rmaSettingsActions={ rmaSettingsActions }
        invoiceActions={ invoiceActions }
        rmaDetail={ rmaDetail }
      />

    </div>
  );
}

RmaDetailBar.propTypes = {
  activeRowIndex    : PropTypes.any,
  currentPagination : PropTypes.any,
  fetchRmaDetail    : PropTypes.func,
  gridActions       : PropTypes.object.isRequired,
  rmaSettingsActions        : PropTypes.object.isRequired,
  invoiceActions    : PropTypes.object.isRequired,
  rma_number        : PropTypes.string,
  rmaDetail         : PropTypes.shape({
    rma_header: PropTypes.shape({
      rma_id: PropTypes.any,
      acknowledged : PropTypes.any,
      is_draft: PropTypes.any,
      open: PropTypes.any,
      rma_number: PropTypes.any,
      original_account_number: PropTypes.any,
      original_order_number: PropTypes.any,
      account_number: PropTypes.any,
      location: PropTypes.any,
      shipping_account_number: PropTypes.any,
      shipping_warehouse: PropTypes.any,
      shipping_address: PropTypes.shape({
        company: PropTypes.any,
        attention: PropTypes.any,
        address1: PropTypes.any,
        address2: PropTypes.any,
        email: PropTypes.any,
        phone: PropTypes.any,
        city: PropTypes.any,
        state_province: PropTypes.any,
        postal_code: PropTypes.any,
        country: PropTypes.any
      }),
      customer_number: PropTypes.any,
      freight_account: PropTypes.any,
      consignee_number: PropTypes.any,
      comments: PropTypes.any,
      rma_type_name: PropTypes.any,
      disposition_name: PropTypes.any,
      rma_type_code: PropTypes.any,
      disposition_code: PropTypes.any,
      international_code: PropTypes.any,
      order_subtotal: PropTypes.any,
      shipping_handling: PropTypes.any,
      sales_tax: PropTypes.any,
      international_handling: PropTypes.any,
      total_due: PropTypes.any,
      amount_paid: PropTypes.any,
      net_due_currency: PropTypes.any,
      balance_due_us: PropTypes.any,
      international_declared_value: PropTypes.any,
      insurance: PropTypes.any,
      return_weight_lb: PropTypes.any,
      shipping_carrier: PropTypes.any,
      shipping_service: PropTypes.any,
      shipping_instructions: PropTypes.any,
      payment_type: PropTypes.any,
      terms: PropTypes.any,
      fob: PropTypes.any,
      packing_list_type: PropTypes.any,
      webservices: PropTypes.any,
      testmode: PropTypes.any,
      om_number: PropTypes.any,
      po_number: PropTypes.any,
      rma_date: PropTypes.any,
      expired_date: PropTypes.any,
      return_label_url: PropTypes.any,
      return_label_tracking_number: PropTypes.any,
      tr: PropTypes.any,
      trl: PropTypes.any,
      replacement_order_number: PropTypes.any,
      cancelled_by: PropTypes.any,
      cancelled_date: PropTypes.any,
      last_receipt_date: PropTypes.any,
      user_id: PropTypes.any,
      issue_email_sent_at: PropTypes.any,
      receive_email_sent_at: PropTypes.any,
      shipped_email_sent_at: PropTypes.any,
      cancel_email_sent_at: PropTypes.any,
      row_id: PropTypes.any
    }),
    custom_fields : PropTypes.arrayOf( PropTypes.shape({
      title : PropTypes.string,
      value : PropTypes.string,
      type  : PropTypes.string
    }) ),
    charts : PropTypes.arrayOf( PropTypes.shape({
      title: PropTypes.any,
      value: PropTypes.any,
      list: PropTypes.arrayOf( PropTypes.shape({
        period: PropTypes.any,
        qty: PropTypes.any,
      }) )
    }) ),
    to_receive : PropTypes.arrayOf( PropTypes.shape({
      detail_id: PropTypes.any,
      line_number: PropTypes.any,
      item_number: PropTypes.any,
      description: PropTypes.any,
      quantity: PropTypes.any,
      serialnumber: PropTypes.any,
      voided: PropTypes.any,
      received_quantity: PropTypes.any,
      received_serialnumber: PropTypes.any,
      received_date: PropTypes.any,
      cancelled_date: PropTypes.any,
      last_status: PropTypes.any,
    }) ),
    to_ship : PropTypes.arrayOf( PropTypes.shape({
      detail_id: PropTypes.any,
      line_number: PropTypes.any,
      item_number: PropTypes.any,
      description: PropTypes.any,
      quantity: PropTypes.any,
      unit_price: PropTypes.any,
      voided: PropTypes.any,
      do_not_ship_before: PropTypes.any,
      ship_by: PropTypes.any,
      comments: PropTypes.any,
      custom_field1: PropTypes.any,
      custom_field2: PropTypes.any,
      custom_field5: PropTypes.any,
    }) ),
    om_details: PropTypes.array,
  }),
  navigationHidden  : PropTypes.bool,
  loadedRmaDetail : PropTypes.any
}

export default withRouter(RmaDetailBar)