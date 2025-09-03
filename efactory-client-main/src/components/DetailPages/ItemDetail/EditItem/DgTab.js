import React from 'react'
import PropTypes from 'prop-types'

const DgTab = ({
  detailActions,
  dgData,
  editItemData,
}) => {
  function onFieldInputChange (event) {
    detailActions.setRootReduxStateProp({
      field : 'editItemData',
      value : {
        ...editItemData,
        dg : {
          ...editItemData.dg,
          [event.target.name] : event.target.value
        }
      }
    })
  }

  let {
    li_b_cat = '',
    li_b_conf = '',
    li_t_type = '',
    cell_rp = '',
    unit_innerc = '',
    unit_masterc = '',
    wh_cell = '',
    net_wh = '',
  } = dgData

  return (
     <div className="tab-pane active">
      <div className="col-md-12 item-edit">
        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Lithium Battery Category:</label>
          <div className="col-md-4">
            <select
              className="form-control"
              name='li_b_cat'
              value={ li_b_cat ? li_b_cat : '' }
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

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Lithium Battery Configuration:</label>
          <div className="col-md-4">
            <select
              className="form-control"
              name='li_b_conf'
              value={ li_b_conf ? li_b_conf : '' }
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

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Lithium Battery Type:</label>
          <div className="col-md-4">
            <select
              className="form-control"
              name='li_t_type'
              value={ li_t_type ? li_t_type : '' }
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


        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Cell/Batt. Per Retail Pack.:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='cell_rp'
              value={ cell_rp ? cell_rp : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">

          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Retail Units Per Inner Carton:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='unit_innerc'
              value={ unit_innerc ? unit_innerc : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">

          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Retail Units Per Master Carton:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='unit_masterc'
              value={ unit_masterc ? unit_masterc : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">

          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Watt/Hour Per Cell/Battery (&lt;=):</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='wh_cell'
              value={ wh_cell ? wh_cell : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">

          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Net Wgt of Lithium Battery (g):</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='net_wh'
              value={ net_wh ? net_wh : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">

          </div>
        </div>

      </div>
    </div>
  )
}

DgTab.propTypes = {
  dgData        : PropTypes.object,
  editItemData  : PropTypes.object,
  detailActions : PropTypes.object
}

export default DgTab
