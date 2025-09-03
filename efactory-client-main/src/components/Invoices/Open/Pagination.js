import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Pagination = props => {
  const firstRun = useRef(true)
  const [paginationInputValue, setPaginationInputValue] = useState(1)

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (paginationInputValue !== props.page_num) {
        setPaginationInputValue(props.page_num)
      }
    },
    [props.page_num]
  )

  function paginate (page_num = '') {
    let {
      invoiceActions,
      page_size, 
      total
    } = props
    let maxNumberOfPages = Math.floor( +total / +page_size ) + 1
    let paginationInputValue = page_num ? +page_num : +paginationInputValue
    paginationInputValue = paginationInputValue < 1 ? 1 : paginationInputValue
    paginationInputValue = paginationInputValue > maxNumberOfPages ? maxNumberOfPages : paginationInputValue
    if( paginationInputValue !== +props.page_num ){
      return invoiceActions.setRootReduxStateProp({
        field : 'page_num',
        value : +paginationInputValue
      }).then( () => {
        invoiceActions.listInvoices()
      } )
    }
    setPaginationInputValue(paginationInputValue)
  }

  let { page_num, page_size, total } = props
  let maxNumberOfPages = Math.floor( +total / +page_size ) + 1
  page_num = +page_num
  return (
    <div style={{height: 50, lineHeight: 3, padding:'0 5px'}}>
      <div className="pagination-panel">
        <button
          className="btn btn-sm"
          onClick={ event => paginate(1) }
          disabled={ page_num === 1 }>
          <i className="fa fa-fast-backward"></i>
        </button>
        <span>{' '}</span>
        <button
          onClick={ event => paginate( page_num - 1 ) }
          disabled={ page_num === 1 }
          className="btn btn-sm"
          style={{padding: '7px 18px 5px 18px' }}
        >
          <i className="fa fa-caret-left" style={{fontSize: '1.3em' }} />
        </button>
        <span>{' '}</span>
        <form 
          onSubmit={ event => {
            event.preventDefault()
            paginate()
          }}
          style={{ display : 'inline' }} 
          autoComplete="off"
        >
          <input 
            type="text"
            className="pagination-panel-input form-control input-sm input-inline input-mini pagination-input"
            value={ paginationInputValue ? paginationInputValue : '' }
            onChange={ event => {
              let value = event.target.value.trim()
              if( !isNaN(value) ){
                setPaginationInputValue(value)
              }
            }}
          />
        </form>
        <span>{' '}</span>
        <button
          onClick={ event => paginate( page_num + 1 ) }
          className="btn btn-sm"
          disabled={ page_num >= maxNumberOfPages }
          style={{padding: '7px 18px 5px 18px'}}>
          <i className="fa fa-caret-right" style={{ fontSize: '1.3em' }}></i>
        </button>
        <span>{' '}</span>
        <button
          disabled={ page_num >= maxNumberOfPages }
          onClick={ event => paginate( maxNumberOfPages ) }
          className="btn btn-sm">
          <i className="fa fa-fast-forward"></i>
        </button>
        <span>{' '}</span>
        <span className="pagination-panel-total" style={{paddingLeft:10}}>
          <strong key="strong1">{ total }</strong>
          <span>{' '}</span>
            invoices on
          <span>{' '}</span>
          <strong key="strong2">
            { maxNumberOfPages }
          </strong>
          <span>{' '}</span>
          { +maxNumberOfPages > 1 ? 'pages' : 'page' } 
        </span>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  invoiceActions: PropTypes.object.isRequired,
  page_num: PropTypes.any,
  page_size: PropTypes.any,
  total: PropTypes.any
}

export default connect(
  state => ({
    page_num : state.invoices.open.page_num,
    page_size : state.invoices.open.page_size,
    total : state.invoices.open.total
  })
)(Pagination)