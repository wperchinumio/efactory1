import React from 'react'

const Content = () => {
	return (
		<div className="op-review container-page-bar-fixed">
		  <div className="op-review-inner">
		    <div className="row-low-padding">
		      <div className="col-md-9 op-review-main">
		        <div>
		          <div className="row">
		            <div className="col-lg-4 col-md-12">
		              <div className="shipping">
		                <div className="addr-type"><i className="fa fa-book" />&nbsp; SECTION 1</div>
		                <div className="form-group padding-5" style={{marginBottom: 3}}>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	DCL, Inc. Customer Name:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	DCL Fulfillment / Warehouse Location:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	DCL Customer Account #:
		                      </label>
		                      <select name="accountNumberLocation" className="form-control input-sm">
		                        <option value />
		                        <option value="test">Temp</option>
		                      </select>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	Address:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	Contact:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	Phone:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-12">
		                      <label className="control-label label-req">
		                      	Commodity ( Product Description ):
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            </div>
		            <div className="col-lg-8 col-md-12">
		              <div className="shipping">
		                <div className="addr-type"><i className="fa fa-book" />&nbsp; SECTION 2</div>
		                <div className="form-group padding-5" style={{marginBottom: 3}}>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	EDI Trading Partner (TP) Name:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	EDI DCL Customer TP's Vendor:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text"
		                      		className="form-control input-sm" 
		                      	/>
	                      	</div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	EDI TP eMail Address or EDI Testing Web Site:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	EDI TP Technical Contact Name:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text"
		                      		className="form-control input-sm" 
		                      	/>
	                      	</div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	EDI TP Technical Contact Phone:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Who Pays Freight:
		                      </label>
		                      <select name="accountNumberLocation" className="form-control input-sm">
		                        <option value />
		                        <option value="test">Temp</option>
		                      </select>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Default Ship Method ( If applicable ):
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	GSI Company Prefix ( 10 digits numeric number ):
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text"
		                      		className="form-control input-sm" 
		                      	/>
	                      	</div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	eMail Notification Address:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Approve 850 in DCL EDI Central (PO):
		                      </label>
		                      <div className="input-sm">
						                
						                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
						                  Yes
						                  <input 
						                  	type="radio" 
						                  	value="yes" 
					                      checked={ false }
						                  />
						                  <span></span>
						                </label>

						                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
						                  No
						                  <input 
						                  	type="radio" 
						                  	value="no" 
					                      checked={ false }
						                  />
						                  <span></span>
						                </label>

						              </div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Payment Terms with EDI TP:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Remit to Address:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text"
		                      		className="form-control input-sm" 
		                      	/>
	                      	</div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Remit to Contact Name:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Remit to Phone Number:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text"
		                      		className="form-control input-sm" 
		                      	/>
	                      	</div>
		                    </div>
		                  </div>
		                  <div className="row">
		                    <div className="col-md-6">
		                      <label className="control-label">
		                      	Remit to Email Address:
		                      </label>
		                      <div>
		                      	<input 
		                      		type="text" 
		                      		className="form-control input-sm" 
		                      	/>
		                      </div>
		                    </div>
		                    <div className="col-md-6">
		                      <label className="control-label" >
						                Can Customer Process Paper Invoices while DCL Sends 810:
						              </label>
						              
						              <div className="input-sm">
						                
						                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
						                  Yes
						                  <input 
						                  	type="radio" 
						                  	value="yes" 
					                      checked={ false }
						                  />
						                  <span></span>
						                </label>

						                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
						                  No
						                  <input 
						                  	type="radio" 
						                  	value="no" 
					                      checked={ false }
						                  />
						                  <span></span>
						                </label>

						                <label className="mt-radio mt-radio-outline" style={{ paddingRight : "20px" }}>
						                  N/A
						                  <input 
						                  	type="radio" 
						                  	value="no" 
					                      checked={ false }
						                  />
						                  <span></span>
						                </label>

						              </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            </div>
		          </div>
		        </div>
		      </div>
		      <div className="col-md-3">
            <div className="shipping section">
              <div className="addr-type"><i className="fa fa-book" />&nbsp; SECTION 3</div>
              <div className="form-group padding-5" style={{marginBottom: 3}}>
                
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  812 Cr/Dbt Adj
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  816 Organization Relationship
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  820 Remittance Notice
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  824 Application Advice
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  830 Planning ( Forecast )
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  832 Product/Price Catalog
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  846 Inventory Inquiry/Advice
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  850 Purchase Order ( Basic )
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  850 Purchase Order ( SDQ )
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  852 Product Activity
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  860 Purchase Order Change
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  861 Receiving Advice
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  864 Text Message
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  869 Order Status Inq.
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  754 Routing Instructions
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  215 Motor Carrier Pickyp Manifest
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  810 Invoice 
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  832 Product/Price Catalog
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  855 PO Acknowledgenment
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  856 Advise (Advanced) Ship Notice
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  865 Purchase Order Change Acknowledgenment
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  870 Order Status Resp.
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  713 Request for Routing
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  997 Functional Acknowledgenment
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  ASN Label, UCC-128 Label
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  Custom Packing List
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                   <label className="mt-checkbox" style={{ paddingRight : "20px", height: '25px' }}>
		                  Custom Carrier Shipping Label
		                  <input 
		                  	type="checkbox" 
		                  	value="yes" 
	                      checked={ false }
		                  />
		                  <span></span>
		                </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                   <label className="control-label">
                    	Others:
                    </label>
                    <div>
                    	<input 
                    		type="text" 
                    		className="form-control input-sm" 
                    	/>
                    </div>
                  </div>
                </div>

              </div>
            </div>
		      </div>
		    </div>
		  </div>
		</div>
  )
}

export default Content