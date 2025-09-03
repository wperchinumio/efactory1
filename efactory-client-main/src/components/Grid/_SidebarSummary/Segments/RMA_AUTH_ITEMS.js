import React from 'react'

const SummarySegmentRMAAUTHITEMS = ({
  detail
}) => {
  return (
    <div>
      {
        detail.line_number &&     
        <div className="portlet light order-summary">
          <div className="portlet-title">
            <div className="tools pull-left">
              <a  className="collapse" />
            </div>
            <div className="caption font-yellow-gold bold uppercase">
              Authorized Item
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-md-5 seg-label">Line #:</div>
              <div className="col-md-7">{ detail.line_number }</div>
            </div>          
            <div className="row">
              <div className="col-md-5 seg-label">Item #:</div>
              <div className="col-md-7">{ detail.item_number }</div>
            </div>
            <div className="row">
              <div className="col-md-5 seg-label">Description:</div>
              <div className="col-md-7">{ detail.description }</div>
            </div>
            <div className="row">
              <div className="col-md-5 seg-label">QTY:</div>
              <div className="col-md-7">{ detail.qty_authorized }</div>
            </div>
            <div className="row">
              <div className="col-md-5 seg-label">Serial #:</div>
              <div className="col-md-7"> { detail.authorized_sn } </div>
            </div>
          </div>
        </div>      
      }
    </div>
  )
}

export default SummarySegmentRMAAUTHITEMS