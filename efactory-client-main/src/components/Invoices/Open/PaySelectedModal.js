import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import moment from 'moment'
import Tabs from '../../_Shared/Components/Tabs'
import ButtonLoading from '../../_Shared/Components/ButtonLoading'
import FormatNumber from '../../_Helpers/FormatNumber'

const years_ = getYears()

const PaySelectedModal = props => {
  const years = useRef(years_)

  function onTabClicked (tabType) {
    props.invoiceActions.setRootReduxStateProp({ field : 'activeTab', value : tabType })
  }

  function pay () {
    props.invoiceActions.paySelectedInvoices().then(
      isSuccess => {
        if( isSuccess ){
          global.$('#pay-selected').modal('hide')
        }
      }
    )
  }

  function onFieldInputChange (field, value) {
    let {
      activeTab,
      invoiceActions,
      payment
    } = props
    invoiceActions.setRootReduxStateProp({
      field : 'payment',
      value : {
        ...payment,
        [ activeTab ] : {
          ...payment[ activeTab ],
          [ field ] : value
        }
      }
    })
  }

  let {
    activeTab,
    checkedRows,
    paying,
    payment = {}
  } = props

  payment = payment[ activeTab ] || {}

  let totalAmountToPay = Object.values(checkedRows).reduce(
    ( prev, next ) => { return prev + +next },
    0
  )

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="pay-selected"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h3 className="modal-title">Enter Payment Information</h3>
          </div>
          <div className="modal-body" style={{paddingBottom:0}}>
            <div className="tabbable-line">
              <Tabs
                activeTab={activeTab}
                onTabClicked={ onTabClicked }
                tabs={
                  [{
                    type : 'check',
                    name : 'Pay by Check'
                  },{
                    type : 'cc',
                    name : 'Pay by Credit Card'
                  }]
                }
              />
              <div className="tab-content" style={{padding: "10px 0"}}>
                <div
                  className={ classNames({
                    'tab-pane' : true,
                    'active' : activeTab === 'cc'
                  }) }
                  id="credit_card"
                >
                  <div className="form-group">
                    <div className="row no-margin">
                      <div className="col-md-4" style={{paddingLeft: 0}}>
                        <img src="/src/styles/images/cc-list.png" alt="credit card list"/>
                      </div>
                      <div className="col-md-8" style={{paddingRight: 0, paddingLeft: 0}}>
                        <div className="row no-margin">
                          <div className="col-md-4" style={{paddingRight: 0}}>
                            <span className="invoice-summary text-right"style={{width: "100%", display: "inline-block"}}>AMOUNT TO PAY: </span><br/>
                            <span className="invoice-amount text-right" style={{backgroundColor: "black", color:"#ccc", width: "100%", display: "inline-block"}}>${ <FormatNumber number={totalAmountToPay}/> }</span>
                          </div>
                          <div className="col-md-4" style={{paddingRight: 0}}>
                            <span className="invoice-summary text-right"style={{width: "100%", display: "inline-block"}}>CC FEE: </span><br/>
                            <span className="invoice-amount text-right" style={{backgroundColor: "black", color:"#ccc", width: "100%", display: "inline-block"}}>${ <FormatNumber number={totalAmountToPay * 3.25 / 100}/> }</span>
                          </div>
                          <div className="col-md-4" style={{paddingRight: 0}}>
                            <span className="invoice-summary text-right"style={{width: "100%", display: "inline-block"}}>TOTAL CHARGE: </span><br/>
                            <span className="invoice-amount text-right" style={{backgroundColor: "black", color:"white", width: "100%", display: "inline-block"}}>${ <FormatNumber number={totalAmountToPay * (1 + 3.25 / 100) }/> }</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br/> 
                    <h5>The <span style={{fontWeight:600}}>TOTAL CHARGE</span> is the sum of the <span style={{fontWeight:600}}>Amount to Pay</span> you have chosen for the selected invoices plus CC fee.</h5>
                  </div>
                  <br/>
                  <form method="post" autoComplete="off">
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="first_name" className="invoice">First Name:</label>
                          <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            required="required"
                            value={ payment['first_name'] ? payment['first_name'] : '' }
                            onChange={ event => onFieldInputChange( 'first_name', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="last_name" className="invoice">Last Name:</label>
                          <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            required="required"
                            value={ payment['last_name'] ? payment['last_name'] : '' }
                            onChange={ event => onFieldInputChange( 'last_name', event.target.value ) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="address" className="invoice">Carholder Address:</label>
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            required="required"
                            value={ payment['address'] ? payment['address'] : '' }
                            onChange={ event => onFieldInputChange( 'address', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="postal_code" className="invoice">Carholder Zip Code:</label>
                          <input
                            type="text"
                            name="postal_code"
                            className="form-control"
                            required="required"
                            value={ payment['postal_code'] ? payment['postal_code'] : '' }
                            onChange={ event => onFieldInputChange( 'postal_code', event.target.value ) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="cc_number" className="invoice">Card number (no dashes or spaces):</label>
                          <input
                            type="text"
                            name="cc_number"
                            className="form-control"
                            required="required"
                            value={ payment['cc_number'] ? payment['cc_number'] : '' }
                            onChange={ event => onFieldInputChange( 'cc_number', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="exp_month" className="invoice">Expiration date</label>
                          <div className="row">
                            <div className="col-md-6">
                              <select
                                className="form-control col-md-3"
                                name="exp_month"
                                value={ payment['exp_month'] ? payment['exp_month'] : '' }
                                onChange={ event => onFieldInputChange( 'exp_month', event.target.value ) }
                              >
                                <option>01</option>
                                <option>02</option>
                                <option>03</option>
                                <option>04</option>
                                <option>05</option>
                                <option>06</option>
                                <option>07</option>
                                <option>08</option>
                                <option>09</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <select
                                className="form-control"
                                name="exp_year"
                                value={ payment['exp_year'] ? payment['exp_year'] : '' }
                                onChange={ event => onFieldInputChange( 'exp_year', event.target.value ) }
                              >
                                {
                                  years.current.map(function(year) {
                                    return (
                                      <option key={year} value={year.substring(2,4)}>{year}</option>
                                    )
                                  })
                                }
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvscode" className="invoice">
                        Security code (3 on back, AMEX: 4 on front)
                      </label>
                      <div className="row">
                        <div className="col-md-3">
                          <input
                            type="number"
                            name="cvscode"
                            className="form-control cvs-width"
                            required="required"
                            value={ payment['csc'] ? payment['csc'] : '' }
                            onChange={ event => onFieldInputChange( 'csc', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-3">
                          <img className="lt-left" src="/src/styles/images/cc-back.png" alt="security code"/>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="comments" className="invoice">
                            <i className="fa fa-commenting-o"></i> Comment for DCL Accounting (optional):
                          </label>
                          <textarea
                            type="text"
                            name="comments"
                            className="form-control input-sm"
                            value={ payment['comments'] ? payment['comments'] : '' }
                            onChange={ event => onFieldInputChange( 'comments', event.target.value ) }
                            rows="4"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div
                  className={ classNames({
                    'tab-pane' : true,
                    'active' : activeTab === 'check'
                  }) }
                  id="check"
                >
                  <div className="form-group">
                    <div className="row no-margin">
                      <div className="col-md-4" style={{paddingLeft: 0}}>
                        <img src="/src/styles/images/check.jpg" alt="check"/>
                      </div>
                      <div className="col-md-8" style={{paddingRight: 0, paddingLeft: 0}}>
                        <div className="row no-margin">
                          <div className="col-md-4" style={{paddingRight: 0}}>
                          </div>
                          <div className="col-md-4" style={{paddingRight: 0}}>
                          </div>
                          <div className="col-md-4" style={{paddingRight: 0}}>
                            <span className="invoice-summary text-right"style={{width: "100%", display: "inline-block"}}>
                              TOTAL CHARGE:
                            </span>
                            <br/>
                            <span className="invoice-amount text-right" style={{backgroundColor: "black", color:"white", width: "100%", display: "inline-block"}}>
                              ${ <FormatNumber number={totalAmountToPay}/> }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br/>
                    <h5>The <span style={{fontWeight:600}}>TOTAL CHARGE</span> is the sum of the <span style={{fontWeight:600}}>Amount to Pay</span> you have chosen for the selected invoices.</h5>
                  </div>
                  <br/>
                  <form method="post" autoComplete="off">
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="first_name" className="invoice">First Name:</label>
                          <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            required="required"
                            value={ payment['first_name'] ? payment['first_name'] : '' }
                            onChange={ event => onFieldInputChange( 'first_name', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="last_name" className="invoice">Last Name:</label>
                          <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            required="required"
                            value={ payment['last_name'] ? payment['last_name'] : '' }
                            onChange={ event => onFieldInputChange( 'last_name', event.target.value ) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="address" className="invoice">Billing Address:</label>
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            required="required"
                            value={ payment['address'] ? payment['address'] : '' }
                            onChange={ event => onFieldInputChange( 'address', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="postal_code" className="invoice">Zip Code:</label>
                          <input
                            type="text"
                            name="postal_code"
                            className="form-control"
                            required="required"
                            value={ payment['postal_code'] ? payment['postal_code'] : '' }
                            onChange={ event => onFieldInputChange( 'postal_code', event.target.value ) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="account" className="invoice">Account Type:</label>
                          <select
                            className="form-control"
                            name="acctype"
                            required="required"
                            value={ payment['account_type'] ? payment['account_type'] : '' }
                            onChange={ event => onFieldInputChange( 'account_type', event.target.value ) }
                          >
                            <option value="0">Personal</option>
                            <option value="1">Business</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="postal_code" className="invoice">Company Name:</label>
                          <input
                            type="text"
                            name="company"
                            className="form-control"
                            required="required"
                            value={ payment['company'] ? payment['company'] : '' }
                            onChange={ event => onFieldInputChange( 'company', event.target.value ) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="account" className="invoice">Account Number (no dashes or spaces):</label>
                          <input
                            type="text"
                            name="account"
                            className="form-control"
                            required="required"
                            value={ payment['account_number'] ? payment['account_number'] : '' }
                            onChange={ event => onFieldInputChange( 'account_number', event.target.value ) }
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="routing" className="invoice">Routing Number / Transit Number:</label>
                          <input
                            type="text"
                            name="routing"
                            className="form-control"
                            required="required"
                            value={ payment['routing_number'] ? payment['routing_number'] : '' }
                            onChange={ event => onFieldInputChange( 'routing_number', event.target.value ) }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="comments" className="invoice"><i className="fa fa-commenting-o"></i> Comment for DCL Accounting (optional):</label>
                          <textarea
                            type="text"
                            name="comments"
                            className="form-control input-sm"
                            value={ payment['comments'] ? payment['comments'] : '' }
                            onChange={ event => onFieldInputChange( 'comments', event.target.value ) }
                            rows="4"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{paddingTop:0}}>
            <button type="button" className="btn dark btn-outline" data-dismiss="modal">Cancel</button>&nbsp;
            <ButtonLoading
              className="btn green-soft"
              type="button"
              handleClick={ event => pay() }
              name={'PAY'}
              loading={paying}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function getYears() {
  let years = []
  let year = moment()
  for (let i = 0; i < 10; i++) {
    years.push(year.format('YYYY'))
    year = year.add(1, 'years')
  }
  return years
}

PaySelectedModal.propTypes = {
  invoiceActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    activeTab : state.invoices.open.activeTab,
    checkedRows : state.invoices.open.checkedRows,
    invoices : state.invoices.open.invoices,
    paying : state.invoices.open.paying,
    payment : state.invoices.open.payment
  })
)(PaySelectedModal)