import React from 'react'
import PropTypes from 'prop-types'
import FormatNumber from '../../_Helpers/FormatNumber'
import FormatDate from '../../_Helpers/FormatDate'
import OrderStage from '../../_Helpers/OrderStage'
import OrderType from '../../_Helpers/OrderType'
import { orderStatus, orderStatusClass } from '../../_Helpers/OrderStatus'
import classNames from 'classnames'
import MultipleOrdersToSelect from './MultipleOrdersToSelect'

const OrderDetailBody = ({
  orderDetail,
  openDetailPage
}) => {
  function bundle_label (kit_id) {
    switch(kit_id) {
      case 1:
        return 'bundle A';
      case 2:
        return 'bundle B';
      case 3:
        return 'bundle C';
      case 9:
        return 'bundle E';
      default:
        return 'bundle ?';
    }
  }

  if( Array.isArray( orderDetail ) && orderDetail.length > 1 ){
    return (
      <MultipleOrdersToSelect 
        orderDetails={ orderDetail }
        onSelectOrderDetail={ id => console.log(`Order detail with id "${id}" selected`) }
      />
    )
  }

  let {
    order_lines,
    shipments_overview,
    billing_address,
    shipping_address
  } = orderDetail

  billing_address       = billing_address ? billing_address : {}
  shipments_overview    = shipments_overview ? shipments_overview : {}
  shipping_address      = shipping_address ? shipping_address : {}
  order_lines           = order_lines ? order_lines : []

  let {
    package_details,
    packages,
    serials,
    shipments
  } = shipments_overview

  serials         = serials ? serials : []
  shipments       = shipments ? shipments : []
  packages        = packages ? packages : []
  package_details = package_details ? package_details : []

  return (
    <div className="portlet-body order-status">

      <div className="row">
        <div className="col-md-9">
          <div className="row">
            <div className="col-md-6">
              <div className="row">

                <div className="col-md-12">
                  <div className="ext-section"><i className="fa fa-truck"></i> Shipping Address</div>
                  <label className="control-label ext-title">Company:</label>
                  <span className="ext-value ext-value-input">
                    {shipping_address.company}
                  </span>
                </div>
                <div className="col-md-12">
                  <label className="control-label ext-title">Attention:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.attention}
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">Address 1:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.address1}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Address 2:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.address2}
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">City:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.city}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Postal Code:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.postal_code}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">State:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.state_province}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Country:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.country}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Phone:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.phone}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Email:</label>
                  <span className="ext-value ext-value-input">
                        {shipping_address.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="ext-section"><i className="fa fa-send"></i> Shipping Method</div>
                </div>

                <div className="col-md-6">
                  <label className="control-label ext-title">Shipping WH:</label>
                  <span className="ext-value ext-value-input">
                        { orderDetail.location }
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Account #:</label>
                  <span className="ext-value ext-value-input">
                        { orderDetail.account_number }
                  </span>
                </div>

                <div className="col-md-6">
                  <label className="control-label ext-title">Receipt Date:</label>
                  <span className="ext-value ext-value-input">
                        <FormatDate date={orderDetail.received_date}/>
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Order Status:</label>
                  <span className="ext-value ext-value-input">
                     <span className={orderStatusClass(orderDetail.order_status)}>{ orderStatus(orderDetail.order_status) }</span>
                  </span>
                </div>


                <div className="col-md-6">
                  <label className="control-label ext-title">International Code:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.international_code}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Payment Type:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.payment_type}
                  </span>
                </div>


                <div className="col-md-6">
                  <label className="control-label ext-title">Carrier:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.shipping_carrier}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Service:</label>
                  <span className="ext-value ext-value-input">
                       {orderDetail.shipping_service}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Freight Account:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.freight_account}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Consignee #:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.consignee_number}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Incoterms:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.terms}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">FOB Location:</label>
                  <span className="ext-value ext-value-input">
                        {orderDetail.fob}
                  </span>
                </div>

              </div>
            </div>
          </div>

          <div style={{height: "35px"}}></div>

          <div className="row">
            <div className="col-md-4">
              <div className="ext-section"><i className="fa fa-dollar"></i> Billing Address</div>
              <div className="row static-info ">
                <div className="value col-md-12 ">{billing_address.company}&nbsp;</div>
              </div>
              <div className="row static-info ">
                <div className="value col-md-12 ">{billing_address.attention}&nbsp;</div>
              </div>
              <div className="row static-info ">
                <div className="value col-md-12 ">{billing_address.address1}&nbsp;{billing_address.address2}</div>
              </div>
              <div className="row static-info ">
                <div className="value col-md-12 ">{billing_address.city}{billing_address.state_province && <span>&nbsp;,&nbsp;</span>}{billing_address.state_province}{billing_address.postal_code && <span>&nbsp; - &nbsp;</span>}{billing_address.postal_code}</div>
              </div>
              <div className="row static-info ">
                <div className="value col-md-12 ">{billing_address.country}&nbsp;</div>
              </div>
              <div className="row static-info ">
                <div className="value col-md-12 "><i
                  className={ classNames({
                    'fa fa-phone' : billing_address.phone,
                  }) }> </i> {billing_address.phone}&nbsp;
                </div>
              </div>
              <div className="row static-info ">
                <div className="value col-md-12 "><i
                  className={ classNames({
                    'fa fa-envelope' : billing_address.email,
                  }) }
                  > </i> {billing_address.email}&nbsp;
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="ext-section"><i className="fa fa-fire"></i> Shipping Instructions</div>
              <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "130px"}}>
                    {orderDetail.shipping_instructions }
              </span>
            </div>
            <div className="col-md-4">
              <div className="ext-section"><i className="fa fa-fire"></i> Packing List Comments</div>
              <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "130px"}}>
                    {orderDetail.packing_list_comments }
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="row no-margins">
            <div className="col-md-12 ext-section">
              General
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Channel
            </div>
            <div className="col-md-7">
              <span className="ext-value">
                 <OrderType order_type={orderDetail.order_type}/>
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap" style={{paddingTop: "7px"}}>
              Order Stage
            </div>
            <div className="col-md-7">
              <span className="ext-value">
                <OrderStage order_stage={orderDetail.order_stage} stage_description={orderDetail.stage_description} />
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Customer #
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.customer_number}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              PO #
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.po_number}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Order Date
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  <FormatDate date={orderDetail.ordered_date}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Packing List
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.packing_list_type}
                </span>
            </div>
          </div>


          <div className="row no-margins">
            <div className="col-md-12 ext-section">
              <span>Amounts</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Order Amount
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.order_subtotal}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              S &amp; H
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.shipping_handling}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Sales Taxes
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.sales_tax}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Discount/Add. Chgs.
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.international_handling}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Total Amount
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.total_due}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Amount Paid
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.amount_paid}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Net Due
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.net_due_currency}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Balance Due (US)
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.balance_due_us}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Int. Decl. Value
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.international_declared_value}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Insurance
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={orderDetail.insurance}/>
                </span>
            </div>
          </div>


          <div className="row no-margins">
            <div className="col-md-12 ext-section">
              <span>Custom Fields</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Custom Field 1
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.custom_field1}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Custom Field 2
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.custom_field2}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Custom Field 3
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.custom_field3}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Custom Field 4
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.custom_field4}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Custom Field 5
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {orderDetail.custom_field5}
                </span>
            </div>
          </div>

        </div>
      </div>

      <br/>
      <div className="row ">
        <div className="col-xs-12 ">
            <span
              className="caption-subject font-red-sunglo bold uppercase">ORDER LINES</span>
          <div className="table-responsive">
            <table className="table table-hover ">
              <thead className="tb-header-1 ext-section bg-print">
              <tr>
                <th>DCL / CUST LINE #&nbsp;&nbsp;</th>
                <th>ITEM # / DESCRIPTION</th>
                <th className="text-center ">QTY</th>
                <th className="text-center ">SHIP&nbsp;QTY</th>
                <th className="text-center ">BL&nbsp;QTY</th>
                <th className="text-center ">&nbsp;</th>
                <th className="text-right ">PRICE</th>
                <th className="text-right ">SUBTOTAL</th>
                <th
                  className="text-center hidden-md hidden-sm hidden-xs show-print">
                  DON'T&nbsp;SHIP&nbsp;BEFORE
                </th>
                <th
                  className="text-center hidden-md hidden-sm hidden-xs show-print">
                  SHIP&nbsp;BY
                </th>
              </tr>
              </thead>

              <tbody>
              {order_lines && order_lines.map((item, index) => (
                <tr key={index+20} className={ item.voided? 'lineThrough': '' }>
                  <td style={{position: "relative"}}><span className="sbold"> {item.line_number}</span><br/><div style={{padding: "5px 0 0 10px", fontSize: "13px"}}>{item.custom_field3}</div>
                  {item.kit_id > 0 &&
                    <span className="bundle_text">{bundle_label(item.kit_id)}</span>
                  }
                  {item.is_kit_component &&
                    <span className="bundle_text">comp.</span>
                  }
                  </td>
                  <td style={{width:"30%"}} className={ classNames({
                    'kit_component' : item.is_kit_component,
                    'kit_bundle' : item.kit_id > 0,
                  }) }>
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
                    <div className="text-primary" style={{paddingTop: "5px", fontSize: "13px"}}>{item.description}</div>
                    <div className='preview-order-detail' style={{paddingTop: "3px"}}>
                      {item.custom_field1 && <span><span className="sbold">CF1: </span><span style={{paddingRight:"15px"}}>{item.custom_field1}</span></span>}
                      {item.custom_field2 && <span><span className="sbold">CF2: </span><span style={{paddingRight:"15px"}}>{item.custom_field2}</span></span>}
                      {item.custom_field5 && <span><span className="sbold">CF5: </span><span style={{paddingRight:"15px"}}>{item.custom_field5}</span></span>}
                      {item.comments && <span><span className="sbold">Comments: </span><span>{item.comments}</span></span>}
                    </div>
                  </td>
                  <td className="text-center "><strong><FormatNumber number={item.quantity} decimals="0"/></strong></td>
                  <td className="text-center "><strong><FormatNumber number={item.shipped} decimals="0"/></strong></td>
                  <td className="text-center "><FormatNumber number={ item.quantity - (item.shipped  ? item.shipped :  0 ) } decimals="0"/></td>


                  <td className="text-center ">
                    {
                      item.is_back_order &&
                      <span
                        className="bg-red-soft font-white sbold"
                        style={{ padding : '0 2px' }}
                      >
                          B/O
                        </span>
                    }
                  </td>
                  <td className="text-right "><FormatNumber number={item.price}/></td>
                  <td className="text-right "><FormatNumber number={item.price * item.quantity}/></td>
                  <td className="text-center hidden-md hidden-sm hidden-xs show-print"><FormatDate date={item.do_not_ship_before}/></td>
                  <td className="text-center hidden-md hidden-sm hidden-xs show-print"><FormatDate date={item.ship_by}/></td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <div className="row" style={{paddingRight : ' 15px '}}>
        <div className="well-sm tb-header-1 ext-section font-white no-border col-sm-3 pull-right ">
          <div className="fa-lg sbold" style={{width : '100% '}}>
            Total Price Item :
            <span className="pull-right "> <FormatNumber number={orderDetail.total_price_line} /> </span>
          </div>
        </div>
      </div>

      {/*<h4 className="caption-subject bold font-red uppercase ">{orderDetail.error_message}</h4>*/}
      <div className="order-status" >
        {
          shipments.length > 0 && <div>

          <hr/>

          <div className="row">
            <div className="col-xs-12 ">
              <span className="caption-subject font-red-sunglo bold uppercase">Shipment</span>
              <div className="table-responsive">
                <table className="table table-hover ">
                  <thead className="table-header-3 ">
                  <tr>
                    <th className="text-center ">#</th>
                    <th className="text-center ">SHIP DATE</th>
                    <th className="text-center ">PACKAGES</th>
                    <th className="text-right " style={{paddingRight: "10px"}}>WEIGHT</th>
                    <th>CARRIER</th>
                    <th>SERVICE</th>
                    <th className="hidden-md hidden-sm hidden-xs">REF 1</th>
                    <th className="hidden-md hidden-sm hidden-xs">REF 2</th>
                    <th className="hidden-md hidden-sm hidden-xs">REF 3</th>
                    <th className="hidden-md hidden-sm hidden-xs">REF 4</th>
                    <th>RS TRACKING #</th>
                    <th>DOCUMENTS</th>
                  </tr>
                  </thead>
                  <tbody>{ shipments && shipments.map( (shipment,i) => (
                    <tr key={shipment.id}>
                      <td className="text-center ">{shipment.line_index}</td>
                      <td className="text-center "><FormatDate date={shipment.ship_date}/></td>
                      <td className="text-center ">{shipment.packages}</td>
                      <td className="text-right " style={{paddingRight: "10px"}}><FormatNumber number={shipment.total_weight} /></td>
                      <td>{shipment.shipping_carrier}</td>
                      <td>{shipment.shipping_service}</td>
                      <td className="hidden-md hidden-sm hidden-xs">
                        {shipment.reference1}
                      </td>
                      <td className="hidden-md hidden-sm hidden-xs">
                        {shipment.reference2}
                      </td>
                      <td className="hidden-md hidden-sm hidden-xs">
                        {shipment.reference3}
                      </td>
                      <td className="hidden-md hidden-sm hidden-xs">
                        {shipment.reference4}
                      </td>
                      <td>
                        {shipment.rs_tr}
                      </td>
                      <td>
                        <span style={shipment.pl_link === null ? {display:"none"} : {whiteSpace : 'nowrap'} } >
                          <i className="fa-fw fa fa-file-pdf-o text-danger" />
                          <a href={shipment.pl_link}
                             target="_blank" className="hidden-print"
                          >Packing List
                          </a>
                        </span>
                        <span style={ shipment.ci_link === null ? {display:"none"} : { whiteSpace : 'nowrap', paddingLeft: "10px" }} >
                          <i className="fa-fw fa fa-file-pdf-o text-danger" />
                          <a href={shipment.ci_link}
                             target="_blank" className="hidden-print"
                          >Comm. Invoice
                          </a>
                        </span>
                        <span style={ shipment.bol_link === null ? {display:"none"} : { whiteSpace : 'nowrap', paddingLeft: "10px" }} >
                          <i className="fa-fw fa fa-file-pdf-o text-danger" />
                          <a href={shipment.bol_link}
                             target="_blank" className="hidden-print"
                          >BOL
                          </a>
                        </span>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>



        <div className="row">
          <div className="col-xs-12 ">
            <span className="caption-subject font-red-sunglo bold uppercase">Package</span>
            <div className="table-responsive">
              <table className="table table-hover ">
                <thead className="table-header-3">
                <tr>
                  <th className="text-center ">#</th>
                  <th className="text-center ">SHIP DATE</th>
                  <th className="text-center ">DELIVERY DATE</th>
                  <th>DELIVERY STATUS</th>
                  <th>PACKAGE #</th>
                  <th>SSCC</th>
                  <th>CARRIER</th>
                  <th>SERVICE</th>
                  <th>TRACKING&nbsp;#</th>
                  <th className="hidden-md hidden-sm hidden-xs">FREIGHT BILL TO</th>
                  <th className="text-right ">ACTUAL WT</th>
                  <th className="text-right hidden-sm hidden-xs">RATED WT</th>
                  <th className="text-center hidden-sm hidden-xs">DIM</th>
                  <th className="text-right ">FREIGHT</th>
                </tr>
                </thead>
                <tbody>
                {packages && packages.map((shipmentPackage,i) => (
                  <tr key={shipmentPackage.id}>
                    <td className="text-center ">{shipmentPackage.line_index}</td>
                    <td className="text-center "><FormatDate date={shipmentPackage.ship_date}/></td>
                    <td className="text-center "><FormatDate date={shipmentPackage.delivery_date}/></td>
                    <td>{shipmentPackage.delivery_info}</td>
                    <td>
                      {
                      shipmentPackage.pallet_number?
                      <span>{shipmentPackage.package_number}<div style={{fontSize:'0.8em', marginLeft: '5px'}} className="text-primary">{shipmentPackage.pallet_number}</div></span>
                      :shipmentPackage.package_number
                      }
                      </td>
                    <td>
                      {
                        shipmentPackage.pallet_asn?
                        <span>{shipmentPackage.asn}<div style={{fontSize:'0.8em', marginLeft: '5px'}} className="text-primary ">{shipmentPackage.pallet_asn}</div></span>
                      :shipmentPackage.asn
                      }
                      </td>
                    <td>{shipmentPackage.shipping_carrier}</td>
                    <td>{shipmentPackage.shipping_service}</td>
                    <td>
                      {
                        shipmentPackage.tracking_link 
                        ? <a href={shipmentPackage.tracking_link} target="_blank">{shipmentPackage.tracking_number}</a>
                        : <span>{shipmentPackage.tracking_number}</span>
                      }
                    </td>
                    <td className="hidden-md hidden-sm hidden-xs">{shipmentPackage.freight_bill_to}</td>
                    <td className="text-right "><FormatNumber number={shipmentPackage.package_weight} /></td>
                    <td className="text-right "><FormatNumber number={shipmentPackage.package_rated_weight} /></td>
                    <td className="text-center "><FormatNumber number={shipmentPackage.package_dimension} /></td>
                    <td className="text-right "><FormatNumber number={shipmentPackage.package_charge} /></td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-xs-12 ">
           <span className="caption-subject font-red-sunglo bold uppercase">Package Detail</span>
            <div className="table-responsive">
              <table className="table table-hover ">
                <thead className="table-header-3">
                  <tr>
                    <th className="text-center ">#</th>
                    <th className="text-center ">SHIP DATE</th>
                    <th>PACKAGE #</th>
                    <th className="text-center ">LINE #</th>
                    <th>ITEM #</th>
                    <th>DESCRIPTION</th>
                    <th className="text-right ">QTY</th>
                  </tr>
                </thead>
                <tbody>
                {package_details && package_details.map((detail,i) => (
                  <tr key={detail.id}>
                    <td className="text-center ">{detail.line_index}</td>
                    <td className="text-center "><FormatDate date={detail.ship_date}/></td>
                    <td>{detail.package_number}</td>
                    <td className="text-center ">{detail.line_number}</td>
                    <td>{detail.item_number}</td>
                    <td>{detail.description}</td>
                    <td className="text-right "><FormatNumber number={detail.quantity} decimals="0" /></td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-xs-12 ">
            <span className="caption-subject font-red-sunglo bold uppercase">Serial/Lot #</span>
            <div className="table-responsive">
              <table className="table table-hover ">
                <thead className="table-header-3">
                  <tr>
                    <th className="text-center ">#</th>
                    <th className="text-center ">SHIP DATE</th>
                    <th>PACKAGE #</th>
                    <th>ITEM #</th>
                    <th>DESCRIPTION</th>
                    <th>SERIAL/LOT #</th>
                    <th className="text-right ">QTY</th>
                  </tr>
                </thead>
                <tbody>
                  {serials && serials.map((serial,i) => (
                  <tr key={serial.id}>
                    <td className="text-center ">{serial.line_index}</td>
                    <td className="text-center "><FormatDate date={serial.ship_date}/></td>
                    <td>{serial.package_number}</td>
                    <td>{serial.item_number}</td>
                    <td>{serial.description}</td>
                    <td>{serial.serial_no}</td>
                    <td className="text-right "><FormatNumber number={serial.quantity} decimals="0" /></td>
                  </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        }
      </div>
    </div>
  )
}

OrderDetailBody.propTypes = {
  gridOrderFetchData : PropTypes.shape({
    item_number : PropTypes.string,
    location : PropTypes.string,
    weeks : PropTypes.bool
  })
}

export default OrderDetailBody