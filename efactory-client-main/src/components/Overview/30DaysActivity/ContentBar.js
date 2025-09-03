import React from 'react'

const ContentBar = ({ fulfillmentActions }) => {
  return (
    <div className="portlet-title tabbable-line">
      <div className="caption caption-md">
        <i className="icon-bar-chart font-green-seagreen"></i>
        <span className="caption-subject font-green-seagreen bold uppercase">
          30 Days Activity
        </span>
      </div>
      <div className="actions">
        <a 
          className="btn btn-circle btn-icon-only btn-dashboard" 
          onClick={
            event => {
              event.preventDefault()
              fulfillmentActions.getFulfillment30DaysAsync({ animation_visible : true })
            }
          }
        >
         <i className="icon-reload"></i>
        </a>
      </div>
    </div>
  )
}

export default ContentBar 
