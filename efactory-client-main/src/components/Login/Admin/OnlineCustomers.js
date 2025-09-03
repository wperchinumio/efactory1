import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

const AdminOnlineUsers = props => {
  const [scrollbarWidth, setScrollbarWidth] = useState('15')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('company_name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [latitude, setLatitude] = useState('',)
  const [longitude, setLongitude] = useState('',)
  const [modalOpen, setModalOpen] = useState(false)

  const onModalClosed = useCallback(
    () => {
      setModalOpen(false)
    },
    []
  )

  useEffect(
    () => {
      calculateScrollBarWidth()
      props.loginActions.listOnlineCustomers()
      document.querySelector('#customer-filter-input').focus()
      global.$(`#online-customer-on-map`).on('hide.bs.modal', onModalClosed )
      return () => {
        global.$(`#online-customer-on-map`).off('hide.bs.modal', onModalClosed )
      }
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

  function filterRows (rows) {
    let filterValue_ = filterValue.trim()
    if( !filterValue_ ) return rows
    filterValue_ = filterValue_.toLowerCase()
    rows = rows.filter( 
      ({ 
        username,
        location,
        account_number,
        company_code,
        company_name,
        short_browser
      }) => {
        username          = String( username ).toLowerCase()
        location          = String( location ).toLowerCase()
        account_number    = String( account_number ).toLowerCase()
        let account_location = `${account_number} - ${location}`
        company_code      = String( company_code ).toLowerCase()
        company_name      = String( company_name ).toLowerCase()
        short_browser     = String( short_browser ).toLowerCase()

        return  username.includes( filterValue_ ) || 
                account_location.includes( filterValue_ ) || 
                company_code.includes( filterValue_ ) || 
                company_name.includes( filterValue_ ) || 
                short_browser.includes( filterValue_ )
      }
    )
    return rows
  }

  function onSortClicked (event) {
    setSortField(event.target.getAttribute('data-sort-field'))
    setSortDirection(event.target.getAttribute('data-sort-direction'))
  }

  function sort (rows) {
    rows = [ ...rows ]
    rows.sort( ( first, second ) => {
      var firstValue = first[ sortField ].toLowerCase()
      var secondValue = second[ sortField ].toLowerCase()
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

  function onMapClicked (event) {
    let ip_address = event.target.getAttribute('data-ip-address')
    if (!ip_address) {
      return
    }
    props.loginActions.getIpDetails(ip_address).then(
      ({ latitude, longitude }) => {
        if( latitude && longitude ){
          setLatitude(latitude)
          setLongitude(longitude)
          setModalOpen(true)
          setTimeout(
            () => {
              global.$('#online-customer-on-map').modal('show')
            },
            100
          )
        }else{
          console.warn('no latitude or longitude found')
        }
      }
    )
  }

  let { auth } = props
  let { 
    online_customer_rows, 
    online_customer_date,
    total_online_customer_rows
  } = auth
  online_customer_rows = filterRows(online_customer_rows)
  online_customer_rows = sort(online_customer_rows)
  let isRowsLessThanTotal = +total_online_customer_rows && ( ( +total_online_customer_rows - online_customer_rows.length ) > 0 )
  return (
    <div>
      <div className="portlet light bordered">
        <div className="portlet-title">
          <div className="caption caption-md font-dark">
            <i className="fa fa-location-arrow font-blue"></i>
            <span className="caption-subject bold uppercase font-blue">
              Online customers: <strong className="font-dark"> { total_online_customer_rows } </strong> 
              <span className="filtered-rows-number">
                { isRowsLessThanTotal ? `(${online_customer_rows.length} filtered)` : '' }
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
                    online_customer_date 
                    ? moment( online_customer_date ).format('MM/DD/YYYY hh:mm a')
                    : ''
                  }
                </span>
              </span>
          </div>
          <div className="inputs">
            <div className="portlet-input input-inline input-large">
              <div className="input-icon right">
                <i className="icon-magnifier"></i>
                <input 
                  type="text" 
                  className="form-control input-circle" 
                  placeholder="filter" 
                  value={ filterValue }
                  id="customer-filter-input"
                  onChange={event => setFilterValue(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="actions">
            <div className="btn-group ">
              <button 
                type="button" 
                className="btn green-seagreen btn-sm"
                onClick={ props.loginActions.listOnlineCustomers }
                style={{ marginRight : '10px' }}
              >
                <i className="fa fa-refresh"></i> Refresh
              </button>
            </div>
          </div>
        </div>
        <div className="portlet-body">
          <div className="" style={{ height: 'calc( 100vh - 215px )' }}>
            <table 
              className="table table-header-1 table-striped table-hover order-column row-sortable table-clickable documents-table"
              style={{ marginBottom: '-2px', width: '100%', paddingRight: `${scrollbarWidth}px` }}
            >
              <colgroup>
                <col style={{ width: "35px" }}></col>
                <col style={{ width: "200px" }}></col>
                <col style={{ width: "400px" }}></col>
                <col></col>
              </colgroup>
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
                  <th>
                    <span className="column-sort">
                      <i 
                        className={ classNames({
                          'fa fa-long-arrow-up' : true,
                          'active' : sortField === 'short_browser' && sortDirection === 'asc'
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
                          'active' : sortField === 'short_browser' && sortDirection === 'desc'
                        }) } 
                        aria-hidden="true"
                      ></i>
                    </span>
                    <a 
                      className="font-grey-salt" 
                      data-sort-field="short_browser"
                      data-sort-direction={ 
                        sortField === 'short_browser' 
                        ? sortDirection === 'asc'
                          ? 'desc' 
                          : 'asc' 
                        : 'asc'
                      }
                      onClick={ onSortClicked }
                    >
                      Browser
                    </a>
                  </th>
                </tr>
              </thead>
            </table>
            <div style={{ height: 'calc( 100% - 45px )', overflowY: 'scroll' }}>
              <table className="table table-striped table-hover order-column row-sortable table-clickable">
                <colgroup>
                  <col style={{ width: "35px" }}></col>
                  <col style={{ width: "200px" }}></col>
                  <col style={{ width: "400px" }}></col>
                  <col></col>
                </colgroup>
                <tbody className="ui-sortable">
                  {
                    online_customer_rows.map( 
                      (
                        { 
                          row_id, 
                          username, 
                          account_number, 
                          location,
                          company_name, 
                          short_browser, 
                          is_master, 
                          company_code,
                          long_browser,
                          ip_address
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
                            </td>
                            <td style={{ position : 'relative' }}>
                              <span style={{ fontWeight : '600' }}>
                                { `${account_number} - ${location}`}
                              </span>
                              <br/>
                              <div>
                                <span className="user-login-company">{ company_name } </span><span className="font-blue-dark" style={{paddingLeft: "10px"}}>{ company_code }</span> 
                              </div>
                              <div>
                                <i 
                                  className="icon-pointer online-customer-map"
                                  style={ ip_address && !ip_address.startsWith('192.168') ? {} : { display : 'none' } }
                                  data-ip-address={ ip_address }
                                  onClick={ onMapClicked }
                                ></i>
                              </div>
                            </td>
                            <td style={{position: "relative"}}>
                              <div 
                                className={ 
                                  classNames({
                                    'browser-default browser-wrapper' : true,
                                    'browser-edge' : short_browser.startsWith('Edge'),
                                    'browser-ie' : short_browser.startsWith('IE'),
                                    'browser-chrome' : short_browser.startsWith('Chrome'),
                                    'browser-safari' : short_browser.startsWith('Safari'),
                                    'browser-firefox' : short_browser.startsWith('Firefox'),
                                    'browser-opera' : short_browser.startsWith('Opera'),
                                  }) 
                                } 
                              >
                                <i 
                                  className={ classNames({
                                    'fa' : true,
                                    'fa-internet-explorer' : short_browser.startsWith('IE'),
                                    'fa-edge' : short_browser.startsWith('Edge'),
                                    'fa-chrome' : short_browser.startsWith('Chrome'),
                                    'fa-safari' : short_browser.startsWith('Safari'),
                                    'fa-firefox' : short_browser.startsWith('Firefox'),
                                    'fa-opera' : short_browser.startsWith('Opera'),
                                  }) }  
                                  aria-hidden="true"
                                ></i>
                              </div>
                              <span style={{ paddingLeft: '35px' }}> 
                                { short_browser } 
                              </span>
                              <br/>
                              <span style={{ color : '#AAA', fontSize : '10px', paddingLeft: "35px" }}>
                                { long_browser }
                              </span>
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
      <div
        className="modal modal-themed fade"
        data-backdrop="static"
        id="online-customer-on-map" 
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ width: '750px' }}>
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true">
              </button>
              <h4 className="modal-title"> Customer location </h4>
            </div>
            <div className="modal-body" style={{ height: '400px' }}>
              {
                modalOpen && latitude && longitude &&
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={ 
                    `https://maps.google.com/maps?q=${ latitude },${ longitude }&hl=en&z=10&output=embed`
                  }
                >
                </iframe>
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

AdminOnlineUsers.propTypes = {
  loginActions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

export default AdminOnlineUsers