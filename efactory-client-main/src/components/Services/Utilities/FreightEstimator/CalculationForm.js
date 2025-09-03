import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'
import warehouses from './Warehouses'

const OthersMain = props => {
  function onFormFieldChange (field, value) {
    let { freightEstimatorActions, formData, activeTab } = props
    if (!['warehouse','residential'].includes(field)) {
      value = value.trim()
      if (isNaN(value))  {
        return
      }
    }
    freightEstimatorActions.setRootReduxStateProp({
      field: 'formData',
      value: {
        ...formData,
        [activeTab]: {
          ...formData[activeTab],
          [field]: value
        }
      }
    })
  }

  function onCalculateClicked () {
    props.freightEstimatorActions.calculateFreight()
  }

  function resetForm () {
    props.freightEstimatorActions.initializeFormData()
  }

  let { activeTab, formData, loading } = props
  formData = formData[ activeTab ]
  let {
    warehouse = '',
    zip_code = '',
    weight = '',
    pieces = '',
    length = '',
    width = '',
    height = '',
    residential = false
  } = formData

  return (
    <td className="freight-input">
      <form role="form" autoComplete="off">
        <div className="form-body">
          <section className="freight">SHIP FROM</section>
          <div className="form-group freight" style={{paddingLeft: "10px"}}>
            <label className="req">
              Warehouse:
            </label>
            <select
              className="form-control"
              value={ warehouse ? warehouse : '' }
              onChange={ event => onFormFieldChange('warehouse',event.target.value) }
            >
              <option value=""></option>
              {
                Object.keys(warehouses).map( (warehouseKey, index) => {
                  let warehouseDesc = warehouses[ warehouseKey ]
                  return (
                    <option value={warehouseKey} key={`warehouse-option-${index}`}>
                      { warehouseDesc }
                    </option>
                  )
                })
              }
            </select>
          </div>
          <section className="freight">SHIP TO</section>
          <div className="form-group freight" style={{paddingLeft: "10px"}}>
            <label className="req">
              ZIP Code:
            </label>
            <input
              type="text"
              value={ zip_code ? zip_code : '' }
              onChange={ event => onFormFieldChange('zip_code',event.target.value) }
              className="form-control"
            />
          </div>
          <section className="freight">
            { `${activeTab === 'freight' ? 'PALLET' : 'PACKAGE'} DETAIL` }
          </section>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group freight" style={{paddingLeft: "10px"}}>
                <label className="req">
                  { `${activeTab === 'freight' ? 'Total' : 'Package'} Weight (lb):` }
                </label>
                <input
                  type="text"
                  value={ weight ? weight : '' }
                  onChange={ event => onFormFieldChange('weight',event.target.value) }
                  className="form-control"
                />
              </div>
            </div>
            {
              activeTab !== 'freight' &&
              <div className="col-md-6">
                <div className="form-group freight" style={{paddingLeft: "10px"}}>

                  <label className="sh-label req">
                    { `No of  ${activeTab === 'freight' ? 'Pallets' : 'Packages'}:` }
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ pieces ? pieces : '' }
                    onChange={ event => onFormFieldChange('pieces',event.target.value) }
                  />
                </div>
              </div>
            }
          </div>
          {
            activeTab !== 'freight' &&
            <div className="form-group freight" style={{paddingLeft: "10px"}}>
              <div className="row">
                <div className="col-md-4">
                  <label>
                    Length (in):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ length ? length : '' }
                    onChange={ event => onFormFieldChange('length',event.target.value) }
                  />
                </div>
                <div className="col-md-4">
                  <label>
                    Width (in):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ width ? width : '' }
                    onChange={ event => onFormFieldChange('width',event.target.value) }
                  />
                </div>
                <div className="col-md-4">
                  <label>
                    Height (in):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ height ? height : '' }
                    onChange={ event => onFormFieldChange('height',event.target.value) }
                  />
                </div>
              </div>
            </div>
          }
          {
            activeTab !== 'freight' &&
            <div>
              <section className="freight">DESTINATION TYPE</section>
              <div className="form-group freight" style={{paddingLeft: "10px"}}>
                <label className="mt-checkbox mt-checkbox-outline" style={{marginRight:'25px',marginTop : '15px'}}>
                  <input
                    type="checkbox"
                    checked={ residential }
                    onChange={ event => onFormFieldChange('residential',event.target.checked) }
                  />
                  Residential Address
                  <span></span>
                </label>
              </div>
            </div>
          }
          <span>
            <button
              type="button"
              className="btn light btn-outline"
              onClick={ event => resetForm() }
            >
              RESET
            </button>
          </span>
          <ButtonLoading
            className="btn dark pull-right"
            iconClassName="fa fa-calculator"
            handleClick={ event => onCalculateClicked() }
            name={'Calculate'}
            loading={loading}
          />
        </div>
      </form>
    </td>
  )
}

OthersMain.propTypes = {
  freightEstimatorActions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
}

export default connect(
  state => ({
    activeTab : state.services.utilities.freightEstimator.activeTab,
    formData : state.services.utilities.freightEstimator.formData,
    loading : state.services.utilities.freightEstimator.loading
  })
)(OthersMain)