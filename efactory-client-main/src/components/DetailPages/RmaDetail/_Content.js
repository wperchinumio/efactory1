import React, { useRef, useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import RmaDetailBar from './Bar'
import RmaDetailBody from './Body'
import * as invoiceActions from '../../Invoices/Open/redux'
import * as gridActions from '../../Grid/redux'
import * as rmaSettingsActions from '../../ReturnTrak/Settings/redux'
import ItemDetail from '../ItemDetail/_Content'
import OrderDetail from '../OrderDetail/_Content'

const RmaDetailContent = ({
  activeRowIndex,
  currentPagination,
  fetchRmaDetailData,
  globalApiData,
  grid,
  gridActions,
  invoiceActions,
  loadedRows,
  loadedRmaDetail,
  location: { search },
  marginFix,
  navigationHidden,
  rmaDetail,
  rmaSettingsActions,
}) => {
  const firstRun = useRef(true)
  const [prevProps, setPrevProps] = useState({ loadedRows, search })
  const [anotherDetailPageOpen, setAnotherDetailPageOpen] = useState(false)
  const [openDetailPageType, setOpenDetailPageType] = useState('')
  const [detailTypeNumber, setDetailTypeNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  useEffect(
    () => {
      window.scrollTo(0,0)
      let account_number = getAccountNumber()
      let rma_number = getRmaNumber()
      fetchRmaDetail({ 
        rma_number,
        account_number,
        weeks: false
      })
      return () => {
        invoiceActions.setRootReduxStateProp({
          field: 'loadedRmaDetail',
          value: false
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
      let rma_number = getRmaNumber(prevProps.search)
      let rma_number_next = getRmaNumber()
      let account_number = getAccountNumber(prevProps.search)
      let account_number_next = getAccountNumber()

      let isRmaNumExist = rma_number_next
      let isRmaNumChanged = rma_number !== rma_number_next && isRmaNumExist
      let isAccountNumChanged = account_number !== account_number_next && isRmaNumExist

      if( isRmaNumChanged || isAccountNumChanged ){
        fetchRmaDetail({
          rma_number: rma_number_next,
          account_number: account_number_next
        })
      }
      
      if( !activeRowIndex && !prevProps.loadedRows && loadedRows ){
        let { rows } = grid
        let matchedIndex = -1
        rows.some( p => {
          if( p.rma_number === rma_number_next ){
            matchedIndex = p.row_id
            return true
          }
          return false
        } )
        if( matchedIndex !== -1 ){
          gridActions.setRootReduxStateProp_multiple({
            activeRow: rows[ matchedIndex ],
            activeRowIndex: matchedIndex
          })
        }
      }
      setPrevProps({ loadedRows, search })
    },
    [loadedRows, search]
  )

  function fetchRmaDetail ( fetchData = {} ) {
    invoiceActions.fetchRmaDetail( fetchData )
  }

  function getRmaNumber (searchReceived = search) {
    return decodeURIComponent(searchReceived.replace('?rmaNum=','').replace(/&accountNum=.+/, ''))
  }

  function getAccountNumber (searchReceived = search) {
    return searchReceived.replace(/\?rmaNum=[a-zA-Z0-9_\-%]+/,'').replace(/&accountNum=/, '')
  }

  function onCloseModalClicked () {
    setAnotherDetailPageOpen(false)
    setOpenDetailPageType('')
    setDetailTypeNumber('')
    setAccountNumber('')
  }

  function openDetailPage ({ openDetailPageType = '', detailTypeNumber = '', accountNumber = '' }) {
    setAnotherDetailPageOpen(true)
    setOpenDetailPageType(openDetailPageType)
    setDetailTypeNumber(detailTypeNumber)
    setAccountNumber(accountNumber)
    setTimeout( () => {
      global.window.scrollTo(0,0)
    }, 0 ) 
  }

  const rma_number = getRmaNumber()
  
  return (
    <div>
      <div className="fade-in-up" style={ anotherDetailPageOpen ? { display : 'none' } : {} }>
        <div 
          className="order-body" 
          style={ marginFix ? { margin:'-25px -20px' } : { marginBottom : '20px' }}
        >
          <div className="portlet light">
            
            <RmaDetailBar 
              activeRowIndex={activeRowIndex}
              currentPagination={currentPagination}
              fetchRmaDetail={fetchRmaDetail}
              gridActions={gridActions}
              invoiceActions={invoiceActions}
              rma_number={rma_number}
              rmaDetail={rmaDetail}
              navigationHidden={navigationHidden}
              gridState={grid}
              loadedRmaDetail={loadedRmaDetail}
              rmaSettingsActions={rmaSettingsActions}
            />

            <RmaDetailBody 
              fetchRmaDetail={fetchRmaDetail}
              fetchRmaDetailData={fetchRmaDetailData}
              rmaDetail={rmaDetail}
              loadedRmaDetail={loadedRmaDetail}
              globalApiData={globalApiData}
              openDetailPage={openDetailPage}
            />

          </div>
        </div>
      </div>

      {
        anotherDetailPageOpen && 
        openDetailPageType === 'item' && 
        <ItemDetail
          item_number_received={ detailTypeNumber }
          navigationHidden_received={ true }
          onCloseModalClicked={ onCloseModalClicked }
        />
      }


      {
        anotherDetailPageOpen && 
        openDetailPageType === 'order' && 
        <OrderDetail
          order_number_received={ detailTypeNumber }
          account_number_received={ accountNumber }
          navigationHidden_received={ true }
          onCloseModalClicked={ onCloseModalClicked }
        />
      }
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      activeRow: state.grid.activeRow,
      activeRowIndex: state.grid.activeRowIndex,
      fetchRmaDetailData: state.invoices.open.fetchRmaDetailData,
      navigationHidden: state.invoices.open.navigationHidden,
      rmaDetail: state.invoices.open.rmaDetail,
      loadedRows: state.grid.loadedRows,
      grid: state.grid,
      loadedRmaDetail: state.invoices.open.loadedRmaDetail,
      globalApiData: state.common.globalApi.globalApiData
    }),
    dispatch => ({
      invoiceActions: bindActionCreators( invoiceActions, dispatch ),
      gridActions: bindActionCreators( gridActions, dispatch ),
      rmaSettingsActions: bindActionCreators( rmaSettingsActions, dispatch )
    })
  )(RmaDetailContent)
)