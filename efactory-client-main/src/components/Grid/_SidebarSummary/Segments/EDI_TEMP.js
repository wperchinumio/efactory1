import React from 'react'

const SummarySegmentEdiTemp = ({
  detail
}) => {
  return (
    <div className="portlet light order-summary">
      <div className="portlet-title">
        <div className="tools pull-left">
          <a  className="collapse"/>
        </div>
        <div className="caption font-yellow-gold bold uppercase">Temp title</div>
      </div>
      <div className="portlet-body">
        example segment is at 
        <br/>
        src/components/Grid/
        <br/>
        _SidebarSummary/Segments/EDI_TEMP
      </div>
    </div>     
  )
}

export default SummarySegmentEdiTemp