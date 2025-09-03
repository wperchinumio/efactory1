import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import history from '../../../history'
import classNames from 'classnames'
import DraftsContentBar from './ContentBar'
import PageBar from './Bar'
import * as draftActions from './redux'
import * as rmaEntryActions from '../Entry/redux'
import * as rmaSettingsActions from '../Settings/redux'
import RmaDetail from '../../DetailPages/RmaDetail/_Content'
import { getUserData } from '../../../util/storageHelperFuncs'

const DraftsMain = props => {
  useEffect(
    () => {
      props.draftActions.listDrafts()
      return () => {
        props.draftActions.initializeReduxState()
      }
    },
    []
  )

  function updateCheckedDrafts ({rma_id, value}) {
    let { checkedDrafts, draftActions } = props
    let { checkedDraftIds } = checkedDrafts
    checkedDraftIds = { ...checkedDraftIds }
    checkedDraftIds[rma_id] = value
    draftActions.setRootReduxStateProp({
      field : 'checkedDrafts',
      value : {
        ...checkedDrafts,
        checkedDraftIds
      }
    })
  }

  function filterDrafts () {
    let { drafts, filterValue } = props
    filterValue = filterValue.trim().toLowerCase()
    if( !filterValue ) return drafts
    return drafts.filter( aDraft => {
      let {
        rma_id,
        rma_number,
        rma_type,
        receiving_account_number,
        receiving_warehouse,
        original_order_number,
        shipping_address
      } = aDraft

      let {
        company,
        attention,
        city,
        state_province,
        postal_code,
        country
      } = shipping_address

      switch ( true ) {
        case String(rma_id).toLowerCase().includes(filterValue):
        case String(rma_number).toLowerCase().includes(filterValue):
        case String(rma_type).toLowerCase().includes(filterValue):
        case String(receiving_account_number).toLowerCase().includes(filterValue):
        case String(receiving_warehouse).toLowerCase().includes(filterValue):
        case String(original_order_number).toLowerCase().includes(filterValue):
        case String(company).toLowerCase().includes(filterValue):
        case String(attention).toLowerCase().includes(filterValue):
        case String(city).toLowerCase().includes(filterValue):
        case String(state_province).toLowerCase().includes(filterValue):
        case String(postal_code).toLowerCase().includes(filterValue):
        case String(country).toLowerCase().includes(filterValue):
          return true
        default:
          return false
      }
    })
  }

  function editDraftOnEntryPage ({rma_id}) {
    props.rmaEntryActions.readEntry({ rma_id }).then( 
      ({ response, getState }) => {
        props.rmaSettingsActions.readRmaSettings().then( 
          ({ rmaSettingsData }) => {
            // since if settings changed, some values of response will be invalid
            // we have to replace invalid values with ''
            checkResponseAndOptionsIfValueExistOnOPTIONS( rmaSettingsData, response, getState )
            history.push('/returntrak?noReadSettings=true')  
          } 
        )
    }).catch(error => {})
  }

  function checkResponseAndOptionsIfValueExistOnOPTIONS (settings, response, getState) {
    let inValidDisposition = isDispositionTypeExistOnSettingsOPTIONS( settings, response )
    let inValidCustomFields = isCustomFieldsExistOnSettingsOPTIONS( settings, response )
    let inValidRmaType = isRmaTypeExistOnSettingsOPTIONS( settings, response )
    let inValidAccountWarehouseFields = isAccountWarehouseFieldsInvalid( settings, response )
    let { rmaHeader = {} } = getState().returnTrak.entry
    rmaHeader = { ...rmaHeader }
    if( inValidRmaType ){
      rmaHeader.rma_type = ''
      rmaHeader.disposition = ''
      rmaHeader.accountShippingWarehouse = ''
    }else if( inValidDisposition ){
      rmaHeader.disposition = ''
    }
    inValidCustomFields.forEach( inValidCustomField => {
      let optionNumber = inValidCustomField.slice(-1)
      rmaHeader[ `option${optionNumber}` ] = ''
    })
    inValidAccountWarehouseFields.forEach( field => {
      rmaHeader[ field ] = ''
    })
    props.rmaEntryActions.setRootReduxStateProp({
      field: 'rmaHeader',
      value: rmaHeader
    })
  }

  function isDispositionTypeExistOnSettingsOPTIONS (settings, response) {
    let { disposition_code = '' } = response.data.rma_header
    if( !disposition_code ) return false
    let { dispositions = [] } = settings
    dispositions = dispositions.filter( d => d.code === disposition_code )
    if( dispositions.length ) return false
    return disposition_code
  }

  function isCustomFieldsExistOnSettingsOPTIONS (settings, response) {
    let { rma_header } = response.data
    let allCustomFields = [ 'cf1', 'cf2', 'cf3', 'cf4', 'cf5', 'cf6', 'cf7' ]
    let { custom_fields = [] } = settings
    let availableCustomFields = custom_fields.map( c => 'cf' + c.index )
    let inValidFields = allCustomFields.filter( 
      c => {
        if( rma_header[ c ] ){
          if( !availableCustomFields.includes( c ) ) return true
          let custom_field = custom_fields.filter( cf => c === `cf${cf.index}` )[0]
          if( custom_field.type === 'selection' ){
            return !isValueExistOnSelectionTypeCustomField( custom_field, rma_header[ c ] )
          }
          return false
        } 
        return false
      }
    )
    return inValidFields
  } 
  
  function isValueExistOnSelectionTypeCustomField (customField, value) {
    let options = customField.list.map( 
      option => option.includes('||') 
                ? option.replace(/\|\|[a-zA-Z0-9]+/,'') 
                : option 
    )
    return options.includes( value )
  }

  function isRmaTypeExistOnSettingsOPTIONS (settings, response) {
    let { rma_type_code = '' } = response.data.rma_header
    if( !rma_type_code ) return false
    let { rma_types = [] } = settings
    rma_types = rma_types.filter( d => d.code === rma_type_code )
    if( rma_types.length ) return false
    return rma_type_code
  }

  function isAccountWarehouseFieldsInvalid (settings, response) {
    let invalidFields = []
    let accounts = getUserData('calc_accounts')
    
    let { shipping_account_number, account_number } = response.data.rma_header
    if( shipping_account_number && !accounts.includes( shipping_account_number ) ){
      invalidFields.push( 'accountShippingWarehouse' )
    }
    if( account_number && !accounts.includes( account_number ) ){
      invalidFields.push( 'accountReceivingWarehouse' )
    }
    return invalidFields
  }

  let { loadedDrafts, draftActions, checkedDrafts, location } = props
  let filteredDrafts = filterDrafts()
  let { allChecked, checkedDraftIds } = checkedDrafts
  let rmaDetailModalOpen = location.search && location.search.includes('?rmaNum')
  return (
    <div>
      <div className={ classNames({ hidden : rmaDetailModalOpen }) } >
        <PageBar />
        <div className="container-page-bar-fixed">
          <div className="portlet light bordered">
            <DraftsContentBar
              draftActions={draftActions}
              totalDrafts={ filteredDrafts.length }
              filteredDrafts={ filteredDrafts }
            />
            <div className="portlet-body">
              {
                loadedDrafts && filteredDrafts.length === 0 &&
                <div className="container-page-bar-fixed all-tasks">
                  <h3 className="font-red-soft">Sorry! You don't have any draft available at this time.</h3>
                </div>
              }
              {
                filteredDrafts.length !== 0 &&
                <div className="table-responsive">
                  <table className="table table-striped table-hover order-column row-sortable table-clickable">
                    <thead>
                      <tr className="uppercase table-header-1">
                        <th className="font-grey-salt" >
                          <label className="mt-checkbox mt-checkbox-outline">
                            <input
                              type="checkbox"
                              checked={ allChecked }
                              onChange={ event => props.draftActions.setRootReduxStateProp({
                                field : 'checkedDrafts',
                                value : {
                                  allChecked : !allChecked,
                                  checkedDraftIds : {}
                                }
                              }) }
                            />
                            <span></span>
                          </label>
                        </th>
                        <th> # </th>
                        <th> Draft # </th>
                        <th> RMA # </th>
                        <th> RMA Type </th>
                        <th> Account # </th>
                        <th> Warehouse </th>
                        <th> Original Order # </th>
                        <th> Ship To </th>
                      </tr>
                    </thead>
                    <tbody className="ui-sortable">
                      { filteredDrafts.map( ( aDraft, index ) => {
                        let {
                          rma_id,
                          rma_number,
                          rma_type,
                          rma_type_code,
                          receiving_account_number,
                          receiving_warehouse,
                          original_order_number,
                          shipping_address
                        } = aDraft
                        let {
                          company,
                          attention,
                          city,
                          state_province,
                          postal_code,
                          country
                        } = shipping_address
                        let isDraftSelected = allChecked || checkedDraftIds[rma_id] ? true : false
                        return (
                          <tr
                            className="odd gradeX clickable-row ui-sortable-handle"
                            key={`draft-${index}`}
                          >
                            <td>
                              <label className="mt-checkbox mt-checkbox-outline">
                                <input
                                  type="checkbox"
                                  checked={ isDraftSelected }
                                  onChange={ event => updateCheckedDrafts({ rma_id, value: event.target.checked }) }
                                />
                                <span></span>
                              </label>
                            </td>
                            <td>{ index+1 }</td>
                            <td>
                              <a
                                onClick={ event => {
                                  event.preventDefault()
                                  editDraftOnEntryPage({ rma_id })
                                } }
                              >
                                {
                                  `D${String(rma_id).length > 4 ? rma_id : '0'.repeat(4 - String(rma_id).length) + rma_id}`
                                }

                              </a>
                            </td>
                            <td>{ rma_number }</td>
                            <td>
                              {
                                rma_type_code &&
                                <span>
                                  <b>
                                    { rma_type_code }
                                  </b> : { rma_type } 
                                </span>
                                  
                              }
                            </td>
                            <td>{ receiving_account_number }</td>
                            <td>{ receiving_warehouse }</td>
                            <td className="text-nowrap">{ original_order_number }</td>
                            <td className="text-address">
                              {
                                shipping_address &&
                                <div className="ship-to-outer">
                                  <i className="font-blue-soft">

                                    { `${company || ''} ${company && attention ? '|' : ''} ${attention || ''}` }

                                  </i><br />
                                  {
                                    `${city ? city + ',' : ''}
                                    ${state_province ? state_province : ''}
                                    ${postal_code ? postal_code + '-' : ''}
                                    ${country ? country : ''}`
                                  }
                                </div>
                              }
                            </td>
                          </tr>
                        )
                      }) }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {
        rmaDetailModalOpen &&
        <RmaDetail marginFix />
      }
    </div>
  )
}

DraftsMain.propTypes = {
  draftActions: PropTypes.object.isRequired,
  checkedDrafts: PropTypes.shape({
    allChecked: PropTypes.bool.isRequired,
    checkedDraftIds: PropTypes.object.isRequired
  }),
  rmaEntryActions: PropTypes.object.isRequired
}

export default withRouter(
  connect(
    state => ({
      checkedDrafts : state.returnTrak.draft.checkedDrafts,
      drafts : state.returnTrak.draft.drafts,
      filterValue : state.returnTrak.draft.filterValue,
      loadedDrafts : state.returnTrak.draft.loadedDrafts
    }),
    dispatch => ({
      draftActions        : bindActionCreators( draftActions,       dispatch ),
      rmaEntryActions     : bindActionCreators( rmaEntryActions,    dispatch ),
      rmaSettingsActions  : bindActionCreators( rmaSettingsActions, dispatch )
    })
  )(DraftsMain)
)