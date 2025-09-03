import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Codes from './Codes'
import DatePickerInput from './DatePickerInput'

const LotRevisionModal = props => {
	const handleModalOpening = useCallback(
		() => {
	  	global.$(".draggable-modal").css({ top : '0px', left : '0px' })
	  },
	  []
	)

	useEffect(
		() => {
			global.$('#lot-revision').on('show.bs.modal', handleModalOpening )
    	global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    	return () => {
    		global.$('#lot-revision').off('show.bs.modal', handleModalOpening )
    	}
		},
		[]
	)

	function onLotMasterValueChange (code_type, code_value) {
  	let { lotRevision, lot_master, gridActions } = props
  	gridActions.setRootReduxStateProp('lotRevision',{
  		...lotRevision,
  		lot_master: {
  			...lot_master,
  			[code_type]: code_value
  		}
  	})
  }

  function onFormSubmit (event) {
  	props.gridActions.postLotRevision().then( 
  		() => {
  			global.$('#lot-revision').modal('hide')
  		} 
  	).catch( e => {} )
  }

  let {
		settings 		= {},
		lot_master 	= {}
	} = props

	let {
		description = '',
		inv_type = '',
		item_number = '',
		lot_ser = '',
		status_code = '',
		lot_code1 = '',
		lot_code2 = '',
		lot_code3 = '',
		lot_code4 = '',
		lot_code5 = '',
		lot_mem1 = '',
		lot_mem2 = '',
		lot_mem3 = '',
		lot_date1 = '',
		lot_date2 = '',
		lot_date3 = '',
		lot_date4 = '',
		lot_date5 = '',
		exp_date  = ''
	} = lot_master

  return (
    <div
	    className="modal modal-themed fade draggable-modal"
	    id="lot-revision"
	    tabIndex="-1"
	    role="dialog"
	    aria-hidden="true"
			data-backdrop="static"
	  >
	    <div className="modal-dialog" style={{minWidth: "1100px"}}>
	      <div className="modal-content"
	      	style={{ width: '80%', marginLeft: '10%' }}
	      >
	        <div className="modal-header">
	          <button
	            type="button"
	            className="close"
	            data-dismiss="modal"
	            aria-hidden="true">
	          </button>
	          <h4 className="modal-title">
	          	Lot Revision
	          </h4>
	        </div>
	        <div className="modal-body" style={{marginBottom: "20px"}}>
		        <form role="form" autoComplete="off">
							<div className="note note-info">
								<div className="row">
									<div className="col-md-5 padding-0">
										<span className="col-md-4 small">
											Item #:
										</span>
										<span className="col-md-8 sbold small">
											{ item_number }
										</span>
									</div>
									<div className="col-md-4 padding-0">
										<span className="small col-md-12 text-primary">
											{ description }
										</span>
									</div>
									<div className="col-md-3 padding-0">
										<span className="col-md-7 small">
											Inv. Type:
										</span>
										<span className="col-md-5 sbold small">
											{ inv_type }
										</span>
									</div>
								</div>
								<div className="row">
									<div className="col-md-5 padding-0">
										<span className="col-md-4 small">
											Lot / Serial:
										</span>
										<span className="col-md-8 sbold small">
											{ lot_ser }
										</span>
									</div>
									<div className="col-md-4 padding-0">
									</div>
									<div className="col-md-3 padding-0">
										<span className="col-md-7 small">
											Status Code:
										</span>
										<span className="col-md-5 sbold small">
											{ status_code }
										</span>
									</div>
								</div>
							</div>
							<div className="row">
								<div 
									className="col-md-7" 
									style={{ paddingRight: 0 }}
								>
									<Codes 
										settings={ settings }
										form_values={{ lot_code1, lot_code2, lot_code3, lot_code4, lot_code5 }}
										onCodeChange={ onLotMasterValueChange }
									/>
									<div className="col-md-12 note note-info">
										<div className="row">
											<span className="col-md-2 small padding-top-4">
												Memo 1:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												LOT USAGE
											</span>
											<span className="col-md-6 padding-0">
												<input 
													type="text" 
													className="form-control input-sm height-25"
													value={ lot_mem1 }
													onChange={ event => onLotMasterValueChange('lot_mem1', event.target.value) }
												/>
											</span>
										</div>
										<div className="row">
											<span className="col-md-2 small padding-top-4">
												Memo 2:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Memo 2
											</span>
											<span className="col-md-6 padding-0">
												<input 
													type="text" 
													className="form-control input-sm height-25"
													value={ lot_mem2 }
													onChange={ event => onLotMasterValueChange('lot_mem2', event.target.value) }
												/>
											</span>
										</div>
										<div className="row">
											<span className="col-md-2 small padding-top-4">
												Memo 3:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Memo 3
											</span>
											<span className="col-md-6 padding-0">
												<input 
													type="text" 
													className="form-control input-sm height-25"
													value={ lot_mem3 }
													onChange={ event => onLotMasterValueChange('lot_mem3', event.target.value) }
												/>
											</span>
										</div>
									</div>	
								</div>	
								<div className="col-md-5">
									<div className="col-md-12  note note-info">
										<div className="row">
											<span className="col-md-3 small padding-top-4">
												Date 1:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Date 1
											</span>
											<span className="col-md-5 padding-0 rw-widget-small">
												<DatePickerInput
													field="lot_date1"
													onDateValueChange={ ( field, date ) => onLotMasterValueChange( field, date ) }
													startDate={ lot_date1 }
													loaded={ settings.lot_code1.length > 0 }
												/>
											</span>
										</div>
										<div className="row">
											<span className="col-md-3 small padding-top-4">
												Date 2:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Date 2
											</span>
											<span className="col-md-5 padding-0 rw-widget-small">
												<DatePickerInput
													field="lot_date2"
													onDateValueChange={ ( field, date ) => onLotMasterValueChange( field, date ) }
													startDate={ lot_date2 }
													loaded={ settings.lot_code1.length > 0 }
												/>
											</span>
										</div>
										<div className="row">
											<span className="col-md-3 small padding-top-4">
												Date 3:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Date 3
											</span>
											<span className="col-md-5 padding-0 rw-widget-small">
												<DatePickerInput
													field="lot_date3"
													onDateValueChange={ ( field, date ) => onLotMasterValueChange( field, date ) }
													startDate={ lot_date3 }
													loaded={ settings.lot_code1.length > 0 }
												/>
											</span>
										</div>
										<div className="row">
											<span className="col-md-3 small padding-top-4">
												Date 4:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Date 4
											</span>
											<span className="col-md-5 padding-0 rw-widget-small">
												<DatePickerInput
													field="lot_date4"
													onDateValueChange={ ( field, date ) => onLotMasterValueChange( field, date ) }
													startDate={ lot_date4 }
													loaded={ settings.lot_code1.length > 0 }
												/>
											</span>
										</div>
										<div className="row">
											<span className="col-md-3 small padding-top-4">
												Date 5:
											</span>
											<span className="col-md-4 small padding-0 sbold padding-top-4">
												Date 5
											</span>
											<span className="col-md-5 padding-0 rw-widget-small">
												<DatePickerInput
													field="lot_date5"
													onDateValueChange={ ( field, date ) => onLotMasterValueChange( field, date ) }
													startDate={ lot_date5 }
													loaded={ settings.lot_code1.length > 0 }
												/>
											</span>
										</div>
										<div className="row" style={{height: "50px"}}>
										</div>
										<div className="row">
											<span className="col-md-7 small padding-top-4">
												Lot Expiration Date:
											</span>
											<span className="col-md-5 padding-0 rw-widget-small">
												<DatePickerInput
													field="exp_date"
													onDateValueChange={ ( field, date ) => onLotMasterValueChange( field, date ) }
													startDate={ exp_date }
													loaded={ settings.lot_code1.length > 0 }
												/>
											</span>
										</div>
										<div className="row" style={{height: "56px"}}>
										</div>
									</div>	
								</div>	
							</div>	
						</form>
	        </div>
	        <div className="modal-footer" style={{ marginTop : '-40px' }} >
	          <button
	          	type="button"
	          	className="btn dark btn-outline"
	          	data-dismiss="modal"
	          >
	          	Cancel
	          </button>
	          <button
	            type="button"
	            className="btn green-soft"
	            onClick={ onFormSubmit }
            >
	            Save Changes
	          </button>
	        </div>
	      </div>
	    </div>
	  </div>
  )
}

LotRevisionModal.propTypes = {
  lot_master: PropTypes.shape({
  	description: PropTypes.any,
		exp_date: PropTypes.any,
		inv_type: PropTypes.any,
		item_number: PropTypes.any,
		lot_code1: PropTypes.any,
		lot_code2: PropTypes.any,
		lot_code3: PropTypes.any,
		lot_code4: PropTypes.any,
		lot_code5: PropTypes.any,
		lot_date1: PropTypes.any,
		lot_date2: PropTypes.any,
		lot_date3: PropTypes.any,
		lot_date4: PropTypes.any,
		lot_date5: PropTypes.any,
		lot_mem1: PropTypes.any,
		lot_mem2: PropTypes.any,
		lot_mem3: PropTypes.any,
		lot_ser: PropTypes.any,
		status_code: PropTypes.any,
  }).isRequired,
	settings: PropTypes.shape({
		lot_code1: PropTypes.array.isRequired,
		lot_code2: PropTypes.array.isRequired,
		lot_code3: PropTypes.array.isRequired,
		lot_code4: PropTypes.array.isRequired,
		lot_code5: PropTypes.array.isRequired
	}).isRequired,
	gridActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
  	lotRevision : state.grid.lotRevision,
    lot_master 	: state.grid.lotRevision.lot_master,
    settings 		: state.grid.lotRevision.settings
  }),
  null
)(LotRevisionModal)