import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

const Pagination = ({
  activePagination,
  page_size,
  paginate,
  totalDocuments = 0
}) => {
  const firstRun = useRef(true)
  const [inputValue, setInputValue] = useState('1')

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setInputValue(activePagination || '1')
    },
    [activePagination]
  )

  function handleSubmit (event) {
    event.preventDefault()
    let trimmedInputValue = inputValue.trim()
    if ( trimmedInputValue.length ) {
      if( isNaN(inputValue) ) {
        setInputValue(activePagination)
      } else {
        let inputValue = +trimmedInputValue
        let totalPaginations = Math.ceil(totalDocuments / page_size)
        if (inputValue <= 1) {
          inputValue = 1
        }
        if (inputValue >= totalPaginations) {
          inputValue = totalPaginations
        }
        if (inputValue !== activePagination) {
          paginate(inputValue)
        }
        setInputValue(inputValue)
      }
    }
  }

  let totalPaginations = Math.ceil(totalDocuments / page_size)
  return (
    <div style={{height: 50, lineHeight: 3, padding:'0 5px'}}>
      <div className="pagination-panel">
        <button
          className="btn btn-sm"
          onClick={ event => paginate(1) }
          disabled={ activePagination === 1 }>
          <i className="fa fa-fast-backward"></i>
        </button>
        <span>{ ' ' }</span>
        <button
          onClick={ event => paginate( activePagination - 1 ) }
          disabled={ activePagination === 1 }
          className="btn btn-sm" style={{padding: '7px 18px 5px 18px' }}>
          <i className="fa fa-caret-left" style={{fontSize: '1.3em' }}></i>
        </button>
        <span>{ ' ' }</span>
        <form onSubmit={handleSubmit} style={{ display : 'inline' }} autoComplete="off">
          <input type="text"
          className="pagination-panel-input form-control input-sm input-inline input-mini pagination-input"
          value={inputValue}
          onChange={ event => {
            if( totalDocuments > 0 ){
              setInputValue(event.target.value)
            }
          }} />
        </form>

        <span>{ ' ' }</span>
        <button
          onClick={ event => paginate( activePagination + 1 ) }
          className="btn btn-sm"
          disabled={ activePagination >= totalPaginations }
          style={{padding: '7px 18px 5px 18px'}}>
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
          <strong key="strong1">{ totalDocuments }</strong>
          <span>{ ' ' }</span>
            files on
          <span>{ ' ' }</span>
          <strong key="strong2">
            { totalPaginations }
          </strong>
          <span>{ ' ' }</span>
          pages
        </span>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  totalDocuments: PropTypes.any.isRequired,
  activePagination: PropTypes.any.isRequired,
  paginate: PropTypes.func.isRequired,
  page_size: PropTypes.any.isRequired
}

export default Pagination