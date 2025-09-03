import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import history from '../../../history'
import { getUserData } from '../../../util/storageHelperFuncs'

const ItemDetailBar = ({
  fetchItems,
  gridActions,
  gridState,
  invoices,
  invoiceActions,
  itemDetail,
  location: {
    pathname
  },
  navigationHidden,
  onCloseModalClicked,
}) => {
  useEffect(
    () => {
      if( navigationHidden ){
        invoiceActions.setRootReduxStateProp({
          field : 'navigationHidden',
          value : false
        })
      }
    },
    []
  )

  function reload (event) {
    event.preventDefault()
    fetchItems()
  }

  function getCurrentMaxNumberIndex () {
    let { totalRows, fetchRowsParams, totalPages  } = gridState
    let { page_num } = fetchRowsParams
    page_num = +page_num
    if( page_num < totalPages ){
      return page_num * 100
    }else if( page_num === totalPages ){
      return totalRows
    }
  }

  function isNavButtonDisabled ( type = '' ) {
    let { activeRowIndex, fetchRowsParams, totalRows } = gridState
    let { page_num } = fetchRowsParams
    if( !activeRowIndex || !totalRows ) {
      return true
    }
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
    let { activeRowIndex } = gridState
    let currentArrayIndex = ( activeRowIndex % 100 !== 0 ? activeRowIndex % 100 : 100 ) - 1
    
    let returnData = findNextRow( currentArrayIndex, type, activeRowIndex  )
    
    if( !returnData ) return 
    let { rowNext } = returnData
    activeRowIndex = returnData.activeRowIndex
    
    history.push(
      `${pathname}?itemNum=${encodeURIComponent(rowNext[ 'item_number' ])}`
    )
    
    gridActions.setRootReduxStateProp_multiple({
      activeRow: rowNext,
      activeRowIndex
    })
  }
  
  function findNextRow( currentArrayIndex, type, activeRowIndex ) {
    let { totalRows, rows } = gridState
    let lastIndex = type === 'prev' ? 0 : +totalRows - 1
    currentArrayIndex = +currentArrayIndex + ( type === 'prev' ? -1 : +1 )
    let rowNext = rows[ currentArrayIndex ][ 'item_number' ] ? rows[ currentArrayIndex ] : false
    activeRowIndex = +activeRowIndex + ( type === 'prev' ? -1 : +1 )
    if( rowNext ) return { rowNext,  activeRowIndex }
    if( currentArrayIndex === lastIndex ) return false
    return findNextRow( currentArrayIndex, type, activeRowIndex )
  }

  function onNextButtonClicked () {
    let disabled = isNavButtonDisabled('next')
    if( !disabled ) onNavButtonClicked('next')
  }

  function onPrevButtonClicked () {
    let disabled = isNavButtonDisabled('prev')
    if( !disabled ) onNavButtonClicked('prev')
  }

  function print () {
    global.window.print()
  }

  function closeModal () {
    invoiceActions.setRootReduxStateProp({
      field: 'itemDetail',
      value: {}
    })
    invoiceActions.setRootReduxStateProp({
      field : 'navigationHidden',
      value : false
    })
    if( onCloseModalClicked ) return onCloseModalClicked()
    history.push(`${pathname.startsWith('/') ? pathname : '/' + pathname }`)
  }

  function onEditItemClicked () {

    if( !invoices.open.fetchItemDetailData.account_wh ){
      return
    }

    global.$('#edit-item').modal('show')

    let {
      upc = '',
      weight = '',
      dimension = '',
      serial_no = '',
      lot_days = '',
      serial_format = '',
      lot_format = ''
    } = invoices.open.itemDetail.shipping
    
    let {
      eccn = '',
      hcode = '',
      hcode_ca = '',
      coo = '',
      gl = '',
      cat = '',
    } = invoices.open.itemDetail.export

    let {
      li_b_cat = '',
      li_b_conf = '',
      li_t_type = '',
      cell_rp = '',
      unit_innerc = '',
      unit_masterc = '',
      wh_cell = '',
      net_wh = '',
    } = invoices.open.itemDetail.dg

    let { edi = [] } = invoices.open.itemDetail

    let company_code = getUserData('company_code')

    edi = edi.slice( 0, 9 )

    edi = edi.filter( e => e.tp !== company_code )

    edi = edi.slice( 0, 8 )

      
    invoiceActions.setRootReduxStateProp_multiple({
      editItemData : {
        shipping : {
          upc, weight, dimension, serial_no, lot_days, serial_format, lot_format
        },
        export : {
          eccn, hcode, hcode_ca, coo, gl, cat
        },
        dg : {
          li_b_cat, li_b_conf, li_t_type, cell_rp, unit_innerc, unit_masterc, wh_cell, net_wh
        },
        edi : [
          ...edi
        ],
        updateParams : {
          account_wh : invoices.open.fetchItemDetailData.account_wh,
          item_number: invoices.open.fetchItemDetailData.item_number,
          key_item   : invoices.open.itemDetail.detail.cat3 === 'KEY',
          desc1      : invoices.open.itemDetail.detail.desc1
        }
      },
      activeEditItemTab : 'shipping'
    })
  }

  let { activeRowIndex } = gridState
  let { page_num : currentPagination } = gridState.fetchRowsParams
  let minNumberOfPages, maxNumberOfPages
  if( !navigationHidden ){
    currentPagination = currentPagination ? +currentPagination : 1
    activeRowIndex = isNaN(activeRowIndex) ? -1 : +activeRowIndex

    minNumberOfPages = ( currentPagination - 1 ) * 100 + 1
    maxNumberOfPages = getCurrentMaxNumberIndex()
  }

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
        <span className="caption-subject font-green-seagreen sbold" style={{display: 'inline-block', verticalAlign: 'top', paddingRight: "10px"}}>
          ITEM #:
        </span>
        <span className="caption-subject font-gray sbold" style={{display: 'inline-block', paddingRight: "30px"}}>
          {' '}{ itemDetail.noResponse ? 'ITEM NOT FOUND' : ( itemDetail.detail ? itemDetail.detail.item_number : '' ) }
          <br/>{' '}<span style={{fontSize: "13px", paddingTop: "6px", display:'inline-block'}}>{ itemDetail.detail? itemDetail.detail.desc1: '' }</span>
        </span>
      </div>
      <span className="noselect">&nbsp;</span>
      <div className="actions hidden-print">
        {
          !navigationHidden && !itemDetail.noResponse &&
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
                className={ classNames({
                  'disabled-link' : !invoices.open.fetchItemDetailData.account_wh
                }) }
                onClick={ onEditItemClicked }
              >
                <i className="fa fa-edit"></i>
                Edit Item
              </a>
            </li>
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
    </div>
  )
}

ItemDetailBar.propTypes = {
  activeRowIndex    : PropTypes.any,
  currentPagination : PropTypes.any,
  fetchItems        : PropTypes.func,
  gridActions       : PropTypes.object.isRequired,
  gridItems         : PropTypes.any,
  invoiceActions    : PropTypes.object.isRequired,
  item_number       : PropTypes.string,
  itemDetail        : PropTypes.shape({
    detail       : PropTypes.shape(
      {
        item_number : PropTypes.string,
        desc1       : PropTypes.string,
        desc2       : PropTypes.string,
        lot_exp     : PropTypes.string,
        reorder     : PropTypes.string,
        pack        : PropTypes.string,
        cat1        : PropTypes.string,
        cat2        : PropTypes.string,
        cat3        : PropTypes.string,
        cat4        : PropTypes.string
      }
    ),
    shipping        : PropTypes.shape(
      {
        upc           : PropTypes.string,
        weight        : PropTypes.string,
        dimension     : PropTypes.string,
        serial_no     : PropTypes.string,
        serial_format : PropTypes.string,
        lot_days      : PropTypes.string,
        lot_format    : PropTypes.string
      }
    ),
    export : PropTypes.shape(
      {
        eccn     : PropTypes.string,
        hcode    : PropTypes.string,
        hcode_ca : PropTypes.string,
        coo      : PropTypes.string,
        gl       : PropTypes.string,
        cat      : PropTypes.string
      }
    ),
    dg : PropTypes.shape(
      {
        li_b_cat      : PropTypes.string,
        li_b_conf     : PropTypes.string,
        li_t_type     : PropTypes.string,
        cell_rp       : PropTypes.string,
        unit_innerc   : PropTypes.string,
        unit_masterc  : PropTypes.string,
        wh_cell       : PropTypes.string,
        net_wh        : PropTypes.string
      }
    ),
    edi : PropTypes.arrayOf( PropTypes.shape({
      tp : PropTypes.string,
      item_number : PropTypes.string
    })),
    charts : PropTypes.arrayOf( PropTypes.shape({
      period    : PropTypes.any,
      shipped   : PropTypes.any,
      returned  : PropTypes.any,
      received  : PropTypes.any,
      adjusted  : PropTypes.any
    }) )
  }),
  navigationHidden : PropTypes.bool,
  gridState        : PropTypes.object,
  onCloseModalClicked : PropTypes.any
}

export default withRouter(ItemDetailBar)