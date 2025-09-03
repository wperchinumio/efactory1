import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const TabsBar = props => {
  const [placeRmaDisabled, setPlaceRmaDisabled] = useState(false)
  const placeRmaDisabledRef = useRef(null)

  function onNewRmaClicked (event) {
    if (props.dirty) {
      global.$('#confirm-goto-order').modal('show')
    }else{
      props.rmaEntryActions.createNewRma()
    }
  }

  function onSaveDraftClicked (event) {
    props.rmaEntryActions.saveEntry({ is_draft: true })
  }

  function onPlaceRmaClicked (event) {
    if (placeRmaDisabledRef.current) {
      return
    }
    setPlaceRmaDisabled(true)
    placeRmaDisabledRef.current = true
    props.rmaEntryActions.saveEntry({ is_draft : false }).then(
      () => {
        setPlaceRmaDisabled(false)
        placeRmaDisabledRef.current = false
      }
    ).catch( 
      error => {
        setPlaceRmaDisabled(false)
        placeRmaDisabledRef.current = false
      }
    )
  }

  let { dirty, entryPageType } = props
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-opencart"></i>
            { ' ' }
            <span className="sbold">RETURNTRAK</span>
              { ' ' } - RMA ENTRY
            </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button
          className="btn green-soft btn-sm"
          type="button"
          onClick={ onNewRmaClicked }
        >
          <i className="fa fa-file-o"></i>
          NEW RMA
        </button>
        <span style={{display: "inline-block", padding: "0 3px"}} >|</span>
        {
          entryPageType !== 'edit_rma' &&
          <button 
            className="btn btn-topbar btn-sm" 
            type="button"
            disabled={ !dirty }
            onClick={ onSaveDraftClicked }
          >
            <i className="fa fa-save"></i>
            { entryPageType === 'new_rma' ? 'SAVE DRAFT' : 'UPDATE DRAFT' } 
          </button>  
        }
        { ' ' }
        <button 
          className="btn btn-topbar btn-sm" 
          type="button" 
          disabled={ placeRmaDisabled || entryPageType === 'new_rma' ? !dirty : false }
          onClick={ onPlaceRmaClicked }
        >
          <i className="fa fa-cloud-upload"></i>
          PLACE RMA
        </button>
      </div>
    </div>
  )
}

TabsBar.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired,
  entryPageType: PropTypes.oneOf([ 'new_rma', 'edit_rma', 'edit_draft' ]) 
}

export default connect(
  state => ({
    dirty : state.returnTrak.entry.dirty,
    entryPageType : state.returnTrak.entry.entryPageType
  })
)(TabsBar)