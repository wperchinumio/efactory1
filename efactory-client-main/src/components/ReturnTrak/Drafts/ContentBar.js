import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import ComfirmModal from '../../OrderPoints/OrderEntry/Modals/Confirm'

const DraftsContentBar = props => {
  function removeCheckedDrafts () {
    let { checkedDrafts, filteredDrafts } = props
    let { allChecked, checkedDraftIds } = checkedDrafts
    let draft_ids = []
    if( allChecked ){
      filteredDrafts.forEach( f => { draft_ids.push( f.rma_id ) } )
    }else{
      filteredDrafts = filteredDrafts.filter( f => checkedDraftIds[ f.rma_id ] )
      filteredDrafts.forEach( f => { draft_ids.push( f.rma_id ) } )
    }
    props.draftActions.deleteDrafts( draft_ids )
  }

  function onFilterInputChange (value) {
    let { setRootReduxStateProp } = props.draftActions
    setRootReduxStateProp({ field : 'checkedDrafts', value : { 
      allChecked: false,
      checkedDraftIds: {}
    } })
    setRootReduxStateProp({ field : 'filterValue', value })
  }

  let { checkedDrafts, totalDrafts } = props
  let { allChecked, checkedDraftIds } = checkedDrafts

  let deleteDisabled = 
    !allChecked && !Object.keys(checkedDraftIds).filter( key => checkedDraftIds[key] ? true : false ).length

  return (
    <div className="portlet-title">
      <div className="caption caption-md font-dark">
        <i className="fa fa-location-arrow font-blue"/>
        <span className="caption-subject bold uppercase font-blue">
          Total drafts:
          { ' ' }
          <strong className="font-dark">
            { totalDrafts }
          </strong>
        </span>
      </div>
      <div className="inputs">
        <div className="portlet-input input-inline input-large">
          <div className="input-icon right">
            <i className="icon-magnifier"/>
            <input
              type="text"
              className="form-control input-circle"
              onChange={ event => onFilterInputChange( event.target.value ) }
            />
          </div>
        </div>
      </div>
      <div className="actions" style={{marginRight: 15}}>
        <div className="btn-group ">
          <a className="btn green" href="#" data-toggle="dropdown" aria-expanded="true">
            <i className="fa fa-cog"/> Actions
            <i className="fa fa-angle-down"/>
          </a>
          <ul className="dropdown-menu">
            <li>
              <a
                data-toggle="modal"
                className={classNames({
                  disabledLink : deleteDisabled
                })}
                onClick={ event => {
                  event.preventDefault()
                  if( !deleteDisabled ){
                    global.$('#rma-confirm-delete-confirm').modal('show')
                  }
                } }
              >
                <i className="fa fa-trash-o"/>
                Delete selected
              </a>
            </li>
          </ul>
        </div>
      </div>
      <ComfirmModal
        id="rma-confirm-delete-confirm"
        confirmationMessage="Are you sure you want to delete the selected drafts?"
        onConfirmHandler={ removeCheckedDrafts }
      />
    </div>
  )
}

DraftsContentBar.propTypes = {
  checkedDrafts: PropTypes.shape({
    allChecked: PropTypes.bool.isRequired,
    checkedDraftIds: PropTypes.object.isRequired
  }),
  draftActions: PropTypes.object.isRequired,
  filteredDrafts: PropTypes.array.isRequired,
  totalDrafts: PropTypes.any.isRequired
}

export default connect(
  state => ({
    checkedDrafts : state.returnTrak.draft.checkedDrafts,
  })
)(DraftsContentBar)