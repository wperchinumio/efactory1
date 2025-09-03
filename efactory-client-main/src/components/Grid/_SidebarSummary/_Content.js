import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import * as Segments from './Segments'
import config from './config'

const TableOrderSummary = ({
	detail,
	emptySummaryMessage,
	isBodyVisible,
	pathname,
	summaryHeadTitle,
}) => {
	useEffect(
		() => {
			global.App.initSlimScroll(document.querySelector(".scrollable-rr"))
			return () => {
				global.App.destroySlimScroll(document.querySelector(".scrollable-rr"))
			}
		},
		[]
	)

	function getSegments () {
		if (!pathname) {
			return	
		}
		let pathname_matched_segments_arr = config[ pathname ]
		if ( !pathname_matched_segments_arr ) {
			return console.error(
				`config file matched no segments array for pathname <${pathname}>`
			)
		} 
		let segmentsJsxArr = []
		pathname_matched_segments_arr.forEach( ( segment, index ) => {
			let MatchedSegment = Segments[ segment ]
			if( !MatchedSegment ){
				return console.error(`Segments/index.js file doesn t export segment <${segment}>`)
			}
			segmentsJsxArr.push( <MatchedSegment detail={ detail } key={ `segment-${index}` } /> )
			segmentsJsxArr.push( <div className="clearfix" key={ `clearfix-${index}` } /> )
		} )
		return segmentsJsxArr
	}

	return (
		<div className="gridview-detail bg-gridview-detail order-summary-md-hidden">
	    <div className="right-detail-title side-panel-title">
	    	{ summaryHeadTitle }
	    </div>
	    <div className="right-detail-body">
	      <div style={ !isBodyVisible ? {display:"block"} : {display:"none"} }>
	        <div className="alert alert-warning font-dark select-order-info">
	          { emptySummaryMessage }
	        </div>
       	</div>
        <div className="scrollable-rr">
	      	{ 
	      		isBodyVisible &&
	      		<div className="portlet-parent">
		      		{ getSegments() }
	        	</div>
		      }
        </div>
		  </div>
		</div>
	)
}

TableOrderSummary.propTypes = {
	detail: PropTypes.object.isRequired,
	emptySummaryMessage: PropTypes.string.isRequired,
	isBodyVisible: PropTypes.bool.isRequired,
	pathname: PropTypes.string.isRequired,
	summaryHeadTitle: PropTypes.string.isRequired,
}

export default TableOrderSummary