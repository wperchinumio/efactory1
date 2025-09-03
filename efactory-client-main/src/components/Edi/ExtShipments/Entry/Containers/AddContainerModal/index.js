import React, { useEffect, useCallback, useRef } from 'react'
import classNames from 'classnames'

const AddContainerModal = ({
	ediState,
	ediActions
}) => {
	const ediStateRef = useRef(null)
  ediStateRef.current = ediState

  const handleModalOpening = useCallback(
  	() => {
  		let {
	  		is_edit_container,
	  		addedShipmentData,
	  		edit_container_index
	  	} = ediStateRef.current

	  	let addContainerData = {}
	  	if( is_edit_container ){
	  		let {
		      carton_number,
		      tracking_number,
		      sscc_number,
		      unit_weight,
		      freight,
		      unit_of_measure,
		      unit_type,
		      unit_dimension,
		      comments,
		    } = addedShipmentData.cartons[ edit_container_index ]
	  		addContainerData = {
					carton_number,
					tracking_number,
					sscc_number,
					unit_weight,
					freight,
					unit_of_measure,
					unit_type,
					unit_dimension,
					comments,
	  		}
	  	}else{
	  		addContainerData = {
					unit_of_measure : 'EA'
	  		}
	  	}
	    ediActions.setRootReduxStateProp_multiple({
	  		addContainerData,
	  		containerItems : []
	  	})
	    ediActions.readContainerItems( 
	    	is_edit_container,
	    	is_edit_container 
	    	? addedShipmentData.cartons[ edit_container_index ]['items'] 
	    	: undefined 
	    )
  	},
  	[ediState]
  )
  
	useEffect(
		() => {
			global.$('#ext-add-container').on('show.bs.modal', handleModalOpening)
    	global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    	return () => {
    		global.$('#ext-add-container').off('show.bs.modal', handleModalOpening)
    	}
		},
		[]
	)

	function onFieldChange (event) {
		let {
			value,
			name
		} = event.target
		let {
			addContainerData
		} = ediState
		if( name === "carton_number" ){
			value = value.toUpperCase()
		}
		if( name === 'unit_weight' || name === 'freight' ){
			if( isNaN( value ) ) return 
		}
		ediActions.setRootReduxStateProp_multiple({
  		addContainerData : {
  			...addContainerData,
  			[ name ] : value.trim()
  		}
  	})
	}

	function onQuantityInCartonChange (event) {
		let index = event.target.getAttribute('data-index')
		let { value } = event.target
		value = value.trim()
		let {
			containerItems
		} = ediState
		let {
			quantity_in_carton
		} = containerItems[ +index ]
		if( !isNaN(+value) ){
			quantity_in_carton = +value
		}
		ediActions.setRootReduxStateProp_multiple({
  		containerItems : [
  			...containerItems.slice( 0, +index ),
  			{
  				...containerItems[ +index ],
  				quantity_in_carton							
  			},
  			...containerItems.slice( +index + 1 ),
  		]
  	})
	}

	function onAddClicked (event) {
		let {
			containerItems,
			addedShipmentData,
			addContainerData
		} = ediState

		let {
			cartons = []
		} = addedShipmentData

		let {
			unit_weight = "",
			unit_dimension = "",
			carton_number = "",
			tracking_number = "",
			sscc_number = "",
			freight = "",
			unit_of_measure = "",
			unit_type = "",
		} = addContainerData

		let carton = {
			carton_number,
			tracking_number,
			sscc_number,
			unit_weight,
			freight,
			unit_of_measure,
			unit_type,
			unit_dimension,
			comments : "", // ask walter
			items : []
		}

		containerItems.forEach( 
			( item, index ) => {
				let {
					line_num,
					quantity_in_carton,
					item_number,
					description,
					serial_numbers = []
				} = item
				if( +quantity_in_carton > 0 ){
					carton.items.push({
						line_num,
						quantity_in_carton,
						item_number,
						description,
						serial_numbers,
					})
				}
			}
		)

		ediActions.setRootReduxStateProp_multiple({
  		addedShipmentData : {
  			...addedShipmentData,
  			cartons : [
  				...cartons,
  				carton
  			]
  		},
  		is_form_values_dirty : true
  	})
  	global.$('#ext-add-container').modal('hide');
	}

	function onEditClicked (event) {
		let {
			containerItems,
			addedShipmentData,
			addContainerData,
			edit_container_index
		} = ediState

		let {
			cartons = []
		} = addedShipmentData

		let {
			unit_weight,
			unit_dimension,
			carton_number = "",
			tracking_number = "",
			sscc_number = "",
			freight = "",
			unit_of_measure = "",
			unit_type = "",
		} = addContainerData

		let carton = {
			carton_number,
			tracking_number,
			sscc_number,
			unit_weight,
			freight,
			unit_of_measure,
			unit_type,
			unit_dimension,
			comments : "", // ask walter
			items : []
		}

		containerItems.forEach( 
			( item, index ) => {
				let {
					line_num,
					quantity_in_carton,
					item_number,
					description,
					serial_numbers = []
				} = item
				if( +quantity_in_carton > 0 ){
					carton.items.push({
						line_num,
						quantity_in_carton,
						item_number,
						description,
						serial_numbers,
					})
				}
			}
		)

		ediActions.setRootReduxStateProp_multiple({
  		addedShipmentData : {
  			...addedShipmentData,
  			cartons : [
  				...cartons.slice( 0, +edit_container_index ),
  				carton,
  				...cartons.slice( 1 + +edit_container_index )
  			]
  		},
  		edit_container_index : '',
  		is_edit_container : false,
  		is_form_values_dirty : true
  	})
  	global.$('#ext-add-container').modal('hide');
	}

	function onSerialNumbersClicked (event) {
		let serial_numbers_record_index = event.target.getAttribute('data-index')
		let serial_format = event.target.getAttribute('data-serial-format')
		ediActions.setRootReduxStateProp_multiple({
			serial_numbers_record_index,
			serial_format
  	}).then( () => {
  		global.$('#serial-numbers').modal('show')
  	} )
	}

  let {
		containerItems = [],
		addContainerData = {},
		is_edit_container
	} = ediState

	let {
		unit_type,
		unit_of_measure,
		carton_number,
		tracking_number,
		sscc_number,
		unit_weight,
		freight,
		unit_dimension
	} = addContainerData

	let containerItems_moreThanZeroQty = false
	let containerItems_invalidRecords = false

	containerItems.forEach( ({ quantity_in_carton, qty_in_order, bl_qty }) => {

		quantity_in_carton = +quantity_in_carton
		qty_in_order = +qty_in_order
		bl_qty = +bl_qty

		if( bl_qty < quantity_in_carton ){
			containerItems_invalidRecords = true
		}

		if( +quantity_in_carton > 0 ){
			containerItems_moreThanZeroQty = true	
		}
	})

	let isAddDisabled = !( unit_type && carton_number && containerItems_moreThanZeroQty && !containerItems_invalidRecords )

  return (
    <div
			className="modal modal-themed fade draggable-modal"
			data-backdrop="static"
			id="ext-add-container"
			tabIndex="-1"
			role="dialog"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg">
		  	<div className="modal-content">
		    	<div className="modal-header">
		      		<button
		        		type="button"
		        		className="close"
		        		data-dismiss="modal"
		        		aria-hidden="true">
		      		</button>
		      		<h4 className="modal-title">
		      			{ is_edit_container ? 'Edit Container' : 'Add Container' } 
		      		</h4>
		    	</div>
		    	<div className="modal-body" style={{ margin: "10px" }}>
		    		<div className="row">
		    			<div className="col-md-6">
		    				<div className="form-group padding-5" style={{marginBottom: "3px"}}>
					        <div className="row">
				            <div className="col-md-6">
				              <label className={ classNames({
				              	'control-label' : true, 
				              	'label-req' : !unit_type || unit_type.length === 0
				              }) } >
				                Unit Type:
				              </label>
				              <select 
				              	id="" className="form-control input-sm"
				              	name="unit_type"
				              	value={ unit_type ? unit_type : "" }
				              	onChange={ onFieldChange }
				              >
				                <option value=""></option>
				                <option value="carton">
				                	Carton
				                </option>
				                <option value="pallet">
				                	Pallet
				                </option>
				              </select>
				            </div>
				            <div className="col-md-6">
				              <label className="control-label" >
				                Unit of Measure:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm uppercase"
				                name="unit_of_measure"
				              	value={ unit_of_measure ? unit_of_measure : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
					        </div>
					        <div className="row">
				            <div className="col-md-12">
				              <label className={ classNames({
				              	'control-label' : true, 
				              	'label-req' : !carton_number || carton_number.length === 0
				              }) } >
				                Container #:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm"
				                name="carton_number"
				              	value={ carton_number ? carton_number : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
					        </div>
					        <div className="row">
				            <div className="col-md-12">
				              <label className="control-label" >
				                Tracking #:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm uppercase"
				                name="tracking_number"
				              	value={ tracking_number ? tracking_number : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
					        </div>
					      </div>
		    			</div>
		    			<div className="col-md-6">
		    				<div className="form-group padding-5" style={{marginBottom: "3px"}}>
					        <div className="row">
				            <div className="col-md-12">
				              <label className="control-label uppercase">
				                SSCC #:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm uppercase"
				                name="sscc_number"
				              	value={ sscc_number ? sscc_number : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
					        </div>
					        <div className="row">
				            <div className="col-md-6">
				              <label className="control-label" >
				                Weight:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm"
				                name="unit_weight"
				              	value={ unit_weight ? unit_weight : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
				            <div className="col-md-6">
				              <label className="control-label" >
				                Freight:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm"
				                name="freight"
				              	value={ freight ? freight : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
					        </div>
					        <div className="row">
				            <div className="col-md-6">
				              <label className="control-label" >
				                Dimension:
				              </label>
				              <input 
				                type="text"
				                className="form-control input-sm"
				                name="unit_dimension"
				              	value={ unit_dimension ? unit_dimension : "" }
				              	onChange={ onFieldChange }
				              />
				            </div>
					        </div>
					      </div>
		    			</div>
		    		</div>
		    		<div className="row">
		    			<div className="col-md-12" style={{ margin: "20px 0px" }}>
								<div className="whole-table">
								  <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
								    <colgroup>
								      <col style={{width: "60px"}}/>
								      <col style={{width: "65px"}}/>
								      <col />
								      <col style={{width: "100px"}}/>
								      <col style={{width: "100px"}}/>
								      <col style={{width: "100px"}}/>
								      <col style={{width: "200px"}}/>
								      <col style={{width: "7px"}}/>
								    </colgroup>
								    <thead>
								      <tr className="uppercase noselect table-header-1 cart-row">
								      	<th className="text-center">
								          #
								        </th>
								        <th className="text-center">
								          &nbsp;
								        </th>
								      	<th className="text-left" style={{ paddingLeft : "15px" }}>
								          ITEM # / DESCRIPTION
								        </th>
								        <th className="text-center" style={{ paddingLeft: '2%' }} >
								          ORDER <br/>
								          QTY 
								        </th>
								        <th className="text-center" style={{ paddingLeft: '2%' }} >
								          BL <br/>
								          QTY
								        </th>
								        <th className="text-center" style={{ paddingLeft: '2%' }} >
								          IN CARTON <br/>
								          QTY 
								        </th>
								        <th className="text-center" style={{ paddingLeft : "15px" }}>
								          SERIAL / LOT #
								        </th>
								        <th className="text-left">
								          &nbsp;
								        </th>
								      </tr>
								    </thead>
								  </table>
								  <div className="op-cart-table" style={{overflowY: "scroll"}}>
								    <div className="table-responsive" style={{padding: 0}}>
								      <table className="table table-striped table-hover table-bordered table-clickable">
								        <colgroup>
								          <col style={{width: "60px"}}/>
								          <col style={{width: "65px"}}/>
										      <col />
										      <col style={{width: "100px"}}/>
										      <col style={{width: "100px"}}/>
										      <col style={{width: "100px"}}/>
										      <col style={{width: "200px"}}/>
										      <col style={{width: "7px"}}/>
								        </colgroup>
								        <tbody>
								        	{
								        		containerItems.map( 
								        			( item, index ) => {

								        			let {
								        				// line_num,
																item_number,
																description,
																qty_in_order,
																bl_qty,
																quantity_in_carton,
																serial_numbers = [],
																has_lot,
																has_serial,
																serial_format
								        			} = item

								        			return (
								        				<tr key={ `items-key-${index}` }>
											            <td className="vertical-align-top">
											              <div className="padding-tb-20 text-center">
											                { 1 + index }
											              </div>
											            </td>
											            <td className="vertical-align-top">
												            <div style={{  marginTop: '-5px' }}>
												            	<div 
												              	className={ classNames({
												              		'serial_lot_type font-white inline-block' : true,
												              		'bg-red-soft' : has_lot,
												              		'bg-grey-salt' : !has_lot
												              	}) }
												              	style={{ marginTop : '13px' }}
												              >
												              	LOT
												              </div>
												              <div 
												              	className={ classNames({
												              		'serial_lot_type font-white inline-block' : true,
												              		'bg-red-soft' : has_serial,
												              		'bg-grey-salt' : !has_serial
												              	}) }
												              >
												              	SERIAL
												              </div>
												            </div>
											            </td>
											            <td className="vertical-align-top">
											              <div style={{ height: '50px', padding: '10px' }}>
											                <div style={{ fontWeight: '600', fontSize: '14px' }} >
											                  { item_number }
											                </div>
											                <div style={{ fontWeight: '400', color: '#337ab7', fontSize: '14px', marginTop:"4px" }} >
											                  { description }
											                </div>
											              </div>
											            </td>
											            <td className="vertical-align-top text-center">
											              <div style={{ height: '50px', padding: '22px' }}>
											                { qty_in_order }
											              </div>
											            </td>
											            <td className="vertical-align-top text-center">
											              <div style={{ height: '50px', padding: '22px' }}>
											                { bl_qty }
											              </div>
											            </td>
											            <td className="vertical-align-top text-center">
											              <div style={{ height: '50px', padding: '15px' }}>
											                <input 
											                	type="text" 
											                	className="form-control input-sm"
											                	value={ quantity_in_carton ? quantity_in_carton : '' }
											                	onChange={ onQuantityInCartonChange }
											                	data-index={ index }
											                />
											              </div>
											            </td>
											            <td className="text-center vertical-align-top">
											              <div style={{ height: '50px', padding: '10px' }}>
											                <button 
											                	className="btn btn-sm grey-gallery"
											                	data-index={ index }
											                	data-serial-format={ serial_format }
											                	onClick={ onSerialNumbersClicked }
											                >
											                  Serial / Lot #
											                </button>
											                <div style={{ display:"inline-block", width: "40px", textAlign : "center" }}>
											                 	{ serial_numbers.length }
											                 </div>
											              </div>
											            </td>
											          </tr>
								        			)
								        		} ) 
								        	}
								        </tbody>
								      </table>
								    </div>
								  </div>

								</div>
		    			</div>
		    		</div>
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
	        		className="btn green"
	        		data-dismiss="modal"
	        		onClick={ is_edit_container ? onEditClicked : onAddClicked } 
	        		disabled={ isAddDisabled }
	        	>
	        		{
        				is_edit_container ? "Update" : "Add"
	        		}
	      		</button>
		    	</div>
		  	</div>
			</div>
		</div>
  )
}

export default AddContainerModal