import React from 'react'

const SummarySegmentE = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse" data-original-title="" title=""> </a>
        </div>
        <div className="caption font-yellow-gold bold uppercase"> Custom Fields</div>
      </div>
      <div className="portlet-body">
        <div className="row">
          <div className="col-md-5 seg-label">Custom Field 1:</div>
          <div className="col-md-7">{ detail.custom_field1 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Custom Field 2:</div>
          <div className="col-md-7">{ detail.custom_field2 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Custom Field 3:</div>
          <div className="col-md-7">{ detail.custom_field3 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Custom Field 4:</div>
          <div className="col-md-7">{ detail.custom_field4 }</div>
        </div>
        <div className="row">
          <div className="col-md-5 seg-label">Custom Field 5:</div>
          <div className="col-md-7">{ detail.custom_field5 }</div>
        </div>
      </div>
    </div>
  )
}

export default SummarySegmentE