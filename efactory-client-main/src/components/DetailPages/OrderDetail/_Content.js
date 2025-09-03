import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as gridActions from '../../Grid/redux'
import * as invoiceActions from '../../Invoices/Open/redux'
import * as OPSettingsActions from '../../OrderPoints/Settings/redux'
import * as reviewActions from '../../OrderPoints/OrderEntry/redux'
import * as RMAEntryActions from '../../ReturnTrak/Entry/redux'
import Bar from './Bar'
import Body from './Body'
import BodyOriginal from './BodyOriginal'
import ItemDetail from '../ItemDetail/_Content'
import EdiXmlOverviewModal from '../../Grid/Modals/EdiXmlOverviewModal'

const OrderDetailContent = ({
  activeRow,
  activeRowIndex,
  account_number_received,
  grid,
  gridOrderFetchData,
  gridActions,
  gridOrders,
  hideActions,
  invoiceActions,
  loadedRows,
  location: { search, pathname },
  onCloseModalClicked,
  order_number_received,
  orderDetail,
  navigationHidden,
  navigationHidden_received,
  reviewActions,
  RMAEntryActions,
  sendPolicyCode,
  rows,
  style = {}
}) => {
  const firstRun = useRef(true)
  const [prevProps, setPrevProps] = useState({ loadedRows, search })
  const [anotherDetailPageOpen, setAnotherDetailPageOpen] = useState(false)
  const [openDetailPageType, setOpenDetailPageType] = useState('')
  const [detailTypeNumber, setDetailTypeNumber] = useState('')
  const [isShowOriginalToggled, setIsShowOriginalToggled] = useState(false)
  const [ediModalVisible, setEdiModalVisible] = useState(false)

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      let order_number = getOrderNumber(prevProps.search)
      let order_number_next = getOrderNumber()
      let account_number = getAccountNumber(prevProps.search)
      let account_number_next = getAccountNumber()

      let isOrderNumAccountNumExist = order_number_next && account_number_next
      let isOrderNumChanged     = order_number !== order_number_next && isOrderNumAccountNumExist
      let isAccountNumChanged   = account_number !== account_number_next && isOrderNumAccountNumExist

      if( order_number !== order_number_next && !isAccountNumChanged ){
        fetchOrderDetail( order_number_next, account_number_next, true )
      } else if ( account_number !== account_number_next && order_number === order_number_next ){
        fetchOrderDetail( order_number_next, account_number_next, true )
      } else if( isOrderNumChanged || isAccountNumChanged ){
        fetchOrderDetail( order_number_next, account_number_next )
      }

      if( !activeRowIndex && !prevProps.loadedRows && loadedRows ){
        let matchedIndex = -1
        rows.some( p => {
          if( p.order_number === order_number_next ){
            matchedIndex = p.row_id
            return true
          }
          return false
        } )
        if( matchedIndex !== -1 ){
          gridActions.setRootReduxStateProp_multiple({
            activeRow      : rows[ matchedIndex ],
            activeRowIndex : matchedIndex
          })
        }
      }
      setPrevProps({ loadedRows, search })
    },
    [loadedRows, search]
  )

  useEffect(
    () => {
      window.scrollTo(0,0)
      let account_number = getAccountNumber()
      let order_number = getOrderNumber()
      // @todo
      order_number  = order_number_received   ? order_number_received : order_number
      account_number   = account_number_received ? account_number_received : account_number
      fetchOrderDetail( order_number, account_number )
      setPrevProps({ loadedRows, search })
    },
    []
  )

  function getOrderNumber (searchReceived = search) {
    return decodeURIComponent( searchReceived.replace('?orderNum=','').replace(/&accountNum=.+/, '') )
  }

  function getAccountNumber (searchReceived = search) {
    return searchReceived.replace(/\?orderNum=[a-zA-Z0-9_\-%]+/,'').replace(/&accountNum=/, '')
  }

  function fetchOrderDetail ( order_num = getOrderNumber(), account_num = getAccountNumber() ) {
    invoiceActions.fetchOrderDetail( order_num, account_num )
  }

  function openDetailPage ({ openDetailPageType = '', detailTypeNumber = '' }) {
    setAnotherDetailPageOpen(true)
    setOpenDetailPageType(openDetailPageType)
    setDetailTypeNumber(detailTypeNumber)
    setTimeout( () => {
      global.window.scrollTo(0,0)
    }, 0 )
  }

  function onShowOriginalToggled () {
    setIsShowOriginalToggled(!isShowOriginalToggled)
  }

  function ediModalClosed (event) {
    setEdiModalVisible(false)
  }

  function onShowEdiDocClicked (event) {
    setEdiModalVisible(true)
  }

  let order_number = getOrderNumber()

  order_number       = order_number_received ? order_number_received : order_number
  navigationHidden  = navigationHidden_received ? navigationHidden_received : navigationHidden

  let isShowOriginal = orderDetail.custom_data !== null ? true : false

  return (
    <div style={ style } className="order-detail-wrapper">
      {
        !ediModalVisible &&
        <div id="overlay-content" className="fade-in-up" style={ anotherDetailPageOpen ? { display : 'none' } : {} }>
          <div className="order-body" style={ pathname.startsWith('/overview') ? { margin:'-25px -20px' } : { marginBottom : '20px' }}>
            <div className="portlet light">
              <Bar
                activeRowIndex={ activeRowIndex }
                fetchOrderDetail={ fetchOrderDetail }
                gridActions={ gridActions }
                gridOrders={ gridOrders }
                invoiceActions={ invoiceActions }
                navigationHidden={ navigationHidden }
                order_number={ order_number }
                orderDetail={ orderDetail }
                pathname={ pathname }
                reviewActions={ reviewActions }
                RMAEntryActions={ RMAEntryActions }
                gridState={ grid }
                onCloseModalClicked={ onCloseModalClicked }
                hideActions={ hideActions }
                sendPolicyCode={ sendPolicyCode }
                isShowOriginal={ isShowOriginal }
                onShowOriginalToggled={ onShowOriginalToggled }
                isShowOriginalToggled={ isShowOriginalToggled }
                onShowEdiDocClicked={ onShowEdiDocClicked }
              />

              {
                !isShowOriginalToggled &&
                <Body
                  gridOrderFetchData={gridOrderFetchData}
                  orderDetail={orderDetail}
                  openDetailPage={openDetailPage}
                />
              }

              {
                isShowOriginalToggled &&
                <BodyOriginal
                  gridOrderFetchData={gridOrderFetchData}
                  orderDetail={orderDetail}
                  openDetailPage={openDetailPage}
                />
              }

            </div>
          </div>

        </div>
      }

      {
        ediModalVisible &&
        <EdiXmlOverviewModal
          onCloseClicked={ ediModalClosed }
          rowData={orderDetail}
          gridState={ grid }
          gridActions={ gridActions }
        />
      }

      {
        anotherDetailPageOpen &&
        openDetailPageType === 'item' &&
        <ItemDetail
          item_number_received={ detailTypeNumber }
          navigationHidden_received={ true }
          onCloseModalClicked={ onCloseModalClicked }
        />
      }
    </div>
  );
}

OrderDetailContent.propTypes = {
  navigationHidden: PropTypes.bool,
  order_number_received: PropTypes.string,
  account_number_received: PropTypes.string,
  navigationHidden_received: PropTypes.bool,
  onCloseModalClicked: PropTypes.func,
  hideActions: PropTypes.bool,
  sendPolicyCode: PropTypes.bool,
}

export default withRouter(
  connect(
    state => ({
      activeRow           : state.grid.activeRow,
      activeRowIndex      : state.grid.activeRowIndex,
      gridOrderFetchData  : state.invoices.open.gridOrderFetchData,
      gridOrders          : state.grid.rows,
      rows                : state.grid.rows,
      loadedRows          : state.grid.loadedRows,
      navigationHidden    : state.invoices.open.navigationHidden,
      orderDetail         : state.invoices.open.orderDetail,
      grid                : state.grid
    }),
    dispatch => ({
      gridActions         : bindActionCreators( gridActions, dispatch ),
      invoiceActions      : bindActionCreators( invoiceActions, dispatch ),
      OPSettingsActions   : bindActionCreators( OPSettingsActions, dispatch ),
      reviewActions       : bindActionCreators( reviewActions, dispatch ),
      RMAEntryActions     : bindActionCreators( RMAEntryActions, dispatch ),
    })
  )(OrderDetailContent)
) 
