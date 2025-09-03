import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import RmaEditOptionModal from '../Modals/RmaEditOption'

const EmailSettings = props => {
  useEffect(
    () => {
      props.settingsActions.readCustomFields()
    },
    []
  )

  function readCustomField (index) {
    props.settingsActions.setActiveCustomFieldIndex({ index })
  }

  let {
    customFields = [],
    activeCustomFieldData = {},
    settingsActions,
    updatingCustomField,
    updatedCustomField
  } = props

  return (
    <div className="tab-pane active" id="custom_options">
      <div className="col-lg-6">
        <p>At your convenience, you can define up to 7 custom fields that will show at the RMA Entry page.</p>
        <div className="table-responsive">
          <table className="rma-type table table-striped table-hover">
            <thead>
            <tr className="uppercase noselect table-header-1 cart-row">
              <th style={{verticalAlign: "right", width:"50px"}}>#</th>
              <th style={{verticalAlign: "middle"}}>Title</th>
              <th style={{textAlign: "center", width:"100px"}}>Type</th>
              <th style={{verticalAlign: "middle", textAlign: "center", width:"100px"}}>Required</th>
              <th style={{width: "80px", textAlign: "center"}}>Actions</th>
            </tr>
            </thead>
            <tbody>
              {
                customFields.map( ( c, i ) => {
                  let {
                    index,
                    title,
                    type,
                    required,
                    show
                  } = c
                  return (
                    <tr
                      className={ classNames({
                        'not-used': !show,
                        'middle': true
                      }) }
                      key={`rma-custom-${i}`}
                    >
                      <td>{ index }
                        <i className={ classNames({
                          'fa font-blue-soft': true,
                          'pull-right': true,
                          'fa-square-o': !show,
                          'fa-check-square-o': show
                        }) }></i></td>
                      <td
                        className={ classNames({
                          'text-muted': !show
                        }) }
                      >
                       { title ? title : 'Available Field' }
                      </td>
                      <td className="icon">
                        <i className={ classNames({
                          'fa' : true,
                          'fa-edit' : type === 'text',
                          'fa-list-ul' : type === 'selection',
                          'invisible' : !show
                        }) }/>
                      </td>
                      <td className="counter">
                        <span
                          className={ classNames({
                            'invisible' : !show
                          }) }
                        >
                          { required ? 'Y' : '' }
                        </span>
                      </td>
                      <td style={{textAlign: "center"}}>
                        <button
                          className="btn grey-gallery btn-xs"
                          type="button"
                          data-toggle="modal"
                          href="#edit_option_modal"
                          onClick={ event => readCustomField(index) }
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <RmaEditOptionModal
            activeCustomFieldData={activeCustomFieldData}
            settingsActions={settingsActions}
            updatingCustomField={updatingCustomField}
            updatedCustomField={updatedCustomField}
          />
        </div>
      </div>
    </div>
  )
}

EmailSettings.propTypes = {
  activeCustomFieldData: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired,
  customFields: PropTypes.array.isRequired
}

export default connect(
  state => ({
    customFields : state.returnTrak.settings.customFields,
    activeCustomFieldData : state.returnTrak.settings.activeCustomFieldData,
    updatingCustomField : state.returnTrak.settings.updatingCustomField,
    updatedCustomField : state.returnTrak.settings.updatedCustomField,
  })
)(EmailSettings)