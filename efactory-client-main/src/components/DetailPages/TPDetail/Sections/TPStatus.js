import React from 'react'
import PropTypes from 'prop-types'
import FilterLink from '../../../_Shared/FilterLink'
import moment from 'moment'

const TPDetailTPStatus = ({
  code,
  current_month = {},
  ediState,
  previous_day = {},
  today = {},
}) => {
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

  let {
    asn_ack: asn_ack_current_month,
    asn_sent: asn_sent_current_month,
    invoice_ack: invoice_ack_current_month,
    invoice_sent: invoice_sent_current_month,
    received: received_current_month,
    shipped: shipped_current_month,
  } = current_month

  let {
    asn_ack: asn_ack_previous_day,
    asn_sent: asn_sent_previous_day,
    invoice_ack: invoice_ack_previous_day,
    invoice_sent: invoice_sent_previous_day,
    received: received_previous_day,
    shipped: shipped_previous_day,
  } = previous_day

  let {
    received: received_today,
    shipped: shipped_today,
    to_approve: to_approve_today,
    to_resolve: to_resolve_today,
    to_ship: to_ship_today
  } = today

  return (
    <div className="edi-overview-table nobar" style={{ paddingTop: '34px', marginBottom: '20px', overflow: 'auto', width: '100%' }}>
    <table className="edi table-hover">
      <thead>
        <tr>
          <td colSpan={5} className="header center border title tb-header-1">Orders Today - { ediState.dates.today }</td>
          <td colSpan={6} className="header center border title tb-header-1 b_left opa9">Orders Previous Day - { ediState.dates.previous_day }</td>
          <td colSpan={6} className="header center border title tb-header-1 b_left">Orders Current Month - { ediState.dates.current_month }</td>
        </tr>
        <tr>
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
        
        
        <tr>
          
          <td className="right_bar value right grp1v border_l " style={{ borderBottom: '1px solid #475961' }}>
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
        
        
      </tbody>

      <tfoot>
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

TPDetailTPStatus.propTypes = {
  current_month: PropTypes.object,
  previous_day: PropTypes.object,
  today: PropTypes.object,
  code: PropTypes.any,
  ediState: PropTypes.object
}

export default TPDetailTPStatus