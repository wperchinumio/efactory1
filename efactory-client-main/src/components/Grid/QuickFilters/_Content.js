import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import DropDownFilter from './DropdownFilter'
import DaterangeFilter from './DateRangeFilter'
import BooleanFilter from './BooleanFilter'
import DateFilter from './DateFilter'
import InputTextFilter from './InputTextFilter'
import * as QF_CONSTANTS from './_Types'
import { getUserData } from '../../../util/storageHelperFuncs'

const QuickFilters = props => {
  const firstRun = useRef(true)
  const [currentFiltersShaped, setCurrentFiltersShaped] = useState(reshapeFilters(props.currentFilters))
  
  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      const currentFiltersShapedNext = reshapeFilters(props.currentFilters)
      setCurrentFiltersShaped(currentFiltersShapedNext)
    },
    [props.currentFilters]
  )

  /*
    receives the filter object in shape of { and : [ { ... } ] }
    return { shipped_date : { field : 'shipped_date', oper : '=', value : '123' }  }
  */
  function reshapeFilters (filters) {
    let reshaped_filters = {}
    filters.and.forEach( filter => {
      if( !reshaped_filters[ filter.field ] ) reshaped_filters[ filter.field ] = []
      reshaped_filters[ filter.field ].push( filter )
    } )
    return reshaped_filters
  }

  function mapQuickfilters (quickfilters = {}) {
    let quickfiltersJsx = []
    let { onQuickFilterChange } = props
    let quickfiltersCount = Object.keys(quickfilters).length

    Object.keys( quickfilters ).forEach( ( quickfilterField , index ) => {
      let quickfilter = quickfilters[ quickfilterField ]

      switch(true){
        case quickfilter.type === QF_CONSTANTS.DATE_RANGE_QF:
          let matchedCurrentFilter = currentFiltersShaped[ quickfilterField ]

          if( matchedCurrentFilter ){
            quickfilter.startDate = matchedCurrentFilter[0].value
            if( matchedCurrentFilter.length === 2 ){
              quickfilter.endDate = matchedCurrentFilter[1].value
            }
          }else{
            delete quickfilter.startDate
            delete quickfilter.endDate
          }

          quickfiltersJsx.push( (
            <DaterangeFilter
              { ...quickfilter }
              onQuickFilterChange={onQuickFilterChange}
              key={ `quickfilter-${quickfilter.field}-${index}` }
            />
          ) )
          break
        case quickfilter.type === QF_CONSTANTS.DROPDOWN_QF:
          if( quickfilter.field === 'total' ){
            quickfilter.keywordInsteadOfAll = 'Total'
          }
          if( quickfilter.field === 'inv_type_region' || quickfilter.field === 'location' ){
            let options    = []
            let warehouses = getUserData("warehouses")
            Object.keys( warehouses ).forEach( ( aWarehouse, i1 ) => {
              warehouses[ aWarehouse ].forEach( ( invType, i2 ) => {
                Object.keys( invType ).forEach( ( anInvType, i3) => {
                  let optionKey   =  quickfilter.field === 'location' ? aWarehouse :  `${anInvType}.${aWarehouse}`
                  let optionValue = `${aWarehouse} - ${anInvType}`
                  options.push({ key: optionValue, value: optionKey, oper: '=' })
                } )
              } )
            } )
            quickfilter.options = options
          }

          if( quickfilter.field === 'account_wh'){
            let accounts = []
            /*let defaultAccount = getUserData('account') + '.' + getUserData('region');
            if (props.entryPageType !== 'create_new') {
              // TODO: get from order
            }
            */
            //console.log('defaultAccount:', defaultAccount);
            let calc_account_regions = getUserData('calc_account_regions') || {}
            let calc_account_regions_keys = Object.keys( calc_account_regions )
            calc_account_regions_keys.sort( (a, b) => {
              if(a < b) return -1;
              if(a > b) return 1;
              return 0;
            })
            calc_account_regions_keys.forEach( accountObj => {
              accounts.push({ key: calc_account_regions[accountObj], value: accountObj, oper: '=' })
            })
            quickfilter.options = accounts
          }
          if( quickfilter.field === 'account_number' ){
            quickfilter.options = getUserData('calc_accounts').map(account => ({ key: account, value: account, oper: '=' }))
          }
          if( quickfilter.field === 'order_type' ){
            let { globalApi } = props
            let orderTypes = ( globalApi.globalApiData && globalApi.globalApiData.order_types ) || {}
            quickfilter.options = Object.keys( orderTypes ).map( orderTypeKey => (
              { key: `${orderTypeKey} - ${orderTypes[orderTypeKey]}`, value: orderTypeKey , oper: '=' }
            ))
          }
          if( currentFiltersShaped[ quickfilterField ]){
            let selected = currentFiltersShaped[ quickfilterField ][0]
            let filtered = quickfilter.options.filter( o => o.value === selected.value )
            if (filtered.length > 1) filtered = filtered.slice(0,1)
            if (selected && filtered.length === 0) {
              //selected.key = 'MULTI'
              quickfilter.defaultOption = selected;
            }
            else {
              if( filtered.length > 1 ) filtered = quickfilter.options.filter( o => o.oper === selected.oper )
              else if( filtered.length === 0 ) console.error(` No default value or oper found for ${quickfilter.field} `)
  
              selected.key = filtered[0].key
  
              quickfilter.defaultOption = selected
            }
          }else{
            delete quickfilter.defaultOption
          }
          quickfiltersJsx.push( (
            <DropDownFilter
              { ...quickfilter }
              onQuickFilterChange={onQuickFilterChange}
              key={ `quickfilter-${quickfilter.field}-${index}` }
            />
          ) )
          break
        case quickfilter.type === QF_CONSTANTS.BOOLEAN_QF:
          let matchedCurrentFilter2 = currentFiltersShaped[ quickfilterField ]
          quickfilter.checked = matchedCurrentFilter2 &&
                                (
                                  ['qty_short','qty_variance'].includes( quickfilter.field )
                                  ? matchedCurrentFilter2[0][ 'value' ] === 0
                                  : matchedCurrentFilter2[0][ 'value' ]
                                )
          quickfiltersJsx.push( (
            <BooleanFilter
              { ...quickfilter }
              onQuickFilterChange={ onQuickFilterChange }
              key={ `quickfilter-${quickfilter.field}-${index}` }
            />
          ) )
          break
        case quickfilter.type === QF_CONSTANTS.DATE_QF:
          let matchedCurrentFilter3 = currentFiltersShaped[ quickfilterField ]
          if( matchedCurrentFilter3 ) quickfilter.startDate = matchedCurrentFilter3[0].value
          else delete quickfilter.startDate
          quickfiltersJsx.push( (
            <DateFilter
              { ...quickfilter }
              onQuickFilterChange={onQuickFilterChange}
              key={ `quickfilter-${quickfilter.field}-${index}` }
            />
          ) )
          break
        case quickfilter.type === QF_CONSTANTS.INPUT_TEXT_QF:
          let matchedCurrentFilter4 = currentFiltersShaped[ quickfilterField ]
          quickfilter.isActive = matchedCurrentFilter4 ? true : false
          quickfilter.activeFilterValue = matchedCurrentFilter4 ? matchedCurrentFilter4[0].value : ''
          quickfiltersJsx.push( (
            <InputTextFilter
              { ...quickfilter }
              onQuickFilterChange={onQuickFilterChange}
              key={ `quickfilter-${quickfilter.field}-${index}` }
            />
          ) )
          break
        default:
      }

      // add QuickFilterTypes seperator for each QuickFilterTypes except the last one
      if( index < quickfiltersCount - 1 ){
        quickfiltersJsx.push( (
          <span
            className="quick-filter-sep"
            key={`seperator-${index}`}
          >|</span>
        ) )
      }
    } )

    return quickfiltersJsx
  }

  let {
    quickfilters,
    pathname,
    activeRow,
    gridActions,
    bundleActions,
  } = props

  let warehouse_filter = undefined;
  if (quickfilters) {
    warehouse_filter = quickfilters.inv_type_region
  }
  if (warehouse_filter && warehouse_filter.defaultOption) {
    warehouse_filter = warehouse_filter.defaultOption.value
  } else {
    warehouse_filter = undefined
  }

  return (
    <div className="gridview-quickfilters">
      <div className="filter-grid-container">
        <div className="filter-grp-header">
          <div className="applied-filters"></div>
          <div className="quick-filters">
            <span className="quick-filter-list">
              { mapQuickfilters( quickfilters ) }
            </span>
            {
              pathname === '/inventory/items/lotmaster' &&
              <div
                className="btn-group"
                style={{ float: 'right', marginRight: '13px' }}
              >
                <button
                  className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  style={{ paddingLeft: '20px' }}
                >
                  <span className="">ACTIONS</span>
                  <span className="filter-value selected-filter"></span>
                  <i className="fa fa-angle-down"></i>
                </button>
                <ul className="dropdown-menu pull-right grid-row-action-btn">
                  <li>
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0
                      }) }
                      onClick={ event => {
                        if(Object.keys(activeRow).length > 0){
                          gridActions.getLotRevision().then( () => {
                            global.$('#lot-revision').modal('show')
                          } ).catch( e => {} )
                        }
                      } }
                    >
                      <i className="fa fa-edit"></i>
                      Lot Revision
                    </a>
                  </li>
                </ul>
              </div>
            }
            {
              pathname === '/inventory/items/receiving' &&
              <div
                className="btn-group"
                style={{ float: 'right', marginRight: '13px' }}
              >
                <button
                  className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  style={{ paddingLeft: '20px' }}
                >
                  <span className="">ACTIONS</span>
                  <span className="filter-value selected-filter"></span>
                  <i className="fa fa-angle-down"></i>
                </button>
                <ul className="dropdown-menu pull-right grid-row-action-btn">
                  <li>
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0 || activeRow['qty_open'] === 0
                      }) }
                      onClick={ event => {
                        if(Object.keys(activeRow).length > 0 && activeRow['qty_open']> 0){
                            global.$('#edit-asn-line').modal('show')
                        }
                      } }
                    >
                      <i className="fa fa-edit"></i>
                      Edit 'Expected at DCL'
                    </a>
                  </li>
                  <li>
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0 || activeRow['qty_received'] !== 0
                      }) }
                      onClick={ event => {
                        if(Object.keys(activeRow).length > 0 && activeRow['qty_received'] === 0){
                          global.$('#cancel-line-asn').modal('show')
                        }
                      } }
                    >
                      <i className="fa fa-trash"></i>
                      Cancel ASN
                    </a>
                  </li>
                  <li>
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0 || !(activeRow['qty_open'] > 0 && activeRow['qty_received'] > 0)
                      }) }
                      onClick={ event => {
                        if(Object.keys(activeRow).length > 0 && activeRow['qty_received'] > 0 && activeRow['qty_open'] > 0){
                          global.$('#close-short-line-asn').modal('show')
                        }
                      } }
                    >
                      <i className="fa fa-times-circle-o"></i>
                      Close Short
                    </a>
                  </li>
                </ul>

              </div>
            }
            {
              pathname === '/inventory/items/dg-data' &&
              <div
                className="btn-group"
                style={{ float: 'right', marginRight: '13px' }}
              >
                <button
                  className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  style={{ paddingLeft: '20px' }}
                >
                  <span className="">ACTIONS</span>
                  <span className="filter-value selected-filter"></span>
                  <i className="fa fa-angle-down"></i>
                </button>
                <ul className="dropdown-menu pull-right grid-row-action-btn">
                  <li>
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0
                      }) }
                      onClick={ event => {

                        if(Object.keys(activeRow).length > 0){
                          gridActions.getDGData().then( () => {
                            global.$('#dg-data').modal('show')
                          } ).catch( e => {} )
                        }
                      } }
                    >
                      <i className="fa fa-edit"></i>
                      Edit DG Data
                    </a>
                  </li>
                </ul>

              </div>
            }
            {
              pathname === '/inventory/items/bundle' &&
              <div
                className="btn-group"
                style={{ float: 'right', marginRight: '13px' }}
              >
                <button
                  className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  style={{ paddingLeft: '20px' }}
                >
                  <span className="">ACTIONS</span>
                  <span className="filter-value selected-filter"></span>
                  <i className="fa fa-angle-down"></i>
                </button>
                <ul className="dropdown-menu pull-right grid-row-action-btn">
                  <li key="bundle-action-edit">
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0
                      }) }
                      onClick={ event => {
                        if (Object.keys(activeRow).length > 0) {
                          bundleActions.getBundleData(true, activeRow['bundle_item_id'], activeRow['inv_type']).then( () => {
                            global.$('#bundle').modal('show')
                          } ).catch( e => {} )
                        }
                      } }
                    >
                      <i className="fa fa-edit"></i>
                      Edit Bundle
                    </a>
                  </li>
                  <li key="bundle-action-delete">
                    <a
                      className={ classNames({
                        'disabled-link' : Object.keys(activeRow).length === 0
                      }) }
                      onClick={ event => {
                        if(Object.keys(activeRow).length > 0){
                          global.$('#bundle-expire').modal('show');
                        }
                      } }
                    >
                      <i className="fa fa-trash-o"></i>
                      Expire Bundle
                    </a>
                  </li>
                </ul>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

QuickFilters.propTypes = {
  quickfilters: PropTypes.object.isRequired,
  onQuickFilterChange: PropTypes.func.isRequired,
  currentFilters: PropTypes.object.isRequired,
  globalApi: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  activeRow: PropTypes.any,
  gridActions: PropTypes.object.isRequired
}

export default QuickFilters