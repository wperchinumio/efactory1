import React, { useEffect } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import FilterLink from '../../_Shared/FilterLink'

const OverviewTable = ({
  ediState,
  ediActions,
  config,
}) => {
  useEffect(
    () => {
      let { is_initially_called } = ediState
      let { animation_on_next_query } = config
      ediActions.fetchEdiOverview(
        animation_on_next_query 
        ? false 
        : is_initially_called 
          ? true 
          : false 
      )
    },
    []
  )

  // get prev work day in quickfilter format
  function getFieldPreviousDayQuickFilterValue ( field ) {
    let { previous_day } = ediState.dates || {}
    let prevDay = moment( previous_day, 'MM/DD/YYYY' ).format( 'YYYY-MM-DD' )
    // let today   = moment().format( format )
    return [
      {
        field,
        oper : '>=',
        value : prevDay
      },
      {
        field,
        oper : '<=',
        value : prevDay
      },
    ]
  }

  function calculateTotals ( partners = [] ) {
    return partners.reduce(
      (
        {
          total_to_resolve_today,
          total_received_today,
          total_to_approve_today,
          total_to_ship_today,
          total_shipped_today,
          total_received_previous_day,
          total_shipped_previous_day,
          total_asn_ack_previous_day,
          total_asn_sent_previous_day,
          total_invoice_ack_previous_day,
          total_invoice_sent_previous_day,
          total_received_current_month,
          total_shipped_current_month,
          total_asn_ack_current_month,
          total_asn_sent_current_month,
          total_invoice_ack_current_month,
          total_invoice_sent_current_month
        }, 
        next
      ) => {
        return {
          total_to_resolve_today : total_to_resolve_today + next.today.to_resolve,
          total_received_today : total_received_today + next.today.received,
          total_to_approve_today : total_to_approve_today + next.today.to_approve,
          total_to_ship_today : total_to_ship_today + next.today.to_ship,
          total_shipped_today : total_shipped_today + next.today.shipped,
          total_received_previous_day : total_received_previous_day + next.previous_day.received,
          total_shipped_previous_day : total_shipped_previous_day + next.previous_day.shipped,
          total_asn_sent_previous_day : total_asn_sent_previous_day + next.previous_day.asn_sent,
          total_asn_ack_previous_day : total_asn_ack_previous_day + next.previous_day.asn_ack,
          total_invoice_sent_previous_day : total_invoice_sent_previous_day + next.previous_day.invoice_sent,
          total_invoice_ack_previous_day : total_invoice_ack_previous_day + next.previous_day.invoice_ack,
          total_received_current_month : total_received_current_month + next.current_month.received,
          total_shipped_current_month : total_shipped_current_month + next.current_month.shipped,
          total_asn_sent_current_month : total_asn_sent_current_month + next.current_month.asn_sent,
          total_asn_ack_current_month : total_asn_ack_current_month + next.current_month.asn_ack,
          total_invoice_sent_current_month : total_invoice_sent_current_month + next.current_month.invoice_sent,
          total_invoice_ack_current_month : total_invoice_ack_current_month + next.current_month.invoice_ack,
        }
      },
      {
        total_to_resolve_today : 0,
        total_received_today : 0,
        total_to_approve_today : 0,
        total_to_ship_today : 0,
        total_shipped_today : 0,
        total_received_previous_day : 0,
        total_shipped_previous_day : 0,
        total_asn_ack_previous_day : 0,
        total_asn_sent_previous_day : 0,
        total_invoice_ack_previous_day : 0,
        total_invoice_sent_previous_day : 0,
        total_received_current_month : 0,
        total_shipped_current_month : 0,
        total_asn_ack_current_month : 0,
        total_asn_sent_current_month : 0,
        total_invoice_ack_current_month : 0,
        total_invoice_sent_current_month : 0,
      }
    )
  }

  let {
    dates = {},
    partners = []
  } = ediState

  let {
    current_month,
    previous_day,
    today
  } = dates

  let totals = calculateTotals( partners )

  return (
    <div className="edi-overview-table" style={{ marginTop: '20px', marginLeft: '20px' }}>
      <table className="edi table-hover">
        <thead>
          <tr>
            <td className="header">&nbsp;</td>
            <td colSpan={5} className="header center border title tb-header-1">Orders Today - { today }</td>
            <td colSpan={6} className="header center border title tb-header-1 b_left opa9">Orders Previous Day - { previous_day }</td>
            <td colSpan={6} className="header center border title tb-header-1 b_left">Orders Current Month - { current_month }</td>
          </tr>
          <tr>
            <td className="header border2"><b>Trading Partner</b></td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1"><span className="edi-header-colored edi-header-resolve">To Resolve<br/>&nbsp;</span></td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1"><span className="edi-header-colored edi-header-received">Received<br/>(850)</span></td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1"><span className="edi-header-colored edi-header-approve">To Approve<br/>&nbsp;</span></td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1"><span className="edi-header-colored edi-header-ship">To Ship<br/>&nbsp;</span></td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1">Shipped</td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1 b_left opa9">Received<br/>(850)</td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1 opa9">Shipped</td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1 opa9" colSpan={2}>ASN <sup>*</sup><br/>(856)</td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1 opa9" colSpan={2}>Invoice<sup>*</sup><br/>(810) </td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1 b_left">Received<br/>(850)</td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1">Shipped</td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1" colSpan={2}>ASN<sup>*</sup><br/>(856) </td>
            <td className="edi-overview-td header subtitle center border2 tb-header-1" colSpan={2}>Invoice<sup>*</sup><br/>(810) </td>
          </tr>
        </thead>
        <tbody>
          {
            partners.map(  
              ( 
                {  
                  code,
                  current_month = {},
                  name,
                  previous_day = {},
                  today = {}
                } = {}, 
                index 
              ) => {
                let {
                  asn_ack : asn_ack_current_month,
                  asn_sent : asn_sent_current_month,
                  invoice_ack : invoice_ack_current_month,
                  invoice_sent : invoice_sent_current_month,
                  received : received_current_month,
                  shipped : shipped_current_month,
                } = current_month
                let {
                  asn_ack : asn_ack_previous_day,
                  asn_sent : asn_sent_previous_day,
                  invoice_ack : invoice_ack_previous_day,
                  invoice_sent : invoice_sent_previous_day,
                  received : received_previous_day,
                  shipped : shipped_previous_day,
                } = previous_day
                let {
                  received : received_today,
                  shipped : shipped_today,
                  to_approve : to_approve_today,
                  to_resolve : to_resolve_today,
                  to_ship : to_ship_today
                } = today
                return (
                  <tr key={`row-${index}`}>
                    <td>
                      { name } - &nbsp;
                      <Link to={`${global.window.location.pathname}?tradingPartner=${encodeURIComponent(code)}`} className="bold">
                        {code}
                      </Link>&nbsp;
                    </td>
                    <td className="right_bar value right grp1v border_l ">
                      {
                        +to_resolve_today > 0 
                        ? <FilterLink
                          to="/edi/documents/orders-to-resolve?query_filters_exist=true"
                          filters={{
                            partner : [ 
                              { field : 'partner', value : code, oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { to_resolve_today }
                        </FilterLink> 
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value right grp1v ">
                      {
                        +received_today > 0 
                        ? <FilterLink
                          to="/edi/documents/order-history?query_filters_exist=true"
                          filters={{
                            partner : [ 
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            received_date : [
                              { field : 'received_date', value : '0D', oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { received_today }
                        </FilterLink> 
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value right grp1v ">
                      {
                        +to_approve_today > 0 
                        ?   <FilterLink
                          to="/edi/documents/orders-to-approve?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { to_approve_today }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value right grp1v ">
                      {
                        +to_ship_today > 0 
                        ?   <FilterLink
                          to="/edi/documents/orders-to-ship?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { to_ship_today }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="value right grp1v ">
                      {
                        +shipped_today > 0 
                        ?   <FilterLink
                          to="/edi/documents/order-history?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            processing_date : [
                              { field : 'processing_date', value : '0D', oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { shipped_today }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value right grp2v border_l b_left">
                      {
                        +received_previous_day > 0 
                        ?   <FilterLink
                          to="/edi/documents/order-history?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            received_date : getFieldPreviousDayQuickFilterValue( 'received_date' )
                          }}
                          className="primary-link"
                        >
                          { received_previous_day }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value right grp2v ">
                      {
                        +shipped_previous_day > 0 
                        ?   <FilterLink
                          to="/edi/documents/order-history?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            processing_date : getFieldPreviousDayQuickFilterValue( 'processing_date' )
                          }}
                          className="primary-link"
                        >
                          { shipped_previous_day }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar_light value right grp2v ">
                      {
                        +asn_sent_previous_day > 0 
                        ?   <FilterLink
                          to="/edi/documents/asn-856?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            asn_sent : getFieldPreviousDayQuickFilterValue( 'asn_sent' )
                          }}
                          className="primary-link"
                        >
                          { asn_sent_previous_day }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value2 right grp2v ">
                      { asn_ack_previous_day }
                    </td>
                    <td className="right_bar_light value right grp2v ">
                      {
                        +invoice_sent_previous_day > 0 
                        ?   <FilterLink
                          to="/edi/documents/invoice-810?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            invoice_sent : getFieldPreviousDayQuickFilterValue( 'invoice_sent' )
                          }}
                          className="primary-link"
                        >
                          { invoice_sent_previous_day }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="value2 right grp2v ">
                      { invoice_ack_previous_day }
                    </td>
                    <td className="right_bar value right grp3v border_l b_left">
                      {
                        +received_current_month > 0 
                        ?   <FilterLink
                          to="/edi/documents/order-history?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            received_date : [
                              { field : 'received_date', value : '0M', oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { received_current_month }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value right grp3v ">
                      {
                        +shipped_current_month > 0 
                        ?   <FilterLink
                          to="/edi/documents/order-history?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            processing_date : [
                              { field : 'processing_date', value : '0M', oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { shipped_current_month }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar_light value right grp3v ">
                      {
                        +asn_sent_current_month > 0 
                        ? <FilterLink
                          to="/edi/documents/asn-856?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            asn_sent : [
                              { field : 'asn_sent', value : '0M', oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { asn_sent_current_month }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="right_bar value2 right grp3v ">
                      { asn_ack_current_month }
                    </td>
                    <td className="right_bar_light value right grp3v ">
                      {
                        +invoice_sent_current_month > 0 
                        ?   <FilterLink
                          to="/edi/documents/invoice-810?query_filters_exist=true"
                          filters={{
                            partner : [
                              { field : 'partner', value : code, oper : '=' }
                            ],
                            invoice_sent : [
                              { field : 'invoice_sent', value : '0M', oper : '=' }
                            ]
                          }}
                          className="primary-link"
                        >
                          { invoice_sent_current_month }
                        </FilterLink>
                        : <span className="zero-value">0</span>
                      }
                    </td>
                    <td className="value2 right grp3v border_r ">
                      { invoice_ack_current_month }
                    </td>
                  </tr>
                )
              }
            )
          }
        </tbody>
        <tfoot>
          <tr>
            <td className="header total">Total:</td>
            <td className="right_bar value right total border_t border_l">
              {
                totals.total_to_resolve_today > 0 
                ? <FilterLink
                  to="/edi/documents/orders-to-resolve?query_filters_exist=true"
                  filters={{
                    
                  }}
                  className="primary-link"
                >
                  { totals.total_to_resolve_today }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value right total border_t">
              {
                totals.total_received_today > 0 
                ? <FilterLink
                  to="/edi/documents/order-history?query_filters_exist=true"
                  filters={{
                    received_date : [
                      { field : 'received_date', value : '0D', oper : '=' }
                    ]
                  }}
                  className="primary-link"
                >
                  { totals.total_received_today }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value right total border_t">
              {
                totals.total_to_approve_today > 0 
                ? <FilterLink
                  to="/edi/documents/orders-to-approve?query_filters_exist=true"
                  filters={{
                    
                  }}
                  className="primary-link"
                >
                  { totals.total_to_approve_today }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value right total border_t">
              {
                totals.total_to_ship_today > 0 
                ? <FilterLink
                  to="/edi/documents/orders-to-ship?query_filters_exist=true"
                  filters={{
                    
                  }}
                  className="primary-link"
                >
                  { totals.total_to_ship_today }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="value right total border_t">
              {
                totals.total_shipped_today > 0 
                ? <FilterLink
                  to="/edi/documents/order-history?query_filters_exist=true"
                  filters={{
                    processing_date : [
                      { field : 'processing_date', value : '0D', oper : '=' }
                    ]
                  }}
                  className="primary-link"
                >
                  { totals.total_shipped_today }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value right total border_t border_l b_left">
              {
                totals.total_received_previous_day > 0 
                ? <FilterLink
                  to="/edi/documents/order-history?query_filters_exist=true"
                  filters={{
                    received_date : getFieldPreviousDayQuickFilterValue( 'received_date' )
                  }}
                  className="primary-link"
                >
                  { totals.total_received_previous_day }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value right total border_t">
              {
                totals.total_shipped_previous_day > 0 
                ? <FilterLink
                  to="/edi/documents/order-history?query_filters_exist=true"
                  filters={{
                    processing_date : getFieldPreviousDayQuickFilterValue( 'processing_date' )
                  }}
                  className="primary-link"
                >
                  { totals.total_shipped_previous_day }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar_light value right total border_t">
              {
                totals.total_asn_sent_previous_day > 0 
                ? <FilterLink
                  to="/edi/documents/asn-856?query_filters_exist=true"
                  filters={{
                    asn_sent : getFieldPreviousDayQuickFilterValue( 'asn_sent' )
                  }}
                  className="primary-link"
                >
                  { totals.total_asn_sent_previous_day }
                </FilterLink>
                : <span className="zero-value">0</span>
              } 
            </td>
            <td className="right_bar value2 right total border_t">
              {
                totals.total_asn_ack_previous_day > 0 
                ? <span style={{ fontWeight : '500' }}>{totals.total_asn_ack_previous_day}</span>
                : <span className="zero-value" style={{ fontWeight : '500' }}>0</span>
              }
            </td>
            <td className="right_bar_light value right total border_t">
              {
                totals.total_received_today > 0 
                ? <FilterLink
                  to="/edi/documents/invoice-810?query_filters_exist=true"
                  filters={{
                    invoice_sent : getFieldPreviousDayQuickFilterValue( 'invoice_sent' )
                  }}
                  className="primary-link"
                >
                  { totals.total_invoice_sent_previous_day }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="value2 right total border_t">
              {
                totals.total_invoice_ack_previous_day > 0 
                ? <span style={{ fontWeight : '500' }}>{totals.total_invoice_ack_previous_day}</span>
                : <span className="zero-value" style={{ fontWeight : '500' }}>0</span>
              }
            </td>
            <td className="right_bar value right total border_t border_l b_left">
              {
                totals.total_received_current_month > 0 
                ? <FilterLink
                  to="/edi/documents/order-history?query_filters_exist=true"
                  filters={{
                    received_date : [
                      { field : 'received_date', value : '0M', oper : '=' }
                    ]
                  }}
                  className="primary-link"
                >
                  { totals.total_received_current_month }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value right total border_t">
              {
                totals.total_shipped_current_month > 0 
                ? <FilterLink
                  to="/edi/documents/order-history?query_filters_exist=true"
                  filters={{
                    processing_date : [
                      { field : 'processing_date', value : '0M', oper : '=' }
                    ]
                  }}
                  className="primary-link"
                >
                  { totals.total_shipped_current_month }
               </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar_light value right total border_t">
              {
                totals.total_asn_sent_current_month > 0 
                ? <FilterLink
                  to="/edi/documents/asn-856?query_filters_exist=true"
                  filters={{
                    asn_sent : [
                      { field : 'asn_sent', value : '0M', oper : '=' }
                    ]
                  }}
                  className="primary-link"
                >
                  { totals.total_asn_sent_current_month }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }
            </td>
            <td className="right_bar value2 right total border_t">
              {
                totals.total_asn_ack_current_month > 0 
                ? <span style={{ fontWeight : '500' }}>{totals.total_asn_ack_current_month}</span>
                : <span className="zero-value" style={{ fontWeight : '500' }}>0</span>
              }
            </td>
            <td className="right_bar_light value right total border_t">
              {
                totals.total_invoice_sent_current_month > 0 
                ? <FilterLink
                  to="/edi/documents/invoice-810?query_filters_exist=true"
                  filters={{
                    invoice_sent : [
                      { field : 'invoice_sent', value : '0M', oper : '=' }
                    ]
                  }}
                  className="primary-link"
                >
                  { totals.total_invoice_sent_current_month }
                </FilterLink> 
                : <span className="zero-value">0</span>
              }

            </td>
            <td className="value2 right total border_t border_r">
              {
                totals.total_invoice_ack_current_month > 0 
                ? <span style={{ fontWeight : '500' }}>{totals.total_invoice_ack_current_month}</span>
                : <span className="zero-value" style={{ fontWeight : '500' }}>0</span>
              }
            </td>
          </tr>
          <tr>
            <td className="header">&nbsp;</td>
            <td colSpan={5} className="border_t" style={{fontSize: '11px'}}><sup>*</sup>&nbsp;<span className="bar_light">Sent </span>&nbsp;<span>Acknowledged</span></td>
            <td colSpan={6} className="border_t">&nbsp;</td>
            <td colSpan={6} className="border_t">&nbsp;</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default OverviewTable