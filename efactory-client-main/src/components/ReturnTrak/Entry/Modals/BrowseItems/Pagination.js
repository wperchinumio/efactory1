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
      setInputValue(props.currentPagination || '1')
    },
    [props.currentPagination]
  )

  function handleSubmit (event) {
    event.preventDefault()
    let trimmedInputValue = inputValue.trim()
    if (trimmedInputValue.length) {
      if (isNaN( inputValue )) {
        setInputValue(props.currentPagination)
      } else {
        let inputValueNext = +trimmedInputValue
        let totalPages = Math.ceil( props.totalItems / 100 ) // 100 is page size
        if (inputValueNext <= 1 ) {
          inputValueNext = 1
        }
        if (inputValueNext >= totalPages ) {
          inputValueNext = totalPages
        }
        if (inputValueNext !== props.currentPagination ) {
          props.paginate(inputValueNext)
        }
        setInputValue(inputValueNext)
      }
    }
  }

  let { currentPagination, totalItems, paginate } = props
  let totalPages = Math.ceil( totalItems / 100 ) // 100 is page size
  return (
    <div style={{height: 50, lineHeight: 3, padding:'0 5px'}}>
      <div className="pagination-panel">
        <button
          className="btn btn-sm"
          onClick={ event => paginate(1) }
          disabled={ currentPagination === 1 }>
          <i className="fa fa-fast-backward"></i>
        </button>
        <span>{ ' ' }</span>
        <button
          onClick={ event => paginate( currentPagination - 1 ) }
          disabled={ currentPagination === 1 }
          className="btn btn-sm" style={{padding: '7px 18px 5px 18px' }}>
          <i className="fa fa-caret-left" style={{fontSize: '1.3em' }}></i>
        </button>
        <span>{ ' ' }</span>
        <form 
          onSubmit={ event => handleSubmit(event)  } 
          style={{ display : 'inline' }} autoComplete="off"
        >
          <input type="text"
          className="pagination-panel-input form-control input-sm input-inline input-mini pagination-input"
          value={inputValue}
          onChange={ event => {
            if (props.totalItems > 0) {
              setInputValue(event.target.value)
            }
          }} />
        </form>
        <span>{ ' ' }</span>
        <button
          onClick={ event => paginate( currentPagination + 1 ) }
          className="btn btn-sm"
          disabled={ currentPagination >= totalPages }
          style={{padding: '7px 18px 5px 18px'}}>
          <i className="fa fa-caret-right" style={{ fontSize: '1.3em' }}></i>
        </button>
        <span>{ ' ' }</span>
        <button
          disabled={ currentPagination >= totalPages }
          onClick={ event => paginate( totalPages ) }
          className="btn btn-sm">
          <i className="fa fa-fast-forward"></i>
        </button>
        <span>{ ' ' }</span>
        <span className="pagination-panel-total" style={{paddingLeft:10}}>
          <strong key="strong1">{ totalItems }</strong>
          <span>{ ' ' }</span>
            items on
          <span>{ ' ' }</span>
          <strong key="strong2">
            { totalPages }
          </strong>
          <span>{ ' ' }</span>
          pages
        </span>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  totalItems: PropTypes.any.isRequired,
  currentPagination: PropTypes.any.isRequired,
  paginate: PropTypes.func.isRequired
}

export default Pagination