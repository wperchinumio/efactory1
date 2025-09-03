import React from 'react'
import PropTypes from 'prop-types'
import Select2React from './Select2React'

const ShippingFormTemplate = props => {
  let {
    formValues,
    onFieldValueChange,
    options,
    title,
    orderOfOptionKeys_FreightAccounts
  } = props

  let {
    carriers,
    freightAccounts,
    services,
    incotermOptions,
    internationalCodes,
    pl
  } = options

  let {
    carrier,
    service,
    packing_list_type,
    freight_account,
    consignee_number,
    comments,
    int_code,
    terms,
    fob
  } = formValues

  carrier = carrier ? carrier : ''
  service = service ? service : ''
  packing_list_type = packing_list_type ? packing_list_type : ''
  freight_account = freight_account ? freight_account : ''
  consignee_number = consignee_number ? consignee_number : ''
  comments = comments ? comments : ''
  int_code = int_code === undefined || int_code === null ? '' : int_code
  terms = terms ? terms : ''
  fob = fob ? fob : ''

  return (
    <div className="col-lg-5 col-md-12">
      <div>
        <span style={{fontWeight: "600"}} className="font-blue-soft">
          { title }
        </span>
      </div>
      <hr className="border-grey-salsa" style={{marginTop: "0"}} />
      <div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            Ship Carrier:
          </label>
          <div className="col-md-8">
            <Select2React
              className="form-control"
              options={ carriers }
              selected={ carrier }
              onChangeHandler={ value => {
                onFieldValueChange({ field : 'carrier', value })
              } }
              placeholder="Select... "
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            Ship Service:
          </label>
          <div className="col-md-8">
            <Select2React
              className="form-control"
              options={ services }
              selected={ service }
              onChangeHandler={ value => onFieldValueChange({
                field : 'service',
                value
              }) }
              placeholder="Select... "
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            Freight Account:
          </label>
          <div className="col-md-4">
            <Select2React
              className="form-control"
              isoFormat={true}
              options={ freightAccounts }
              selected={ freight_account }
              onChangeHandler={ value => onFieldValueChange({
                field : 'freight_account',
                value
              }) }
              placeholder="Select... "
              orderOfOptionKeys={orderOfOptionKeys_FreightAccounts}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Consignee #"
              type="text"
              onChange={ event => onFieldValueChange({
                field : 'consignee_number',
                value : event.target.value
              }) }
              value={ consignee_number }
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            Comments:
          </label>
          <div className="col-md-8">
            <textarea
              className="form-control input-md"
              rows="2"
              value={ comments }
              onChange={ event => onFieldValueChange({
                field : 'comments',
                value : event.target.value
              }) }
            ></textarea>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            Packing List Type:
          </label>
          <div className="col-md-4">
            <Select2React
              className="form-control"
              options={ pl }
              selected={ String(packing_list_type)  }
              onChangeHandler={ value => onFieldValueChange({
                field : 'packing_list_type',
                value
              }) }
              placeholder="Select... "
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            International Code:
          </label>
          <div className="col-md-8">
            <Select2React
              className="form-control"
              topOptions={ [ '0' ] }
              topOptionsTitle={ 'DOMESTIC' }
              options={ internationalCodes }
              optionsTitle={ 'INTERNATIONAL' }
              isoFormat={true}
              selected={ String(int_code) }
              onChangeHandler={ value => onFieldValueChange({
                field : 'int_code',
                value
              }) }
              placeholder="Select... "
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">Incoterms:</label>
          <div className="col-md-4">

            <Select2React
              className="form-control"
              options={ incotermOptions }
              selected={ terms }
              onChangeHandler={ value => onFieldValueChange({
                field : 'terms',
                value
              }) }
              placeholder="Select... "
            />
          </div>
          <div className="col-md-4">
            <a href="#incoterms_modal" data-toggle="modal" style={{ paddingTop: '8px', display: 'block' }}>
              <i className="fa fa-info-circle"></i> Incoterms
            </a>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4 control-label">
            FOB:
          </label>
          <div className="col-md-4">
            <input
              className="form-control"
              onChange={ event => onFieldValueChange({
                field : 'fob',
                value : event.target.value
              }) }
              type="text"
              value={ fob }
            />
          </div>
        </div>
      </div>
      <div 
        className="modal modal-themed fade" 
        id="incoterms_modal" 
        tabIndex="-1" 
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg" style={{width:"1150px"}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
              <h4 className="modal-title">Allocations of costs to buyer/seller according to Incoterms</h4>
            </div>
            <div className="modal-body">
              <table cellPadding="0" className="table-incoterms">
                <thead>
                <tr className="tr-incoterms1">
                  <td className="td-incoterms1">
                    <p className="text-center">
                      Incoterm 2010
                    </p>
                  </td>
                  <td className="td-incoterms2">
                    <p className="text-center">
                      Export customs
                      declaration
                    </p>
                  </td>
                  <td className="td-incoterms1">
                    <p className="text-center">
                      Carriage to port
                      of export
                    </p>
                  </td>
                  <td className="td-incoterms2">
                    <p className="text-center">
                      Unloading of truck
                      in port of export
                    </p>
                  </td>
                  <td className="td-incoterms1">
                    <p className="text-center">
                      Loading on vessel
                      in port of export
                    </p>
                  </td>
                  <td className="td-incoterms2">
                    <p className="text-center">
                      Carriage (Sea/Air)
                      to port of import
                    </p>
                  </td>
                  <td className="td-incoterms1">
                    <p className="text-center">
                      Insurance
                    </p>
                  </td>
                  <td className="td-incoterms2">
                    <p className="text-center">
                      Unloading in port
                      of import
                    </p>
                  </td>
                  <td className="td-incoterms1">
                    <p className="text-center">
                      Loading on truck
                      in port of import
                    </p>
                  </td>
                  <td className="td-incoterms2">
                    <p className="text-center">
                      Carriage to place
                      of destination
                    </p>
                  </td>
                  <td className="td-incoterms1">
                    <p className="text-center">
                      Import customs
                      clearance
                    </p>
                  </td>
                  <td className="td-incoterms2">
                    <p className="text-center">
                      Import taxes
                    </p>
                  </td>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-incoterms3">
                      <p>EXW</p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>FCA</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>FAS</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>FOB</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>CPT</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer/Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>CFR(CNF)</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer/Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>CIF</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>CIP</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer/Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>DAT</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>DAP</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                    <td className="td-incoterms5">
                      <p className="text-center">
                        Buyer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="td-incoterms3">
                      <p>DDP</p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                    <td className="td-incoterms4">
                      <p className="text-center">
                        Seller
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ShippingFormTemplate.propTypes = {
  formValues: PropTypes.shape({
    carrier: PropTypes.string,
    service: PropTypes.string,
    packing_list_type: PropTypes.any,
    freight_account: PropTypes.string,
    consignee_number: PropTypes.string,
    comments: PropTypes.string,
    int_code: PropTypes.any,
    terms: PropTypes.string
  }),
  onFieldValueChange: PropTypes.func.isRequired ,
  options: PropTypes.shape({
    carriers: PropTypes.object,
    freightAccounts: PropTypes.object,
    services: PropTypes.object,
    incotermOptions: PropTypes.object,
    internationalCodes: PropTypes.object,
    pl: PropTypes.object
  }),
  orderOfOptionKeys_FreightAccounts: PropTypes.array,
  title: PropTypes.string.isRequired
}

export default ShippingFormTemplate