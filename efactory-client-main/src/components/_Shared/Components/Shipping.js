import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ShippingFormTemplate from './ShippingFormTemplate'
import getDeepProperty from '../../_Helpers/getDeepProperty'
import {getUserData } from '../../../util/storageHelperFuncs'

const Shipping = props => {
  const plMappedRef = useRef(null)
  const carriersMappedRef = useRef(null)
  const internationalCodesMappedRef = useRef(null)
  const freightAccountsMappedRef = useRef(null)
  const freightAccountsOrderedRef = useRef(null)
  const incotermsMappedRef = useRef(null)
  
  useEffect(
    () => {
      plMappedRef.current = {}
      let plMapped = getUserData('pl') || []
      plMapped.forEach( pl => {
        plMappedRef.current[ pl ] = pl
      })
    },
    []
  )

  let {
    carriers = {},
    terms = [],
    international_codes = []
  } = props.globalApiData

  let { freight_accounts = [] } = props.globalApiData

  if( !carriersMappedRef.current || !Object.keys(carriersMappedRef.current).length ){
    carriersMappedRef.current = {}
    Object.keys( carriers ).forEach( c => {
      carriersMappedRef.current[ c ] = c
    } )
  }

  if( !internationalCodesMappedRef.current || !Object.keys(internationalCodesMappedRef.current).length ){
    internationalCodesMappedRef.current = {}
    international_codes.forEach( c => {
      internationalCodesMappedRef.current[ c.value ] = c.name
    } )
  }

  if( !freightAccountsMappedRef.current || !Object.keys(freightAccountsMappedRef.current).length ){
    freightAccountsMappedRef.current = {}
    freightAccountsOrderedRef.current = []
    freight_accounts.forEach( c => {
      freightAccountsOrderedRef.current.push(c.value)
      freightAccountsMappedRef.current[ c.value ] = c.name
    } )
  }

  if( !incotermsMappedRef.current || !Object.keys(incotermsMappedRef.current).length ){
    incotermsMappedRef.current = {}
    terms.forEach( c => {
      incotermsMappedRef.current[ c ] = c
    } )
  }

  let { data = {}, onFieldChange } = props
  let domesticValues = getDeepProperty(
    data,
    ['domestic'],
    {}
  )
  let internationalValues = getDeepProperty(
    data,
    ['international'],
    {}
  )

  let options = {
    carriers            : carriersMappedRef.current,
    freightAccounts     : freightAccountsMappedRef.current,
    services            : {},
    incotermOptions     : incotermsMappedRef.current,
    internationalCodes  : internationalCodesMappedRef.current,
    pl                  : plMappedRef.current
  }
  let servicesDomestic = {}, servicesInternational = {}
  if( domesticValues['carrier'] && Object.keys(carriers).length  ){

    carriers[ domesticValues['carrier'] ].forEach( service => {
      servicesDomestic[ service ] = service
    } )
  }

  if( internationalValues['carrier'] && Object.keys(carriers).length ){
    carriers[ internationalValues['carrier'] ].forEach( service => {
      servicesInternational[ service ] = service
    } )
  }

  return (
    <div>
      <ShippingFormTemplate
        formValues={ domesticValues }
        onFieldValueChange={ ({ field, value }) => onFieldChange({
          fieldPath :[ 'domestic', field ],
          value
        }) }
        orderOfOptionKeys_FreightAccounts={freightAccountsOrderedRef.current}
        options={{
          ...options,
          services : servicesDomestic
        }}
        title="Shipping Domestic"
      />
      <ShippingFormTemplate
        formValues={ internationalValues }
        onFieldValueChange={ ({ field, value }) => onFieldChange({
          fieldPath: [ 'international', field ],
          value
        }) }
        orderOfOptionKeys_FreightAccounts={freightAccountsOrderedRef.current}
        options={{
          ...options,
          services : servicesInternational
        }}
        title="Shipping International"
      />
    </div>
  )
}

Shipping.propTypes = {
  onFieldChange: PropTypes.func.isRequired,
  data: PropTypes.shape({
    domestic: PropTypes.shape({
      carrier: PropTypes.any,
      service: PropTypes.any,
      packing_list_type: PropTypes.any,
      freight_account: PropTypes.any,
      consignee_number: PropTypes.any,
      comments: PropTypes.any,
      int_code: PropTypes.any,
      incoterms: PropTypes.any,
      fob: PropTypes.any
    }),
    international: PropTypes.shape({
      carrier: PropTypes.any,
      service: PropTypes.any,
      packing_list_type: PropTypes.any,
      freight_account: PropTypes.any,
      consignee_number: PropTypes.any,
      comments: PropTypes.any,
      int_code: PropTypes.any,
      terms: PropTypes.any,
      fob: PropTypes.any
    })
  }).isRequired
}

export default connect(
  state => ({
    globalApiData: state.common.globalApi.globalApiData
  })
)(Shipping)