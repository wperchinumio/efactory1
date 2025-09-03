import React, { useState } from 'react'
import FormatNumber from '../../_Helpers/FormatNumber'
import FormatDate from '../../_Helpers/FormatDate'

const BodyOriginal = ({
  orderDetail: { custom_data = {} },
  openDetailPage
}) => {
  const [openDetailIds, setOpenDetailIds] = useState([])

  function toggleDetail (event) {
    let id = event.target.getAttribute('data-id')
    id = +id
    
    let openDetailIdsNext

    if( openDetailIds.includes( id ) ){
      openDetailIdsNext = openDetailIds.filter( id_ => id_ !== id )
    }else{
      openDetailIdsNext = [ ...openDetailIds, id ]
    }
    setOpenDetailIds(openDetailIdsNext)
  }

    let {
    header,
    detail
  } = custom_data

  return (
    <div className="portlet-body order-status">

      <div className="row">
        <div className="col-md-9">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="ext-section ext-section-custom-order"><i className="fa fa-truck"></i> Consignee Address</div>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">First Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_firstname}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Last Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_lastname}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Ship To Customer #:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_num_ship_to_cust}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Company:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_company}
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">Address 1:</label>
                  <span className="ext-value ext-value-input">
                        {header.consignee_add1}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Address 2:</label>
                  <span className="ext-value ext-value-input">
                        {header.consignee_add2}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Address 3:</label>
                  <span className="ext-value ext-value-input">
                        {header.consignee_add3}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Address 4:</label>
                  <span className="ext-value ext-value-input">
                        {header.consignee_add4}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">City:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_city}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">State:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_state}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Province:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_province}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Zip Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_zipcode}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Country Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_countrycode}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Phone:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_phone}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Email:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_attn}
                  </span>
                </div>
              </div>
            </div>
            

            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="ext-section ext-section-custom-order"><i className="fa fa-send"></i> Shipping Method</div>
                </div>

                <div className="col-md-6">
                  <label className="control-label ext-title">Sales Order #:</label>
                  <span className="ext-value ext-value-input">
                    {header.order_number}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Ship Mode:</label>
                  <span className="ext-value ext-value-input">
                    {header.ship_mode}
                  </span>
                </div>

                <div className="col-md-6">
                  <label className="control-label ext-title">Ordered Date:</label>
                  <span className="ext-value ext-value-input">
                        <FormatDate date={header.ordered_date}/>
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Shipment Priority:</label>
                  <span className="ext-value ext-value-input">
                    {header.shipment_priority}
                  </span>
                </div>


                <div className="col-md-6">
                  <label className="control-label ext-title">Sic Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.sic_code}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Payment Type:</label>
                  <span className="ext-value ext-value-input">
                    {header.payment_type}
                  </span>
                </div>


                <div className="col-md-6">
                  <label className="control-label ext-title">Ship Via:</label>
                  <span className="ext-value ext-value-input">
                    {header.ship_via}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Ship Type:</label>
                  <span className="ext-value ext-value-input">
                    {header.ship_type}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Freight Account:</label>
                  <span className="ext-value ext-value-input">
                    {header.freight_account}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Consignee #:</label>
                  <span className="ext-value ext-value-input">
                    {header.consignee_number}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Incoterms:</label>
                  <span className="ext-value ext-value-input">
                    {header.inco_terms}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Payment Terms:</label>
                  <span className="ext-value ext-value-input">
                    {header.payment_terms}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Freight Terms Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.freight_termscode}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Ship Method Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.ship_method_code}
                  </span>
                </div>

              </div>
            </div>
          </div>
     
          <div style={{height: "15px"}}></div>

          <div className="row">
            
          <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="ext-section ext-section-custom-order"><i className="fa fa-truck"></i> End User Address</div>
                  </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">First Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.enduser_firstname}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Last Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.enduser_lastname}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Customer #:</label>
                  <span className="ext-value ext-value-input">
                    {header.enduser_customer_number}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.endcustomer_name}
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">Address 1:</label>
                  <span className="ext-value ext-value-input">
                        {header.endcustomer_add1}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Address 2:</label>
                  <span className="ext-value ext-value-input">
                        {header.endcustomer_add2}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Address 3:</label>
                  <span className="ext-value ext-value-input">
                        {header.endcustomer_add3}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Address 4:</label>
                  <span className="ext-value ext-value-input">
                        {header.endcustomer_add4}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">City:</label>
                  <span className="ext-value ext-value-input">
                    {header.endcustomer_city}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">State:</label>
                  <span className="ext-value ext-value-input">
                    {header.endcustomer_state}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Province:</label>
                  <span className="ext-value ext-value-input">
                    {header.endcustomer_province}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Zip Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.endcustomer_zipcode}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Country Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.endcustomer_country}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Phone:</label>
                  <span className="ext-value ext-value-input">
                    {header.enduser_phone}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Email:</label>
                  <span className="ext-value ext-value-input">
                    {header.enduser_customer_attn}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="ext-section ext-section-custom-order"><i className="fa fa-dollar"></i> Bill To Address</div>
                  </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">First Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.billtocontact_firstname}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Last Name:</label>
                  <span className="ext-value ext-value-input">
                    {header.billtocontact_lastname}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Customer #:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_customer_number}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Company:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_company}
                  </span>
                </div>
                <div className="col-md-8">
                  <label className="control-label ext-title">Address 1:</label>
                  <span className="ext-value ext-value-input">
                        {header.billto_add1}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Address 2:</label>
                  <span className="ext-value ext-value-input">
                        {header.billto_add2}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Address 3:</label>
                  <span className="ext-value ext-value-input">
                        {header.billto_add3}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Address 4:</label>
                  <span className="ext-value ext-value-input">
                        {header.billto_add4}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">City:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_city}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">State:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_state}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Province:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_province}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Zip Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_zipcode}
                  </span>
                </div>
                <div className="col-md-4">
                  <label className="control-label ext-title">Country Code:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_countrycode}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Phone:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_contact_phone}
                  </span>
                </div>
                <div className="col-md-6">
                  <label className="control-label ext-title">Email:</label>
                  <span className="ext-value ext-value-input">
                    {header.billto_attn}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>


        <div className="col-md-3">
          <div className="row no-margins">
            <div className="col-md-12 ext-section ext-section-custom-order">
              General
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Account #:
            </div>
            <div className="col-md-7">
              <span className="ext-value">
                {header.account_number}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Order Type:
            </div>
            <div className="col-md-7">
              <span className="ext-value">
                {header.order_type}
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Customer PO #:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.customer_po_number}
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Org ID:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.org_id}
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Currency Code:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.currency_code}
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Convertion Rate:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  <FormatNumber number={header.conversion_rate}/>
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Inventory Org. Code:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.inventory_org_code}
                </span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Importer Of Record:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.importer_of_record}
                </span>
            </div>
          </div>

          <div className="row no-margins">
            <div className="col-md-12 ext-section ext-section-custom-order">
              <span>Amounts</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Sub Total:
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={header.sub_total}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              S &amp; H:
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={header.ship_handling}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Sales Taxes:
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={header.sales_tax}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Total Due:
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={header.total_due}/>
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title ext-title-nogap">
              Amount Paid:
            </div>
            <div className="col-md-7 text-right">
                <span className="ext-value ">
                  <FormatNumber number={header.amount_paid}/>
                </span>
            </div>
          </div>


          <div className="row no-margins">
            <div className="col-md-12 ext-section ext-section-custom-order">
              <span>Attributes</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 1:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute1}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 2:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute2}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 3:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute3}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 4:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute4}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 5:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute5}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 6:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute6}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 7:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute7}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 8:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute8}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 9:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute9}
                </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ext-title">
              Attribute 10:
            </div>
            <div className="col-md-7">
                <span className="ext-value ">
                  {header.attribute10}
                </span>
            </div>
          </div>

          <div className="row no-margins">
            <div className="col-md-12 ext-section ext-section-custom-order">
              <span>Shipping Instructions</span>
            </div>
            <div className="col-md-12" style={{paddingLeft: 0, paddingRight: 0}}>
              <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "60px"}}>
                {header.shipping_instructions}
              </span>
            </div>
          </div>

          <div className="row no-margins" style={{paddingTop: "4px"}}>
            <div className="col-md-12 ext-section ext-section-custom-order">
              <span>Packing List Comments</span>
            </div>
            <div className="col-md-12" style={{paddingLeft: 0, paddingRight: 0}}>
              <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "60px"}}>
                {header.packing_instructions}
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
              <thead className="ext-section ext-section-custom-order">
              <tr>
                <th>LINE # / DET. ID / LINE ID&nbsp;&nbsp;</th>
                <th>PART # / SHORT DESC. / LONG DESC.</th>
                <th>INV CODE / SUBINV / UOM</th>
                <th className="text-right ">QTY / PRICE / EXT. PRICE</th>
                <th className="text-right ">SHIP BY / S. METHOD CODE / CURR. CODE</th>
              </tr>
              </thead>

              {detail && detail.map((item, index) => (
                <tbody key={index+50020} >
                  <tr style={{verticalAlign: "top"}}>
                    <td>
                      <span className="sbold" style={{paddingLeft: "39px"}}> {item.order_line_number}</span>
                      <div style={{padding: "5px 0 0 49px", fontSize: "13px"}}>{item.delivery_line_detail_id}
                        <br/>
                        {item.order_line_id}
                      </div>
                      <div
                        style={{ marginTop : '-22px' }}
                        onClick={ toggleDetail }
                        data-id={ index }
                      >
                        <button 
                          className="btn blue-dark btn-xs"
                          data-id={ index }
                        >
                          <i 
                            className={`fa fa-chevron-${openDetailIds.includes( index ) ? 'down' : 'right'}`}
                            data-id={ index }
                          ></i>
                        </button>  
                      </div>
                      
                    
                        
                    </td>
                    
                    <td style={{width:"30%"}}>
                      <a
                        style={{fontWeight:600}}
                        onClick={ event => openDetailPage({
                          openDetailPageType : 'item',
                          detailTypeNumber   : item.part_number
                        }) }
                      >
                        { item.part_number ? item.part_number : '' }
                      </a>

                      <br/>
                      <div className="text-primary" style={{paddingTop: "5px", fontSize: "13px"}}>{item.description_short}
                        <br/>
                        {item.description_long}
                      </div>
                    </td>

                    <td>
                      {item.inv_org_code}
                      <br/>
                      {item.subinventory}
                      <br/>
                      {item.order_line_unit_of_measure}
                    </td>

                    <td className="text-right ">
                      <strong><FormatNumber number={item.quantity} decimals="0"/></strong>
                      <br/>
                      <strong><FormatNumber number={item.price} decimals="2"/></strong>
                      <br/>
                      <strong><FormatNumber number={item.extended_price} decimals="2"/></strong>
                    </td>
                    
                    <td className="text-right ">
                      <FormatDate date={item.ship_by_date}/>
                      <br/>
                      {item.shipment_priority}
                      <br/>
                      {item.currency_code}
                    </td>
                  </tr>
                  
                  {
                    openDetailIds.includes( index ) && 
                    <tr className="extra-info-detail">
                    <td colSpan="5" style={{backgroundColor: "#F3F4F6"}}>
                      <div className="row no-margins">
                        <div className="col-md-2 col-sm-2 col-xs-2">
                            <ul className="nav nav-tabs tabs-left tabs-left-no-bottom-border" style={{ paddingLeft: "39px" }}>
                                <li className="active">
                                    <a href={'#'+index+"detail_ec"} data-toggle="tab" aria-expanded="true"> EC </a>
                                </li>
                                <li className="">
                                    <a href={'#'+index+"detail_attr"}  data-toggle="tab" aria-expanded="false"> Attributes </a>
                                </li>
                                <li>
                                    <a href={'#'+index+"detail_notes"}  data-toggle="tab"> Notes </a>
                                </li>
                                <li>
                                    <a href={'#'+index+"detail_more"}  data-toggle="tab"> More </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-10 col-sm-10 col-xs-10" style={{minHeight: "320px"}}>
                            <div className="tab-content">
                                <div className="tab-pane active in" id={index+"detail_ec"} style={{padding: "10px"}}>
                                  <div className="row">
                                    <div className="col-md-4">
                                      <label className="control-label ext-title">EC HTS:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_hts}
                                      </span>

                                      <label className="control-label ext-title">EC ECCN US:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_eccn_us}
                                      </span>

                                      <label className="control-label ext-title">EC CCATS US:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_ccats_us}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE CODE US:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_code_us}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE NUMBER US:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_number_us}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE EXP. DATE US:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_expiration_date_us}
                                      </span>

                                    </div>
                                    <div className="col-md-4">
                                      <label className="control-label ext-title">COUNTRY OF MFG ORIGIN APAC:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.country_of_mfg_origin_apac}
                                      </span>

                                      <label className="control-label ext-title">EC ECCAN APAC:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_eccan_apac}
                                      </span>

                                      <label className="control-label ext-title">EC HTS SHIP TO APAC:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_hts_ship_to_apac}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE CODE APAC:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_code_apac}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE NUMBER APAC:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_number_apac}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE EXP. DATE APAC:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_expiration_date_apac}
                                      </span>
                                    </div>
                                    <div className="col-md-4">
                                      <label className="control-label ext-title">EC HTS CZ:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_hts_cz}
                                      </span>

                                      <label className="control-label ext-title">EC ECLN IE:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_ecln_ie}
                                      </span>

                                      <label className="control-label ext-title">EC HTS SHIP TO:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_hts_ship_to}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE CODE IE:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_code_ie}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE NUMBER IE:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_number_ie}
                                      </span>

                                      <label className="control-label ext-title">EC LICENSE EXP. DATE IE:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.ec_license_expiration_date_ie}
                                      </span>
                                    </div>
                                  </div>    
                                </div>
                                <div className="tab-pane fade" id={index+"detail_attr"} style={{padding: "10px"}}>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label className="control-label ext-title">ATTRIBUTE 1:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute1}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 2:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute2}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 3:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute3}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 4:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute4}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 5:</label>
                                      <span className="ext-value ext-value-input">
                                        {item.attribute5}
                                      </span>

                                    </div>
                                    <div className="col-md-6">
                                    <label className="control-label ext-title">ATTRIBUTE 6:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute6}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 7:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute7}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 8:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute8}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 9:</label>
                                      <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                        {item.attribute9}
                                      </span>

                                      <label className="control-label ext-title">ATTRIBUTE 10:</label>
                                      <span className="ext-value ext-value-input">
                                        {item.attribute10}
                                      </span>

                                    </div>
                                  </div>
                                </div>
                                <div className="tab-pane fade" id={index+"detail_notes"} style={{padding: "10px"}}>
                                    <label className="control-label ext-title">LINE NOTE:</label>
                                    <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "50px", marginBottom: "15px"}}>{item.line_note}</span>
                                    <label className="control-label ext-title">SHIPPING INSTRUCTIONS:</label>
                                    <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "50px", marginBottom: "15px"}}>{item.shipping_instructions}</span>
                                    <label className="control-label ext-title">PACKING INSTRUCTIONS:</label>
                                    <span className="ext-value ext-value-input ext-break ext-overlay" style={{minHeight: "50px"}}>{item.packing_instructions}</span>
                                </div>
                                <div className="tab-pane fade" id={index+"detail_more"} style={{padding: "10px"}}>
                                  <div className="row">
                                      <div className="col-md-6">
                                        <label className="control-label ext-title">EC MOPS:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.ec_mops}
                                        </span>

                                        <label className="control-label ext-title">SINGAPORE IMPORT LIC #:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.singapore_import_license_no}
                                        </span>

                                        <label className="control-label ext-title">INDONESIA REGISTRATION #:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.indonesian_registration_no}
                                        </span>

                                        <label className="control-label ext-title">DISTRIBUTOR PO #:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.distributor_po_number}
                                        </span>

                                        <label className="control-label ext-title">RESELLER PO #:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.reseller_po_number}
                                        </span>
                                      </div>
                                      <div className="col-md-6">
                                        <label className="control-label ext-title">SHIP SET:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.ship_set}
                                        </span>

                                        <label className="control-label ext-title">HONGKONG REGISTRATION #:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.hongkong_registration_no}
                                        </span>

                                        <label className="control-label ext-title">RUSSIAN REGISTRATION #:</label>
                                        <span className="ext-value ext-value-input" style={{marginBottom: "6px"}}>
                                          {item.russian_registration_no}
                                        </span>

                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  }
                  

                </tbody>
              ))}

            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyOriginal