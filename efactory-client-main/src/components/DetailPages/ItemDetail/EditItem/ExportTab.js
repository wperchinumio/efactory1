import React from 'react'
import PropTypes from 'prop-types'

const ExportTab = ({
	detailActions,
	editItemData,
	exportData,
}) => {
	function onFieldInputChange (event) {
    detailActions.setRootReduxStateProp({
      field : 'editItemData',
      value : {
        ...editItemData,
        export : {
          ...editItemData.export,
          [event.target.name] : event.target.value.toUpperCase()
        }
      }
    })
  }

	let {
    eccn = '',
    hcode = '',
    hcode_ca = '',
    coo = '',
    gl = '',
    cat = '',
  } = exportData

  return (

		<div className="tab-pane active" id="export">
			<div className="col-md-12 item-edit">
			  <div className="form-group">
			    <label className="col-md-3 control-label label-12 label-edit">ECCN:</label>
			    <div className="col-md-4">
			      <input
			        type="text"
			        className="form-control"
			        name='eccn'
		          value={ eccn ? eccn : '' }
		          onChange={ onFieldInputChange }
			      />
			    </div>
			    <div className="col-md-5 help-block label-12">
			      Export Control Classification Number
			    </div>
			  </div>

			  <div className="form-group">
			    <label className="col-md-3 control-label label-12 label-edit">HCode:</label>
			    <div className="col-md-4">
			      <input
			        type="text"
			        className="form-control"
			        name='hcode'
		          value={ hcode ? hcode : '' }
		          onChange={ onFieldInputChange }
			      />
			    </div>
			    <div className="col-md-5 help-block label-12">
		        Harmonized Code
			    </div>
			  </div>

			  <div className="form-group">
			    <label className="col-md-3 control-label label-12 label-edit">HCode (CA):</label>
			    <div className="col-md-4">
			      <input
			        type="text"
			        className="form-control"
			        name='hcode_ca'
		          value={ hcode_ca ? hcode_ca : '' }
		          onChange={ onFieldInputChange }
			      />
			    </div>
			    <div className="col-md-5 help-block label-12">
		        Harmonized Code (CA)
			    </div>
			  </div>


			  <div className="form-group">
			    <label className="col-md-3 control-label label-12 label-edit">COO:</label>
			    <div className="col-md-4">
			      <input
			        type="text"
			        className="form-control"
			        name='coo'
		          value={ coo ? coo : '' }
		          onChange={ onFieldInputChange }
			      />
			    </div>
			    <div className="col-md-5 help-block label-12">
			      Country Of Origin
			    </div>
			  </div>

			  <div className="form-group">
			    <label className="col-md-3 control-label label-12 label-edit">GL Symbol:</label>
			    <div className="col-md-4">
			      <input
			        type="text"
			        className="form-control"
			        name='gl'
		          value={ gl ? gl : '' }
		          onChange={ onFieldInputChange }
			      />
			    </div>
			    <div className="col-md-5 help-block label-12">

			    </div>
			  </div>

			  <div className="form-group">
			    <label className="col-md-3 control-label label-12 label-edit">Cat:</label>
			    <div className="col-md-4">
			      <input
			        type="text"
			        className="form-control"
			        name='cat'
		          value={ cat ? cat : '' }
		          onChange={ onFieldInputChange }
			      />
			    </div>
			    <div className="col-md-5 help-block label-12">
		        Category
			    </div>
			  </div>

			</div>
		</div>
  )
}

ExportTab.propTypes = {
  exportData 		: PropTypes.object,
	editItemData  : PropTypes.object,
	detailActions : PropTypes.object
}

export default ExportTab