import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import global from 'window-or-global'
import classNames from 'classnames'
import history from '../../history'
import { withRouter } from 'react-router-dom'
import * as settingsActions from '../Settings/redux/settings'
import * as invoiceActions from '../Invoices/Open/redux'
import * as gridActions from './redux'
import * as bundleActions from './Modals/Bundle/redux'
import OrderDetails from '../DetailPages/OrderDetail/_Content'
import ItemDetails from '../DetailPages/ItemDetail/_Content'
import RmaDetails from '../DetailPages/RmaDetail/_Content'
import TPDetails from '../DetailPages/TPDetail/_Content'
import Records from './Records'
import Header from './Header/_Content'
import ScheduleReport from '../Scheduler/ScheduleReport/_Content'
import Pagination from './Pagination'
import ColGroup from './ColGroup'
import BlockUi from './BlockUi'
import Bar from './Bar'
import SidebarSummary from './_SidebarSummary/_Content'
import ApproveModal from './_Helpers/SaveCurrentFilterModal'
import LotRevisionModal from './Modals/LotRevision/_Content'
import DGDataModal from './Modals/DGData/_Content'
import BundleModal from './Modals/Bundle/_Content'
import ConfirmModal  from '../_Shared/Components/ConfirmModal'
import EditASNModal  from  './Modals/EditASN/_Content'
import NewItemModal  from  './Modals/NewItem/_Content'
import QuickFilters from './QuickFilters/_Content'
import * as QuickFilterTypes from './QuickFilters/_Types'
import {
  cacheViewApiResponse,
  getCachedViewApiResponseIfExist
} from '../../util/storageHelperFuncs'

const GridMainWrapper = ({
  bundleActions,
  config,
  globalApi,
  grid,
  gridActions,
  invoiceActions,
  location: { search, pathname },
  orderDetails,
  settingsActions,
}) => {
  const gridRef = useRef(grid)
  const firstRun = useRef([true, true, true, true])
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false)
  const [reorderedViewFields, setReorderedViewFields] = useState([])
  const reorderedViewFieldsRef = useRef(reorderedViewFields)
  const [showScheduler, setShowScheduler] = useState(false)

  useEffect(
    () => {
      gridRef.current = grid
      reorderedViewFieldsRef.current = reorderedViewFields
    },
    [grid, reorderedViewFields]
  )

  useEffect(
    () => {
      fetchViewsAndRecords()
      handleColumnResize()
      setHeaderConfigDataForManageFilters()
      return () => {
        handleDragDropEvent('removeEventListener')
        global.$(document).off('mouseup', handleMouseup)
        global.$(document).off('mousemove', handleMousemove)
        gridActions.initializeGridReduxState()
        global.$('#schedule_report').off('hidden.bs.modal', onSchedulerModalClosed)
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
      if (!search.includes('?query_filters_exist=true')) {
        gridActions.setRootReduxStateProp('queryFilters', {})
      }
      fetchViewsAndRecords()
      setReorderedViewFields([])
      global.$('.table-container-header').css({ left: 0 })
      setHeaderConfigDataForManageFilters()
    },
    [pathname]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (grid.fetchedViews) {
        resetDragDrop()
      }
    },
    [grid.fetchedViews]
  )

  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      if (grid.loadedSelectView) {
        resetDragDrop()
      }
    },
    [grid.loadedSelectView]
  )

  useEffect(
    () => {
      if (firstRun.current[3]) {
        firstRun.current[3] = false
        return
      }
      if (showScheduler) {
        setTimeout(() => {
          global.$('#schedule_report').modal('show')
          global.$('#schedule_report').on('hidden.bs.modal', onSchedulerModalClosed)
        }, 0)
      }
    },
    [showScheduler]
  )

  function resetDragDrop () {
    handleDragDropEvent('removeEventListener')
    setTimeout(
      () => {
      handleDragDropEvent('addEventListener')
    }, 0)
    setReorderedViewFields([])
  }

  function fetchViewsAndRecords () {
    let remember_filter_id = localStorage.getItem('remember_filter_id')
    if (remember_filter_id) localStorage.removeItem('remember_filter_id')

    let only_query_filters = search.includes('query_filters_exist')
    let queryFiltersInUrl = search.includes('queryfilters')

    if (queryFiltersInUrl)
    {
      let urlsearch = new URLSearchParams(search)
      let decodedqueryfilters = decodeURIComponent(urlsearch.get("queryfilters"))

      let queryfiltersfromurl = JSON.parse(decodedqueryfilters)
      
      gridActions.setRootReduxStateProp('queryFilters', queryfiltersfromurl)
    }

    gridActions.fetchView(config.view, remember_filter_id, only_query_filters, queryFiltersInUrl)

    if (only_query_filters) {
      history.replace(pathname)
    }
  }

  function setHeaderConfigDataForManageFilters() {
    gridActions.setRootReduxStateProp(
      'manageFilters',
      {
        ...grid.manageFilters,
        headerConfig: config.header,
        isHeaderConfigSet: true,
        resource: config.view
      }
    )
  }

  function dragStart (event) {
    event.dataTransfer.setData('text/plain', 'node');
    event.target.style.backgroundColor = "#147ae0"
    localStorage.setItem('draggedElIndex', event.target.getAttribute('data-sort-index'))
  }

  function dragEnter (event) {
    let draggedEnteredIndex = event.target.getAttribute('data-sort-index')
    let draggedElIndex = localStorage.getItem('draggedElIndex')
    if (draggedEnteredIndex && draggedElIndex !== draggedEnteredIndex) {
      reorderFields(draggedElIndex, draggedEnteredIndex, draggedElIndex > draggedEnteredIndex ? 'before' : 'after')
    }
  }
  
  function dragEnd (event) {
    event.target.style.backgroundColor = ""
    let draggedEnteredIndex = localStorage.getItem('draggedEnteredIndex')
    let draggedElIndex = localStorage.getItem('draggedElIndex')
    let selectedView = gridRef.current.views.filter(v => v.selected)[0]
    if (+selectedView.id !== 0 && +selectedView.id !== -1) {
      if (draggedEnteredIndex && draggedElIndex !== draggedEnteredIndex) {
        saveViewAfterNewOrder(reorderedViewFieldsRef.current)
      }
    }
    localStorage.removeItem('draggedEnteredIndex')
    localStorage.removeItem('draggedElIndex')
  }

  function handleDragDropEvent (action) { // actions are removeEventListener or addEventListener
    let draggables = Array.from(document.querySelectorAll('.draggable'))
    draggables.forEach(draggable => {
      draggable[action]('dragstart', dragStart, false)
      draggable[action]('dragenter', dragEnter, false)
      draggable[action]('dragend', dragEnd, false)
    })
  }

  function reorderFields (itemDraggedIndex = '', targetElIndex = '', orderType = 'before') { // 'before' and 'after' available
    if (itemDraggedIndex === '' || targetElIndex === '') {
      return console.error('reorderFields expected itemDraggedIndex and targetElIndex to be string' +
        `received <${itemDraggedIndex}> and <${targetElIndex}>`)
    }
    let viewFields
    if (reorderedViewFieldsRef.current.length) {
      viewFields = [...reorderedViewFieldsRef.current]
    } else {
      viewFields = [...grid.selectedViewFields]
    }

    let itemDragged = viewFields.slice(itemDraggedIndex, +itemDraggedIndex + 1)[0]
    let itemsDraggedOneRemoved = viewFields.slice(0, +itemDraggedIndex).concat(viewFields.slice(+itemDraggedIndex + 1))

    targetElIndex = targetElIndex > itemDraggedIndex ? targetElIndex - 1 : targetElIndex
    let indexToSlice = orderType === 'before' ? +targetElIndex : +targetElIndex + 1
    let reorderedViewFieldsNext = [
      ...itemsDraggedOneRemoved.slice(0, indexToSlice),
      itemDragged,
      ...itemsDraggedOneRemoved.slice(indexToSlice)
    ]
    setReorderedViewFields(reorderedViewFieldsNext)
    localStorage.setItem('draggedElIndex', indexToSlice)
    localStorage.setItem('draggedEnteredIndex', orderType === 'before' ? indexToSlice + 1 : indexToSlice - 1)
  }

  function saveViewAfterNewOrder (reorderedViewFields) {
    let selectedView = grid.views.filter(v => v.selected)[0]
    let { name, id } = selectedView
    let { filter, resource: type, page_size: rows_per_page } = grid.fetchRowsParams
    let previousDetails = { id, type, name, filter, rows_per_page }
    settingsActions.saveAsync(previousDetails, reorderedViewFields)
    let cachedView = getCachedViewApiResponseIfExist(type)
    if (cachedView) {
      cachedView.data[0]['views'] = cachedView.data[0]['views'].map(v => {
        if (v.selected) v.view.fields = reorderedViewFields
        return v
      })
      cacheViewApiResponse(type, cachedView)
      gridActions.setRootReduxStateProp({
        selectedViewFields: reorderedViewFields
      })
    }
  }
  
  function refreshGrid () {
    gridActions.fetchRowsWithChangedParams()
  }

  function resetFilters () {
    gridActions.fetchRowsWithChangedParams({
      filter: grid.initialFilters,
      page_num: 1
    })
  }

  function selectView (id) {
    gridActions.selectView({ view: config.view, id })
  }

  function toggleOrderSummary () {
    setOrderSummaryVisible(orderSummaryVisible => !orderSummaryVisible)
  }

  function activateRow (row, index) {
    gridActions.setRootReduxStateProp_multiple({
      activeRow: row,
      activeRowIndex: index
    })
  }

  function handleScroll (event) {
    let last_known_scroll_position = event.target.scrollLeft
    let body_width = event.target.offsetWidth + last_known_scroll_position
    window.requestAnimationFrame(() => {
      scrollHorizontally(last_known_scroll_position, body_width)
    })
  }

  function scrollHorizontally (scroll_pos, body_width) {
    let header = document.querySelector('.table-container-header')
    header.style.left = -scroll_pos + 'px'
  }

  function handleMouseup (event) {
    if (global.window.resizeActive) {
      event.preventDefault()
      event.stopPropagation()
      setTimeout(() => {
        global.window.resizeActive = false
      })
      let selectedView = gridRef.current.views.filter(v => v.selected)[0]
      if (+selectedView.id !== 0 && +selectedView.id !== -1) {
        handleSaveView(global.window.calculatedWidth)
        // save to localstorage
        let { view: resource } = config
        let cachedView = getCachedViewApiResponseIfExist(resource)
        if (cachedView) {
          cachedView.data[0]['views'] = cachedView.data[0]['views'].map(v => {
            if (!v.selected) return v
            v.view.fields = v.view.fields.map(f => {
              if (f.field !== global.window.resizeField) return f
              f.width = global.window.calculatedWidth
              return f
            })
            return v
          })
          cacheViewApiResponse(resource, cachedView) // @TODO

        }
      }
      global.$('body').removeClass('resize-active')
    }
  }

  function handleSaveView (width) {
    let selectedView = grid.views.filter(v => v.selected)[0]
    let { name, id } = selectedView
    let { filter, resource: type, page_size: rows_per_page } = grid.fetchRowsParams
    let previousDetails = { id, type, name, filter, rows_per_page }
    let fields = grid.selectedViewFields.map(f => {
      let field = { field: f.field, alias: f.alias }
      if (width) {
        field.width = global.window.resizeField === field.field ? width : field.width
      }
      return {
        field: field.field,
        alias: field.alias,
        width: global.window.resizeField === field.field ? width : field.width
      }
    })
    settingsActions.saveAsync(previousDetails, fields)
  }

  function handleColumnResize () {
    global.window.resizeActive = false
    global.$(document).on('mousemove', handleMousemove)
    global.$(document).on('mouseup', handleMouseup)
  }

  function handleMousemove (event) {
    if (global.window.resizeActive) {
      let lastScreenX = event.screenX,
        headerCol = global.$('.gridview-header col')[global.window.resizeIndex],
        headerColWidth = headerCol.style.width.replace('px', ''),
        bodyCol = global.$('.gridview-body col')[global.window.resizeIndex],
        calculatedWidth
      if (lastScreenX > global.window.firstScreenX) {
        calculatedWidth = +(+headerColWidth + (lastScreenX - global.firstScreenX))
        calculatedWidth = calculatedWidth < +global.window.minWidth ? +global.window.minWidth : calculatedWidth
        headerCol.style.width = calculatedWidth + 'px'
        bodyCol.style.width = calculatedWidth + 'px'
        global.window.calculatedWidth = calculatedWidth
      } else {
        calculatedWidth = +(+headerColWidth - (global.firstScreenX - lastScreenX))
        calculatedWidth = calculatedWidth < global.window.minWidth ? global.window.minWidth : calculatedWidth
        headerCol.style.width = calculatedWidth + 'px'
        bodyCol.style.width = calculatedWidth + 'px'
      }
      global.window.firstScreenX = lastScreenX
      global.window.calculatedWidth = calculatedWidth
    }
  }

  function downloadView (format) {
    gridActions.downloadView(format)
  }

  function fetchRowsWithChangedParams (fetchRowsParams_received = {}) {
    gridActions.fetchRowsWithChangedParams(fetchRowsParams_received)
  }

  function onQuickFilterChange (filters_received = {}) {
    let { filter } = grid.fetchRowsParams
    let currentFiltersArray = [...filter.and]
    let receivedFiltersRemoved = currentFiltersArray.filter(
      currentFilter => !filters_received.hasOwnProperty(currentFilter.field)
    )
    let mergedFiltersArray = receivedFiltersRemoved
    Object.keys(filters_received).forEach(
      receivedFilterKey => {
        mergedFiltersArray = [
          ...mergedFiltersArray,
          ...filters_received[receivedFilterKey]
        ]
      }
    )
    fetchRowsWithChangedParams({
      filter: { and: mergedFiltersArray },
      page_num: 1
    })
  }

  function onFilterChange (filters_received = {}, refresh) {
    let { initialFilters } = grid
    let key = Object.keys(filters_received)[0]
    let matchedInitialFilters = initialFilters.and.filter(
      f => f.field === key
    )
    // filter is in the shape of { and : [ {field,oper,value}, {...} ] }
    let { filter } = grid.fetchRowsParams
    let currentFiltersArray = [...filter.and]
    // remove filters with the same keys that are received
    let receivedFiltersRemoved = currentFiltersArray.filter(
      currentFilter => !filters_received.hasOwnProperty(currentFilter.field)
    )
    // add received filters to the array
    let mergedFiltersArray = receivedFiltersRemoved
    Object.keys(filters_received).forEach(
      receivedFilterKey => {
        mergedFiltersArray = [
          ...mergedFiltersArray,
          ...filters_received[receivedFilterKey]
        ]
      }
    )
    if (matchedInitialFilters.length) {
      matchedInitialFilters.forEach(f => {
        mergedFiltersArray = [
          ...mergedFiltersArray,
          f
        ]
      })
    }
    if (refresh) {
      fetchRowsWithChangedParams({ filter: { and: mergedFiltersArray }, page_num: 1 })
    } else {
      gridActions.setRootReduxStateProp('fetchRowsParams', {
        ...grid.fetchRowsParams,
        filter: { and: mergedFiltersArray }
      })
    }
  }

  function onSortChange (sortObject = {}) {
    fetchRowsWithChangedParams({ sort: [sortObject] })
  }

  function paginateToPage (page) {
    fetchRowsWithChangedParams({ page_num: page })
  }

  function unsetFilter () {
    gridActions.fetchRowsWithChangedParams({ filter_id: null, page_num: 1 })
  }

  function selectFilter (id) {
    gridActions.fetchRowsWithChangedParams({ filter_id: id, page_num: 1 })
  }

  function onSchedulerClicked () {
    setShowScheduler(true)
  }

  function onSchedulerModalClosed () {
    global.$('#schedule_report').off('hidden.bs.modal', onSchedulerModalClosed)
    setShowScheduler(false)
  }

  function onExpireBundle () {
    let { activeRow } = grid
    bundleActions.expireBundle(activeRow['bundle_item_id'], activeRow['inv_type']).then( 
      () => {
        global.$('#bundle-expire').modal('hide')
        gridActions.fetchRowsWithChangedParams()
      }
    ).catch(
      e => {}
    )
  }

  function onCancelASNLine () {
    let { activeRow } = grid
    bundleActions.cancelASNLine(activeRow['dcl_po'], activeRow['dcl_po_line'], activeRow['order_type']).then( () => {
        global.$('#cancel-line-asn').modal('hide')
        gridActions.fetchRowsWithChangedParams()
      }
    ).catch(
      e => {}
    )
  }

  function onCloseShortASNLine () {
    let { activeRow } = grid
    bundleActions.closeShortASNLine(activeRow['dcl_po'], activeRow['dcl_po_line'], activeRow['order_type']).then( () => {
        global.$('#close-short-line-asn').modal('hide');
        gridActions.fetchRowsWithChangedParams()
      }
    ).catch(
      e => {}
    )
  }

  let isOrderSummaryHidden = config.gridSidebarSummary.hidden
  let isSchedulerHidden = config.schedulerHidden
  let orderSummaryVisibleNext = isOrderSummaryHidden ? false : orderSummaryVisible
  let {
    selectedViewFields,
    fetchRowsParams,
    views,
    rows,
    totalPages,
    totalRows,
    activeRowIndex,
    activeRow,
    filter_list,
    queryFilters
  } = grid

  let selectedViewMetaData = views.filter(v => v.selected)[0]

  if (reorderedViewFields.length) {
    selectedViewFields = reorderedViewFields
  }

  let isOrderDetailDisplay = search.includes("?orderNum=")
  let isItemDetailDisplay = search.includes("?itemNum=")
  let isRmaDetailDisplay = search.includes("?rmaNum=")
  let isTPDetailDisplay = search.includes("?tradingPartner=")

  let hideGridBody = isOrderDetailDisplay || isItemDetailDisplay || isRmaDetailDisplay || isTPDetailDisplay

  let {
    orderTypeColumnVisible,
    paginationWord,
    invoiceAllColumnVisible = false
  } = config.grid

  return (
    <div>

      {
        showScheduler &&
        <ScheduleReport isGrid={true} />
      }

      <div
        className={classNames({
          'table-container table-container-rr': true,
          'loading-grid': grid.loadingRows
        })}
        style={hideGridBody ? { display: "none" } : {}}
      >
        <Bar
          config={config.header}
          currentView={selectedViewMetaData}
          views={views}
          pathname={pathname}
          selectView={selectView}
          refresh={refreshGrid}
          orderSummaryVisible={orderSummaryVisibleNext}
          toggleOrderSummary={toggleOrderSummary}
          resetFilters={resetFilters}
          isToggleSummaryBtnVisible={!isOrderSummaryHidden}
          isSchedulerHidden={isSchedulerHidden}
          exportView={downloadView}
          filter_list={filter_list}
          unsetFilter={unsetFilter}
          selectFilter={selectFilter}
          filter_id={fetchRowsParams.filter_id}
          onSchedulerClicked={onSchedulerClicked}
        />
        <div className="gridview-container">

          <QuickFilters
            quickfilters={config.quick_filters}
            onQuickFilterChange={onQuickFilterChange}
            currentFilters={fetchRowsParams.filter}
            globalApi={globalApi}
            pathname={pathname}
            activeRow={activeRow}
            gridActions={gridActions}
            bundleActions={bundleActions}
          />
          <div
            className={classNames({
              'gridview-inner': true,
              'detail-active': orderSummaryVisibleNext
            })}
          >
            <div className="gridview-encloser pagination-active">
              <div className="gridview-content">
                <Header
                  {...config.grid.header}
                  key={config.view}
                  quickfilters={config.quick_filters}
                  queryFilters={queryFilters}
                  orderSummaryVisible={orderSummaryVisibleNext}
                  viewFields={selectedViewFields}
                  sort={onSortChange}
                  currentSort={fetchRowsParams.sort[0]}
                  orderTypeColumnVisible={orderTypeColumnVisible}
                  flagsColumnVisible={config.view === 'inventory-status'}
                  invoiceAllColumnVisible={invoiceAllColumnVisible}
                  toggleFilters={onFilterChange}
                  resource={config.view}
                  currentFilters={fetchRowsParams.filter.and}>
                  <ColGroup
                    viewFields={selectedViewFields}
                    lastColFixScroll={true}
                    orderTypeColumnVisible={orderTypeColumnVisible}
                    flagsColumnVisible={config.view === 'inventory-status'}
                    invoiceAllColumnVisible={invoiceAllColumnVisible}
                  />
                </Header>
                <div
                  className={classNames({
                    'table-container-body gridview-body': true,
                    'loadingTable': false && grid.loadingRows,
                    'order-summary-open': orderSummaryVisibleNext
                  })}
                  onScroll={(e) => { handleScroll(e) }}
                >
                  <Records
                    viewFields={selectedViewFields}
                    rowsPerPage={fetchRowsParams.page_size}
                    orderFields={rows}
                    activePagination={fetchRowsParams.page_num}
                    activateRow={activateRow}
                    activeRow={activeRow}
                    activeRowIndex={activeRowIndex}
                    handleScroll={handleScroll}
                    orderDetails={orderDetails}
                    isSearchAvailable={search.includes("?orderNum=")}
                    orderTypeColumnVisible={orderTypeColumnVisible}
                    invoiceAllColumnVisible={invoiceAllColumnVisible}
                    invoiceActions={invoiceActions}
                    bundleActions={bundleActions}
                    flagsColumnVisible={config.view === 'inventory-status'}
                    currentFilters={fetchRowsParams.filter.and}
                  >
                    <ColGroup
                      className="TableColGroup2"
                      viewFields={selectedViewFields}
                      lastColFixScroll={false}
                      orderTypeColumnVisible={orderTypeColumnVisible}
                      flagsColumnVisible={config.view === 'inventory-status'}
                      invoiceAllColumnVisible={invoiceAllColumnVisible}
                    />
                  </Records>
                </div>
              </div>
              <Pagination
                className={classNames({
                  'table-pagination gridview-pagination': true,
                  'order-summary-open': orderSummaryVisibleNext
                })}
                totalRows={totalRows}
                paginate={paginateToPage}
                activePagination={fetchRowsParams.page_num}
                totalPages={totalPages}
                paginationWord={paginationWord}
              />
              <BlockUi
                loadingRows={
                  grid.loadingRows
                }
                orderSummaryVisible={orderSummaryVisibleNext}
              />

            </div>

            {
              !isOrderSummaryHidden &&
              config.gridSidebarSummary.type === 'order' &&
              <SidebarSummary
                detail={activeRow ? activeRow : {}}
                emptySummaryMessage={'Select an order to see the overview.'}
                isBodyVisible={activeRowIndex && activeRow ? true : false}
                pathname={pathname}
                summaryHeadTitle={`Order #: ${activeRowIndex && activeRow ? activeRow.order_number : ''}`}
              />
            }

            {
              !isOrderSummaryHidden &&
              config.gridSidebarSummary.type === 'item' &&
              <SidebarSummary
                detail={activeRow ? activeRow : {}}
                emptySummaryMessage={'Select an item to see the overview.'}
                isBodyVisible={activeRowIndex && activeRow ? true : false}
                pathname={pathname}
                summaryHeadTitle={`Item #: ${activeRowIndex && activeRow ? activeRow.item_number : ''}`}
              />
            }

            {
              !isOrderSummaryHidden &&
              config.gridSidebarSummary.type === 'bundle' &&
              <SidebarSummary
                detail={activeRow ? activeRow : {}}
                emptySummaryMessage={'Select a bundle to see the overview.'}
                isBodyVisible={activeRowIndex && activeRow ? true : false}
                pathname={pathname}
                summaryHeadTitle={`Bundle #: ${activeRowIndex && activeRow ? activeRow.bundle_item_number : ''}`}
              />
            }

            {
              !isOrderSummaryHidden &&
              config.gridSidebarSummary.type === 'detail' &&
              <SidebarSummary
                detail={activeRow ? activeRow : {}}
                emptySummaryMessage={'Select an item to see the overview.'}
                isBodyVisible={activeRowIndex && activeRow ? true : false}
                pathname={pathname}
                summaryHeadTitle={`${pathname === '/detail/freight' || pathname === '/transportation/packages/shipping-detail'
                  ? 'Package #:'
                  : pathname === '/detail/serial'
                    ? 'Serial #:'
                    : 'Item #:'} ${activeRowIndex
                      ? pathname === '/detail/freight' || pathname === '/transportation/packages/shipping-detail'
                        ? activeRow.package_no
                        : pathname === '/detail/serial'
                          ? activeRow.serial_no
                          : activeRow.item_number
                      : ''
                  }`
                }
              />
            }

            {
              !isOrderSummaryHidden &&
              config.gridSidebarSummary.type === 'rma' &&
              <SidebarSummary
                detail={activeRow ? activeRow : {}}
                emptySummaryMessage={'Select an RMA to see overview.'}
                isBodyVisible={activeRowIndex && activeRow ? true : false}
                pathname={pathname}
                summaryHeadTitle={`RMA #: ${activeRowIndex && activeRow ? activeRow.rma_number : ''}`}
              />
            }
          </div>
        </div>
      </div>

      <ApproveModal
        view={config.view}
        filter={grid.fetchRowsParams.filter}
        gridActions={gridActions}
      >

      </ApproveModal>

      {isOrderDetailDisplay &&
        <OrderDetails />
      }
      {
        isItemDetailDisplay &&
        <ItemDetails />
      }
      {
        isRmaDetailDisplay &&
        <RmaDetails />
      }
      {
        isTPDetailDisplay &&
        <TPDetails />
      }

      {
        pathname === '/inventory/items/lotmaster' &&
        <LotRevisionModal
          gridActions={gridActions}
        />
      }
      {
        pathname === '/inventory/items/dg-data' &&
        <DGDataModal
          gridActions={gridActions}
        />
      }
      {
        pathname === '/inventory/items/status' &&
        <NewItemModal
          gridActions={gridActions}
        />
      }
      {
        pathname === '/inventory/items/bundle' &&
        <BundleModal
        bundleActions={bundleActions}
        />
      }

      {
        pathname === '/inventory/items/bundle' &&
        <ConfirmModal
          id="bundle-expire"
          confirmationMessage="Are you sure you want to expire this bundle?"
          onConfirmHandler={ onExpireBundle }
        />
      }

      {
        pathname === '/inventory/items/receiving' &&
        <ConfirmModal
          id="cancel-line-asn"
          confirmationMessage="Are you sure you want to cancel this ASN line?"
          note="Once canceled, please allow few seconds to see the changes reflected in the grid."
          onConfirmHandler={ onCancelASNLine }
        />
      }
      {
        pathname === '/inventory/items/receiving' &&
        <ConfirmModal
          id="close-short-line-asn"
          confirmationMessage="Are you sure you want to close short this ASN line?"
          note="Once close short, please allow few seconds to see the changes reflected in the grid."
          onConfirmHandler={ onCloseShortASNLine }
        />
      }
      {
        pathname === '/inventory/items/receiving' &&
        <EditASNModal
          gridActions={bundleActions}
          activeRow={activeRow}
        />
      }
    </div>
  )
}

GridMainWrapper.propTypes = {
    config: PropTypes.shape({
      view: PropTypes.string.isRequired,
      header: PropTypes.shape({
        pageIcon: PropTypes.string.isRequired,
        pageTitle: PropTypes.string.isRequired
      }),
      grid: PropTypes.shape({
        orderTypeColumnVisible: PropTypes.bool.isRequired,
        invoiceAllColumnVisible: PropTypes.bool,
        paginationWord: PropTypes.string.isRequired
      }),
      quick_filters: PropTypes.objectOf(PropTypes.shape({
        field: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.oneOf(Object.keys(QuickFilterTypes)),
        iconClassName: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
          key: PropTypes.string,
          oper: PropTypes.string,
          value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.any,
            PropTypes.bool
          ])
        }))
      }).isRequired),
      orderSummaryHidden: PropTypes.bool,
      gridSidebarSummary: PropTypes.shape({
        type: PropTypes.oneOf(['order', 'item', 'detail', 'rma', 'bundle']),
        hidden: PropTypes.bool
      })
    }),
    fetchRowsParams: PropTypes.shape({
      // only related keys of 'fetchRowsParams' shown,
      // for all keys see redux file initial state
      filter: PropTypes.shape({
        and: PropTypes.arrayOf(PropTypes.shape({
          field: PropTypes.string.isRequired,
          oper: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired
        }))
      }),
      page_num: PropTypes.any,
      page_size: PropTypes.any,
      sort: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        dir: PropTypes.string.isRequired
      }))
    }),
  }

export default withRouter(
  connect(
    state => ({
      activeRow: '',
      activeRowIndex: '',
      globalApi: state.common.globalApi,
      orderDetails: state.overview.orderDetails,
      settings: state.common.settings,
      grid: state.grid
    }),
    dispatch => ({
      settingsActions: bindActionCreators(settingsActions, dispatch),
      invoiceActions: bindActionCreators(invoiceActions, dispatch),
      gridActions: bindActionCreators(gridActions, dispatch),
      bundleActions: bindActionCreators(bundleActions, dispatch),
    })
  )(GridMainWrapper)
)