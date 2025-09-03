import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IconDescriptions from './IconDescriptions'
import TemplateTableRow from './TemplateTableRow'

const RmaTypesTable = props => {
	useEffect(
		() => {
			let { readTemplates, readSingleTemplate } = props.templateActions
  		readTemplates().then(() => readSingleTemplate())
		},
		[]
	)

	function onRowClicked (rma_type) {
  	props.templateActions.setActiveTemplate({ rma_type })
  }

  let { templates, activeRmaType } = props

  return (
		<div className="col-md-3">
		  <div className="table-responsive">
		    <table className="rma-type table table-striped table-hover table-clickable">
			    <thead>
				    <tr className="uppercase noselect table-header-1 cart-row">
				      <th style={{verticalAlign: "middle"}}>RMA Type</th>
				      <th style={{textAlign: "center"}}>Templates<br/>defined</th>
				      <th style={{verticalAlign: "middle", textAlign: "center"}}>IN / OUT</th>
				    </tr>
			    </thead>
			    <tbody>
				    {
				    	templates.map( ({
				    		rma_type,
				    		name,
				    		show,
				    		templates
				    	}) => {
				    		return (
				    			<TemplateTableRow 
				    				active={ activeRmaType === rma_type }
			    					name={name}
										rma_type={rma_type}
									  templates={templates}
										show={show}
										key={`row-key-${rma_type}`}
										onRowClicked={ onRowClicked }
			    				/>
				    		)
				    	})
				    }
			    </tbody>
		  	</table>
		  </div>
		  <IconDescriptions />
		</div>
  )
}

RmaTypesTable.propTypes = {
  templateActions: PropTypes.object.isRequired
}

export default connect(
	state => ({
		templates: state.returnTrak.mailTemplates.templates,
		activeRmaType: state.returnTrak.mailTemplates.activeRmaType
	})
)(RmaTypesTable)