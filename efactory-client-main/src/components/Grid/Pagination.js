import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatNumber } from './../_Helpers/FormatNumber'

const TablePagination = ({
  activePagination,
  className,
  paginate,
  paginationWord,
  totalPages,
  totalRows,
}) => {
  const firstRun = useRef(true)
  const [inputValue, setInputValue] = useState(activePagination)

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setInputValue(activePagination || '')
      if (totalRows && activePagination && inputValue === '') {
        setInputValue(activePagination || '')
      }
    },
    [activePagination]
  )

  function handleSubmit (event) {
    event.preventDefault()
    let trimmedInputValue = inputValue.toString().trim()
    if (trimmedInputValue.length) {
      if (isNaN(inputValue)) {
        setInputValue(activePagination)
      } else {
        let inputValueNext = +trimmedInputValue
        if (inputValueNext <= 1) {
          inputValueNext = 1
        }
        if (inputValueNext >= totalPages) {
          inputValueNext = totalPages
        }
        if (inputValueNext !== activePagination) {
          paginate( inputValueNext )
        }
        setInputValue(inputValueNext)
      }
    }
  }

  return (
    <div className={className}>
      <div className="pagination-panel">
        <form onSubmit={handleSubmit} autoComplete="off">
          <a
            className="btn btn-sm default btn-double-backward"
            disabled={activePagination <= 1 }
            onClick={ ()=>{
              if ( activePagination > 1 ) {
                paginate(1)
              }
            }}
          >
            <i className="fa fa-fast-backward"></i>
          </a>
          <a
            className="btn btn-sm default prev"
            disabled={activePagination <= 1 }
            onClick={(e)=>{
               if (activePagination > 1) {
                paginate( activePagination - 1 )
               }
            }}
          >
            <i className="fa fa-angle-left"></i>
          </a>
          <input
            type="text"
            value={inputValue}
            onChange={ event =>{
              if ( totalRows > 0 ) {
                setInputValue(event.target.value)
              }
            }}
            className="pagination-panel-input form-control input-sm input-inline input-mini pagination-input"
          />
          <a className="btn btn-sm default next"
            disabled={activePagination >= totalPages }
            onClick={(e)=>{
              e.preventDefault()
              if (activePagination < totalPages) {
                paginate( activePagination + 1 )
              }
            }}
            >
            <i className="fa fa-angle-right"></i>
          </a>
          <a
            className="btn btn-sm default btn-double-forward"
            disabled={activePagination >= totalPages }
            onClick={()=>{
              if (activePagination < totalPages) {
                paginate( totalPages )
              }
            }}
          >
            <i className="fa fa-fast-forward"></i>
          </a>
          <span className="pagination-panel-total"
          style={{paddingLeft:"10px" }}
          >
          <span>
          <strong>
          { (totalRows && formatNumber(totalRows, 0)) || 0}
          </strong>
          </span>
          <span> { paginationWord } on </span>
          <span>
            <strong>
              { totalPages || 0}
            </strong>
          </span>
            <span>page{totalPages === 1 ? "" : "s"}</span>
          </span>
        </form>
      </div>
    </div>
  )
}

TablePagination.propTypes = {
  className: PropTypes.string,
  totalRows: PropTypes.any,
  paginate: PropTypes.func.isRequired,
  activePagination: PropTypes.any,
  totalPages: PropTypes.any,
  paginationWord: PropTypes.string
}

export default TablePagination