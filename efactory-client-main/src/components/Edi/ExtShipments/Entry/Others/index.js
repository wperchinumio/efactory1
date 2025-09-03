import React from 'react'
import EditOthersModal from './EditOthersModal'

const Others = ({
	ediState,
	ediActions
}) => {
	let { addedShipmentData } = ediState
	let {
		pl_comments,
		shipping_instructions
	} = addedShipmentData
  return (
    <div className="op-review-sidebar">
    	<div className="addr-type"><i className="fa fa-fire"></i> Others
        <div className="pull-right">
          <a
          	href="#ext-edit-others"
          	data-toggle="modal"
          	className="addr-edit"
            tabIndex="-1"
          >
          	<i className="fa fa-edit"></i> Edit...
          </a>
        </div>
      </div>
      <div className="section">
      	<div style={{ marginBottom : "5px" }} >
      		Shipping Instructions: 
      	</div>
      	<div className="ef-info" style={{ minHeight : '56px' }}>
      		{ shipping_instructions }
      	</div>
      	<div style={{ margin : "10px 0px 5px 0px" }} >
      		Comments:
      	</div>
      	<div className="ef-info margin-bottom-10" style={{ minHeight : '56px' }}>
      		{ pl_comments }
      	</div>
      </div>
      <EditOthersModal 
			  ediState={ ediState }
			  ediActions={ ediActions }
			/>
    </div>
  )
}

export default Others