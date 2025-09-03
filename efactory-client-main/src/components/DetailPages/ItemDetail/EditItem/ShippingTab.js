import React from 'react'
import PropTypes from 'prop-types'

const ShippingTab = ({
  editItemData,
  detailActions,
  shippingData,
}) => {
  function onFieldInputChange (event) {
    detailActions.setRootReduxStateProp({
      field : 'editItemData',
      value : {
        ...editItemData,
        shipping : {
          ...editItemData.shipping,
          [event.target.name] : event.target.value
        }
      }
    })
  }

  let {
    upc = '',
    weight = '',
    dimension = '',
    serial_no = '',
    serial_format = '',
    //lot_format = ''
  } = shippingData

  return (

    <div className="tab-pane active">
      <div className="col-md-12 item-edit">
        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">UPC:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='upc'
              value={ upc ? upc : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">
            Universal Product Code
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Weight:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='weight'
              value={ weight ? weight : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">
            Weight single unit in lb
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Dimension:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name='dimension'
              value={ dimension ? dimension : '' }
              onChange={ onFieldInputChange }
            />
          </div>
          <div className="col-md-5 help-block label-12">
            Format: LxWxH &nbsp;&nbsp;&nbsp;(<strong>Example:</strong> 12x6x4)
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Serial/Lot #:</label>
          <div className="col-md-4">
            <select
              className="form-control"
              name='serial_no'
              value={ serial_no ? serial_no : '' }
              onChange={ onFieldInputChange }
            >
              <option value="0">No serial / No Lot</option>
              <option value="1">Serialized (1 serial #)</option>
              <option value="2">Serialized (2 serial #)</option>
              <option value="99">Lot # (with verification)</option>
              <option value="90">Lot # (capture only)</option>
              <option value="91">Lot # and Serial #</option>
              <option value="98">FIFO</option>
            </select>
          </div>

          <div className="col-md-5 help-block label-12">
            Define if product is serialized or has lot number
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit">Serial # Format:</label>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              readOnly="readOnly"
              value={`${serial_format ? serial_format : '' }`  }
              onChange={ e => {} }
            />
          </div>
          <div className="col-md-5 help-block label-12">
            Display the format set up in our system (read only)
          </div>
        </div>

      </div>
    </div>
  )
}

ShippingTab.propTypes = {
  shippingData: PropTypes.shape({
    upc           : PropTypes.any,
    weight        : PropTypes.any,
    dimension     : PropTypes.any,
    serial_no     : PropTypes.any,
    serial_format : PropTypes.any,
    lot_format    : PropTypes.any
  }),
  detailActions : PropTypes.object.isRequired,
  editItemData  : PropTypes.object.isRequired
}

export default ShippingTab