import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import TemplateEditors from './TemplateEditors/_Content'

const MailTemplates = props => {
  useEffect(
    () => {
      props.shipNotificationActions.readOrderTemplates()
    },
    []
  )

  function onRowClicked (event) {
    let account_number = event.currentTarget.getAttribute('data-account-number')
    let id = event.currentTarget.getAttribute('data-id')
    let index = event.currentTarget.getAttribute('data-index')
    let {
      account_number : account_number_current,
      order_templates = []
    } = props.shipNotificationState
    if (account_number_current === account_number) {
      return
    }
    let templates = order_templates[ index ]['templates']
    let active_template = templates[ 0 ]
    props.shipNotificationActions.readOrderTemplateWithParams({ account_number, id })
    props.shipNotificationActions.setRootReduxStateProp_multiple({ templates, active_template })
  }

  let { 
    shipNotificationState,
    shipNotificationActions
  } = props

  let {
    order_templates = [],
    account_number
  } = shipNotificationState

  return (      
    <section className="mail-templates-content">
      <div className="container-page-bar-fixed">
        <div className="col-md-2">
          <div className="table-responsive">
            <table className="rma-type table table-striped table-hover table-clickable">
              <thead>
                <tr className="uppercase noselect table-header-1 cart-row">
                  <th>
                    Account #:
                  </th>
                  <th className="text-center">
                    Enabled
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  order_templates.map( 
                    (
                      {
                        account_number : account_number_mapped,
                        active,
                        templates = []
                      } = {},
                      index
                    ) => {
                    let id = templates[ 0 ][ 'id' ]
                    return (
                      <tr 
                        key={ account_number_mapped }
                        className={ classNames({
                          'clickable-row' : true,
                          'active'        : account_number_mapped === account_number
                        }) }
                        onClick={ onRowClicked }
                        data-account-number={ account_number_mapped }
                        data-id={ id }
                        data-index={ index }
                      >
                        
                        <td className="title" >
                          { account_number_mapped }
                        </td>

                        <td className="counter" >
                          <i
                            className={ classNames({
                              'fa' : true,
                              'fa-circle' : active,
                              'fa-circle-o' : !active
                            }) }
                          />
                        </td>
                      </tr>
                    )
                  } ) 
                } 
              </tbody>
            </table>
          </div>
        </div>
        <TemplateEditors 
          shipNotificationState={ shipNotificationState }
          shipNotificationActions={ shipNotificationActions }
        />
      </div>
    </section>
  )
}

MailTemplates.propTypes = {
  shipNotificationState: PropTypes.object.isRequired,
  shipNotificationActions: PropTypes.object.isRequired,
}

export default MailTemplates