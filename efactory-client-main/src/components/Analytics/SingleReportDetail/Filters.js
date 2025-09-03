import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { getUserData } from '../../../util/storageHelperFuncs'
import DropDownFilter from '../../Grid/QuickFilters/DropdownFilter'
import DaterangeFilter from '../../Grid/QuickFilters/DateRangeFilter'
import BooleanFilter from '../../Grid/QuickFilters/BooleanFilter'
import InputTextFilter from '../../Grid/QuickFilters/InputTextFilter'

const Filters = ({
  analyticsActions,
  filter,
  globalApi,
  pathname,
  quick_filters_config,
}) => {
  const filterRef = useRef(null)
  filterRef.current = filter

  //const bookrate_carriers_kv = [{key:'Passport',value:'APC'}, {key:'APC_DCL (APC DIRECT)', value:'APC_DCL'}, {key:'DHL Global Mail', value:'DHL Global Mail'}, {key:'FedEx', value:'FedEx'}, {key:'UPS', value:'UPS'}, {key:'UPS SurePost', value:'UPS SurePost'}, {key: 'USPS', value:'USPS'}];
  const bookrate_carriers_kv = [{key:'Passport',value:'APC'}, {key:'DHL Global Mail', value:'DHL Global Mail'}, {key:'FedEx', value:'FedEx'}, {key:'UPS', value:'UPS'}, {key:'UPS SurePost', value:'UPS SurePost'}, {key: 'USPS', value:'USPS'}, {key: 'SelectShip', value:'SelectShip'}];
  const bookrate_regions = ['FR', 'LA', 'LN', 'YK'];

  const onFilterChange = useCallback(
    filterObj => {
      let field = Object.keys( filterObj )[ 0 ]
      let prevFilters = {...filterRef.current}
      if (field === 'country') {  
        if (prevFilters['state']) {
          delete prevFilters['state']; 
        }
        analyticsActions.setRootReduxStateProp( 'filter', {
          ...prevFilters, 
          [ field ] : filterObj[ field ]
        } )
      } else if (field === 'carrier' || field === 'carrier_limited') {
        if (prevFilters['service']) {
          delete prevFilters['service']; 
        }
        analyticsActions.setRootReduxStateProp( 'filter', {
          ...prevFilters, 
          [ field ] : filterObj[ field ]
        } )
      } else if (field === 'sub_warehouse') {
        let prevFilters = {...filter}
        if (prevFilters['account_number']) {
          delete prevFilters['account_number']; 
        }
        analyticsActions.setRootReduxStateProp( 'filter', {
          ...prevFilters, 
          [field]: filterObj[ field ] // value will be an array
        } )
      } else if (field === 'carrier_book_rates') {
        let prevFilters = {...filter}
        analyticsActions.setRootReduxStateProp( 'filter', {
          ...prevFilters, 
          [field]: filterObj[ field ] // value will be an array
        } )
      } else {
        analyticsActions.setRootReduxStateProp( 'filter', {
          ...prevFilters, 
          [ field ] : filterObj[ field ]
        } )
      }
    },
    [filter]
  )

  let isAdminPath = pathname && pathname.includes('admin/')

  let { globalApiData } = globalApi

  let orderTypes = ( globalApiData && globalApiData.order_types ) || {}
  let countries = ( globalApiData && globalApiData.countries ) || {}
  let states = ( globalApiData && globalApiData.states ) || {}
  let carriers = ( globalApiData && globalApiData.carriers ) || {}
  let sub_warehouses = ( globalApiData && globalApiData.sub_warehouses ) || {}

  let accOptions = {}
  let locationOptions = []
  let subwarehousesOptions = Object.keys(sub_warehouses).map(
    subwarehouseKey => {
      let values = subwarehouseKey.split('-')
      let optionKey   =  values[0].trim()
      let optionValue = `${values[0]} - ${values[1]}`
      return {key: `${optionValue}`, value: optionKey , oper: '=' }
    }
  )

  let invTypeRegionOptions = []
  let internationalCodeOptions = [ { key: 'Domestic', value: 0, oper: '=' }, { key: 'International', value: 0, oper: '<>' } ]
  let orderTypeOptions = Object.keys( orderTypes ).map( orderTypeKey => (
    { key: `${orderTypeKey} - ${orderTypes[orderTypeKey]}`, value: orderTypeKey , oper: '=' }
  ) )
  let timeDimensionOptions = [ { key: 'Daily', value: 'daily', oper: '=' }, { key: 'Weekly', value: 'weekly', oper: '=' }, { key: 'Monthly', value: 'monthly', oper: '=' }, { key: 'Quarterly', value: 'quarterly', oper: '=' }, { key: 'Yearly', value: 'yearly', oper: '=' } ]
  let mainCountries = { 'US': countries['US'], 'CA': countries['CA'], 'AU': countries['AU'] }
  let restCountries = { ...countries }
  delete restCountries['US']; 
  delete restCountries['CA']; 
  delete restCountries['AU']; 
  mainCountries = { ...mainCountries, ...restCountries } 

  let countryOptions = Object.keys( mainCountries ).map( countryKey => (
    { key: `${countryKey} - ${mainCountries[countryKey]}`, value: countryKey , oper: '=' }
  ) )
  let carrierOptions = Object.keys( carriers ).map( carrierKey => (
    { key: `${carrierKey}`, value: carrierKey , oper: '=' }
  ) )

  let bookRateCarriersOptions = bookrate_carriers_kv.map( bookrate_carrier => (
    { key: `${bookrate_carrier.key}`, value: `${bookrate_carrier.value}` , oper: '=' }
  ) )
  let bookRateRegionsOptions = bookrate_regions.map( bookrateRegionKey => (
    { key: `${bookrateRegionKey}`, value: `${bookrateRegionKey}` , oper: '=' }
  ) )

  let stateOptions = []
  let serviceOptions = []
  let warehouses = getUserData("warehouses")
  Object.keys( warehouses ).forEach( ( aWarehouse, i1 ) => {
    warehouses[ aWarehouse ].forEach( ( invType, i2 ) => {
      Object.keys( invType ).forEach( ( anInvType, i3) => {
        let optionKey   =  aWarehouse
        let optionValue = `${aWarehouse} - ${anInvType}`
        locationOptions.push({ key: optionValue, value: optionKey, oper: '=' })

        let optionKey2   =  `${anInvType}.${aWarehouse}`
        let optionValue2 = `${aWarehouse} - ${anInvType}`
        invTypeRegionOptions.push({ key: optionValue2, value: optionKey2, oper: '=' })
      } )
    } )
  } )

  let { 
    shipped_date = [], 
    received_date = [], 
    account_number = [], 
    location = [],
    back_orders = [],
    qty_variance = [],
    inv_type_region = [],
    international_code = [],
    order_type = [],
    time_dimension = [],
    country = [],
    state = [],
    customer = [],
    carrier = [],
    service = [],
    sub_warehouse = [],
    region = [],
  } = filter

  if (!isAdminPath) {
    accOptions = getUserData('calc_accounts').map(
      account => ({ key: account, value: account, oper: '=' })
    )
  } else {
    let actno = []
    Object.keys( sub_warehouses ).forEach( wh => {
      if (sub_warehouse.length > 0) {
        let values = wh.split('-')
        let subregion   =  values[0].trim()
        if (sub_warehouse[0].value.includes(subregion)) {
          actno = [...actno, ...sub_warehouses[wh]]
        }
      }
      else {
        actno = [...actno, ...sub_warehouses[wh]]
      }
    })
    
    // Remove duplicates
    actno = actno.reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      [],
    );

    accOptions = actno.map( account => {
      return { key: account, value: account, oper: '=' }
    })
  }
  
  if (country.length && country[0]['value']) {
    let states_of_country = states[country[0]['value']];
    if (states_of_country) {
      stateOptions = Object.keys( states_of_country ).map( stateKey => (
        { key: `${stateKey} - ${states_of_country[stateKey]}`, value: stateKey , oper: '=' }) )
    }
    else {
      stateOptions = []
      //state = []
    }
  }
  if (carrier.length && carrier[0]['value']) {
    serviceOptions = []
    if (globalApiData.carriers) {
      let services = globalApiData.carriers[carrier[0]['value']] || [];
      if (services) {
        serviceOptions = services.map( serviceValue => (
          { key: `${serviceValue}`, value: serviceValue , oper: '=' }) )
      }
      else {
        serviceOptions = []
      }
    }
  }
  return (

    <div className="analytics-filters">

      {
        quick_filters_config.length > 0 &&
        quick_filters_config.map( typeName => {
          switch( typeName ){
            case 'warehouse':
              if (!isAdminPath) {
                return <DropDownFilter
                  key={ 'location' }
                  field={ 'location' }
                  iconClassName={ 'fa fa-industry' }
                  title={ 'WAREHOUSE' }
                  defaultOption={ location.length 
                                  ? {
                                    ...location[0],
                                    key : location[0]['value'].includes(',')? undefined: locationOptions.filter( o => o.value === location[0]['value'] )[0]['key']
                                  } 
                                  : undefined 
                                }
                  options={ locationOptions }
                  onQuickFilterChange={ onFilterChange }
                />
              } else {
                return <DropDownFilter
                  key={ 'sub_warehouse' }
                  field={ 'sub_warehouse' }
                  iconClassName={ 'fa fa-industry' }
                  title={ 'WAREHOUSE' }
                  nosort={ true }
                  defaultOption={ sub_warehouse.length 
                    ? {
                      ...sub_warehouse[0],
                      key : sub_warehouse[0]['value'].includes(',')? undefined: subwarehousesOptions.filter( o => o.value === sub_warehouse[0]['value'] )[0]['key']
                    } 
                    : undefined 
                  }
                  options={ subwarehousesOptions }
                  onQuickFilterChange={ onFilterChange }
                />
              }
            case 'shipped_date':
              return <DaterangeFilter
                key={'shipped_date'}
                field={'shipped_date'}
                iconClassName={ 'fa fa-calendar' }
                title={'SHIPPED DATE'}
                onQuickFilterChange={ onFilterChange }
                allowClear={false}
                startDate={ shipped_date.length ? shipped_date[0]['value'] : undefined }
                endDate={ shipped_date.length > 1 ? shipped_date[1]['value'] : '2017-05-04' }
              />    
            case 'received_date':
              return <DaterangeFilter
                key={'received_date'}
                field={'received_date'}
                iconClassName={ 'fa fa-calendar' }
                title={'RECEIVED DATE'}
                onQuickFilterChange={ onFilterChange }
                allowClear={false}
                startDate={ received_date.length ? received_date[0]['value'] : undefined }
                endDate={ received_date.length > 1 ? received_date[1]['value'] : '2017-05-04' }
              />    
            case 'account':
              return <DropDownFilter
                key={ 'account_number' }  
                field={ 'account_number' }
                iconClassName={ 'fa fa-user' }
                title={ 'ACCOUNT' }
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
            case 'back_orders':
              return <BooleanFilter
                key={'back_orders'}
                onQuickFilterChange={ onFilterChange }
                field={'back_orders'}
                title={'INCLUDE BACK ORDERS'}
                checked={ back_orders.length ? back_orders[0]['value'] : undefined }
                noIcon={ true }
              />
            case 'qty_variance':
              return <BooleanFilter
                key="quickfilter-qty_variance"
                onQuickFilterChange={ onFilterChange }
                field={ 'qty_variance' }
                title={ 'VARIANCE ONLY' }
                checked={ qty_variance.length ? true : false }
                noIcon={ true }
              />
            case 'inv_type_region':
              return <DropDownFilter
                key={ 'inv_type_region' }
                field={ 'inv_type_region' }
                iconClassName={ 'fa fa-industry' }
                title={ 'WAREHOUSE' }
                defaultOption={ inv_type_region.length 
                                ? {
                                  ...inv_type_region[0],
                                  key : inv_type_region[0]['value'].includes(',')? undefined: invTypeRegionOptions.filter( o => o.value === inv_type_region[0]['value'] )[0]['key']
                                } 
                                : undefined 
                              }
                options={ invTypeRegionOptions }
                onQuickFilterChange={ onFilterChange }
              />
            case 'international_code':
              return <DropDownFilter
                key={ 'international_code' }
                field={ 'international_code' }
                iconClassName={ 'fa fa-location-arrow' }
                title={ 'DESTINATION' }
                defaultOption={ international_code.length 
                  ? {
                    ...international_code[0],
                    key : internationalCodeOptions.filter( o => o.value === international_code[0]['value'] )[0]['key']
                  } 
                  : undefined 
                }
                options={ internationalCodeOptions }
                onQuickFilterChange={ onFilterChange }
              />
            case 'order_type':
              return <DropDownFilter
                key={ 'order_type' }
                field={ 'order_type' }
                iconClassName={ 'fa fa-cloud' }
                title={ 'CHANNEL' }
                defaultOption={ order_type.length 
                  ? {
                    ...order_type[0],
                    key : order_type[0]['value'].includes(',')? undefined: orderTypeOptions.filter( o => o.value === order_type[0]['value'] )[0]['key']
                  } 
                  : undefined 
                }
                options={ orderTypeOptions }
                onQuickFilterChange={ onFilterChange }
              />
            case 'country':
                return <DropDownFilter
                  key={ 'country' }
                  field={ 'country' }
                  nosort={ true }
                  iconClassName={ 'fa fa-globe' }
                  title={ 'COUNTRY' }
                  defaultOption={ country.length 
                    ? {
                      ...country[0],
                      key : countryOptions.filter( o => o.value === country[0]['value'] )[0]['key']
                    } 
                    : undefined 
                  }
                  options={ countryOptions }
                  onQuickFilterChange={ onFilterChange }
                  disableMultiSelection={true}
                />
            case 'state':
                return <DropDownFilter
                  key={ 'state' }
                  field={ 'state' }
                  iconClassName={ 'fa fa-map' }
                  title={ 'STATE' }
                  defaultOption={ state.length 
                    ? {
                      ...state[0],
                      key : stateOptions.filter( o => o.value === state[0]['value'] )[0]['key']
                    } 
                    : undefined 
                  }
                  options={ stateOptions }
                  onQuickFilterChange={ onFilterChange }
                  disableMultiSelection={true}
                />
              case 'carrier':
                  return <DropDownFilter
                    key={ 'carrier' }
                    field={ 'carrier' }
                    nosort={ true }
                    iconClassName={ 'fa fa-truck' }
                    title={ 'CARRIER' }
                    defaultOption={ carrier.length 
                      ? {
                        ...carrier[0],
                        key : carrierOptions.filter( o => o.value === carrier[0]['value'] )[0]['key']
                      } 
                      : undefined 
                    }
                    options={ carrierOptions }
                    onQuickFilterChange={ onFilterChange }
                    disableMultiSelection={true}
                    />
                case 'carrier_limited':
                      return <DropDownFilter
                        key={ 'carrier' }
                        field={ 'carrier' }
                        nosort={ true }
                        iconClassName={ 'fa fa-truck' }
                        title={ 'CARRIER' }
                        defaultOption={ carrier.length 
                          ? {
                            ...carrier[0],
                            key : carrier[0]['value'].includes(',')? undefined: carrierOptions.filter( o => o.value === carrier[0]['value'] )[0]['key']
                          } 
                          : undefined 
                        }
                        options={ carrierOptions.filter(o => o.key.toUpperCase() === 'CH ROBINSON' || o.key.toUpperCase() === 'DHL GLOBAL MAIL' || o.key.toUpperCase() === 'FEDEX' || o.key.toUpperCase() === 'UPS' || o.key.toUpperCase() === 'USPS') }
                        onQuickFilterChange={ onFilterChange }
                        disableMultiSelection={false}
                        />
                case 'carrier_book_rates':
                  return <DropDownFilter
                    key={ 'carrier' }
                    field={ 'carrier' }
                    nosort={ true }
                    iconClassName={ 'fa fa-truck' }
                    allOptionHidden={true}
                    title={ 'CARRIER' }
                    defaultOption={ carrier.length 
                      ? {
                        ...carrier[0],
                        key : carrier[0]['value'].includes(',')? undefined: bookRateCarriersOptions.filter( o => o.value === carrier[0]['value'] )[0]['key']
                      } 
                      : undefined 
                    }
                    //options={ [{key: 'Passport', value: 'APC', oper: '='}, {key: 'APC_DCL (APC DIRECT)', value: 'APC_DCL', oper: '='}, {key: 'DHL Global Mail', value: 'DHL Global Mail', oper: '='}, {key: 'FedEx', value: 'FedEx', oper: '='},  {key: 'UPS', value: 'UPS', oper: '='}, {key: 'UPS SurePost', value: 'UPS SurePost', oper: '='}, {key: 'USPS', value: 'USPS', oper: '='}  ] }
                    options={ [{key: 'Passport', value: 'APC', oper: '='}, {key: 'DHL Global Mail', value: 'DHL Global Mail', oper: '='}, {key: 'FedEx', value: 'FedEx', oper: '='},  {key: 'UPS', value: 'UPS', oper: '='}, {key: 'UPS SurePost', value: 'UPS SurePost', oper: '='}, {key: 'USPS', value: 'USPS', oper: '='}, {key: 'SelectShip', value: 'SelectShip', oper: '='}   ] }
                    onQuickFilterChange={ onFilterChange }
                    disableMultiSelection={true}
                    />
                case 'region_book_rates': 
                  return <DropDownFilter
                    key={ 'region' }
                    field={ 'region' }
                    nosort={ true }
                    iconClassName={ 'fa fa-industry' }
                    allOptionHidden={true}
                    title={ 'REGION' }
                    disabled={ carrier.length > 0 && carrier[0]['value'] === 'SelectShip' }
                    defaultOption={ region.length 
                      ? {
                        ...region[0],
                        key : region[0]['value'].includes(',')? undefined: bookRateRegionsOptions.filter( o => o.value === region[0]['value'] )[0]['key']
                      } 
                      : undefined 
                    }
                    options={ bookRateRegionsOptions }
                    onQuickFilterChange={ onFilterChange }
                    disableMultiSelection={true}
                    />
    
                case 'service':
                  return <DropDownFilter
                      key={ 'service' }
                      field={ 'service' }
                      iconClassName={ 'fa fa-truck' }
                      title={ 'SERVICE' }
                      defaultOption={ service.length 
                        ? {
                          ...service[0],
                          key : service[0]['value'].includes(',')? undefined: serviceOptions.filter( o => o.value === service[0]['value'] )[0]['key']
                        } 
                        : undefined 
                      }
                      options={ serviceOptions }
                      onQuickFilterChange={ onFilterChange }
                      disableMultiSelection={false}
                      />
              case 'customer':
                  return !isAdminPath && <InputTextFilter
                    key={ 'customer' }
                    field={ 'customer' }
                    iconClassName={ 'fa fa-building' }
                    title={ 'CUSTOMER' }
                    activeFilterValue={ (customer.length && customer[0].value)? customer[0].value: '' }
                    isActive={customer.length && customer[0].value? true: false}
                    onQuickFilterChange={ onFilterChange }
                  />
                case 'time_dimension':
                    return <DropDownFilter
                      key={ 'time_dimension' }
                      field={ 'time_dimension' }
                      iconClassName={ 'fa fa-calendar' }
                      title={ 'TIME' }
                      allOptionHidden={true}
                      defaultOption={ time_dimension.length 
                        ? {
                          ...time_dimension[0],
                          key : timeDimensionOptions.filter( o => o.value === time_dimension[0]['value'] )[0]['key']
                        } 
                        : timeDimensionOptions[1]
                      }
                      options={ timeDimensionOptions }
                      onQuickFilterChange={ onFilterChange }
                      disableMultiSelection={true}
                      />
                default:
              console.warn(`no quickfilter matches the given <${ typeName }>`)
              return ''
          }
        } )
      }

    </div>
  )
}

Filters.propTypes = {
  analyticsActions: PropTypes.object.isRequired,
  filter: PropTypes.object,
  quick_filters_config: PropTypes.arrayOf( PropTypes.string ).isRequired
}

export default Filters