import React from 'react'
import OverviewTable from '../OverviewTable'

const Summary = ({
	ediState,
	ediActions,
	config
}) => {
	return (
		<div className="portlet light bordered">
		  <div className="portlet-title tabbable-line">
		    <div className="caption caption-md">
		      <i className="icon-bar-chart font-green-seagreen"></i>
		      <span className="caption-subject font-green-seagreen bold uppercase">Summary</span>
		    </div>
		  </div>
		  <div style={{overflowX: "auto", paddingRight: "20px"}}>
		    <section className="edi-overview-wrapper">
		      <OverviewTable 
		        ediState={ ediState }
		        ediActions={ ediActions }
		        config={ config }
		      />
		    </section>
		  </div>
		</div>
  )
}

export default Summary