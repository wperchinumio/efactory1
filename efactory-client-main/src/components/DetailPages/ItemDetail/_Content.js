import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as invoiceActions from '../../Invoices/Open/redux'
import * as gridActions from '../../Grid/redux'
import { getUserData } from '../../../util/storageHelperFuncs'
import ItemDetailBar from './Bar'
import ItemDetailBody from './Body'
import EditItem from './EditItem/_Content'

const ItemDetailContent = ({
  activeRowIndex,
  currentPagination,
  fetchItemDetailData,
  grid,
  gridActions,
  gridItems,
  invoiceActions,
  invoices,
  item_number_received,
  itemDetail,
  navigationHidden,
  navigationHidden_received,
  onCloseModalClicked,
  loadedRows,
  location: { search },
}) => {
  const isFirstRun = useRef([true, true])

  let warehouses = getUserData('warehouses') || []
  let region = getUserData('region') || ''
  let account = getUserData('account') || ''

  useEffect(
    () => {
      window.scrollTo(0,0)
      if( !region ) return console.error('region is not available')
      const item_number = getItemNumber()
      fetchItems({ 
        item_number : item_number_received ? item_number_received : item_number, 
        warehouse   : '',
        account_wh  : `${account}.${region}`,  // 10501.FR
        weeks       : false
      })
    },
    []
  )

  useEffect(
    () => {
      if (isFirstRun.current[0]) {
        isFirstRun.current[0] = false
        return
      }
      fetchItems({ item_number: getItemNumber() })
    },
    [search]
  )

  useEffect(
    () => {
      if (isFirstRun.current[1]) {
        isFirstRun.current[1] = false
        return
      }
      if (!activeRowIndex && loadedRows) {
        let { rows } = grid
        let matchedIndex = -1
        rows.some( p => {
          if( p.item_number === getItemNumber() ){
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
    },
    [loadedRows]
  )

  function getItemNumber () {
    return decodeURIComponent(search.replace('?itemNum=',''))
  }

  function fetchItems ( fetchData = {} ) {
    invoiceActions.fetchItemDetail( fetchData )
  }

  let item_number = getItemNumber()
  item_number       = item_number_received ? item_number_received : item_number
  navigationHidden  = navigationHidden_received ? navigationHidden_received : navigationHidden
  
  return (
    <div className="fade-in-up">
      <div className="order-body" style={{ marginBottom : '20px' }}>
        <div className="portlet light">
          
          <ItemDetailBar 
            activeRowIndex={activeRowIndex}
            currentPagination={currentPagination}
            fetchItems={fetchItems}
            gridActions={gridActions}
            gridItems={gridItems}
            invoiceActions={invoiceActions}
            item_number={item_number}
            itemDetail={itemDetail}
            navigationHidden={navigationHidden}
            gridState={grid}
            onCloseModalClicked={onCloseModalClicked}
            invoices={invoices}
          />

          <ItemDetailBody 
            fetchItems={fetchItems}
            fetchItemDetailData={fetchItemDetailData}
            itemDetail={itemDetail}
            warehouses={warehouses}
          />

        </div>
      </div>

      <EditItem />

    </div>
  );
}

ItemDetailContent.propTypes = {
  item_number_received: PropTypes.string,
  navigationHidden_received: PropTypes.bool,
  onCloseModalClicked: PropTypes.func
}

export default withRouter(
  connect(
    state => ({
      activeRow           : state.grid.activeRow,
      activeRowIndex      : state.grid.activeRowIndex,
      fetchItemDetailData : state.invoices.open.fetchItemDetailData,
      gridItems           : state.grid.orders,
      navigationHidden    : state.invoices.open.navigationHidden,
      itemDetail          : state.invoices.open.itemDetail,
      loadedOrders        : state.grid.loadedOrders,
      grid                : state.grid,
      invoices            : state.invoices
    }),
    dispatch => ({
      invoiceActions      : bindActionCreators( invoiceActions, dispatch ),
      gridActions         : bindActionCreators( gridActions, dispatch )
    })
  )(ItemDetailContent)
)