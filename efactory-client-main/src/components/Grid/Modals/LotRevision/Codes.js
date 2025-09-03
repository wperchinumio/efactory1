import React from 'react'
import PropTypes from 'prop-types'

const LotRevisionCodes = props => {
	let {
		form_values = {},
		settings = {}
	} = props

	let {
		lot_code1 = [],
		lot_code2 = [],
		lot_code3 = [],
		lot_code4 = [],
		lot_code5 = [],
	} = settings

	let lot_code1_label = lot_code1.filter( 
		item => item.value === form_values['lot_code1'] 
	)[0]
	lot_code1_label = lot_code1_label ? lot_code1_label[ 'label' ] : ''

	let lot_code2_label = lot_code2.filter( 
		item => item.value === form_values['lot_code2'] 
	)[0]
	lot_code2_label = lot_code2_label ? lot_code2_label[ 'label' ] : ''

	let lot_code3_label = lot_code3.filter( 
		item => item.value === form_values['lot_code3'] 
	)[0]
	lot_code3_label = lot_code3_label ? lot_code3_label[ 'label' ] : ''

	let lot_code4_label = lot_code4.filter( 
		item => item.value === form_values['lot_code4'] 
	)[0]
	lot_code4_label = lot_code4_label ? lot_code4_label[ 'label' ] : ''

	let lot_code5_label = lot_code5.filter( 
		item => item.value === form_values['lot_code5'] 
	)[0]
	lot_code5_label = lot_code5_label ? lot_code5_label[ 'label' ] : ''

  return (
	  <div className="col-md-12 note note-info">
			<div className="row">
				<span className="col-md-2 small padding-top-4">
					Code 1:
				</span>
				<span className="col-md-4 small padding-0 sbold padding-top-4">
					Avail. Status
				</span>
				<div className="col-md-3 small padding-0">
					<select 
						value={ form_values['lot_code1'] }
						className="bs-select form-control input-sm height-25 col-md-12"
						onChange={ event => props.onCodeChange( 'lot_code1', event.target.value ) }
					>	
						{
							lot_code1.map( ( { value, label } ) => (
								<option 
									key={ `lot_code1${value}` }
									value={ value }
								>
									{ value }
								</option>			
							) )
						}
					</select>
				</div>
				<span className="col-md-3 small sbold padding-top-4">
					{ lot_code1_label }
				</span>
			</div>
			<div className="row">
				<span className="col-md-2 small padding-top-4">
					Code 2:
				</span>
				<span className="col-md-4 small padding-0 sbold padding-top-4">
					Group
				</span>
				<div className="col-md-3 small padding-0">
					<select 
						value={ form_values['lot_code2'] }
						className="bs-select form-control input-sm height-25 col-md-12"
						onChange={ event => props.onCodeChange( 'lot_code2', event.target.value ) }
					>	
						{
							lot_code2.map( ( { value, label } ) => (
								<option 
									key={ `lot_code2${value}` }
									value={ value }
								>
									{ value }
								</option>			
							) )
						}
					</select>
				</div>
				<span className="col-md-3 small sbold padding-top-4">
					{ lot_code2_label }
				</span>
			</div>
			<div className="row">
				<span className="col-md-2 small padding-top-4">
					Code 3:
				</span>
				<span className="col-md-4 small padding-0 sbold padding-top-4">
					Reserved for Customer
				</span>
				<div className="col-md-3 small padding-0">
					<select 
						value={ form_values['lot_code3'] }
						className="bs-select form-control input-sm height-25 col-md-12"
						onChange={ event => props.onCodeChange( 'lot_code3', event.target.value ) }
					>
						{
							lot_code3.map( ( { value, label } ) => (
								<option 
									key={ `lot_code3${value}` }
									value={ value }
								>
									{ value }
								</option>			
							) )
						}
					</select>
				</div>
				<span className="col-md-3 small sbold padding-top-4">
					{ lot_code3_label }
				</span>
			</div>
			<div className="row">
				<span className="col-md-2 small padding-top-4">
					Code 4:
				</span>
				<span className="col-md-4 small padding-0 sbold padding-top-4">
					Code 4
				</span>
				<div className="col-md-3 small padding-0">
					<select 
						value={ form_values['lot_code4'] }
						className="bs-select form-control input-sm height-25 col-md-12"
						onChange={ event => props.onCodeChange( 'lot_code4', event.target.value ) }
					>		
							{
								lot_code4.map( ( { value, label } ) => (
									<option 
										key={ `lot_code4${value}` }
										value={ value }
									>
										{ value }
									</option>			
								) )
							}
					</select>
				</div>
				<span className="col-md-3 small sbold padding-top-4">
					{ lot_code4_label }
				</span>
			</div>
			<div className="row">
				<span className="col-md-2 small padding-top-4">
					Code 5:
				</span>
				<span className="col-md-4 small padding-0 sbold padding-top-4">
					Code 5
				</span>
				<div className="col-md-3 small padding-0">
					<select 
						value={ form_values['lot_code5'] }
						className="bs-select form-control input-sm height-25 col-md-12"
						onChange={ event => props.onCodeChange( 'lot_code5', event.target.value ) }
					>
							{
								lot_code5.map( ( { value, label } ) => (
									<option 
										key={ `lot_code5${value}` }
										value={ value }
									>
										{ value }
									</option>			
								) )
							}
					</select>
				</div>
				<span className="col-md-3 small sbold padding-top-4">
					{ lot_code5_label }
				</span>
			</div>
		</div>	
  )
}

LotRevisionCodes.propTypes = {
  settings: PropTypes.object.isRequired,
  form_values: PropTypes.shape({
  	lot_code1: PropTypes.string,
  	lot_code2: PropTypes.string,
  	lot_code3: PropTypes.string,
  	lot_code4: PropTypes.string,
  	lot_code5: PropTypes.string
  }).isRequired
}

export default LotRevisionCodes