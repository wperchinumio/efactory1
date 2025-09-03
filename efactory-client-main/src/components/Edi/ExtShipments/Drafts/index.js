import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import history from '../../../../history'
import formatOrderId from '../../../_Helpers/FormatOrderId'
import OrderDetails from '../../../DetailPages/OrderDetail/_Content'
import ComfirmModal from '../../../OrderPoints/OrderEntry/Modals/Confirm'
import * as ediActions from '../../redux'

const Drafts = ({
  ediActions,
  ediState,
  location: { search }
}) => {
  useEffect(
    () => {
      resetDraftsState()
      ediActions.readShipments()
    },
    []
  )

  function resetDraftsState () {
    ediActions.setRootReduxStateProp_multiple({
      loadedDrafts: true,
      selectedDraftRows: {},
      filterValue: '',
      shipments: [],
      is_shipments_fetched: false,
    })
  }

  function getDraftsAfterFilter () {
    let {
      shipments,
      filterValue
    } = ediState

    if( !filterValue ) {
      return shipments
    }
    filterValue = filterValue.trim().toLowerCase()
    shipments = shipments.filter( aDraft => {
      let {
        ship_id = '',
        order_number = '',
        reference_number = '',
        account_number = '',
        location = '',
        shipping_address = {}
      } = aDraft
      ship_id = formatOrderId( ship_id, false, 5 )
      let {
        company = '',
        attention = '',
        address1 = '',
        address2 = '',
        email = '',
        phone = '',
        city = '',
        state_province = '',
        postal_code = '',
        country = ''
      } = shipping_address
      switch ( true ) {
        case String(ship_id).toLowerCase().includes(filterValue):
        case String(order_number).toLowerCase().includes(filterValue):
        case String(reference_number).toLowerCase().includes(filterValue):
        case String(account_number).toLowerCase().includes(filterValue):
        case String(location).toLowerCase().includes(filterValue):
        case String(company).toLowerCase().includes(filterValue):
        case String(attention).toLowerCase().includes(filterValue):
        case String(address1).toLowerCase().includes(filterValue):
        case String(address2).toLowerCase().includes(filterValue):
        case String(email).toLowerCase().includes(filterValue):
        case String(phone).toLowerCase().includes(filterValue):
        case String(city).toLowerCase().includes(filterValue):
        case String(state_province).toLowerCase().includes(filterValue):
        case String(postal_code).toLowerCase().includes(filterValue):
        case String(country).toLowerCase().includes(filterValue):
          return true

        default:
          return false
      }
    } )
    return shipments
  }

  function onDeleteConfirmed () {
    ediActions.deleteShipments()
  }

  function onFilterValueChange (event) {
    let { value : filterValue } = event.target
    ediActions.setRootReduxStateProp_multiple({
      filterValue
    })
  }

  function onShipIdClicked (event) {
    event.preventDefault()
    let ship_id = event.target.getAttribute('data-id')
    ediActions.readShipment( ship_id ).then( 
      () => {
        history.push('/edi/ext-shipments/shipment-entry')
      } 
    ).catch( e => {} )
  }

  let { selectedDraftRows, is_shipments_fetched, filterValue } = ediState
  let { 
    setSelectedDraftRowsAll, 
    setSelectedDraftRows, 
  } = ediActions

  let shipments = getDraftsAfterFilter()

  let allChecked =  shipments 
                    ? ( shipments.length && ( shipments.length === Object.keys(selectedDraftRows).length ) ) 
                    : false

  let isOrderDetailDisplay  = false

  if( search && search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }

  let deleteDisabled = Object.keys(selectedDraftRows).length === 0

  return (

    <div>
      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>
        <div className="page-bar orderpoints-page-bar page-bar-fixed">
          <div className="page-breadcrumb">
            <div className="caption" style={{paddingLeft: "20px"}}>
              <span className="caption-subject font-green-seagreen">
                <i className="fa fa-cubes"></i>
                { ' ' }
                <span className="sbold">EXT. SHIPMENTS</span> - DRAFTS
              </span>
            </div>
          </div>
        </div>
        <div className="container-page-bar-fixed">
          <div className="portlet light bordered">
            <div className="portlet-title">
              <div className="caption caption-md font-dark">
                <i className="fa fa-location-arrow font-blue"></i>
                <span className="caption-subject bold uppercase font-blue">
                  Drafts: <strong className="font-dark"> 
                  { shipments.length }
                  </strong>
                </span>
              </div>
              <div className="inputs">
                <div className="portlet-input input-inline input-large">
                  <div className="input-icon right">
                    <i className="icon-magnifier"></i>
                    <input 
                      type="text" 
                      className="form-control input-circle"
                      value={ filterValue }
                      onChange={ onFilterValueChange }
                    />
                  </div>
                </div>
              </div>
              <div className="actions" style={{marginRight: 15}}>
                <div className="btn-group ">
                  <a className="btn green" href="#" data-toggle="dropdown" aria-expanded="true">
                    <i className="fa fa-cog"></i> Actions
                    <i className="fa fa-angle-down"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        data-toggle="modal"
                        className={classNames({
                          disabledLink : deleteDisabled
                        })}
                        href="#"
                        onClick={ event => {
                          event.preventDefault()
                          if( !deleteDisabled ){
                            global.$('#ext-drafts-confirm-delete').modal('show')
                          }
                        }}
                      >
                        <i className="fa fa-trash-o"></i> Delete selected </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="portlet-body">
              {
                is_shipments_fetched && shipments && shipments.length === 0 &&

                <div className="container-page-bar-fixed all-tasks">
                  <h3 className="font-red-soft">Sorry! You don't have any draft available at this time.</h3>
                </div>
              }
              {
                is_shipments_fetched && shipments && shipments.length !== 0 &&

                <div className="table-responsive">
                  <table className="table table-striped table-hover order-column row-sortable table-clickable">
                    <thead>
                      <tr className="uppercase table-header-1">
                        <th className="font-grey-salt" >
                          <label className="mt-checkbox mt-checkbox-outline">
                            <input
                              type="checkbox"
                              checked={ allChecked }
                              onChange={ event => setSelectedDraftRowsAll( !allChecked ) }/>
                              <span></span>
                          </label>
                        </th>
                        <th> # </th>
                        <th> Draft # </th>
                        <th> Account # </th>
                        <th> Order # </th>
                        <th> Reference # </th>
                        <th> Warehouse </th>
                        <th> Ship To </th>
                      </tr>
                    </thead>

                    <tbody className="ui-sortable">

                      { shipments.map( ( aDraft, index ) => {

                        let isDraftSelected = selectedDraftRows.hasOwnProperty( aDraft.ship_id )

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
                                  onChange={ event => setSelectedDraftRows( aDraft.ship_id ) }/>
                                <span></span>
                              </label>
                            </td>

                            <td>{ index+1 }</td>

                            <td>
                              <a
                                data-id={ aDraft.ship_id }
                                onClick={ onShipIdClicked }
                              >
                                {
                                  formatOrderId( aDraft.ship_id, false, 5 )
                                }
                              </a>
                            </td>

                            <td>{ aDraft.account_number }</td>

                            <td>{ aDraft.order_number }</td>

                            <td className="text-nowrap">{ aDraft.reference_number }</td>

                            <td>{ aDraft.location }</td>

                            <td className="text-address">
                              {
                                aDraft.shipping_address &&
                                <div className="ship-to-outer">
                                  <i className="font-blue-soft">
                                    {
                                      `${aDraft.shipping_address.company || ''} ${aDraft.shipping_address.company && aDraft.shipping_address.attention ? '|' : ''} ${aDraft.shipping_address.attention || ''}`
                                    }
                                  </i><br />
                                  {
                                    `${aDraft.shipping_address.city ? aDraft.shipping_address.city + ',' : ''}
                                    ${aDraft.shipping_address.state_province ? aDraft.shipping_address.state_province : ''}
                                    ${aDraft.shipping_address.postal_code ? aDraft.shipping_address.postal_code + '-' : ''}
                                    ${aDraft.shipping_address.country ? aDraft.shipping_address.country : ''}`
                                  }
                              </div>
                              }
                            </td>
                          </tr>

                        )
                      } ) }

                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      { 
        isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
      <ComfirmModal
        id="ext-drafts-confirm-delete"
        confirmationMessage="Are you sure you want to delete the selected drafts?"
        onConfirmHandler={ onDeleteConfirmed }
      />
    </div>
  )
}

export default connect(
  state => ({
    ediState : state.edi
  }),
  dispatch => ({
    ediActions : bindActionCreators( ediActions, dispatch )
  })
)(Drafts)