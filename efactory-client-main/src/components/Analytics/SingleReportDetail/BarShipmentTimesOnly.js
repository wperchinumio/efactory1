import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import DropDownFilter from '../../Grid/QuickFilters/DropdownFilter'
import DaterangeFilter from '../../Grid/QuickFilters/DateRangeFilter'
import BooleanFilter from '../../Grid/QuickFilters/BooleanFilter'

const AnalyticsSingleReportBar = ({
  analyticsActions,
  analyticsState,
  exportReport,
  filter,
  generateReport,
  loaded
}) => {
  const filterRef = useRef(null)
  filterRef.current = filter

  const onFilterChange = useCallback(
    filterObj => {
      let field = Object.keys(filterObj)[0]

      if (field === 'policy_code') {
        let value = filterObj[field][0]['value']
        return analyticsActions.readSelectedCustomerData(value)
      }
      
      analyticsActions.setRootReduxStateProp( 'filter', {
        ...filterRef.current, 
        [field]: filterObj[field] // value will be an array
      } )
    },
    [filter]
  )

  function getCustomerOptions () {
    let authToken = JSON.parse( localStorage.getItem('authToken') ) || {}
    let { available_accounts = [] } = authToken
    return available_accounts.map(
      ({ username, company }) => ({ 
        key: `${ username.toUpperCase() } - ${ company.replace(/\d+ - /, '') }`, 
        value: username,
        oper: '=' 
      })
    )
  }

  
  let {
    selected_customer,
    selected_customer_data
  } = analyticsState

  let policy_code_options = getCustomerOptions()

  let locationOptions    = []
  let calc_accounts      = []

  let warehouses = selected_customer 
                   ? selected_customer_data[ selected_customer ] || {}
                   : {}
  Object.keys( warehouses ).forEach( ( aWarehouse, i1 ) => {
    warehouses[ aWarehouse ].forEach( ( invType, i2 ) => {
      Object.keys( invType ).forEach( ( anInvType, i3) => {
        let optionKey   =  aWarehouse
        let optionValue = `${aWarehouse} - ${anInvType}`
        calc_accounts = [ ...calc_accounts, ...invType[ anInvType ] ]
        locationOptions.push({ key: optionValue, value: optionKey, oper: '=' })
      } )
    } )
  } )

  let calc_accounts_copy = []
  // remove same occurences od accounts
  calc_accounts.forEach( account => {
    if( !calc_accounts_copy.includes( account ) ){
      calc_accounts_copy.push( account )
    }
  } )

  let accOptions = calc_accounts_copy.map(
    account => ({ key: account, value: account, oper: '=' })
  )


  let { 
    shipped_date = [], 
    received_date = [],
    account_number = [], 
    location = [],
    back_orders = []
  } = filter

  let isCustomerSelected = selected_customer && selected_customer_data[ selected_customer ]

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

      <div className="analytics-filters">

        <DropDownFilter
          field={ 'policy_code' }
          iconClassName={ 'fa fa-users' }
          title={ 'CUSTOMER' }
          width={ '295px' }
          defaultOption={ 
            selected_customer
            ? {
              value : policy_code_options.filter( o => o.value === selected_customer )[0]['value'],
              oper : '=',
              key : policy_code_options.filter( o => o.value === selected_customer )[0]['key']
            } 
            : undefined 
          }
          allOptionHidden={ true }
          options={ policy_code_options }
          onQuickFilterChange={ onFilterChange }
        />

        <DropDownFilter
          field={ 'location' }
          iconClassName={ 'fa fa-industry' }
          title={ 'WAREHOUSE' }
          disabled={ !isCustomerSelected }
          defaultOption={ 
            location.length 
            ? {
              ...location[0],
              key : location[0]['value'].includes(',')? undefined: locationOptions.filter( o => o.value === location[0]['value'] )[0]['key']
            } 
            : undefined 
          }
          options={ locationOptions }
          onQuickFilterChange={ onFilterChange }
        />

        <DaterangeFilter
          field={'shipped_date'}
          iconClassName={ 'fa fa-calendar' }
          title={'SHIPPED DATE'}
          disabled={ !isCustomerSelected }
          onQuickFilterChange={ onFilterChange }
          allowClear={false}
          startDate={ shipped_date.length ? shipped_date[0]['value'] : undefined }
          endDate={ shipped_date.length > 1 ? shipped_date[1]['value'] : '2017-05-04' }
        />

        <DaterangeFilter
          field={'received_date'}
          iconClassName={ 'fa fa-calendar' }
          title={'RECEIVED DATE'}
          disabled={ !isCustomerSelected }
          onQuickFilterChange={ onFilterChange }
          allowClear={false}
          startDate={ received_date.length ? received_date[0]['value'] : undefined }
          endDate={ received_date.length > 1 ? received_date[1]['value'] : '2017-05-04' }
        />

        <DropDownFilter
          field={ 'account_number' }
          iconClassName={ 'fa fa-user' }
          title={ 'ACCOUNT' }
          disabled={ !isCustomerSelected }
          onQuickFilterChange={ onFilterChange }
          defaultOption={ account_number.length 
                          ? {
                            ...account_number[0],
                            key : account_number[0]['value'].includes(',')? undefined: accOptions.filter( o => o.value === account_number[0]['value'] )[0]['key']
                          } 
                          : undefined 
                        }
          options={ accOptions }
        />

        <BooleanFilter
          onQuickFilterChange={ onFilterChange }
          field={'back_orders'}
          title={'INCLUDE BACK ORDERS'}
          disabled={ !isCustomerSelected }
          checked={ back_orders.length ? back_orders[0]['value'] : undefined }
          noIcon={ true }
        />

      </div>

      <div className="page-breadcrumb">
        <div className="caption">
          <span className="caption-subject font-green-seagreen sbold">

            <div className="actions">
              <div className="btn-group ">

                {
                  loaded &&
                  <button 
                    type="button" 
                    className="btn action-button btn-sm"
                    onClick={ global.window.print }
                  >
                    <i className="icon-printer bold" style={{color: '#333'}}></i>
                  </button>
                }

                {
                  loaded &&
                  <button 
                  type="button" 
                  className="btn action-button btn-sm"
                  onClick={ exportReport }
                >
                  <i className="fa fa-download bold" style={{color: '#333'}}>
                  </i>
                </button>
                }
                <button 
                  type="button" 
                  className="btn action-button btn-sm run-report"
                  onClick={ generateReport }
                  disabled={ !isCustomerSelected }
                >
                  <i className="fa fa-bar-chart"></i> RUN REPORT
                </button>
                
              </div>
            </div>

          </span>
        </div>
      </div>

    </div>
  );
}

AnalyticsSingleReportBar.propTypes = {
  analyticsActions: PropTypes.object.isRequired,
  analyticsState: PropTypes.object.isRequired,
  exportReport: PropTypes.func,
  filter: PropTypes.object,
  generateReport: PropTypes.func,
  loaded: PropTypes.bool,
}

export default AnalyticsSingleReportBar