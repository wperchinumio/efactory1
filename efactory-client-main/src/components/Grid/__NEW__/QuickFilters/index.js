import React from 'react'
import PropTypes from 'prop-types'
import DropDownFilter from './DropdownFilter'
import DaterangeFilter from './DateRangeFilter'
import BooleanFilter from './BooleanFilter'
import DateFilter from './DateFilter'
import InputTextFilter from './InputTextFilter'
import * as QF_CONSTANTS from './_Types'
import { getUserData } from '../../../../util/storageHelperFuncs'

const QuickFilters = ({
  children,
  currentFilters,
  globalApi,
  onQuickFilterChange,
  quickfilters,
  settings,

}) => {
  const currentFiltersShaped = reshapeFilters(currentFilters)
  /* 
    receives the filter object in shape of { and : [ { ... } ] } 
    return { shipped_date : { field : 'shipped_date', oper : '=', value : '123' }  }
  */
  function reshapeFilters (filters) {
    let reshaped_filters = {}
    if( filters.and ){
      filters.and.forEach( filter => {
        if( !reshaped_filters[ filter.field ] ) reshaped_filters[ filter.field ] = []
        reshaped_filters[ filter.field ].push( filter )
      } )
    }
    return reshaped_filters
  }

  function mapQuickfilters () {
    let quickfiltersJsx = []
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
          if( quickfilter.field === 'partner' ){
            quickfilter.options = settings.partners.map( ({ code, name }) => ({
              key   : `${ code } - ${ name }`,
              value : code,
              oper  : '='
            }) )
            // [ { key: 'BUY - BEST BUY', value: 'BUY', oper: '=' } ]
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
          if( quickfilter.field === 'account_number' ){
            quickfilter.options = getUserData('calc_accounts').map(account => ({ key: account, value: account, oper: '=' }))
          }

          if( quickfilter.field === 'order_type' ){
            let orderTypes = ( globalApi.globalApiData && globalApi.globalApiData.order_types ) || {}
            quickfilter.options = Object.keys( orderTypes ).map( orderTypeKey => (
              { key: `${orderTypeKey} - ${orderTypes[orderTypeKey]}`, value: orderTypeKey , oper: '=' }
            ) )
          }
          if( currentFiltersShaped[ quickfilterField ]){

            let selected = currentFiltersShaped[ quickfilterField ][0]
            let filtered = quickfilter.options.filter( o => o.value === selected.value )
            if (filtered.length > 1) {
              filtered = filtered.slice(0,1)
            }
            if (selected && filtered.length === 0) {
              //selected.key = 'MULTI'
              quickfilter.defaultOption = selected;
            } else {
              if( filtered.length > 1 ) {
                filtered = quickfilter.options.filter( o => o.oper === selected.oper )
              } else if (filtered.length === 0) {
                console.error(` No default value or oper found for ${quickfilter.field} `)
              }
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
          quickfilter.checked = matchedCurrentFilter2 && matchedCurrentFilter2[0][ 'value' ]
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
          if( matchedCurrentFilter3 ) {
            quickfilter.startDate = matchedCurrentFilter3[0].value
          } else {
            delete quickfilter.startDate
          }
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

  return (
    <div 
      className="gridview-quickfilters"
      style={{ height: '40px', padding: '8px' }}
    >
      <div className="filter-grid-container">
        <div className="filter-grp-header">
          <div className="applied-filters" />
          <div className="quick-filters">
            <span className="quick-filter-list">
              { mapQuickfilters() }
            </span>
            { children }
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
  settings: PropTypes.object.isRequired
}

export default QuickFilters