import React, { useCallback, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import history from '../../../history'
import ApproveModal from './Modal'
import { getUserData } from '../../../util/storageHelperFuncs'
import { useForceUpdate } from '../../_Shared/hooks'

const OrderDetailBar = ({
  fetchOrderDetail,
  hideActions,
  gridActions,
  gridState,
  invoiceActions,
  isShowOriginal,
  location: { search, pathname },
  navigationHidden,
  onCloseModalClicked,
  onShowEdiDocClicked,
  onShowOriginalToggled,
  isShowOriginal_toggled,
  orderDetail,
  order_number,
  reviewActions,
  RMAEntryActions,
}) => {
  const isFirstRun = useRef([true, true])
  const put_on_hold_node = useRef(null)
  const transfer_order_node = useRef(null)
  const [activeModalType, setActiveModalType] = useState()
  const [approveModalContent, setApproveModalContent] = useState('')
  const [putOnHoldReason, setPutOnHoldReason] = useState('')
  const [putOnHoldSucceeded, setPutOnHoldSucceeded] = useState(false)
  const [putOffHoldSucceeded, setPutOffHoldSucceeded] = useState(false)
  const [requestCancellationDisabled, setRequestCancellationDisabled] = useState(false)
  const [navigationHidden2, setNavigationHidden2] = useState(navigationHidden)
  const [orderNumber, setOrderNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ship_to_email, setShip_to_email] = useState('')
  const [bill_to_email, setBill_to_email] = useState('')
  const [destination_warehouse, setDestination_warehouse] = useState('')

  const forceUpdate = useForceUpdate()

  
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
      setRequestCancellationDisabled(false)
      setPutOnHoldSucceeded(false)
      setPutOffHoldSucceeded(false)
    },
    [order_number]
  )

  const handleModalOpening_putOnHold = useCallback(
    () => {
      setPutOnHoldReason('')
      setTimeout( () => { put_on_hold_node.current.focus() } , 500 )
    },
    []
  )

  const handleModalOpening_transferOrder = useCallback(
    () => {
      setDestination_warehouse('')
      setTimeout( () => { transfer_order_node.current.focus() } , 500 )
    },
    []
  )

  const handleModalOpening_resend = useCallback(
    () => {
      document.getElementById('resendEmailNode').focus()
    },
    []
  )

  useEffect(
    () => {
      global.$('#modal-put-on-hold').on('show.bs.modal', handleModalOpening_putOnHold )
      global.$('#modal-transfer-order').on('show.bs.modal', handleModalOpening_transferOrder)
      global.$('#modal-resend-ship-confirmation').on('show.bs.modal', handleModalOpening_resend )
      return () => {
        global.$('#modal-put-on-hold').off('show.bs.modal', handleModalOpening_putOnHold )
        global.$('#modal-transfer-order').off('show.bs.modal', handleModalOpening_transferOrder)
        global.$('#modal-resend-ship-confirmation').off('show.bs.modal', handleModalOpening_resend )
      }
    },
    []
  )

  function reload (event) {
    event.preventDefault()
    fetchOrderDetail( order_number )
  }

  function getCurrentMaxNumberIndex () {
    let totalItems        = gridState.totalRows
    let currentPagination = +gridState.fetchRowsParams.page_num
    let totalPaginations  = gridState.totalPages

    if( currentPagination < totalPaginations ){
      return currentPagination * +( gridState.fetchRowsParams.page_size )
    }else if( currentPagination === totalPaginations ){
      return totalItems
    }
  }

  function isNavButtonDisabled( type = '' ){

    let { activeRowIndex, fetchRowsParams, totalRows } = gridState

    if( !activeRowIndex ) return true

    if( !totalRows ) return true

    activeRowIndex = +activeRowIndex

    // check if next row has the value too

    if( type === 'prev' && ( +fetchRowsParams.page_num - 1 ) * 100 + 1 === activeRowIndex ){
      return true
    }

    if( type === 'next' && activeRowIndex === getCurrentMaxNumberIndex() ){
      return true
    }
    return false
  }

  function onNavButtonClicked( type ){
    let { activeRowIndex, rows } = gridState
    let currentArrayIndex = ( activeRowIndex % 100 !== 0 ? activeRowIndex % 100 : 100 ) - 1
    let rowNext = rows[ currentArrayIndex + ( type === 'prev' ? -1 : +1 ) ]
    let order_type = 'order_number'
    let rowCurrent = rows[ currentArrayIndex ]
    if( pathname === '/returntrak/rmas/open' || rowCurrent[ 'order_number' ] !== order_number ){
      order_type = getCurrentOrderNumberType( rowCurrent )
      if( !order_type ) return

      let returnData = findNextRow( order_type, currentArrayIndex, type, activeRowIndex  )
      //rowNext[ type ] ? type : ''
      if( !returnData ) return
      rowNext = returnData.rowNext
      activeRowIndex = returnData.activeRowIndex
    }else{
      activeRowIndex = +currentArrayIndex + ( type === 'prev' ? -1 : +1 ) + 1
    }
    let accountType = ''
    if( order_type === 'order_number' ){
      accountType = 'account_number'
    }else if( order_type === 'original_order_number' ){
      accountType = 'original_account_number'
    }else if( order_type === 'replacement_order_number' ){
      accountType = 'shipping_account_number'
    }


    history.push(
      `${pathname}?orderNum=${ encodeURIComponent(rowNext[ order_type ]) }&accountNum=${rowNext[ accountType ]}`
    )

    gridActions.setRootReduxStateProp_multiple({
      activeRow   : rowNext,
      activeRowIndex
    })
  }
  
  function findNextRow( order_type, currentArrayIndex, type, activeRowIndex ){
    let { totalRows, rows } = gridState
    let lastIndex = type === 'prev' ? 0 : +totalRows - 1
    currentArrayIndex = +currentArrayIndex + ( type === 'prev' ? -1 : +1 )
    let rowNext = rows[ currentArrayIndex ][ order_type ] ? rows[ currentArrayIndex ] : false
    activeRowIndex = +activeRowIndex + ( type === 'prev' ? -1 : +1 )
    if( rowNext ) {
      return { rowNext,  activeRowIndex }
    }
    if( currentArrayIndex === lastIndex ) {
      return false
    }
    return findNextRow( order_type, currentArrayIndex, type, activeRowIndex )
  }

  function getCurrentOrderNumberType( rowCurrent ){
    let type = rowCurrent[ 'original_order_number' ] === order_number
               ? 'original_order_number'
               : rowCurrent[ 'replacement_order_number' ] === order_number
                 ? 'replacement_order_number'
                 : ''
    if( type === '' ){
      return console.error(
        'Checking if order_number is taken from original_order_number or' +
        ' replacement_order_number failed. Please check what s wrong '
      )
    }
    return type
  }

  function onNextButtonClicked(){
    let disabled = isNavButtonDisabled('next')
    if( !disabled ) onNavButtonClicked('next')
  }

  function onPrevButtonClicked(){
    let disabled = isNavButtonDisabled('prev')
    if( !disabled ) onNavButtonClicked('prev')
  }

  /*==============================================================
  =            Actions dropdown click event handlers             =
  ==============================================================*/

  function editInOrderpoints(){
    if( orderDetail.order_stage === 10 || ( orderDetail.order_stage < 10 && orderDetail.order_status === 0 ) ){
      let { order_id, location } = orderDetail
      reviewActions.readOrderFrom({
        order_id, location, fromDraft : false
      }).then( ({ isSuccess, message } = {}) => {
        if( isSuccess ) return history.push('/orderpoints')
      } )

    }
  }

  function cancelOrder(){
    let { order_id, location } = orderDetail

    reviewActions.cancelOrder({
      order_id, location
    }).then( ({ isSuccess, message }) => {
      if( isSuccess ){
        setRequestCancellationDisabled(true)
      }
    } )
  }

  function putOnHold( on = true ){
    let { order_id, location } = orderDetail
    return reviewActions.putOnHold({
      order_id, location, reason : putOnHoldReason, on
    }).then( ({ isSuccess, message }) => {
      if( isSuccess ){
        setPutOnHoldReason(Boolean(on))
        setPutOffHoldSucceeded(Boolean(!on))
        return Promise.resolve()
      }else{
        return Promise.reject()
      }
    } )
  }

  function transferOrder(){
    let { order_id, location} = orderDetail
    return reviewActions.transferOrder({
      order_id,
      source_warehouse : location.split(' - ')[0], 
      destination_warehouse
    }).then( 
      ({ isSuccess, message }) => {
        if( isSuccess ){
          forceUpdate()
          return Promise.resolve()
        }else{
          return Promise.reject()
        }
      } 
    )

  }

  function approvePutOnHold () {
    putOnHold( true ).then( () => {
      global.$('#modal-put-on-hold').modal('hide')
    } ).catch( () => {} )

  }

  function approvePutOffHold () {
    putOnHold( false )
  }

  function approveModal () {
    if( activeModalType === 'put_on_hold' ){
      putOnHold()
    }
    if( activeModalType === 'request_cancellation' ){
      cancelOrder()
    }
  }

  function showApproveModal ({ type, showModal }) {
    if( showModal ){
      let approveModalContent = ''
      if( type === 'put_on_hold' ) {
        approveModalContent = 'Type the reason to put on hold the order'
      }
      if( type === 'request_cancellation' ) {
        approveModalContent = 'Are you sure to cancel this order?'
      }
      setApproveModalContent(approveModalContent)
      setActiveModalType(type)
    }
  }

  function submitTransferOrder () {
    transferOrder().then(() => {
      global.$('#modal-transfer-order').modal('hide')
      setTimeout( () => {
        global.$('#modal-transfer-order-success').modal('show')
      }, 1000 )
    }).catch( () => {} )
  }
  /*=====  End of Actions dropdown click event handlers   ======*/

  function print () {
    global.window.print()
  }

  function closeModal () {
    invoiceActions.setRootReduxStateProp({
      field : 'orderDetail',
      value : {}
    })
    invoiceActions.setRootReduxStateProp({
      field : 'navigationHidden',
      value : false
    })
    if( onCloseModalClicked ) {
      return onCloseModalClicked()
    }
    history.push(`${pathname.startsWith('/') ? pathname : '/' + pathname }`)
  }

  function getHoldOrderStatus () {
    let { order_status, order_stage } = orderDetail
    let status = {}
    if ( +order_status === 0 ){
      // show label put OFF hold enabled
      status.putOffHoldEnabled = true
    } else {

      if( +order_stage === 2 || +order_stage > 40 ){
        // show label put ON hold disabled
        status.putOnHoldEnabled = false
      }else{
        // show label put ON hold enabled
        status.putOnHoldEnabled = true
      }
    }

    return status

  }

  function cloneOrder () {
    let visibleApps = getUserData('apps') || []
    if( visibleApps.includes( 47 ) && !orderDetail.noResponse ){
      let {
        order_number = '',
        account_number = ''
      } = orderDetail
      reviewActions.cloneOrder({
        order_number, account_number
      }).then( ({ isSuccess }) => {
        if( isSuccess ){
          history.push('/orderpoints')
        }
      } )
    }
  }

  function doNothing () {
    // does nothing
  }

  function resendShipNotification (event) {
    let {
      order_number,
      account_number,
      billing_address,
      shipping_address
    } = orderDetail

    billing_address = billing_address ? billing_address : {}
    shipping_address = shipping_address ? shipping_address : {}

    let {
      email : bill_to_email
    } = billing_address

    let {
      email : ship_to_email
    } = shipping_address

    setOrderNumber(order_number)
    setAccountNumber(account_number)
    setShip_to_email(ship_to_email)
    setBill_to_email(bill_to_email)
    global.$('#modal-resend-ship-confirmation').modal('show')
  }

  function approveResendShipConfirmation () {
    invoiceActions.resendEmail_ship_confirmation({
      order_number: orderNumber,
      account_number: accountNumber,
      ship_to_email,
      bill_to_email
    }).then(
      () => {
        global.$('#modal-resend-ship-confirmation').modal('hide')
      }
    ).catch( () => {} )
  }

  let { activeRowIndex } = gridState
  let { home_dir = [] } = orderDetail
  let visibleApps = getUserData('apps') || []

  let { page_num : currentPagination } = gridState.fetchRowsParams

  let minNumberOfPages, maxNumberOfPages

  if( !navigationHidden ){
    currentPagination = currentPagination ? +currentPagination : 1
    activeRowIndex = isNaN(activeRowIndex) ? -1 : +activeRowIndex

    minNumberOfPages = ( currentPagination - 1 ) * 100 + 1
    maxNumberOfPages = getCurrentMaxNumberIndex()
  }

  let { putOffHoldEnabled, putOnHoldEnabled } = getHoldOrderStatus()

  if ( putOffHoldSucceeded ) {
    putOnHoldEnabled = true
    putOffHoldEnabled = false
  } else if( putOnHoldSucceeded ) {
    putOnHoldEnabled = false
    putOffHoldEnabled = true
  }

  let createRmaDisabled = +orderDetail.order_stage < 50 || !visibleApps.includes( 55 ) || orderDetail.noResponse

  let requestCancellationDisabled_ = !( orderDetail.order_stage === 10 || (orderDetail.order_stage < 10 && orderDetail.order_status === 0) ) ||
                                requestCancellationDisabled ||
                                orderDetail.noResponse

  let resendShipConfirmationDisabled = orderDetail.noResponse || !orderDetail.allow_resent_ship_notification

  let isTransferOrderDisabled = requestCancellationDisabled_ ||
                                orderDetail.order_stage !== 10 ||
                                orderDetail.noResponse || 
                                !( Array.isArray( home_dir ) && home_dir.length > 0 )
  let isEdi = ( orderDetail && orderDetail.order_type === 'EDI' )

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
      ORDER #:
    </span>
    <span className="caption-subject font-gray sbold" style={{paddingRight:"30px"}}>
      {
        orderDetail.noResponse
         ? 'ORDER NOT FOUND'
         : (orderDetail.order_number
           ? orderDetail.order_number
           : (orderDetail[0]
             ? orderDetail[0][ 'order_number' ]
             : ''))
      }</span>
  </div>
  <span className="noselect">&nbsp;</span>
  <div className="actions hidden-print">

    {
      !navigationHidden && !orderDetail.noResponse &&
      <span className="order-page-navigation"  style={{ visibility : (isShowOriginal ? !isShowOriginal_toggled : true) ? 'visible' : 'hidden' }}>
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

    {
      !hideActions &&
      <div className="btn-group ">
        <a className="btn btn-topbar btn-sm btn-circle uppercase sbold" href="#" data-toggle="dropdown">
          <i className="icon-wrench"></i> Actions <i className="fa fa-angle-down"></i>
        </a>


        <ul className="dropdown-menu pull-right ">

          <li>
            <a
              href={ putOffHoldEnabled
                     ? '#modal-put-off-hold'
                     : putOnHoldEnabled
                       ? '#modal-put-on-hold'
                       : '#'
                    }
              className={classNames({
                'disabled-link disable-target' : ( !putOnHoldEnabled && !putOffHoldEnabled ) || orderDetail.noResponse
              })}

              data-toggle={ putOffHoldEnabled || putOnHoldEnabled ? 'modal' : '' }
            >
              <i className="fa fa-ban">
              </i> Put { putOffHoldEnabled ? 'Off' : 'On' } Hold
            </a>
          </li>

          <li>
            <a
              className={classNames({
                'disabled-link disable-target' : requestCancellationDisabled_
              })}
              href={ requestCancellationDisabled_ ? '#' : '#modal-request-cancellation' }
              data-toggle={ requestCancellationDisabled_ ? '' : 'modal' }
              onClick={ event => showApproveModal({
                type : 'request_cancellation',
                showModal : !requestCancellationDisabled_
              }) }
            ><i className="fa fa-trash-o"></i>  Request Cancellation</a>
          </li>

          <li>
            <a
              className={classNames({
                'disabled-link disable-target' : createRmaDisabled || orderDetail.hide_pii
              })}
              onClick={ event => {
                event.preventDefault()
                if( !createRmaDisabled ){
                  let {
                    order_number = '',
                    account_number = ''
                  } = orderDetail
                  RMAEntryActions.createRmaFromOrder({
                    order_number, account_number
                  }).then( ({ isSuccess }) => {
                    if( isSuccess ){
                      history.push('/returntrak')
                    }
                  } )
                }
              } }
            ><i className="fa fa-exchange"></i> Create RMA
            </a>
          </li>

          <li>
            <a
              className={classNames({
                'disabled-link disable-target' : requestCancellationDisabled_ || orderDetail.hide_pii ||
                                                 !( orderDetail.order_stage === 10 || (orderDetail.order_stage < 10 && orderDetail.order_status === 0) ) ||
                                                 !visibleApps.includes( 47 ) ||
                                                 orderDetail.noResponse
              })}
              onClick={ event => editInOrderpoints() }
            >
              <i className="fa fa-opencart"></i> Edit in Orderpoints</a>
          </li>

          <li>
            <a
              className={classNames({
                'disabled-link disable-target' : !visibleApps.includes( 47 ) || orderDetail.noResponse || orderDetail.hide_pii
              })}
              onClick={ event => cloneOrder() }
            >
              <i className="fa fa-copy"></i> Copy as Draft </a>
          </li>

          <li>
            <a
              className={ classNames({
                'disabled-link disable-target' :  resendShipConfirmationDisabled
              })}
              onClick={ resendShipConfirmationDisabled ? doNothing : resendShipNotification }
            >
              <i className="fa fa-envelope-o"></i> Re-send Ship Confirmation </a>
          </li>

          <li>
            <a
              href={ isTransferOrderDisabled ? '' : '#modal-transfer-order' } 
              className={classNames({
                'disabled-link disable-target': isTransferOrderDisabled
              })}
              data-toggle='modal'
            >
              <i className="fa fa-exchange">
              </i> Warehouse Transfer
            </a>
          </li>

          {
            isShowOriginal &&
            <li className="divider"></li>
          }

          {
            isShowOriginal &&
            <li>
              <a
                onClick={
                  onShowOriginalToggled
                }
              >
                <i className="fa fa-file-code-o"></i>
                &nbsp;
                { !isShowOriginal_toggled ? 'Show Original Order' : 'Show DCL Order' }
              </a>
            </li>
          }

          {
            isEdi &&
            <li className="divider"></li>
          }

          {
            isEdi &&
            <li>
              <a
                onClick={
                  onShowEdiDocClicked
                }
              >
                <i className="fa fa-file-code-o"></i>
                &nbsp;
                Show EDI Documents
              </a>
            </li>
          }

        </ul>




      </div>
    }

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
    modalContent={ approveModalContent }
    onApprove={ approveModal }
    id="modal-request-cancellation"
    title="Request Cancellation"
  />

  <ApproveModal
    onApprove={ approvePutOnHold }
    id="modal-put-on-hold"
    title="Put On Hold"
  >
    <div className="col-md-12" style={{ padding : '0' }}>
      <label className="control-label">Reason to put on hold:</label>
      <textarea
        cols="30" rows="4"
        className="form-control input-md"
        value={ putOnHoldReason }
        style={{ marginBottom : '10px' }}
        ref={ put_on_hold_node }
        onChange={ event => setPutOnHoldReason(event.target.value) }
      />
    </div>
  </ApproveModal>

  <ApproveModal
    modalContent="Are you sure to put off hold this order?"
    onApprove={ approvePutOffHold }
    id="modal-put-off-hold"
    title="Put Off Hold"
  />


  <div
    className="modal modal-themed fade"
    data-backdrop="static"
    id="modal-transfer-order"
    tabIndex="-1"
    role="dialog"
    aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content"
        style={{ width: '80%', marginLeft: '10%' }}
      >
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true">
          </button>
          <h4 className="modal-title">
            Warehouse Transfer
          </h4>
        </div>
        <div className="modal-body" style={{marginBottom: "20px"}}>
          <div className="col-md-12" style={{ padding : '0' }}>
           <div> 
              Transfer Order #: <b>{orderDetail.order_number}</b>  <br/>
              From Warehouse: <b>{orderDetail.location}</b></div>
              <br/>
              <label className="control-label">To Warehouse:</label>
              <select
                name="warehouses"
                style={{ marginBottom : '10px',  width: '150px'}}
                className="form-control input-md"
                value={ destination_warehouse }
                ref={ transfer_order_node }
                onChange={ event => setDestination_warehouse(event.target.value) }
                disabled={home_dir.length === 0}
              >
                <option></option>
                {
                  home_dir.map( warehouse => {
                    return  <option
                              value={warehouse}
                              key={warehouse} >
                              { warehouse }
                            </option>
                  } )
                }
              </select>
            </div>
        </div>
        <div className="modal-footer" style={{ marginTop : '-40px' }} >

          <button
            type="button"
            className="btn dark btn-outline"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            disabled={ !destination_warehouse }
            onClick={ submitTransferOrder }>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    className="modal modal-themed fade"
    data-backdrop="static"
    id="modal-transfer-order-success"
    tabIndex="-1"
    role="dialog"
    aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content"
        style={{ width: '80%', marginLeft: '10%' }}
      >
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true">
          </button>
          <h4 className="modal-title">
            Success
          </h4>
        </div>
        <div className="modal-body" style={{marginBottom: "20px"}}>
          <div className="col-md-12" style={{ padding : '0' }}>
            <div>
              Please note that it may take about a minute for the order to show in the destination warehouse.
            </div> 
          </div>
        </div>
        <div className="modal-footer" style={{ marginTop : '30px' }} >

          <button
            type="button"
            className="btn dark btn-outline"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    className="modal fade"
    id="modal-resend-ship-confirmation"
    tabIndex="-1"
    aria-hidden="true"
    data-backdrop="static"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
          <h4 className="modal-title font-dark"> Re-send ship confirmation </h4>
        </div>
        <div className="modal-body">

          <div className="col-md-12" style={{ padding : '0' }}>
            <label className="control-label">Ship to e-mail:</label>
            <input
              className="form-control input-md"
              spellCheck="false"
              id="resendEmailNode"
              value={ ship_to_email ? ship_to_email : '' }
              style={{ marginBottom : '10px' }}
              onChange={ event => setShip_to_email(event.target.value) }
            />
          </div>

          <div className="col-md-12" style={{ padding : '0' }}>
            <label className="control-label">Bill to e-mail:</label>
            <input
              className="form-control input-md"
              spellCheck="false"
              value={ bill_to_email ? bill_to_email : '' }
              style={{ marginBottom : '10px' }}
              onChange={ event => setBill_to_email(event.target.value) }
            />
          </div>

        </div>
        <div className="modal-footer" style={{ marginTop : '-40px' }} >

          <button
            type="button"
            className="btn dark btn-outline"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={ approveResendShipConfirmation }
          >
            SEND
          </button>
        </div>

    </div>
  </div>
  </div>


  </div>
    )
}

OrderDetailBar.propTypes = {
  activeRowIndex: PropTypes.any,
  currentPagination: PropTypes.any,
  fetchOrderDetail: PropTypes.func,
  gridActions: PropTypes.object.isRequired,
  gridOrders: PropTypes.any,
  invoiceActions: PropTypes.object.isRequired,
  navigationHidden: PropTypes.bool,
  order_number: PropTypes.string,
  reviewActions: PropTypes.object.isRequired,
  RMAEntryActions: PropTypes.object.isRequired,
  shipments: PropTypes.any,
  shipments_overview: PropTypes.any,
  gridState: PropTypes.object,
  onCloseModalClicked:PropTypes.any,
  hideActions: PropTypes.bool,
  sendPolicyCode: PropTypes.bool,
  onShowOriginalToggled: PropTypes.func.isRequired,
  isShowOriginal_toggled: PropTypes.any,
  onShowEdiDocClicked: PropTypes.func.isRequired
}

export default withRouter(OrderDetailBar)