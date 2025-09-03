import React from 'react'

const SummarySegmentRMACFS = ({
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
        {
          detail.cf1_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf1_name }:</div>
            <div className="col-md-6">{ detail.cf1 }</div>
          </div>
        }
        {
          detail.cf2_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf2_name }:</div>
            <div className="col-md-6">{ detail.cf2 }</div>
          </div>
        }
        {
          detail.cf3_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf3_name }:</div>
            <div className="col-md-6">{ detail.cf3 }</div>
          </div>
        }
        {
          detail.cf4_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf4_name }:</div>
            <div className="col-md-6">{ detail.cf4 }</div>
          </div>
        }
        {
          detail.cf5_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf5_name }:</div>
            <div className="col-md-6">{ detail.cf5 }</div>
          </div>
        }
        {
          detail.cf6_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf6_name }:</div>
            <div className="col-md-6">{ detail.cf6 }</div>
          </div>
        }
        {
          detail.cf7_name &&
          <div className="row">
            <div className="col-md-6 seg-label">{ detail.cf7_name }:</div>
            <div className="col-md-6">{ detail.cf7 }</div>
          </div>     
        }
      </div>
    </div>
  )
}

export default SummarySegmentRMACFS