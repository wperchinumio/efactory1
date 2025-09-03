import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import history from '../../../history'
import ComfirmModal from '../OrderEntry/Modals/Confirm'
import TextInput from '../../_Shared/Components/TextInput'

const DraftsContentBar = props => {
	function getSelectedRow () {
  	let { selectedDraftRows, allDrafts } = props
  	let selectedRowId = Object.keys(selectedDraftRows)[0] || ''
  	return allDrafts.filter( a => +a.order_id === +selectedRowId )[0]
  }

  function setFilterInput (filterInput) {
    props.draftActions.mergeReduxStateWith({ filterInput })
  }

  let {
    filterInput,
		onDeleteClicked,
		onToggleClicked,
		onEditClicked,
		reviewActions,
		allDraftsNumber,
		allTemplatesNumber,
		deleteDisabled,
		toggleDisabled ,
		editDisabled
	} = props

  return (
		<div className="portlet-title">
			<div className="caption caption-md font-dark">
			  <i className="fa fa-location-arrow font-blue"></i>
			  <span className="caption-subject bold uppercase font-blue">
			  	Drafts: <strong className="font-dark">
			  		{ allDraftsNumber }
			  	</strong>
			  </span>
				<span className="caption-subject bold uppercase font-blue" style={{paddingLeft: "30px"}}>
			  	Templates: <strong className="font-dark">
			  		{ allTemplatesNumber }
			  	</strong>
			  </span>
			</div>
			<div className="inputs">
			  <div className="portlet-input input-inline input-large">
			    <div className="input-icon right">
			      <i className="icon-magnifier"></i>
		        <TextInput
		          value={filterInput || ''}
		          setValue={setFilterInput}
		          className="form-control input-circle"
		        />
			    </div>
			  </div>
			</div>
			<div className="actions" style={{marginRight: 15}}>
			  <div className="btn-group ">
			    <a className="btn green" href="#" data-toggle="dropdown" aria-expanded="true">
			      <i className="fa fa-cog"></i> Actions
			      <i className="fa fa-angle-down"></i>
			    </a>
			    <ul className="dropdown-menu">
			      <li>
			        <a
			          data-toggle="modal"
			          className={classNames({
			            disabledLink : deleteDisabled
			          })}
			          href="#"
			          onClick={ event => {
			          	event.preventDefault()
			          	if( !deleteDisabled ){
			          		global.$('#op-confirm-delete-confirm').modal('show')
			          	}
			          }}
			        >
			          <i className="fa fa-trash-o"></i> Delete selected </a>
			      </li>
			      <li>
			        <a
			          data-toggle="modal"
			          className={classNames({
			            disabledLink : editDisabled
			          })}
			          href="#"
			          onClick={ event => {
			          		event.preventDefault()
			          		if(!editDisabled){
			          			let template = getSelectedRow()
			          			reviewActions.readOrderFrom({
			          				order_id: template.order_id,
			          				location: template.location,
			          				fromDraft: true
			          			}).then( ({ isSuccess, message }) => {
                        if( isSuccess ){
                        	onEditClicked()
                            history.push('/orderpoints')
                        }else{
                            console.error('An error occurred after reading order from draft : ', message)
                        }
                      })
			          		}
			          	}
			          }
			        >
			          <i className="fa fa-pencil"></i>  Edit Template </a>
			      </li>
			      <li>
			        <a
			          data-toggle="modal"
			          className={classNames({ disabledLink : toggleDisabled })}
			          onClick={event => (toggleDisabled) ? event.preventDefault() : onToggleClicked()}
			          href="#">
			          <i className="fa fa-angle-right"></i>Toggle Template</a>
			      </li>
			    </ul>
			  </div>
			</div>
			<ComfirmModal
		    id="op-confirm-delete-confirm"
		    confirmationMessage="Are you sure you want to delete the selected drafts?"
		    onConfirmHandler={onDeleteClicked}
		  />
		</div>
  )
}

DraftsContentBar.propTypes = {
  name: PropTypes.string,
  onDeleteClicked: PropTypes.func.isRequired,
  draftActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    allDrafts: state.orderPoints.drafts.allDrafts,
    filterInput: state.orderPoints.drafts.filterInput,
    selectedDraftRows: state.orderPoints.drafts.selectedDraftRows,
  })
)(DraftsContentBar)