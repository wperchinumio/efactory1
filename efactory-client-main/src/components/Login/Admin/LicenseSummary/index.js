import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import FixableGrid from '../../../Grid/__NEW__/FixableGrid'
import { fmtnumber } from '../../../Grid/__NEW__/Body/RenderMethods'
import viewFieldsConfigData from './viewFieldsConfig'

const AdminEfactoryFees = props => {
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('policy_code')
  const [sortDirection, setSortDirection] = useState('ASC')
  const [viewFieldsConfig, setViewFieldsConfig] = useState([])
  
  useEffect(
    () => {
      listLicenseSummaries()
      setViewFieldsConfig(viewFieldsConfigData)
    },
    []
  )

  function listLicenseSummaries () {
    let { auth, loginActions } = props
    let { month, year } = auth
    loginActions.listLicenseSummaries(month, year)
  }
  
  function onSortClicked (sortObject = {}) {
    setSortField(Object.keys(sortObject)[0])
    setSortDirection(Object.values(sortObject)[0])
  }

  function sort (rows) {
    rows = [ ...rows ]
    rows.sort( ( first, second ) => {
      var firstValue = first[ sortField ]
      var secondValue = second[ sortField ]
      if (sortField === 'policy_code') {
        firstValue = firstValue.toLowerCase()
        secondValue = secondValue.toLowerCase()
      }
      return (firstValue < secondValue) 
             ? -1 
             : (firstValue > secondValue) 
               ? 1 
               : 0
    })
    if (sortDirection === 'desc') {
      rows.reverse()
    }
    rows = rows.map(
      (row, index) => ({...row, row_id : index + 1})
    )
    return rows
  }

  function onFilterChanged (event) {
    let month = event.currentTarget.getAttribute('data-month')
    let year = event.currentTarget.getAttribute('data-year')
    props.loginActions.listLicenseSummaries( month, year )
  }

  function calculateTotals (rows = []) {
    return rows.reduce( 
      ( prev, next ) => {
        let first  = prev[ 'total_charge' ]
        let second = next[ 'total_charge' ]
        return { 
          total_charge : first + second,
          total_new_customers : next[ 'is_new' ] 
            ? prev[ 'total_new_customers' ] + 1 
            : prev[ 'total_new_customers' ]
        }
      }, 
      { 
        total_charge : 0,
        total_new_customers : 0
      } 
    )
  }

  function filterRows (rows) {
    let filterValue_ = filterValue.trim()
    if ( !filterValue_ ) return rows
    filterValue_ = filterValue_.toLowerCase()
    rows = rows.filter( 
      ({ 
        policy_code,
        customer_name
      }) => {
        policy_code       = String( policy_code ).toLowerCase()
        customer_name     = String( customer_name ).toLowerCase()

        return  policy_code.includes( filterValue_ ) || customer_name.includes( filterValue_ )
      }
    )
    return rows
  }

  let { auth, loginActions } = props
  let { 
    license_summary_rows, 
    total_license_summary_rows,
    month,
    year,
    loadedSummaries
  } = auth

  let activeFilter = `${year} - ${month}`

  license_summary_rows = filterRows(license_summary_rows)

  license_summary_rows = sort(license_summary_rows)

  let isRowsLessThanTotal = +total_license_summary_rows && ( ( +total_license_summary_rows - license_summary_rows.length ) > 0 )

  let { 
    total_charge,
    total_new_customers
  } = calculateTotals(license_summary_rows)

  return (
    <div>
      <div className="portlet light bordered" style={{ padding: '12px 20px 5px 20px' }}>
        <div className="portlet-title">
          <div className="caption caption-md font-dark">
            <i className="fa fa-location-arrow font-blue"></i>
            <span className="caption-subject bold uppercase font-blue">
              License summary: <strong className="font-dark"> { total_license_summary_rows } </strong> 
              <span className="filtered-rows-number">
                { isRowsLessThanTotal ? `(${license_summary_rows.length} filtered)` : '' }
              </span>
            </span>
          </div>
          <div className="actions" style={{ marginLeft: '10px' }}>
            <div className="btn-group ">
              <button 
                type="button" 
                className="btn green-seagreen btn-sm"
                onClick={ loginActions.downloadLicenseSummary }
                style={{ marginRight : '10px' }}
                disabled={ !loadedSummaries }
              >
                <i className="fa fa-file-excel-o"></i> EXPORT
              </button>
            </div>
          </div>
          <div className="inputs" style={{ position: 'relative', bottom: '-2px' }}>
            <div 
              className="portlet-input input-inline input-large" 
              style={{ 
                borderRight : '1px solid #ccc',
                paddingRight : '10px'
              }}
            >
              <div className="input-icon right">
                <i className="icon-magnifier"></i>
                <input 
                  type="text" 
                  className="form-control input-circle" 
                  placeholder="filter" 
                  value={ filterValue }
                  id="customer-filter-input"
                  onChange={event => setFilterValue(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="actions">
            <div className="btn-group ">
              <button 
                type="button" 
                className="btn green-seagreen btn-sm"
                onClick={ listLicenseSummaries }
                style={{ marginRight : '10px' }}
              >
                <i className="fa fa-refresh"></i> Refresh
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
            <div className="btn-group">
              <button className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation" type="button" data-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-calendar" />
              <span className="font-red-soft bold">
                PERIOD
              </span>
              <span className="filter-value selected-filter" >
                { activeFilter }
              </span>
                <i className="fa fa-angle-down" />
                &nbsp;
                </button>
              <div className="dropdown-menu" role="menu">
                <ul className="filterRR">
                  {
                    (new Array( 12 )).fill(1).map( 
                      (x, index) => {
                        if (index === 0) {
                          return ' '
                        }
                        if (moment().subtract(index, 'month').format('YYYY - MM') < '2017 - 06') {
                          return <span key={`qf-${index}`} />
                        }
                        let minusMonth = moment().subtract( index , 'month')
                        let option = minusMonth.format('YYYY - MM')
                        let year = minusMonth.format('YYYY')
                        let month = minusMonth.format('MM')

                        let isActive = activeFilter === option
                        return (
                          <li 
                            key={`qf-${index}`}
                            className={ classNames({
                              'filterRR' : true,
                              'active'   : isActive
                            }) }
                            data-year={ year }
                            data-month={ month }
                            onClick={ onFilterChanged }
                          >
                            { option }
                          </li>
                        )
                      }
                    ) 
                  }
                </ul>
              </div>
            </div>
            <span>
              <span className="new-customer-bg-flag">
                <span className="sbold">NEW CUSTOMERS: { total_new_customers }</span>
              </span>
            </span>
            <div className="license-total-charge pull-right">
              Total charge period: <span className="bold"> 
                { fmtnumber( { total_charge }, 'total_charge', 2, 'true' ) }
              </span>
            </div>
          </div>
        <FixableGrid 
          heightToSubtract={ 229 }
          id="row-detail"
          columns={ viewFieldsConfig }
          rows={ license_summary_rows }
          defaultColumnsConfig={{
            columns : [ 'indexCol' ],
            data    : { /* @todo : invoiceActions in the future */ }
          }}
          currentSort={ {  
            [ sortField ] : sortDirection
          } }
          onSortChange={ onSortClicked }
          onRowClicked={() => {}}
        />
      </div>
    </div>
  )
}

AdminEfactoryFees.propTypes = {
  loginActions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

export default AdminEfactoryFees