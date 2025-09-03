import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Pagination = props => {
  const firstRun = useRef(true)
  const [inputValue, setInputValue] = useState('1')

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setInputValue(props.activePagination || '1')
    },
    [props.activePagination]
  )

  function handleSubmit (event) {
    event.preventDefault()
    let trimmedInputValue = inputValue.trim()
    if (trimmedInputValue.length){
      if (isNaN(inputValue)) {
        setInputValue(props.activePagination)
      } else {
        let inputValueNext = +trimmedInputValue
        let totalPaginations = Math.ceil(props.totalAddresses / props.page_size)
        if (inputValueNext <= 1) {
          inputValueNext = 1
        }
        if (inputValueNext >= totalPaginations) {
          inputValueNext = totalPaginations
        }
        if (inputValueNext !== props.activePagination) {
          props.paginate(inputValueNext)
        }
        setInputValue(inputValueNext)
      }
    }
  }

  let { 
    activePagination, 
    totalAddresses, 
    page_size, 
    paginate 
  } = props
  
  let totalPaginations = Math.ceil( totalAddresses / page_size )

  return (
    <div style={{height: 50, lineHeight: 3, padding:'0 5px'}}>
      <div className="pagination-panel">
        <button
          className="btn btn-sm"
          onClick={ event => paginate(1) }
          disabled={ activePagination === 1 }
        >
          <i className="fa fa-fast-backward"></i>
        </button>
        <span>{ ' ' }</span>
        <button
          onClick={ event => paginate( activePagination - 1 ) }
          disabled={ activePagination === 1 }
          className="btn btn-sm" style={{padding: '7px 18px 5px 18px' }}
        >
          <i className="fa fa-caret-left" style={{fontSize: '1.3em' }}></i>
        </button>
        <span>{ ' ' }</span>
        <form 
          onSubmit={ handleSubmit }
          style={{ display : 'inline' }}
          autoComplete="off"
        >
          <input 
            type="text"
            className="pagination-panel-input form-control input-sm input-inline input-mini pagination-input"
            value={inputValue}
            onChange={ event => {
              if (totalAddresses > 0) {
                setInputValue(event.target.value)
              }
            }} 
          />
        </form>
        <span>{ ' ' }</span>
        <button
          onClick={ event => paginate( activePagination + 1 ) }
          className="btn btn-sm"
          disabled={ activePagination >= totalPaginations }
          style={{padding: '7px 18px 5px 18px'}}
        >
          <i className="fa fa-caret-right" style={{ fontSize: '1.3em' }}></i>
        </button>
        <span>{ ' ' }</span>
        <button
          disabled={ activePagination >= totalPaginations }
          onClick={ event => paginate( totalPaginations ) }
          className="btn btn-sm">
          <i className="fa fa-fast-forward"></i>
        </button>
        <span>{ ' ' }</span>
        <span className="pagination-panel-total" style={{paddingLeft:10}}>
          <strong key="strong1">
            { totalAddresses }
          </strong>
          <span>{ ' ' }</span>
            { `contact${ +totalAddresses > 1 ? 's' : '' }` } on
          <span>{ ' ' }</span>
          <strong>
            { totalPaginations }
          </strong>
          <span>{ ' ' }</span>
          { `page${ +totalPaginations > 1 ? 's' : '' }` }
        </span>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  className: PropTypes.string,
  totalAddresses: PropTypes.any.isRequired,
  activePagination: PropTypes.any.isRequired,
  paginate: PropTypes.func.isRequired,
  page_size: PropTypes.any
}

Pagination.defaultProps = {
  totalAddresses: 0,
  page_size: 100
}

export default Pagination