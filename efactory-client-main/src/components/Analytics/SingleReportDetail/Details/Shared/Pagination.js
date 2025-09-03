import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const Pagination = ({
  activePagination,
  number_of_items,
  page_size,
  paginate
}) => {
  const isFirstRun = useRef(true)
  const [inputValue, setInputValue] = useState('1')
  useEffect (
    () => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      setInputValue(activePagination || '1')
    },
    [activePagination]
  )

  function handleSubmit (event) {
    event.preventDefault()
    let trimmedInputValue = inputValue.trim()
    if(trimmedInputValue.length){
      if( isNaN(inputValue) ) {
        setInputValue(activePagination)
      } else {
        let inputValueNext = +trimmedInputValue;
        let totalPaginations = Math.ceil(number_of_items / page_size)
        if(inputValueNext <= 1) {
          inputValueNext = 1
        }
        if(inputValueNext >= totalPaginations) {
          inputValueNext = totalPaginations
        }
        if(inputValueNext !== activePagination) {
          paginate(inputValueNext)
        }
        setInputValue(inputValueNext)
      }
    }
  }

  let totalPaginations = Math.ceil( number_of_items / page_size )

  return (

    <div 
      className="pagination-panel-wrapper"
      style={{
        height: 50, 
        lineHeight: 3, 
        padding:'0 5px',
        width: '100%',
        position : 'absolute',
        bottom : '0'
      }}>
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
              if( number_of_items > 0 ){
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
            { number_of_items }
          </strong>
          <span>{ ' ' }</span>
            { `order${ +number_of_items > 1 ? 's' : '' }` } on
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
  activePagination : PropTypes.any.isRequired,
  paginate : PropTypes.func.isRequired,
  page_size : PropTypes.any,
  number_of_items : PropTypes.any
}

export default Pagination