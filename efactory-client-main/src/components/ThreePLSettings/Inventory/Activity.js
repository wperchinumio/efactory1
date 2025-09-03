import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDate } from '../../_Helpers/OrderStatus'

const InventoryActivity = props => {
  const [filterValue, setFilterValue] = useState('')
  const [currentSortedField, setCurrentSortedField] = useState('processed_at')
  const [sortType, setSortType] = useState('descending')
  
  useEffect(
    () => {
      props.settingsActions.readInventoryActivity()
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    },
    []
  )

  function viewAck (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readInventoryAckData(id).then(
      () => global.$('#ack-data').modal('show')
    ).catch( e => {} )
  }

  function onFilterValueChange (event) {
    setFilterValue(event.target.value)
  }

  function filterActivityRecords (inventory_activity_records) {
    const filterValueTrimmed = filterValue.trim().toLowerCase()
    if (!filterValueTrimmed || inventory_activity_records.length === 0) {
      return inventory_activity_records
    }
    inventory_activity_records = inventory_activity_records.filter( aRecord => {
      let {
        environment = '',
        tr_type = '',
        on_demand = '',
        processed_at = ''
      } = aRecord
      environment = String( environment ).toLowerCase()
      tr_type = String( tr_type ).toLowerCase()
      on_demand = String( on_demand ).toLowerCase()
      processed_at = String( processed_at ).toLowerCase()
      switch ( true) {
        case environment.includes(filterValueTrimmed):
        case tr_type.includes(filterValueTrimmed):
        case on_demand.includes(filterValueTrimmed):
        case processed_at.includes(filterValueTrimmed):
          return true
        default:
          return false
      }
    } )
    return inventory_activity_records
  }

  function sortActivityRecords (inventory_activity_records) {
    inventory_activity_records = [ ...inventory_activity_records ]
    inventory_activity_records.sort( function(a, b){
      let a_ = a[ currentSortedField ]
      let b_ = b[ currentSortedField ]
      if ( a_ < b_ ) return -1 //sort string ascending
      if ( a_ > b_ ) return 1
      return 0
    })
    if (sortType !== 'ascending' ){
      inventory_activity_records.reverse()
    }
    return inventory_activity_records
  }

  function sort (event) {
    event.preventDefault()
    let field = event.currentTarget.getAttribute('data-field')
    setCurrentSortedField(field)
    setSortType(sortType === 'ascending' ? 'descending' : 'ascending')
  }

  let { threePLState } = props
  let { inventory_activity = [], inventory_ack_data = '' } = threePLState
  inventory_activity = filterActivityRecords(inventory_activity)
  inventory_activity = sortActivityRecords(inventory_activity)
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
                { inventory_activity.length }
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
              onClick={props.settingsActions.readInventoryActivity}
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
                  <th className="vertical-align-middle" style={{ width: '150px' }}>
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
                  <th className="vertical-align-middle" style={{ width: '80px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'tr_type' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'tr_type' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="tr_type"
                      onClick={ sort }
                    > 
                      TRANSACTION TYPE
                    </a>
                  </th>
                  <th className="vertical-align-middle text-right" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'total_transactions' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'total_transactions' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="total_transactions"
                      onClick={ sort }
                    > 
                      TOTAL TRANSACTIONS
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
                  <th className="vertical-align-middle text-center" style={{ width: '200px' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  inventory_activity.map( 
                    ( item, index ) => {
                      let {
                        id,
                        environment = '',
                        tr_type = '',
                        on_demand = '',
                        processed_at = '',
                        total_transactions = ''
                      } = item
                      return (
                        <tr className="odd gradeX clickable-row" key={ `order-import-${index}` }>
                          <td>
                            { index + 1 }
                          </td>
                          <td>
                            { formatDate( processed_at ) }
                          </td>
                          <td className="bold">
                            { environment }
                          </td>
                          <td>
                            { tr_type }
                          </td>  
                          <td className="text-right">
                            { total_transactions }
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
                  dangerouslySetInnerHTML={{ __html : inventory_ack_data }}
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

InventoryActivity.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default InventoryActivity