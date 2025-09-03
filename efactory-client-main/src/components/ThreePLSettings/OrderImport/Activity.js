import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDate } from '../../_Helpers/OrderStatus'

const OrderImportActivity = props => {
  const [filterValue, setFilterValue] = useState('')
  const [currentSortedField, setCurrentSortedField] = useState('processed_at')
  const [sortType, setSortType] = useState('descending')
  
  useEffect(
    () => {
      props.settingsActions.readOrderImportActivity()
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    },
    []
  )

  function viewOrder (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readOrderImportOrderData( id ).then(
      () => global.$('#order-data').modal('show')
    ).catch( e => {} )
  }
  
  function viewAck (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readOrderImportAckData( id ).then(
      () => global.$('#ack-data').modal('show')
    ).catch( e => {} )
  }

  function onFilterValueChange (event) {
    setFilterValue(event.target.value)
  }

  function filterActivityRecords (order_import_activity_records) {
    const filterValue_ = filterValue.trim().toLowerCase()
    if (!filterValue_ || order_import_activity_records.length === 0 ) {
      return order_import_activity_records
    }
    order_import_activity_records = order_import_activity_records.filter( aRecord => {
      let {
        environment = '',
        product_group = '',
        total_orders = '',
        total_imported = '',
        processed_at = ''
      } = aRecord
      environment = String( environment ).toLowerCase()
      product_group = String( product_group ).toLowerCase()
      total_orders = String( total_orders ).toLowerCase()
      total_imported = String( total_imported ).toLowerCase()
      processed_at = String( processed_at ).toLowerCase()
      switch (true) {
        case environment.includes(filterValue_):
        case product_group.includes(filterValue_):
        case total_orders.includes(filterValue_):
        case total_imported.includes(filterValue_):
        case processed_at.includes(filterValue_):
          return true
        default:
          return false
      }
    } )
    return order_import_activity_records
  }

  function sortActivityRecords (order_import_activity_records) {
    order_import_activity_records = [ ...order_import_activity_records ]
    order_import_activity_records.sort( function(a, b){
      let a_ = a[ currentSortedField ]
      let b_ = b[ currentSortedField ]
      if ( a_ < b_ ) return -1 //sort string ascending
      if ( a_ > b_ ) return 1
      return 0
    })
    if (sortType !== 'ascending') {
      order_import_activity_records.reverse()
    }
    return order_import_activity_records
  }

  function sort (event) {
    event.preventDefault()
    let field = event.currentTarget.getAttribute('data-field')
    setCurrentSortedField(field)
    setSortType(sortType === 'ascending' ? 'descending' : 'ascending')
  }

  let { threePLState } = props
  let { 
    order_import_activity = [],
    order_import_order_data = '',
    order_import_ack_data = '',
  } = threePLState
  order_import_activity = filterActivityRecords(order_import_activity)
  order_import_activity = sortActivityRecords(order_import_activity)
  return (
    <div>
      <div className="portlet light bordered">
        <div className="portlet-title">
          <div className="caption caption-md font-dark"><i className="fa fa-folder font-green-seagreen"></i>
            <span>
              <span className="caption-subject bold uppercase font-green-seagreen">
                Log Activity: &nbsp;
              </span>
              <strong className="font-dark">
                { order_import_activity.length }
              </strong>
            </span>
          </div>
          <div className="inputs" style={{ marginLeft: '15px' }}>
            <div className="portlet-input input-inline input-large">
              <div className="input-icon right">
                <i className="icon-magnifier"></i>
                <input 
                  type="text" 
                  className="form-control input-circle" 
                  placeholder="filter" 
                  value={ filterValue }
                  onChange={ onFilterValueChange }
                />
              </div>
            </div>
          </div>
          <div className="actions">
            <button 
              type="button" 
              className="btn btn-topbar btn-sm"
              onClick={props.settingsActions.readOrderImportActivity}
            >
              <i className="fa fa-refresh"></i> &nbsp;REFRESH
            </button>
          </div>
        </div>
        <div className="portlet-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover order-column table-clickable documents-table">
              <thead>
                <tr className="table-header-1 uppercase bg-dark">
                  <th className="vertical-align-middle" style={{ width: '60px' }}>
                    #
                  </th>
                  <th className="vertical-align-middle" style={{ width: '200px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'processed_at' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'processed_at' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="processed_at"
                      onClick={ sort }
                    > 
                      PROCESSED AT
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'environment' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'environment' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="environment"
                      onClick={ sort }
                    > 
                      ENVIRONMENT
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'product_group' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'product_group' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="product_group"
                      onClick={ sort }
                    > 
                      PRODUCT GROUP
                    </a>
                  </th>
                  <th className="vertical-align-middle text-right" style={{ width: '200px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'total_orders' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'total_orders' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="total_orders"
                      onClick={ sort }
                    > 
                      TOTAL ORDERS
                    </a>
                  </th>
                  <th className="vertical-align-middle text-right" style={{ width: '200px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'total_imported' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'total_imported' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="total_imported"
                      onClick={ sort }
                    > 
                      TOTAL IMPORTED
                    </a>
                  </th>
                  <th className="vertical-align-middle text-center" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'on_demand' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'on_demand' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="on_demand"
                      onClick={ sort }
                    > 
                      ON DEMAND
                    </a>
                  </th>
                  <th className="vertical-align-middle text-center" style={{ width: '300px' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  order_import_activity.map( 
                    ( item, index ) => {
                      let {
                        environment,
                        id,
                        on_demand,
                        processed_at,
                        product_group,
                        total_imported,
                        total_orders
                      } = item
                      return (
                        <tr className="odd gradeX clickable-row" key={ `order-import-${index}` }>
                          <td>
                            { index + 1 }
                          </td>
                          <td> 
                            { formatDate( processed_at ) }
                          </td>
                          <td>
                            { environment }
                          </td>
                          <td>
                            { product_group }
                          </td>
                          <td className="text-right">
                            { total_orders }
                          </td>
                          <td className="text-right">
                            { total_imported }
                          </td>
                          <td className="text-center">
                            {
                              on_demand && 
                              <i className="fa font-blue-soft fa-check-square-o"></i>
                            }
                            
                            {
                              !on_demand && 
                              <i className="fa font-blue-soft fa-square-o"></i>
                            }
                          </td>
                          <td className="text-center">
                            <button 
                              type="button" 
                              className="btn btn-sm grey-gallery"
                              onClick={ viewOrder }
                              data-id={ id }
                            >
                              View Orders
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-sm grey-gallery"
                              onClick={ viewAck }
                              data-id={ id }
                            >
                              View Ack
                            </button>
                          </td>
                        </tr>
                      )
                    }
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div 
        className="modal modal-themed fade draggable-modal" 
        id="order-data" 
        tabIndex="-1" 
        role="dialog" 
        aria-hidden={true}
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header rs_title_bar">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="uppercase">
                Order
              </h4>
            </div>
            <div className="modal-body" style={{paddingTop: '0', paddingBottom: '50px' }}>
              {
                false &&
                <div>
                  <p style={{fontWeight: 400}}>
                    Please tell us what you think. Any kind of feedback is highly appreciated.
                  </p>
                </div>
              }
              <div className="section">
                <pre 
                  className="json_syntax" 
                  style={{ height: '70vh', overflow: 'scroll', marginTop: '20px', marginBottom: '20px' }} 
                  dangerouslySetInnerHTML={{ __html : order_import_order_data }}
                >
                </pre>
              </div>
              <span className="pull-right" >
                <button
                  type="button"
                  className="btn btn-default btn-outline"
                  data-dismiss="modal">
                  Close
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div 
        className="modal modal-themed fade draggable-modal"
        id="ack-data"
        tabIndex="-1"
        role="dialog"
        aria-hidden={true}
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header rs_title_bar">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="uppercase">
                ACKNOWLEDGMENT
              </h4>
            </div>
            <div className="modal-body" style={{paddingTop: '0', paddingBottom: '50px' }}>
              {
                false &&
                <div>
                  <p style={{fontWeight: 400}}>
                    Please tell us what you think. Any kind of feedback is highly appreciated.
                  </p>
                </div>
              }
              <div className="section">
                <pre 
                  className="json_syntax" 
                  style={{ height: '70vh', overflow: 'scroll', marginTop: '20px', marginBottom: '20px' }} 
                  dangerouslySetInnerHTML={{ __html : order_import_ack_data }}
                >
                </pre>
              </div>
              <span className="pull-right" >
                <button
                  type="button"
                  className="btn btn-default btn-outline"
                  data-dismiss="modal">
                  Close
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OrderImportActivity.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default OrderImportActivity