import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDate } from '../../_Helpers/OrderStatus'
import { Link } from 'react-router-dom'

const InventoryActivity = props => {
  const [filterValue, setFilterValue] = useState('')
  const [currentSortedField, setCurrentSortedField] = useState('sent_date')
  const [sortType, setSortType] = useState('descending')
  
  useEffect(
    () => {
      props.settingsActions.readInventoryActivity_detail()
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    },
    []
  )

  function viewAck (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readInventoryAckData_detail( id ).then(
      () => global.$('#ack-data').modal('show')
    ).catch( e => {} )
  }

  function onFilterValueChange (event) {
    setFilterValue(event.target.value)
  }

  function filterActivityRecords (inventory_activity_records) {
    const filterValue_ = filterValue.trim().toLowerCase()
    if (!filterValue_ || inventory_activity_records.length === 0) {
      return inventory_activity_records
    }
    inventory_activity_records = inventory_activity_records.filter( 
      aRecord => {
        let {
          transaction_id = '',
          env = '',
          transaction_type = '',
          workorder = '',
          item_number = '',
          mcu = '',
          sub_inv = '',
          locator = '',
        } = aRecord

        transaction_id = String( transaction_id ).toLowerCase()
        env = String( env ).toLowerCase()
        transaction_type = String( transaction_type ).toLowerCase()
        workorder = String( workorder ).toLowerCase()
        item_number = String( item_number ).toLowerCase()
        mcu = String( mcu ).toLowerCase()
        sub_inv = String( sub_inv ).toLowerCase()
        locator = String( locator ).toLowerCase()

        switch (true) {
          case transaction_id.includes(filterValue_):
          case env.includes(filterValue_):
          case transaction_type.includes(filterValue_):
          case workorder.includes(filterValue_):
          case item_number.includes(filterValue_):
          case mcu.includes(filterValue_):
          case sub_inv.includes(filterValue_):
          case locator.includes(filterValue_):
            return true
          default:
            return false
        }
      }
    )
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
              onClick={props.settingsActions.readInventoryActivity_detail}
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
                      'active' : currentSortedField === 'transaction_id' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'transaction_id' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="transaction_id"
                      onClick={ sort }
                    > 
                      TR. ID
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '60px' }}>
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
                  <th className="vertical-align-middle" style={{ width: '80px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'transaction_type' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'transaction_type' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="transaction_type"
                      onClick={ sort }
                    > 
                      TR. TYPE
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'workorder' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'workorder' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="workorder"
                      onClick={ sort }
                    > 
                      WORKORDER
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '250px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'item_number' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'item_number' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="item_number"
                      onClick={ sort }
                    > 
                      ITEM #
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '100px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'mcu' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'mcu' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="mcu"
                      onClick={ sort }
                    > 
                      MCU
                    </a>
                  </th>
                  <th className="vertical-align-middle text-right" style={{ width: '90px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'qty' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'qty' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="qty"
                      onClick={ sort }
                    > 
                      QTY
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '90px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'sub_inv' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'sub_inv' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="sub_inv"
                      onClick={ sort }
                    > 
                      SUBINV.
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '90px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'locator' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'locator' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="locator"
                      onClick={ sort }
                    > 
                      LOCATOR
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '200px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'sent_date' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'sent_date' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="sent_date"
                      onClick={ sort }
                    > 
                      DATA SENT
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
                        transaction_id = '',
                        env = '',
                        transaction_type = '',
                        workorder = '',
                        item_number = '',
                        mcu = '',
                        qty = '',
                        sub_inv = '',
                        locator = '',
                        sent_date = ''
                      } = item

                      return (
                        <tr className="odd gradeX clickable-row" key={ `order-import-${index}` }>
                          <td>
                            { index + 1 }
                          </td>
                          <td className="bold">
                            { transaction_id }
                          </td>
                          <td>  
                            { env }
                          </td>
                          <td>
                            { transaction_type }
                          </td>
                          <td>
                            { workorder === '0' ? '' : workorder }
                          </td>
                          <td>
                            <Link 
                              className="text-primary bold" 
                              to={`${global.window.location.pathname}?itemNum=${encodeURIComponent(item_number)}`}
                            >
                              { item_number }
                            </Link>
                          </td>
                          <td>
                            { mcu }
                          </td>
                          <td className="text-right bold">
                            { qty }
                          </td>
                          <td>
                            { sub_inv }
                          </td>
                          <td>
                            { locator }
                          </td>
                          <td> 
                            { formatDate( sent_date ) }
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