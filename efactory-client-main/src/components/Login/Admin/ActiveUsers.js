import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

const AdminOnlineUsers = props => {
  const [scrollbarWidth, setScrollbarWidth] = useState('15')
  const [sortField, setSortField] = useState('company_name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filterValue, setFilterValue] = useState('')
  
  useEffect(
    () => {
      calculateScrollBarWidth()
      props.loginActions.readUserStats()
      document.querySelector('#customer-filter-input').focus()
    },
    []
  )

  function calculateScrollBarWidth () {
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv)
    setScrollbarWidth(scrollDiv.offsetWidth - scrollDiv.clientWidth)
    document.body.removeChild(scrollDiv)
  }

  function handleFilterValueChange (event) {
    setFilterValue(event.target.value)
  }

  function filterRows (rows) {
    let filterValueNext = filterValue.trim()
    if (!filterValueNext) {
      return rows
    }
    filterValueNext = filterValueNext.toLowerCase()
    rows = rows.filter( 
      ({ 
        username,
        location,
        account_number,
        company_code,
        company_name,
        email,
        ws_only
      }) => {
        username = String( username ).toLowerCase()
        location = String( location ).toLowerCase()
        account_number = String( account_number ).toLowerCase()
        let account_location = `${account_number} - ${location}`
        company_code = String( company_code ).toLowerCase()
        company_name = String( company_name ).toLowerCase()
        email = String( email ).toLowerCase()
        ws_only = ws_only ? 'ws' : ''

        return  username.includes( filterValueNext ) ||
                account_location.includes( filterValueNext ) ||
                company_code.includes( filterValueNext ) ||
                email.includes( filterValueNext ) ||
                ws_only.includes( filterValueNext ) ||
                company_name.includes( filterValueNext )
      }
    )
    return rows
  }

  function onSortClicked (event) {
    let sortField = event.target.getAttribute('data-sort-field')
    let sortDirection = event.target.getAttribute('data-sort-direction')
    setSortField(sortField)
    setSortDirection(sortDirection)
  }

  function sort (rows) {
    rows = [ ...rows ]
    rows.sort( ( first, second ) => {
      var firstValue = first[ sortField ] 
      var secondValue = second[ sortField ] 
      if (sortField === 'ws_only') {
        firstValue = first[ sortField ] ? 'WS' : ''
        secondValue = second[ sortField ] ? 'WS' : ''
      }
      if (!firstValue && !secondValue) {
        return 0
      }else if (!firstValue) {
        return -1
      }else if (!secondValue) {
        return 1
      }
      firstValue  = firstValue.toLowerCase()
      secondValue = secondValue.toLowerCase()
      return (firstValue < secondValue) 
             ? -1 
             : (firstValue > secondValue) 
               ? 1 
               : 0
    } )
    if (sortDirection === 'desc') {
      rows.reverse()
    }
    return rows
  }

  let { auth, loginActions } = props
  let { 
    user_stats,
    user_stats_date,
    loadedUserStats
  } = auth
  let total_user_stats = user_stats.length
  user_stats = filterRows( user_stats )
  user_stats = sort( user_stats )
  let isRowsLessThanTotal = +total_user_stats && ( ( +total_user_stats - user_stats.length ) > 0 )
  let total_active_users = user_stats.filter( 
    ({ is_online }) => is_online 
  )['length']
  return (
    <div>
      <div className="portlet light bordered">
        <div className="portlet-title">
          <div className="caption caption-md font-dark">
            <i className="fa fa-location-arrow font-blue"></i>
            <span className="caption-subject bold uppercase font-blue">
              eFactory Users: <strong className="font-dark"> { total_user_stats } </strong> 
              <span className="filtered-rows-number">
                { isRowsLessThanTotal ? `(${user_stats.length} filtered)` : '' }
              </span>
            </span>
            <br/>
            <span 
                style={{  
                  fontSize: '11px',
                  paddingLeft: '17px',
                  fontWeight: '700',
                }}
              >
                Last refresh:&nbsp;
                <span 
                  style={{  
                    fontWeight: '500'
                  }}
                >
                  { 
                    user_stats_date 
                    ? moment( user_stats_date ).format('MM/DD/YYYY hh:mm a')
                    : ''
                  }
                </span>
              </span>
          </div>
          <div className="actions" style={{ marginLeft: '10px' }}>
            <div className="btn-group ">
              <button 
                type="button" 
                className="btn green-seagreen btn-sm"
                onClick={ loginActions.downloadUserStats }
                style={{ marginRight : '10px' }}
                disabled={ !loadedUserStats }
              >
                <i className="fa fa-file-excel-o"></i> EXPORT
              </button>
            </div>
          </div>
          <div className="inputs" style={{ position: 'relative', bottom: '-2px' }}>
            <div 
              className="portlet-input input-inline input-large" 
              style={{ 
                borderRight : '1px solid #ccc',
                paddingRight : '10px'
              }}
            >
              <div className="input-icon right">
                <i className="icon-magnifier"></i>
                <input 
                  type="text" 
                  className="form-control input-circle" 
                  placeholder="filter" 
                  value={ filterValue }
                  id="customer-filter-input"
                  onChange={ handleFilterValueChange }
                />
              </div>
            </div>
          </div>
          <div className="actions">
            <div className="btn-group ">
              <button 
                type="button" 
                className="btn green-seagreen btn-sm"
                onClick={ props.loginActions.readUserStats }
                style={{ marginRight : '10px' }}
              >
                <i className="fa fa-refresh"></i> Refresh
              </button>
            </div>
          </div>
        </div>
        <div className="portlet-body">
          <div className="cell-active-user-helper inline-block" style={{ height: '30px' }}>
            <i className="fa fa-user font-20 font-yellow-gold" aria-hidden="true" /> 
            &nbsp;
            ONLINE USERS: <span className="bold">{ total_active_users }</span>
          </div>
          <div className="" style={{ height: 'calc( 100vh - 245px )' }}>
            <div className="table-header-1" style={{ paddingRight: `${scrollbarWidth}px` }}>
              <table 
                className="table table-header-1 table-striped table-hover order-column row-sortable table-clickable documents-table"
                style={{ marginBottom: '-2px', width: '100%' }}
              >
                <ColGroup />
                <thead>
                  <tr className="uppercase table-header-1">
                    <th> # </th>
                    <th>
                      <span className="column-sort">
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-up' : true,
                            'active' : sortField === 'username' && sortDirection === 'asc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span 
                        className="column-sort column-sort-up"
                      >
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-down' : true,
                            'active' : sortField === 'username' && sortDirection === 'desc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <a 
                        className="font-grey-salt" 
                        data-sort-field="username"
                        data-sort-direction={ 
                          sortField === 'username' 
                          ? sortDirection === 'asc'
                            ? 'desc' 
                            : 'asc' 
                          : 'asc'
                        }
                        onClick={ onSortClicked }
                      >
                        Username
                      </a>
                    </th>
                    <th>
                      <span className="column-sort">
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-up' : true,
                            'active' : sortField === 'company_name' && sortDirection === 'asc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span 
                        className="column-sort column-sort-up"
                      >
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-down' : true,
                            'active' : sortField === 'company_name' && sortDirection === 'desc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <a 
                        className="font-grey-salt" 
                        data-sort-field="company_name"
                        data-sort-direction={ 
                          sortField === 'company_name' 
                          ? sortDirection === 'asc'
                            ? 'desc' 
                            : 'asc' 
                          : 'asc'
                        }
                        onClick={ onSortClicked }
                      >
                        Company
                      </a>
                    </th>
                    <th className="text-center">
                      <span className="column-sort">
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-up' : true,
                            'active' : sortField === 'ws_only' && sortDirection === 'asc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span 
                        className="column-sort column-sort-up"
                      >
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-down' : true,
                            'active' : sortField === 'ws_only' && sortDirection === 'desc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <a 
                        className="font-grey-salt" 
                        data-sort-field="ws_only"
                        data-sort-direction={ 
                          sortField === 'ws_only' 
                          ? sortDirection === 'asc'
                            ? 'desc' 
                            : 'asc' 
                          : 'asc'
                        }
                        onClick={ onSortClicked }
                      >
                        WS ONLY
                      </a>
                    </th>
                    <th>
                      <span className="column-sort">
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-up' : true,
                            'active' : sortField === 'email' && sortDirection === 'asc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span 
                        className="column-sort column-sort-up"
                      >
                        <i 
                          className={ classNames({
                            'fa fa-long-arrow-down' : true,
                            'active' : sortField === 'email' && sortDirection === 'desc'
                          }) } 
                          aria-hidden="true"
                        ></i>
                      </span>
                      <a 
                        className="font-grey-salt" 
                        data-sort-field="email"
                        data-sort-direction={ 
                          sortField === 'email' 
                          ? sortDirection === 'asc'
                            ? 'desc' 
                            : 'asc' 
                          : 'asc'
                        }
                        onClick={ onSortClicked }
                      >
                        E-mail
                      </a>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div style={{ height: 'calc( 100% - 45px )', overflowY: 'scroll' }}>
              <table className="table table-striped table-hover order-column row-sortable table-clickable">
                <ColGroup />
                <tbody className="ui-sortable">
                  {
                    user_stats.map( 
                      (
                        {  
                          account_number,
                          company_code,
                          company_name,
                          email,
                          is_master,
                          is_online,
                          location,
                          row_id,
                          username,
                          ws_only
                        },
                        index
                      ) => {
                        return (
                          <tr 
                            className="odd gradeX clickable-row ui-sortable-handle"
                            key={ `online-user-row-${row_id}` }
                          >
                            <td>
                              { index + 1 } 
                            </td>
                            <td 
                              className={ classNames({
                                'sbold' : is_master
                              }) }
                            >
                              { username } 
                              {
                                is_online &&
                                <i className="fa fa-user pull-right font-20 font-yellow-gold" aria-hidden="true" />
                              }
                            </td>
                            <td style={{ position : 'relative' }}>
                              <span style={{ fontWeight : '600' }}>
                                { `${account_number} - ${location}`}
                              </span>
                              <br/>
                              <div>
                                <span className="user-login-company">{ company_name } </span><span className="font-blue-dark" style={{paddingLeft: "10px"}}>{ company_code }</span> 
                              </div>
                            </td>
                            <td className="text-center" style={{position: "relative"}}>
                              { ws_only ? 'WS' : '' }
                            </td>
                            <td style={{position: "relative"}}>
                              { email }
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
      </div>
    </div>
  )
}

function ColGroup () {
  return <colgroup>
    <col style={{ width: "35px" }}></col>
    <col style={{ width: "200px" }}></col>
    <col style={{ width: "200px" }}></col>
    <col style={{ width: "80px" }}></col>
    <col style={{ width: "400px" }}></col>
  </colgroup>
}

AdminOnlineUsers.propTypes = {
  loginActions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

export default AdminOnlineUsers