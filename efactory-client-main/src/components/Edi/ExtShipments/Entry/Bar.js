import React from 'react'
import LoadingButton from '../../../_Shared/Components/ButtonLoading'

const ExtShipmentsEntryBar = ({
  ediState,
  ediActions
}) => {
  function onNewShipmentClicked (event) {
    let { is_form_values_dirty } = ediState
    if( is_form_values_dirty ){
      global.$('#confirm-new-shipment').modal('show');  
    }else{
      ediActions.initializeGridReduxState()
      global.$('#add-shipment').modal('show');
    }
  }

  function saveDraft () {
    ediActions.updateShipment()
  }

  function placeShipment () {
    ediActions.placeShipment( false, false ).then( 
      ({ is_shipping_document_missing, is_partial }) => {
        if( is_shipping_document_missing ){
          return global.$('#confirm-missing-doc').modal('show');
        }
        if( is_partial ){
          return global.$('#confirm-place-partial-shipment').modal('show');
        }
      }
    ).catch( 
      e => {}
    )
  }

  let {
    is_new_shipment_added,
    is_form_values_dirty
  } = ediState

  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-opencart"></i> 
            { ' ' }
            <span className="sbold">
              EXT. SHIPMENTS
            </span> 
            &nbsp;
            - SHIPMENTS ENTRY
          </span>
        </div>
      </div>

      <div className="page-toolbar">
        <button
          className="btn green-soft btn-sm"
          onClick={ onNewShipmentClicked }
          type="button"
        >
          <i className="fa fa-file-o"></i>
          New Shipment
        </button>
        <span style={{ display: "inline-block", padding: "0 3px" }}>|</span>
        <LoadingButton
          className="btn btn-topbar btn-sm"
          iconClassNames="fa fa-save"
          handleClick={ saveDraft }
          name="Save Draft"
          loading={ false }
          disabled={ !is_new_shipment_added || !is_form_values_dirty }
        />
        { ' ' }
        <LoadingButton
          className="btn btn-topbar btn-sm"
          iconClassNames="fa fa-save"
          handleClick={ placeShipment }
          name="Place Shipment"
          loading={ false }
          disabled={ !is_new_shipment_added }
        />
      </div>
    </div>
  )
}

export default ExtShipmentsEntryBar