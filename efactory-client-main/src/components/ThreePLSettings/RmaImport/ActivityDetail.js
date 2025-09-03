import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { formatDate } from '../../_Helpers/OrderStatus';

const RmaImportActivity = props => {
  const [filterValue, setFilterValue] = useState('')
  const [currentSortedField, setCurrentSortedField] = useState('pick_date')
  const [sortType, setSortType] = useState('descending')

  useEffect(
    () => {
      props.settingsActions.readRmaImportActivity_detail()
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    },
    []
  )

  function viewRma (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readRmaImportRmaData_detail( id ).then(
      () => global.$('#rma-data').modal('show')
    ).catch( e => {} )
  }

  function onFilterValueChange (event) {
    setFilterValue(event.target.value)
  }

  function filterActivityRecords (rma_import_activity_records) {
    const filterValue_ = filterValue.trim().toLowerCase()
    if (!filterValue_ || rma_import_activity_records.length === 0) {
      return rma_import_activity_records
    }
    rma_import_activity_records = rma_import_activity_records.filter( aRecord => {
      let {
        rma_number = '',
        env = '',
        account_number = '',
        location = '',
        om_number = ''
      } = aRecord

      rma_number = String( rma_number ).toLowerCase()
      env = String( env ).toLowerCase()
      account_number = String( account_number ).toLowerCase()
      location = String( location ).toLowerCase()
      om_number = String( om_number ).toLowerCase()

      switch (true) {
        case rma_number.includes(filterValue_):
        case env.includes(filterValue_):
        case account_number.includes(filterValue_):
        case location.includes(filterValue_):
        case om_number.includes(filterValue_):
          return true
        default:
          return false
      }
    } )
    return rma_import_activity_records
  }

  function sortActivityRecords (rma_import_activity_records) {
    rma_import_activity_records = [ ...rma_import_activity_records ]
    rma_import_activity_records.sort( function(a, b){
      let a_ = a[ currentSortedField ]
      let b_ = b[ currentSortedField ]
      if ( a_ < b_ ) return -1 //sort string ascending
      if ( a_ > b_ ) return 1
      return 0
    })
    if (sortType !== 'ascending') {
      rma_import_activity_records.reverse()
    }
    return rma_import_activity_records
  }

  function sort (event) {
    event.preventDefault()
    let field = event.currentTarget.getAttribute('data-field')
    setCurrentSortedField(field)
    setSortType(sortType === 'ascending' ? 'descending' : 'ascending')
  }

  let { threePLState } = props
  let { rma_import_activity = [], rma_import_rma_data = '' } = threePLState
  rma_import_activity = filterActivityRecords( rma_import_activity )
  rma_import_activity = sortActivityRecords( rma_import_activity )
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
                { rma_import_activity.length }
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
              onClick={props.settingsActions.readRmaImportActivity_detail}
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
                      'active' : currentSortedField === 'rma_number' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'rma_number' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="rma_number"
                      onClick={ sort }
                    > 
                      RMA #
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '90px' }}>
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
                  <th className="vertical-align-middle">
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'pick_date' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'pick_date' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="pick_date"
                      onClick={ sort }
                    > 
                      PICK DATE 
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
                  <th className="vertical-align-middle" style={{ width: '200px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'om_number' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'om_number' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="om_number"
                      onClick={ sort }
                    > 
                      OM #
                    </a>
                  </th>
                  <th className="vertical-align-middle" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'error_message' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'error_message' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="error_message"
                      onClick={ sort }
                    > 
                      ERROR MESSAGE
                    </a>
                  </th>
                  <th className="vertical-align-middle text-center" style={{ width: '300px' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>

                {
                  rma_import_activity.map( 
                    ( item, index ) => {
                      let {
                        id,
                        rma_number = '',
                        env = '',
                        account_number = '',
                        location = '',
                        pick_date = '',
                        om_number = '',
                        error_message = '',
                      } = item

                      return (
                        <tr className="odd gradeX clickable-row" key={ `order-import-${index}` }>
                          <td>
                            { index + 1 }
                          </td>
                          <td className="bold">
                            {
                              rma_number 
                              ? <Link className="text-primary" to={`${global.window.location.pathname}?rmaNum=${encodeURIComponent(rma_number)}&accountNum=${account_number ? account_number : ''}`}>
                                { rma_number }
                              </Link>
                              : rma_number
                            } 
                            {  }
                          </td>
                          <td>
                            { env }
                          </td>
                          <td> 
                            { formatDate( pick_date ) }
                          </td>
                          <td>
                            { account_number }
                          </td>
                          <td>
                            { location }
                          </td>
                          <td> 
                            { om_number }
                          </td>
                          <td style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "250px", color: "red", fontSize: "0.9em"}}> 
                            { error_message }
                          </td>
                          <td className="text-center">
                            <button 
                              type="button" 
                              className="btn btn-sm grey-gallery"
                              onClick={ viewRma }
                              data-id={ id }
                            >
                              View RMA
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
        id="rma-data"
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
                RMA
              </h4>
            </div>
            <div className="modal-body" style={{paddingTop: '0', paddingBottom: '50px' }}>
              <div className="section">
                <pre 
                  className="json_syntax" 
                  style={{ height: '70vh', overflow: 'scroll', marginTop: '20px', marginBottom: '20px' }} 
                  dangerouslySetInnerHTML={{ __html : rma_import_rma_data }}
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

RmaImportActivity.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default RmaImportActivity