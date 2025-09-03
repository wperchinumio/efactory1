import React, { useState } from 'react'
import AddContainerModal from './AddContainerModal'
import SerialNumbersModal from './AddContainerModal/SerialNumbersModal'
import { formatNumber } from '../../../../_Helpers/FormatNumber'
import ComfirmModal from '../../../../OrderPoints/OrderEntry/Modals/Confirm'

const Containers = ({
  ediState,
  ediActions
}) => {
  const [deleteIndex, setDeleteIndex] = useState('')

  function onAddClicked (event) {
    event.preventDefault();
    ediActions.setRootReduxStateProp_multiple({
      is_edit_container : false
    }).then( () => {
      global.$('#ext-add-container').modal('show');
    } ).catch( e => {} )
  }

  function editContainerClicked (event) {
    let index = event.target.getAttribute("data-index")
    ediActions.setRootReduxStateProp_multiple({
      is_edit_container : true,
      edit_container_index : index
    }).then( () => {
      global.$('#ext-add-container').modal('show');
    } ).catch( e => {} )
  }

  function onDeleteConfirmed () {
    let {
      addedShipmentData
    } = ediState
    ediActions.setRootReduxStateProp_multiple({
      addedShipmentData : {
        ...addedShipmentData,
        cartons : [
          ...addedShipmentData.cartons.slice( 0, +deleteIndex ),
          ...addedShipmentData.cartons.slice( +deleteIndex + 1 ),
        ]   
      },
      is_form_values_dirty : true
    })
  }

  function deleteContainerClicked (event) {
    let deleteIndex = event.target.getAttribute('data-index')
    setDeleteIndex(deleteIndex)
    global.$('#carton-item-confirm-delete').modal('show');
  }

  let {
    cartons = []
  } = ediState.addedShipmentData

  return (
    <div>
      <div
        className="addr-type items-title"
        style={{height: "40px", verticalAlign: "middle", lineHeight: "33px", overflow: "hidden"}}
      >
        <div>
          <div  className="col-md-12" style={{display: "inline-block"}}>
            <div className="pull-left">
              Containers
            </div>
            <a
              className="addr-edit pull-right"
              style={{paddingLeft: "15px"}}
              tabIndex="-1"
              onClick={ onAddClicked } 
            >
              <i className="fa fa-plus"></i>&nbsp;
              Add...
            </a>
          </div>
        </div>
      </div>
      <div className="whole-table">
        <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
          <colgroup>
            <col style={{width: "160px"}}/>
            <col style={{width: "200px"}}/>
            <col style={{width: "100px"}}/>
            <col style={{width: "100px"}}/>
            <col style={{width: "110px"}}/>
            <col style={{width: "200px"}}/>
            <col />
            <col style={{width: "80px"}}/>
            <col style={{width: "7px"}}/>
          </colgroup>
          <thead>
            <tr className="uppercase noselect table-header-1 cart-row">
              <th className="text-left cart-row" style={{ paddingLeft : "15px" }}>
                Container
              </th>
              <th className="text-left" style={{ paddingLeft : "15px" }}>
                Tracking #
              </th>
              <th className="text-right">
                Weight
              </th>
              <th className="text-right">
                Freight
              </th>
              <th className="text-center">
                Dimension
              </th>
              <th className="text-center">
                Actions
              </th>
              <th className="text-left" style={{ paddingLeft : "15px" }}>
                Item / Description
              </th>
              <th className="text-right">
                Qty
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
                <col style={{width: "160px"}}/>
                <col style={{width: "200px"}}/>
                <col style={{width: "100px"}}/>
                <col style={{width: "100px"}}/>
                <col style={{width: "110px"}}/>
                <col style={{width: "200px"}}/>
                <col />
                <col style={{width: "80px"}}/>
                <col style={{width: "7px"}}/>
              </colgroup>
              <tbody>
                {
                  cartons.map( 
                    ( item, index ) => {
                      let {
                        carton_number,
                        tracking_number,
                        unit_weight,
                        freight,
                        unit_dimension,
                        items = []
                      } = item
                      return <tr key={ `carton-item-${index}` }>
                        <td className="vertical-align-top">
                          <div style={{ height: '50px', padding: '10px' }}>
                            { carton_number }
                          </div>
                        </td>
                        <td className="vertical-align-top">
                          <div style={{ height: '50px', padding: '10px' }}>
                            { tracking_number }
                          </div>
                        </td>
                        <td className="vertical-align-top text-right">
                          <div style={{ height: '50px', padding: '10px' }}>
                            { formatNumber( unit_weight, 2 ) }
                          </div>
                        </td>
                        <td className="vertical-align-top text-right">
                          <div style={{ height: '50px', padding: '10px' }}>
                            { formatNumber( freight, 2 ) }
                          </div>
                        </td>
                        <td className="text-center vertical-align-top">
                          <div style={{ height: '50px', padding: '10px' }}>
                            { unit_dimension }
                          </div>
                        </td>
                        <td className="text-center vertical-align-top">
                          <div style={{ height: '50px', padding: '10px' }}>
                            <button 
                              className="btn btn-sm grey-gallery"
                              data-index={ index }
                              onClick={ editContainerClicked }
                            >
                              Edit
                            </button> &nbsp;
                            <button 
                              className="btn btn-sm btn-danger"
                              data-index={ index }
                              onClick={ deleteContainerClicked }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="vertical-align-top">
                          {
                            items.map( ( item2, index2 ) => {
                              let {
                                item_number, 
                                description
                              } = item2
                              return <div 
                                key={ `carton-item-${index}-${index2}` }
                                style={{ height: '50px', padding: '10px' }}
                              >
                                <div style={{ fontWeight: '600', fontSize: '14px' }} >
                                  { item_number }
                                </div>
                                <div style={{ fontWeight: '400', color: '#337ab7', fontSize: '14px', marginTop:"4px" }} >
                                  { description }
                                </div>
                              </div>
                            } )
                          }
                        </td>
                        <td className="vertical-align-top">
                          {
                            items.map( ( item2, index2 ) => {

                              let {
                                quantity_in_carton
                              } = item2

                              return <div 
                                key={ `carton-item-${index}-${index2}` }
                                className="text-right" style={{ height: '50px', padding: '10px' }}
                              >
                                { quantity_in_carton }
                              </div>
                            } )
                          }
                        </td>
                      </tr>
                    } 
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddContainerModal 
        ediState={ ediState }
        ediActions={ ediActions }
      />
      <SerialNumbersModal 
        ediState={ ediState }
        ediActions={ ediActions }
      />
      <ComfirmModal
        id="carton-item-confirm-delete"
        confirmationMessage="Are you sure you want to delete this container?"
        onConfirmHandler={ onDeleteConfirmed }
      />
    </div>
  )
}

export default Containers