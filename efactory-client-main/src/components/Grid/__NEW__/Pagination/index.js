import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const TablePagination = ({
  activePagination,
  className,
  detailOpen,
  onToggleButtonClicked,
  paginate,
  paginationWord,
  rowDetailHidden,
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
        if(inputValueNext <= 1) inputValueNext = 1
        if(inputValueNext >= totalPages) inputValueNext = totalPages
        if(inputValueNext !== activePagination) paginate( inputValueNext )
        setInputValue(inputValueNext)
      }
    }
  }

  return (
    <div className={ className } style={{ position : 'relative' }}>
      <div className="pagination-panel">
        <form onSubmit={handleSubmit} autoComplete="off">
            <a
              className="btn btn-sm default btn-double-backward"
              disabled={activePagination <= 1 }
              onClick={ ()=>{
                if( activePagination > 1 ) paginate(1)
              }}
            >
              <i className="fa fa-fast-backward"></i>
            </a>
            &nbsp;
            <a
              className="btn btn-sm default prev"
              disabled={activePagination <= 1 }
              onClick={(e)=>{
                 if(activePagination > 1) paginate( activePagination - 1 )
              }}
            >
              <i className="fa fa-angle-left"></i>
            </a>
            &nbsp;
            <input
              type="text"
              value={inputValue}
              onChange={ event =>{
                if (totalRows > 0) {
                  setInputValue(event.target.value)
                }
              }}
              className="pagination-panel-input form-control input-sm input-inline input-mini pagination-input"
            />
            &nbsp;
            <a 
              className="btn btn-sm default next"
              disabled={activePagination >= totalPages }
              onClick={(e)=>{
                e.preventDefault()
                if (activePagination < totalPages) paginate( activePagination + 1 )
              }}
              >
              <i className="fa fa-angle-right"></i>
            </a>
            &nbsp;
            <a
              className="btn btn-sm default btn-double-forward"
              disabled={activePagination >= totalPages }
              onClick={()=>{
                if (activePagination < totalPages) paginate( totalPages )
              }}
            >
              <i className="fa fa-fast-forward"></i>
            </a>
          <span
            className="pagination-panel-total"
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
        {
          !rowDetailHidden && 
          <div 
            className="rd-toggler-button"
            style={{
              position: 'absolute',
              right: '16px',
              top: '6px',
              fontSize: '23px',
              cursor: 'pointer'
            }}
            onClick={ onToggleButtonClicked }
          >
            <button 
              className="btn btn-topbar btn-xs"
              style={{ marginRight: '5px', padding: '3px 15px' }}
            >
              <i 
                className={ classNames({
                  'fa' : true,
                  'fa-long-arrow-down' : detailOpen,
                  'fa-long-arrow-up' : !detailOpen,
                }) }
                aria-hidden="true"
              />
              &nbsp;
              { detailOpen ? 'Close ' : 'Open ' } DETAIL PANEL
            </button>
          </div>
        }
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