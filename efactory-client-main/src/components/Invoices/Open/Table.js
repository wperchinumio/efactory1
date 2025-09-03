import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import FormatNumber from '../../_Helpers/FormatNumber'
import { formatDate } from '../../_Helpers/FormatDate'
import QuickEdit from '../../_Shared/Components/QuickEdit'

const DocumentTableBody = props => {
  function onCheckboxChange (id, value, amount_to_pay) {
    if (value) {
      return updateCheckedRowAmountToPay(id, amount_to_pay)
    }
    removeFromCheckedRows(id)
  }

  function updateCheckedRowAmountToPay (id, amount_to_pay) {
    let checkedRows = { ...props.checkedRows }
    checkedRows[ id ] = amount_to_pay
    setCheckedRows(checkedRows)
  }

  function setCheckedRows (checkedRows) {
    props.invoiceActions.setRootReduxStateProp({ field : 'checkedRows', value : checkedRows })
  }

  function removeFromCheckedRows (id) {
    let checkedRows = { ...props.checkedRows }
    if (!checkedRows[ id ]) {
      console.error(
        `removeFromCheckedRows received an id to remove from checkedRows `+
        `but can not find invoice with the id <${id}> on checkedRows`
      )
    }
    delete checkedRows[id]
    setCheckedRows( checkedRows )
  }

  function toggleAllChecked (value) {
    if (value) {
      checkAllNotPendingRows()
    } else {
      setCheckedRows({})
    }
  }

  function checkAllNotPendingRows () {
    let { checkedRows, invoices } = props
    checkedRows = {...checkedRows}
    invoices.forEach(
      invoice => {
        if (!invoice.pending && checkedRows[ invoice.id ] === undefined) {
          checkedRows[invoice.id] = invoice.amount_to_pay || '0.00'
        }
      }
    )
    setCheckedRows(checkedRows)
  }

  function onAmountToPayInputChange (id, value) {
    value = (+value).toFixed(2)
    updateCheckedRowAmountToPay(id, value)
  }

  function setSortValue ({field, value}) {
    let { setRootReduxStateProp, listInvoices } = props.invoiceActions
    setRootReduxStateProp({
      field: 'sort',
      value: [{ [field]: value }]
    }).then( 
      () => listInvoices()
    )
  }

  function download (id) {
    props.invoiceActions.downloadDocument(id)
  }

  let {
    checkedRows = {},
    invoices = [],
    total_gross_amount = '',
    total_open_amount = '',
    sort = []
  } = props

  let allChecked = invoices.filter(i => !i.pending).length && Object.keys( checkedRows ).length === invoices.filter(i => !i.pending).length

  return (
    <div className="portlet-body">
      <div className="table-responsive">
        <table className="table table-striped table-hover order-column table-clickable invoicing-table">
          <thead>
            <tr className="uppercase table-header-1">
              <th className="invoice" style={{width: "40px"}}>
                <label className="mt-checkbox mt-checkbox-outline">
                  <input
                    type="checkbox"
                    checked={ allChecked }
                    onChange={ event => toggleAllChecked( !allChecked ) }/>
                    <span></span>
                </label>
              </th>
              <th className="invoice text-right" style={{width: "50px"}} >
                #
              </th>
              <th className="invoice" style={{width: "50px", minWidth: '50px' }} >
                &nbsp;
              </th>
              <th className="invoice" style={{width: "75px"}}> Cust. # </th>
              <th className="invoice"  style={{width: "130px", minWidth: "130px"}}>
                <SortableThContent
                  field='doc_no'
                  isDesc={ sort[0]['doc_no'] === 'desc' }
                  isSorted={ sort[0]['doc_no'] ? true : false }
                  title={'Doc #'}
                  setSortValue={setSortValue}
                />
              </th>
              <th className="invoice" > Doc Type </th>
              <th className="invoice text-right"  style={{width: "100px"}}> Gross<br/>Amount </th>
              <th className="invoice text-right"  style={{width: "100px"}}> Open<br/>Amount </th>
              <th className="invoice text-right"  style={{width: "100px"}}> Amount<br/>To Pay </th>
              <th className="invoice text-center" style={{width: "130px"}}>
                <SortableThContent
                  field='invoice_date'
                  isDesc={ sort[0]['invoice_date'] === 'desc' }
                  isSorted={ sort[0]['invoice_date'] ? true : false }
                  title={'Invoice Date'}
                  setSortValue={setSortValue}
                />
              </th>
              <th className="invoice text-center" style={{width: "130px"}}> Due Date </th>
              <th className="invoice text-right"  style={{width: "80px"}}> Days<br/>Past Due </th>
              <th className="invoice" >
                <SortableThContent
                  field='reference'
                  isDesc={ sort[0]['reference'] === 'desc' }
                  isSorted={ sort[0]['reference'] ? true : false }
                  title={'Ref.'}
                  setSortValue={setSortValue}
                />
              </th>
              <th className="invoice" >
                <SortableThContent
                  field='po_number'
                  isDesc={ sort[0]['po_number'] === 'desc' }
                  isSorted={ sort[0]['po_number'] ? true : false }
                  title={'PO #'}
                  setSortValue={setSortValue}
                />
              </th>
              <th className="invoice" >
                <SortableThContent
                  field='remark'
                  isDesc={ sort[0]['remark'] === 'desc' }
                  isSorted={ sort[0]['remark'] ? true : false }
                  title={'Remark'}
                  setSortValue={setSortValue}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            { 
              invoices.map( (item, index) => {
              let {
                amount_to_pay = '',
                cust_no = '',
                days_past_due = '',
                doc_no = '',
                doc_type = '',
                due_date = '',
                gross_amount = '',
                id = '',
                invoice_date = '',
                open_amount = '',
                pending,
                reference = '',
                po_number = '',
                remark = '',
                pay_item = '',
                url_invoice = '',
                url_invoice_detail = ''
              } = item
              amount_to_pay = (+amount_to_pay).toFixed(2)
              let itemChecked = checkedRows[ id ] ? true : false
              return (
                <tr
                  className={ classNames({
                    'pending' : pending,
                    'odd gradeX clickable-row invoice' : true
                  }) }
                  key={`invoice-open-${index}`}>
                  <td>
                    <label className="mt-checkbox mt-checkbox-outline">
                      <input
                        type="checkbox"
                        checked={ itemChecked }
                        onChange={ event => {
                          if (!pending) {
                            onCheckboxChange( id, event.target.checked, amount_to_pay )
                          }
                        }}
                      />
                      <span></span>
                    </label>
                  </td>
                  <td className="text-right">{ index + 1 }</td>
                  <td>
                  {
                    url_invoice &&
                      <span>
                        <a
                          onClick={ event => {
                            if (url_invoice) {
                              download(`${doc_no}I`)
                            }
                          } } title="Invoice (PDF format)"
                        ><i className="clickable-link fa fa-file-pdf-o font-red-soft"></i>
                        </a>
                        <a className="pull-right"
                          onClick={ event => {
                            if (url_invoice_detail) {
                              download(`${doc_no}D`)
                            }
                          } } title="Invoice Detail (Excel format)"
                        ><i className="clickable-link fa fa-file-excel-o font-green-jungle"></i>
                        </a>
                      </span>

                  }
                  </td>
                  <td>{ cust_no }</td>
                  <td>
                    <span className="text-primary bold">{ doc_no }
                      {
                        pay_item !== '001' &&
                        <span style={{fontSize: "11px",color: "#999"}}> / { pay_item }</span>
                      }
                    </span>
                  </td>
                  <td>{ doc_type }</td>
                  <td className="text-right bold">
                      <FormatNumber number={gross_amount} decimals="2" />
                  </td>
                  <td className="text-right bold">
                    <FormatNumber number={open_amount}/>
                  </td>
                  <td className="text-right">
                    {
                      itemChecked &&
                      <QuickEdit
                        onSave={ value => onAmountToPayInputChange(id,value) }
                        value={ (+checkedRows[id]).toFixed(2) }
                        isRightAligned={true}
                        validations={['required','number']}
                        title={'Amount to Pay'}
                      />
                    }
                  </td>
                  <td className="text-center">
                    { formatDate(invoice_date, true) }
                  </td>
                  <td className="text-center">{ due_date }</td>
                  <td className="text-right font-red-soft sbold">{ days_past_due }</td>
                  <td>{ reference }</td>
                  <td>{ po_number }</td>
                  <td>{ remark }</td>
                </tr>
              )
            }
          )}

          {
            invoices.length > 0 &&
            <tr className="summary">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td className="text-right">
                <FormatNumber number={total_gross_amount}/>
              </td>
              <td className="text-right">
                <FormatNumber number={total_open_amount}/>
              </td>
              <td className="text-right">
                {
                  Object.values(checkedRows).length > 0 &&
                  <FormatNumber
                    number={ Object.values(checkedRows).reduce(
                      ( prev, next ) => { return prev + +next },
                      0
                    ) }
                  />
                }
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortableThContent ({
  field,
  isDesc = false,
  isSorted = false,
  title,
  setSortValue
}) {
  return (
    <span>
      <span className="column-sort">
        <i
          className={ classNames({
            'fa fa-long-arrow-down' : true,
            'active' : isSorted,
            'asc' : isSorted && !isDesc
          }) }
          aria-hidden="true"
        ></i>
      </span>
      <a
        className="font-grey-salt"
        onClick={ () => setSortValue({
          field,
          value : isSorted ? ( isDesc ? 'asc' : 'desc' ) : 'desc'
        }) }
      >
        { title }
      </a>
    </span>
  )
}

export default connect(
  state => ({
    checkedRows : state.invoices.open.checkedRows,
    invoices : state.invoices.open.invoices,
    sort : state.invoices.open.sort,
    total : state.invoices.open.total,
    total_gross_amount : state.invoices.open.total_gross_amount,
    total_open_amount : state.invoices.open.total_open_amount
  })
)(DocumentTableBody)