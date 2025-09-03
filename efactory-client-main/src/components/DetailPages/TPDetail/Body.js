import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import TPStatus from './Sections/TPStatus'
import TPLast30Days from './Sections/TPLast30Days'
import TPItemsShipped from './Sections/TPItemsShipped'
import TPTiles from './Sections/TPTiles'

const TPDetailBody = ({
  tpDetail = {},
  trading_partner,
  ediState,
}) => {
  const [fieldType, setFieldType] = useState('orders')

  function onFieldTypeChange (event) {
    setFieldType(fieldType === 'orders' ? 'value' : 'orders')
  }

  let {
    tp_setup = {},
    tp_status = {},
    tp_last30days = [],
    tp_items_shipped = [],
    tp_tiles = {}
  } = tpDetail

  tp_setup = tp_setup ? tp_setup : {}

  return (
    <div className="portlet-body order-status">
      <div className="row">
        <div className="col-md-9">

          <TPTiles
            tp_tiles={ tp_tiles }
            trading_partner={ trading_partner }
          />

          <br/>

          <TPStatus
            { ...tp_status }
            name={ 'missing' }
            code={ trading_partner }
            ediState={ ediState }
          />

          <div style={{padding: "10px", border: "1px solid #ddd", borderRadius: "10px"}} className="chart-background">

            <div className="row">
              <div className="col-md-9">
                <div className="caption-subject font-blue-soft sbold uppercase">
                  Last 30 Days Activity (Received)
                </div>
              </div>
              <div className="col-md-3">
                <label className="sbold">Type:</label>
                <select
                  className="form-control input-sm"
                  value={ fieldType }
                  onChange={ onFieldTypeChange }
                >
                  <option value="orders">Orders</option>
                  <option value="value">Value</option>
                </select>
              </div>
            </div>

            <div style={{height: "250px"}}>

              <TPLast30Days
                field_type={ fieldType }
                tp_last30days={ tp_last30days }
              />

            </div>

            <hr/>


            <div className="row">
              <div className="col-md-9">
                <div className="caption-subject font-blue-soft sbold uppercase">
                  Last 30 days Items Shipped
                </div>
              </div>
              <div className="col-md-3">
              </div>
            </div>

            <div style={{height: "390px"}}>

              <TPItemsShipped
                tp_items_shipped={ tp_items_shipped }
              />

            </div>


          </div>
        </div>

        <div className="col-md-3">
          <div className="row" style={{paddingBottom: "5px"}}>
            <div className="col-md-8 ext-title">
              <label className="sbold" style={{paddingTop: "4px"}}>ACCOUNT #:</label>
            </div>
            <div className="col-md-4">
              <span className="ext-value ext-value-input ext-value-pile">
                  { tp_setup.account_number }
              </span>
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">Setup</span>
              </div>
              <div className="col-md-4 ext-title">
                Connectivity
              </div>
              <div className="col-md-8">
                <span className="ext-value ext-value-input ext-value-pile">
                  { tp_setup.connectivity }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ext-title">
                Sender
              </div>
              <div className="col-md-8">
                <span className="ext-value ext-value-input ext-value-pile">
                  { tp_setup.sender_qual } - { tp_setup.sender_code }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ext-title">
                Receiver
              </div>
              <div className="col-md-8">
                <span className="ext-value ext-value-input ext-value-pile">
                  { tp_setup.receiver_qual } - { tp_setup.receiver_code }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ext-title">
                EDI Version
              </div>
              <div className="col-md-8">
                <span className="ext-value ext-value-input ext-value-pile">
                  { tp_setup.edi_ver }
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ext-title">
                Terms
              </div>
              <div className="col-md-8">
                <span className="ext-value ext-value-input ext-value-pile">
                  { tp_setup.terms_description }
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="row" style={{ marginTop : '10px' }}>
              <div className="col-md-12">
                <span className="item-section table-header-1">REMIT TO</span>
              </div>
            </div>

            <div className="row">

              <div className="col-md-12">
                <span className="remit-code">{ tp_setup.remit_to_code }</span>
              </div>

            </div>

            <div className="row static-info ">
              <div className="value col-md-12 ">{tp_setup.remit_to_name}&nbsp;</div>
            </div>
            <div className="row static-info ">
              <div className="value col-md-12 ">{tp_setup.remit_to_contact}&nbsp;</div>
            </div>
            <div className="row static-info ">
              <div className="value col-md-12 ">{tp_setup.remit_to_add1}&nbsp;{tp_setup.remit_to_add2}</div>
            </div>
            <div className="row static-info ">
              <div className="value col-md-12 ">{tp_setup.remit_to_city}{tp_setup.remit_to_state && <span>&nbsp;,&nbsp;</span>}{tp_setup.remit_to_state}{tp_setup.remit_to_zip && <span>&nbsp; - &nbsp;</span>}{tp_setup.remit_to_zip}</div>
            </div>
            <div className="row static-info ">
              <div className="value col-md-12 ">{tp_setup.country}&nbsp;</div>
            </div>
            <div className="row static-info ">
              <div className="value col-md-12 "><i
                className={ classNames({
                  'fa fa-phone' : tp_setup.remit_to_phone,
                }) }> </i> {tp_setup.remit_to_phone}&nbsp;
              </div>
            </div>
            <div className="row static-info ">
              <div className="value col-md-12 "><i
                className={ classNames({
                  'fa fa-envelope' : tp_setup.remit_to_email,
                }) }
                > </i> {tp_setup.remit_to_email}&nbsp;
              </div>
            </div>

          </div>

          <div style={{paddingTop:"5px"}}>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">Required Documents</span>
              </div>

              {
                Array.isArray(tp_setup.required_documents) &&
                tp_setup.required_documents.map( ( r_doc ) => {
                  return <div className="col-md-12 ext-title" key={ `required_documents${r_doc.title}`}>
                    <span className="edi_doc" style={{ paddingLeft: '8px' }}>
                      { r_doc.title }
                    </span>
                    <span className="edi_doc_desc">
                      { r_doc.description }
                    </span>
                  </div>
                } )
              }

              {
                (
                  !tp_setup.required_documents
                  || !Array.isArray(tp_setup.required_documents)
                  || !tp_setup.required_documents.length
                ) && <div className="col-md-12">
                  <div style={{backgroundColor: "#ffffc4", padding: "10px", border: "1px solid #bbb", margin: "10px", color: "#444", textAlign:"center"}}>
                    No 'Required Documents'
                  </div>
                </div>
              }

            </div>
          </div>


          <div style={{paddingTop:"5px"}}>
            <div className="row">
              <div className="col-md-12">
                <span className="item-section table-header-1">Optional Documents</span>
              </div>

              {
                Array.isArray(tp_setup.optional_documents) &&
                tp_setup.optional_documents.map( ( o_doc ) => {
                  return <div className="col-md-12 ext-title" key={`optional_documents${o_doc.title}`}>
                    <span className="edi_doc"  style={{ paddingLeft: '8px' }}>
                      { o_doc.title }
                    </span>
                    <span className="edi_doc_desc">
                      { o_doc.description }
                    </span>
                  </div>
                } )
              }

              {
                (
                  !tp_setup.optional_documents
                  || !Array.isArray(tp_setup.optional_documents)
                  || !tp_setup.optional_documents.length
                ) && <div className="col-md-12">
                  <div style={{backgroundColor: "#ffffc4", padding: "10px", border: "1px solid #bbb", margin: "10px", color: "#444", textAlign:"center"}}>
                    No 'Optional Documents'
                  </div>
                </div>
              }

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

TPDetailBody.propTypes = {
  fetchItemDetailData : PropTypes.shape({
    trading_partner   : PropTypes.string,
    orders            : PropTypes.bool
  }),
  fetchTPDetail      : PropTypes.func,
  tpDetail          : PropTypes.shape({
    tp_setup          : PropTypes.shape({
      partner_name         : PropTypes.string,
      partner_code         : PropTypes.string,
      vendor_number        : PropTypes.string,
      account_number       : PropTypes.string,
      connectivity         : PropTypes.string,
      sender_qual          : PropTypes.string,
      sender_code          : PropTypes.string,
      receiver_qual        : PropTypes.string,
      receiver_code        : PropTypes.string,
      edi_ver              : PropTypes.string,
      terms_description    : PropTypes.string,
      remit_to_code        : PropTypes.string,
      remit_to_name        : PropTypes.string,
      remit_to_add1        : PropTypes.string,
      remit_to_add2        : PropTypes.string,
      remit_to_city        : PropTypes.string,
      remit_to_state       : PropTypes.string,
      remit_to_zip         : PropTypes.string,
      remit_to_country     : PropTypes.string,
      remit_to_contact     : PropTypes.string,
      remit_to_phone       : PropTypes.string,
      remit_to_email       : PropTypes.string,
      required_documents   : PropTypes.array,
      optional_documents   : PropTypes.array
    })
  })
}

export default connect(
  state => ({
    ediState : state.edi
  })
)(TPDetailBody)