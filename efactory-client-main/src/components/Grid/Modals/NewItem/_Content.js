import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const NewItemModal = props => {
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const handleModalOpening = useCallback(
    () => {
      global.$(".draggable-modal").css({ top : '0px', left : '0px' })
    },
    []
  )

  useEffect(
    () => {
      global.$('#new-item').on('show.bs.modal', handleModalOpening )
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      return () => {
        global.$('#new-item').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function onFieldInputChange (event) {
    let { dg_data, gridActions } = props
    gridActions.setRootReduxStateProp('dg_data',{
      ...dg_data,
      [event.target.name]: event.target.value
    })
  }

  function saveChangesThisWh () {
    setLoading2(true)
    props.gridActions.postDGData( false ).then( ({ success }) => {
      setLoading2(false)
      if( success ){
        global.$('#new-item').modal('hide')
      }
    } )
  }

  function saveChangesAllWh () {
    setLoading1(true)
    props.gridActions.postDGData( true ).then( ({ success }) => {
      setLoading1(false)
      if( success ){
        global.$('#new-item').modal('hide')
      }
    } )
  }

  let {
    dg_data = {}
  } = props

  let {
    item_number = '',
    description = '',
    account_wh = '',
    battery_category = '',
    battery_configuration = '',
    battery_type = '',
    qty_per_package = '',
    units_per_carton = '',
    units_per_master_carton = '',
    battery_spec_quantity = '',
    //battery_spec_unit_of_measure = '',
    net_weight_in_grams = ''
  } = dg_data

  return (
    <div
      className="modal modal-themed fade draggable-modal"
      id="new-item"
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
              New Item
            </h4>
          </div>

          <div className="modal-body" style={{marginBottom: "20px"}}>
            <form role="form" autoComplete="off">
            <div style={{ padding: '20px 10px' }}>
              <table style={{width: "100%"}}>
                <tbody>
                <tr>
                  <td style={{width:"130px", verticalAlign:"top"}}>
                    <span style={{fontWeight: 600}}>Item #: </span>
                  </td>
                  <td>
                    <span className="text-primary">{ item_number }<br/><i className="text-muted">{ description }</i></span>
                  </td>
                </tr>
                <tr><td colSpan="4">&nbsp;</td></tr>
                <tr>
                  <td>
                    <span style={{fontWeight: 600}}>Account # - WH:</span>
                  </td>
                  <td>
                    <span> { account_wh }</span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="item-edit">
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Lithium Battery Category:</label>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    name='battery_category'
                    value={ battery_category ? battery_category : '' }
                    onChange={ onFieldInputChange }
                  >
                    <option value=""></option>
                    <option value="ION">Ion</option>
                    <option value="MTL">Metal</option>
                  </select>
                </div>
                <div className="col-md-5 help-block label-12">
                    Ion or Metal type
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Lithium Battery Configuration:</label>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    name='battery_configuration'
                    value={ battery_configuration ? battery_configuration : '' }
                    onChange={ onFieldInputChange }
                  >
                    <option value=""></option>
                    <option value="PCK">Packed with Product</option>
                    <option value="CNT">Contained in Product</option>
                    <option value="SKU">Battery SKU Only</option>
                  </select>
                </div>
                <div className="col-md-5 help-block label-12">
                    Describe where the lithium is stored in the product.
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Lithium Battery Type:</label>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    name='battery_type'
                    value={ battery_type ? battery_type : '' }
                    onChange={ onFieldInputChange }
                  >
                    <option value=""></option>
                    <option value="CBT">CBT - Button</option>
                    <option value="CCN">CCN - Cell</option>
                    <option value="BTT">BTT - Battery</option>
                  </select>
                </div>
                <div className="col-md-5 help-block label-12">
                  Type of battery
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Cell/Batt. Per Retail Pack.:</label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name='qty_per_package'
                    value={ qty_per_package ? qty_per_package : '' }
                    onChange={ onFieldInputChange }
                  />
                </div>
                <div className="col-md-5 help-block label-12">
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Retail Units Per Inner Carton:</label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name='units_per_carton'
                    value={ units_per_carton ? units_per_carton : '' }
                    onChange={ onFieldInputChange }
                  />
                </div>
                <div className="col-md-5 help-block label-12">
                </div>
              </div>

              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Retail Units Per Master Carton:</label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name='units_per_master_carton'
                    value={ units_per_master_carton ? units_per_master_carton : '' }
                    onChange={ onFieldInputChange }
                  />
                </div>
                <div className="col-md-5 help-block label-12">
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Watt/Hour Per Cell/Battery (&lt;=):</label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name='battery_spec_quantity'
                    value={ battery_spec_quantity ? battery_spec_quantity : '' }
                    onChange={ onFieldInputChange }
                  />
                </div>
                <div className="col-md-5 help-block label-12">
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3 control-label label-12 label-edit">Net Wgt of Lithium Battery (g):</label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name='net_weight_in_grams'
                    value={ net_weight_in_grams ? net_weight_in_grams : '' }
                    onChange={ onFieldInputChange }
                  />
                </div>
                <div className="col-md-5 help-block label-12">
                </div>
              </div>
            </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal">
              Cancel
            </button>&nbsp;&nbsp;

            <ButtonLoading
              className="btn red-soft"
              handleClick={ saveChangesAllWh }
              name={'Save Changes all WHs'}
              loading={ loading1 }
            />&nbsp;&nbsp;

            <ButtonLoading
              className="btn green-soft"
              handleClick={ saveChangesThisWh }
              name={'Save Changes this WH'}
              loading={ loading2 }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

NewItemModal.propTypes = {
  dg_data  : PropTypes.shape({
  item_number   : PropTypes.any,
  description   : PropTypes.any,
  account_wh      : PropTypes.any,
  battery_category      : PropTypes.any,
  battery_configuration     : PropTypes.any,
  battery_type      : PropTypes.any,
  qty_per_package     : PropTypes.any,
  units_per_carton      : PropTypes.any,
  units_per_master_carton     : PropTypes.any,
  battery_spec_quantity     : PropTypes.any,
  battery_spec_unit_of_measure      : PropTypes.any,
  net_weight_in_grams     : PropTypes.any,
  }).isRequired,
  gridActions : PropTypes.object.isRequired
}

export default connect(
  state => ({
    dg_data : state.grid.dg_data,
  }),
  dispatch => ({

  })
)(NewItemModal)
