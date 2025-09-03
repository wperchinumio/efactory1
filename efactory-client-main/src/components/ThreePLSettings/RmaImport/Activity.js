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
      props.settingsActions.readRmaImportActivity()
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    },
    []
  )

  function viewRma (event) {
    let id = event.target.getAttribute('data-id')
    props.settingsActions.readRmaImportRmaData(id).then(
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
        environment = '',
        product_group = '',
        processed_at = '',
      } = aRecord

      environment = String( environment ).toLowerCase()
      product_group = String( product_group ).toLowerCase()
      processed_at = String( processed_at ).toLowerCase()

      switch ( true ) {
        case environment.includes(filterValue_):
        case product_group.includes(filterValue_):
        case processed_at.includes(filterValue_):
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
              onClick={props.settingsActions.readRmaImportActivity}
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
                  <th className="vertical-align-middle" style={{ width: '200px' }}>
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
                  <th className="vertical-align-middle" style={{ width: '200px' }}>
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
                  <th className="vertical-align-middle text-right" style={{ width: '150px' }}>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'total_rmas' && sortType === "ascending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'total_rmas' && sortType === "descending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="total_rmas"
                      onClick={ sort }
                    > 
                      TOTAL RMAS
                    </a>
                  </th>
                  <th className="vertical-align-middle text-right" style={{ width: '150px' }}>
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
                  <th className="vertical-align-middle text-center" style={{ width: '200px' }}>
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
                        environment = '',
                        product_group = '',
                        total_rmas = '',
                        total_imported = '',
                        on_demand = '',
                        processed_at = '',
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
                            { environment  }
                          </td>
                          <td>
                            { product_group }
                          </td>
                          <td className="text-right"> 
                            { total_rmas }
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

OrderImportActivity.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default OrderImportActivity