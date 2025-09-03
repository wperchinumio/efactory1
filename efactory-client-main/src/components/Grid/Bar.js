import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const TableBar = ({
  config = {
    pageIcon : 'icon-grid',
    pageTitle : '',
    pageSubtitle : '',
    isFilterButtonHidden : false,
    isToggleSummaryButtonHidden : false
  },
  currentView,
  orderSummaryVisible,
  toggleOrderSummary,
  refresh,
  views,
  selectView,
  pathname,
  resetFilters,
  isToggleSummaryBtnVisible,
  isSchedulerHidden,
  exportView,
  filter_list = [],
  unsetFilter,
  selectFilter,
  filter_id = '',
  onSchedulerClicked
}) => {
  filter_id = isNaN(filter_id) ? filter_id : +filter_id
  let selectedFilter = filter_list.filter( f => f.id === filter_id )[0]
  return (

      <div className="page-bar grid-page-bar noselect" >
        <div className="page-breadcrumb">
          <div className="caption">

            <span className="caption-subject font-green-seagreen">
              <i className={ config.pageIcon } />
              &nbsp;
              <span className="sbold">
                { config.pageTitle }
              </span>
              { config.pageSubtitle ? ' - ' + config.pageSubtitle : '' }
            </span>
          </div>
        </div>

        <div className="page-toolbar" id="page-toolbar-blockonload">

          <div className="btn-group btn-group-refresh">
            <button type="button" className="btn btn-topbar btn-sm"
              onClick={refresh} id="refresh-btn">
              <i className="fa fa-refresh" />
              <span>{ " " }</span>
              {
                currentView && currentView.name
              }
            </button>
            <button type="button" className="btn btn-topbar btn-sm dropdown-toggle" data-toggle="dropdown"  data-delay="1000" data-close-others="true" aria-expanded="false">
              <i className="fa fa-angle-down" />
            </button>
            <ul className="dropdown-menu pull-right" role="menu">
              {views.map((view)=>{
                return (
                  <li
                    className={view.selected ? "active" : ""}
                    key={view.id}
                  >
                    <a
                      onClick={()=>selectView(view.id)}
                    >
                      <i className="fa fa-table font-green-seagreen" />
                      <span className={view.selected ? 'bold' : ""}> {view.name} </span>
                    </a>
                  </li>
                )
              })}
              <li className="divider"> </li>
              <li>
                <Link to={`${pathname}/view/${currentView && currentView.id}`}>
                  <i className="fa fa-gear font-dark" />
                  Customize...
                </Link>
              </li>
              <li className="divider"> </li>
              <li className="dropdown-submenu">
              <a>
              <i className="fa fa-cloud-download font-green-seagreen"/>
              &nbsp;Export To
              </a>
              <ul className="dropdown-menu" role="menu" style={{left: pathname === '/services/administration-tasks/invoices/rate-cards'? '150px': '' }}>
                 <li onClick={ event => exportView('excel') } >
                    <a>
                      <i className="fa fa-file-excel-o font-green-soft"/>
                        &nbsp;Excel
                    </a>
                  </li>
                  { pathname === '/services/administration-tasks/invoices/rate-cards' &&
                    <li onClick={ event => exportView('excel_rate_cards') } >
                      <a>
                        <i className="fa fa-file-excel-o font-green-soft"/>
                          &nbsp;Rate Cards
                      </a>
                      </li>
                  }
                  <li onClick={ event => exportView('csv') } >
                    <a>
                      <i className="fa fa-file-text-o font-green-soft"/>
                        &nbsp;Csv
                    </a>
                  </li>
                  <li onClick={ event => exportView('zip') } >
                    <a>
                      <i className="fa fa-file-archive-o font-green-soft"/>
                        &nbsp;Zip
                    </a>
                  </li>
              </ul>
             </li>
              {
                !isSchedulerHidden &&
                <li className="divider"> </li>
              }
              {
                !isSchedulerHidden &&
                  <li>
                    <a
                      onClick={ event => {
                        event.preventDefault()
                        onSchedulerClicked()
                      } }
                    >
                      <i className="fa fa-calendar-check-o font-blue-soft">
                      </i> Schedule report...
                    </a>
                </li>
              }

            </ul>
          </div>
          <span>


          <div className="btn-group btn-group-save-filter">
          {' '}
            <button
              className={ classNames({
                'btn btn-sm dropdown-toggle'  : true,
                'btn-topbar'      : !(filter_list.length > 0 && filter_id),
                'red-soft'      : filter_list.length > 0 && filter_id
              }) }
              data-toggle="dropdown" aria-expanded="false" id="filter-btn">
              <i className="fa fa-filter" />
              &nbsp;
              { selectedFilter ? selectedFilter.name : '' }
              &nbsp;
              <i className="fa fa-angle-down" />
            </button>
            <ul className="dropdown-menu pull-right" role="menu">
              <li>
                <a
                  data-toggle="modal"
                  href="#modal-save-current-filter"
                ><i className="fa fa-save font-blue-soft" /> Save current filter... </a>
              </li>
              <li className="divider"> </li>
              <li>
                <a onClick={
                  ()=>{
                    resetFilters()
                  }
                }><i className="fa fa-remove font-blue-soft" /> Reset </a>
              </li>
              <li className="divider"> </li>
              <li>
                <Link to={`${pathname}/manage-filters`}>
                  <i className="fa fa-gear font-blue-soft" /> Manage filters...
                </Link>
              </li>
              {
                filter_list.length > 0 &&
                <li className="divider"> </li>
              }

              {
                filter_list.map( filter => {
                  return (
                    <li
                      key={ `bar-filters-key-${filter.id}` }
                      onClick={ event => {
                        if( filter.id === filter_id ){
                          unsetFilter()
                        }else{
                          selectFilter( filter.id )
                        }
                      } }
                    >
                      <a className="filter-name">
                        <i className={ classNames({
                          'fa'                : true,
                          'fa-check font-red' : +filter.id === filter_id,
                          'fa-place-holder'   : +filter.id !== filter_id
                        }) }>
                        </i> { filter.name }
                      </a>
                    </li>
                  )
                } )
              }

            </ul>
          </div>

          {
            isToggleSummaryBtnVisible &&
            <div className="btn-group hidden-xs hidden-sm hidden-md">
            {' '}
              <button type="button" className="btn btn-side-panel btn-sm btn-toggle-order-summary"
                onClick={toggleOrderSummary}
              >
                <i className="icon-login"
                  style={orderSummaryVisible ? {display : "block"} : {display:"none"}}
                 />
                <i className="icon-logout"
                  style={!orderSummaryVisible ? {display : "block"} : {display:"none"}}
                 />
              </button>
            </div>
          }

          </span>
        </div>
      </div>
    )
}

export default TableBar;
