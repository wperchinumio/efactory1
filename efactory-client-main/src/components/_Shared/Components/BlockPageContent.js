import React from 'react'

const TableBlockUi = ({ 
  debugId,
  hideLoadingAnimation,
  loading,
  styleForLoadingMessage,
}) => {
  return (
    <div 
      className="block-page-content-wrapper"
      style={{ display : loading ? "flex" : "none" }}
    >
      {
        !hideLoadingAnimation &&
        <div className="loading-message " style={ styleForLoadingMessage || {} }>
          <div className="block-spinner-bar">
            <div className="bounce1" />
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        </div>
      }
    </div>
  )
} 

export default TableBlockUi