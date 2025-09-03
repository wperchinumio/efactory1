import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select2React from './Select2React'

const labels = {
  address1: 'Address 1:',
  address2: 'Address 2:',
  city: 'City:',
  state_province: 'State:',
  postal_code: 'Postal Code:'
}

const ValidateAddress = props => {
  const handleModalOpening = useCallback(
    () => {
      global.$(".draggable-modal").css({ top: '0px', left: '0px' })
    },
    []
  )

  useEffect(
    () => {
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      global.$(`#${props.id}`).on('show.bs.modal', handleModalOpening)
      return () => {
        global.$(`#${props.id}`).off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function handleFieldChange (event, field) {
    props.onCorrectAddressFieldChange(event,field)
  }

  let { 
    enteredAddr, 
    correctAddr,
    onAccept,
    states, 
    errors, 
    warnings, 
    id 
  } = props

  if (correctAddr) {
    delete correctAddr['country']
  }

  return (
    <div 
      className="modal modal-themed fade draggable-modal" 
      id={id}
      tabIndex="-1" 
      data-backdrop="static"
      role="dialog" 
      aria-labelledby="exampleModalLabel" 
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title" id="exampleModalLabel">Address validation</h4>
          </div>
          <div className="modal-body">
            <p>
              The address verification program has suggested an update to the address you entered. Please
              <span>{ ' ' }</span><strong>Accept</strong> the updated address, or
              <span>{ ' ' }</span><strong>Cancel</strong> to return to the previous page.
            </p>
            <div className="row">
              <div className="col-md-6">
                <h4 className="font-yellow bold">Address As-Entered</h4>
                {
                  Object.keys(enteredAddr).map( addrField => {
                    let value = enteredAddr[ addrField ]
                    return addrField === 'state_province' ?   
                    (
                      <div className="form-group" key={`entered-${addrField}`} style={{margin: '0', marginBottom : '15px'}}>
                        <label className="form-control-label">State:</label>
                        
                        <Select2React 
                          options={ states }
                          selected={ value ? value : '' }
                          isoFormat={true}
                          disabled={true}
                          height={'30px'}
                          onChangeHandler={ value => {} }
                        />
                      </div>

                    )
                    :
                    (
                      <InputField 
                        key={`entered-${addrField}`}
                        value={value}
                        label={ labels[ addrField ] }
                        disabled={true}
                        onChange={ event => {} }
                      />
                    ) 
                  } ) 
                }
              </div>
              <div className="col-md-6">
                <h4 className="font-yellow bold">Updated Address</h4>
                {
                  Object.keys(correctAddr).map( addrField => {
                    let value = correctAddr[ addrField ]
                    return addrField === 'state_province' ?   
                    (
                      <div className="form-group" key={`entered-${addrField}`} style={{margin: '0', marginBottom : '15px'}}>
                        <label className="form-control-label">State:</label>
                        <Select2React 
                          options={ states }
                          selected={ value ? value : '' }
                          isoFormat={true}
                          height={'30px'}
                          onChangeHandler={ value => handleFieldChange( { target : { value } }, 'state_province' ) }
                        />
                      </div>

                    )
                    :
                    (
                      <InputField 
                        key={`entered-${addrField}`}
                        value={value}
                        label={ labels[ addrField ] }
                        disabled={false}
                        onChange={ event => handleFieldChange(event, addrField) }
                      />
                    ) 
                  } ) 
                }
              </div>
            </div>
            <p className="font-red-soft bold">
              { errors || ''}
            </p>
            <p className="font-yellow-soft bold">
              { warnings || ''}
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              Cancel
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              disabled={ errors || false  }
              onClick={ event => {
                if (!errors) {
                  onAccept(event) 
                  global.$(`#${id}`).modal('hide')
                }
              }  }
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField ({label, value, disabled = false, onChange}) {
  return (
    <div className="form-group" style={{margin: '0', marginBottom : '15px'}}>
      <label className="form-control-label">{label}</label>
      <input 
        type="text" 
        className="form-control" 
        disabled={disabled}
        value={ value || '' }
        onChange={onChange}
      />
    </div>
  )
}

ValidateAddress.propTypes = {
  name: PropTypes.string,
  enteredAddr: PropTypes.object.isRequired,
  correctAddr: PropTypes.object.isRequired,
  states: PropTypes.object.isRequired,
  errors: PropTypes.string.isRequired,
  warnings: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onCorrectAddressFieldChange: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired
}

export default ValidateAddress