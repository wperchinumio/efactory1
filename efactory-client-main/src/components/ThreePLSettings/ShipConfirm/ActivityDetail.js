import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { formatDate } from '../../_Helpers/OrderStatus'

const ShipConfirmActivity = props => {
  const [filterValue, setFilterValue] = useState('')
  const [currentSortedField, setCurrentSortedField] = useState('ship_date')
  const [sortType, setSortType] = useState('descending')

  useEffect(
    () => {
      props.settingsActions.readShipConfirmActivity_detail()
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    },
    []
  )

  function onFilterValueChange (event) {
    setFilterValue(event.target.value)
  }

  function filterActivityRecords (ship_confirm_activity_records) {
    const filterValue_ = filterValue.trim().toLowerCase()
    if (!filterValue_ || ship_confirm_activity_records.length === 0 ) {
      return ship_confirm_activity_records
    }
    ship_confirm_activity_records = ship_confirm_activity_records.filter( aRecord => {
      let {
        delivery_id = '',
        env = '',
        account_number = '',
        location = ''
      } = aRecord

      delivery_id = String( delivery_id ).toLowerCase()
      env = String( env ).toLowerCase()
      account_number = String( account_number ).toLowerCase()
      location = String( location ).toLowerCase()

      switch ( true ) {
        case delivery_id.includes(filterValue_):
        case env.includes(filterValue_):
        case account_number.includes(filterValue_):
        case location.includes(filterValue_):
          return true
        default:
          return false
      }
    } )
    return ship_confirm_activity_records
  }

  function sortActivityRecords (ship_confirm_activity_records) {
    ship_confirm_activity_records = [ ...ship_confirm_activity_records ]
    ship_confirm_activity_records.sort( function(a, b){
      let a_ = a[ currentSortedField ]
      let b_ = b[ currentSortedField ]
      if ( a_ < b_ ) return -1 //sort string ascending
      if ( a_ > b_ ) return 1
      return 0
    })
    if (sortType !== 'ascending') {
      ship_confirm_activity_records.reverse()
    }
    return ship_confirm_activity_records
  }

  function sort (event) {
    event.preventDefault()
    let field = event.currentTarget.getAttribute('data-field')
    setCurrentSortedField(field)
    setSortType(sortType === 'ascending' ? 'descending' : 'ascending')
  }

  function viewAck (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readShipConfirmAckData_detail( id ).then(
      () => global.$('#ack-data').modal('show')
    ).catch( e => {} )
  }

  let { threePLState } = props
  let { ship_confirm_activity = [], ship_confirm_ack_data = '' } = threePLState
  ship_confirm_activity = filterActivityRecords(ship_confirm_activity)
  ship_confirm_activity = sortActivityRecords(ship_confirm_activity)
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
                { ship_confirm_activity.length }
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
              onClick={props.settingsActions.readShipConfirmActivity_detail}
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
                  <th className="vertical-align-middle" style={{ width: '250px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'delivery_id' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'delivery_id' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="delivery_id"
                      onClick={ sort }
                    > 
                      Delivery ID
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '80px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'env' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'env' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="env"
                      onClick={ sort }
                    > 
                      ENV
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '200px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'account_number' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'account_number' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="account_number"
                      onClick={ sort }
                    > 
                      Account #
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '90px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'location' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'location' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="location"
                      onClick={ sort }
                    > 
                      WH
                    </a>
                  </th>
                  <th className="vertical-align-middle">
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'ship_date' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'ship_date' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="ship_date"
                      onClick={ sort }
                    > 
                      SHIP DATE 
                    </a>
                  </th>
                  <th className="vertical-align-middle text-center" style={{ width: '200px' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  ship_confirm_activity.map( 
                    ( item, index ) => {
                      let {
                        id,
                        delivery_id,
                        env,
                        account_number,
                        location,
                        ship_date
                      } = item

                      return (
                        <tr className="odd gradeX clickable-row" key={ `order-import-${index}` }>
                          <td>
                            { index + 1 }
                          </td>
                          <td className="bold text-primary">
                            <Link to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(delivery_id)}&accountNum=${account_number ? account_number : ''}`}>
                              { delivery_id }
                            </Link>
                          </td>
                          <td>  
                            { env }
                          </td>
                          <td>
                            { account_number }
                          </td>
                          <td>
                            { location }
                          </td>
                          <td> 
                            { formatDate( ship_date ) }
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
                  dangerouslySetInnerHTML={{ __html : ship_confirm_ack_data }}
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

ShipConfirmActivity.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default ShipConfirmActivity