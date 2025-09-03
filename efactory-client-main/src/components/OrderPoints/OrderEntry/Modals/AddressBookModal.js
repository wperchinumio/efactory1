import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AddressBook from '../../AddressBook'

const AddressBookModal = props => {
	const inputNode = useRef(null)
	const onModalClosing = useCallback(
  	() => {
	  	setTimeout( 
	  		() => {
		  		props.addressActions.setRootReduxStateProp_multiple({
		  			activePagination: 1,
		  			addresses: [],
		  			filterValue: ''
		  		})
	  		}, 		
	  		500
	  	)
	  },
	  []
  ) 

	useEffect(
		() => {
			global.$('#address-book').on('show.bs.modal', props.addressActions.getAddressesAsync )
    	global.$('#address-book').on('hide.bs.modal', onModalClosing )
    	return () => {
    		global.$('#address-book').off('show.bs.modal', props.addressActions.getAddressesAsync)
    		global.$('#address-book').off('hide.bs.modal', onModalClosing)
    	}
		},
		[]
	)

  function selectAddress () {
  	let { reviewActions, allAddresses } = props
  	reviewActions.setRootReduxStateProp_multiple({ 
  		shippingAddress: allAddresses.activeAddress.ship_to,
  		dirty: true
  	})
  	setBillingAddressToo()
  }

  function setBillingAddressToo () {
  	let { reviewActions, allAddresses } = props
  	let { bill_to : billingAddress } = allAddresses.activeAddress
  	reviewActions.setRootReduxStateProp_multiple({ billingAddress })
  }

  function onSubmit (event) {
  	event.preventDefault()
  	let inputValue = inputNode.current.value
  	if (inputValue.trim().length) {
	  	let { addressActions, billingAddress, shippingAddress } = props
  		addressActions.addAddressAsync({
  			is_validate: false, // @TODO
  			title: inputValue,
  			ship_to: shippingAddress,
  			bill_to: billingAddress
  		})
  		global.$('#add-to-addressbook').modal('hide')
    	inputNode.current.value = ''
  	}
  }

  function onDoubleClick () {
  	selectAddress()
  	global.$('#address-book').modal('hide')
  }

  let { allAddresses } = props

  return (
		<div>
			<div
				className="modal modal-themed fade"
				data-backdrop="static"
				id="address-book"
				tabIndex="-1"
				role="dialog"
				aria-hidden="true">
				<div className="modal-dialog modal-lg">
				  	<div className="modal-content">
				    	<div className="modal-header">
				      		<button
				        		type="button"
				        		className="close"
				        		data-dismiss="modal"
				        		aria-hidden="true">
				      		</button>
				      		<h4 className="modal-title">Select from address book</h4>
				      		<button
				    			type="button"
				    			className="btn btn-topbar btn-sm"
				    			data-dismiss="modal"
				    			data-toggle="modal"
				    			data-target="#add-to-addressbook"
				    			style={{ float: 'right' }}
				    			aria-hidden="true">
				    			<i className="fa fa-cloud-upload"></i>
				    			{ ' ' }{ ' ' }
				    			Add to Address Book
				    		</button>
				    	</div>
				    	<div className="modal-body">
				    		<AddressBook 
				    			pageBarVisible={false} 
				    			search3Fields={true}
				    			onDoubleClick={onDoubleClick}
				    		/>
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
				        		disabled={!allAddresses.activeAddress}
				        		className="btn btn-danger"
				        		data-dismiss="modal"
				        		onClick={selectAddress}
				        	>
				        		Select
				      		</button>
				    	</div>
				  	</div>
				</div>
			</div>
			<div
				className="modal modal-themed fade"
				data-backdrop="static"
				id="add-to-addressbook"
				tabIndex="-1"
				role="dialog"
				aria-hidden="true">
				<div className="modal-dialog">
				  	<div className="modal-content">
				  		<form role="form" onSubmit={onSubmit} autoComplete="off">
					    	<div className="modal-header">
					      		<button
					        		type="button"
					        		className="close"
					        		data-dismiss="modal"
					        		aria-hidden="true">
					      		</button>
					      		<h4 className="modal-title">Add to Address Book</h4>
					    	</div>
					    	<div className="modal-body">
					    		<div className="form-body">
		          			<div className="form-group">
		                  <label> Title </label>
		              	<div className="input-group">
		              		<span className="input-group-addon">
		                		<i className="fa fa-edit"></i>
		              		</span>
		              		<input
			            			type="text"
			            			className="form-control"
			            			required
		            				key={1}
		            				ref={inputNode}
			            			defaultValue=""
			            			placeholder="Type the address title"
			            		/>
		              	</div>
					        </div>
					      </div>
			        </div>
					    <div className="modal-footer" style={{ marginTop : '-30px' }} >
			      		<button
			      			type="button"
			      			className="btn dark btn-outline"
			      			data-dismiss="modal" >
			      			Cancel
			      		</button>
			      		<button
			        		type="submit"
			        		className="btn btn-danger">
			        		Add
			      		</button>
			    		</div>
			    	</form>
		  		</div>
				</div>
			</div>
		</div>
  )
}

AddressBookModal.propTypes = {
  addressActions: PropTypes.object.isRequired
}

export default connect(
	state => ({
		allAddresses 			: state.addressBook.allAddresses,
		shippingAddress   : state.orderPoints.entry.shippingAddress,
		billingAddress 		: state.orderPoints.entry.billingAddress
	})
)(AddressBookModal)