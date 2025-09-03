import React from 'react'

const ContentBar = ({ fulfillmentActions }) => {
  return (
    <div className="portlet-title tabbable-line">
      <div className="caption caption-md">
        <i className="icon-bar-chart font-yellow-gold"></i>
        <span className="caption-subject font-yellow-gold bold uppercase">
          30 Days RMA Activity
        </span>
      </div>
      <div className="actions">
        <a
          className="btn btn-circle btn-icon-only btn-dashboard"
          onClick={
            event => {
              event.preventDefault()
              fulfillmentActions.getLast30DaysRMAsAsync({ animation_visible : true })
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
