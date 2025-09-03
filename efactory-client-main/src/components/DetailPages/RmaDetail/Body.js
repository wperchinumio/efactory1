import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../lib/amcharts3-react'
import { formatDate } from '../../_Helpers/FormatDate'
import FormatNumber from '../../_Helpers/FormatNumber'
import TableConfig from '../../ReturnTrak/Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'

const charts_color = [
  {
    lineColor: "#249d8e",
    fillColor: "#44bdae"
  },
  {
    lineColor: "#c7303a",
    fillColor: "#e7505a"
  },
  {
    lineColor : "#3C77A9",
    fillColor : "#4C87B9"
  },
  {
    lineColor: "#2F9B94",
    fillColor: "#3FABA4"
  },
  {
    lineColor: "#424E54",
    fillColor: "#525E64"
  },
  {
    lineColor: "#D86E00",
    fillColor: "#E87E04"
  },
  {
    lineColor: "#776597",
    fillColor: "#8775A7"
  }
]

const RmaDetailBody = ({
  fetchRmaDetail,
  fetchRmaDetailData = {},
  globalApiData,
  loadedRmaDetail = false,
  openDetailPage,
  rmaDetail = {},
}) => {
  
  function getCustomFieldsJSX ( custom_fields = [] ) {
    let lastSelectionIndex = 0
    return custom_fields.map( (c_field, index) => {
      let { title = '', type = '', value = '' } = c_field
      let style = { paddingLeft: '2px' }
      if( type === 'selection' && value.length ){
        style[ 'borderLeft' ] = `5px solid ${charts_color[ lastSelectionIndex ]['lineColor'] }`
        lastSelectionIndex += 1
      }
      return (
        <div className="row" key={ `option-${index}` } >
          <div className="col-md-5 ext-title">
            <span style={ style }>
              { title }
            </span>

          </div>
          <div className="col-md-7">
            <span className="ext-value ext-value-input ext-value-input ext-value-pile">
              { value }
            </span>
          </div>
        </div>
      )
    } )
  }

  function onIntervalChanged ( event ) {
    let selected = event.target.value
    fetchRmaDetail({ weeks : selected === 'days' ? false : true })
  }

  let {
    rma_header = {},
    custom_fields = [],
    to_receive = [],
    to_ship = [],
    om_details = [],
    charts = []
  } = rmaDetail

  let {
    shipping_address = {}
  } = rma_header

  let {
    company,
    attention,
    address1,
    address2,
    email,
    phone,
    city,
    state_province,
    postal_code,
    country
  } =  shipping_address

  let {
    shipping_warehouse,
    freight_account,
    consignee_number,
    international_code,
    shipping_carrier,
    shipping_service,
    payment_type,
    terms,
    fob,
    packing_list_type,
    return_weight_lb = 0,
    label_used_date,
    return_charges,
    billed_weight_lb,
    label_carrier,
    label_service
  } = rma_header

  international_code = international_code === 0 ? '0' : international_code

  let {
    original_order_number,
    replacement_order_number,
    shipping_account_number,
    original_account_number,
    replacement_shipped_date,
    tr,
    trl,
    account_number,
    location,
    //shipping_warehouse,
    customer_number,
    om_number,
    rma_type_name,
    disposition_name,
    rma_type_code,
    disposition_code,
    rma_date,
    webservices,
    open,

    cancelled_date = '',
    expired_date = '',
  } = rma_header

  let {
    issue_email_sent_at,
    receive_email_sent_at,
    shipped_email_sent_at,
    cancel_email_sent_at
  } = rma_header

  let {
    countries = {},
    states = {},
    international_codes = []
  } = globalApiData

  // check if rma_type_code is allowed shipping or not ( blue or not )
  let isShippingDisabled = TableConfig[ rma_type_code ] ? !TableConfig[ rma_type_code ][ 1 ][ 1 ] : false

  return (
    <div className="portlet-body order-status">
      <div className="row">
        <div className="col-md-9">
          <div className="row ">
            <div className="col-md-6">
              <div className="row">

                <div className="col-md-12">
                  <div className="ext-section"><i className="fa fa-truck"></i> RMA Address</div>
                  <label className="control-label ext-title">Company:</label>
                  <span className="ext-value ext-value-input">
                        { company ? company : '' }
                  </span>
                </div>
                <div className="col-md-12">
                  <label className="control-label ext-title">Attention:</label>
                  <span className="ext-value ext-value-input">
                        { attention ? attention : '' }
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">Address 1:</label>
                  <span className="ext-value ext-value-input">
                        { address1 ? address1 : '' }
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Address 2:</label>
                  <span className="ext-value ext-value-input">
                        { address2 ? address2 : '' }
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">City:</label>
                  <span className="ext-value ext-value-input">
                        { city ? city : '' }
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Postal Code:</label>
                  <span className="ext-value ext-value-input">
                        { postal_code ? postal_code : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">State:</label>
                  <span className="ext-value ext-value-input">
                        {
                          state_province
                          ? [ 'US', 'CA', 'AU' ].includes(country)
                            ? states[ country ] && states[ country ][ state_province ]
                              ? `${states[ country ][ state_province ] } - ${state_province}`
                              : state_province
                            : state_province
                          : ''
                        }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Country:</label>
                  <span className="ext-value ext-value-input">
                        {
                          country
                          ? country.length === 2
                            ? countries[ country ]
                              ? `${countries[ country ]} - ${country} `
                              : country
                            : country
                          : ''
                        }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Phone:</label>
                  <span className="ext-value ext-value-input">
                        { phone ? phone : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Email:</label>
                  <span className="ext-value ext-value-input">
                        { email ? email : '' }
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="ext-section"><i className="fa fa-truck"></i> Replacement Shipping</div>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Account # - WH:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && shipping_warehouse ? shipping_warehouse : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Repl. Order #:</label>
                  <span className="ext-value ext-value-input">
                      <a
                          onClick={ event => openDetailPage({
                            openDetailPageType : 'order',
                            detailTypeNumber   : replacement_order_number ? replacement_order_number : '',
                            accountNumber      : shipping_account_number ? shipping_account_number : ''
                          }) }
                        >
                        { !isShippingDisabled &&  replacement_order_number ? replacement_order_number : '' }
                      </a>
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">International Code:</label>
                  <span className="ext-value ext-value-input">
                        {
                          !isShippingDisabled && international_code
                          ? international_codes.filter( i_code => +i_code.value === +international_code ).length
                            ? `${ international_codes.filter( i_code => +i_code.value === +international_code )[0]['name'] } - ${international_code}`
                            : international_code
                          : ''
                        }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Payment Type:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled &&  payment_type ? payment_type : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Carrier:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && shipping_carrier ? shipping_carrier : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Service:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && shipping_service ? shipping_service : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Freight Account:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && freight_account ? freight_account : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Consignee #:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && consignee_number ? consignee_number : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Incoterms:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && terms ? terms : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">FOB Location:</label>
                  <span className="ext-value ext-value-input">
                        { !isShippingDisabled && fob ? fob : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Ship Date:</label>
                  <span className="ext-value ext-value-input">
                     { !isShippingDisabled && replacement_shipped_date ? formatDate(replacement_shipped_date,'true') : '' }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Tracking #:</label>
                  <span className="ext-value ext-value-input">
                     <span className="text-primary">{ !isShippingDisabled && tr ? <a href={trl} target="_blank">{tr}</a> : '' }</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <br/>


          <div className="ext-carts">
            <div className="row ">
              <div className="col-xs-12 ">
                <div className="table-responsive">
                  <h4 className="ext-cart-title"><i className="fa fa-arrow-down font-dark"></i> Authorized Items</h4>

                  <table className="table table-hover ">
                    <thead className="table-header-1 bg-print">
                    <tr>
                      <th className="text-center " style={{width: "40px"}}>#</th>
                      <th className="">ITEM #/ DESCRIPTION</th>
                      <th className="" style={{width: "150px"}}>AUTH. SERIAL #</th>
                      <th className="text-right " style={{width: "70px"}}>AUTH. QTY</th>
                    </tr>
                    </thead>
                    <tbody>

                      {
                        to_receive.map( (item,index) => {
                          return (
                            <tr key={ `to-receive-key-${ index }` }>
                              <td className="text-center">{ index + 1 }</td>
                              <td className="">
                                <a
                                  style={{fontWeight:600}}
                                  onClick={ event => openDetailPage({
                                    openDetailPageType : 'item',
                                    detailTypeNumber   : item.item_number
                                  }) }
                                >
                                  { item.item_number ? item.item_number : '' }
                                </a>
                                <br/>
                                <span className="">
                                  { item.description ? item.description : ''  }
                                </span>
                              </td>
                              <td className="">
                                { item.serialnumber ? item.serialnumber : ''  }
                              </td>
                              <td className="text-right ext-qty">
                                { item.quantity ? item.quantity : '' }
                              </td>
                            </tr>
                          )
                        } )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {
              (rma_type_code === 'T01' || rma_type_code === 'T03' || rma_type_code === 'T11' || rma_type_code === 'T13' || rma_type_code === 'T21'
              || rma_type_code === 'T23' || rma_type_code === 'T24' || rma_type_code === 'T26' || rma_type_code === 'T31' || rma_type_code === 'T33' || rma_type_code === 'T81')  &&
              <div className="row ">
                <div className="col-xs-12 ">
                  <div className="table-responsive">
                    <h4 className="ext-cart-title"><i className="fa fa-arrow-down font-red-soft"></i> Received Items
                    </h4>

                    <table className="table table-hover ">
                      <thead className="table-header-1 bg-print">
                      <tr>
                        <th className="text-center " style={{width: "40px"}}>#</th>
                        <th className="">ITEM #/ DESCRIPTION</th>
                        <th className="">CONDITION</th>
                        <th className="">DISPOSITION</th>
                        <th className="text-center " style={{width: "100px"}}>RECV. DATE</th>
                        <th className="" style={{width: "150px"}}>RECV. SERIAL #</th>
                        <th className="text-right" style={{width: "70px"}}>RECV. QTY</th>
                      </tr>
                      </thead>
                      <tbody>

                      {
                        om_details.length === 0 &&
                          <tr>
                            <td colSpan="7">
                              <div style={{backgroundColor: "#ffffc4", padding: "10px", border: "1px solid #bbb", margin: "10px", color: "#444", textAlign:"center"}}>
                                No Item Received Yet!
                              </div>
                            </td>
                          </tr>
                      }
                      {
                        om_details.map((item, index) => {
                          return (
                            <tr 
                              key={ `to-receive-key-${ index }` }
                              className={ classNames({
                                lineThrough : item.is_cancelled
                              }) }
                            >
                              <td className="text-center">{ item.line_number }</td>
                              <td className="">
                                <a
                                  style={{fontWeight:600}}
                                  onClick={ event => openDetailPage({
                                    openDetailPageType : 'item',
                                    detailTypeNumber   : item.item_number
                                  }) }
                                >
                                  { item.item_number ? item.item_number : '' }
                                </a>
                                <br/>
                                <span className="">
                                  { item.item_desciption ? item.item_desciption : ''  }
                                </span>
                              </td>
                              <td className="">
                                <span style={{fontWeight: 600}}>
                                  { item.condition_code ? item.condition_code : '' }
                                </span>
                                <br/>
                                <span className="">
                                  { item.condition ? item.condition : ''  }
                                </span>
                              </td>
                              <td className="">
                                <span style={{fontWeight: 600}}>
                                  { item.disposition_code ? item.disposition_code : '' }
                                </span>
                                <br/>
                                <span className="">
                                  { item.disposition ? item.disposition : ''  }
                                </span>
                              </td>
                              <td className="text-center ">
                                { item.received_date ? formatDate(item.received_date,'true') : '' }
                              </td>
                              <td className="">
                                { item.received_serialnumber ? item.received_serialnumber : '' }
                              </td>
                              <td className="text-right ext-qty">
                                { item.received_quantity ? item.received_quantity : '' }
                              </td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
            {
              to_ship.length > 0 &&
                <hr style={{margin: "2px 0"}}/>
            }
            {
              to_ship.length > 0 &&
              <div className="row ">
                <div className="col-lg-12 ">
                  <h4 className="ext-cart-title" style={{paddingTop: "20px"}}><i className="fa fa-arrow-up font-blue-soft"></i> To-Ship Items</h4>
                </div>
                <div className="col-xs-12 ">
                  <div className="table-responsive">

                    <table className="table table-hover ">
                      <thead className="table-header-1 bg-print">
                      <tr>
                        <th className="text-center " style={{width: "40px"}}>#</th>
                        <th className="">ITEM #/ DESCRIPTION</th>
                        <th className="text-right " style={{width: "70px"}}>SHIP QTY</th>
                        <th className="text-right " style={{width: "100px"}}>UNIT PRICE</th>
                        <th className="text-right " style={{width: "100px"}}>EXT PRICE</th>
                      </tr>
                      </thead>

                      <tbody>
                      {
                        to_ship.map( (item,index) => {

                          return (
                            <tr key={ `to-ship-key-${ index }` }>

                              <td className="text-center">{ index + 1 }</td>
                              <td className="">
                                <a
                                  style={{fontWeight:600}}
                                  onClick={ event => openDetailPage({
                                    openDetailPageType : 'item',
                                    detailTypeNumber   : item.item_number
                                  }) }
                                >
                                  { item.item_number ? item.item_number : '' }
                                </a>
                                <br/>
                                <span className="">
                                  { item.description }
                                </span>
                              </td>
                              <td className="text-right">
                                { item.quantity  }
                              </td>
                              <td className="text-right ext-qty">
                                { <FormatNumber number={item.unit_price}/> }
                              </td>
                              <td className="text-right">
                                <FormatNumber number={item.unit_price * item.quantity}/>
                              </td>
                            </tr>
                          )
                        } )
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

          </div>
          <div style={{padding: "10px", border: "1px solid #ddd", borderRadius: "10px"}} className="chart-background">
            <div className="row">
              <div className="col-md-9"></div>
              <div className="col-md-3">
                <label className="sbold">Interval:</label>
                <select
                  className="form-control input-sm"
                  value={ fetchRmaDetailData.weeks ? 'weeks' : 'days' }
                  onChange={ onIntervalChanged  }
                >
                  <option value="days">Last 10 days</option>
                  <option value="weeks">Last 10 weeks</option>
                </select>
              </div>
            </div>

            <hr/>

            {
              charts && charts.map( (chart,index) => {
                return (
                  <div style={{height: "250px"}} key={ `chart-key-${index}` } >
                    <AmCharts.React
                      type="serial"
                      fontFamily='Open Sans'
                      color='#888888'
                      legend={{
                        forceWidth  : true,
                        useGraphSettings : false,
                        valueAlign :       "left",
                        valueWidth :       120,
                        position   : 'top'
                      }}
                      dataProvider={ chart.list }
                      valueAxes={[{
                        id :        "orderAxis",
                        axisAlpha : 0,
                        gridAlpha : 0,
                        position :  "left",
                        title : chart.title
                      }]}
                      graphs={[
                        {
                          lineColor :       charts_color[ index ].lineColor,
                          fillColors :      charts_color[ index ].fillColors,
                          fillAlphas :      1,
                          type :            "column",
                          labelText:        "[[value]]",
                          title :           chart.value,
                          valueField :      "qty",
                          clustered :       true,
                          columnWidth :     0.75,
                          legendPeriodValueText : `[[value.sum]] [ ${(chart.perc).toFixed(1)} % ]`,
                          balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
                        }
                      ]}
                      chartCursor={{
                        cursorAlpha :               0.015,
                        cursorColor :               "#333",
                        fullWidth :                 true,
                        valueBalloonsEnabled :      false,
                        zoomable :                  false
                      }}
                      categoryField="period"
                      categoryAxis={{
                        parseDates :    false,
                        autoGridCount : false,
                        axisColor :     "#555555",
                        gridAlpha :     0.1,
                        gridColor :     "#FFFFFF",
                        gridCount :     50
                      }}
                    />
                  </div>
                )
              } )
            }

          </div>
        </div>


        <div className="col-md-3">
            <div className="row no-margins">
              <div className="col-md-12 ext-section">
                Basic
              </div>
            </div>
            <div className="row">

              <div className="col-md-5 ext-title">
                Source
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
              { !webservices && <span>ReturnTrak</span> }
              { webservices && <span>Web Service</span> }
                </span>
              </div>

              <div className="col-md-5 ext-title">
                Status
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                    <span style={{
                      color: open
                             ? 'red'
                             : !cancelled_date && !expired_date
                               ? 'mediumseagreen'
                               : '#ff7800',
                      fontWeight: 700
                    }}>
                      {
                        !rmaDetail.noResponse && loadedRmaDetail &&
                        (
                          open
                          ? 'OPEN'
                          : !cancelled_date && !expired_date
                            ? 'CLOSED'
                            : cancelled_date
                              ? `CANCELED ON ${ formatDate(cancelled_date, 'true') }`
                              : `EXPIRED ON ${ formatDate(expired_date, 'true') }`
                        )
                      }
                    </span>
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Account # RMA WH
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { account_number ? `${account_number} - ` : '' }
                  { location ? location : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                RMA Date
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { rma_date ? formatDate(rma_date,'true')  : ''}
                </span>
              </div>
              <div className="col-md-5 ext-title">
                RMA Type
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  <strong>{ rma_type_code ? rma_type_code : '' }</strong> - { rma_type_name ? rma_type_name : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Disposition
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                <strong>{ disposition_code ? disposition_code : '' }</strong> - { disposition_name ? disposition_name : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Customer #
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                { customer_number ? customer_number : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Original Order #
              </div>
              <div className="col-md-7">

                <span className="ext-value ext-value-input ext-value-pile">
                  <a
                    onClick={ event => openDetailPage({
                      openDetailPageType : 'order',
                      detailTypeNumber   : original_order_number ? original_order_number : '',
                      accountNumber      : original_account_number ? original_account_number : ''
                    }) }
                  >
                    { original_order_number ? original_order_number : '' }
                  </a>
                </span>
              </div>
              <div className="col-md-5 ext-title">
                OM #
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                { om_number ? om_number : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Packing List
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { packing_list_type ? packing_list_type : ''}
                </span>
              </div>
            </div>

            <div className="row no-margins">
              <div className="col-md-12 ext-section">
                <span>Custom Fields</span>
              </div>
            </div>

              {
                getCustomFieldsJSX( custom_fields )
              }

            <div className="row no-margins">
              <div className="col-md-12 ext-section">
                <span>Email Notifications</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5 ext-title">
                Issue
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { issue_email_sent_at ? formatDate(issue_email_sent_at) : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Receive
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { receive_email_sent_at ? formatDate(receive_email_sent_at) : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Ship
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { shipped_email_sent_at ? formatDate(shipped_email_sent_at) : '' }
                </span>
              </div>
              <div className="col-md-5 ext-title">
                Cancel
              </div>
              <div className="col-md-7">
                <span className="ext-value ext-value-input ext-value-pile">
                  { cancel_email_sent_at ? formatDate(cancel_email_sent_at) : '' }
                </span>
              </div>
            </div>


            <div className="row no-margins">
              <div className="col-md-12 ext-section">
                <span>Return Label</span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 ext-title">
                Return Service
              </div>
              <div className="col-md-7">
                    <span className="ext-value ext-value-input ext-value-pile">
                      { label_carrier? <span>{label_carrier} / {label_service}</span>: ''  }
                    </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 ext-title">
                Tracking #
              </div>
              <div className="col-md-7">
                  <span className="ext-value ext-value-input ext-value-pile">
                    {
                      rma_header.return_label_url
                      ? <a href={rma_header.return_label_url} target="_blank">
                          { rma_header.return_label_tracking_number ? rma_header.return_label_tracking_number : '' }
                        </a>
                      : <span>{rma_header.return_label_tracking_number ? rma_header.return_label_tracking_number : ''}</span>
                    }
                  </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 ext-title">
                Weight for RS
              </div>
              <div className="col-md-7">
                    <span className="ext-value ext-value-input ext-value-pile">
                      { rma_header.return_label_tracking_number ? <FormatNumber number={ return_weight_lb }/>: ''  }
                    </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 ext-title">
                Used day
              </div>
              <div className="col-md-7">
                    <span className="ext-value ext-value-input ext-value-pile">
                      { label_used_date ? formatDate(label_used_date,'true') : '' }
                    </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 ext-title">
                Return charges
              </div>
              <div className="col-md-7">
                    <span className="ext-value ext-value-input ext-value-pile">
                      { return_charges }
                    </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 ext-title">
                Billed weight
              </div>
              <div className="col-md-7">
                    <span className="ext-value ext-value-input ext-value-pile">
                      {  label_used_date? (billed_weight_lb? <FormatNumber number={ billed_weight_lb }/>: 'N/A'): '' }
                    </span>
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}

RmaDetailBody.propTypes = {
  fetchRmaDetailData  : PropTypes.object,
  fetchRmaDetail      : PropTypes.func,
  rmaDetail           : PropTypes.object,
  loadedRmaDetail     : PropTypes.any,
  globalApiData       : PropTypes.object,
  openDetailPage      : PropTypes.func.isRequired
}

export default RmaDetailBody