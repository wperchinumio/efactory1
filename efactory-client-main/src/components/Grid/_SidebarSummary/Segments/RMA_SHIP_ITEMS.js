import React from 'react'

const SummarySegmentRMAAUTHITEMS = ({
  detail
}) => {
  return (
    <div>
      {
        detail.s_line_number &&     
          <div className="portlet light order-summary">
          <div className="portlet-title">
            <div className="tools pull-left">
              <a  className="collapse" data-original-title="" title=""> </a>
            </div>
            <div className="caption font-yellow-gold bold uppercase"> To-Ship Item</div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-md-5 seg-label">Line #:</div>
              <div className="col-md-7">{ detail.s_line_number }</div>
            </div>          
            <div className="row">
              <div className="col-md-5 seg-label">Item #:</div>
              <div className="col-md-7">{ detail.s_item_number }</div>
            </div>
            <div className="row">
              <div className="col-md-5 seg-label">Description:</div>
              <div className="col-md-7">{ detail.s_description }</div>
            </div>
            <div className="row">
              <div className="col-md-5 seg-label">QTY:</div>
              <div className="col-md-7">{ detail.qty_to_ship }</div>
            </div>
            <div className="row">
              <div className="col-md-5 seg-label">Unit Price:</div>
              <div className="col-md-7"> { detail.unit_price } </div>
            </div>
          </div>
        </div>      
      }
    </div>
  )
}

export default SummarySegmentRMAAUTHITEMS