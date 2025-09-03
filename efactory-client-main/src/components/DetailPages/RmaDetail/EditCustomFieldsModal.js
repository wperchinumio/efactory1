import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Select2React from '../../_Shared/Components/Select2React'
import ButtonLoading from '../../_Shared/Components/ButtonLoading'

const ApproveModal = ({
  invoiceActions,
  rmaDetail,
  rmaSettingsActions,
  rmaSettingsData,
}) => {
  const rmaDetailRef = useRef(null)
  rmaDetailRef.current = rmaDetail
  const [loading, setLoading] = useState(false)
  const [customFields, setCustomFields] = useState({})

  const handleModalOpening = useCallback(
    () => {
      rmaSettingsActions.readRmaSettings().then(
        ({ rmaSettingsData }) => {
          let { custom_fields = [] } = rmaDetailRef.current
          let customFieldsNext = {}
          rmaSettingsData.custom_fields.forEach( ( customField, index ) => {
            customFieldsNext[ `cf${ customField.index }` ] = custom_fields[ index ][ 'value' ]
          } )
          setCustomFields(customFieldsNext)
        }
      ).catch( error => {} )
    },
    []
  )

  useEffect(
    () => {
      global.$('#edit-custom-fields').on('show.bs.modal', handleModalOpening )
      return () => {
        global.$('#edit-custom-fields').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function createOptions () {
    let { custom_fields = [] } = rmaSettingsData
    return custom_fields.map( ( customField, cIndex ) => {
      let {
        index,
        list,
        required,
        title,
        type
      } = customField

      let listObject = {}

      if( type === 'selection' ){
        list.forEach( l => {
          if( l.includes('||') ){
            l = l.split('||')
            listObject[ l[0] ] = l[1]
          }else{
            listObject[ l ] = l
          }

        } )
      }

      let field = `cf${index}`
      let value = customFields[ field ] ? customFields[ field ] : ''

      return (
        <div
          className="col-md-12 op-review"
          key={ `custom-op-key-${index}` }
        >
          <label className={classNames({
            'control-label': true,
            'label-req' : !value && required
          })}>
            { `${title}:` }
          </label>

          <div className="">

          {
            type === 'text' ?
              <input
                type="text"
                className="form-control input-sm"
                style={{marginBottom: "4px"}}
                value={ value }
                onChange={ event => setCustomFields({ ...customFields, [ field ] : event.target.value }) }
              />
            :
              <Select2React
                className="form-control input-sm"
                style={{marginBottom: "4px"}}
                options={ listObject }
                selected={ value }
                onChangeHandler={ value => setCustomFields({ ...customFields, [ field ] : value }) }
                height="30px"
                placeholder="Select... "
              />
          }

          </div>

        </div>
      )
    } )
  }

  function editCustomFields (event) {
    // edit custom fields
    setLoading(true)
    let { rma_id } = rmaDetail.rma_header || {}
    invoiceActions.editCustomFields({
      rma_id,
      dataToUpdate : { ...customFields }
    }).then(
      ({ success }) => {
        setLoading(false)
        if( success ){
          global.$('#edit-custom-fields').modal('hide')
        }
      }
    )
  }

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="edit-custom-fields"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true">
      <div className="modal-dialog">
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
              Edit Custom Fields
            </h4>
          </div>
          <div className="modal-body" style={{marginBottom: "20px"}}>
            <div className="col-md-12" style={{ padding : '0', marginBottom:'20px' }}>
              { createOptions() }
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal">
              Cancel
            </button>&nbsp;&nbsp;

            <ButtonLoading
              className="btn green-soft"
              handleClick={ editCustomFields }
              name={'Save Changes'}
              loading={ loading }
            />
          </div>
      </div>
    </div>
   </div>
  )
}

ApproveModal.propTypes = {
  rmaSettingsActions: PropTypes.object.isRequired,
  rmaDetail: PropTypes.object.isRequired,
  invoiceActions: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    rmaSettingsData : state.returnTrak.settings.rmaSettingsData
  })
)(ApproveModal)