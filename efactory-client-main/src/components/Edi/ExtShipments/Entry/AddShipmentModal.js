import React, { useCallback, useRef, useState, useEffect } from 'react'
import { getUserData } from '../../../../util/storageHelperFuncs'

const AddShipmentModal = ({
	ediActions,
}) => {
	const orderNumberNode = useRef(null)
	const accounts = getUserData('calc_accounts')

	const [orderNumber, setOrderNumber] = useState('')
	const [accountNumber, setAccountNumber] = useState('')

	const handleModalOpening = useCallback(
		() => {
			setOrderNumber('')
			setAccountNumber('')
		},
		[]
	)

	useEffect(
		() => {
			global.$('#add-shipment').on('show.bs.modal', handleModalOpening )
			return () => {
				global.$('#add-shipment').off('show.bs.modal', handleModalOpening )
			}
		},
		[]
	)

	function onAddClicked (event) {
  	ediActions.addShipment(orderNumber, accountNumber).then(
  		() => {
  			global.$('#add-shipment').modal('hide')
  		}
  	).catch( e => {} )
  }

  function onOrderNumberChanged (event) {
  	setOrderNumber(event.target.value)
  }

	function onAccountNumberChanged (event) {
		setAccountNumber(event.target.value)
		setTimeout( () => {
			orderNumberNode.current.focus()
		}, 50 )
	}

	return (
    <div
			className="modal modal-themed fade"
			data-backdrop="static"
			id="add-shipment"
			tabIndex="-1"
			role="dialog"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-md">
		  	<div className="modal-content">
		    	<div className="modal-header">
	      		<button
	        		type="button"
	        		className="close"
	        		data-dismiss="modal"
	        		aria-hidden="true">
	      		</button>
	      		<h4 className="modal-title">Add Shipment</h4>
		    	</div>
		    	<div className="modal-body" style={{ margin: "10px" }}>
		    		<div className="text-muted" style={{ marginTop: '-10px', marginBottom: '10px' }}>
	      			Please select the account # and the order # you want to add a shipment record.
	      		</div>
    				<div className="form-group padding-5" style={{marginBottom: "3px"}}>
		          <div className="row">
		            <div className="col-md-6">
		              <label className="control-label" >
		                Account #:
		              </label>
		              <select
		              	className="form-control input-sm"
		              	value={ accountNumber }
		                onChange={ onAccountNumberChanged }
		              >
		              	<option value=""></option>
		              	{
		              		accounts.map( ( account, index ) => {
		              			return <option key={`account${index}`} value={account}> { account } </option>
		              		} )
		              	}
		              </select>
		            </div>
			        </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="control-label" >
                    Order #:
                  </label>
                  <input
                    type="text"
                    className="form-control input-sm uppercase"
                    value={ orderNumber }
                    onChange={ onOrderNumberChanged }
                    ref={ orderNumberNode }
                  />
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
	        		disabled={ !( orderNumber.trim().length && accountNumber.trim().length ) }
	        		onClick={ onAddClicked }
	        	>
        			Add
	      		</button>
		    	</div>
		  	</div>
			</div>
		</div>
  )
}

export default AddShipmentModal