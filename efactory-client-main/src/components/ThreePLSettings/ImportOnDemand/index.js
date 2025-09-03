import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ImportOnDemand = props => {
  const [environment, setEnvironment] = useState('')
  const [ids, setIds] = useState('')
  const [product_group, setProduct_group] = useState('')
  
  function importClicked (event) {
    let { isRmaImport } = props
    if (!isRmaImport) {
      props.settingsActions.importOnDemand({ environment, ids, product_group }).then( resetForm ).catch( e => {} )  
    } else {
      props.settingsActions.importRmaOnDemand({ 
        environment, ids, product_group 
      }).then( resetForm ).catch( e => {} )  
    }
    
  }

  function resetForm () {
    setEnvironment('')
    setIds('')
    setProduct_group('')
  }

  function onDeliveryIdsChange (event) {
    setIds(event.target.value)
  }

  function onEnvironmentChange (event) {
    setEnvironment(event.target.value)
  }

  function onProductGroupChange (event) {
    setProduct_group(event.target.value)
  }

  function onSubmit (event) {
    event.preventDefault()
  }

  let { isRmaImport } = props
  return (
    <div>
      <div className="col-lg-10 col-md-12">
        <p style={{ marginTop: '0px' }}>
          Enter a list of "{`${isRmaImport ? "RMA Number" : "DELIVERY ID"}`}" separated by comma in the <b>{ `${ isRmaImport ? "RMA Numbers" : "Delivery IDs" }` }</b> field if you need to re-import some {`${isRmaImport ? "RMAs" : "orders"}`} or leave it blank to import any pending {`${isRmaImport ? "RMAs" : "orders"}`}.
          <br/>
          Scheduler will try to re-import these {`${isRmaImport ? "RMAs" : "orders"}`} within 10/15 minutes.
        </p>
        <form 
          role="form" autoComplete="off" className="form-horizontal"
          onSubmit={ onSubmit }
        >
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              Environment:
            </label>
            <div className="col-md-3">
              <select 
                className="form-control"
                value={ environment }
                onChange={ onEnvironmentChange }
              >
                <option value=""></option>
                <option value="PROD"> PROD </option>
                <option value="UAT"> UAT </option>
                <option value="QA"> QA </option>
                <option value="DEV"> DEV </option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              Product Group:
            </label>
            <div className="col-md-3">
              <select 
                className="form-control"
                value={ product_group }
                onChange={ onProductGroupChange }
              >
                <option value="" />
                <option value="ALL"> ALL </option>
                <option value="NORTONCORE"> NORTONCORE </option>
                <option value="YELLOWBOX"> YELLOWBOX </option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 col-sm-3 col-lg-2" style={{ marginTop : '7px' }}>
              { isRmaImport ? "RMA Numbers" : "Delivery IDs" }:
            </label>
            <div className="col-md-6">
              <textarea 
                rows="4" 
                value={ ids }
                onChange={ onDeliveryIdsChange }
                className="form-control"
              />
              <button
                disabled={ !environment.length || !product_group }
                className="btn green-soft" 
                style={{ float:'right', marginTop:'20px' }}
                onClick={ importClicked }
              >
                Import
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

ImportOnDemand.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired,
  isRmaImport: PropTypes.any
}

export default ImportOnDemand