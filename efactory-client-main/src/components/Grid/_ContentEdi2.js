import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import global from 'window-or-global'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import history from '../../history'
import * as settingsActions from '../Settings/redux/settings'
import * as invoiceActions from '../Invoices/Open/redux'
import * as gridActions from './redux'
import BlockUi from './BlockUi'
import Bar from './Bar'
import SidebarSummary from './_SidebarSummary/_Content'
import * as QuickFilterTypes from './QuickFilters/_Types'
import FixableGrid from './__NEW__/FixableGrid'
import RowDetail from './__NEW__/RowDetail'
import Pagination from './__NEW__/Pagination'
import QuickFiltersWrapper from './__NEW__/QuickFilters'
import colorsConfig from './__NEW__/_helpers/gridTopBarColorsConfig'
import EdiXmlOverviewModal from './Modals/EdiXmlOverviewModal'
import OrderDetails from '../DetailPages/OrderDetail/_Content'
import {
  cacheViewApiResponse,
  getCachedViewApiResponseIfExist,
  getUserData
} from '../../util/storageHelperFuncs'
import ConfirmModal from '../_Shared/Components/ConfirmModal'
import ScheduleReport from '../Scheduler/ScheduleReport/_Content'

const GridMainWrapper = ({
  config,
  globalApi,
  grid,
  gridActions,
  location: { search, pathname },
  settings = {},
  settingsActions,
}) => {
  const firstRun = useRef([true, true, true])
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false)
  const [reorderedViewFields, setReorderedViewFields] = useState([])
  const [showScheduler, setShowScheduler] = useState(false)
  const [ediModalVisible, setEdiModalVisible] = useState(false)
  const [resetGrid, setResetGrid] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [headerFilters, setHeaderFilters] = useState({})

  useEffect(
    () => {
      fetchViewsAndRecords()
      setHeaderFilters(getHeaderFilters())
      setHeaderConfigDataForManageFilters()
      return () => {
        gridActions.initializeGridReduxState()
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
      fetchViewsAndRecords()
      setReorderedViewFields([])
      setResetGrid(true)
      setHeaderFilters(getHeaderFilters())
      setEdiModalVisible(false)
      setHeaderConfigDataForManageFilters()

      global.$('.table-container-header').css({ left : 0 } )
    },
    [pathname]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (resetGrid) {
        setResetGrid(false)
      }
    },
    [resetGrid]
  )

  useEffect(
    () => {
      if (firstRun.current[2]) {
        firstRun.current[2] = false
        return
      }
      if (showScheduler) {
        setTimeout( () => {
          global.$('#schedule_report').modal('show')
          global.$('#schedule_report').on('hidden.bs.modal', onSchedulerModalClosed )
        }, 0 )
      }
    },
    [showScheduler]
  )
  
  function getHeaderFilters () {
    let { quick_filters } = config
    let { queryFilters } = grid
    let not_a_quickfilter_fields = Object.keys( queryFilters ).filter(
      field => !Object.keys( quick_filters ).includes( field )
    )
    let headerFilters = {}
    not_a_quickfilter_fields.forEach(
      field => {
        headerFilters[ field ] = queryFilters[ field ][ 0 ][ 'value' ]
      }
    )
    return headerFilters
  }

  function fetchViewsAndRecords () {

    let remember_filter_id = localStorage.getItem('remember_filter_id')
    if( remember_filter_id ) {
      localStorage.removeItem('remember_filter_id')
    }
    let { rowDetailHidden = false } = config
    let only_query_filters = search.includes('query_filters_exist')
    if( !rowDetailHidden ){
      gridActions.fetchView( config.view, remember_filter_id, only_query_filters )
      gridActions.fetchView_detailGrid( config.view, remember_filter_id )
    }else{
      gridActions.fetchView( config.view, remember_filter_id, only_query_filters )
    }
    if( only_query_filters ) {
      history.replace(pathname)
    }
  }

  function setHeaderConfigDataForManageFilters () {
    gridActions.setRootReduxStateProp(
      'manageFilters',
      {
        ...grid.manageFilters,
        headerConfig      : config.header,
        isHeaderConfigSet : true,
        resource          : config.view
      }
    )
  }

  function refreshGrid () {
    gridActions.fetchRowsWithChangedParams()
  }

  function resetFilters () {
    gridActions.fetchRowsWithChangedParams({
      filter    : grid.initialFilters,
      page_num  : 1
    })
    setResetGrid(true)
  }

  function selectView (id) {
    gridActions.selectView({ view : config.view, id })
  }

  function toggleOrderSummary () {
    setOrderSummaryVisible( orderSummaryVisible => !orderSummaryVisible )
  }

  function activateRow (row, index) {
    gridActions.setRootReduxStateProp_multiple({
      activeRow: row,
      activeRowIndex: index
    })
  }

  function downloadView () {
    gridActions.downloadView()
  }

  function fetchRowsWithChangedParams ( fetchRowsParams_received = {} ) {
    gridActions.fetchRowsWithChangedParams(fetchRowsParams_received)
  }

  function onQuickFilterChange ( filters_received = {} ) {
    let { filter } = grid.fetchRowsParams
    let currentFiltersArray = [ ...filter.and ]
    // remove filters with the same keys that are received
    let receivedFiltersRemoved = currentFiltersArray.filter(
      currentFilter => !filters_received.hasOwnProperty( currentFilter.field )
    )
    // add received filters to the array
    let mergedFiltersArray = receivedFiltersRemoved
    Object.keys( filters_received ).forEach(
      receivedFilterKey => {
        mergedFiltersArray = [
          ...mergedFiltersArray,
          ...filters_received[ receivedFilterKey ]
        ]
      }
    )
    fetchRowsWithChangedParams({
      filter: { and : mergedFiltersArray } ,
      page_num: 1
    })
  }

  function onFilterChange ( filters_received = [], filters_removed = [] ) {
    let receivedFilterFields = filters_received.map( f => f.field )
    let { initialFilters } = grid
    let matchedInitialFilters = initialFilters.and.filter(
      f => receivedFilterFields.includes( f.field )
    )
    // filter is in the shape of { and : [ {field,oper,value}, {...} ] }
    let { filter } = grid.fetchRowsParams
    let currentFiltersArray = [ ...filter.and ]
    // remove filters with the same keys that are received
    let receivedFiltersRemoved = currentFiltersArray.filter(
      currentFilter => !receivedFilterFields.includes( currentFilter.field )
    )

    let removedFiltersRemoved = receivedFiltersRemoved.filter(
      currentFilter => !filters_removed.includes( currentFilter.field )
    )

    // add received filters to the array
    removedFiltersRemoved = [ ...removedFiltersRemoved, ...filters_received ]

    if( matchedInitialFilters.length ){
      matchedInitialFilters.forEach( f => {
        removedFiltersRemoved = [
          ...removedFiltersRemoved,
          f
        ]
      } )
    }

    fetchRowsWithChangedParams({
      filter: { and: removedFiltersRemoved },
      page_num: 1
    })
  }

  function onSortChange ( sortObject = {} ) {
    fetchRowsWithChangedParams({ sort : [ sortObject ]  })
  }

  function paginateToPage (page) {
    fetchRowsWithChangedParams({ page_num: page  })
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
    global.$('#schedule_report').off('hidden.bs.modal', onSchedulerModalClosed )
    setShowScheduler(false)
  }

  function onToggleButtonClicked (event) {
    setDetailOpen(detailOpen => !detailOpen)
  }

  function getActionsNextToPagination () {
    let { activeRowIndex, activeRow, multiple_selected_active_rows = [], rows } = grid
    let disabled = activeRowIndex ? false : true

    let default_menu = [
      {
        name : 'Show ASN',
        onClick : () => {
          if( !disabled ){
            gridActions.setRootReduxStateProp_multiple({
              queryFilters : {
                order_number : [
                  { field : 'order_number', value : activeRow.order_number , oper : '=' }
                ]
              }
            }).then( () => {
              history.push( `/edi/documents/asn-856?query_filters_exist=true` )
            } ).catch( e => {} )
          }
        },
        disabled
      },
      {
        name : 'Show Invoice',
        onClick : () => {
          if( !disabled ){
            gridActions.setRootReduxStateProp_multiple({
              queryFilters : {
                order_number : [
                  { field : 'order_number', value : activeRow.order_number , oper : '=' }
                ]
              }
            }).then( () => {
              history.push( `/edi/documents/invoice-810?query_filters_exist=true` )
            } ).catch( e => {} )
          }
        },
        disabled
      },
      {
        name : 'Show EDI Documents',
        onClick : () => {
          setEdiModalVisible(true)
        },
        disabled
      }
    ]

    let to_approve_menu = [
      {
        name : 'Authorize selected orders',
        onClick : () => {
          global.$('#confirm-authorize-selected-orders').modal('show')
        },
        disabled : multiple_selected_active_rows.length ? false : true,
        requiresCheckboxes : true
      },
      {
        name : 'Reject selected orders',
        onClick : () => {
          global.$('#confirm-reject-selected-orders').modal('show')
        },
        disabled : multiple_selected_active_rows.length ? false : true,
        requiresCheckboxes : true
      }
    ]

    let to_resolve_menu = [
      {
        name : 'Revalidate selected orders',
        onClick : () => {
          global.$('#confirm-revalidate-selected-orders').modal('show')
        },
        disabled : multiple_selected_active_rows.length ? false : true,
        requiresCheckboxes : true
      },
      {
        name : 'Delete selected orders',
        onClick : () => {
          global.$('#confirm-delete-selected-orders').modal('show')
        },
        disabled : multiple_selected_active_rows.length ? false : true,
        requiresCheckboxes : true
      }
    ]

    let disabled_undo_rejected = true

    if( multiple_selected_active_rows.length ){
      let unrejectableRows = rows.filter( ({ row_id }) => multiple_selected_active_rows.includes( row_id ) ).filter( ({ processing_status }) => processing_status !== 'Rejected' )
      if( unrejectableRows.length > 0 ){
        disabled_undo_rejected = true
      }else{
        disabled_undo_rejected = false
      }
    }else{
      disabled_undo_rejected = true
    }

    let undo_rejected = [
      {
        name : 'Undo rejected',
        onClick : () => {
          global.$('#confirm-undo-rejected').modal('show')
        },
        disabled : disabled_undo_rejected,
        requiresCheckboxes : true
      }
    ]

    let is_local_admin = getUserData('is_local_admin')

    switch( pathname ){
      case '/edi/documents/orders-to-approve':
        return [...to_approve_menu, {name: 'divider'}, ...default_menu]
      case '/edi/documents/orders-to-resolve':
        return is_local_admin ? [...to_resolve_menu, {name: 'divider'}, ...default_menu ] : default_menu
      case '/edi/documents/order-history':
        return is_local_admin ? [...undo_rejected, {name: 'divider'}, ...default_menu ] : default_menu
      case '/edi/documents/asn-856':
        return [
          {
            name : 'Show Invoice',
            onClick : () => {
              if( !disabled ){
                gridActions.setRootReduxStateProp_multiple({
                  queryFilters : {
                    order_number : [
                      { field : 'order_number', value : activeRow.order_number , oper : '=' }
                    ]
                  }
                }).then( () => {
                  history.push( `/edi/documents/invoice-810?query_filters_exist=true` )
                } ).catch( e => {} )
              }
            },
            disabled
          },
          {
            name : 'Show EDI Documents',
            onClick : () => {
              setEdiModalVisible(true)
            },
            disabled
          }
        ]
      case '/edi/documents/invoice-810':
        return [
          {
            name : 'Show ASN',
            onClick : () => {
              if( !disabled ){
                gridActions.setRootReduxStateProp_multiple({
                  queryFilters : {
                    order_number : [
                      { field : 'order_number', value : activeRow.order_number , oper : '=' }
                    ]
                  }
                }).then( () => {
                  history.push( `/edi/documents/asn-856?query_filters_exist=true` )
                } ).catch( e => {} )
              }
            },
            disabled
          },
          {
            name : 'Show EDI Documents',
            onClick : () => {
              setEdiModalVisible(true)
            },
            disabled
          }
        ]
      case '/edi/documents/orders-to-ship':
        return default_menu
      default:
        return []
    }
  }

  function ediModalClosed (event) {
    setEdiModalVisible(false)
  }

  function onColumnsReordered (reorderedViewFields) {

    let {
      views,
      fetchRowsParams
    } = grid

    let selectedView = views.filter( v => v.selected )[0]

    if( +selectedView.id !== 0 && +selectedView.id !== -1  ){

      let { name, id } = selectedView
      let { filter, resource : type, page_size : rows_per_page } = fetchRowsParams

      let previousDetails = { id, type, name, filter, rows_per_page }

      settingsActions.saveAsync( previousDetails, reorderedViewFields )

      let cachedView = getCachedViewApiResponseIfExist(type)
      if( cachedView ){
        cachedView.data[0]['views'] = cachedView.data[0]['views'].map( v => {
          if( v.selected ) v.view.fields = reorderedViewFields
          return v
        } )
        cacheViewApiResponse(type, cachedView)
        gridActions.setRootReduxStateProp({
          selectedViewFields : reorderedViewFields
        })
      }

    }
  }

  function onColumnFixedChanged (fixedColumns) {

    let {
      views,
      fetchRowsParams,
      selectedViewFields
    } = grid

    let selectedView = views.filter( v => v.selected )[0]

    if( +selectedView.id !== 0 && +selectedView.id !== -1  ){

      let { name, id } = selectedView
      let { filter, resource : type, page_size : rows_per_page } = fetchRowsParams

      let previousDetails = { id, type, name, filter, rows_per_page }

      selectedViewFields = selectedViewFields.map(
        v_fields => {
          return {
            ...v_fields,
            fixed_column: fixedColumns.includes( v_fields.field ) ? true : false
          }
        }
      )

      settingsActions.saveAsync( previousDetails, selectedViewFields )

      let cachedView = getCachedViewApiResponseIfExist(type)
      if( cachedView ){
        cachedView.data[0]['views'] = cachedView.data[0]['views'].map( v => {
          if( v.selected ) v.view.fields = selectedViewFields
          return v
        } )
        cacheViewApiResponse(type, cachedView)
        gridActions.setRootReduxStateProp({
          selectedViewFields
        })
      }

    }
  }

  function onConfirmAuthorizeSelectedOrders (event) {
    let { multiple_selected_active_rows = [], rows } = grid

    rows = rows.filter(
      ({ row_id }) => multiple_selected_active_rows.includes( row_id )
    ).map(
      ({ order_number }) => order_number
    )

    gridActions.authorizeSelectedOrders( rows ).then(
      () => {
        global.$('#confirm-authorize-selected-orders').modal('hide')
        refreshGrid()
      }
    ).catch(
      e => {}
    )
  }

  function onConfirmRejectSelectedOrders (event) {
    let { multiple_selected_active_rows = [], rows } = grid

    rows = rows.filter(
      ({ row_id }) => multiple_selected_active_rows.includes( row_id )
    ).map(
      ({ order_number }) => order_number
    )

    gridActions.rejectSelectedOrders( rows ).then(
      () => {
        global.$('#confirm-reject-selected-orders').modal('hide')
        refreshGrid()
      }
    ).catch(
      e => {}
    )
  }

  function onConfirmRevalidateSelectedOrders (event) {
    let { multiple_selected_active_rows = [], rows } = grid

    rows = rows.filter(
      ({ row_id }) => multiple_selected_active_rows.includes( row_id )
    ).map(
      ({ message_id }) => message_id
    )

    gridActions.revalidateSelectedOrders( rows ).then(
      () => {
        global.$('#confirm-revalidate-selected-orders').modal('hide')
        refreshGrid()
      }
    ).catch(
      e => {}
    )
  }

  function onConfirmDeleteSelectedOrders (event) {
    let { multiple_selected_active_rows = [], rows } = grid

    rows = rows.filter(
      ({ row_id }) => multiple_selected_active_rows.includes( row_id )
    ).map(
      ({ message_id }) => message_id
    )

    gridActions.deleteSelectedOrders( rows ).then(
      () => {
        global.$('#confirm-delete-selected-orders').modal('hide')
        refreshGrid()
      }
    ).catch(
      e => {}
    )
  }

  function onConfirmUndoRejected (event) {
    let { multiple_selected_active_rows = [], rows } = grid

    rows = rows.filter(
      ({ row_id }) => multiple_selected_active_rows.includes( row_id )
    ).map(
      ({ message_id }) => message_id
    )

    gridActions.undoRejected( rows ).then(
      () => {
        global.$('#confirm-delete-selected-orders').modal('hide')
        refreshGrid()
      }
    ).catch(
      e => {}
    )
  }

  function onRowCheckboxStatusChanged ({ row_id, header_id, row, index }, add_or_remove) {
    let {
      multiple_selected_active_rows = [],
      rows
    } = grid

    if ( add_or_remove === 'add' ) {
      multiple_selected_active_rows = [ ...multiple_selected_active_rows, index ]
      if( rows.length === multiple_selected_active_rows.length ){
        global.$('.header-index-col').addClass('checked-checkbox')
      }
    } else {
      global.$('.header-index-col.checked-checkbox').removeClass('checked-checkbox')
      multiple_selected_active_rows = multiple_selected_active_rows.filter( index_ => index_ !== index  )
    }

    gridActions.setRootReduxStateProp_multiple({
      multiple_selected_active_rows
    })
  }

  function onCheckAllItemsStatusChanged () {
    let {
      rows = [],
      multiple_selected_active_rows
    } = grid

    let isAllChecked = multiple_selected_active_rows.length > 0 && multiple_selected_active_rows.length === rows.length

    if( isAllChecked ){
      multiple_selected_active_rows = []
      global.$('.index-col-wrapper-cell.checked-checkbox').removeClass('checked-checkbox')
      global.$('.header-index-col.checked-checkbox').removeClass('checked-checkbox')
    }else{
      multiple_selected_active_rows = rows.map( ({ row_id }) => row_id )
      global.$('.index-col-wrapper-cell').addClass('checked-checkbox')
      global.$('.header-index-col').addClass('checked-checkbox')
    }
    setTimeout( () => {
      gridActions.setRootReduxStateProp_multiple({
        multiple_selected_active_rows
      })
    }, 0 )
  }

  function onRowClicked ({ row_id, header_id, row, index }) {
    let { rowDetailHidden = false } = config || {}

    if( !rowDetailHidden  ){
      gridActions.fetchRowsWithChangedParams_detailGrid({ filter: {
        and: [
          {
            field:"header_id",
            oper:"=",
            value: header_id
          }
        ]
      } })
    }
    activateRow( row, index )
  }

  function isWithCheckboxes () {
    let { checkboxesAllowed, checkboxesAllowed_requireAdmin } = config
    if( !checkboxesAllowed ) {
      return false
    }
    let is_local_admin = getUserData('is_local_admin')
    if( checkboxesAllowed_requireAdmin && !is_local_admin ) {
      return false
    }
    return true
  }

  let isOrderSummaryHidden  = config.gridSidebarSummary.hidden
  let isSchedulerHidden     = config.schedulerHidden

  let orderSummaryVisible_ = isOrderSummaryHidden ? false : orderSummaryVisible

  let {
    selectedViewFields,
    fetchRowsParams,
    views,
    rows,
    totalPages,
    totalRows,
    activeRowIndex = '',
    activeRow = '',
    filter_list,
    multiple_selected_active_rows = []
  } = grid

  let selectedViewMetaData = views.filter( v => v.selected )[0]

  if( reorderedViewFields.length ) {
    selectedViewFields = reorderedViewFields
  }

  let { paginationWord } = config.grid

  let {
    rowDetailHidden = false,
    identifiers = {}
  } = config

  let {
    single_word = '',
    a_single_word = '',
    // plural_word = '',
  } = identifiers

  let heightToSubtract = 0

  heightToSubtract = !rowDetailHidden && detailOpen ? 428 : 195

  let currentColorsConfig = colorsConfig[ pathname ]

  let actions = getActionsNextToPagination()

  let isOrderDetailVisible = search.includes("?orderNum=")

  let withCheckboxes = isWithCheckboxes()

  return (
    <div>
      {
        showScheduler &&
        <ScheduleReport isGrid={true} />
      }
      <div
        className={ classNames({
          'table-container table-container-rr grid-component-parent' : true,
          'detail-active' : orderSummaryVisible_
        }) }
        style={{
          marginLeft : '4px',
          display : ediModalVisible || isOrderDetailVisible ? 'none' : 'block'
        }}
      >

        <Bar
          config={ config.header }
          currentView={ selectedViewMetaData }
          views={ views }
          pathname={ pathname }
          selectView={ selectView }
          refresh={ refreshGrid }
          orderSummaryVisible={ orderSummaryVisible_ }
          toggleOrderSummary={ toggleOrderSummary}
          resetFilters={ resetFilters }
          isToggleSummaryBtnVisible={ !isOrderSummaryHidden }
          isSchedulerHidden={ isSchedulerHidden }
          exportView={ downloadView }
          filter_list={ filter_list }
          unsetFilter={ unsetFilter }
          selectFilter={ selectFilter }
          filter_id={ fetchRowsParams.filter_id }
          onSchedulerClicked={ onSchedulerClicked }
        />

        {
          !currentColorsConfig
          ? <QuickFiltersWrapper
              quickfilters={ config.quick_filters }
              onQuickFilterChange={ onQuickFilterChange }
              currentFilters={ fetchRowsParams.filter }
              globalApi={ globalApi }
              settings={ settings }
            >

              {
                actions.length > 0 &&

                <div className="btn-group" style={{ float: 'right', marginRight: 13 }}>
                  <button
                    className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
                    type="button"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    style={{paddingLeft: 20}}
                  >
                    <span>
                      ACTIONS
                    </span>
                    <span className="filter-value selected-filter" />
                    <i className="fa fa-angle-down" />
                  </button>
                  <ul className="dropdown-menu pull-right grid-row-action-btn">
                    {
                      actions.map( (action, i) => {
                        let { name, disabled, onClick } = action
                        return name === 'divider'?
                          <li className="divider" key={ `divider-${i}`} ></li>
                          :
                          <li key={ `pag-action-${name}` }>
                            <a
                              className={ classNames({
                                'disabled-link' : disabled,
                              }) }
                              onClick={ event => {
                                event.preventDefault()
                                if( !disabled ){
                                  onClick()
                                }
                              } }
                            >
                              { name }
                            </a>
                          </li>
                      } )
                    }
                  </ul>
                </div>
              }

            </QuickFiltersWrapper>
          : <div style={{ height : '40px', width : '100%' }}>
              {
                currentColorsConfig.map( ( { color, label }, index ) => {
                  return (
                    <span
                      key={ `color-${index}` }
                      style={ color === 'blue' ? { borderLeft : '3px double #999', marginLeft : '20px'  } : {} }
                      >
                      <span
                        className={ classNames({
                          'color-square' : true,
                          [ color ] : true
                        }) }
                      ></span>
                      <span className="color-square-label">
                        { label }
                      </span>
                    </span>
                  )
                } )
              }
            </div>
        }

        <div className="top-bottom-grids-wrapper">
          <div className="top-side-grid">

              <FixableGrid
                heightToSubtract={ heightToSubtract }
                id="top-grid"
                columns={ selectedViewFields }
                rows={ rows }
                defaultColumnsConfig={{
                  columns : config.defaultColumns,
                  data    : { /* @todo : invoiceActions in the future */ }
                }}
                onColumnFixedChanged={ onColumnFixedChanged }
                currentSort={ fetchRowsParams.sort[0] }
                onSortChange={ onSortChange }
                onHeaderFilterChanged={ onFilterChange }
                onRowClicked={ onRowClicked }
                header_filters={ headerFilters }
                resizedFromOutside={ orderSummaryVisible_ }
                headerDoubleLinePattern={ pathname === '/edi/trading-partners/dcl-partners' ? "edi \\d+ " : undefined }
                resetGrid={ resetGrid }
                onColumnsReordered={ onColumnsReordered }
                isWithCheckboxes={ withCheckboxes }
                multiple_selected_active_rows={ multiple_selected_active_rows }
                onRowCheckboxStatusChanged={ onRowCheckboxStatusChanged }
                onCheckAllItemsStatusChanged={ onCheckAllItemsStatusChanged }
              />

              <Pagination
                className={ 'table-pagination gridview-pagination fixable-grid-pagination' }
                totalRows={ totalRows }
                paginate={ paginateToPage }
                activePagination={ fetchRowsParams.page_num }
                totalPages={ totalPages }
                paginationWord={ paginationWord }
                onToggleButtonClicked={ onToggleButtonClicked }
                detailOpen={ detailOpen }
                defaultHeight={ 231 }
                rowDetailHidden={ rowDetailHidden }
              />

              <BlockUi
                loadingRows={
                  grid.loadingRows
                }
                orderSummaryVisible={orderSummaryVisible_}
              />
            </div>

            {
              !rowDetailHidden &&
              <RowDetail
                onToggleButtonClicked={ onToggleButtonClicked }
                detailOpen={ detailOpen }
                defaultHeight={ 231 }
                resizedFromOutside={ orderSummaryVisible_ }
              />
            }
        </div>

        {
          true &&
          <SidebarSummary
            detail={ activeRow ? activeRow : {} }
            emptySummaryMessage={ `Select ${a_single_word} to see the overview.` }
            isBodyVisible={ activeRowIndex && activeRow ? true : false }
            pathname={ pathname }
            summaryHeadTitle={
              `${single_word.slice(0,1).toUpperCase() + single_word.slice(1)} #: ${ activeRowIndex && activeRow
                                                    ?  activeRow.order_number || activeRow.order_id || activeRow.reference_number|| activeRow.upc || activeRow.record_id || 'TODO'
                                                    : ''
                                                  }`
            }
          />
        }


      </div>

      {
        ediModalVisible &&
        <EdiXmlOverviewModal
          onCloseClicked={ ediModalClosed }
          gridState={ grid }
          rowData={activeRow ? activeRow : {}}
          gridActions={ gridActions }
        />
      }

      {
        isOrderDetailVisible &&
        <OrderDetails />
      }

      <ConfirmModal
        id="confirm-authorize-selected-orders"
        confirmationMessage="Are you sure you want to authorize the selected orders?"
        onConfirmHandler={ onConfirmAuthorizeSelectedOrders }
      />

      <ConfirmModal
        id="confirm-reject-selected-orders"
        confirmationMessage="Are you sure you want to reject the selected orders?"
        onConfirmHandler={ onConfirmRejectSelectedOrders }
      />

      <ConfirmModal
        id="confirm-revalidate-selected-orders"
        confirmationMessage="Are you sure you want to validate the selected orders?"
        onConfirmHandler={ onConfirmRevalidateSelectedOrders }
      />

      <ConfirmModal
        id="confirm-delete-selected-orders"
        confirmationMessage="Are you sure you want to delete the selected orders?"
        onConfirmHandler={ onConfirmDeleteSelectedOrders }
      />

      <ConfirmModal
        id="confirm-undo-rejected"
        confirmationMessage="Are you sure you want to un-reject the selected rejected orders?"
        onConfirmHandler={ onConfirmUndoRejected }
      />
    </div>
  )
}

GridMainWrapper.propTypes = {
  config : PropTypes.shape({
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
    quick_filters: PropTypes.objectOf( PropTypes.shape({
      field: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.oneOf(Object.keys(QuickFilterTypes)),
      iconClassName: PropTypes.string,
      options: PropTypes.arrayOf( PropTypes.shape({
        key: PropTypes.string,
        oper: PropTypes.string,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.any,
          PropTypes.bool
        ])
      }))
    }).isRequired),
    orderSummaryHidden : PropTypes.bool,
    gridSidebarSummary : PropTypes.shape({
      type : PropTypes.oneOf([ 'order', 'item', 'detail', 'rma' ]),
      hidden : PropTypes.bool
    }),
    rowDetailHidden    : PropTypes.bool
  }),
  fetchRowsParams     : PropTypes.shape({
    filter    : PropTypes.shape({
      and : PropTypes.arrayOf( PropTypes.shape({
        field : PropTypes.string.isRequired,
        oper  : PropTypes.string.isRequired,
        value : PropTypes.any.isRequired
      }) )
    }),
    page_num  : PropTypes.any,
    page_size : PropTypes.any,
    sort      : PropTypes.arrayOf( PropTypes.shape({
      field : PropTypes.string.isRequired,
      dir   : PropTypes.string.isRequired
    }) )
  }),
}

export default withRouter(
  connect(
    state => ({
      globalApi: state.common.globalApi,
      orderDetails: state.overview.orderDetails,
      settings: state.common.settings,
      grid: state.grid
    }),
    dispatch => ({
      settingsActions: bindActionCreators( settingsActions,  dispatch ),
      invoiceActions: bindActionCreators( invoiceActions,   dispatch ),
      gridActions: bindActionCreators( gridActions,      dispatch ),
    })
  )(GridMainWrapper)
)