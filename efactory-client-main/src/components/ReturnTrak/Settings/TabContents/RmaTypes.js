import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import TableConfig from './MailTemplates/RmaTemplatesTable/TableConfig'
import classNames from 'classnames'
import TypeDispositionOptionModal from '../Modals/RMATypeDispositionOption'

const RmaTypes = props => {
  const [currentEditedOption, setCurrentEditedOption] = useState({})

  useEffect(
    () => {
      props.settingsActions.readRmaTypesDispositions()
    },
    []
  )

  function onCurrentEditedOption (currentEditedOption = {}) {
    setCurrentEditedOption(currentEditedOption)
    setTimeout( () => global.$('#rmatype_disposition_modal').modal('show'), 100 )
  }

  let {
    rma_types = [],
    dispositions = []
  } = props.rmaTypeDispositionData

  let { updatingRmaTypeDisposition, updatedRmaTypeDisposition, settingsActions } = props

  return (
    <div className="tab-pane active" id="rma_types">
      <div className="col-lg-12">
        <p>
          You can disable the RMA type or disposition you don't need or rename it at
          your convenience. Be aware that the business logic behind will not change
          if you rename any title.
        </p>
      </div>
      <div className="col-lg-5 col-md-6">
        <div className="table-responsive">
          <table className="rma-type table table-striped table-hover">
            <thead>
              <tr className="uppercase noselect table-header-1 cart-row">
                <th style={{width: "30px"}}>&nbsp;</th>
                <th style={{verticalAlign: "middle"}}>
                  RMA Type
                </th>
                <th style={{verticalAlign: "middle", textAlign: "center", width:"100px"}}>
                  IN/OUT
                </th>
                <th style={{width:"80px", textAlign: "center"}}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {
                rma_types.map( r => {
                  let {
                    code,
                    title,
                    show,
                    original_title
                  } = r
                  return (
                    <tr key={`rma-type-key-${code}`} >
                      <td>
                        <i className={ classNames({
                          'fa font-blue-soft' : true,
                          'fa-square-o': !show,
                          'fa-check-square-o': show
                        }) }></i>
                      </td>
                      <td
                        className={ classNames({
                          'title' : true,
                          'text-muted' : !show
                        }) }
                      >
                        <span className="rma"> { code }  </span>: { show ? title : original_title }
                      </td>
                      <td className="in-out">
                        <i
                          className={ classNames({
                            'fa fa-arrow-down' : true,
                            'font-red-soft' : TableConfig[ code ][1][0],
                            'font-grey' : !TableConfig[ code ][1][0]
                          }) }
                        />
                        { ' ' }
                        <i
                          className={ classNames({
                            'fa fa-arrow-up' : true,
                            'font-blue-soft' : TableConfig[ code ][1][1],
                            'font-grey' : !TableConfig[ code ][1][1]
                          }) }
                        />
                      </td>
                      <td style={{textAlign: "center"}}>
                        <button
                          className="btn grey-gallery btn-xs"
                          type="button"
                          onClick={ event => onCurrentEditedOption(r) }
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                } )
              }
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-lg-5 col-md-6">
        <div className="table-responsive">
          <table className="rma-type table table-striped table-hover">
            <thead>
              <tr className="uppercase noselect table-header-1 cart-row">
                <th style={{width: "30px"}}>&nbsp;</th>
                <th style={{verticalAlign: "middle"}}>Disposition</th>
                <th style={{width:"80px", textAlign: "center"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                dispositions.map( d => {
                  let {
                    code,
                    title,
                    show,
                    original_title
                  } = d

                  return (
                    <tr key={`rma-disp-key-${code}`} >
                      <td>
                        <i className={ classNames({
                          'fa font-blue-soft' : true,
                          'fa-square-o': !show,
                          'fa-check-square-o': show
                        }) }></i>
                      </td>
                      <td
                        className={ classNames({
                          'title' : true,
                          'text-muted' : !show
                        })
                      }>
                      <span className="rma"> { code }  </span>: { show ? title : original_title }
                      </td>
                      <td style={{textAlign: "center"}}>
                        <button
                          className="btn grey-gallery btn-xs"
                          type="button"
                          onClick={ event => onCurrentEditedOption(d) }
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
        </div>
      </div>
      <TypeDispositionOptionModal
        currentEditedOption={ currentEditedOption }
        updatingRmaTypeDisposition={ updatingRmaTypeDisposition }
        updatedRmaTypeDisposition={ updatedRmaTypeDisposition }
        settingsActions={settingsActions}
      />
    </div>
  )
}

export default connect(
  state => ({
    rmaTypeDispositionData : state.returnTrak.settings.rmaTypeDispositionData,
    updatingRmaTypeDisposition : state.returnTrak.settings.updatingRmaTypeDisposition,
    updatedRmaTypeDisposition : state.returnTrak.settings.updatedRmaTypeDisposition
  })
)(RmaTypes)