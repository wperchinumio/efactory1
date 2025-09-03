import React from 'react'
import PropTypes from 'prop-types'

const EdiTab = ({
  detailActions,
  editItemData,
  ediData,
}) => {
  function onFieldInputChange (event) {
    let name  = event.target.name
    let index = name.slice(-1)
    detailActions.setRootReduxStateProp({
      field : 'editItemData',
      value : {
        ...editItemData,
        edi : [
          ...editItemData.edi.slice(0,index),
          {
            tp          : editItemData.edi[ index ][ 'tp' ],
            item_number : event.target.value
          },
          ...editItemData.edi.slice( +index + 1 )
        ]
      }
    })
  }

  return (
    <div className="tab-pane active" id="edi">
      <div className="col-md-12 item-edit">
        <div className="form-group">
          <label className="col-md-3 control-label label-12 label-edit"><u>TRADING PARTNER</u></label>
          <div className="col-md-4">
            <label className="control-label label-12 label-edit"><u>BUYER ITEM #</u></label>
          </div>
          <div className="col-md-5 help-block label-12">

          </div>
        </div>

        {
          ediData.map( (data,index) => {
            return (
              <div className="form-group" key={`edi-key-${index}`}>
                <label className="col-md-3 control-label label-12 label-edit">{ data.tp }:</label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name={ `edi-${index}` }
                    value={ data.item_number ? data.item_number : '' }
                    onChange={ onFieldInputChange }
                  />
                </div>
                <div className="col-md-5 help-block label-12">

                </div>
              </div>
            )
          } )
        }

      </div>
    </div>
  )
}

EdiTab.propTypes = {
  ediData: PropTypes.array,
  editItemData: PropTypes.object,
  detailActions: PropTypes.object
}

export default EdiTab